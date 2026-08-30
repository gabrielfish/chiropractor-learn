import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import Anthropic from "@anthropic-ai/sdk";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
}

interface SyncResult {
  imported: number;
  skipped: number;
  videos: { videoId: string; title: string; action: "imported" | "skipped"; reason?: string }[];
}

interface SyncOptions {
  maxResults: number;
  publishedAfter?: string; // ISO date string, e.g. "2024-01-01"
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchYouTubePage(url: string): Promise<any> {
  const res = await fetch(url, { headers: { Referer: "https://learn.dcpracticegrowth.com" } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`YouTube API error ${res.status}: ${text}`);
  }
  return res.json();
}

/**
 * Fetch up to `maxResults` videos from a playlist, newest first.
 * Playlist items API doesn't support publishedAfter natively, so we filter client-side.
 */
async function fetchPlaylistVideos(
  playlistId: string,
  apiKey: string,
  opts: SyncOptions
): Promise<YouTubeVideo[]> {
  const videos: YouTubeVideo[] = [];
  let pageToken = "";
  const publishedAfterMs = opts.publishedAfter ? new Date(opts.publishedAfter).getTime() : 0;

  do {
    const url =
      `https://www.googleapis.com/youtube/v3/playlistItems` +
      `?part=snippet&maxResults=50&playlistId=${encodeURIComponent(playlistId)}` +
      `&key=${encodeURIComponent(apiKey)}` +
      (pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : "");

    const data = await fetchYouTubePage(url);

    for (const item of data.items ?? []) {
      const sn = item.snippet;
      const videoId = sn?.resourceId?.videoId;
      if (!videoId) continue;
      if (sn.title === "Deleted video" || sn.title === "Private video") continue;

      const publishedAt: string = sn.publishedAt ?? new Date().toISOString();

      // Apply publishedAfter filter
      if (publishedAfterMs && new Date(publishedAt).getTime() < publishedAfterMs) continue;

      videos.push({
        videoId,
        title: sn.title ?? "",
        description: sn.description ?? "",
        thumbnailUrl:
          sn.thumbnails?.maxres?.url ??
          sn.thumbnails?.high?.url ??
          sn.thumbnails?.medium?.url ??
          sn.thumbnails?.default?.url ??
          "",
        publishedAt,
      });

      if (videos.length >= opts.maxResults) break;
    }

    if (videos.length >= opts.maxResults) break;
    pageToken = data.nextPageToken ?? "";
  } while (pageToken);

  // Playlist API returns oldest-first by default; reverse to get newest first
  return videos.reverse().slice(0, opts.maxResults);
}

async function getUploadsPlaylistId(channelId: string, apiKey: string): Promise<string> {
  const url =
    `https://www.googleapis.com/youtube/v3/channels` +
    `?part=contentDetails&id=${encodeURIComponent(channelId)}&key=${encodeURIComponent(apiKey)}`;
  const data = await fetchYouTubePage(url);
  const uploadsId = data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsId) throw new Error(`Channel "${channelId}" not found or has no uploads playlist`);
  return uploadsId;
}

/** Use Claude to pick the best matching category. Returns null on any error — never throws. */
async function assignCategory(
  title: string,
  description: string,
  categories: { id: string; name: string }[]
): Promise<string | null> {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || categories.length === 0) return null;

    const client = new Anthropic({ apiKey });
    const categoryList = categories.map((c) => `- ${c.name} (id: ${c.id})`).join("\n");

    const msg = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content:
            `You are categorising a chiropractic education video for DC Practice Growth.\n\n` +
            `Video title: ${title}\n` +
            `Video description (first 500 chars): ${description.slice(0, 500)}\n\n` +
            `Available categories:\n${categoryList}\n\n` +
            `Reply with ONLY the category id that best fits this video. ` +
            `If none fit, reply with the word "null".`,
        },
      ],
    });

    const raw = msg.content[0]?.type === "text" ? msg.content[0].text.trim() : null;
    if (!raw || raw.toLowerCase() === "null") return null;
    const match = categories.find((c) => c.id === raw);
    return match ? match.id : null;
  } catch (err) {
    console.warn(`[YT Sync] Category assignment failed for "${title}":`, (err as Error).message);
    return null;
  }
}

/** Insert videos one by one, skipping duplicates and individual failures. Never throws. */
async function insertVideos(
  videos: YouTubeVideo[],
  categories: { id: string; name: string }[]
): Promise<SyncResult> {
  const result: SyncResult = { imported: 0, skipped: 0, videos: [] };

  for (let i = 0; i < videos.length; i++) {
    const v = videos[i];
    console.log(`[YT Sync] Processing ${i + 1}/${videos.length}: ${v.title}`);

    try {
      // Check duplicate
      const { data: existing } = await supabaseAdmin
        .from("content")
        .select("id")
        .eq("youtube_video_id", v.videoId)
        .maybeSingle();

      if (existing) {
        result.skipped++;
        result.videos.push({ videoId: v.videoId, title: v.title, action: "skipped", reason: "duplicate" });
        continue;
      }

      // Category assignment — gracefully returns null on failure
      const categoryId = await assignCategory(v.title, v.description, categories);

      const { error } = await supabaseAdmin.from("content").insert({
        title: v.title,
        description: v.description || null,
        video_url: `https://www.youtube.com/watch?v=${v.videoId}`,
        youtube_video_id: v.videoId,
        thumbnail_url: v.thumbnailUrl || null,
        category_id: categoryId,
        content_type: "video",
        display_author_name: "Dr Ryan Rieder",
        status: "draft",
        published_at: null,
      });

      if (error) {
        console.error(`[YT Sync] DB insert failed for ${v.videoId}:`, error.message);
        result.skipped++;
        result.videos.push({ videoId: v.videoId, title: v.title, action: "skipped", reason: error.message });
      } else {
        result.imported++;
        result.videos.push({ videoId: v.videoId, title: v.title, action: "imported" });
      }
    } catch (err) {
      console.error(`[YT Sync] Unexpected error for ${v.videoId}:`, (err as Error).message);
      result.skipped++;
      result.videos.push({ videoId: v.videoId, title: v.title, action: "skipped", reason: (err as Error).message });
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Server functions
// ---------------------------------------------------------------------------

export const syncYouTubeChannel = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: { channelId: string; maxResults?: number; publishedAfter?: string }) => d)
  .handler(async ({ data }) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) throw new Error("YOUTUBE_API_KEY environment variable is not set");

    const opts: SyncOptions = {
      maxResults: data.maxResults ?? 50,
      publishedAfter: data.publishedAfter || undefined,
    };

    const { data: cats } = await supabaseAdmin
      .from("categories")
      .select("id, name")
      .order("order");
    const categories = (cats ?? []) as { id: string; name: string }[];

    const uploadsPlaylistId = await getUploadsPlaylistId(data.channelId, apiKey);
    const videos = await fetchPlaylistVideos(uploadsPlaylistId, apiKey, opts);
    return insertVideos(videos, categories);
  });

export const syncYouTubePlaylist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: { playlistId: string; maxResults?: number; publishedAfter?: string }) => d)
  .handler(async ({ data }) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) throw new Error("YOUTUBE_API_KEY environment variable is not set");

    const opts: SyncOptions = {
      maxResults: data.maxResults ?? 50,
      publishedAfter: data.publishedAfter || undefined,
    };

    const { data: cats } = await supabaseAdmin
      .from("categories")
      .select("id, name")
      .order("order");
    const categories = (cats ?? []) as { id: string; name: string }[];

    const videos = await fetchPlaylistVideos(data.playlistId, apiKey, opts);
    return insertVideos(videos, categories);
  });
