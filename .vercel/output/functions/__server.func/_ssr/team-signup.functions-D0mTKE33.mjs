import { c as createServerRpc } from "./createServerRpc-D-AYw99j.mjs";
import { a as createServerFn } from "./server-BomfFVcN.mjs";
import { s as sendAdminNewTeamMemberEmail } from "./notify.functions-C2jnqAvX.mjs";
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
import "./createSsrRpc-Bc62EJ78.mjs";
import "./auth-middleware-dN1VnyDc.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const schema = objectType({
  fullName: stringType().trim().min(1).max(120),
  email: stringType().trim().email().max(255),
  password: stringType().min(8).max(200),
  phone: stringType().trim().max(40).nullable().optional(),
  practice: stringType().trim().max(200).nullable().optional(),
  accessCode: stringType().min(1).max(200)
});
const teamSignup_createServerFn_handler = createServerRpc({
  id: "da76528b7c67b1041ecd244ad65e5dc3d2f5f5519fba5a29cb72fc9ab5cad5bf",
  name: "teamSignup",
  filename: "src/lib/team-signup.functions.ts"
}, (opts) => teamSignup.__executeServer(opts));
const teamSignup = createServerFn({
  method: "POST"
}).inputValidator((input) => schema.parse(input)).handler(teamSignup_createServerFn_handler, async ({
  data
}) => {
  const expected = process.env.TEAM_ACCESS_CODE;
  if (!expected) throw new Error("Team signup is not configured");
  if (data.accessCode.trim() !== expected) {
    throw new Error("Invalid access code - contact your DCPG admin.");
  }
  const {
    supabaseAdmin
  } = await import("./client.server-IqT0ZZNy.mjs");
  const {
    data: created,
    error: createErr
  } = await supabaseAdmin.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true,
    user_metadata: {
      full_name: data.fullName,
      phone: data.phone ?? null,
      practice_name: data.practice ?? null
    }
  });
  if (createErr || !created.user) {
    throw new Error(createErr?.message ?? "Could not create account");
  }
  const userId = created.user.id;
  await supabaseAdmin.from("user_roles").delete().eq("user_id", userId).eq("role", "member");
  const {
    error: roleErr
  } = await supabaseAdmin.from("user_roles").insert({
    user_id: userId,
    role: "author"
  });
  if (roleErr) throw new Error(roleErr.message);
  sendAdminNewTeamMemberEmail({
    fullName: data.fullName,
    email: data.email,
    practiceName: data.practice ?? null
  }).catch((err) => {
    console.error("[team-signup] admin notification failed:", err);
  });
  return {
    ok: true,
    userId
  };
});
export {
  teamSignup_createServerFn_handler
};
