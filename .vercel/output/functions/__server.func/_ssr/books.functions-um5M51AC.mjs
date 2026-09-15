import { c as createServerRpc } from "./createServerRpc-_iw5yyfy.mjs";
import { a as createServerFn } from "./server-DAhjTOZR.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CINWQ1Vb.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, n as numberType, s as stringType } from "../_libs/zod.mjs";
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
async function assertSuperAdmin(userId) {
  const {
    supabaseAdmin
  } = await import("./client.server-IqT0ZZNy.mjs");
  const {
    data
  } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId).eq("role", "super_admin").maybeSingle();
  if (!data) throw new Error("Forbidden");
}
const listBooks_createServerFn_handler = createServerRpc({
  id: "f5b6ee29111170bd39f20fb34febf3d2d98e3666516a2f5584027ceb0881cddc",
  name: "listBooks",
  filename: "src/lib/books.functions.ts"
}, (opts) => listBooks.__executeServer(opts));
const listBooks = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listBooks_createServerFn_handler, async ({
  context
}) => {
  await assertSuperAdmin(context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-IqT0ZZNy.mjs");
  const {
    data,
    error
  } = await supabaseAdmin.from("books_content").select("id, book_title, chapter_title, order_index, created_at").order("book_title").order("order_index");
  if (error) throw new Error(error.message);
  return data ?? [];
});
const chapterSchema = objectType({
  id: stringType().uuid().optional(),
  book_title: stringType().trim().min(1).max(300),
  chapter_title: stringType().trim().max(300).optional().nullable(),
  content_text: stringType().trim().min(1),
  order_index: numberType().int().min(0)
});
const saveChapter_createServerFn_handler = createServerRpc({
  id: "c429422d71e5c800b44b02321e9e43324f1e29fa70658bd4c97fffe72643f22d",
  name: "saveChapter",
  filename: "src/lib/books.functions.ts"
}, (opts) => saveChapter.__executeServer(opts));
const saveChapter = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => chapterSchema.parse(d)).handler(saveChapter_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertSuperAdmin(context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-IqT0ZZNy.mjs");
  if (data.id) {
    const {
      error
    } = await supabaseAdmin.from("books_content").update({
      book_title: data.book_title,
      chapter_title: data.chapter_title ?? null,
      content_text: data.content_text,
      order_index: data.order_index,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", data.id);
    if (error) throw new Error(error.message);
  } else {
    const {
      error
    } = await supabaseAdmin.from("books_content").insert({
      book_title: data.book_title,
      chapter_title: data.chapter_title ?? null,
      content_text: data.content_text,
      order_index: data.order_index
    });
    if (error) throw new Error(error.message);
  }
  return {
    ok: true
  };
});
const deleteChapter_createServerFn_handler = createServerRpc({
  id: "4ed937a7ac13aec98804bf324fb3ed866c82b4eb008f2ba6fd1fbf2ef649a916",
  name: "deleteChapter",
  filename: "src/lib/books.functions.ts"
}, (opts) => deleteChapter.__executeServer(opts));
const deleteChapter = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  id: stringType().uuid()
}).parse(d)).handler(deleteChapter_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertSuperAdmin(context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-IqT0ZZNy.mjs");
  const {
    error
  } = await supabaseAdmin.from("books_content").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  deleteChapter_createServerFn_handler,
  listBooks_createServerFn_handler,
  saveChapter_createServerFn_handler
};
