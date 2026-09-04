import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-IF66mSk9.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { n as notifyNewMember } from "./notify.functions-C2jnqAvX.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { I as Input } from "./input-DwaGuH4D.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { P as PasswordInput } from "./PasswordInput-D6cG5TTn.mjs";
import { P as PhoneInput } from "../_libs/react-phone-number-input.mjs";
import "../_libs/seroval.mjs";
import { A as ArrowLeft, L as LoaderCircle } from "../_libs/lucide-react.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./createSsrRpc-Bc62EJ78.mjs";
import "./server-BomfFVcN.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-dN1VnyDc.mjs";
import "../_libs/zod.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/libphonenumber-js.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/classnames.mjs";
import "../_libs/input-format.mjs";
import "../_libs/country-flag-icons.mjs";
function SignupPage() {
  const notifyAdmins = useServerFn(notifyNewMember);
  const [fullName, setFullName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState(void 0);
  const [practice, setPractice] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [confirm, setConfirm] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) return toast.error("Full name is required");
    if (password.length < 8) return toast.error("Password must be at least 8 characters");
    if (password !== confirm) return toast.error("Passwords do not match");
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
            phone: phone ?? null,
            practice_name: practice || null
          }
        }
      });
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
      const userId = data.user?.id;
      if (data.session && userId) {
        await supabase.from("profiles").upsert({
          id: userId,
          email,
          full_name: fullName,
          phone: phone ?? null,
          practice_name: practice || null
        }).eq("id", userId);
      }
      notifyAdmins({
        data: {
          fullName,
          email,
          practiceName: practice || null
        }
      }).catch(() => {
      });
      if (data.session) {
        window.location.href = "/dashboard";
      } else {
        window.location.href = `/signup/confirm?email=${encodeURIComponent(email)}`;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Signup failed — please try again");
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-background px-6 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
      "Back to home"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/dcpg-logo.png", alt: "DCPG", style: {
      height: 40
    } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl md:text-4xl font-extrabold text-foreground leading-tight mb-2", children: "Activate your account" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-8", children: "Join chiropractors growing their practices with Ryan Rieder's complete teaching library." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "fullName", children: [
          "Full Name ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "fullName", required: true, value: fullName, onChange: (e) => setFullName(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "email", children: [
          "Email ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", autoComplete: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "phone", children: [
          "Phone number ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "(optional)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PhoneInput, { id: "phone", international: true, defaultCountry: "US", value: phone, onChange: setPhone, className: "phone-input" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "practice", children: [
          "Practice Name ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "(optional)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "practice", value: practice, onChange: (e) => setPractice(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "password", children: [
          "Password ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PasswordInput, { id: "password", autoComplete: "new-password", required: true, minLength: 8, value: password, onChange: (e) => setPassword(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Minimum 8 characters." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "confirm", children: [
          "Confirm Password ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PasswordInput, { id: "confirm", autoComplete: "new-password", required: true, value: confirm, onChange: (e) => setConfirm(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: loading, className: "w-full bg-gold text-gold-foreground hover:bg-gold/90 h-11 font-semibold inline-flex items-center gap-2", children: [
        loading && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
        loading ? "Activating…" : "Activate My Account"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-8 border-t border-border" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground text-center", children: [
      "Already have an account?",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-foreground font-medium hover:underline", children: "Sign In" })
    ] })
  ] }) });
}
export {
  SignupPage as component
};
