import { c as createServerRpc } from "./createServerRpc-D-AYw99j.mjs";
import { a as createServerFn } from "./server-BomfFVcN.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-dN1VnyDc.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const FROM_ADDRESS = "Ryan Rieder - DCPG Teaching Library <noreply@dcpracticegrowth.com>";
const BASE_URL = "https://learn.dcpracticegrowth.com";
function descriptionToHtml(raw) {
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const pStyle = 'style="margin:0 0 12px;font-size:16px;line-height:1.7;color:#4b5563;"';
  const ulStyle = 'style="margin:0 0 12px;padding-left:20px;font-size:16px;line-height:1.7;color:#4b5563;"';
  const liStyle = 'style="margin-bottom:6px;"';
  const blocks = raw.split(/\n{2,}/);
  const rendered = blocks.map((block) => {
    const lines = block.split("\n");
    const nonEmpty = lines.filter((l) => l.trim().length > 0);
    if (nonEmpty.length === 0) return "";
    const isList = nonEmpty.every((l) => /^\s*[-•]/.test(l));
    if (isList) {
      const items = nonEmpty.map((l) => {
        const text = esc(l.replace(/^\s*[-•]\s*/, "").trim());
        return `<li ${liStyle}>${text}</li>`;
      }).join("\n");
      return `<ul ${ulStyle}>
${items}
</ul>`;
    }
    const html = lines.map((l) => esc(l)).join("<br />");
    return `<p ${pStyle}>${html}</p>`;
  }).filter(Boolean).join("\n");
  return rendered;
}
function buildEmailHtml(opts) {
  const {
    title,
    description,
    authorName,
    contentUrl
  } = opts;
  const descHtml = description ? descriptionToHtml(description.trim()) : "";
  const authorHtml = authorName ? `<p style="margin:0 0 24px;font-size:14px;color:#6b7280;">By ${authorName}</p>` : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New content on DCPG Portal</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background:#0f172a;padding:32px 40px;text-align:center;">
              <img src="${BASE_URL}/dcpg-logo.png" alt="DCPG" width="150" style="display:block;margin:0 auto 16px;width:150px;max-width:150px;" />
              <p style="margin:0;font-size:13px;color:#c9a227;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;">Ryan Rieder's Teaching Library</p>
            </td>
          </tr>

          <!-- Badge -->
          <tr>
            <td style="padding:32px 40px 0;text-align:center;">
              <span style="display:inline-block;background:#fef3c7;color:#92400e;font-size:12px;font-weight:700;padding:4px 14px;border-radius:99px;letter-spacing:0.5px;text-transform:uppercase;">New Content Just Dropped</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:24px 40px 32px;">
              <h1 style="margin:0 0 16px;font-size:26px;font-weight:800;color:#0f172a;line-height:1.25;">${title}</h1>
              ${authorHtml}
              ${descHtml}

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td align="center" style="border-radius:8px;background:#c9a227;">
                    <a href="${contentUrl}" target="_blank"
                       style="display:inline-block;padding:14px 36px;font-size:16px;font-weight:700;color:#1a1a1a;text-decoration:none;border-radius:8px;letter-spacing:0.2px;">
                      Watch Now &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:28px 0 0;font-size:13px;color:#9ca3af;text-align:center;">
                Or copy this link: <a href="${contentUrl}" style="color:#c9a227;">${contentUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                You're receiving this because you have email notifications enabled on your DCPG account.<br />
                <a href="${BASE_URL}/profile" style="color:#c9a227;text-decoration:none;">Manage notification preferences</a>
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
const notifyContentPublished_createServerFn_handler = createServerRpc({
  id: "c6a75708434083740643074333f150fdf0f8cdccac07101132114a726ad4601b",
  name: "notifyContentPublished",
  filename: "src/lib/notify.functions.ts"
}, (opts) => notifyContentPublished.__executeServer(opts));
const notifyContentPublished = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  contentId: stringType().uuid()
}).parse(input)).handler(notifyContentPublished_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: roles
  } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const roleList = (roles ?? []).map((r) => r.role);
  if (!roleList.includes("super_admin") && !roleList.includes("author")) {
    throw new Error("Forbidden");
  }
  const {
    supabaseAdmin
  } = await import("./client.server-IqT0ZZNy.mjs");
  const {
    data: content,
    error: cErr
  } = await supabaseAdmin.from("content").select("id, title, description, author_id, display_author_name, category:categories(name)").eq("id", data.contentId).single();
  if (cErr || !content) throw new Error("Content not found");
  let authorName = content.display_author_name ?? null;
  if (!authorName && content.author_id) {
    const {
      data: authorProfile
    } = await supabaseAdmin.from("profiles").select("full_name").eq("id", content.author_id).maybeSingle();
    authorName = authorProfile?.full_name ?? null;
  }
  const {
    data: memberRoleRows
  } = await supabaseAdmin.from("user_roles").select("user_id").eq("role", "member");
  const {
    data: elevatedRows,
    error: elevatedErr
  } = await supabaseAdmin.from("user_roles").select("user_id").or("role.eq.super_admin,role.eq.author");
  if (elevatedErr) throw new Error(`Failed to fetch elevated roles: ${elevatedErr.message}`);
  const elevatedIds = new Set((elevatedRows ?? []).map((r) => r.user_id));
  const memberIds = (memberRoleRows ?? []).map((r) => r.user_id).filter((id) => !elevatedIds.has(id));
  const {
    data: emailRecipients
  } = memberIds.length ? await supabaseAdmin.from("profiles").select("id, email").in("id", memberIds).eq("email_notifications", true).not("email", "is", null) : {
    data: []
  };
  const recipients = (emailRecipients ?? []).filter((r) => !!r.email);
  const emailCount = recipients.length;
  if (emailCount > 0) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error("RESEND_API_KEY is not configured");
    const {
      Resend
    } = await import("../_libs/resend.mjs");
    const resend = new Resend(apiKey);
    const contentUrl = `${BASE_URL}/content/${content.id}`;
    const html = buildEmailHtml({
      title: content.title,
      description: content.description ?? null,
      authorName,
      contentUrl
    });
    const BATCH = 50;
    for (let i = 0; i < recipients.length; i += BATCH) {
      const batch = recipients.slice(i, i + BATCH);
      await Promise.all(batch.map((r) => resend.emails.send({
        from: FROM_ADDRESS,
        to: r.email,
        subject: "New Teaching from Dr Ryan Rieder 🎓",
        html
      })));
    }
  }
  {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const {
        Resend
      } = await import("../_libs/resend.mjs");
      const resend = new Resend(apiKey);
      const contentUrl = `${BASE_URL}/content/${content.id}`;
      const categoryName = content.category?.name ?? null;
      const adminHtml = buildAdminContentPublishedHtml({
        title: content.title,
        authorName,
        categoryName,
        contentUrl
      });
      await Promise.all(ADMIN_RECIPIENTS.map((to) => resend.emails.send({
        from: FROM_ADDRESS,
        to,
        subject: "New content published on DCPG Portal",
        html: adminHtml
      })));
    }
  }
  return {
    emailCount,
    smsCount: 0,
    title: content.title
  };
});
const ADMIN_RECIPIENTS = ["gabriel@dcpracticegrowth.com", "ryan@dcpracticegrowth.com"];
function buildAdminContentPublishedHtml(opts) {
  const {
    title,
    authorName,
    categoryName,
    contentUrl
  } = opts;
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const authorRow = authorName ? `<tr style="border-bottom:1px solid #f3f4f6;">
        <td style="padding:12px 16px;color:#6b7280;font-size:14px;width:100px;">Author</td>
        <td style="padding:12px 16px;font-size:14px;color:#0f172a;font-weight:600;">${esc(authorName)}</td>
       </tr>` : "";
  const categoryRow = categoryName ? `<tr style="border-bottom:1px solid #f3f4f6;">
        <td style="padding:12px 16px;color:#6b7280;font-size:14px;">Category</td>
        <td style="padding:12px 16px;font-size:14px;color:#0f172a;font-weight:600;">${esc(categoryName)}</td>
       </tr>` : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New content published — DCPG Portal</title>
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
              <span style="display:inline-block;background:#fef3c7;color:#92400e;font-size:12px;font-weight:700;padding:4px 14px;border-radius:99px;letter-spacing:0.5px;text-transform:uppercase;">New Content Published</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:24px 40px 32px;">
              <h1 style="margin:0 0 20px;font-size:24px;font-weight:800;color:#0f172a;line-height:1.25;">
                New content just went live on the portal!
              </h1>

              <!-- Content details table -->
              <table cellpadding="0" cellspacing="0" style="width:100%;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:28px;">
                <tr style="background:#f8fafc;">
                  <td colspan="2" style="padding:12px 16px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #e5e7eb;">
                    Content Details
                  </td>
                </tr>
                <tr style="border-bottom:1px solid #f3f4f6;">
                  <td style="padding:12px 16px;color:#6b7280;font-size:14px;width:100px;">Title</td>
                  <td style="padding:12px 16px;font-size:14px;color:#0f172a;font-weight:600;">${esc(title)}</td>
                </tr>
                ${authorRow}
                ${categoryRow}
                <tr>
                  <td style="padding:12px 16px;color:#6b7280;font-size:14px;">Link</td>
                  <td style="padding:12px 16px;font-size:14px;">
                    <a href="${contentUrl}" style="color:#c9a227;text-decoration:none;word-break:break-all;">${contentUrl}</a>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td align="center" style="border-radius:8px;background:#c9a227;">
                    <a href="${contentUrl}" target="_blank"
                       style="display:inline-block;padding:14px 36px;font-size:16px;font-weight:700;color:#1a1a1a;text-decoration:none;border-radius:8px;">
                      View Content &rarr;
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
const notifyNewMember_createServerFn_handler = createServerRpc({
  id: "430bb2b1ad629ddbd3ef20e46d479d74e16436bea2d2d69f3498643e5997bfba",
  name: "notifyNewMember",
  filename: "src/lib/notify.functions.ts"
}, (opts) => notifyNewMember.__executeServer(opts));
const notifyNewMember = createServerFn({
  method: "POST"
}).inputValidator((input) => objectType({
  fullName: stringType(),
  email: stringType().email(),
  practiceName: stringType().nullable().optional()
}).parse(input)).handler(notifyNewMember_createServerFn_handler, async ({
  data
}) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[notifyNewMember] RESEND_API_KEY not set, skipping admin notification");
    return {
      ok: true
    };
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
    fullName: data.fullName,
    email: data.email,
    practiceName: data.practiceName ?? null,
    joinedAt
  });
  await Promise.all(ADMIN_RECIPIENTS.map((to) => resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: "New member just joined DCPG Portal!",
    html
  })));
  return {
    ok: true
  };
});
export {
  notifyContentPublished_createServerFn_handler,
  notifyNewMember_createServerFn_handler
};
