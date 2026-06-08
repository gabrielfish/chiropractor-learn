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
      .select("id,email,full_name,phone,practice_name,avatar_url,email_notifications,sms_notifications")
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
  sms_notifications: z.boolean(),
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
    const { error } = await context.supabase.from("support_requests").insert({
      member_id: context.userId,
      category: data.category,
      subject: data.subject,
      message: data.message,
    });
    if (error) throw new Error(error.message);
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
