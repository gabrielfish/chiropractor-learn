import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const notifyContentPublished = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ contentId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Author/admin gate
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    const roleList = (roles ?? []).map((r) => r.role);
    if (!roleList.includes("super_admin") && !roleList.includes("author")) {
      throw new Error("Forbidden");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: content, error: cErr } = await supabaseAdmin
      .from("content")
      .select("id, title")
      .eq("id", data.contentId)
      .single();
    if (cErr || !content) throw new Error("Content not found");

    const { data: emailRecipients } = await supabaseAdmin
      .from("profiles")
      .select("id, email")
      .eq("email_notifications", true)
      .not("email", "is", null);

    const { data: smsRecipients } = await supabaseAdmin
      .from("profiles")
      .select("id, phone")
      .eq("sms_notifications", true)
      .not("phone", "is", null);

    // TODO: enqueue actual email/SMS sends once Lovable Emails + Twilio are set up.
    // For now we just count opted-in recipients.
    return {
      emailCount: emailRecipients?.length ?? 0,
      smsCount: smsRecipients?.length ?? 0,
      title: content.title,
    };
  });
