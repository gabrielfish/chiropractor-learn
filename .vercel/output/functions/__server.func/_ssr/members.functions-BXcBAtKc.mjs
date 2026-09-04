import { c as createServerRpc } from "./createServerRpc-D-AYw99j.mjs";
import { a as createServerFn } from "./server-BomfFVcN.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-dN1VnyDc.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, b as booleanType, s as stringType, e as enumType } from "../_libs/zod.mjs";
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
const listMembers_createServerFn_handler = createServerRpc({
  id: "b7f69ca8c31846e3e8e27a7ded678ada2faeaaaa74d025348bd7d70d7e81d0f1",
  name: "listMembers",
  filename: "src/lib/members.functions.ts"
}, (opts) => listMembers.__executeServer(opts));
const listMembers = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listMembers_createServerFn_handler, async ({
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
    data: memberRows,
    error: rolesErr
  } = await supabaseAdmin.from("user_roles").select("user_id").eq("role", "member");
  if (rolesErr) throw new Error(rolesErr.message);
  const {
    data: elevatedRows,
    error: elevatedErr
  } = await supabaseAdmin.from("user_roles").select("user_id").or("role.eq.super_admin,role.eq.author");
  if (elevatedErr) throw new Error(`Failed to fetch elevated roles: ${elevatedErr.message}`);
  const elevatedIds = new Set((elevatedRows ?? []).map((r) => r.user_id));
  const ids = (memberRows ?? []).map((r) => r.user_id).filter((id) => !elevatedIds.has(id));
  if (ids.length === 0) return {
    members: []
  };
  const {
    data: profiles,
    error: profilesErr
  } = await supabaseAdmin.from("profiles").select("id, full_name, email, avatar_url, practice_name, created_at, last_login, is_active").in("id", ids);
  if (profilesErr) throw new Error(profilesErr.message);
  const {
    data: progressRows
  } = await supabaseAdmin.from("progress").select("user_id").in("user_id", ids).eq("completed", true);
  const countMap = /* @__PURE__ */ new Map();
  for (const p of progressRows ?? []) {
    const k = p.user_id;
    countMap.set(k, (countMap.get(k) ?? 0) + 1);
  }
  return {
    members: (profiles ?? []).map((p) => ({
      id: p.id,
      full_name: p.full_name,
      email: p.email,
      avatar_url: p.avatar_url,
      practice_name: p.practice_name ?? null,
      created_at: p.created_at,
      last_login: p.last_login,
      is_active: p.is_active ?? true,
      content_completed: countMap.get(p.id) ?? 0
    }))
  };
});
const toggleSchema = objectType({
  userId: stringType().uuid(),
  is_active: booleanType()
});
const setMemberActive_createServerFn_handler = createServerRpc({
  id: "76e5caeb85e11253ba2d587d3ed1f43c677355ef05d9c4eac1d046b5da1d49c9",
  name: "setMemberActive",
  filename: "src/lib/members.functions.ts"
}, (opts) => setMemberActive.__executeServer(opts));
const setMemberActive = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => toggleSchema.parse(input)).handler(setMemberActive_createServerFn_handler, async ({
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
    is_active: data.is_active
  }).eq("id", data.userId);
  if (error) throw new Error(error.message);
  if (!data.is_active) {
    await supabaseAdmin.from("content").update({
      display_author_name: "Dr Ryan Rieder"
    }).eq("author_id", data.userId);
  }
  return {
    ok: true
  };
});
const roleSchema = objectType({
  userId: stringType().uuid(),
  role: enumType(["member", "author", "super_admin"])
});
const setUserRole_createServerFn_handler = createServerRpc({
  id: "562376604b9ca9c8280c3c5611eb443082154e7a89c0f83fcad9b01fb088961f",
  name: "setUserRole",
  filename: "src/lib/members.functions.ts"
}, (opts) => setUserRole.__executeServer(opts));
const setUserRole = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => roleSchema.parse(input)).handler(setUserRole_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: callerRoles
  } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  if (!(callerRoles ?? []).some((r) => r.role === "super_admin")) {
    throw new Error("Forbidden");
  }
  if (data.userId === userId) {
    throw new Error("You cannot change your own role");
  }
  const {
    supabaseAdmin
  } = await import("./client.server-IqT0ZZNy.mjs");
  await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId);
  const {
    error
  } = await supabaseAdmin.from("user_roles").insert({
    user_id: data.userId,
    role: data.role
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  listMembers_createServerFn_handler,
  setMemberActive_createServerFn_handler,
  setUserRole_createServerFn_handler
};
