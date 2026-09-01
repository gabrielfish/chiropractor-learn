import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createClient } from "@supabase/supabase-js";
import { algoliasearch } from "algoliasearch";
import Anthropic from "@anthropic-ai/sdk";
import { YoutubeTranscript } from "youtube-transcript";
import { z } from "zod";
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

async function toolSearchContent(
  query: string,
  limit: number,
  isPublic: boolean
): Promise<{ content: { type: "text"; text: string }[]; isError?: boolean }> {
  const CTA =
    "Watch the full training at learn.dcpracticegrowth.com — join Ryan Rieder's Inner Circle for unlimited access.";
  const cap = isPublic ? Math.min(limit, 5) : limit;

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
        .select("id, title, description, category:categories(name), display_author_name")
        .eq("status", "published")
        .or(`title.ilike.${pattern},description.ilike.${pattern}`)
        .limit(cap);

      const results = (rows ?? []).map((r: any) => {
        const base = {
          id: r.id,
          type: "lesson",
          title: r.title,
          description: (r.description ?? "").slice(0, isPublic ? 200 : 300),
          category: r.category?.name ?? null,
          url: `https://learn.dcpracticegrowth.com/content/${r.id}`,
          source: "supabase_fallback",
        };
        return isPublic ? { ...base, cta: CTA } : base;
      });

      return {
        content: [{
          type: "text",
          text: JSON.stringify({ query, results, note: "Results from database (Algolia index may need re-syncing)" }, null, 2),
        }],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Search failed: ${(err as Error).message}` }],
        isError: true,
      };
    }
  }

  // ── 3. Return Algolia results ─────────────────────────────────────────────
  const results = algoliaResults.map((h) => {
    const rawId = (h.objectID as string).replace(/^(content_|course_)/, "");
    const base = {
      id: rawId,
      type: h.type ?? "lesson",
      title: h.title,
      description: (h.description ?? "").slice(0, isPublic ? 200 : 300),
      category: h.category_name ?? null,
      url: `https://learn.dcpracticegrowth.com/${h.type === "course" ? "courses" : "content"}/${rawId}`,
    };
    return isPublic ? { ...base, cta: CTA } : base;
  });

  return { content: [{ type: "text", text: JSON.stringify({ query, results }, null, 2) }] };
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
    "Get all published books and resources by Dr Ryan Rieder.",
    {},
    async () => {
      try {
        const db = supabase();
        const { data, error } = await db
          .from("content")
          .select("id, title, description, book_url, book_name, thumbnail_url, published_at")
          .eq("content_type" as any, "book")
          .eq("status", "published")
          .order("published_at", { ascending: false });
        if (error) throw new Error(error.message);
        return { content: [{ type: "text", text: JSON.stringify({ books: data ?? [] }, null, 2) }] };
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

        const items = await YoutubeTranscript.fetchTranscript(videoId, { lang: "en" });
        const text = items.map((t: any) => t.text).join(" ").replace(/\s+/g, " ").trim();
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ videoId, wordCount: text.split(" ").length, transcript: text.slice(0, 20000) }, null, 2),
          }],
        };
      } catch (err) {
        return { content: [{ type: "text", text: `Transcript unavailable: ${(err as Error).message}` }], isError: true };
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
    "Use Claude AI to recommend the best DCPG content for a given goal or question.",
    {
      goal: z.string().min(1).max(500).describe("Learning goal or question"),
    },
    async ({ goal }) => {
      try {
        const client = algolia();
        const { hits } = await client.searchSingleIndex({
          indexName: ALGOLIA_INDEX,
          searchParams: { query: goal, hitsPerPage: 15 },
        });
        const candidates = (hits as any[])
          .map((h) => `[${h.type ?? "lesson"}] ${h.title} (id: ${h.objectID}) — ${(h.description ?? "").slice(0, 150)}`)
          .join("\n");

        if (!ANTHROPIC_API_KEY)
          return { content: [{ type: "text", text: `No ANTHROPIC_API_KEY. Results:\n\n${candidates}` }] };

        const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
        const msg = await anthropic.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 1024,
          messages: [{
            role: "user",
            content:
              `You are an expert advisor for DC Practice Growth (DCPG), a chiropractic education platform by Dr Ryan Rieder.\n\n` +
              `Goal: "${goal}"\n\nAvailable content:\n${candidates}\n\n` +
              `Recommend 3-5 of the most relevant items with title, ID, why it helps, and what they'll learn. Plain text.`,
          }],
        });
        const recommendation = msg.content[0]?.type === "text" ? msg.content[0].text : "";
        return {
          content: [{ type: "text", text: JSON.stringify({ goal, recommendation, candidates_searched: hits.length }, null, 2) }],
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
