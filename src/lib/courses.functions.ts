import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const lessonSchema = z.object({
  id: z.string().uuid().nullable(),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).nullable().optional(),
  content_type: z.enum(["video", "pdf", "text"]),
  video_url: z.string().trim().max(2000).nullable().optional(),
  pdf_url: z.string().trim().max(2000).nullable().optional(),
  text_content: z.string().trim().max(50000).nullable().optional(),
  order_index: z.number().int().min(0),
});

const moduleSchema = z.object({
  id: z.string().uuid().nullable(),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).nullable().optional(),
  order_index: z.number().int().min(0),
  lessons: z.array(lessonSchema),
});

const saveCourseSchema = z.object({
  id: z.string().uuid().nullable(),
  title: z.string().trim().min(1).max(300),
  description: z.string().trim().max(5000).nullable().optional(),
  thumbnail_url: z.string().trim().max(2000).nullable().optional(),
  category_id: z.string().uuid().nullable().optional(),
  display_author_name: z.string().trim().max(120).nullable().optional(),
  status: z.enum(["draft", "published"]),
  modules: z.array(moduleSchema),
});

const deleteCourseSchema = z.object({
  id: z.string().uuid(),
});

// ---------------------------------------------------------------------------
// saveCourse
// ---------------------------------------------------------------------------

export const saveCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => saveCourseSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Role check: super_admin or author
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    const roleList = (roles ?? []).map((r) => r.role);
    if (!roleList.includes("super_admin") && !roleList.includes("author")) {
      throw new Error("Forbidden");
    }

    const { supabaseAdmin: _supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabaseAdmin = _supabaseAdmin as any;

    // Upsert course
    let courseId: string;
    if (data.id === null) {
      const { data: inserted, error } = await supabaseAdmin
        .from("courses")
        .insert({
          title: data.title,
          description: data.description ?? null,
          thumbnail_url: data.thumbnail_url ?? null,
          category_id: data.category_id ?? null,
          display_author_name: data.display_author_name ?? "Dr Ryan Rieder",
          status: data.status,
          author_id: userId,
        } as Record<string, unknown>)
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      courseId = (inserted as { id: string }).id;
    } else {
      const { data: updated, error } = await supabaseAdmin
        .from("courses")
        .update({
          title: data.title,
          description: data.description ?? null,
          thumbnail_url: data.thumbnail_url ?? null,
          category_id: data.category_id ?? null,
          display_author_name: data.display_author_name ?? null,
          status: data.status,
        } as Record<string, unknown>)
        .eq("id", data.id)
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      courseId = (updated as { id: string }).id;
    }

    // Fetch existing module IDs for this course
    const { data: existingModules, error: modFetchErr } = await supabaseAdmin
      .from("course_modules")
      .select("id")
      .eq("course_id", courseId);
    if (modFetchErr) throw new Error(modFetchErr.message);
    const existingModuleIds = new Set((existingModules ?? []).map((m: { id: string }) => m.id));

    const keptModuleIds: string[] = [];

    for (const mod of data.modules) {
      let moduleId: string;

      if (mod.id && existingModuleIds.has(mod.id)) {
        // UPDATE
        const { error } = await supabaseAdmin
          .from("course_modules")
          .update({
            title: mod.title,
            description: mod.description ?? null,
            order_index: mod.order_index,
          } as Record<string, unknown>)
          .eq("id", mod.id);
        if (error) throw new Error(error.message);
        moduleId = mod.id;
      } else {
        // INSERT
        const { data: insertedMod, error } = await supabaseAdmin
          .from("course_modules")
          .insert({
            course_id: courseId,
            title: mod.title,
            description: mod.description ?? null,
            order_index: mod.order_index,
          } as Record<string, unknown>)
          .select("id")
          .single();
        if (error) throw new Error(error.message);
        moduleId = (insertedMod as { id: string }).id;
      }

      keptModuleIds.push(moduleId);

      // Fetch existing lesson IDs for this module
      const { data: existingLessons, error: lessonFetchErr } = await supabaseAdmin
        .from("course_lessons")
        .select("id")
        .eq("module_id", moduleId);
      if (lessonFetchErr) throw new Error(lessonFetchErr.message);
      const existingLessonIds = new Set((existingLessons ?? []).map((l: { id: string }) => l.id));

      const keptLessonIds: string[] = [];

      for (const lesson of mod.lessons) {
        let lessonId: string;

        if (lesson.id && existingLessonIds.has(lesson.id)) {
          // UPDATE
          const { error } = await supabaseAdmin
            .from("course_lessons")
            .update({
              title: lesson.title,
              description: lesson.description ?? null,
              content_type: lesson.content_type,
              video_url: lesson.video_url ?? null,
              pdf_url: lesson.pdf_url ?? null,
              text_content: lesson.text_content ?? null,
              order_index: lesson.order_index,
            } as Record<string, unknown>)
            .eq("id", lesson.id);
          if (error) throw new Error(error.message);
          lessonId = lesson.id;
        } else {
          // INSERT
          const { data: insertedLesson, error } = await supabaseAdmin
            .from("course_lessons")
            .insert({
              module_id: moduleId,
              course_id: courseId,
              title: lesson.title,
              description: lesson.description ?? null,
              content_type: lesson.content_type,
              video_url: lesson.video_url ?? null,
              pdf_url: lesson.pdf_url ?? null,
              text_content: lesson.text_content ?? null,
              order_index: lesson.order_index,
            } as Record<string, unknown>)
            .select("id")
            .single();
          if (error) throw new Error(error.message);
          lessonId = (insertedLesson as { id: string }).id;
        }

        keptLessonIds.push(lessonId);
      }

      // Delete removed lessons for this module
      if (keptLessonIds.length > 0) {
        const { error } = await supabaseAdmin
          .from("course_lessons")
          .delete()
          .eq("module_id", moduleId)
          .not("id", "in", `(${keptLessonIds.join(",")})`)
        if (error) throw new Error(error.message);
      } else {
        // Delete all lessons for this module if none kept
        const { error } = await supabaseAdmin
          .from("course_lessons")
          .delete()
          .eq("module_id", moduleId);
        if (error) throw new Error(error.message);
      }
    }

    // Delete removed modules for this course
    if (keptModuleIds.length > 0) {
      const { error } = await supabaseAdmin
        .from("course_modules")
        .delete()
        .eq("course_id", courseId)
        .not("id", "in", `(${keptModuleIds.join(",")})`)
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin
        .from("course_modules")
        .delete()
        .eq("course_id", courseId);
      if (error) throw new Error(error.message);
    }

    return { ok: true, courseId };
  });

// ---------------------------------------------------------------------------
// listAdminCourses
// ---------------------------------------------------------------------------

export const listAdminCourses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    const roleList = (roles ?? []).map((r) => r.role);
    const isSuperAdmin = roleList.includes("super_admin");
    const isAuthor = roleList.includes("author");

    if (!isSuperAdmin && !isAuthor) {
      throw new Error("Forbidden");
    }

    const { supabaseAdmin: _supabaseAdmin2 } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabaseAdmin = _supabaseAdmin2 as any;

    // Fetch courses — all for super_admin, own for author-only
    let query = supabaseAdmin
      .from("courses")
      .select("id, title, status, display_author_name, created_at, author_id, categories(name)");

    if (!isSuperAdmin) {
      query = query.eq("author_id", userId);
    }

    const { data: courses, error: coursesErr } = await query.order("created_at", { ascending: false });
    if (coursesErr) throw new Error(coursesErr.message);

    if (!courses || courses.length === 0) return { courses: [] };

    const courseIds = courses.map((c: { id: string }) => c.id);

    // Count modules per course
    const { data: moduleRows } = await supabaseAdmin
      .from("course_modules")
      .select("course_id")
      .in("course_id", courseIds);

    const moduleCountMap = new Map<string, number>();
    for (const m of moduleRows ?? []) {
      const k = m.course_id as string;
      moduleCountMap.set(k, (moduleCountMap.get(k) ?? 0) + 1);
    }

    // Get module IDs to count lessons
    const moduleIds = (moduleRows ?? []).map((m: { id?: string }) => m.id).filter(Boolean) as string[];

    let lessonCountByCourse = new Map<string, number>();
    if (moduleIds.length > 0) {
      // Re-fetch modules with their ids and course_id
      const { data: modulesWithIds } = await supabaseAdmin
        .from("course_modules")
        .select("id, course_id")
        .in("course_id", courseIds);

      const moduleIdToCourseId = new Map<string, string>();
      for (const m of modulesWithIds ?? []) {
        moduleIdToCourseId.set(m.id as string, m.course_id as string);
      }

      const allModuleIds = (modulesWithIds ?? []).map((m: { id: string }) => m.id);

      if (allModuleIds.length > 0) {
        const { data: lessonRows } = await supabaseAdmin
          .from("course_lessons")
          .select("module_id")
          .in("module_id", allModuleIds);

        for (const l of lessonRows ?? []) {
          const modId = l.module_id as string;
          const cId = moduleIdToCourseId.get(modId);
          if (cId) {
            lessonCountByCourse.set(cId, (lessonCountByCourse.get(cId) ?? 0) + 1);
          }
        }
      }
    }

    return {
      courses: courses.map((c: { id: string; title: string; status: string; display_author_name: string | null; categories: { name?: string } | null; created_at: string; author_id: string }) => {
        const cat = c.categories;
        return {
          id: c.id as string,
          title: c.title as string,
          status: c.status as string,
          display_author_name: (c.display_author_name as string | null) ?? null,
          category_name: cat?.name ?? null,
          module_count: moduleCountMap.get(c.id as string) ?? 0,
          lesson_count: lessonCountByCourse.get(c.id as string) ?? 0,
          created_at: c.created_at as string,
        };
      }),
    };
  });

// ---------------------------------------------------------------------------
// deleteCourse
// ---------------------------------------------------------------------------

export const deleteCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => deleteCourseSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    if (!(roles ?? []).some((r) => r.role === "super_admin")) {
      throw new Error("Forbidden");
    }

    const { supabaseAdmin: _supabaseAdmin3 } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabaseAdmin = _supabaseAdmin3 as any;

    const { error } = await supabaseAdmin
      .from("courses")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);

    return { ok: true };
  });
