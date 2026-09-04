import { c as createServerRpc } from "./createServerRpc-D-AYw99j.mjs";
import { a as createServerFn } from "./server-BomfFVcN.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-dN1VnyDc.mjs";
import { supabaseAdmin } from "./client.server-IqT0ZZNy.mjs";
import { A as Anthropic } from "../_libs/anthropic-ai__sdk.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "node:fs/promises";
import "node:fs";
import "node:path";
import "node:child_process";
import "node:crypto";
import "node:readline";
import "../_libs/standardwebhooks.mjs";
import "../_libs/stablelib__base64.mjs";
import "../_libs/fast-sha256.mjs";
import "node:util";
import "node:stream/promises";
async function fetchYouTubePage(url) {
  const res = await fetch(url, {
    headers: {
      Referer: "https://learn.dcpracticegrowth.com"
    }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`YouTube API error ${res.status}: ${text}`);
  }
  return res.json();
}
async function fetchPlaylistVideos(playlistId, apiKey, opts) {
  const videos = [];
  let pageToken = "";
  const publishedAfterMs = opts.publishedAfter ? new Date(opts.publishedAfter).getTime() : 0;
  do {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${encodeURIComponent(playlistId)}&key=${encodeURIComponent(apiKey)}` + (pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : "");
    const data = await fetchYouTubePage(url);
    for (const item of data.items ?? []) {
      const sn = item.snippet;
      const videoId = sn?.resourceId?.videoId;
      if (!videoId) continue;
      if (sn.title === "Deleted video" || sn.title === "Private video") continue;
      const publishedAt = sn.publishedAt ?? (/* @__PURE__ */ new Date()).toISOString();
      if (publishedAfterMs && new Date(publishedAt).getTime() < publishedAfterMs) continue;
      videos.push({
        videoId,
        title: sn.title ?? "",
        description: sn.description ?? "",
        thumbnailUrl: sn.thumbnails?.maxres?.url ?? sn.thumbnails?.high?.url ?? sn.thumbnails?.medium?.url ?? sn.thumbnails?.default?.url ?? "",
        publishedAt
      });
      if (videos.length >= opts.maxResults) break;
    }
    if (videos.length >= opts.maxResults) break;
    pageToken = data.nextPageToken ?? "";
  } while (pageToken);
  return videos.reverse().slice(0, opts.maxResults);
}
async function getUploadsPlaylistId(channelId, apiKey) {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${encodeURIComponent(channelId)}&key=${encodeURIComponent(apiKey)}`;
  const data = await fetchYouTubePage(url);
  const uploadsId = data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsId) throw new Error(`Channel "${channelId}" not found or has no uploads playlist`);
  return uploadsId;
}
async function assignCategory(title, description, categories) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || categories.length === 0) return null;
    const client = new Anthropic({
      apiKey
    });
    const categoryList = categories.map((c) => `- ${c.name} (id: ${c.id})`).join("\n");
    const msg = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 256,
      messages: [{
        role: "user",
        content: `You are categorising a chiropractic education video for DC Practice Growth.

Video title: ${title}
Video description (first 500 chars): ${description.slice(0, 500)}

Available categories:
${categoryList}

Reply with ONLY the category id that best fits this video. If none fit, reply with the word "null".`
      }]
    });
    const raw = msg.content[0]?.type === "text" ? msg.content[0].text.trim() : null;
    if (!raw || raw.toLowerCase() === "null") return null;
    const match = categories.find((c) => c.id === raw);
    return match ? match.id : null;
  } catch (err) {
    console.warn(`[YT Sync] Category assignment failed for "${title}":`, err.message);
    return null;
  }
}
async function insertVideos(videos, categories) {
  const result = {
    imported: 0,
    skipped: 0,
    videos: []
  };
  for (let i = 0; i < videos.length; i++) {
    const v = videos[i];
    console.log(`[YT Sync] Processing ${i + 1}/${videos.length}: ${v.title}`);
    try {
      const {
        data: existing
      } = await supabaseAdmin.from("content").select("id").eq("youtube_video_id", v.videoId).maybeSingle();
      if (existing) {
        result.skipped++;
        result.videos.push({
          videoId: v.videoId,
          title: v.title,
          action: "skipped",
          reason: "duplicate"
        });
        continue;
      }
      const categoryId = await assignCategory(v.title, v.description, categories);
      const {
        error
      } = await supabaseAdmin.from("content").insert({
        title: v.title,
        description: v.description || null,
        video_url: `https://www.youtube.com/watch?v=${v.videoId}`,
        youtube_video_id: v.videoId,
        thumbnail_url: v.thumbnailUrl || null,
        category_id: categoryId,
        content_type: "video",
        display_author_name: "Dr Ryan Rieder",
        status: "draft",
        published_at: null
      });
      if (error) {
        console.error(`[YT Sync] DB insert failed for ${v.videoId}:`, error.message);
        result.skipped++;
        result.videos.push({
          videoId: v.videoId,
          title: v.title,
          action: "skipped",
          reason: error.message
        });
      } else {
        result.imported++;
        result.videos.push({
          videoId: v.videoId,
          title: v.title,
          action: "imported"
        });
      }
    } catch (err) {
      console.error(`[YT Sync] Unexpected error for ${v.videoId}:`, err.message);
      result.skipped++;
      result.videos.push({
        videoId: v.videoId,
        title: v.title,
        action: "skipped",
        reason: err.message
      });
    }
  }
  return result;
}
const syncYouTubeChannel_createServerFn_handler = createServerRpc({
  id: "f39fea9a3640ebcc37121656a0c70737a227069f1bed2e22290b5ebf7fa3edf4",
  name: "syncYouTubeChannel",
  filename: "src/lib/youtube-sync.functions.ts"
}, (opts) => syncYouTubeChannel.__executeServer(opts));
const syncYouTubeChannel = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((d) => d).handler(syncYouTubeChannel_createServerFn_handler, async ({
  data
}) => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YOUTUBE_API_KEY environment variable is not set");
  const opts = {
    maxResults: data.maxResults ?? 50,
    publishedAfter: data.publishedAfter || void 0
  };
  const {
    data: cats
  } = await supabaseAdmin.from("categories").select("id, name").order("order");
  const categories = cats ?? [];
  const uploadsPlaylistId = await getUploadsPlaylistId(data.channelId, apiKey);
  const videos = await fetchPlaylistVideos(uploadsPlaylistId, apiKey, opts);
  return insertVideos(videos, categories);
});
const syncYouTubePlaylist_createServerFn_handler = createServerRpc({
  id: "8d132d3f419e70820af80d91bd0061ebf09e297bc39957bc78a345c233e22f6f",
  name: "syncYouTubePlaylist",
  filename: "src/lib/youtube-sync.functions.ts"
}, (opts) => syncYouTubePlaylist.__executeServer(opts));
const syncYouTubePlaylist = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((d) => d).handler(syncYouTubePlaylist_createServerFn_handler, async ({
  data
}) => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YOUTUBE_API_KEY environment variable is not set");
  const opts = {
    maxResults: data.maxResults ?? 50,
    publishedAfter: data.publishedAfter || void 0
  };
  const {
    data: cats
  } = await supabaseAdmin.from("categories").select("id, name").order("order");
  const categories = cats ?? [];
  const videos = await fetchPlaylistVideos(data.playlistId, apiKey, opts);
  return insertVideos(videos, categories);
});
export {
  syncYouTubeChannel_createServerFn_handler,
  syncYouTubePlaylist_createServerFn_handler
};
