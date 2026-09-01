/**
 * Fix missing video_url and youtube_video_id on content rows.
 * For each content row where youtube_video_id IS NULL and content_type = 'video',
 * searches the YouTube Data API by title (restricted to the DCPG channel) and
 * patches video_url + youtube_video_id when a match is found.
 *
 * Usage: node scripts/fix-video-urls.mjs
 * Requires .env to contain SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, YOUTUBE_API_KEY.
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// ── Load .env ────────────────────────────────────────────────────────────────
const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dir, "../.env");
const envText = readFileSync(envPath, "utf8");
for (const line of envText.split(/\r?\n/)) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)="?([^"]*)"?$/);
  if (m) process.env[m[1]] = m[2];
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = "UClNHhkcvPRjF2_2G-VfNKHA";

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}
if (!YOUTUBE_API_KEY) {
  console.error("Missing YOUTUBE_API_KEY in .env");
  process.exit(1);
}

// ── Supabase REST helpers ─────────────────────────────────────────────────────
const SB_HEADERS = {
  apikey: SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

async function sbGet(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers: SB_HEADERS });
  if (!res.ok) throw new Error(`Supabase GET ${path} → ${res.status}: ${await res.text()}`);
  return res.json();
}

async function sbPatch(path, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: "PATCH",
    headers: SB_HEADERS,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Supabase PATCH ${path} → ${res.status}: ${await res.text()}`);
  return res.json();
}

// ── YouTube search ────────────────────────────────────────────────────────────
async function searchYouTube(title) {
  const q = encodeURIComponent(title);
  const url =
    `https://www.googleapis.com/youtube/v3/search` +
    `?part=snippet&type=video&channelId=${CHANNEL_ID}` +
    `&q=${q}&maxResults=5&key=${encodeURIComponent(YOUTUBE_API_KEY)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`YouTube API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.items ?? [];
}

// Normalise a title for loose comparison (lowercase, strip punctuation)
function normalise(s) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
}

function findBestMatch(title, items) {
  const target = normalise(title);
  // Exact normalised match first
  for (const item of items) {
    if (normalise(item.snippet?.title ?? "") === target) return item.id?.videoId;
  }
  // Partial: target starts with snippet or vice-versa (handles truncated titles)
  for (const item of items) {
    const candidate = normalise(item.snippet?.title ?? "");
    if (candidate.startsWith(target.slice(0, 40)) || target.startsWith(candidate.slice(0, 40))) {
      return item.id?.videoId;
    }
  }
  return null;
}

// ── Main ──────────────────────────────────────────────────────────────────────
const rows = await sbGet(
  `content?select=id,title&youtube_video_id=is.null&content_type=eq.video&order=title.asc`
);

console.log(`Found ${rows.length} content rows with null youtube_video_id.\n`);

let updated = 0;
let notFound = 0;
let errored = 0;
const misses = [];

for (let i = 0; i < rows.length; i++) {
  const { id, title } = rows[i];
  process.stdout.write(`[${i + 1}/${rows.length}] ${title.slice(0, 60)}… `);

  try {
    const items = await searchYouTube(title);
    const videoId = findBestMatch(title, items);

    if (!videoId) {
      console.log("NOT FOUND");
      notFound++;
      misses.push(title);
      // Small delay to respect rate limits
      await new Promise((r) => setTimeout(r, 200));
      continue;
    }

    await sbPatch(`content?id=eq.${id}`, {
      youtube_video_id: videoId,
      video_url: `https://www.youtube.com/watch?v=${videoId}`,
    });

    console.log(`✓ ${videoId}`);
    updated++;
  } catch (err) {
    console.log(`ERROR: ${err.message}`);
    errored++;
  }

  // Respect YouTube quota: ~100 units/search, 10k units/day → ~100 searches/day safely
  // Space requests 300ms apart to avoid quota bursts
  await new Promise((r) => setTimeout(r, 300));
}

console.log(`\n─────────────────────────────────────`);
console.log(`Updated : ${updated}`);
console.log(`Not found: ${notFound}`);
console.log(`Errors  : ${errored}`);
console.log(`Total   : ${rows.length}`);

if (misses.length > 0) {
  console.log(`\nTitles with no YouTube match (${misses.length}):`);
  misses.forEach((t) => console.log(`  • ${t}`));
}
