import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  q: z.string().min(1).max(100),
  featured: z.boolean().optional(),
});

export const searchPublishedContent = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // ── Featured / popular lessons (no query) ────────────────────────────────
    if (data.featured) {
      const { data: rows } = await supabaseAdmin
        .from("content")
        .select("id, title, thumbnail_url, video_duration, category:categories(name, slug)")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(4);
      return {
        results: mapRows(rows ?? []),
        isFeatured: true,
      };
    }

    const term = data.q.trim().replace(/[%,]/g, " ");

    // ── Attempt 1: full-phrase ilike ─────────────────────────────────────────
    const { data: rows, error } = await supabaseAdmin
      .from("content")
      .select("id, title, thumbnail_url, video_duration, category:categories(name, slug)")
      .eq("status", "published")
      .or(`title.ilike.%${term}%,description.ilike.%${term}%`)
      .order("published_at", { ascending: false })
      .limit(12);

    if (error) return { results: [], error: "Search unavailable" };
    if ((rows ?? []).length > 0) return { results: mapRows(rows!), isFeatured: false };

    // ── Attempt 2: word-by-word fallback ─────────────────────────────────────
    const words = term.split(/\s+/).filter((w) => w.length > 2);
    if (words.length > 1) {
      const seen = new Set<string>();
      const combined: typeof rows = [];

      for (const word of words) {
        const { data: wRows } = await supabaseAdmin
          .from("content")
          .select("id, title, thumbnail_url, video_duration, category:categories(name, slug)")
          .eq("status", "published")
          .or(`title.ilike.%${word}%,description.ilike.%${word}%`)
          .order("published_at", { ascending: false })
          .limit(6);

        for (const r of wRows ?? []) {
          if (!seen.has(r.id as string)) {
            seen.add(r.id as string);
            combined.push(r);
          }
        }
        if (combined.length >= 12) break;
      }

      if (combined.length > 0) {
        return { results: mapRows(combined.slice(0, 12)), isFeatured: false };
      }
    }

    // ── Attempt 3: no results at all — return featured/popular ───────────────
    const { data: featured } = await supabaseAdmin
      .from("content")
      .select("id, title, thumbnail_url, video_duration, category:categories(name, slug)")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(4);

    return { results: mapRows(featured ?? []), isFeatured: true };
  });

function mapRows(rows: any[]) {
  return rows.map((r) => ({
    id: r.id as string,
    title: r.title as string,
    thumbnail_url: (r.thumbnail_url ?? null) as string | null,
    video_duration: (r.video_duration ?? null) as string | null,
    category_name: (r as { category?: { name?: string | null } | null }).category?.name ?? null,
  }));
}
