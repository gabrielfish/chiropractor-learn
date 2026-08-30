import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createClient } from "@supabase/supabase-js";
import { algoliasearch } from "algoliasearch";
import Anthropic from "@anthropic-ai/sdk";
import { YoutubeTranscript } from "youtube-transcript";
import { z } from "zod";
import type { IncomingMessage, ServerResponse } from "http";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const MCP_API_KEY = process.env.MCP_API_KEY ?? "";
const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID ?? "";
const ALGOLIA_SEARCH_KEY = process.env.ALGOLIA_SEARCH_KEY ?? "";
const ALGOLIA_INDEX = process.env.ALGOLIA_INDEX_NAME ?? "dcpg_content";
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY ?? "";

function supabase() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

function algolia() {
  return algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
}

// ---------------------------------------------------------------------------
// MCP Server factory (one per request — stateless)
// ---------------------------------------------------------------------------

function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "DCPG Membership Portal",
    version: "1.0.0",
  });

  // ── search_content ────────────────────────────────────────────────────────
  server.tool(
    "search_content",
    "Search lessons and courses in the DCPG teaching library by keyword or phrase.",
    {
      query: z.string().describe("Search query — keywords, topic, or question"),
      limit: z.number().int().min(1).max(20).optional().describe("Max results (default 10)"),
    },
    async ({ query, limit = 10 }) => {
      try {
        const client = algolia();
        const { hits } = await client.searchSingleIndex({
          indexName: ALGOLIA_INDEX,
          searchParams: { query, hitsPerPage: limit },
        });
        const results = (hits as any[]).map((h) => ({
          id: h.objectID,
          type: h.type ?? "lesson",
          title: h.title,
          description: (h.description ?? "").slice(0, 300),
          category: h.category_name ?? null,
          url: h.type === "course"
            ? `https://learn.dcpracticegrowth.com/courses/${h.objectID}`
            : `https://learn.dcpracticegrowth.com/content/${h.objectID}`,
        }));
        return {
          content: [{ type: "text", text: JSON.stringify({ query, results }, null, 2) }],
        };
      } catch (err) {
        return {
          content: [{ type: "text", text: `Search failed: ${(err as Error).message}` }],
          isError: true,
        };
      }
    }
  );

  // ── get_lesson ────────────────────────────────────────────────────────────
  server.tool(
    "get_lesson",
    "Get full details for a single lesson including title, description, and video URL.",
    {
      lesson_id: z.string().describe("The lesson UUID from the content table"),
    },
    async ({ lesson_id }) => {
      try {
        const db = supabase();
        const { data, error } = await db
          .from("content")
          .select("id, title, description, video_url, pdf_url, status, category:categories(name), display_author_name, published_at, views")
          .eq("id", lesson_id)
          .eq("status", "published")
          .single();
        if (error || !data) {
          return { content: [{ type: "text", text: `Lesson not found: ${lesson_id}` }], isError: true };
        }
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      } catch (err) {
        return { content: [{ type: "text", text: (err as Error).message }], isError: true };
      }
    }
  );

  // ── get_courses ───────────────────────────────────────────────────────────
  server.tool(
    "get_courses",
    "Get all published courses with their module and lesson structure.",
    {
      limit: z.number().int().min(1).max(50).optional().describe("Max courses to return (default 20)"),
    },
    async ({ limit = 20 }) => {
      try {
        const db = supabase();

        const { data: courses, error: coursesErr } = await (db as any)
          .from("courses")
          .select("id, title, description, thumbnail_url, status, display_author_name, categories(name), created_at")
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
        const { data: lessons } = moduleIds.length > 0
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

        const result = courses.map((c: any) => ({
          id: c.id,
          title: c.title,
          description: (c.description ?? "").slice(0, 400),
          category: c.categories?.name ?? null,
          url: `https://learn.dcpracticegrowth.com/courses/${c.id}`,
          modules: modulesByCourse.get(c.id) ?? [],
        }));

        return { content: [{ type: "text", text: JSON.stringify({ courses: result }, null, 2) }] };
      } catch (err) {
        return { content: [{ type: "text", text: (err as Error).message }], isError: true };
      }
    }
  );

  // ── get_transcript ────────────────────────────────────────────────────────
  server.tool(
    "get_transcript",
    "Fetch the YouTube transcript/captions for a video by its URL or video ID.",
    {
      video: z.string().describe("YouTube video URL or video ID (e.g. dQw4w9WgXcQ)"),
    },
    async ({ video }) => {
      try {
        // Extract video ID from URL if needed
        const idMatch = video.match(
          /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
        );
        const videoId = idMatch ? idMatch[1] : video.trim();

        const items = await YoutubeTranscript.fetchTranscript(videoId, { lang: "en" });
        const text = items.map((t: any) => t.text).join(" ").replace(/\s+/g, " ").trim();
        const wordCount = text.split(" ").length;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ videoId, wordCount, transcript: text.slice(0, 20000) }, null, 2),
            },
          ],
        };
      } catch (err) {
        return {
          content: [{ type: "text", text: `Transcript unavailable: ${(err as Error).message}` }],
          isError: true,
        };
      }
    }
  );

  // ── get_books ─────────────────────────────────────────────────────────────
  server.tool(
    "get_books",
    "Get a list of all published books and resources authored by Dr Ryan Rieder.",
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

  // ── recommend ─────────────────────────────────────────────────────────────
  server.tool(
    "recommend",
    "Use Claude AI to recommend the best DCPG content for a given goal, question, or topic.",
    {
      goal: z.string().describe("The user's learning goal, question, or topic (e.g. 'grow my practice', 'improve case acceptance')"),
    },
    async ({ goal }) => {
      try {
        // 1. Search Algolia for relevant content
        const client = algolia();
        const { hits } = await client.searchSingleIndex({
          indexName: ALGOLIA_INDEX,
          searchParams: { query: goal, hitsPerPage: 15 },
        });

        const candidates = (hits as any[])
          .map((h) => `[${h.type ?? "lesson"}] ${h.title} (id: ${h.objectID}) — ${(h.description ?? "").slice(0, 150)}`)
          .join("\n");

        // 2. Ask Claude to recommend
        if (!ANTHROPIC_API_KEY) {
          return { content: [{ type: "text", text: `No ANTHROPIC_API_KEY set. Top search results:\n\n${candidates}` }] };
        }

        const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
        const msg = await anthropic.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 1024,
          messages: [
            {
              role: "user",
              content:
                `You are an expert advisor for DC Practice Growth (DCPG), a chiropractic education platform by Dr Ryan Rieder.\n\n` +
                `A chiropractor wants help with this goal or question:\n"${goal}"\n\n` +
                `Here are available lessons and courses from the library:\n${candidates}\n\n` +
                `Recommend 3-5 of the most relevant items. For each, give:\n` +
                `- Title and ID\n- Why it helps with the goal\n- What they'll learn\n\n` +
                `Be specific, practical, and encouraging. Respond in plain text.`,
            },
          ],
        });

        const recommendation = msg.content[0]?.type === "text" ? msg.content[0].text : "";
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ goal, recommendation, candidates_searched: hits.length }, null, 2),
            },
          ],
        };
      } catch (err) {
        return { content: [{ type: "text", text: (err as Error).message }], isError: true };
      }
    }
  );

  return server;
}

// ---------------------------------------------------------------------------
// Vercel serverless handler
// ---------------------------------------------------------------------------

function authenticate(req: IncomingMessage): boolean {
  if (!MCP_API_KEY) return true; // no key configured — allow (dev mode)
  const header = (req.headers["x-api-key"] as string) ??
    (req.headers["authorization"] as string)?.replace(/^Bearer\s+/i, "") ?? "";
  return header === MCP_API_KEY;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // CORS pre-flight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key, Mcp-Session-Id",
    });
    res.end();
    return;
  }

  // Auth check
  if (!authenticate(req)) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Unauthorized — provide x-api-key header" }));
    return;
  }

  // Parse body (Vercel doesn't do this automatically for raw Node handlers)
  let body: any = {};
  if (req.method === "POST") {
    body = await new Promise((resolve, reject) => {
      let raw = "";
      req.on("data", (chunk) => (raw += chunk));
      req.on("end", () => {
        try { resolve(JSON.parse(raw || "{}")); } catch { reject(new Error("Invalid JSON body")); }
      });
      req.on("error", reject);
    });
  }

  // MCP protocol over Streamable HTTP (stateless — new server per request)
  const server = createMcpServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless
  });

  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, body);
  } finally {
    await transport.close();
    await server.close();
  }
}
