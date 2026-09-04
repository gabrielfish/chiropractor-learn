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
async function upsertCertificate(db, userId, userName, type, referenceId, referenceName) {
  const {
    data: existing,
    error: selectErr
  } = await db.from("certificates").select("id").eq("user_id", userId).eq("type", type).eq("reference_id", referenceId).maybeSingle();
  if (selectErr) {
    console.error("[cert:upsert] SELECT existing error:", JSON.stringify(selectErr));
  }
  if (existing) {
    console.log("[cert:upsert] certificate already exists:", existing.id);
    return {
      issued: false,
      certificateId: existing.id
    };
  }
  console.log("[cert:upsert] inserting certificate — userId:", userId, "type:", type, "referenceId:", referenceId);
  const {
    data,
    error
  } = await db.from("certificates").insert({
    user_id: userId,
    user_name: userName,
    type,
    reference_id: referenceId,
    reference_name: referenceName
  }).select("id").single();
  if (error) {
    console.error("[cert:upsert] INSERT error code:", error.code, "message:", error.message, "details:", error.details, "hint:", error.hint);
    throw error;
  }
  console.log("[cert:upsert] certificate inserted successfully:", data.id);
  return {
    issued: true,
    certificateId: data.id
  };
}
const checkAndIssueCourse_createServerFn_handler = createServerRpc({
  id: "ca907afd7154926c0643ad4efb0b37c995ebff273cf9f64b283c5fcbfe3959fa",
  name: "checkAndIssueCourse",
  filename: "src/lib/certificates.functions.ts"
}, (opts) => checkAndIssueCourse.__executeServer(opts));
const checkAndIssueCourse = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  courseId: stringType().uuid()
}).parse(input)).handler(checkAndIssueCourse_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    userId
  } = context;
  console.log("[cert:course] START — userId:", userId, "courseId:", data.courseId);
  const {
    supabaseAdmin
  } = await import("./client.server-IqT0ZZNy.mjs");
  const db = supabaseAdmin;
  const {
    data: profile,
    error: profileErr
  } = await supabaseAdmin.from("profiles").select("full_name").eq("id", userId).maybeSingle();
  if (profileErr) console.error("[cert:course] profile fetch error:", profileErr);
  const userName = profile?.full_name ?? "Member";
  console.log("[cert:course] userName:", userName);
  const {
    data: course,
    error: courseErr
  } = await db.from("courses").select("id,title").eq("id", data.courseId).single();
  if (courseErr) console.error("[cert:course] course fetch error:", courseErr);
  if (!course) {
    console.log("[cert:course] course not found — aborting");
    return {
      issued: false,
      certificateId: null
    };
  }
  console.log("[cert:course] course title:", course.title);
  const {
    data: modules,
    error: modulesErr
  } = await db.from("course_modules").select("id").eq("course_id", data.courseId);
  if (modulesErr) console.error("[cert:course] modules fetch error:", modulesErr);
  const moduleIds = (modules ?? []).map((m) => m.id);
  console.log("[cert:course] moduleIds:", moduleIds);
  if (!moduleIds.length) {
    console.log("[cert:course] no modules — aborting");
    return {
      issued: false,
      certificateId: null
    };
  }
  const {
    count: totalLessons,
    error: totalErr
  } = await db.from("course_lessons").select("id", {
    count: "exact",
    head: true
  }).in("module_id", moduleIds);
  if (totalErr) console.error("[cert:course] totalLessons count error:", totalErr);
  console.log("[cert:course] totalLessons:", totalLessons);
  if (!totalLessons) {
    console.log("[cert:course] totalLessons=0 — aborting");
    return {
      issued: false,
      certificateId: null
    };
  }
  const {
    count: completedLessons,
    error: completedErr
  } = await db.from("course_progress").select("course_lesson_id", {
    count: "exact",
    head: true
  }).eq("user_id", userId).eq("course_id", data.courseId);
  if (completedErr) console.error("[cert:course] completedLessons count error:", completedErr);
  console.log("[cert:course] completedLessons:", completedLessons, "/ totalLessons:", totalLessons);
  if ((completedLessons ?? 0) < totalLessons) {
    console.log("[cert:course] not all lessons complete — not issuing certificate");
    return {
      issued: false,
      certificateId: null
    };
  }
  console.log("[cert:course] all lessons complete — calling upsertCertificate");
  const result = await upsertCertificate(db, userId, userName, "course", data.courseId, course.title);
  console.log("[cert:course] upsertCertificate result:", result);
  return result;
});
const checkAndIssueCategory_createServerFn_handler = createServerRpc({
  id: "443b7b2b6c237a7e86d2f03f69c45da71ac37428d371c90b7e4ba12a3a2f0e89",
  name: "checkAndIssueCategory",
  filename: "src/lib/certificates.functions.ts"
}, (opts) => checkAndIssueCategory.__executeServer(opts));
const checkAndIssueCategory = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  contentId: stringType().uuid()
}).parse(input)).handler(checkAndIssueCategory_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    userId
  } = context;
  const {
    supabaseAdmin
  } = await import("./client.server-IqT0ZZNy.mjs");
  const db = supabaseAdmin;
  const {
    data: profile
  } = await supabaseAdmin.from("profiles").select("full_name").eq("id", userId).maybeSingle();
  const userName = profile?.full_name ?? "Member";
  const {
    data: content
  } = await supabaseAdmin.from("content").select("category_id, category:categories(id,name)").eq("id", data.contentId).maybeSingle();
  const category = content?.category;
  if (!category) return {
    issued: false,
    certificateId: null,
    categoryName: null
  };
  const {
    count: totalCount
  } = await supabaseAdmin.from("content").select("id", {
    count: "exact",
    head: true
  }).eq("category_id", category.id).eq("status", "published");
  if (!totalCount) return {
    issued: false,
    certificateId: null,
    categoryName: category.name
  };
  const {
    data: categoryContent
  } = await supabaseAdmin.from("content").select("id").eq("category_id", category.id).eq("status", "published");
  const categoryContentIds = (categoryContent ?? []).map((c) => c.id);
  const {
    count: completedCount
  } = await supabaseAdmin.from("progress").select("id", {
    count: "exact",
    head: true
  }).eq("user_id", userId).eq("completed", true).in("content_id", categoryContentIds);
  if ((completedCount ?? 0) < totalCount) {
    return {
      issued: false,
      certificateId: null,
      categoryName: category.name
    };
  }
  const result = await upsertCertificate(db, userId, userName, "category", category.id, category.name);
  return {
    ...result,
    categoryName: category.name
  };
});
const getMyCertificates_createServerFn_handler = createServerRpc({
  id: "2f6381d8b4aa45f8e1f0857553ceaa9bf61a8ff4b8296eb2a5512f2e6830b70d",
  name: "getMyCertificates",
  filename: "src/lib/certificates.functions.ts"
}, (opts) => getMyCertificates.__executeServer(opts));
const getMyCertificates = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(getMyCertificates_createServerFn_handler, async ({
  context
}) => {
  const {
    userId
  } = context;
  const {
    supabaseAdmin
  } = await import("./client.server-IqT0ZZNy.mjs");
  const db = supabaseAdmin;
  const {
    data,
    error
  } = await db.from("certificates").select("id, type, reference_name, issued_at").eq("user_id", userId).order("issued_at", {
    ascending: false
  });
  if (error) throw error;
  return data ?? [];
});
const debugCourseProgress_createServerFn_handler = createServerRpc({
  id: "708f5e1b78e2361d479cad50ac70ea32d645b7ce04bc1addcf5a8e44ab5f2b13",
  name: "debugCourseProgress",
  filename: "src/lib/certificates.functions.ts"
}, (opts) => debugCourseProgress.__executeServer(opts));
const debugCourseProgress = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  courseId: stringType().uuid()
}).parse(input)).handler(debugCourseProgress_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    userId
  } = context;
  const {
    supabaseAdmin
  } = await import("./client.server-IqT0ZZNy.mjs");
  const db = supabaseAdmin;
  const {
    data: modules
  } = await db.from("course_modules").select("id").eq("course_id", data.courseId);
  const moduleIds = (modules ?? []).map((m) => m.id);
  const {
    count: totalLessons,
    error: totalErr
  } = await db.from("course_lessons").select("id", {
    count: "exact",
    head: true
  }).in("module_id", moduleIds);
  const {
    count: completedLessons,
    error: completedErr
  } = await db.from("course_progress").select("course_lesson_id", {
    count: "exact",
    head: true
  }).eq("user_id", userId).eq("course_id", data.courseId);
  const {
    data: existingCert
  } = await db.from("certificates").select("id,issued_at").eq("user_id", userId).eq("type", "course").eq("reference_id", data.courseId).maybeSingle();
  return {
    userId,
    courseId: data.courseId,
    moduleCount: moduleIds.length,
    totalLessons,
    totalLessonsError: totalErr?.message ?? null,
    completedLessons,
    completedLessonsError: completedErr?.message ?? null,
    allComplete: (completedLessons ?? 0) >= (totalLessons ?? 1),
    existingCertificate: existingCert ?? null
  };
});
const getCertificatePublic_createServerFn_handler = createServerRpc({
  id: "e96cd38371d9d0f9d9d2de0544899f061ac569b39948ef7d4d6f37fcb0ed4d3d",
  name: "getCertificatePublic",
  filename: "src/lib/certificates.functions.ts"
}, (opts) => getCertificatePublic.__executeServer(opts));
const getCertificatePublic = createServerFn({
  method: "POST"
}).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(getCertificatePublic_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-IqT0ZZNy.mjs");
  const db = supabaseAdmin;
  const {
    data: cert,
    error
  } = await db.from("certificates").select("id, user_name, type, reference_name, reference_id, issued_at").eq("id", data.id).maybeSingle();
  if (error) throw error;
  if (!cert) return null;
  let referenceDescription = null;
  if (cert.type === "course") {
    const {
      data: course
    } = await db.from("courses").select("description").eq("id", cert.reference_id).maybeSingle();
    referenceDescription = course?.description ?? null;
  }
  return {
    id: cert.id,
    user_name: cert.user_name,
    type: cert.type,
    reference_name: cert.reference_name,
    reference_description: referenceDescription,
    issued_at: cert.issued_at
  };
});
export {
  checkAndIssueCategory_createServerFn_handler,
  checkAndIssueCourse_createServerFn_handler,
  debugCourseProgress_createServerFn_handler,
  getCertificatePublic_createServerFn_handler,
  getMyCertificates_createServerFn_handler
};
