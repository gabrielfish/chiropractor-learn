import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

// ── List books (distinct titles + chapter counts) ─────────────────────────────

async function assertSuperAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "super_admin")
    .maybeSingle();
  if (!data) throw new Error("Forbidden");
}

export const listBooks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertSuperAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("books_content")
      .select("id, book_title, chapter_title, order_index, created_at")
      .order("book_title")
      .order("order_index");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

// ── Save a chapter (insert or update) ────────────────────────────────────────

const chapterSchema = z.object({
  id: z.string().uuid().optional(),
  book_title: z.string().trim().min(1).max(300),
  chapter_title: z.string().trim().max(300).optional().nullable(),
  content_text: z.string().trim().min(1),
  order_index: z.number().int().min(0),
});

export const saveChapter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => chapterSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertSuperAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    if (data.id) {
      const { error } = await supabaseAdmin
        .from("books_content")
        .update({
          book_title: data.book_title,
          chapter_title: data.chapter_title ?? null,
          content_text: data.content_text,
          order_index: data.order_index,
          updated_at: new Date().toISOString(),
        } as any)
        .eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin
        .from("books_content")
        .insert({
          book_title: data.book_title,
          chapter_title: data.chapter_title ?? null,
          content_text: data.content_text,
          order_index: data.order_index,
        } as any);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

// ── Delete a chapter ──────────────────────────────────────────────────────────

export const deleteChapter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertSuperAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("books_content")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
