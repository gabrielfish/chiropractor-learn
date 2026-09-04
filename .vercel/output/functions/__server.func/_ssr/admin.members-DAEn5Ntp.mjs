import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { s as setUserRole, a as setMemberActive, l as listMembers } from "./members.functions-BhUs0AJi.mjs";
import { A as AdminSidebar } from "./AdminSidebar-D42diM0w.mjs";
import { I as Input } from "./input-DwaGuH4D.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-pXddDSBH.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { z as Link2, c as Search, U as Users, J as UserCheck, a2 as UserX, L as LoaderCircle, h as Check, a3 as Copy, S as ShieldCheck } from "../_libs/lucide-react.mjs";
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
import "./createSsrRpc-Bc62EJ78.mjs";
import "./server-BomfFVcN.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-dN1VnyDc.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/zod.mjs";
import "./client-IF66mSk9.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
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
const ROLE_LABELS = {
  member: "Member",
  author: "Team Member",
  super_admin: "Super Admin"
};
const ROLE_COLOURS = {
  member: "bg-blue-500/10 text-blue-600"
};
function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
function Avatar({
  member
}) {
  const initials = (member.full_name ?? member.email ?? "?").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  if (member.avatar_url) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: member.avatar_url, alt: member.full_name ?? "", className: "h-8 w-8 rounded-full object-cover shrink-0" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0", children: initials });
}
function MembersPage() {
  const listFn = useServerFn(listMembers);
  const toggleFn = useServerFn(setMemberActive);
  const roleFn = useServerFn(setUserRole);
  const qc = useQueryClient();
  const [search, setSearch] = reactExports.useState("");
  const [inviteOpen, setInviteOpen] = reactExports.useState(false);
  const [copiedKey, setCopiedKey] = reactExports.useState(null);
  const [pendingRole, setPendingRole] = reactExports.useState(null);
  const [pendingToggle, setPendingToggle] = reactExports.useState(null);
  const membersQ = useQuery({
    queryKey: ["admin", "members"],
    queryFn: () => listFn()
  });
  const toggleMut = useMutation({
    mutationFn: (vars) => {
      setPendingToggle(vars.userId);
      return toggleFn({
        data: vars
      });
    },
    onSuccess: (_data, vars) => {
      toast.success(vars.is_active ? "Member reactivated" : "Member deactivated — content reassigned to Dr Ryan Rieder");
      qc.invalidateQueries({
        queryKey: ["admin", "members"]
      });
    },
    onError: (err) => toast.error(err.message),
    onSettled: () => setPendingToggle(null)
  });
  const roleMut = useMutation({
    mutationFn: (vars) => {
      setPendingRole(vars.userId);
      return roleFn({
        data: vars
      });
    },
    onSuccess: (_data, vars) => {
      const label = ROLE_LABELS[vars.role];
      toast.success(`Role updated to ${label} — user will move to the appropriate section`);
      qc.invalidateQueries({
        queryKey: ["admin", "members"]
      });
      qc.invalidateQueries({
        queryKey: ["admin", "authors"]
      });
    },
    onError: (err) => toast.error(err.message),
    onSettled: () => setPendingRole(null)
  });
  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2e3);
    } catch {
      toast.error("Failed to copy");
    }
  };
  const members = membersQ.data?.members ?? [];
  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    return !q || (m.full_name ?? "").toLowerCase().includes(q) || (m.email ?? "").toLowerCase().includes(q);
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AdminSidebar, { active: "members" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 pt-14 px-4 pb-4 sm:px-8 sm:pb-8 md:p-8 overflow-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-extrabold text-foreground", children: "Members" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: membersQ.isLoading ? "Loading…" : `${members.length} member${members.length !== 1 ? "s" : ""} total` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setInviteOpen(true), className: "bg-gold text-gold-foreground hover:bg-gold/90 font-semibold gap-2 self-start sm:self-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-4 w-4" }),
          " Invite Member"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-6 max-w-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search by name or email…", value: search, onChange: (e) => setSearch(e.target.value), className: "pl-9" })
      ] }),
      membersQ.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground text-sm", children: "Loading members…" }) : membersQ.isError ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-destructive text-sm", children: [
        "Failed to load members: ",
        membersQ.error.message
      ] }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-20 text-center text-muted-foreground gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-10 w-10 opacity-30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: search ? "No members match your search." : "No members yet." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm min-w-[780px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/50 border-b border-border text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-semibold text-foreground whitespace-nowrap", children: "Member" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-semibold text-foreground whitespace-nowrap", children: "Practice" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-semibold text-foreground whitespace-nowrap", children: "Joined" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-semibold text-foreground whitespace-nowrap", children: "Last Login" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-semibold text-foreground whitespace-nowrap text-center", children: "Completed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-semibold text-foreground whitespace-nowrap text-center", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-semibold text-foreground whitespace-nowrap", children: "Role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-semibold text-foreground whitespace-nowrap" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: `border-b border-border last:border-0 transition-colors hover:bg-muted/30 ${!m.is_active ? "opacity-60" : ""} ${i % 2 === 0 ? "" : "bg-muted/10"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { member: m }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-foreground truncate", children: m.full_name ?? "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: m.email ?? "—" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: m.practice_name ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground whitespace-nowrap", children: formatDate(m.created_at) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground whitespace-nowrap", children: formatDate(m.last_login) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center justify-center h-6 min-w-[1.5rem] px-2 rounded-full bg-gold/15 text-gold text-xs font-semibold", children: m.content_completed }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${m.is_active ? "bg-green-500/15 text-green-600" : "bg-muted text-muted-foreground"}`, children: m.is_active ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "h-3 w-3" }),
            " Active"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserX, { className: "h-3 w-3" }),
            " Inactive"
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: pendingRole === m.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }),
            " Saving…"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: "member", onChange: (e) => roleMut.mutate({
            userId: m.id,
            role: e.target.value
          }), className: `text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/50 ${ROLE_COLOURS["member"]}`, title: "Change role", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "member", children: "Member" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "author", children: "Team Member" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "super_admin", children: "Super Admin" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: pendingToggle === m.id ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1 text-xs text-muted-foreground px-3 py-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggleMut.mutate({
            userId: m.id,
            is_active: !m.is_active
          }), disabled: toggleMut.isPending, className: `text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${m.is_active ? "border-destructive/30 text-destructive hover:bg-destructive/10" : "border-green-500/30 text-green-600 hover:bg-green-500/10"}`, children: m.is_active ? "Deactivate" : "Reactivate" }) })
        ] }, m.id)) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: inviteOpen, onOpenChange: setInviteOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-[calc(100%-32px)] sm:max-w-[560px] p-0 overflow-hidden border-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary text-primary-foreground px-6 pt-6 pb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display text-xl font-extrabold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-5 w-5 text-gold" }),
          " Invite to the Portal"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-primary-foreground/70 mt-1", children: "Share the right link for the right type of account." })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 sm:p-6 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border-2 border-gold/30 bg-gold/5 p-4 sm:p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-gold/15 text-gold p-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-foreground text-base", children: "Invite an Inner Circle Member" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Share this link with Ryan's Inner Circle members to give them access." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-background border border-border p-2.5 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground/70 font-mono truncate select-all mb-2 px-1", children: "https://learn.dcpracticegrowth.com/signup?invite=INNERCIRCLE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => copyToClipboard("https://learn.dcpracticegrowth.com/signup?invite=INNERCIRCLE", "member-link"), className: "w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-md bg-gold text-gold-foreground hover:bg-gold/90 transition-colors", children: copiedKey === "member-link" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5" }),
              " Copied!"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3.5 w-3.5" }),
              " Copy Link"
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border-2 border-primary/20 bg-primary/5 p-4 sm:p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-primary/10 text-primary p-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-foreground text-base", children: "Invite a Team Member" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Share this link and access code with DCPG team members who need to upload content." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-background border border-border p-2.5 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground/70 font-mono truncate select-all mb-2 px-1", children: "https://learn.dcpracticegrowth.com/team-signup" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => copyToClipboard("https://learn.dcpracticegrowth.com/team-signup", "team-link"), className: "w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors", children: copiedKey === "team-link" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5" }),
              " Copied!"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3.5 w-3.5" }),
              " Copy Link"
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-background border border-border p-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-2 px-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground shrink-0", children: "Access Code:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold font-mono text-foreground tracking-widest select-all", children: "DCPGTEAM" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => copyToClipboard("DCPGTEAM", "team-code"), className: "w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors", children: copiedKey === "team-code" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5" }),
              " Copied!"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3.5 w-3.5" }),
              " Copy Code"
            ] }) })
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  MembersPage as component
};
