import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const listAuthors = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    const roleList = (roles ?? []).map((r) => r.role);
    if (!roleList.includes("super_admin")) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: authorRows, error } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("role", "author");
    if (error) throw new Error(error.message);
    const ids = (authorRows ?? []).map((r) => r.user_id);
    if (ids.length === 0) return { authors: [] };

    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, email, avatar_url, job_title, bio")
      .in("id", ids);

    const { data: counts } = await supabaseAdmin
      .from("content")
      .select("author_id")
      .in("author_id", ids);
    const countMap = new Map<string, number>();
    for (const c of counts ?? []) {
      const k = c.author_id as string;
      countMap.set(k, (countMap.get(k) ?? 0) + 1);
    }

    return {
      authors: (profiles ?? []).map((p) => ({
        id: p.id,
        full_name: p.full_name,
        email: p.email,
        avatar_url: p.avatar_url,
        job_title: p.job_title,
        bio: p.bio,
        content_count: countMap.get(p.id) ?? 0,
      })),
    };
  });

const updateSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().trim().min(1).max(120),
  job_title: z.string().trim().max(150).nullable().optional(),
  bio: z.string().trim().max(2000).nullable().optional(),
  avatar_url: z.string().url().max(2000).nullable().optional(),
});

export const updateAuthorProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => updateSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    if (!(roles ?? []).some((r) => r.role === "super_admin")) {
      throw new Error("Forbidden");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        full_name: data.full_name,
        job_title: data.job_title ?? null,
        bio: data.bio ?? null,
        avatar_url: data.avatar_url ?? null,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Stub â€” actual email send wires up when email infrastructure is configured.
export const notifyAuthorPublished = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ contentId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: content } = await supabaseAdmin
      .from("content")
      .select("id, title, author_id")
      .eq("id", data.contentId)
      .single();
    if (!content) return { ok: false };
    const { data: author } = await supabaseAdmin
      .from("profiles")
      .select("full_name")
      .eq("id", content.author_id ?? context.userId)
      .maybeSingle();
    // TODO: enqueue email to super admins: `${author.full_name} just published: ${content.title}`
    void author;
    return { ok: true };
  });
