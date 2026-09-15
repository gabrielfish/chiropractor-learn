import { c as createServerRpc } from "./createServerRpc-_iw5yyfy.mjs";
import { a as createServerFn } from "./server-DAhjTOZR.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, b as booleanType, s as stringType } from "../_libs/zod.mjs";
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
const schema = objectType({
  q: stringType().min(1).max(100),
  featured: booleanType().optional()
});
const searchPublishedContent_createServerFn_handler = createServerRpc({
  id: "49add15ccc0b504dea579d2c89979f5125e4f5ecad7c02192ebaf77537f1d812",
  name: "searchPublishedContent",
  filename: "src/lib/public-search.functions.ts"
}, (opts) => searchPublishedContent.__executeServer(opts));
const searchPublishedContent = createServerFn({
  method: "POST"
}).inputValidator((data) => schema.parse(data)).handler(searchPublishedContent_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-IqT0ZZNy.mjs");
  if (data.featured) {
    const {
      data: rows2
    } = await supabaseAdmin.from("content").select("id, title, thumbnail_url, video_duration, category:categories(name, slug)").eq("status", "published").order("published_at", {
      ascending: false
    }).limit(4);
    return {
      results: mapRows(rows2 ?? []),
      isFeatured: true
    };
  }
  const term = data.q.trim().replace(/[%,]/g, " ");
  const {
    data: rows,
    error
  } = await supabaseAdmin.from("content").select("id, title, thumbnail_url, video_duration, category:categories(name, slug)").eq("status", "published").or(`title.ilike.%${term}%,description.ilike.%${term}%`).order("published_at", {
    ascending: false
  }).limit(12);
  if (error) return {
    results: [],
    error: "Search unavailable"
  };
  if ((rows ?? []).length > 0) return {
    results: mapRows(rows),
    isFeatured: false
  };
  const words = term.split(/\s+/).filter((w) => w.length > 2);
  if (words.length > 1) {
    const seen = /* @__PURE__ */ new Set();
    const combined = [];
    for (const word of words) {
      const {
        data: wRows
      } = await supabaseAdmin.from("content").select("id, title, thumbnail_url, video_duration, category:categories(name, slug)").eq("status", "published").or(`title.ilike.%${word}%,description.ilike.%${word}%`).order("published_at", {
        ascending: false
      }).limit(6);
      for (const r of wRows ?? []) {
        if (!seen.has(r.id)) {
          seen.add(r.id);
          combined.push(r);
        }
      }
      if (combined.length >= 12) break;
    }
    if (combined.length > 0) {
      return {
        results: mapRows(combined.slice(0, 12)),
        isFeatured: false
      };
    }
  }
  const {
    data: featured
  } = await supabaseAdmin.from("content").select("id, title, thumbnail_url, video_duration, category:categories(name, slug)").eq("status", "published").order("published_at", {
    ascending: false
  }).limit(4);
  return {
    results: mapRows(featured ?? []),
    isFeatured: true
  };
});
function mapRows(rows) {
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    thumbnail_url: r.thumbnail_url ?? null,
    video_duration: r.video_duration ?? null,
    category_name: r.category?.name ?? null
  }));
}
export {
  searchPublishedContent_createServerFn_handler
};
