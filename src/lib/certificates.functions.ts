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
  const { data: existing } = await db
    .from("certificates")
    .select("id")
    .eq("user_id", userId)
    .eq("type", type)
    .eq("reference_id", referenceId)
    .maybeSingle();

  if (existing) return { issued: false, certificateId: existing.id as string };

  const { data, error } = await db
    .from("certificates")
    .insert({ user_id: userId, user_name: userName, type, reference_id: referenceId, reference_name: referenceName })
    .select("id")
    .single();

  if (error) throw error;
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
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any;

    // Get user's display name for the certificate
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .maybeSingle();
    const userName = (profile as { full_name?: string | null } | null)?.full_name ?? "Member";

    // Get course title
    const { data: course } = await db.from("courses").select("id,title").eq("id", data.courseId).single();
    if (!course) return { issued: false, certificateId: null };

    // Count total lessons in the course
    const { data: modules } = await db.from("course_modules").select("id").eq("course_id", data.courseId);
    const moduleIds = ((modules ?? []) as { id: string }[]).map((m) => m.id);
    if (!moduleIds.length) return { issued: false, certificateId: null };

    const { count: totalLessons } = await db
      .from("course_lessons")
      .select("id", { count: "exact", head: true })
      .in("module_id", moduleIds);

    if (!totalLessons) return { issued: false, certificateId: null };

    // Count completed lessons for this user in this course
    // course_progress has no 'id' column — use course_lesson_id
    const { count: completedLessons, error: countErr } = await db
      .from("course_progress")
      .select("course_lesson_id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("course_id", data.courseId);

    if (countErr) {
      console.error("[certificate] course_progress count error:", countErr);
      return { issued: false, certificateId: null };
    }

    console.log("[certificate] completedLessons:", completedLessons, "/ totalLessons:", totalLessons);

    if ((completedLessons ?? 0) < totalLessons) return { issued: false, certificateId: null };

    return upsertCertificate(db, userId, userName, "course", data.courseId, course.title);
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
      .select("id, user_name, type, reference_name, issued_at")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw error;
    return cert as {
      id: string;
      user_name: string;
      type: string;
      reference_name: string;
      issued_at: string;
    } | null;
  });
