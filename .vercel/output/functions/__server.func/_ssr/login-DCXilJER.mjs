import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as redirect } from "../_libs/tanstack__router-core.mjs";
import { s as supabase } from "./client-IF66mSk9.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { I as Input } from "./input-DwaGuH4D.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { P as PasswordInput } from "./PasswordInput-D6cG5TTn.mjs";
import { R as Route$g } from "./router-BgAMxlwC.mjs";
import { A as ArrowLeft, L as LoaderCircle, P as Play, F as FileText, a as Award } from "../_libs/lucide-react.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/zod.mjs";
async function routeByRole() {
  const {
    data: {
      user
    }
  } = await supabase.auth.getUser();
  if (!user) return;
  const {
    data: roles
  } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
  const roleSet = new Set((roles ?? []).map((r) => r.role));
  if (roleSet.has("super_admin") || roleSet.has("author")) {
    throw redirect({
      to: "/admin"
    });
  }
  throw redirect({
    to: "/dashboard"
  });
}
const TESTIMONIALS = [{
  quote: "80 leads at £1.63 each, 32 new patients booked in just 6 days. Paid for the whole year from one campaign!",
  author: "Dr. Alex Eatly",
  clinic: "Liverpool Chiropractic UK"
}, {
  quote: "In just 3 months, revenue increased by £38,408 and visits skyrocketed from 535 to 913.",
  author: "Dr. Julien Barker",
  clinic: "Spinal Health Centre UK"
}, {
  quote: "121 leads at £1 per lead at our Grand Opening. Everyone who responded bought a plan — ridiculous ROI!",
  author: "Dr. Mats Flodin",
  clinic: "Roslagens Kiropraktik"
}, {
  quote: "I've increased new patients by 50% in 9 months. Big thank you to Ryan and the DCPG team.",
  author: "Dr. Gurmeet Tulsi",
  clinic: "Healthwise Chiropractic UK"
}];
function LoginPage() {
  const {
    redirect: redirectParam
  } = Route$g.useSearch();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [activeIndex, setActiveIndex] = reactExports.useState(0);
  const [showForgot, setShowForgot] = reactExports.useState(false);
  const [forgotEmail, setForgotEmail] = reactExports.useState("");
  const [forgotLoading, setForgotLoading] = reactExports.useState(false);
  const [forgotSent, setForgotSent] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 4e3);
    return () => clearInterval(interval);
  }, []);
  reactExports.useEffect(() => {
    supabase.auth.getUser().then(async ({
      data
    }) => {
      if (data.user) {
        try {
          await routeByRole();
        } catch (r) {
          throw r;
        }
      }
    }).catch(() => {
    });
  }, []);
  const handleForgot = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotLoading(true);
    const {
      error
    } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim(), {
      redirectTo: "https://learn.dcpracticegrowth.com/reset-password"
    });
    setForgotLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setForgotSent(true);
    toast.success("Password reset email sent — check your inbox");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const {
      error
    } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back");
    const {
      data: {
        user
      }
    } = await supabase.auth.getUser();
    if (!user) return;
    const {
      data: roles
    } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
    const roleSet = new Set((roles ?? []).map((r) => r.role));
    if (redirectParam && redirectParam.startsWith("/")) {
      window.location.href = redirectParam;
    } else if (roleSet.has("super_admin") || roleSet.has("author")) {
      window.location.href = "/admin";
    } else {
      window.location.href = "/dashboard";
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col md:flex-row", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 md:basis-3/5 flex items-center justify-center px-6 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        "Back to home"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/dcpg-logo.png", alt: "DCPG", style: {
        height: 40
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl md:text-4xl font-extrabold text-foreground leading-tight mb-3", children: "Ryan Rieder's complete teaching library, built for chiropractors who want to grow." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-8", children: "Search unlimited courses, watch video lessons, download resources, and grow your practice." }),
      redirectParam && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 rounded-lg border border-gold/30 bg-gold/5 px-4 py-3 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gold text-lg", children: "🔒" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground font-medium", children: "Sign in to access this content" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", autoComplete: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", children: "Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PasswordInput, { id: "password", autoComplete: "current-password", required: true, value: password, onChange: (e) => setPassword(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: loading, className: "w-full bg-gold text-gold-foreground hover:bg-gold/90 h-11 font-semibold inline-flex items-center gap-2", children: [
          loading && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
          loading ? "Signing in…" : "Sign In"
        ] })
      ] }),
      !showForgot ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
        setShowForgot(true);
        setForgotEmail(email);
        setForgotSent(false);
      }, className: "mt-3 text-sm text-muted-foreground hover:text-primary", children: "Forgot password?" }) : forgotSent ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-lg border border-green-500/30 bg-green-500/5 px-4 py-3 text-sm text-green-700 dark:text-green-400", children: [
        "✓ Password reset email sent — check your inbox.",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
          setShowForgot(false);
          setForgotSent(false);
        }, className: "underline", children: "Back to sign in" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleForgot, className: "mt-4 rounded-lg border border-border bg-muted/30 px-4 py-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Reset your password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Enter your email and we'll send you a reset link." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "forgotEmail", className: "text-xs", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "forgotEmail", type: "email", required: true, autoComplete: "email", value: forgotEmail, onChange: (e) => setForgotEmail(e.target.value), className: "h-9 text-sm" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: forgotLoading, className: "flex-1 h-9 text-sm bg-gold text-gold-foreground hover:bg-gold/90 font-semibold inline-flex items-center gap-1.5", children: [
            forgotLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }),
            forgotLoading ? "Sending…" : "Send reset link"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => setShowForgot(false), className: "h-9 text-sm", children: "Cancel" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-8 border-t border-border" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Don't have an account?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", className: "text-foreground font-medium hover:underline", children: "Sign Up" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:flex md:basis-2/5 bg-primary text-primary-foreground items-center justify-center px-10 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-sm w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/ryan-rieder.webp", alt: "Ryan Rieder", className: "rounded-full object-cover mb-3 border-2 border-gold/40", style: {
          width: 120,
          height: 120
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xl font-bold text-gold", children: "Ryan Rieder" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-primary-foreground/60", children: "Founder, DCPG" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-44 mb-10", children: TESTIMONIALS.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 transition-opacity duration-700 ease-in-out", style: {
        opacity: i === activeIndex ? 1 : 0
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("blockquote", { className: "font-display text-xl leading-snug mb-3", children: [
          '"',
          t.quote,
          '"'
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-primary-foreground/70 font-medium", children: [
          "— ",
          t.author
        ] }),
        t.clinic && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-primary-foreground/50 mt-0.5", children: t.clinic })
      ] }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Feature, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-5 w-5" }), title: "Video lessons", desc: "Watch on any device, anytime." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Feature, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-5 w-5" }), title: "PDF resources", desc: "Done-for-you templates and scripts." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Feature, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-5 w-5" }), title: "Certificates", desc: "Earn recognition as you complete tracks." })
      ] })
    ] }) })
  ] });
}
function Feature({
  icon,
  title,
  desc
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-gold/20 text-gold p-2 flex items-center justify-center", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-primary-foreground/70", children: desc })
    ] })
  ] });
}
export {
  LoginPage as component
};
