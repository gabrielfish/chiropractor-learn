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
  try {
    const client = algolia();
    const cap = isPublic ? Math.min(limit, 5) : limit;
    const { hits } = await client.searchSingleIndex({
      indexName: ALGOLIA_INDEX,
      searchParams: {
        query,
        hitsPerPage: cap,
        filters: "status:published",
      },
    });

    const CTA =
      "Watch the full training at learn.dcpracticegrowth.com — join Ryan Rieder's Inner Circle for unlimited access.";

    const results = (hits as any[]).map((h) => {
      const base = {
        id: h.objectID,
        type: h.type ?? "lesson",
        title: h.title,
        description: (h.description ?? "").slice(0, isPublic ? 200 : 300),
        category: h.category_name ?? null,
        url: `https://learn.dcpracticegrowth.com/${h.type === "course" ? "courses" : "content"}/${h.objectID}`,
      };
      if (isPublic) {
        return { ...base, cta: CTA };
      }
      return base;
    });

    return { content: [{ type: "text", text: JSON.stringify({ query, results }, null, 2) }] };
  } catch (err) {
    return {
      content: [{ type: "text", text: `Search failed: ${(err as Error).message}` }],
      isError: true,
    };
  }
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
            .select("id, module_id, course_id, title, content_type, order_index")
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
    "Get full details for a single published lesson including video URL.",
    { lesson_id: z.string().uuid().describe("Lesson UUID") },
    async ({ lesson_id }) => {
      try {
        const db = supabase();
        const { data, error } = await db
          .from("content")
          .select("id, title, description, video_url, pdf_url, category:categories(name), display_author_name, published_at, views")
          .eq("id", lesson_id)
          .eq("status", "published")
          .single();
        if (error || !data)
          return { content: [{ type: "text", text: `Lesson not found: ${lesson_id}` }], isError: true };
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
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
    "Fetch the YouTube transcript/captions for a video by URL or video ID.",
    { video: z.string().describe("YouTube URL or video ID") },
    async ({ video }) => {
      try {
        const idMatch = video.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
        const videoId = idMatch ? idMatch[1] : video.trim();
        if (!/^[A-Za-z0-9_-]{11}$/.test(videoId))
          return { content: [{ type: "text", text: "Invalid YouTube video ID" }], isError: true };
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
          searchParams: { query: goal, hitsPerPage: 15, filters: "status:published" },
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
