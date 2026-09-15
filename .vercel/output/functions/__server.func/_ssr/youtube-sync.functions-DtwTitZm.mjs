import { c as createServerRpc } from "./createServerRpc-_iw5yyfy.mjs";
import { a as createServerFn } from "./server-DAhjTOZR.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CINWQ1Vb.mjs";
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
async function getOrCreateFallbackCategory() {
  const fallbackName = "Chiropractic Teaching";
  const {
    data: existing
  } = await supabaseAdmin.from("categories").select("id").eq("name", fallbackName).maybeSingle();
  if (existing) return existing.id;
  const {
    data: created,
    error
  } = await supabaseAdmin.from("categories").insert({
    name: fallbackName,
    slug: "chiropractic-teaching",
    order: 999
  }).select("id").single();
  if (error || !created) throw new Error(`Could not create fallback category: ${error?.message}`);
  return created.id;
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
async function insertVideos(videos, categories, forceUpdate = false) {
  const result = {
    imported: 0,
    updated: 0,
    skipped: 0,
    videos: []
  };
  for (let i = 0; i < videos.length; i++) {
    const v = videos[i];
    console.log(`[YT Sync] Processing ${i + 1}/${videos.length}: ${v.title}`);
    try {
      let existingId = null;
      const {
        data: byVideoId
      } = await supabaseAdmin.from("content").select("id").eq("youtube_video_id", v.videoId).maybeSingle();
      if (byVideoId) {
        existingId = byVideoId.id;
      } else {
        const {
          data: byTitle
        } = await supabaseAdmin.from("content").select("id").eq("title", v.title).is("youtube_video_id", null).maybeSingle();
        if (byTitle) existingId = byTitle.id;
      }
      if (existingId) {
        if (!forceUpdate) {
          result.skipped++;
          result.videos.push({
            videoId: v.videoId,
            title: v.title,
            action: "skipped",
            reason: "duplicate"
          });
          continue;
        }
        const {
          error: updateErr
        } = await supabaseAdmin.from("content").update({
          video_url: `https://www.youtube.com/watch?v=${v.videoId}`,
          youtube_video_id: v.videoId,
          thumbnail_url: v.thumbnailUrl || null
        }).eq("id", existingId);
        if (updateErr) {
          console.error(`[YT Sync] Update failed for ${v.videoId}:`, updateErr.message);
          result.skipped++;
          result.videos.push({
            videoId: v.videoId,
            title: v.title,
            action: "skipped",
            reason: updateErr.message
          });
        } else {
          result.updated++;
          result.videos.push({
            videoId: v.videoId,
            title: v.title,
            action: "updated"
          });
        }
        continue;
      }
      const aiCategoryId = await assignCategory(v.title, v.description, categories);
      const categoryId = aiCategoryId ?? await getOrCreateFallbackCategory();
      const {
        error
      } = await supabaseAdmin.from("content").insert({
        title: v.title,
        description: v.description ? v.description.slice(0, 2e3) : null,
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
  return insertVideos(videos, categories, data.forceUpdate ?? false);
});
async function fetchPlaylistMetadata(playlistId, apiKey) {
  const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${encodeURIComponent(playlistId)}&key=${encodeURIComponent(apiKey)}`;
  const data = await fetchYouTubePage(url);
  const snippet = data.items?.[0]?.snippet;
  if (!snippet) throw new Error(`Playlist "${playlistId}" not found`);
  return {
    title: snippet.title ?? playlistId,
    description: snippet.description ?? ""
  };
}
async function createCourseFromPlaylist(videos, categories, playlistMeta, courseTitle, userId) {
  const title = courseTitle?.trim() || playlistMeta.title;
  const thumbnail = videos[0]?.thumbnailUrl || null;
  const aiCategoryId = await assignCategory(title, playlistMeta.description, categories);
  const categoryId = aiCategoryId ?? await getOrCreateFallbackCategory();
  const {
    data: courseRow,
    error: courseErr
  } = await supabaseAdmin.from("courses").insert({
    title,
    description: playlistMeta.description || null,
    thumbnail_url: thumbnail,
    category_id: categoryId,
    display_author_name: "Dr Ryan Rieder",
    status: "draft",
    author_id: userId
  }).select("id").single();
  if (courseErr || !courseRow) {
    throw new Error(`Failed to create course: ${courseErr?.message}`);
  }
  const courseId = courseRow.id;
  const {
    data: moduleRow,
    error: moduleErr
  } = await supabaseAdmin.from("course_modules").insert({
    course_id: courseId,
    title: "Module 1",
    description: null,
    order_index: 0
  }).select("id").single();
  if (moduleErr || !moduleRow) {
    throw new Error(`Failed to create module: ${moduleErr?.message}`);
  }
  const moduleId = moduleRow.id;
  let lessonsCreated = 0;
  for (let i = 0; i < videos.length; i++) {
    const v = videos[i];
    const {
      error: lessonErr
    } = await supabaseAdmin.from("course_lessons").insert({
      module_id: moduleId,
      course_id: courseId,
      title: v.title,
      description: v.description ? v.description.slice(0, 2e3) : null,
      content_type: "video",
      video_url: `https://www.youtube.com/watch?v=${v.videoId}`,
      pdf_url: null,
      text_content: null,
      order_index: i
    });
    if (lessonErr) {
      console.error(`[YT Sync] Failed to create lesson for ${v.videoId}:`, lessonErr.message);
    } else {
      lessonsCreated++;
    }
  }
  return {
    courseId,
    courseTitle: title,
    lessonsCreated
  };
}
async function fetchChannelPlaylists(channelId, apiKey) {
  const playlists = [];
  let pageToken = "";
  do {
    const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&channelId=${encodeURIComponent(channelId)}&maxResults=50&key=${encodeURIComponent(apiKey)}` + (pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : "");
    const data = await fetchYouTubePage(url);
    for (const item of data.items ?? []) {
      const sn = item.snippet;
      const count = item.contentDetails?.itemCount ?? 0;
      if (!sn || count === 0) continue;
      playlists.push({
        playlistId: item.id,
        title: sn.title ?? item.id,
        description: sn.description ?? "",
        itemCount: count
      });
    }
    pageToken = data.nextPageToken ?? "";
  } while (pageToken);
  return playlists;
}
const syncAllYouTubeChannelPlaylists_createServerFn_handler = createServerRpc({
  id: "050f3859c4feb51275ebcb1d6ae4d56a2da3cbb43beac63d7d1bf7ebfbd710b4",
  name: "syncAllYouTubeChannelPlaylists",
  filename: "src/lib/youtube-sync.functions.ts"
}, (opts) => syncAllYouTubeChannelPlaylists.__executeServer(opts));
const syncAllYouTubeChannelPlaylists = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((d) => d).handler(syncAllYouTubeChannelPlaylists_createServerFn_handler, async ({
  data,
  context
}) => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YOUTUBE_API_KEY environment variable is not set");
  const userId = context.userId;
  const {
    data: cats
  } = await supabaseAdmin.from("categories").select("id, name").order("order");
  const categories = cats ?? [];
  const maxVideosPerPlaylist = data.maxVideosPerPlaylist ?? 200;
  const opts = {
    maxResults: maxVideosPerPlaylist
  };
  const playlists = await fetchChannelPlaylists(data.channelId, apiKey);
  if (playlists.length === 0) {
    return {
      coursesCreated: 0,
      lessonsImported: 0,
      skipped: 0,
      total: 0,
      results: []
    };
  }
  const existingCourses = await supabaseAdmin.from("courses").select("title");
  const existingTitles = new Set((existingCourses.data ?? []).map((c) => c.title.trim().toLowerCase()));
  const results = [];
  let coursesCreated = 0;
  let lessonsImported = 0;
  let skipped = 0;
  for (let i = 0; i < playlists.length; i++) {
    const pl = playlists[i];
    console.log(`[YT Sync All] Processing playlist ${i + 1}/${playlists.length}: ${pl.title}`);
    if (existingTitles.has(pl.title.trim().toLowerCase())) {
      console.log(`[YT Sync All] Skipping "${pl.title}" — course already exists`);
      results.push({
        playlistId: pl.playlistId,
        playlistTitle: pl.title,
        action: "skipped",
        reason: "course already exists"
      });
      skipped++;
      continue;
    }
    try {
      const videos = await fetchPlaylistVideos(pl.playlistId, apiKey, opts);
      if (videos.length === 0) {
        results.push({
          playlistId: pl.playlistId,
          playlistTitle: pl.title,
          action: "skipped",
          reason: "no accessible videos"
        });
        skipped++;
        continue;
      }
      const courseResult = await createCourseFromPlaylist(videos, categories, {
        title: pl.title,
        description: pl.description
      }, void 0, userId);
      existingTitles.add(courseResult.courseTitle.trim().toLowerCase());
      results.push({
        playlistId: pl.playlistId,
        playlistTitle: pl.title,
        action: "created",
        courseTitle: courseResult.courseTitle,
        lessonsCreated: courseResult.lessonsCreated
      });
      coursesCreated++;
      lessonsImported += courseResult.lessonsCreated;
    } catch (err) {
      console.error(`[YT Sync All] Failed for playlist "${pl.title}":`, err.message);
      results.push({
        playlistId: pl.playlistId,
        playlistTitle: pl.title,
        action: "skipped",
        reason: err.message
      });
      skipped++;
    }
  }
  return {
    coursesCreated,
    lessonsImported,
    skipped,
    total: playlists.length,
    results
  };
});
const syncYouTubePlaylist_createServerFn_handler = createServerRpc({
  id: "8d132d3f419e70820af80d91bd0061ebf09e297bc39957bc78a345c233e22f6f",
  name: "syncYouTubePlaylist",
  filename: "src/lib/youtube-sync.functions.ts"
}, (opts) => syncYouTubePlaylist.__executeServer(opts));
const syncYouTubePlaylist = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((d) => d).handler(syncYouTubePlaylist_createServerFn_handler, async ({
  data,
  context
}) => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YOUTUBE_API_KEY environment variable is not set");
  const userId = context.userId;
  const opts = {
    maxResults: data.maxResults ?? 50,
    publishedAfter: data.publishedAfter || void 0
  };
  const {
    data: cats
  } = await supabaseAdmin.from("categories").select("id, name").order("order");
  const categories = cats ?? [];
  const [playlistMeta, videos] = await Promise.all([fetchPlaylistMetadata(data.playlistId, apiKey), fetchPlaylistVideos(data.playlistId, apiKey, opts)]);
  return createCourseFromPlaylist(videos, categories, playlistMeta, data.courseTitle, userId);
});
export {
  syncAllYouTubeChannelPlaylists_createServerFn_handler,
  syncYouTubeChannel_createServerFn_handler,
  syncYouTubePlaylist_createServerFn_handler
};
