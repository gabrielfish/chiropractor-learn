import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { s as supabase } from "./client-IF66mSk9.mjs";
import { c as createSsrRpc } from "./createSsrRpc-Bc62EJ78.mjs";
import { a as createServerFn } from "./server-BomfFVcN.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { I as Input } from "./input-DwaGuH4D.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { P as PasswordInput } from "./PasswordInput-D6cG5TTn.mjs";
import { P as PhoneInput } from "../_libs/react-phone-number-input.mjs";
import "../_libs/seroval.mjs";
import { A as ArrowLeft, S as ShieldCheck } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
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
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
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
const schema = objectType({
  fullName: stringType().trim().min(1).max(120),
  email: stringType().trim().email().max(255),
  password: stringType().min(8).max(200),
  phone: stringType().trim().max(40).nullable().optional(),
  practice: stringType().trim().max(200).nullable().optional(),
  accessCode: stringType().min(1).max(200)
});
const teamSignup = createServerFn({
  method: "POST"
}).inputValidator((input) => schema.parse(input)).handler(createSsrRpc("da76528b7c67b1041ecd244ad65e5dc3d2f5f5519fba5a29cb72fc9ab5cad5bf"));
function TeamSignupPage() {
  const navigate = useNavigate();
  const signupFn = useServerFn(teamSignup);
  const [fullName, setFullName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState(void 0);
  const [practice, setPractice] = reactExports.useState("");
  const [accessCode, setAccessCode] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [confirm, setConfirm] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) return toast.error("Full name is required");
    if (!accessCode.trim()) return toast.error("Team access code is required");
    if (password.length < 8) return toast.error("Password must be at least 8 characters");
    if (password !== confirm) return toast.error("Passwords do not match");
    setLoading(true);
    try {
      await signupFn({
        data: {
          fullName,
          email,
          password,
          phone: phone ?? null,
          practice: practice || null,
          accessCode
        }
      });
      const {
        error: signInErr
      } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (signInErr) {
        toast.success("Account created — please sign in.");
        navigate({
          to: "/login"
        });
        return;
      }
      toast.success("Welcome to the team!");
      navigate({
        to: "/admin"
      });
    } catch (e2) {
      toast.error(e2 instanceof Error ? e2.message : "Could not create account");
    } finally {
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-gold mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-5 w-5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold uppercase tracking-wider", children: "Team members only" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl md:text-4xl font-extrabold text-foreground leading-tight mb-2", children: "Activate your team member account" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-8", children: "Team members publish content directly to the DCPG library. You need an access code from your admin to continue." }),
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "accessCode", children: [
          "Team Access Code ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "accessCode", required: true, value: accessCode, onChange: (e) => setAccessCode(e.target.value), className: "border-gold/40 focus-visible:ring-gold", placeholder: "Enter the code provided by your DCPG admin" })
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
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: loading, className: "w-full bg-gold text-gold-foreground hover:bg-gold/90 h-11 font-semibold", children: loading ? "Activating…" : "Activate Team Member Account" })
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
  TeamSignupPage as component
};
