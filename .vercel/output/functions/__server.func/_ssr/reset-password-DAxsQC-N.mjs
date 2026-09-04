import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-IF66mSk9.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { P as PasswordInput } from "./PasswordInput-D6cG5TTn.mjs";
import { A as ArrowLeft, K as KeyRound, L as LoaderCircle } from "../_libs/lucide-react.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "./input-DwaGuH4D.mjs";
function ResetPasswordPage() {
  const [password, setPassword] = reactExports.useState("");
  const [confirm, setConfirm] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [ready, setReady] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      if (session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    setError(null);
    const {
      error: updateErr
    } = await supabase.auth.updateUser({
      password
    });
    setLoading(false);
    if (updateErr) {
      setError(updateErr.message);
      toast.error(updateErr.message);
      return;
    }
    toast.success("Password updated — signing you in");
    window.location.href = "/dashboard";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-background px-6 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/login", className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
      "Back to sign in"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/dcpg-logo.png", alt: "DCPG", style: {
      height: 40
    } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-14 w-14 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-7 w-7 text-gold" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl md:text-4xl font-extrabold text-foreground leading-tight mb-2", children: "Set a new password" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-8", children: "Choose a strong password for your DCPG account." }),
    !ready ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/30 px-5 py-5 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground mb-1", children: "Verifying reset link…" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "If this takes more than a few seconds, your link may have expired." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "mt-3 inline-block text-foreground font-medium hover:underline", children: "Request a new link" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "password", children: [
          "New Password ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PasswordInput, { id: "password", autoComplete: "new-password", required: true, minLength: 8, value: password, onChange: (e) => setPassword(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Minimum 8 characters." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "confirm", children: [
          "Confirm New Password ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PasswordInput, { id: "confirm", autoComplete: "new-password", required: true, value: confirm, onChange: (e) => setConfirm(e.target.value) })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: loading, className: "w-full bg-gold text-gold-foreground hover:bg-gold/90 h-11 font-semibold inline-flex items-center gap-2", children: [
        loading && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
        loading ? "Updating…" : "Update Password"
      ] })
    ] })
  ] }) });
}
export {
  ResetPasswordPage as component
};
