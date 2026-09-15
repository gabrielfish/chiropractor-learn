import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog-pXddDSBH.mjs";
import { a as notifyContentPublished } from "./notify.functions-CrRd-XzN.mjs";
import { c as createSsrRpc } from "./createSsrRpc-D1HIuwD_.mjs";
import { a as createServerFn } from "./server-DAhjTOZR.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CINWQ1Vb.mjs";
import { Y as Send, Z as Mail, _ as Link2, X } from "../_libs/lucide-react.mjs";
import { o as objectType, a as arrayType, e as enumType, s as stringType, n as numberType } from "../_libs/zod.mjs";
function PublishNotificationModal({
  contentId,
  contentUrl,
  title,
  open,
  onClose
}) {
  const [sent, setSent] = reactExports.useState(false);
  const notify = useServerFn(notifyContentPublished);
  const url = contentUrl ?? (contentId && typeof window !== "undefined" ? `${window.location.origin}/content/${contentId}` : "");
  const notifyMut = useMutation({
    mutationFn: async () => {
      if (!contentId) throw new Error("Missing content id");
      return notify({ data: { contentId } });
    },
    onSuccess: (res) => {
      setSent(true);
      toast.success(
        `Emails sent to ${res.emailCount} member${res.emailCount === 1 ? "" : "s"}`
      );
      setTimeout(onClose, 1200);
    },
    onError: (e) => toast.error(e.message)
  });
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied — share it with whoever you like");
      onClose();
    } catch {
      toast.error("Couldn't copy link");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md p-0 overflow-hidden border-border bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary text-primary-foreground p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display text-xl font-extrabold flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-5 w-5 text-gold" }),
        " Content published"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { className: "text-primary-foreground/70 mt-1", children: [
        '"',
        title,
        '" is now live. How would you like to share it?'
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          disabled: notifyMut.isPending || sent || !contentId,
          onClick: () => notifyMut.mutate(),
          className: "w-full text-left rounded-lg border-2 border-gold bg-gold/5 hover:bg-gold/10 transition-colors p-4 flex items-start gap-3 disabled:opacity-60 disabled:cursor-not-allowed",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-gold/15 text-gold p-2 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-foreground", children: notifyMut.isPending ? "Sending…" : "Notify All Members" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Email everyone with notifications enabled, with a direct link." })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: onCopy,
          className: "w-full text-left rounded-lg border border-border bg-card hover:border-gold/60 hover:bg-muted/40 transition-colors p-4 flex items-start gap-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-primary/5 text-primary p-2 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-foreground", children: "Copy Link Instead" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Grab the URL and share it manually — no notification sent." })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: onClose,
          className: "w-full text-left rounded-lg border border-border bg-card hover:border-border hover:bg-muted/40 transition-colors p-4 flex items-start gap-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-muted text-muted-foreground p-2 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-foreground", children: "Skip for now" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Content is live — members will discover it naturally." })
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 pb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "w-full text-muted-foreground", onClick: onClose, children: "Close" }) })
  ] }) });
}
const lessonSchema = objectType({
  id: stringType().uuid().nullable(),
  title: stringType().trim().min(1).max(200),
  description: stringType().trim().max(5e3).nullable().optional(),
  content_type: enumType(["video", "pdf", "text"]),
  video_url: stringType().trim().max(2e3).nullable().optional(),
  pdf_url: stringType().trim().max(2e3).nullable().optional(),
  text_content: stringType().trim().max(5e4).nullable().optional(),
  order_index: numberType().int().min(0)
});
const moduleSchema = objectType({
  id: stringType().uuid().nullable(),
  title: stringType().trim().min(1).max(200),
  description: stringType().trim().max(5e3).nullable().optional(),
  order_index: numberType().int().min(0),
  lessons: arrayType(lessonSchema)
});
const saveCourseSchema = objectType({
  id: stringType().uuid().nullable(),
  title: stringType().trim().min(1).max(300),
  description: stringType().trim().max(5e3).nullable().optional(),
  thumbnail_url: stringType().trim().max(2e3).nullable().optional(),
  category_id: stringType().uuid().nullable().optional(),
  display_author_name: stringType().trim().max(120).nullable().optional(),
  status: enumType(["draft", "published"]),
  modules: arrayType(moduleSchema)
});
const deleteCourseSchema = objectType({
  id: stringType().uuid()
});
const saveCourse = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => saveCourseSchema.parse(input)).handler(createSsrRpc("303b702e8ad651844f252c7c77d8a1cdb39da0b55118d0aeba8a89d87a861e47"));
const listAdminCourses = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("132dd310d19cf0eec5e5ecf14ec409903610a795ec02ff8bf96fdbca9bd1ea77"));
const publishAllDraftCourses = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("ff779bbab4ff04bf67d5513ba10a0b57fb531258368564f391e9b1a80eb8978c"));
const deleteCourse = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => deleteCourseSchema.parse(input)).handler(createSsrRpc("398a5874789098e47ced66f8e6b8370109c861aefb975c8725f6a6aa92e62ea2"));
export {
  PublishNotificationModal as P,
  deleteCourse as d,
  listAdminCourses as l,
  publishAllDraftCourses as p,
  saveCourse as s
};
