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
const listAuthors_createServerFn_handler = createServerRpc({
  id: "df2fa5691b2feeae1819278ec5f928002c89b33dfd3f383eb8456f5a2e7aab14",
  name: "listAuthors",
  filename: "src/lib/authors.functions.ts"
}, (opts) => listAuthors.__executeServer(opts));
const listAuthors = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listAuthors_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: roles
  } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const roleList = (roles ?? []).map((r) => r.role);
  if (!roleList.includes("super_admin")) throw new Error("Forbidden");
  const {
    supabaseAdmin
  } = await import("./client.server-IqT0ZZNy.mjs");
  const {
    data: authorRows,
    error
  } = await supabaseAdmin.from("user_roles").select("user_id").eq("role", "author");
  if (error) throw new Error(error.message);
  const ids = (authorRows ?? []).map((r) => r.user_id);
  if (ids.length === 0) return {
    authors: []
  };
  const {
    data: profiles
  } = await supabaseAdmin.from("profiles").select("id, full_name, email, avatar_url, job_title, bio, is_active").in("id", ids);
  const {
    data: counts
  } = await supabaseAdmin.from("content").select("author_id").in("author_id", ids);
  const countMap = /* @__PURE__ */ new Map();
  for (const c of counts ?? []) {
    const k = c.author_id;
    countMap.set(k, (countMap.get(k) ?? 0) + 1);
  }
  return {
    authors: (profiles ?? []).map((p) => ({
      id: p.id,
      full_name: p.full_name,
      email: p.email,
      avatar_url: p.avatar_url,
      job_title: p.job_title,
      bio: p.bio,
      is_active: p.is_active ?? true,
      content_count: countMap.get(p.id) ?? 0
    }))
  };
});
const updateSchema = objectType({
  id: stringType().uuid(),
  full_name: stringType().trim().min(1).max(120),
  job_title: stringType().trim().max(150).nullable().optional(),
  bio: stringType().trim().max(2e3).nullable().optional(),
  avatar_url: stringType().url().max(2e3).nullable().optional()
});
const updateAuthorProfile_createServerFn_handler = createServerRpc({
  id: "2548c42e71446f6c6deb1d6f6a2e038bef0c7a216248c56046801e6cf9b19b7e",
  name: "updateAuthorProfile",
  filename: "src/lib/authors.functions.ts"
}, (opts) => updateAuthorProfile.__executeServer(opts));
const updateAuthorProfile = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => updateSchema.parse(input)).handler(updateAuthorProfile_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: roles
  } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  if (!(roles ?? []).some((r) => r.role === "super_admin")) {
    throw new Error("Forbidden");
  }
  const {
    supabaseAdmin
  } = await import("./client.server-IqT0ZZNy.mjs");
  const {
    error
  } = await supabaseAdmin.from("profiles").update({
    full_name: data.full_name,
    job_title: data.job_title ?? null,
    bio: data.bio ?? null,
    avatar_url: data.avatar_url ?? null
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const notifyAuthorPublished_createServerFn_handler = createServerRpc({
  id: "1fd28fec5e28d0bede6de3cf319f3aa1f9805d7b06d69d76b039a4f2aa054e12",
  name: "notifyAuthorPublished",
  filename: "src/lib/authors.functions.ts"
}, (opts) => notifyAuthorPublished.__executeServer(opts));
const notifyAuthorPublished = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  contentId: stringType().uuid()
}).parse(input)).handler(notifyAuthorPublished_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-IqT0ZZNy.mjs");
  const {
    data: content
  } = await supabaseAdmin.from("content").select("id, title, author_id").eq("id", data.contentId).single();
  if (!content) return {
    ok: false
  };
  const {
    data: author
  } = await supabaseAdmin.from("profiles").select("full_name").eq("id", content.author_id ?? context.userId).maybeSingle();
  return {
    ok: true
  };
});
export {
  listAuthors_createServerFn_handler,
  notifyAuthorPublished_createServerFn_handler,
  updateAuthorProfile_createServerFn_handler
};
