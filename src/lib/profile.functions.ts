import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const profileSchema = z.object({
  full_name: z.string().trim().max(120).optional().nullable(),
  phone: z.string().trim().max(40).optional().nullable(),
  practice_name: z.string().trim().max(160).optional().nullable(),
  avatar_url: z.string().trim().max(500).optional().nullable(),
});

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id,email,full_name,phone,practice_name,avatar_url,email_notifications")
      .eq("id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { profile: data };
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => profileSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("profiles")
      .update(data)
      .eq("id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });


const notifSchema = z.object({
  email_notifications: z.boolean(),
});

export const updateNotifications = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => notifSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .update(data)
      .eq("id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const supportSchema = z.object({
  category: z.enum(["Technical Issue", "Content Question", "Account Help", "Other"]),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(5000),
});

export const submitSupportRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => supportSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Save to DB
    const { error } = await context.supabase.from("support_requests").insert({
      member_id: context.userId,
      category: data.category,
      subject: data.subject,
      message: data.message,
    });
    if (error) throw new Error(error.message);

    // Fetch member name + email for the notification
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("full_name, email")
      .eq("id", context.userId)
      .maybeSingle();

    const memberName = (profile as any)?.full_name ?? "A member";
    const memberEmail = (profile as any)?.email ?? "unknown";
    const submitted = new Date().toLocaleString("en-AU", {
      timeZone: "Australia/Sydney",
      dateStyle: "full",
      timeStyle: "short",
    });

    // Send email notification (best-effort — never fail the user's request)
    try {
      const apiKey = process.env.RESEND_API_KEY;
      if (apiKey) {
        const { Resend } = await import("resend");
        const resend = new Resend(apiKey);
        const FROM = "Ryan Rieder - DCPG Teaching Library <noreply@dcpracticegrowth.com>";
        const TO = ["gabriel@dcpracticegrowth.com", "ryan@dcpracticegrowth.com"];
        await resend.emails.send({
          from: FROM,
          to: TO,
          subject: `New Support Request from ${memberName}`,
          html: `
<p><strong>Member:</strong> ${memberName}</p>
<p><strong>Email:</strong> ${memberEmail}</p>
<p><strong>Category:</strong> ${data.category}</p>
<p><strong>Subject:</strong> ${data.subject}</p>
<p><strong>Message:</strong></p>
<blockquote style="border-left:3px solid #ccc;margin:0;padding:0 1em;color:#555">
  ${data.message.replace(/\n/g, "<br>")}
</blockquote>
<p><strong>Submitted:</strong> ${submitted}</p>
          `.trim(),
        });
      }
    } catch (emailErr) {
      console.error("[support] email notification failed:", emailErr);
    }

    return { ok: true };
  });

export const sendPasswordReset = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: userData } = await context.supabase.auth.getUser();
    const email = userData.user?.email;
    if (!email) throw new Error("No email on account");
    const { error } = await context.supabase.auth.resetPasswordForEmail(email);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getOrCreateMcpToken = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Return existing token if present
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("mcp_token")
      .eq("id", context.userId)
      .single();

    if ((profile as any)?.mcp_token) {
      return { token: (profile as any).mcp_token as string };
    }

    // Generate a new UUID token and persist it
    const { data: updated, error } = await supabaseAdmin
      .from("profiles")
      .update({ mcp_token: crypto.randomUUID() } as any)
      .eq("id", context.userId)
      .select("mcp_token")
      .single();

    if (error || !updated) throw new Error(error?.message ?? "Failed to generate token");
    return { token: (updated as any).mcp_token as string };
  });
