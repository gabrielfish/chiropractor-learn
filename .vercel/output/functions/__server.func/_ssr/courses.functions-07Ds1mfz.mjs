import { c as createServerRpc } from "./createServerRpc-D-AYw99j.mjs";
import { a as createServerFn } from "./server-BomfFVcN.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-dN1VnyDc.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, n as numberType, s as stringType, e as enumType, a as arrayType } from "../_libs/zod.mjs";
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
const lessonSchema = objectType({
  id: stringType().uuid().nullable(),
  title: stringType().trim().min(1).max(200),
  description: stringType().trim().max(2e3).nullable().optional(),
  content_type: enumType(["video", "pdf", "text"]),
  video_url: stringType().trim().max(2e3).nullable().optional(),
  pdf_url: stringType().trim().max(2e3).nullable().optional(),
  text_content: stringType().trim().max(5e4).nullable().optional(),
  order_index: numberType().int().min(0)
});
const moduleSchema = objectType({
  id: stringType().uuid().nullable(),
  title: stringType().trim().min(1).max(200),
  description: stringType().trim().max(2e3).nullable().optional(),
  order_index: numberType().int().min(0),
  lessons: arrayType(lessonSchema)
});
const saveCourseSchema = objectType({
  id: stringType().uuid().nullable(),
  title: stringType().trim().min(1).max(300),
  description: stringType().trim().max(5e3).nullable().optional(),
  thumbnail_url: stringType().trim().max(2e3).nullable().optional(),
  category_id: stringType().uuid().nullable().optional(),
  display_author_name: stringType().trim().max(120).nullable().optional(),
  status: enumType(["draft", "published"]),
  modules: arrayType(moduleSchema)
});
const deleteCourseSchema = objectType({
  id: stringType().uuid()
});
const saveCourse_createServerFn_handler = createServerRpc({
  id: "303b702e8ad651844f252c7c77d8a1cdb39da0b55118d0aeba8a89d87a861e47",
  name: "saveCourse",
  filename: "src/lib/courses.functions.ts"
}, (opts) => saveCourse.__executeServer(opts));
const saveCourse = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => saveCourseSchema.parse(input)).handler(saveCourse_createServerFn_handler, async ({
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
  const roleList = (roles ?? []).map((r) => r.role);
  if (!roleList.includes("super_admin") && !roleList.includes("author")) {
    throw new Error("Forbidden");
  }
  const {
    supabaseAdmin: _supabaseAdmin
  } = await import("./client.server-IqT0ZZNy.mjs");
  const supabaseAdmin = _supabaseAdmin;
  if (data.id === null) {
    const {
      data: existing
    } = await supabaseAdmin.from("courses").select("id").eq("author_id", userId).ilike("title", data.title.trim()).limit(1).maybeSingle();
    if (existing) {
      throw new Error(`A course named "${data.title}" already exists. Edit it from the Library.`);
    }
  }
  let courseId;
  if (data.id === null) {
    const {
      data: inserted,
      error
    } = await supabaseAdmin.from("courses").insert({
      title: data.title,
      description: data.description ?? null,
      thumbnail_url: data.thumbnail_url ?? null,
      category_id: data.category_id ?? null,
      display_author_name: data.display_author_name ?? "Dr Ryan Rieder",
      status: data.status,
      author_id: userId
    }).select("id").single();
    if (error) throw new Error(error.message);
    courseId = inserted.id;
  } else {
    const {
      data: updated,
      error
    } = await supabaseAdmin.from("courses").update({
      title: data.title,
      description: data.description ?? null,
      thumbnail_url: data.thumbnail_url ?? null,
      category_id: data.category_id ?? null,
      display_author_name: data.display_author_name ?? null,
      status: data.status
    }).eq("id", data.id).select("id").single();
    if (error) throw new Error(error.message);
    courseId = updated.id;
  }
  const {
    data: existingModules,
    error: modFetchErr
  } = await supabaseAdmin.from("course_modules").select("id").eq("course_id", courseId);
  if (modFetchErr) throw new Error(modFetchErr.message);
  const existingModuleIds = new Set((existingModules ?? []).map((m) => m.id));
  const keptModuleIds = [];
  for (const mod of data.modules) {
    let moduleId;
    if (mod.id && existingModuleIds.has(mod.id)) {
      const {
        error
      } = await supabaseAdmin.from("course_modules").update({
        title: mod.title,
        description: mod.description ?? null,
        order_index: mod.order_index
      }).eq("id", mod.id);
      if (error) throw new Error(error.message);
      moduleId = mod.id;
    } else {
      const {
        data: insertedMod,
        error
      } = await supabaseAdmin.from("course_modules").insert({
        course_id: courseId,
        title: mod.title,
        description: mod.description ?? null,
        order_index: mod.order_index
      }).select("id").single();
      if (error) throw new Error(error.message);
      moduleId = insertedMod.id;
    }
    keptModuleIds.push(moduleId);
    const {
      data: existingLessons,
      error: lessonFetchErr
    } = await supabaseAdmin.from("course_lessons").select("id").eq("module_id", moduleId);
    if (lessonFetchErr) throw new Error(lessonFetchErr.message);
    const existingLessonIds = new Set((existingLessons ?? []).map((l) => l.id));
    const keptLessonIds = [];
    for (const lesson of mod.lessons) {
      let lessonId;
      if (lesson.id && existingLessonIds.has(lesson.id)) {
        const {
          error
        } = await supabaseAdmin.from("course_lessons").update({
          title: lesson.title,
          description: lesson.description ?? null,
          content_type: lesson.content_type,
          video_url: lesson.video_url ?? null,
          pdf_url: lesson.pdf_url ?? null,
          text_content: lesson.text_content ?? null,
          order_index: lesson.order_index
        }).eq("id", lesson.id);
        if (error) throw new Error(error.message);
        lessonId = lesson.id;
      } else {
        const {
          data: insertedLesson,
          error
        } = await supabaseAdmin.from("course_lessons").insert({
          module_id: moduleId,
          course_id: courseId,
          title: lesson.title,
          description: lesson.description ?? null,
          content_type: lesson.content_type,
          video_url: lesson.video_url ?? null,
          pdf_url: lesson.pdf_url ?? null,
          text_content: lesson.text_content ?? null,
          order_index: lesson.order_index
        }).select("id").single();
        if (error) throw new Error(error.message);
        lessonId = insertedLesson.id;
      }
      keptLessonIds.push(lessonId);
    }
    if (keptLessonIds.length > 0) {
      const {
        error
      } = await supabaseAdmin.from("course_lessons").delete().eq("module_id", moduleId).not("id", "in", `(${keptLessonIds.join(",")})`);
      if (error) throw new Error(error.message);
    } else {
      const {
        error
      } = await supabaseAdmin.from("course_lessons").delete().eq("module_id", moduleId);
      if (error) throw new Error(error.message);
    }
  }
  if (keptModuleIds.length > 0) {
    const {
      error
    } = await supabaseAdmin.from("course_modules").delete().eq("course_id", courseId).not("id", "in", `(${keptModuleIds.join(",")})`);
    if (error) throw new Error(error.message);
  } else {
    const {
      error
    } = await supabaseAdmin.from("course_modules").delete().eq("course_id", courseId);
    if (error) throw new Error(error.message);
  }
  return {
    ok: true,
    courseId
  };
});
const listAdminCourses_createServerFn_handler = createServerRpc({
  id: "132dd310d19cf0eec5e5ecf14ec409903610a795ec02ff8bf96fdbca9bd1ea77",
  name: "listAdminCourses",
  filename: "src/lib/courses.functions.ts"
}, (opts) => listAdminCourses.__executeServer(opts));
const listAdminCourses = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listAdminCourses_createServerFn_handler, async ({
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
  const isSuperAdmin = roleList.includes("super_admin");
  const isAuthor = roleList.includes("author");
  if (!isSuperAdmin && !isAuthor) {
    throw new Error("Forbidden");
  }
  const {
    supabaseAdmin: _supabaseAdmin2
  } = await import("./client.server-IqT0ZZNy.mjs");
  const supabaseAdmin = _supabaseAdmin2;
  let query = supabaseAdmin.from("courses").select("id, title, status, display_author_name, created_at, author_id, categories(name)");
  if (!isSuperAdmin) {
    query = query.eq("author_id", userId);
  }
  const {
    data: courses,
    error: coursesErr
  } = await query.order("created_at", {
    ascending: false
  });
  if (coursesErr) throw new Error(coursesErr.message);
  if (!courses || courses.length === 0) return {
    courses: []
  };
  const courseIds = courses.map((c) => c.id);
  const {
    data: moduleRows
  } = await supabaseAdmin.from("course_modules").select("course_id").in("course_id", courseIds);
  const moduleCountMap = /* @__PURE__ */ new Map();
  for (const m of moduleRows ?? []) {
    const k = m.course_id;
    moduleCountMap.set(k, (moduleCountMap.get(k) ?? 0) + 1);
  }
  const moduleIds = (moduleRows ?? []).map((m) => m.id).filter(Boolean);
  let lessonCountByCourse = /* @__PURE__ */ new Map();
  if (moduleIds.length > 0) {
    const {
      data: modulesWithIds
    } = await supabaseAdmin.from("course_modules").select("id, course_id").in("course_id", courseIds);
    const moduleIdToCourseId = /* @__PURE__ */ new Map();
    for (const m of modulesWithIds ?? []) {
      moduleIdToCourseId.set(m.id, m.course_id);
    }
    const allModuleIds = (modulesWithIds ?? []).map((m) => m.id);
    if (allModuleIds.length > 0) {
      const {
        data: lessonRows
      } = await supabaseAdmin.from("course_lessons").select("module_id").in("module_id", allModuleIds);
      for (const l of lessonRows ?? []) {
        const modId = l.module_id;
        const cId = moduleIdToCourseId.get(modId);
        if (cId) {
          lessonCountByCourse.set(cId, (lessonCountByCourse.get(cId) ?? 0) + 1);
        }
      }
    }
  }
  return {
    courses: courses.map((c) => {
      const cat = c.categories;
      return {
        id: c.id,
        title: c.title,
        status: c.status,
        display_author_name: c.display_author_name ?? null,
        category_name: cat?.name ?? null,
        module_count: moduleCountMap.get(c.id) ?? 0,
        lesson_count: lessonCountByCourse.get(c.id) ?? 0,
        created_at: c.created_at
      };
    })
  };
});
const deleteCourse_createServerFn_handler = createServerRpc({
  id: "398a5874789098e47ced66f8e6b8370109c861aefb975c8725f6a6aa92e62ea2",
  name: "deleteCourse",
  filename: "src/lib/courses.functions.ts"
}, (opts) => deleteCourse.__executeServer(opts));
const deleteCourse = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => deleteCourseSchema.parse(input)).handler(deleteCourse_createServerFn_handler, async ({
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
    supabaseAdmin: _supabaseAdmin3
  } = await import("./client.server-IqT0ZZNy.mjs");
  const supabaseAdmin = _supabaseAdmin3;
  const {
    error
  } = await supabaseAdmin.from("courses").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  deleteCourse_createServerFn_handler,
  listAdminCourses_createServerFn_handler,
  saveCourse_createServerFn_handler
};
