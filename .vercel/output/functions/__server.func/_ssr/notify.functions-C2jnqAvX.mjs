import { c as createSsrRpc } from "./createSsrRpc-Bc62EJ78.mjs";
import { a as createServerFn } from "./server-BomfFVcN.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-dN1VnyDc.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
const FROM_ADDRESS = "Ryan Rieder - DCPG Teaching Library <noreply@dcpracticegrowth.com>";
const BASE_URL = "https://learn.dcpracticegrowth.com";
const notifyContentPublished = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  contentId: stringType().uuid()
}).parse(input)).handler(createSsrRpc("c6a75708434083740643074333f150fdf0f8cdccac07101132114a726ad4601b"));
const ADMIN_RECIPIENTS = ["gabriel@dcpracticegrowth.com", "ryan@dcpracticegrowth.com"];
function buildNewMemberHtml(opts) {
  const {
    fullName,
    email,
    practiceName,
    joinedAt
  } = opts;
  const adminUrl = `${BASE_URL}/admin/members`;
  const practiceRow = practiceName ? `<tr><td style="padding:8px 0;color:#6b7280;font-size:14px;width:120px;">Practice</td><td style="padding:8px 0;font-size:14px;color:#0f172a;font-weight:600;">${practiceName}</td></tr>` : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New member joined DCPG Portal</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background:#0f172a;padding:32px 40px;text-align:center;">
              <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">DCPG Membership Portal</p>
              <p style="margin:6px 0 0;font-size:13px;color:#c9a227;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;">Admin Notification</p>
            </td>
          </tr>

          <!-- Badge -->
          <tr>
            <td style="padding:32px 40px 0;text-align:center;">
              <span style="display:inline-block;background:#dcfce7;color:#166534;font-size:12px;font-weight:700;padding:4px 14px;border-radius:99px;letter-spacing:0.5px;text-transform:uppercase;">New Member Joined</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:24px 40px 32px;">
              <h1 style="margin:0 0 20px;font-size:24px;font-weight:800;color:#0f172a;line-height:1.25;">
                New member just joined DCPG Portal!
              </h1>

              <!-- Member details table -->
              <table cellpadding="0" cellspacing="0" style="width:100%;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:28px;">
                <tr style="background:#f8fafc;">
                  <td colspan="2" style="padding:12px 16px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #e5e7eb;">
                    Member Details
                  </td>
                </tr>
                <tr style="border-bottom:1px solid #f3f4f6;">
                  <td style="padding:12px 16px;color:#6b7280;font-size:14px;width:100px;">Name</td>
                  <td style="padding:12px 16px;font-size:14px;color:#0f172a;font-weight:600;">${fullName}</td>
                </tr>
                <tr style="border-bottom:1px solid #f3f4f6;">
                  <td style="padding:12px 16px;color:#6b7280;font-size:14px;">Email</td>
                  <td style="padding:12px 16px;font-size:14px;color:#0f172a;font-weight:600;">
                    <a href="mailto:${email}" style="color:#c9a227;text-decoration:none;">${email}</a>
                  </td>
                </tr>
                ${practiceRow ? `<tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:12px 16px;color:#6b7280;font-size:14px;">Practice</td><td style="padding:12px 16px;font-size:14px;color:#0f172a;font-weight:600;">${practiceName}</td></tr>` : ""}
                <tr>
                  <td style="padding:12px 16px;color:#6b7280;font-size:14px;">Joined</td>
                  <td style="padding:12px 16px;font-size:14px;color:#0f172a;">${joinedAt}</td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td align="center" style="border-radius:8px;background:#c9a227;">
                    <a href="${adminUrl}" target="_blank"
                       style="display:inline-block;padding:14px 36px;font-size:16px;font-weight:700;color:#1a1a1a;text-decoration:none;border-radius:8px;">
                      View All Members &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                DCPG Admin notification &mdash; sent to portal administrators only.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
async function sendAdminNewTeamMemberEmail(opts) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[sendAdminNewTeamMemberEmail] RESEND_API_KEY not set, skipping admin notification");
    return;
  }
  const {
    Resend
  } = await import("../_libs/resend.mjs");
  const resend = new Resend(apiKey);
  const joinedAt = (/* @__PURE__ */ new Date()).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short"
  });
  const html = buildNewMemberHtml({
    fullName: opts.fullName,
    email: opts.email,
    practiceName: opts.practiceName,
    joinedAt
  });
  await Promise.all(ADMIN_RECIPIENTS.map((to) => resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: "New team member just joined DCPG!",
    html
  })));
}
const notifyNewMember = createServerFn({
  method: "POST"
}).inputValidator((input) => objectType({
  fullName: stringType(),
  email: stringType().email(),
  practiceName: stringType().nullable().optional()
}).parse(input)).handler(createSsrRpc("430bb2b1ad629ddbd3ef20e46d479d74e16436bea2d2d69f3498643e5997bfba"));
export {
  notifyContentPublished as a,
  notifyNewMember as n,
  sendAdminNewTeamMemberEmail as s
};
