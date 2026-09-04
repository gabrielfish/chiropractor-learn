import { c as createServerRpc } from "./createServerRpc-D-AYw99j.mjs";
import { a as createServerFn } from "./server-BomfFVcN.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-dN1VnyDc.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, b as booleanType, e as enumType } from "../_libs/zod.mjs";
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
const profileSchema = objectType({
  full_name: stringType().trim().max(120).optional().nullable(),
  phone: stringType().trim().max(40).optional().nullable(),
  practice_name: stringType().trim().max(160).optional().nullable(),
  avatar_url: stringType().trim().max(500).optional().nullable()
});
const getMyProfile_createServerFn_handler = createServerRpc({
  id: "5dbf46616266e7bfe81c82694a91090a42de6200b3efc1b9d156faf41ac3a479",
  name: "getMyProfile",
  filename: "src/lib/profile.functions.ts"
}, (opts) => getMyProfile.__executeServer(opts));
const getMyProfile = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getMyProfile_createServerFn_handler, async ({
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-IqT0ZZNy.mjs");
  const {
    data,
    error
  } = await supabaseAdmin.from("profiles").select("id,email,full_name,phone,practice_name,avatar_url,email_notifications").eq("id", context.userId).maybeSingle();
  if (error) throw new Error(error.message);
  return {
    profile: data
  };
});
const updateMyProfile_createServerFn_handler = createServerRpc({
  id: "af00eb763dce352dc2f42ef901ef426a138feb40fdc7f79166552837a77fae5f",
  name: "updateMyProfile",
  filename: "src/lib/profile.functions.ts"
}, (opts) => updateMyProfile.__executeServer(opts));
const updateMyProfile = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => profileSchema.parse(d)).handler(updateMyProfile_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-IqT0ZZNy.mjs");
  const {
    error
  } = await supabaseAdmin.from("profiles").update(data).eq("id", context.userId);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const notifSchema = objectType({
  email_notifications: booleanType()
});
const updateNotifications_createServerFn_handler = createServerRpc({
  id: "2a2a85018ac6471b99dbfe8748a9a15f3c193c941d51323d2869d2f60dd40f13",
  name: "updateNotifications",
  filename: "src/lib/profile.functions.ts"
}, (opts) => updateNotifications.__executeServer(opts));
const updateNotifications = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => notifSchema.parse(d)).handler(updateNotifications_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    error
  } = await context.supabase.from("profiles").update(data).eq("id", context.userId);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const supportSchema = objectType({
  category: enumType(["Technical Issue", "Content Question", "Account Help", "Other"]),
  subject: stringType().trim().min(1).max(200),
  message: stringType().trim().min(1).max(5e3)
});
const submitSupportRequest_createServerFn_handler = createServerRpc({
  id: "1782e9f811ec1dcea017745f63e3ca1e92463df1980385c794916a3e92f57f2c",
  name: "submitSupportRequest",
  filename: "src/lib/profile.functions.ts"
}, (opts) => submitSupportRequest.__executeServer(opts));
const submitSupportRequest = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => supportSchema.parse(d)).handler(submitSupportRequest_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    error
  } = await context.supabase.from("support_requests").insert({
    member_id: context.userId,
    category: data.category,
    subject: data.subject,
    message: data.message
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const sendPasswordReset_createServerFn_handler = createServerRpc({
  id: "564db20e34473e00382e57191a7750414f29e434be0ce0d9b62d87a074dd8ac3",
  name: "sendPasswordReset",
  filename: "src/lib/profile.functions.ts"
}, (opts) => sendPasswordReset.__executeServer(opts));
const sendPasswordReset = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(sendPasswordReset_createServerFn_handler, async ({
  context
}) => {
  const {
    data: userData
  } = await context.supabase.auth.getUser();
  const email = userData.user?.email;
  if (!email) throw new Error("No email on account");
  const {
    error
  } = await context.supabase.auth.resetPasswordForEmail(email);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  getMyProfile_createServerFn_handler,
  sendPasswordReset_createServerFn_handler,
  submitSupportRequest_createServerFn_handler,
  updateMyProfile_createServerFn_handler,
  updateNotifications_createServerFn_handler
};
