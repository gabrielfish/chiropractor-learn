import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  q: z.string().min(1).max(100),
});

export const searchPublishedContent = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const term = data.q.trim().replace(/[%,]/g, " ");
    const { data: rows, error } = await supabaseAdmin
      .from("content")
      .select(
        "id, title, thumbnail_url, video_duration, category:categories(name, slug)"
      )
      .eq("status", "published")
      .or(`title.ilike.%${term}%,description.ilike.%${term}%`)
      .order("published_at", { ascending: false })
      .limit(12);
    if (error) return { results: [], error: "Search unavailable" };
    return {
      results: (rows ?? []).map((r) => ({
        id: r.id as string,
        title: r.title as string,
        thumbnail_url: (r.thumbnail_url ?? null) as string | null,
        video_duration: (r.video_duration ?? null) as string | null,
        category_name:
          (r as { category?: { name?: string | null } | null }).category?.name ?? null,
      })),
    };
  });
