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

/** Get or create a "Chiropractic Teaching" fallback category. Returns its id. */
async function getOrCreateFallbackCategory(): Promise<string> {
  const fallbackName = "Chiropractic Teaching";

  const { data: existing } = await supabaseAdmin
    .from("categories")
    .select("id")
    .eq("name", fallbackName)
    .maybeSingle();

  if (existing) return (existing as { id: string }).id;

  const { data: created, error } = await supabaseAdmin
    .from("categories")
    .insert({ name: fallbackName, slug: "chiropractic-teaching", order: 999 })
    .select("id")
    .single();

  if (error || !created) throw new Error(`Could not create fallback category: ${error?.message}`);
  return (created as { id: string }).id;
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

      // Category assignment — falls back to "Chiropractic Teaching" if AI returns null
      const aiCategoryId = await assignCategory(v.title, v.description, categories);
      const categoryId = aiCategoryId ?? await getOrCreateFallbackCategory();

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

interface CourseResult {
  courseId: string;
  courseTitle: string;
  lessonsCreated: number;
}

async function fetchPlaylistMetadata(
  playlistId: string,
  apiKey: string
): Promise<{ title: string; description: string }> {
  const url =
    `https://www.googleapis.com/youtube/v3/playlists` +
    `?part=snippet&id=${encodeURIComponent(playlistId)}&key=${encodeURIComponent(apiKey)}`;
  const data = await fetchYouTubePage(url);
  const snippet = data.items?.[0]?.snippet;
  if (!snippet) throw new Error(`Playlist "${playlistId}" not found`);
  return { title: snippet.title ?? playlistId, description: snippet.description ?? "" };
}

async function createCourseFromPlaylist(
  videos: YouTubeVideo[],
  categories: { id: string; name: string }[],
  playlistMeta: { title: string; description: string },
  courseTitle: string | undefined,
  userId: string
): Promise<CourseResult> {
  const title = courseTitle?.trim() || playlistMeta.title;
  const thumbnail = videos[0]?.thumbnailUrl || null;

  // Assign category — falls back to "Chiropractic Teaching" if AI returns null
  const aiCategoryId = await assignCategory(title, playlistMeta.description, categories);
  const categoryId = aiCategoryId ?? await getOrCreateFallbackCategory();

  // Create course
  const { data: courseRow, error: courseErr } = await supabaseAdmin
    .from("courses")
    .insert({
      title,
      description: playlistMeta.description || null,
      thumbnail_url: thumbnail,
      category_id: categoryId,
      display_author_name: "Dr Ryan Rieder",
      status: "draft",
      author_id: userId,
    } as Record<string, unknown>)
    .select("id")
    .single();

  if (courseErr || !courseRow) {
    throw new Error(`Failed to create course: ${courseErr?.message}`);
  }

  const courseId = (courseRow as { id: string }).id;

  // Create one module for the playlist
  const { data: moduleRow, error: moduleErr } = await supabaseAdmin
    .from("course_modules")
    .insert({
      course_id: courseId,
      title: "Module 1",
      description: null,
      order_index: 0,
    } as Record<string, unknown>)
    .select("id")
    .single();

  if (moduleErr || !moduleRow) {
    throw new Error(`Failed to create module: ${moduleErr?.message}`);
  }

  const moduleId = (moduleRow as { id: string }).id;

  // Create lessons for each video
  let lessonsCreated = 0;
  for (let i = 0; i < videos.length; i++) {
    const v = videos[i];
    const { error: lessonErr } = await supabaseAdmin
      .from("course_lessons")
      .insert({
        module_id: moduleId,
        course_id: courseId,
        title: v.title,
        description: v.description || null,
        content_type: "video",
        video_url: `https://www.youtube.com/watch?v=${v.videoId}`,
        pdf_url: null,
        text_content: null,
        order_index: i,
      } as Record<string, unknown>);

    if (lessonErr) {
      console.error(`[YT Sync] Failed to create lesson for ${v.videoId}:`, lessonErr.message);
    } else {
      lessonsCreated++;
    }
  }

  return { courseId, courseTitle: title, lessonsCreated };
}

/** Fetch all playlists belonging to a channel (not the auto-generated uploads playlist). */
async function fetchChannelPlaylists(
  channelId: string,
  apiKey: string
): Promise<{ playlistId: string; title: string; description: string; itemCount: number }[]> {
  const playlists: { playlistId: string; title: string; description: string; itemCount: number }[] = [];
  let pageToken = "";

  do {
    const url =
      `https://www.googleapis.com/youtube/v3/playlists` +
      `?part=snippet,contentDetails&channelId=${encodeURIComponent(channelId)}&maxResults=50` +
      `&key=${encodeURIComponent(apiKey)}` +
      (pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : "");

    const data = await fetchYouTubePage(url);

    for (const item of data.items ?? []) {
      const sn = item.snippet;
      const count = item.contentDetails?.itemCount ?? 0;
      if (!sn || count === 0) continue; // skip empty playlists
      playlists.push({
        playlistId: item.id,
        title: sn.title ?? item.id,
        description: sn.description ?? "",
        itemCount: count,
      });
    }

    pageToken = data.nextPageToken ?? "";
  } while (pageToken);

  return playlists;
}

export const syncAllYouTubeChannelPlaylists = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (d: { channelId: string; maxVideosPerPlaylist?: number }) => d
  )
  .handler(async ({ data, context }) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) throw new Error("YOUTUBE_API_KEY environment variable is not set");

    const userId = (context as { userId: string }).userId;

    const { data: cats } = await supabaseAdmin
      .from("categories")
      .select("id, name")
      .order("order");
    const categories = (cats ?? []) as { id: string; name: string }[];

    const maxVideosPerPlaylist = data.maxVideosPerPlaylist ?? 200;
    const opts: SyncOptions = { maxResults: maxVideosPerPlaylist };

    // Fetch all playlists for the channel
    const playlists = await fetchChannelPlaylists(data.channelId, apiKey);
    if (playlists.length === 0) {
      return { coursesCreated: 0, lessonsImported: 0, skipped: 0, total: 0, results: [] };
    }

    // Fetch existing course titles to avoid duplicates
    const existingCourses = (await (supabaseAdmin as any)
      .from("courses")
      .select("title")) as { data: { title: string }[] | null };
    const existingTitles = new Set(
      (existingCourses.data ?? []).map((c) => c.title.trim().toLowerCase())
    );

    const results: { playlistId: string; playlistTitle: string; action: "created" | "skipped"; courseTitle?: string; lessonsCreated?: number; reason?: string }[] = [];
    let coursesCreated = 0;
    let lessonsImported = 0;
    let skipped = 0;

    for (let i = 0; i < playlists.length; i++) {
      const pl = playlists[i];
      console.log(`[YT Sync All] Processing playlist ${i + 1}/${playlists.length}: ${pl.title}`);

      // Skip if a course with this title already exists
      if (existingTitles.has(pl.title.trim().toLowerCase())) {
        console.log(`[YT Sync All] Skipping "${pl.title}" — course already exists`);
        results.push({ playlistId: pl.playlistId, playlistTitle: pl.title, action: "skipped", reason: "course already exists" });
        skipped++;
        continue;
      }

      try {
        const videos = await fetchPlaylistVideos(pl.playlistId, apiKey, opts);
        if (videos.length === 0) {
          results.push({ playlistId: pl.playlistId, playlistTitle: pl.title, action: "skipped", reason: "no accessible videos" });
          skipped++;
          continue;
        }

        const courseResult = await createCourseFromPlaylist(
          videos,
          categories,
          { title: pl.title, description: pl.description },
          undefined,
          userId
        );

        // Add to known titles so we don't duplicate within this same run
        existingTitles.add(courseResult.courseTitle.trim().toLowerCase());

        results.push({
          playlistId: pl.playlistId,
          playlistTitle: pl.title,
          action: "created",
          courseTitle: courseResult.courseTitle,
          lessonsCreated: courseResult.lessonsCreated,
        });
        coursesCreated++;
        lessonsImported += courseResult.lessonsCreated;
      } catch (err) {
        console.error(`[YT Sync All] Failed for playlist "${pl.title}":`, (err as Error).message);
        results.push({ playlistId: pl.playlistId, playlistTitle: pl.title, action: "skipped", reason: (err as Error).message });
        skipped++;
      }
    }

    return { coursesCreated, lessonsImported, skipped, total: playlists.length, results };
  });

export const syncYouTubePlaylist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (d: { playlistId: string; maxResults?: number; publishedAfter?: string; courseTitle?: string }) => d
  )
  .handler(async ({ data, context }) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) throw new Error("YOUTUBE_API_KEY environment variable is not set");

    const userId = (context as { userId: string }).userId;

    const opts: SyncOptions = {
      maxResults: data.maxResults ?? 50,
      publishedAfter: data.publishedAfter || undefined,
    };

    const { data: cats } = await supabaseAdmin
      .from("categories")
      .select("id, name")
      .order("order");
    const categories = (cats ?? []) as { id: string; name: string }[];

    const [playlistMeta, videos] = await Promise.all([
      fetchPlaylistMetadata(data.playlistId, apiKey),
      fetchPlaylistVideos(data.playlistId, apiKey, opts),
    ]);

    return createCourseFromPlaylist(videos, categories, playlistMeta, data.courseTitle, userId);
  });
