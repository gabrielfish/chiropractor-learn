import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const INDEX_NAME = "dcpg_content";
const BASE_URL = "https://learn.dcpracticegrowth.com";

async function getAdminClient() {
  const { algoliasearch } = await import("algoliasearch");
  const appId = process.env.ALGOLIA_APP_ID;
  const adminKey = process.env.ALGOLIA_ADMIN_KEY;
  if (!appId || !adminKey) throw new Error("ALGOLIA_APP_ID / ALGOLIA_ADMIN_KEY not configured");
  return algoliasearch(appId, adminKey);
}

// ─── Per-item sync: single content lesson ────────────────────────────────────

export const syncContentToAlgolia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ contentId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any;
    const { data: row } = await db
      .from("content")
      .select(
        "id, title, description, content_type, thumbnail_url, video_url, pdf_url, book_url, tags, display_author_name, status, category:categories(name, slug)",
      )
      .eq("id", data.contentId)
      .single();

    if (!row) return { ok: true };

    const client = await getAdminClient();
    const category = row.category as { name?: string; slug?: string } | null;

    if (row.status !== "published") {
      try {
        await client.deleteObject({ indexName: INDEX_NAME, objectID: `content_${row.id}` });
      } catch {
        // Object may not exist yet — fine
      }
      return { ok: true };
    }

    await client.saveObject({
      indexName: INDEX_NAME,
      body: {
        objectID: `content_${row.id}`,
        type: "content",
        id: row.id,
        title: row.title,
        description: row.description ?? null,
        content_type: row.content_type ?? "video",
        thumbnail_url: row.thumbnail_url ?? null,
        video_url: row.video_url ?? null,
        pdf_url: row.pdf_url ?? null,
        book_url: row.book_url ?? null,
        tags: row.tags ?? [],
        display_author_name: row.display_author_name ?? null,
        category_name: category?.name ?? null,
        category_slug: category?.slug ?? null,
        url: `${BASE_URL}/content/${row.id}`,
      },
    });

    return { ok: true };
  });

// ─── Per-item sync: single course ────────────────────────────────────────────

export const syncCourseToAlgolia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ courseId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any;
    const { data: row } = await db
      .from("courses")
      .select(
        "id, title, description, thumbnail_url, display_author_name, status, category:categories(name, slug)",
      )
      .eq("id", data.courseId)
      .single();

    if (!row) return { ok: true };

    const client = await getAdminClient();
    const category = row.category as { name?: string; slug?: string } | null;

    if (row.status !== "published") {
      try {
        await client.deleteObject({ indexName: INDEX_NAME, objectID: `course_${row.id}` });
      } catch {
        // Object may not exist yet — fine
      }
      return { ok: true };
    }

    await client.saveObject({
      indexName: INDEX_NAME,
      body: {
        objectID: `course_${row.id}`,
        type: "course",
        id: row.id,
        title: row.title,
        description: row.description ?? null,
        thumbnail_url: row.thumbnail_url ?? null,
        display_author_name: row.display_author_name ?? null,
        category_name: category?.name ?? null,
        category_slug: category?.slug ?? null,
        url: `${BASE_URL}/course/${row.id}`,
      },
    });

    return { ok: true };
  });

// ─── Bulk sync: all published content + courses ───────────────────────────────

export const syncAllToAlgolia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Super-admin gate
    const { data: roles } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    const roleList = (roles ?? []).map((r) => r.role);
    if (!roleList.includes("super_admin")) throw new Error("Forbidden");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any;

    // Fetch all published content
    const { data: contentRows, error: cErr } = await db
      .from("content")
      .select(
        "id, title, description, content_type, thumbnail_url, video_url, pdf_url, book_url, tags, display_author_name, category:categories(name, slug)",
      )
      .eq("status", "published");
    if (cErr) throw new Error(`Failed to fetch content: ${cErr.message}`);

    // Fetch all published courses
    const { data: courseRows, error: coErr } = await db
      .from("courses")
      .select(
        "id, title, description, thumbnail_url, display_author_name, category:categories(name, slug)",
      )
      .eq("status", "published");
    if (coErr) throw new Error(`Failed to fetch courses: ${coErr.message}`);

    const client = await getAdminClient();

    // Build Algolia objects
    const objects = [
      ...(contentRows ?? []).map((row: Record<string, unknown>) => {
        const category = row.category as { name?: string; slug?: string } | null;
        return {
          objectID: `content_${row.id}`,
          type: "content",
          id: row.id,
          title: row.title,
          description: (row.description as string | null) ?? null,
          content_type: (row.content_type as string | null) ?? "video",
          thumbnail_url: (row.thumbnail_url as string | null) ?? null,
          video_url: (row.video_url as string | null) ?? null,
          pdf_url: (row.pdf_url as string | null) ?? null,
          book_url: (row.book_url as string | null) ?? null,
          tags: (row.tags as string[]) ?? [],
          display_author_name: (row.display_author_name as string | null) ?? null,
          category_name: category?.name ?? null,
          category_slug: category?.slug ?? null,
          url: `${BASE_URL}/content/${row.id}`,
        };
      }),
      ...(courseRows ?? []).map((row: Record<string, unknown>) => {
        const category = row.category as { name?: string; slug?: string } | null;
        return {
          objectID: `course_${row.id}`,
          type: "course",
          id: row.id,
          title: row.title,
          description: (row.description as string | null) ?? null,
          thumbnail_url: (row.thumbnail_url as string | null) ?? null,
          display_author_name: (row.display_author_name as string | null) ?? null,
          category_name: category?.name ?? null,
          category_slug: category?.slug ?? null,
          url: `${BASE_URL}/course/${row.id}`,
        };
      }),
    ];

    if (objects.length === 0) return { contentCount: 0, courseCount: 0, total: 0 };

    await client.saveObjects({ indexName: INDEX_NAME, objects });

    const contentCount = (contentRows ?? []).length;
    const courseCount = (courseRows ?? []).length;
    return { contentCount, courseCount, total: contentCount + courseCount };
  });
