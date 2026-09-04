import { c as createServerRpc } from "./createServerRpc-D-AYw99j.mjs";
import { a as createServerFn } from "./server-BomfFVcN.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-dN1VnyDc.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const INDEX_NAME = "dcpg_content";
const BASE_URL = "https://learn.dcpracticegrowth.com";
async function getAdminClient() {
  const {
    algoliasearch
  } = await import("../_libs/algoliasearch.mjs");
  const appId = process.env.ALGOLIA_APP_ID;
  const adminKey = process.env.ALGOLIA_ADMIN_KEY;
  if (!appId || !adminKey) throw new Error("ALGOLIA_APP_ID / ALGOLIA_ADMIN_KEY not configured");
  return algoliasearch(appId, adminKey);
}
const syncContentToAlgolia_createServerFn_handler = createServerRpc({
  id: "c778cec3e03861c034f10d7d49762b58e8c414447551211242615b1de6a3f3ac",
  name: "syncContentToAlgolia",
  filename: "src/lib/algolia-sync.functions.ts"
}, (opts) => syncContentToAlgolia.__executeServer(opts));
const syncContentToAlgolia = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  contentId: stringType().uuid()
}).parse(input)).handler(syncContentToAlgolia_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-IqT0ZZNy.mjs");
  const db = supabaseAdmin;
  const {
    data: row
  } = await db.from("content").select("id, title, description, content_type, thumbnail_url, video_url, pdf_url, book_url, tags, display_author_name, status, category:categories(name, slug)").eq("id", data.contentId).single();
  if (!row) return {
    ok: true
  };
  const client = await getAdminClient();
  const category = row.category;
  if (row.status !== "published") {
    try {
      await client.deleteObject({
        indexName: INDEX_NAME,
        objectID: `content_${row.id}`
      });
    } catch {
    }
    return {
      ok: true
    };
  }
  await client.saveObject({
    indexName: INDEX_NAME,
    body: {
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
      category_name: category?.name ?? null,
      category_slug: category?.slug ?? null,
      url: `${BASE_URL}/content/${row.id}`
    }
  });
  return {
    ok: true
  };
});
const syncCourseToAlgolia_createServerFn_handler = createServerRpc({
  id: "96d42b91b17a98c826f92399721f25670ea8f67e8a83a305a4607179d532f874",
  name: "syncCourseToAlgolia",
  filename: "src/lib/algolia-sync.functions.ts"
}, (opts) => syncCourseToAlgolia.__executeServer(opts));
const syncCourseToAlgolia = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  courseId: stringType().uuid()
}).parse(input)).handler(syncCourseToAlgolia_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-IqT0ZZNy.mjs");
  const db = supabaseAdmin;
  const {
    data: row
  } = await db.from("courses").select("id, title, description, thumbnail_url, display_author_name, status, category:categories(name, slug)").eq("id", data.courseId).single();
  if (!row) return {
    ok: true
  };
  const client = await getAdminClient();
  const category = row.category;
  if (row.status !== "published") {
    try {
      await client.deleteObject({
        indexName: INDEX_NAME,
        objectID: `course_${row.id}`
      });
    } catch {
    }
    return {
      ok: true
    };
  }
  await client.saveObject({
    indexName: INDEX_NAME,
    body: {
      objectID: `course_${row.id}`,
      type: "course",
      id: row.id,
      title: row.title,
      description: row.description ?? null,
      thumbnail_url: row.thumbnail_url ?? null,
      display_author_name: row.display_author_name ?? null,
      category_name: category?.name ?? null,
      category_slug: category?.slug ?? null,
      url: `${BASE_URL}/course/${row.id}`
    }
  });
  return {
    ok: true
  };
});
const syncAllToAlgolia_createServerFn_handler = createServerRpc({
  id: "c2ac10dbe25b976250d09b5c104bc9513f76da5c835d98ec06845e1d7649591c",
  name: "syncAllToAlgolia",
  filename: "src/lib/algolia-sync.functions.ts"
}, (opts) => syncAllToAlgolia.__executeServer(opts));
const syncAllToAlgolia = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(syncAllToAlgolia_createServerFn_handler, async ({
  context
}) => {
  const {
    userId
  } = context;
  const {
    supabaseAdmin
  } = await import("./client.server-IqT0ZZNy.mjs");
  const {
    data: roles
  } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId);
  const roleList = (roles ?? []).map((r) => r.role);
  if (!roleList.includes("super_admin")) throw new Error("Forbidden");
  const db = supabaseAdmin;
  const {
    data: contentRows,
    error: cErr
  } = await db.from("content").select("id, title, description, content_type, thumbnail_url, video_url, pdf_url, book_url, tags, display_author_name, category:categories(name, slug)").eq("status", "published");
  if (cErr) throw new Error(`Failed to fetch content: ${cErr.message}`);
  const {
    data: courseRows,
    error: coErr
  } = await db.from("courses").select("id, title, description, thumbnail_url, display_author_name, category:categories(name, slug)").eq("status", "published");
  if (coErr) throw new Error(`Failed to fetch courses: ${coErr.message}`);
  const client = await getAdminClient();
  const objects = [...(contentRows ?? []).map((row) => {
    const category = row.category;
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
      category_name: category?.name ?? null,
      category_slug: category?.slug ?? null,
      url: `${BASE_URL}/content/${row.id}`
    };
  }), ...(courseRows ?? []).map((row) => {
    const category = row.category;
    return {
      objectID: `course_${row.id}`,
      type: "course",
      id: row.id,
      title: row.title,
      description: row.description ?? null,
      thumbnail_url: row.thumbnail_url ?? null,
      display_author_name: row.display_author_name ?? null,
      category_name: category?.name ?? null,
      category_slug: category?.slug ?? null,
      url: `${BASE_URL}/course/${row.id}`
    };
  })];
  if (objects.length === 0) return {
    contentCount: 0,
    courseCount: 0,
    total: 0
  };
  await client.saveObjects({
    indexName: INDEX_NAME,
    objects
  });
  const contentCount = (contentRows ?? []).length;
  const courseCount = (courseRows ?? []).length;
  return {
    contentCount,
    courseCount,
    total: contentCount + courseCount
  };
});
export {
  syncAllToAlgolia_createServerFn_handler,
  syncContentToAlgolia_createServerFn_handler,
  syncCourseToAlgolia_createServerFn_handler
};
