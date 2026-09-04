import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { a as Route$d } from "./router-BgAMxlwC.mjs";
import "../_libs/sonner.mjs";
import { A as ArrowLeft, e as MailCheck } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
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
import "../_libs/zod.mjs";
function ConfirmPage() {
  const {
    email
  } = Route$d.useSearch();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-background px-6 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
      "Back to home"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-16 w-16 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MailCheck, { className: "h-8 w-8 text-gold" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl md:text-4xl font-extrabold text-foreground leading-tight mb-4", children: "Check your inbox!" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-1", children: "We sent a confirmation link to" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-lg mb-4 break-all", children: email ?? "your email address" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2", children: "Click it to activate your account and start learning." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-8", children: "Can't find it? Check your spam folder." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "w-full bg-gold text-gold-foreground hover:bg-gold/90 h-11 font-semibold mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: "Go to Sign In" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
      "Wrong address?",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", className: "text-foreground font-medium hover:underline", children: "Sign up again" })
    ] })
  ] }) });
}
export {
  ConfirmPage as component
};
