import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(200),
  phone: z.string().trim().max(40).nullable().optional(),
  practice: z.string().trim().max(200).nullable().optional(),
  accessCode: z.string().min(1).max(200),
});

export const teamSignup = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }) => {
    const expected = process.env.TEAM_ACCESS_CODE;
    if (!expected) throw new Error("Team signup is not configured");

    if (data.accessCode.trim() !== expected) {
      throw new Error("Invalid access code â€” contact your DCPG admin.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Create confirmed auth user (team members onboarded via code â€” skip email confirm)
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        full_name: data.fullName,
        phone: data.phone ?? null,
        practice_name: data.practice ?? null,
      },
    });
    if (createErr || !created.user) {
      throw new Error(createErr?.message ?? "Could not create account");
    }
    const userId = created.user.id;

    // handle_new_user trigger inserted profile + member role. Promote to author.
    await supabaseAdmin.from("user_roles").delete().eq("user_id", userId).eq("role", "member");
    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: "author" });
    if (roleErr) throw new Error(roleErr.message);

    // Notify super admins (stubbed until email infrastructure is configured).
    // We just record the intent; actual email send will be wired up when email infra is enabled.
    const { data: admins } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, profiles:profiles!inner(email, full_name)")
      .eq("role", "super_admin");
    // TODO: when email infrastructure is enabled, enqueue an email to each admin here.
    void admins;

    return { ok: true, userId };
  });
