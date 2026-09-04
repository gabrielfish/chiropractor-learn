import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createClient } from "@supabase/supabase-js";
import { algoliasearch } from "algoliasearch";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { YoutubeTranscript } from "youtube-transcript";
import { z } from "zod";
import { createWriteStream, createReadStream, unlinkSync, existsSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { pipeline } from "stream/promises";
import type { IncomingMessage, ServerResponse } from "http";

// ---------------------------------------------------------------------------
// Config — all values from environment, never hardcoded
// ---------------------------------------------------------------------------

const MCP_API_KEY = process.env.MCP_API_KEY ?? "";
const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID ?? "";
const ALGOLIA_SEARCH_KEY = process.env.ALGOLIA_SEARCH_KEY ?? "";
const ALGOLIA_INDEX = process.env.ALGOLIA_INDEX_NAME ?? "dcpg_content";
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY ?? "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "";
const MCP_PUBLIC_URL = process.env.MCP_PUBLIC_URL ?? "https://dcpg-mcp-server.vercel.app";

const ALLOWED_ORIGINS = new Set([
  "https://claude.ai",
  "https://learn.dcpracticegrowth.com",
  "https://www.dcpracticegrowth.com",
]);

type AccessLevel = "admin" | "member" | "public";

// ---------------------------------------------------------------------------
// Supabase / Algolia helpers
// ---------------------------------------------------------------------------

function supabase() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

function algolia() {
  return algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
}

// ---------------------------------------------------------------------------
// Rate limiting — per-IP sliding window
// ---------------------------------------------------------------------------

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count++;
  return entry.count > limit;
}

function getClientIp(req: IncomingMessage): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  return req.socket?.remoteAddress ?? "unknown";
}

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------

function corsHeaders(origin: string | undefined): Record<string, string> {
  const allowed = origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://claude.ai";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key, Mcp-Session-Id",
    Vary: "Origin",
  };
}

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

function isAdmin(req: IncomingMessage): boolean {
  if (!MCP_API_KEY) return true;
  const key =
    (req.headers["x-api-key"] as string) ??
    (req.headers["authorization"] as string)?.replace(/^Bearer\s+/i, "") ??
    "";
  return key === MCP_API_KEY;
}

async function getMemberFromToken(token: string): Promise<string | null> {
  const db = supabase();
  const { data } = await db
    .from("profiles")
    .select("id")
    .eq("mcp_token" as any, token)
    .maybeSingle();
  return (data as any)?.id ?? null;
}

async function resolveAccess(req: IncomingMessage): Promise<AccessLevel> {
  if (isAdmin(req)) return "admin";

  const key =
    (req.headers["x-api-key"] as string) ??
    (req.headers["authorization"] as string)?.replace(/^Bearer\s+/i, "") ??
    "";

  if (key) {
    const memberId = await getMemberFromToken(key);
    if (memberId) return "member";
  }

  return "public";
}

// ---------------------------------------------------------------------------
// Shared tool implementations
// ---------------------------------------------------------------------------

const PUBLIC_CTA = "This is just a preview — Ryan's full teaching goes much deeper. Get access to 200+ lessons, complete frameworks, and proven systems. [Book a free strategy call](https://api.leadconnectorhq.com/widget/booking/se3iS4vBOzoiBEaeoSdC) or [join directly at the Inner Circle portal](https://learn.dcpracticegrowth.com).";
const PUBLIC_FOOTER = "About Dr Ryan Rieder: Ryan built one of the UK's largest chiropractic businesses from scratch — 8 locations, 11,000+ new patients per year, and over $7M in annual revenue. He's not just teaching theory; every system inside DC Practice Growth is something Ryan personally used to grow his own clinics.\n\nInside the Inner Circle you get access to 200+ video teachings, proven scripts, marketing systems, retention frameworks, and live coaching — everything a modern chiropractic business needs to grow.\n\nReady to go deeper? [Book a free strategy call with the DCPG team](https://api.leadconnectorhq.com/widget/booking/se3iS4vBOzoiBEaeoSdC) or [join directly at the Inner Circle Portal](https://learn.dcpracticegrowth.com).";

async function toolSearchContent(
  query: string,
  limit: number,
  isPublic: boolean
): Promise<{ content: { type: "text"; text: string }[]; isError?: boolean }> {
  const cap = isPublic ? 5 : limit;

  // ── 1. Try Algolia ────────────────────────────────────────────────────────
  let algoliaResults: any[] = [];
  try {
    const client = algolia();
    console.log(`[search_content] Algolia query: "${query}", index: ${ALGOLIA_INDEX}, limit: ${cap}`);
    const { hits } = await client.searchSingleIndex({
      indexName: ALGOLIA_INDEX,
      searchParams: { query, hitsPerPage: cap },
    });
    console.log(`[search_content] Algolia returned ${hits.length} hits`);
    algoliaResults = hits as any[];
  } catch (err) {
    console.error(`[search_content] Algolia error: ${(err as Error).message}`);
  }

  // ── 2. Supabase fallback if Algolia returned nothing ──────────────────────
  if (algoliaResults.length === 0) {
    console.log(`[search_content] Falling back to Supabase ilike search`);
    try {
      const db = supabase();
      const pattern = `%${query}%`;
      const { data: rows } = await db
        .from("content")
        .select("id, title, description, youtube_video_id, category:categories(name), display_author_name")
        .eq("status", "published")
        .or(`title.ilike.${pattern},description.ilike.${pattern}`)
        .limit(cap);

      const results = (rows ?? []).map((r: any) => {
        const desc = (r.description ?? "").slice(0, isPublic ? 150 : 300);
        if (isPublic) {
          return {
            title: r.title,
            category: r.category?.name ?? null,
            description: desc,
            call_to_action: PUBLIC_CTA,
          };
        }
        return {
          id: r.id,
          type: "lesson",
          title: r.title,
          description: desc,
          category: r.category?.name ?? null,
          youtube_video_id: r.youtube_video_id ?? null,
          url: `https://learn.dcpracticegrowth.com/content/${r.id}`,
          source: "supabase_fallback",
        };
      });

      const payload: any = { query, results, note: "Results from database (Algolia index may need re-syncing)" };
      if (isPublic) payload.footer = PUBLIC_FOOTER;
      return {
        content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Search failed: ${(err as Error).message}` }],
        isError: true,
      };
    }
  }

  // ── 3. Return Algolia results ─────────────────────────────────────────────
  // For member results, enrich with youtube_video_id from Supabase (not stored in Algolia)
  let videoIdMap: Record<string, string | null> = {};
  if (!isPublic) {
    const contentIds = algoliaResults
      .filter((h) => (h.type ?? "content") !== "course")
      .map((h) => (h.objectID as string).replace(/^content_/, ""));
    if (contentIds.length > 0) {
      try {
        const db = supabase();
        const { data: vidRows } = await db
          .from("content")
          .select("id, youtube_video_id")
          .in("id", contentIds);
        for (const row of vidRows ?? []) {
          videoIdMap[(row as any).id] = (row as any).youtube_video_id ?? null;
        }
      } catch {
        // non-fatal
      }
    }
  }

  const results = algoliaResults.map((h) => {
    const rawId = (h.objectID as string).replace(/^(content_|course_)/, "");
    const isCourse = h.type === "course";
    const desc = (h.description ?? "").slice(0, isPublic ? 150 : 300);
    if (isPublic) {
      return {
        title: h.title,
        category: h.category_name ?? null,
        description: desc,
        call_to_action: PUBLIC_CTA,
      };
    }
    return {
      id: rawId,
      type: h.type ?? "lesson",
      title: h.title,
      description: desc,
      category: h.category_name ?? null,
      youtube_video_id: isCourse ? null : (videoIdMap[rawId] ?? null),
      url: `https://learn.dcpracticegrowth.com/${isCourse ? "courses" : "content"}/${rawId}`,
    };
  });

  const payload: any = { query, results };
  if (isPublic) payload.footer = PUBLIC_FOOTER;
  return { content: [{ type: "text", text: JSON.stringify(payload, null, 2) }] };
}

async function toolGetCourses(
  limit: number,
  isPublic: boolean
): Promise<{ content: { type: "text"; text: string }[]; isError?: boolean }> {
  try {
    const db = supabase();
    const { data: courses, error: coursesErr } = await (db as any)
      .from("courses")
      .select("id, title, description, thumbnail_url, display_author_name, categories(name), created_at")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (coursesErr) throw new Error(coursesErr.message);

    if (!courses || courses.length === 0) {
      return { content: [{ type: "text", text: JSON.stringify({ courses: [] }) }] };
    }

    const courseIds = courses.map((c: any) => c.id);
    const { data: modules } = await (db as any)
      .from("course_modules")
      .select("id, course_id, title, order_index")
      .in("course_id", courseIds)
      .order("order_index");

    const moduleIds = (modules ?? []).map((m: any) => m.id);
    const { data: lessons } =
      moduleIds.length > 0
        ? await (db as any)
            .from("course_lessons")
            .select("id, module_id, course_id, title, content_type, order_index, video_url, youtube_video_id, description")
            .in("module_id", moduleIds)
            .order("order_index")
        : { data: [] };

    const lessonsByModule = new Map<string, any[]>();
    for (const l of lessons ?? []) {
      const arr = lessonsByModule.get(l.module_id) ?? [];
      arr.push(l);
      lessonsByModule.set(l.module_id, arr);
    }
    const modulesByCourse = new Map<string, any[]>();
    for (const m of modules ?? []) {
      const arr = modulesByCourse.get(m.course_id) ?? [];
      arr.push({ ...m, lessons: lessonsByModule.get(m.id) ?? [] });
      modulesByCourse.set(m.course_id, arr);
    }

    const CTA =
      "Join Ryan Rieder's Inner Circle at learn.dcpracticegrowth.com for full access to every course.";

    const result = courses.map((c: any) => ({
      id: c.id,
      title: c.title,
      description: (c.description ?? "").slice(0, isPublic ? 200 : 400),
      category: c.categories?.name ?? null,
      url: `https://learn.dcpracticegrowth.com/courses/${c.id}`,
      modules: modulesByCourse.get(c.id) ?? [],
      ...(isPublic ? { cta: CTA } : {}),
    }));

    return { content: [{ type: "text", text: JSON.stringify({ courses: result }, null, 2) }] };
  } catch (err) {
    return { content: [{ type: "text", text: (err as Error).message }], isError: true };
  }
}

// ---------------------------------------------------------------------------
// MCP Server factories per access level
// ---------------------------------------------------------------------------

function createPublicServer(): McpServer {
  const server = new McpServer({ name: "DCPG Library (Public)", version: "1.0.0" });

  server.tool(
    "search_content",
    "Search Ryan Rieder's published chiropractic training library. Returns up to 5 previews with a link to join for full access.",
    {
      query: z.string().min(1).max(200).describe("Search query — topic or question"),
      limit: z.number().int().min(1).max(5).optional().describe("Max results (max 5)"),
    },
    async ({ query, limit = 5 }) => toolSearchContent(query, limit, true)
  );

  server.tool(
    "get_courses",
    "Browse published courses in Ryan Rieder's chiropractic training library.",
    {
      limit: z.number().int().min(1).max(10).optional().describe("Max courses (max 10)"),
    },
    async ({ limit = 10 }) => toolGetCourses(limit, true)
  );

  return server;
}

function createMemberServer(): McpServer {
  const server = new McpServer({ name: "DCPG Library (Member)", version: "1.0.0" });

  server.tool(
    "search_content",
    "Search the full DCPG teaching library by keyword or phrase.",
    {
      query: z.string().min(1).max(200).describe("Search query"),
      limit: z.number().int().min(1).max(20).optional().describe("Max results (default 10)"),
    },
    async ({ query, limit = 10 }) => toolSearchContent(query, limit, false)
  );

  server.tool(
    "get_courses",
    "Get published courses with full module and lesson structure.",
    {
      limit: z.number().int().min(1).max(50).optional().describe("Max courses (default 20)"),
    },
    async ({ limit = 20 }) => toolGetCourses(limit, false)
  );

  server.tool(
    "get_lesson",
    "Get full details for a lesson by its ID. Works for both standalone lessons (content table) and course lessons (course_lessons table).",
    { lesson_id: z.string().uuid().describe("Lesson UUID — from get_courses or search_content results") },
    async ({ lesson_id }) => {
      try {
        const db = supabase();

        // 1. Check content table first (standalone lessons)
        const { data: contentRow } = await db
          .from("content")
          .select("id, title, description, video_url, youtube_video_id, pdf_url, category:categories(name), display_author_name, published_at, views")
          .eq("id", lesson_id)
          .eq("status", "published")
          .maybeSingle();
        if (contentRow) {
          return { content: [{ type: "text", text: JSON.stringify({ source: "content", ...contentRow }, null, 2) }] };
        }

        // 2. Fall back to course_lessons table
        const { data: courseLesson } = await (db as any)
          .from("course_lessons")
          .select("id, course_id, module_id, title, description, video_url, youtube_video_id, content_type, order_index")
          .eq("id", lesson_id)
          .maybeSingle();
        if (courseLesson) {
          return { content: [{ type: "text", text: JSON.stringify({ source: "course_lesson", ...courseLesson }, null, 2) }] };
        }

        return { content: [{ type: "text", text: `Lesson not found: ${lesson_id}` }], isError: true };
      } catch (err) {
        return { content: [{ type: "text", text: (err as Error).message }], isError: true };
      }
    }
  );

  server.tool(
    "get_books",
    "Get all published books by Dr Ryan Rieder. Each result includes a portal_link the member can open to view and download the book.",
    {},
    async () => {
      try {
        const db = supabase();
        const { data, error } = await db
          .from("content")
          .select("id, title, description, thumbnail_url, book_url, pdf_url, published_at")
          .eq("content_type" as any, "book")
          .eq("status", "published")
          .order("published_at", { ascending: false });
        if (error) throw new Error(error.message);
        const books = (data ?? []).map((b: any) => ({
          id: b.id,
          title: b.title,
          description: b.description ?? null,
          thumbnail_url: b.thumbnail_url ?? null,
          book_url: b.book_url ?? b.pdf_url ?? null,
          portal_link: `https://learn.dcpracticegrowth.com/content/${b.id}`,
        }));
        return { content: [{ type: "text", text: JSON.stringify({ books }, null, 2) }] };
      } catch (err) {
        return { content: [{ type: "text", text: (err as Error).message }], isError: true };
      }
    }
  );

  server.tool(
    "get_transcript",
    "Fetch the YouTube transcript for a video. Accepts a YouTube URL, YouTube video ID (11 chars), or a lesson UUID from get_courses/get_lesson.",
    { video: z.string().describe("YouTube URL, YouTube video ID, or lesson UUID") },
    async ({ video }) => {
      try {
        let videoId: string | null = null;

        // 1. Try YouTube URL
        const urlMatch = video.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
        if (urlMatch) {
          videoId = urlMatch[1];
        }
        // 2. Try bare 11-char YouTube video ID
        else if (/^[A-Za-z0-9_-]{11}$/.test(video.trim())) {
          videoId = video.trim();
        }
        // 3. Try resolving as a lesson UUID → youtube_video_id
        else if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(video.trim())) {
          const db = supabase();
          // Check course_lessons first (most common for get_courses results)
          const { data: cl } = await (db as any)
            .from("course_lessons")
            .select("youtube_video_id, video_url")
            .eq("id", video.trim())
            .maybeSingle();
          if (cl?.youtube_video_id) {
            videoId = cl.youtube_video_id;
          } else if (cl?.video_url) {
            const m = cl.video_url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
            if (m) videoId = m[1];
          }
          // Also check content table
          if (!videoId) {
            const { data: ct } = await db
              .from("content")
              .select("video_url, youtube_video_id")
              .eq("id", video.trim())
              .maybeSingle();
            if ((ct as any)?.youtube_video_id) {
              videoId = (ct as any).youtube_video_id;
            } else if (ct?.video_url) {
              const m = ct.video_url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
              if (m) videoId = m[1];
            }
          }
        }

        if (!videoId) {
          return {
            content: [{ type: "text", text: "Could not resolve a YouTube video ID from the input. Pass a YouTube URL, video ID, or lesson UUID." }],
            isError: true,
          };
        }

        // ── Attempt 1: YouTube captions ──────────────────────────────────
        try {
          const items = await YoutubeTranscript.fetchTranscript(videoId, { lang: "en" });
          const text = items.map((t: any) => t.text).join(" ").replace(/\s+/g, " ").trim();
          return {
            content: [{
              type: "text",
              text: JSON.stringify({ videoId, source: "captions", wordCount: text.split(" ").length, transcript: text.slice(0, 20000) }, null, 2),
            }],
          };
        } catch (_captionErr) {
          console.log(`[get_transcript] Captions unavailable for ${videoId}: ${(_captionErr as Error).message}`);
        }

        // ── Attempt 2: Supadata API ───────────────────────────────────────
        const SUPADATA_API_KEY = process.env.SUPADATA_API_KEY ?? "";
        if (SUPADATA_API_KEY) {
          console.log(`[get_transcript] Trying Supadata API for ${videoId}…`);
          try {
            const { Supadata } = await import("@supadata/js");
            const supadata = new Supadata({ apiKey: SUPADATA_API_KEY });
            const result = await supadata.youtube.transcript({ videoId });
            const chunks = Array.isArray(result.content) ? result.content : [];
            const text = chunks.map((c: { text: string }) => c.text).join(" ").trim();
            if (text) {
              console.log(`[get_transcript] Supadata success — ${text.split(" ").length} words`);
              return {
                content: [{
                  type: "text",
                  text: JSON.stringify({ videoId, source: "supadata", lang: result.lang, wordCount: text.split(" ").length, transcript: text.slice(0, 20000) }, null, 2),
                }],
              };
            }
          } catch (supadataErr) {
            console.error(`[get_transcript] Supadata failed: ${(supadataErr as Error).message}`);
          }
        }

        // ── Attempt 3: Whisper transcription via ytdl-core ───────────────
        console.log(`[get_transcript] OPENAI_API_KEY set: ${!!OPENAI_API_KEY}, length: ${OPENAI_API_KEY.length}`);
        if (!OPENAI_API_KEY) {
          return {
            content: [{ type: "text", text: "Transcript unavailable: YouTube captions not found and OPENAI_API_KEY is not configured on the server." }],
            isError: true,
          };
        }

        const audioPath = join(tmpdir(), `dcpg_whisper_${videoId}.mp4`);
        console.log(`[get_transcript] Attempting ytdl-core download to ${audioPath}`);
        try {
          const ytdl = (await import("ytdl-core")).default;

          console.log(`[get_transcript] Fetching ytdl-core video info…`);
          const info = await ytdl.getBasicInfo(`https://www.youtube.com/watch?v=${videoId}`);
          console.log(`[get_transcript] Video: "${info.videoDetails.title}"`);

          const audioStream = ytdl(`https://www.youtube.com/watch?v=${videoId}`, {
            quality: "highestaudio",
            filter: "audioonly",
          });
          audioStream.on("error", (e: Error) => console.error(`[get_transcript] ytdl stream error: ${e.message}`));

          console.log(`[get_transcript] Piping audio to disk…`);
          await pipeline(audioStream, createWriteStream(audioPath));
          console.log(`[get_transcript] Audio downloaded. Sending to Whisper…`);

          const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
          const transcription = await openai.audio.transcriptions.create({
            model: "whisper-1",
            file: createReadStream(audioPath),
            response_format: "text",
          });

          const text = (typeof transcription === "string" ? transcription : (transcription as any).text ?? "").trim();
          console.log(`[get_transcript] Whisper success — ${text.split(" ").length} words`);
          return {
            content: [{
              type: "text",
              text: JSON.stringify({ videoId, source: "whisper", wordCount: text.split(" ").length, transcript: text.slice(0, 20000) }, null, 2),
            }],
          };
        } catch (whisperErr) {
          const msg = (whisperErr as Error).message;
          console.error(`[get_transcript] Whisper/ytdl failed: ${msg}`);

          // ── Attempt 4: YouTube oEmbed — returns title + author without auth ─
          // ytdl-core is frequently blocked by YouTube on cloud IP ranges.
          // oEmbed is a public API that works from any server.
          console.log(`[get_transcript] Falling back to YouTube oEmbed metadata…`);
          try {
            const oembedRes = await fetch(
              `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
            );
            if (oembedRes.ok) {
              const oembed = await oembedRes.json() as any;
              console.log(`[get_transcript] oEmbed success: "${oembed.title}"`);
              return {
                content: [{
                  type: "text",
                  text: JSON.stringify({
                    videoId,
                    source: "oembed_metadata_only",
                    title: oembed.title,
                    author: oembed.author_name,
                    url: `https://www.youtube.com/watch?v=${videoId}`,
                    note: `Full transcript unavailable — YouTube captions are off and audio download failed (${msg}). Video metadata returned instead.`,
                  }, null, 2),
                }],
                isError: false,
              };
            }
          } catch (oembedErr) {
            console.error(`[get_transcript] oEmbed also failed: ${(oembedErr as Error).message}`);
          }

          return {
            content: [{ type: "text", text: `Transcript unavailable: ${msg}` }],
            isError: true,
          };
        } finally {
          if (existsSync(audioPath)) unlinkSync(audioPath);
        }
      } catch (err) {
        return { content: [{ type: "text", text: `Transcript unavailable: ${(err as Error).message}` }], isError: true };
      }
    }
  );

  server.tool(
    "get_book_content",
    "Search the full text of Ryan Rieder's written books and teaching materials. Use this to find written explanations, frameworks, and strategies from Ryan's books.",
    {
      query: z.string().min(1).max(300).describe("Search query — topic, concept, or question"),
      book_title: z.string().optional().describe("Optional: filter to a specific book title"),
      limit: z.number().int().min(1).max(10).optional().describe("Max chapters to return (default 5)"),
    },
    async ({ query, book_title, limit = 5 }) => {
      try {
        const db = supabase();
        // Use Postgres full-text search via Supabase text search
        let req = (db as any)
          .from("books_content")
          .select("id, book_title, chapter_title, content_text, order_index")
          .textSearch("content_text", query.replace(/'/g, " "), { config: "english", type: "websearch" })
          .limit(limit);

        if (book_title) {
          req = req.ilike("book_title", `%${book_title}%`);
        }

        const { data, error } = await req;

        if (error) {
          // Fall back to ilike if FTS fails (e.g. table not yet populated)
          const pattern = `%${query}%`;
          let fallback = (db as any)
            .from("books_content")
            .select("id, book_title, chapter_title, content_text, order_index")
            .or(`content_text.ilike.${pattern},chapter_title.ilike.${pattern},book_title.ilike.${pattern}`)
            .limit(limit);
          if (book_title) fallback = fallback.ilike("book_title", `%${book_title}%`);
          const { data: fbData, error: fbErr } = await fallback;
          if (fbErr) throw new Error(fbErr.message);

          const results = (fbData ?? []).map((r: any) => ({
            book_title: r.book_title,
            chapter_title: r.chapter_title ?? null,
            order_index: r.order_index,
            excerpt: (r.content_text as string).slice(0, 3000),
            full_length: (r.content_text as string).length,
          }));
          return {
            content: [{ type: "text", text: JSON.stringify({ query, results, note: "Full-text search unavailable — showing keyword matches" }, null, 2) }],
          };
        }

        if (!data || data.length === 0) {
          return {
            content: [{ type: "text", text: JSON.stringify({ query, results: [], note: "No matching chapters found. Try a broader search term." }, null, 2) }],
          };
        }

        const results = (data as any[]).map((r) => ({
          book_title: r.book_title,
          chapter_title: r.chapter_title ?? null,
          order_index: r.order_index,
          excerpt: (r.content_text as string).slice(0, 3000),
          full_length: (r.content_text as string).length,
        }));

        return {
          content: [{ type: "text", text: JSON.stringify({ query, results }, null, 2) }],
        };
      } catch (err) {
        return { content: [{ type: "text", text: (err as Error).message }], isError: true };
      }
    }
  );

  return server;
}

function createAdminServer(): McpServer {
  // Admin gets all member tools plus recommend
  const server = createMemberServer();

  server.tool(
    "recommend",
    "Use Claude AI to recommend the best DCPG content for a member's goal. Searches lessons AND book chapters, then returns a ranked, curated list with portal links.",
    {
      goal: z.string().min(1).max(500).describe("The member's learning goal, challenge, or question"),
    },
    async ({ goal }) => {
      try {
        const db = supabase();

        // ── 1. Search Algolia for video/PDF lessons ───────────────────────────
        let lessonHits: any[] = [];
        try {
          const client = algolia();
          const { hits } = await client.searchSingleIndex({
            indexName: ALGOLIA_INDEX,
            searchParams: { query: goal, hitsPerPage: 10 },
          });
          lessonHits = hits as any[];
        } catch {
          // Algolia down — fall back to Supabase
          const pattern = `%${goal}%`;
          const { data: rows } = await db
            .from("content")
            .select("id, title, description, content_type")
            .eq("status", "published")
            .or(`title.ilike.${pattern},description.ilike.${pattern}`)
            .limit(10);
          lessonHits = (rows ?? []).map((r: any) => ({
            objectID: r.id,
            title: r.title,
            description: r.description ?? "",
            type: r.content_type ?? "lesson",
          }));
        }

        // Build lesson candidates with portal URLs
        const lessonCandidates = lessonHits.map((h: any) => {
          const rawId = (h.objectID as string).replace(/^(content_|course_)/, "");
          const isCourse = h.type === "course";
          return {
            source: isCourse ? "course" : "lesson",
            id: rawId,
            title: h.title ?? "",
            description: (h.description ?? "").slice(0, 200),
            portal_url: `https://learn.dcpracticegrowth.com/${isCourse ? "courses" : "content"}/${rawId}`,
          };
        });

        // ── 2. Search books_content for relevant book sections ────────────────
        let bookCandidates: any[] = [];
        try {
          const pattern = `%${goal}%`;
          // Try FTS first, fall back to ilike
          let { data: bookRows, error: ftsErr } = await (db as any)
            .from("books_content")
            .select("id, book_title, chapter_title, content_text")
            .textSearch("content_text", goal.replace(/'/g, " "), { config: "english", type: "websearch" })
            .limit(5);

          if (ftsErr || !bookRows || bookRows.length === 0) {
            const { data: fbRows } = await (db as any)
              .from("books_content")
              .select("id, book_title, chapter_title, content_text")
              .or(`content_text.ilike.${pattern},chapter_title.ilike.${pattern},book_title.ilike.${pattern}`)
              .limit(5);
            bookRows = fbRows ?? [];
          }

          bookCandidates = (bookRows as any[]).map((r: any) => ({
            source: "book",
            book_title: r.book_title,
            chapter_title: r.chapter_title ?? null,
            excerpt: (r.content_text as string).slice(0, 300),
          }));
        } catch {
          // non-fatal — recommend continues with just lesson results
        }

        const totalCandidates = lessonCandidates.length + bookCandidates.length;

        if (totalCandidates === 0) {
          return {
            content: [{ type: "text", text: `No content found for goal: "${goal}". Try a broader description of what you want to achieve.` }],
            isError: true,
          };
        }

        // ── 3. Ask Claude to rank and curate ─────────────────────────────────
        if (!ANTHROPIC_API_KEY) {
          // No API key — return raw candidates so Claude (the MCP caller) can curate itself
          return {
            content: [{
              type: "text",
              text: JSON.stringify({ goal, lessons: lessonCandidates, books: bookCandidates, note: "ANTHROPIC_API_KEY not set — raw candidates returned" }, null, 2),
            }],
          };
        }

        const lessonBlock = lessonCandidates.length > 0
          ? "VIDEO/PDF LESSONS:\n" + lessonCandidates.map((c, i) =>
              `${i + 1}. [${c.source.toUpperCase()}] "${c.title}"\n   Description: ${c.description}\n   Portal link: ${c.portal_url}`
            ).join("\n\n")
          : "";

        const bookBlock = bookCandidates.length > 0
          ? "BOOK CHAPTERS:\n" + bookCandidates.map((c, i) =>
              `${i + 1}. From "${c.book_title}"${c.chapter_title ? ` — ${c.chapter_title}` : ""}\n   Excerpt: ${c.excerpt}`
            ).join("\n\n")
          : "";

        const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
        const msg = await anthropic.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 1024,
          messages: [{
            role: "user",
            content:
              `You are an expert advisor for DC Practice Growth (DCPG), Dr Ryan Rieder's chiropractic education platform.\n\n` +
              `A member's goal: "${goal}"\n\n` +
              `Based on these teaching resources from Dr Ryan Rieder, recommend the top 5 most relevant pieces of content for this goal. ` +
              `Return a ranked list. For each item include: title, why it's relevant to the goal, and the portal URL (for lessons/courses). ` +
              `For book chapters, name the book and chapter. Be specific and practical.\n\n` +
              `${lessonBlock}\n\n${bookBlock}`,
          }],
        });

        const recommendation = msg.content[0]?.type === "text" ? msg.content[0].text : "";
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              goal,
              recommendation,
              sources_searched: { lessons: lessonCandidates.length, book_sections: bookCandidates.length },
            }, null, 2),
          }],
        };
      } catch (err) {
        return { content: [{ type: "text", text: (err as Error).message }], isError: true };
      }
    }
  );

  return server;
}

// ---------------------------------------------------------------------------
// Parse body helper
// ---------------------------------------------------------------------------

async function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", () => {
      try { resolve(JSON.parse(raw || "{}")); } catch { reject(new Error("Invalid JSON")); }
    });
    req.on("error", reject);
  });
}

// ---------------------------------------------------------------------------
// Run an MCP server for this request
// ---------------------------------------------------------------------------

async function runMcp(server: McpServer, req: IncomingMessage, res: ServerResponse, body: any) {
  // Ensure the Accept header satisfies the MCP SDK's SSE requirement.
  // Claude.ai's discovery ping may omit it — inject server-side so the transport accepts it.
  const accept = req.headers["accept"] ?? "";
  if (!accept.includes("text/event-stream")) {
    req.headers["accept"] = "application/json, text/event-stream";
  }

  // Disable buffering so SSE frames reach Claude.ai immediately (Vercel/nginx may buffer by default)
  (res as any).setHeader?.("X-Accel-Buffering", "no");

  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, body);
  } finally {
    await transport.close();
    await server.close();
  }
}

// ---------------------------------------------------------------------------
// Vercel serverless handler
// ---------------------------------------------------------------------------

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const origin = req.headers["origin"] as string | undefined;
  const ip = getClientIp(req);
  const url = (req as any).url as string ?? "/";
  const cors = corsHeaders(origin);

  // Prevent Vercel/nginx from buffering SSE streams — Claude.ai needs them flushed immediately
  (res as any).setHeader("X-Accel-Buffering", "no");

  // ── GET — return 405 with JSON-RPC error so clients don't fall back to legacy SSE transport
  if (req.method === "GET" && url !== "/health" && !url.startsWith("/health?")) {
    res.writeHead(405, { "Content-Type": "application/json", Allow: "POST, OPTIONS", ...cors });
    res.end(JSON.stringify({ jsonrpc: "2.0", error: { code: -32000, message: "Use HTTP POST for MCP requests" }, id: null }));
    return;
  }

  // ── /health — unauthenticated monitoring ───────────────────────────────────
  if (url === "/health" || url.startsWith("/health?")) {
    res.writeHead(200, { "Content-Type": "application/json", ...cors });
    res.end(JSON.stringify({ status: "ok", service: "DCPG MCP Server", version: "1.0.0", timestamp: new Date().toISOString() }));
    return;
  }

  // ── CORS pre-flight ────────────────────────────────────────────────────────
  if (req.method === "OPTIONS") {
    res.writeHead(204, cors);
    res.end();
    return;
  }

  // ── /public — no auth, 20 req/hour, limited tools ─────────────────────────
  if (url.startsWith("/public")) {
    if (isRateLimited(`pub:${ip}`, 20, 60 * 60 * 1000)) {
      res.writeHead(429, { "Content-Type": "application/json", ...cors });
      res.end(JSON.stringify({ error: "Rate limit exceeded — 20 requests per hour for public access" }));
      return;
    }
    const body = req.method === "POST" ? await parseBody(req) : {};
    await runMcp(createPublicServer(), req, res, body);
    return;
  }

  // ── /member/token — GET member's personal MCP token (requires Supabase JWT) ─
  if (url === "/member/token" || url.startsWith("/member/token?")) {
    if (req.method !== "GET") {
      res.writeHead(405, { "Content-Type": "application/json", ...cors });
      res.end(JSON.stringify({ error: "Method not allowed" }));
      return;
    }

    // Expect: Authorization: Bearer <supabase-jwt>
    const jwt = (req.headers["authorization"] as string)?.replace(/^Bearer\s+/i, "");
    if (!jwt) {
      res.writeHead(401, { "Content-Type": "application/json", ...cors });
      res.end(JSON.stringify({ error: "Provide Authorization: Bearer <supabase-jwt>" }));
      return;
    }

    // Verify JWT and get user id
    const db = supabase();
    const { data: { user }, error: jwtErr } = await db.auth.getUser(jwt);
    if (jwtErr || !user) {
      res.writeHead(401, { "Content-Type": "application/json", ...cors });
      res.end(JSON.stringify({ error: "Invalid or expired token" }));
      return;
    }

    // Get or create mcp_token
    const { data: profile } = await db
      .from("profiles")
      .select("mcp_token")
      .eq("id", user.id)
      .single();

    let token = (profile as any)?.mcp_token as string | null;
    if (!token) {
      token = crypto.randomUUID();
      await db.from("profiles").update({ mcp_token: token } as any).eq("id", user.id);
    }

    res.writeHead(200, { "Content-Type": "application/json", ...cors });
    res.end(JSON.stringify({
      token,
      member_url: `${MCP_PUBLIC_URL}/member`,
      usage: `Set x-api-key: ${token} and point Claude at ${MCP_PUBLIC_URL}/member`,
    }));
    return;
  }

  // ── /member — open access, 200 req/hour, full member tools ───────────────
  if (url.startsWith("/member")) {
    if (isRateLimited(`mem:${ip}`, 200, 60 * 60 * 1000)) {
      res.writeHead(429, { "Content-Type": "application/json", ...cors });
      res.end(JSON.stringify({ error: "Rate limit exceeded — 200 requests per hour" }));
      return;
    }
    const body = req.method === "POST" ? await parseBody(req) : {};
    await runMcp(createMemberServer(), req, res, body);
    return;
  }

  // ── / — admin (existing MCP_API_KEY), 100 req/min ─────────────────────────
  if (isRateLimited(`adm:${ip}`, 100, 60_000)) {
    res.writeHead(429, { "Content-Type": "application/json", ...cors });
    res.end(JSON.stringify({ error: "Rate limit exceeded — 100 requests per minute" }));
    return;
  }

  if (!isAdmin(req)) {
    res.writeHead(401, { "Content-Type": "application/json", ...cors });
    res.end(JSON.stringify({ error: "Unauthorized — provide x-api-key header" }));
    return;
  }

  const body = req.method === "POST" ? await parseBody(req) : {};
  await runMcp(createAdminServer(), req, res, body);
}
