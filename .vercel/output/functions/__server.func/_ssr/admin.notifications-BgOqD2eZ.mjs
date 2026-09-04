import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AdminSidebar } from "./AdminSidebar-D42diM0w.mjs";
import { O as Bell } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "../_libs/isbot.mjs";
import "./client-IF66mSk9.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function NotificationsPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col md:flex-row bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AdminSidebar, { active: "notifications" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 pt-14 px-4 pb-4 sm:px-6 sm:pb-6 md:p-10 overflow-x-hidden min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-extrabold mb-1", children: "Notifications" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-8", children: "Manage email notifications to members." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-card border border-border p-8 shadow-card flex flex-col items-center justify-center text-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-8 w-8 text-gold" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold mb-2", children: "Notification centre" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground max-w-md", children: [
            "Email notifications are sent automatically when you publish a lesson. Use the ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Notify members" }),
            " button on any published lesson card in the Content section to send a broadcast email to all members who have notifications enabled."
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  NotificationsPage as component
};
