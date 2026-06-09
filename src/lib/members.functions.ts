import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

/** Return all users with role='member', enriched with profile + progress count */
export const listMembers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    // Only super_admin may view members
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    if (!(roles ?? []).some((r) => r.role === "super_admin")) {
      throw new Error("Forbidden");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Get all user_ids with role='member'
    const { data: memberRows, error: rolesErr } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("role", "member");
    if (rolesErr) throw new Error(rolesErr.message);

    // Get all user_ids with an elevated role (super_admin or author)
    const { data: elevatedRows } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .in("role", ["super_admin", "author"]);
    const elevatedIds = new Set((elevatedRows ?? []).map((r) => r.user_id as string));

    // Only users whose sole role is 'member' — exclude anyone with super_admin/author
    const ids = (memberRows ?? [])
      .map((r) => r.user_id as string)
      .filter((id) => !elevatedIds.has(id));

    if (ids.length === 0) return { members: [] };

    // Fetch profiles
    const { data: profiles, error: profilesErr } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, email, avatar_url, practice_name, created_at, last_login, is_active")
      .in("id", ids);
    if (profilesErr) throw new Error(profilesErr.message);

    // Fetch completed content counts per user
    const { data: progressRows } = await supabaseAdmin
      .from("progress")
      .select("user_id")
      .in("user_id", ids)
      .eq("completed", true);

    const countMap = new Map<string, number>();
    for (const p of progressRows ?? []) {
      const k = p.user_id as string;
      countMap.set(k, (countMap.get(k) ?? 0) + 1);
    }

    return {
      members: (profiles ?? []).map((p) => ({
        id: p.id,
        full_name: p.full_name,
        email: p.email,
        avatar_url: p.avatar_url,
        practice_name: (p as { practice_name?: string | null }).practice_name ?? null,
        created_at: p.created_at,
        last_login: p.last_login,
        is_active: (p as { is_active?: boolean | null }).is_active ?? true,
        content_completed: countMap.get(p.id) ?? 0,
      })),
    };
  });

const toggleSchema = z.object({
  userId: z.string().uuid(),
  is_active: z.boolean(),
});

export const setMemberActive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => toggleSchema.parse(input))
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
      .update({ is_active: data.is_active } as Record<string, unknown>)
      .eq("id", data.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
