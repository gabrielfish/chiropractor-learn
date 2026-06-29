import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const INDEX_NAME = "dcpg_content";

async function getAdminClient() {
  const { algoliasearch } = await import("algoliasearch");
  const appId = process.env.ALGOLIA_APP_ID;
  const adminKey = process.env.ALGOLIA_ADMIN_KEY;
  if (!appId || !adminKey) throw new Error("ALGOLIA_APP_ID / ALGOLIA_ADMIN_KEY not configured");
  return algoliasearch(appId, adminKey);
}

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const category = (row as any).category as { name?: string; slug?: string } | null;

    if (row.status !== "published") {
      // Remove unpublished/archived content from index
      try {
        await client.deleteObject({ indexName: INDEX_NAME, objectID: `content_${row.id}` });
      } catch {
        // Object may not exist yet — that's fine
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
        book_url: (row as unknown as Record<string, unknown>).book_url ?? null,
        tags: (row as unknown as Record<string, unknown>).tags ?? [],
        display_author_name: row.display_author_name ?? null,
        category_name: category?.name ?? null,
        category_slug: category?.slug ?? null,
      },
    });

    return { ok: true };
  });

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
    const category = (row as Record<string, unknown>).category as { name?: string; slug?: string } | null;

    if (row.status !== "published") {
      try {
        await client.deleteObject({ indexName: INDEX_NAME, objectID: `course_${row.id}` });
      } catch {
        // Object may not exist yet — that's fine
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
      },
    });

    return { ok: true };
  });
