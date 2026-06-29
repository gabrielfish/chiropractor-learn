import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

// ─── Shared helper ────────────────────────────────────────────────────────────

async function upsertCertificate(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any,
  userId: string,
  userName: string,
  type: "course" | "category",
  referenceId: string,
  referenceName: string,
): Promise<{ issued: boolean; certificateId: string | null }> {
  // Check for existing certificate first (idempotent)
  const { data: existing, error: selectErr } = await db
    .from("certificates")
    .select("id")
    .eq("user_id", userId)
    .eq("type", type)
    .eq("reference_id", referenceId)
    .maybeSingle();

  if (selectErr) {
    console.error("[cert:upsert] SELECT existing error:", JSON.stringify(selectErr));
  }

  if (existing) {
    console.log("[cert:upsert] certificate already exists:", existing.id);
    return { issued: false, certificateId: existing.id as string };
  }

  console.log("[cert:upsert] inserting certificate — userId:", userId, "type:", type, "referenceId:", referenceId);

  const { data, error } = await db
    .from("certificates")
    .insert({ user_id: userId, user_name: userName, type, reference_id: referenceId, reference_name: referenceName })
    .select("id")
    .single();

  if (error) {
    console.error("[cert:upsert] INSERT error code:", error.code, "message:", error.message, "details:", error.details, "hint:", error.hint);
    throw error;
  }

  console.log("[cert:upsert] certificate inserted successfully:", data.id);
  return { issued: true, certificateId: data.id as string };
}

// ─── Check and issue course certificate ───────────────────────────────────────

export const checkAndIssueCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ courseId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { userId } = context;
    console.log("[cert:course] START — userId:", userId, "courseId:", data.courseId);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any;

    // Get user's display name
    const { data: profile, error: profileErr } = await supabaseAdmin
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .maybeSingle();
    if (profileErr) console.error("[cert:course] profile fetch error:", profileErr);
    const userName = (profile as { full_name?: string | null } | null)?.full_name ?? "Member";
    console.log("[cert:course] userName:", userName);

    // Get course
    const { data: course, error: courseErr } = await db
      .from("courses").select("id,title").eq("id", data.courseId).single();
    if (courseErr) console.error("[cert:course] course fetch error:", courseErr);
    if (!course) { console.log("[cert:course] course not found — aborting"); return { issued: false, certificateId: null }; }
    console.log("[cert:course] course title:", course.title);

    // Get modules
    const { data: modules, error: modulesErr } = await db
      .from("course_modules").select("id").eq("course_id", data.courseId);
    if (modulesErr) console.error("[cert:course] modules fetch error:", modulesErr);
    const moduleIds = ((modules ?? []) as { id: string }[]).map((m) => m.id);
    console.log("[cert:course] moduleIds:", moduleIds);
    if (!moduleIds.length) { console.log("[cert:course] no modules — aborting"); return { issued: false, certificateId: null }; }

    // Count total lessons
    const { count: totalLessons, error: totalErr } = await db
      .from("course_lessons")
      .select("id", { count: "exact", head: true })
      .in("module_id", moduleIds);
    if (totalErr) console.error("[cert:course] totalLessons count error:", totalErr);
    console.log("[cert:course] totalLessons:", totalLessons);
    if (!totalLessons) { console.log("[cert:course] totalLessons=0 — aborting"); return { issued: false, certificateId: null }; }

    // Count completed lessons — select ALL rows for this user+course (every row = a completed lesson)
    const { count: completedLessons, error: completedErr } = await db
      .from("course_progress")
      .select("course_lesson_id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("course_id", data.courseId);
    if (completedErr) console.error("[cert:course] completedLessons count error:", completedErr);
    console.log("[cert:course] completedLessons:", completedLessons, "/ totalLessons:", totalLessons);

    if ((completedLessons ?? 0) < totalLessons) {
      console.log("[cert:course] not all lessons complete — not issuing certificate");
      return { issued: false, certificateId: null };
    }

    console.log("[cert:course] all lessons complete — calling upsertCertificate");
    const result = await upsertCertificate(db, userId, userName, "course", data.courseId, course.title);
    console.log("[cert:course] upsertCertificate result:", result);
    return result;
  });

// ─── Check and issue category certificate ────────────────────────────────────

export const checkAndIssueCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ contentId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any;

    // Get user's display name
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .maybeSingle();
    const userName = (profile as { full_name?: string | null } | null)?.full_name ?? "Member";

    // Get the content item's category
    const { data: content } = await supabaseAdmin
      .from("content")
      .select("category_id, category:categories(id,name)")
      .eq("id", data.contentId)
      .maybeSingle();

    const category = (content as { category?: { id: string; name: string } | null } | null)?.category;
    if (!category) return { issued: false, certificateId: null, categoryName: null };

    // Count total published content in the category
    const { count: totalCount } = await supabaseAdmin
      .from("content")
      .select("id", { count: "exact", head: true })
      .eq("category_id", category.id)
      .eq("status", "published");

    if (!totalCount) return { issued: false, certificateId: null, categoryName: category.name };

    // Get all content IDs in this category
    const { data: categoryContent } = await supabaseAdmin
      .from("content")
      .select("id")
      .eq("category_id", category.id)
      .eq("status", "published");

    const categoryContentIds = ((categoryContent ?? []) as { id: string }[]).map((c) => c.id);

    // Count how many the user has completed in this category
    const { count: completedCount } = await supabaseAdmin
      .from("progress")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("completed", true)
      .in("content_id", categoryContentIds);

    if ((completedCount ?? 0) < totalCount) {
      return { issued: false, certificateId: null, categoryName: category.name };
    }

    const result = await upsertCertificate(
      db,
      userId,
      userName,
      "category",
      category.id,
      category.name,
    );
    return { ...result, categoryName: category.name };
  });

// ─── Get my certificates ──────────────────────────────────────────────────────

export const getMyCertificates = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any;
    const { data, error } = await db
      .from("certificates")
      .select("id, type, reference_name, issued_at")
      .eq("user_id", userId)
      .order("issued_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as { id: string; type: string; reference_name: string; issued_at: string }[];
  });

// ─── Debug: check course progress counts (remove after debugging) ─────────────

export const debugCourseProgress = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ courseId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any;

    const { data: modules } = await db.from("course_modules").select("id").eq("course_id", data.courseId);
    const moduleIds = ((modules ?? []) as { id: string }[]).map((m) => m.id);

    const { count: totalLessons, error: totalErr } = await db
      .from("course_lessons").select("id", { count: "exact", head: true }).in("module_id", moduleIds);

    const { count: completedLessons, error: completedErr } = await db
      .from("course_progress").select("course_lesson_id", { count: "exact", head: true })
      .eq("user_id", userId).eq("course_id", data.courseId);

    const { data: existingCert } = await db
      .from("certificates").select("id,issued_at")
      .eq("user_id", userId).eq("type", "course").eq("reference_id", data.courseId).maybeSingle();

    return {
      userId,
      courseId: data.courseId,
      moduleCount: moduleIds.length,
      totalLessons,
      totalLessonsError: totalErr?.message ?? null,
      completedLessons,
      completedLessonsError: completedErr?.message ?? null,
      allComplete: (completedLessons ?? 0) >= (totalLessons ?? 1),
      existingCertificate: existingCert ?? null,
    };
  });

// ─── Get certificate by ID (no auth required — publicly shareable) ────────────

export const getCertificatePublic = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any;
    const { data: cert, error } = await db
      .from("certificates")
      .select("id, user_name, type, reference_name, reference_id, issued_at")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw error;
    if (!cert) return null;

    // Fetch description from the referenced course or category for LinkedIn sharing
    let referenceDescription: string | null = null;
    if (cert.type === "course") {
      const { data: course } = await db.from("courses").select("description").eq("id", cert.reference_id).maybeSingle();
      referenceDescription = (course as { description?: string | null } | null)?.description ?? null;
    }

    return {
      id: cert.id as string,
      user_name: cert.user_name as string,
      type: cert.type as string,
      reference_name: cert.reference_name as string,
      reference_description: referenceDescription,
      issued_at: cert.issued_at as string,
    };
  });
