import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dir, "../.env");
const envText = readFileSync(envPath, "utf8");
for (const line of envText.split(/\r?\n/)) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)="?([^"]*)"?$/);
  if (m) process.env[m[1]] = m[2];
}

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
console.log("SUPABASE_URL:", url);
console.log("HAS SERVICE KEY:", !!key);
console.log("HAS YOUTUBE KEY:", !!process.env.YOUTUBE_API_KEY);

const h = { apikey: key, Authorization: `Bearer ${key}` };

const r1 = await fetch(`${url}/rest/v1/content?select=id&content_type=eq.video`, { headers: h });
const allVideos = await r1.json();
console.log("\nTotal video content rows:", Array.isArray(allVideos) ? allVideos.length : allVideos);

const r2 = await fetch(`${url}/rest/v1/content?select=id,title,video_url,youtube_video_id&youtube_video_id=is.null&content_type=eq.video&limit=5`, { headers: h });
const nullYT = await r2.json();
console.log("\nNull youtube_video_id (first 5):");
console.log(JSON.stringify(nullYT, null, 2));

const r3 = await fetch(`${url}/rest/v1/content?select=id,title,video_url,youtube_video_id&video_url=is.null&content_type=eq.video&limit=5`, { headers: h });
const nullUrl = await r3.json();
console.log("\nNull video_url (first 5):");
console.log(JSON.stringify(nullUrl, null, 2));
