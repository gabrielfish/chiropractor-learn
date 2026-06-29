/**
 * One-time Algolia full-sync script.
 * Usage: node scripts/sync-algolia.mjs
 * Requires .env to contain SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
 * ALGOLIA_APP_ID, and ALGOLIA_ADMIN_KEY.
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// ── Load .env manually (no dotenv dependency needed) ────────────────────────
const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dir, "../.env");
const envText = readFileSync(envPath, "utf8");
for (const line of envText.split(/\r?\n/)) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)="?([^"]*)"?$/);
  if (m) process.env[m[1]] = m[2];
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY;
const INDEX_NAME = "dcpg_content";
const BASE_URL = "https://learn.dcpracticegrowth.com";

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}
if (!ALGOLIA_APP_ID || !ALGOLIA_ADMIN_KEY) {
  console.error("Missing ALGOLIA_APP_ID or ALGOLIA_ADMIN_KEY in .env");
  process.exit(1);
}

// ── Supabase fetch helper ────────────────────────────────────────────────────
async function supabaseFetch(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Supabase error (${res.status}): ${txt}`);
  }
  return res.json();
}

// ── Main ─────────────────────────────────────────────────────────────────────
const { algoliasearch } = await import("algoliasearch");
const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

console.log("Fetching published content from Supabase…");
const contentRows = await supabaseFetch(
  "content?select=id,title,description,content_type,thumbnail_url,video_url,pdf_url,book_url,tags,display_author_name&status=eq.published",
);
console.log(`  → ${contentRows.length} content items`);

console.log("Fetching categories for content…");
const categoryIds = [...new Set(
  contentRows.map((r) => r.category_id).filter(Boolean),
)];
let categoryMap = {};
if (categoryIds.length) {
  const cats = await supabaseFetch(
    `categories?select=id,name,slug&id=in.(${categoryIds.join(",")})`,
  );
  categoryMap = Object.fromEntries(cats.map((c) => [c.id, c]));
}

console.log("Fetching published courses from Supabase…");
const courseRows = await supabaseFetch(
  "courses?select=id,title,description,thumbnail_url,display_author_name,category_id&status=eq.published",
);
console.log(`  → ${courseRows.length} courses`);

// Build objects array
const objects = [
  ...contentRows.map((row) => {
    const cat = categoryMap[row.category_id] ?? null;
    return {
      objectID: `content_${row.id}`,
      type: "content",
      id: row.id,
      title: row.title,
      description: row.description ?? null,
      content_type: row.content_type ?? "video",
      thumbnail_url: row.thumbnail_url ?? null,
      video_url: row.video_url ?? null,
      pdf_url: row.pdf_url ?? null,
      book_url: row.book_url ?? null,
      tags: row.tags ?? [],
      display_author_name: row.display_author_name ?? null,
      category_name: cat?.name ?? null,
      category_slug: cat?.slug ?? null,
      url: `${BASE_URL}/content/${row.id}`,
    };
  }),
  ...courseRows.map((row) => {
    const cat = categoryMap[row.category_id] ?? null;
    return {
      objectID: `course_${row.id}`,
      type: "course",
      id: row.id,
      title: row.title,
      description: row.description ?? null,
      thumbnail_url: row.thumbnail_url ?? null,
      display_author_name: row.display_author_name ?? null,
      category_name: cat?.name ?? null,
      category_slug: cat?.slug ?? null,
      url: `${BASE_URL}/course/${row.id}`,
    };
  }),
];

if (objects.length === 0) {
  console.log("No published content found — nothing to sync.");
  process.exit(0);
}

console.log(`\nPushing ${objects.length} records to Algolia index "${INDEX_NAME}"…`);
await client.saveObjects({ indexName: INDEX_NAME, objects });

console.log(`\n✓ Done! Synced ${contentRows.length} lessons + ${courseRows.length} courses = ${objects.length} total records.`);
