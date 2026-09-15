import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { e as useSearch, L as Link } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-IF66mSk9.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { n as notifyNewMember } from "./notify.functions-CrRd-XzN.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { I as Input } from "./input-DwaGuH4D.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { P as PasswordInput } from "./PasswordInput-D6cG5TTn.mjs";
import { P as PhoneInput } from "../_libs/react-phone-number-input.mjs";
import "../_libs/seroval.mjs";
import { A as ArrowLeft, P as Play, B as BookOpen, a as Award, C as CalendarDays, L as LoaderCircle } from "../_libs/lucide-react.mjs";
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
import "./createSsrRpc-D1HIuwD_.mjs";
import "./server-DAhjTOZR.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-CINWQ1Vb.mjs";
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
const VALID_INVITE = "INNERCIRCLE";
const BOOKING_URL = "https://api.leadconnectorhq.com/widget/booking/se3iS4vBOzoiBEaeoSdC";
const TESTIMONIALS = [{
  quote: "New patients increased from 25 to 77 per month — without burnout or gimmicks.",
  name: "Dr. Wendy McCloud",
  clinic: "WDC Physiotherapy UK"
}, {
  quote: "80 leads at £1.63 each, 32 new patients booked in just 6 days. Paid for the whole year from one campaign!",
  name: "Dr. Alex Eatly",
  clinic: "Liverpool Chiropractic UK"
}, {
  quote: "Since coaching with Ryan my clinic has exploded. We are generating an EXTRA $7,600 per week.",
  name: "Dr. Mike Paull",
  clinic: ""
}];
function TestimonialCarousel() {
  const [active, setActive] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % TESTIMONIALS.length), 5e3);
    return () => clearInterval(id);
  }, []);
  const t = TESTIMONIALS[active];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full bg-primary rounded-2xl px-8 py-10 text-center relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 left-6 text-gold/20 font-serif text-9xl leading-none select-none pointer-events-none", children: '"' }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center gap-1 mb-5 relative z-10", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gold text-xl", children: "★" }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("blockquote", { className: "relative z-10 text-primary-foreground text-lg sm:text-xl italic font-medium leading-relaxed max-w-2xl mx-auto mb-6", children: [
      '"',
      t.quote,
      '"'
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gold font-semibold text-base", children: t.name }),
      t.clinic && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-primary-foreground/60 text-sm mt-0.5", children: t.clinic })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center gap-2 mt-7 relative z-10", children: TESTIMONIALS.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActive(i), className: `w-2 h-2 rounded-full transition-all ${i === active ? "bg-gold w-5" : "bg-primary-foreground/30"}`, "aria-label": `Testimonial ${i + 1}` }, i)) })
  ] });
}
function NoInvitePage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col items-center justify-center bg-background px-6 py-16 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-6 left-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
      "Back to home"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/dcpg-logo.png", alt: "DCPG", style: {
      height: 48
    }, className: "mb-10 hover:opacity-80 transition-opacity" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground leading-tight mb-4 max-w-xl", children: "Ryan Rieder's Inner Circle Teaching Library" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg max-w-md mb-10", children: "Get access to 200+ chiropractic growth teachings, courses, and books — built for chiropractors who want to scale." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap justify-center gap-3 mb-10", children: [{
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-4 w-4" }),
      label: "200+ video teachings"
    }, {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-4 w-4" }),
      label: "Complete books & PDFs"
    }, {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-4 w-4" }),
      label: "Proven growth systems"
    }].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/5 text-sm font-medium text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gold", children: f.icon }),
      f.label
    ] }, f.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: BOOKING_URL, target: "_blank", rel: "noopener noreferrer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", className: "bg-gold text-gold-foreground hover:bg-gold/90 font-semibold h-14 px-10 text-base gap-2 mb-5 shadow-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-5 w-5" }),
      "Book a Strategy Call"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-8", children: "Free — no commitment required" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mb-12", children: [
      "Already a member?",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-foreground font-semibold hover:text-gold transition-colors", children: "Sign In" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-6", children: "Trusted by chiropractors worldwide" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TestimonialCarousel, {})
    ] })
  ] });
}
function SignupPage() {
  const {
    invite
  } = useSearch({
    from: "/signup"
  });
  if (!invite || invite.toUpperCase() !== VALID_INVITE) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(NoInvitePage, {});
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SignupForm, {});
}
function SignupForm() {
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
