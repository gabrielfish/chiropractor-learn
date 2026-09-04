import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, b as useMutation, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { c as createSsrRpc } from "./createSsrRpc-Bc62EJ78.mjs";
import { a as createServerFn } from "./server-BomfFVcN.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-dN1VnyDc.mjs";
import { a as setMemberActive } from "./members.functions-BhUs0AJi.mjs";
import { A as AdminSidebar } from "./AdminSidebar-D42diM0w.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { I as Input } from "./input-DwaGuH4D.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { F as FileDropzone, u as uploadAvatar, T as Textarea } from "./storage-BcoHSXhA.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, e as DialogFooter } from "./dialog-pXddDSBH.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { U as Users, J as UserCheck, a2 as UserX, v as Pencil, F as FileText, L as LoaderCircle, h as Check, z as Link2 } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "../_libs/isbot.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./client-IF66mSk9.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
const listAuthors = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("df2fa5691b2feeae1819278ec5f928002c89b33dfd3f383eb8456f5a2e7aab14"));
const updateSchema = objectType({
  id: stringType().uuid(),
  full_name: stringType().trim().min(1).max(120),
  job_title: stringType().trim().max(150).nullable().optional(),
  bio: stringType().trim().max(2e3).nullable().optional(),
  avatar_url: stringType().url().max(2e3).nullable().optional()
});
const updateAuthorProfile = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => updateSchema.parse(input)).handler(createSsrRpc("2548c42e71446f6c6deb1d6f6a2e038bef0c7a216248c56046801e6cf9b19b7e"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  contentId: stringType().uuid()
}).parse(input)).handler(createSsrRpc("1fd28fec5e28d0bede6de3cf319f3aa1f9805d7b06d69d76b039a4f2aa054e12"));
function AuthorsPage() {
  const list = useServerFn(listAuthors);
  const update = useServerFn(updateAuthorProfile);
  const toggleFn = useServerFn(setMemberActive);
  const qc = useQueryClient();
  const [editing, setEditing] = reactExports.useState(null);
  const [copied, setCopied] = reactExports.useState(false);
  const [pendingToggle, setPendingToggle] = reactExports.useState(null);
  const toggleMut = useMutation({
    mutationFn: (vars) => {
      setPendingToggle(vars.userId);
      return toggleFn({
        data: vars
      });
    },
    onSuccess: (_data, vars) => {
      toast.success(vars.is_active ? "Team member reactivated" : "Team member deactivated — content reassigned to Dr Ryan Rieder");
      qc.invalidateQueries({
        queryKey: ["admin", "authors"]
      });
    },
    onError: (err) => toast.error(err.message),
    onSettled: () => setPendingToggle(null)
  });
  const handleCopyLink = async () => {
    const url = "https://learn.dcpracticegrowth.com/team-signup";
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    } catch {
      toast.error("Failed to copy link");
    }
  };
  const authorsQ = useQuery({
    queryKey: ["admin", "authors"],
    queryFn: () => list()
  });
  const saveMut = useMutation({
    mutationFn: (a) => update({
      data: {
        id: a.id,
        full_name: a.full_name ?? "",
        job_title: a.job_title,
        bio: a.bio,
        avatar_url: a.avatar_url
      }
    }),
    onSuccess: () => {
      toast.success("Team member profile updated");
      qc.invalidateQueries({
        queryKey: ["admin", "authors"]
      });
      setEditing(null);
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col md:flex-row bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AdminSidebar, { active: "authors" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 pt-14 px-6 pb-6 md:p-10 overflow-x-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-7 w-7 text-gold" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-extrabold", children: "Team Members" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-8", children: "All team members with publishing access." }),
      authorsQ.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-40 rounded-xl bg-muted animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        (authorsQ.data?.authors ?? []).map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `rounded-xl bg-card border border-border p-5 shadow-card transition-opacity ${!a.is_active ? "opacity-60" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
          a.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: a.avatar_url, alt: a.full_name ?? "", className: "w-16 h-16 rounded-full object-cover border border-border" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-primary/10 text-gold flex items-center justify-center font-display font-bold text-xl", children: (a.full_name ?? "?").slice(0, 1).toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-foreground truncate", children: a.full_name ?? "Unnamed team member" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${a.is_active ? "bg-green-500/15 text-green-600" : "bg-muted text-muted-foreground"}`, children: a.is_active ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "h-3 w-3" }),
                  " Active"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(UserX, { className: "h-3 w-3" }),
                  " Inactive"
                ] }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", onClick: () => setEditing(a), className: "text-muted-foreground hover:text-gold shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) })
            ] }),
            a.job_title && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gold font-medium", children: a.job_title }),
            a.email && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: a.email }),
            a.bio && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/80 mt-2 line-clamp-3", children: a.bio }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-3.5 w-3.5" }),
                a.content_count,
                " ",
                a.content_count === 1 ? "lesson" : "lessons",
                " published"
              ] }),
              pendingToggle === a.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-xs text-muted-foreground px-2 py-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }),
                " Saving…"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggleMut.mutate({
                userId: a.id,
                is_active: !a.is_active
              }), disabled: toggleMut.isPending, className: `text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${a.is_active ? "border-destructive/30 text-destructive hover:bg-destructive/10" : "border-green-500/30 text-green-600 hover:bg-green-500/10"}`, children: a.is_active ? "Deactivate" : "Reactivate" })
            ] })
          ] })
        ] }) }, a.id)),
        !authorsQ.isLoading && (authorsQ.data?.authors ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 rounded-xl bg-card border border-border p-12 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-8 w-8 text-gold" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-bold text-foreground mb-2", children: "No team members yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-md mx-auto mb-6", children: "Share the team signup link with your colleagues" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleCopyLink, className: "bg-gold text-gold-foreground hover:bg-gold/90", children: [
            copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 mr-2" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-4 w-4 mr-2" }),
            copied ? "Copied!" : "Copy Team Signup Link"
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: editing !== null, onOpenChange: (o) => {
      if (!o) setEditing(null);
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Edit team member" }) }),
      editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          editing.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: editing.avatar_url, alt: "", className: "w-20 h-20 rounded-full object-cover border border-border" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-primary/10 text-gold flex items-center justify-center font-display font-bold text-2xl", children: (editing.full_name ?? "?").slice(0, 1).toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileDropzone, { label: "Upload photo", accept: "image/*", uploaded: !!editing.avatar_url, hint: "JPG or PNG, square recommended", onFile: async (file) => {
            try {
              const url = await uploadAvatar(editing.id, file);
              setEditing({
                ...editing,
                avatar_url: url
              });
              toast.success("Photo uploaded");
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Upload failed");
            }
          } }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Display name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editing.full_name ?? "", onChange: (e) => setEditing({
            ...editing,
            full_name: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Job title" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "e.g. Practice Growth Coach", value: editing.job_title ?? "", onChange: (e) => setEditing({
            ...editing,
            job_title: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Bio" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 4, value: editing.bio ?? "", onChange: (e) => setEditing({
            ...editing,
            bio: e.target.value
          }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => setEditing(null), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => editing && saveMut.mutate(editing), disabled: saveMut.isPending, className: "bg-gold text-gold-foreground hover:bg-gold/90", children: saveMut.isPending ? "Saving…" : "Save" })
      ] })
    ] }) })
  ] });
}
export {
  AuthorsPage as component
};
