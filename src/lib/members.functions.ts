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
    // Use .or() with PostgREST syntax to avoid enum type inference issues with .in()
    const { data: elevatedRows, error: elevatedErr } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .or("role.eq.super_admin,role.eq.author");
    // If this query errors, fail safe: treat all member IDs as potentially elevated
    if (elevatedErr) throw new Error(`Failed to fetch elevated roles: ${elevatedErr.message}`);
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

    // Toggle is_active on the profile
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ is_active: data.is_active } as Record<string, unknown>)
      .eq("id", data.userId);
    if (error) throw new Error(error.message);

    // On deactivation: reassign all their content to 'Dr Ryan Rieder' so
    // the portal still shows a valid author name for their published lessons.
    if (!data.is_active) {
      await supabaseAdmin
        .from("content")
        .update({ display_author_name: "Dr Ryan Rieder" } as Record<string, unknown>)
        .eq("author_id", data.userId);
    }

    return { ok: true };
  });

// ---------------------------------------------------------------------------
// Create member account (admin-initiated — does NOT auto-send email)
// ---------------------------------------------------------------------------

const createMemberSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
});

export const TEMP_PASSWORD = "DCPG2026!";

export const createMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => createMemberSchema.parse(input))
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

    // Create confirmed auth user — no email verification needed
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: TEMP_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: data.fullName },
    });
    if (createErr || !created.user) {
      throw new Error(createErr?.message ?? "Could not create account");
    }

    return { ok: true, userId: created.user.id };
  });

// ---------------------------------------------------------------------------
// Send welcome email to a newly created member (called separately by admin)
// ---------------------------------------------------------------------------

function buildWelcomeEmailHtml(fullName: string, email: string): string {
  const firstName = fullName.split(" ")[0];
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Welcome to DCPG</title></head>
<body style="margin:0;padding:0;background:#f8f8f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        <tr><td style="background:#0f2444;padding:32px 40px;text-align:center;">
          <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">DCPG Teaching Library</p>
          <p style="margin:8px 0 0;font-size:14px;color:#c9a84c;font-weight:600;">Your account is ready</p>
        </td></tr>
        <tr><td style="padding:36px 40px;">
          <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#374151;">Hi ${firstName},</p>
          <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#374151;">Welcome to the <strong>DCPG Practice Growth Teaching Library</strong> — Ryan Rieder's complete library of practice-growth strategies, frameworks, and coaching content.</p>
          <p style="margin:0 0 24px;font-size:16px;line-height:1.7;color:#374151;">Your account has been created. Here are your login details:</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4ff;border:2px solid #0f2444;border-radius:10px;margin-bottom:28px;">
            <tr><td style="padding:24px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding-bottom:14px;">
                  <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Login URL</p>
                  <p style="margin:0;font-size:15px;font-weight:600;color:#0f2444;">learn.dcpracticegrowth.com/login</p>
                </td></tr>
                <tr><td style="padding-bottom:14px;">
                  <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Login Email</p>
                  <p style="margin:0;font-size:16px;font-weight:600;color:#0f2444;">${email}</p>
                </td></tr>
                <tr><td>
                  <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Temporary Password</p>
                  <p style="margin:0;font-size:20px;font-weight:800;color:#0f2444;letter-spacing:0.1em;font-family:monospace;">${TEMP_PASSWORD}</p>
                </td></tr>
              </table>
            </td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr><td align="center">
              <a href="https://learn.dcpracticegrowth.com/login" style="display:inline-block;background:#c9a84c;color:#0f2444;font-weight:800;font-size:16px;text-decoration:none;padding:14px 36px;border-radius:8px;">Log In Now →</a>
            </td></tr>
          </table>
          <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#374151;background:#fffbeb;border-left:4px solid #c9a84c;padding:14px 18px;border-radius:4px;">
            <strong>Important:</strong> Please change your password after your first login. Go to your <strong>Profile</strong> page and update it to something memorable.
          </p>
        </td></tr>
        <tr><td style="background:#f8f8f8;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
          <p style="margin:0;font-size:13px;color:#9ca3af;">Questions? Reply to this email or contact your DCPG coach.</p>
          <p style="margin:8px 0 0;font-size:12px;color:#d1d5db;">© ${year} DC Practice Growth. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

const sendWelcomeEmailSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
});

export const sendWelcomeEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => sendWelcomeEmailSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    if (!(roles ?? []).some((r) => r.role === "super_admin")) {
      throw new Error("Forbidden");
    }

    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Ryan Rieder - DCPG Teaching Library <noreply@dcpracticegrowth.com>",
      to: data.email,
      subject: "Welcome to the DCPG Teaching Library 🎉",
      html: buildWelcomeEmailHtml(data.fullName, data.email),
    });

    return { ok: true };
  });

// ---------------------------------------------------------------------------
// Role management — super_admin can change any user's role
// ---------------------------------------------------------------------------

const roleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["member", "author", "super_admin"]),
});

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => roleSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Only super_admins can change roles
    const { data: callerRoles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    if (!(callerRoles ?? []).some((r) => r.role === "super_admin")) {
      throw new Error("Forbidden");
    }

    // Prevent accidental self-demotion
    if (data.userId === userId) {
      throw new Error("You cannot change your own role");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Replace all existing role rows with the single new role
    await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId);
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: data.userId, role: data.role });
    if (error) throw new Error(error.message);

    return { ok: true };
  });
