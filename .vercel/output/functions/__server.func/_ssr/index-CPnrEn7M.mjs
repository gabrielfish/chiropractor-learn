import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { D as Dialog, a as DialogContent } from "./dialog-pXddDSBH.mjs";
import { c as createSsrRpc } from "./createSsrRpc-Bc62EJ78.mjs";
import { a as createServerFn } from "./server-BomfFVcN.mjs";
import "../_libs/seroval.mjs";
import { c as Search, X, M as Menu, Q as Quote, P as Play, F as FileText, B as BookOpen, U as Users, a as Award, d as Lock } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/tanstack__query-core.mjs";
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
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const schema = objectType({
  q: stringType().min(1).max(100)
});
const searchPublishedContent = createServerFn({
  method: "POST"
}).inputValidator((data) => schema.parse(data)).handler(createSsrRpc("49add15ccc0b504dea579d2c89979f5125e4f5ecad7c02192ebaf77537f1d812"));
function LandingSearchModal({
  open,
  onOpenChange
}) {
  const [q, setQ] = reactExports.useState("");
  const [debounced, setDebounced] = reactExports.useState("");
  const search = useServerFn(searchPublishedContent);
  reactExports.useEffect(() => {
    const id = setTimeout(() => setDebounced(q.trim()), 200);
    return () => clearTimeout(id);
  }, [q]);
  reactExports.useEffect(() => {
    if (!open) setQ("");
  }, [open]);
  const { data, isFetching } = useQuery({
    queryKey: ["landing-search", debounced],
    queryFn: () => search({ data: { q: debounced } }),
    enabled: open && debounced.length > 0,
    staleTime: 3e4
  });
  const results = data?.results ?? [];
  const showEmpty = open && debounced.length > 0 && !isFetching && results.length === 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-3xl p-0 gap-0 overflow-hidden bg-background border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border bg-primary text-primary-foreground p-5 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-5 w-5 text-gold shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          autoFocus: true,
          value: q,
          onChange: (e) => setQ(e.target.value),
          placeholder: "Search Ryan's unlimited free resources and the full DCPG teaching library",
          className: "flex-1 bg-transparent border-0 outline-none text-base placeholder:text-primary-foreground/50 text-primary-foreground"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => onOpenChange(false),
          className: "text-primary-foreground/70 hover:text-gold transition-colors",
          "aria-label": "Close search",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-[60vh] overflow-y-auto p-5 bg-background", children: [
      debounced.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-sm text-muted-foreground py-12", children: "Start typing to search Ryan's full teaching library." }),
      showEmpty && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-sm text-muted-foreground py-12", children: "No courses found — try another search term." }),
      results.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 gap-4", children: results.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "group relative rounded-xl overflow-hidden border border-border bg-card shadow-card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-video bg-muted relative overflow-hidden", children: [
              item.thumbnail_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: item.thumbnail_url,
                  alt: item.title,
                  className: "w-full h-full object-cover blur-sm scale-105",
                  loading: "lazy"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-10 w-10 text-gold/80" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-primary/70 backdrop-blur-[2px] flex flex-col items-center justify-center text-primary-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-gold/20 p-2.5 mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4 text-gold" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold tracking-wide uppercase text-gold", children: "Sign in to access" })
              ] }),
              item.video_duration && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-2 right-2 bg-black/70 text-white text-[11px] px-2 py-0.5 rounded z-10", children: item.video_duration })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
              item.category_name && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider font-semibold text-gold mb-1", children: item.category_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-sm text-foreground line-clamp-2 leading-snug", children: item.title })
            ] })
          ]
        },
        item.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border bg-muted/40 p-5 flex flex-col sm:flex-row items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Unlock unlimited courses and the full DCPG library." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/login",
            onClick: () => onOpenChange(false),
            className: "text-sm font-medium text-primary hover:text-gold transition-colors",
            children: "Sign In"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/signup",
            onClick: () => onOpenChange(false),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "bg-gold text-gold-foreground hover:bg-gold/90 font-semibold", children: "Sign Up for Access" })
          }
        )
      ] })
    ] })
  ] }) });
}
const testimonials = [{
  stat: "+380% Revenue Growth",
  quote: "Since joining Ryan in 2018, practice earnings increased by £330,000. Visit numbers rose from the 30s to 250 — now we can't fit anyone else in!",
  name: "Dr. Belinda Ambrose",
  clinic: "Aligned Family Chiropractic UK"
}, {
  stat: "£200K Extra Revenue",
  quote: "On track to generate £650,000 — £200,000 more than last year. Weekly visits up from 400 to 550.",
  name: "Dr. Tom & Dr. Becky Lawrence",
  clinic: "Goose & Hollings Lane Clinic UK"
}, {
  stat: "93 Patients in 1 Week",
  quote: "Advert live for just 1 week. 120 leads generated. 93 booked and prepaid. Unbelievable results.",
  name: "Dr. Brian & Caira",
  clinic: "Premier Chiropractic"
}, {
  stat: "Profit Up 91%",
  quote: "Revenue up £652K. Profit up 91%. And I still have my evenings off. Scaled from 290 to 430 weekly visits without burnout.",
  name: "Dr. Phil Mitchell",
  clinic: ""
}, {
  stat: "3x New Patients",
  quote: "My God, this has been a game changer. New patients increased from 25 to 77 per month — without burnout or gimmicks.",
  name: "Wendy McCloud",
  clinic: "WDC Physiotherapy UK"
}, {
  stat: "121 Leads at £1 Each",
  quote: "Grand Opening ad generated 121 leads at £1 per lead. Everyone who responded bought a plan — ridiculous ROI!",
  name: "Dr. Mats Flodin",
  clinic: "Roslagens Kiropraktik Sweden"
}];
const features = [{
  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-6 w-6" }),
  title: "Video lessons",
  desc: "Watch Ryan's full teaching catalogue on any device, anytime."
}, {
  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-6 w-6" }),
  title: "PDFs & downloads",
  desc: "Done-for-you templates, scripts, and protocols ready to use."
}, {
  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-6 w-6" }),
  title: "Complete books",
  desc: "Download Ryan's published books and reference guides."
}, {
  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-6 w-6" }),
  title: "Searchable library",
  desc: "Find any lesson, topic, or resource across unlimited courses instantly."
}, {
  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-6 w-6" }),
  title: "Built for chiropractors",
  desc: "Every lesson is purpose-built for growing a chiropractic practice."
}, {
  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-6 w-6" }),
  title: "Earn certificates",
  desc: "Track your progress and earn recognition as you complete tracks."
}];
function TestimonialCard({
  t
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-6 flex flex-col gap-4 h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-3xl font-extrabold text-gold tracking-tight", children: t.stat }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("blockquote", { className: "text-sm text-muted-foreground leading-relaxed flex-1", children: [
      '"',
      t.quote,
      '"'
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-foreground text-sm", children: t.name }),
      t.clinic && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: t.clinic })
    ] })
  ] });
}
function LandingPage() {
  const [searchOpen, setSearchOpen] = reactExports.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = reactExports.useState(false);
  const [showAllTestimonials, setShowAllTestimonials] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-6 h-16 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "flex items-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/dcpg-logo.png", alt: "DCPG", style: {
          height: 40
        } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", className: "text-foreground", children: "Sign In" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "bg-gold text-gold-foreground hover:bg-gold/90 font-semibold", children: "Sign Up" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", "aria-label": "Search courses", onClick: () => setSearchOpen(true), className: "text-foreground hover:text-gold", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-5 w-5" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex md:hidden items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", "aria-label": "Search courses", onClick: () => setSearchOpen(true), className: "text-foreground hover:text-gold", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", "aria-label": mobileMenuOpen ? "Close menu" : "Open menu", onClick: () => setMobileMenuOpen((o) => !o), className: "text-foreground hover:text-gold", children: mobileMenuOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `md:hidden overflow-hidden transition-all duration-300 ease-out ${mobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1 border-t border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", onClick: () => setMobileMenuOpen(false), className: "text-foreground font-medium py-3 px-2 rounded-lg hover:bg-muted transition-colors", children: "Home" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", onClick: () => setMobileMenuOpen(false), className: "text-foreground font-medium py-3 px-2 rounded-lg hover:bg-muted transition-colors", children: "Sign In" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", onClick: () => setMobileMenuOpen(false), className: "text-gold font-semibold py-3 px-2 rounded-lg hover:bg-muted transition-colors", children: "Sign Up" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative text-white overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-cover bg-center bg-no-repeat", style: {
        backgroundImage: "url('/hero.webp')"
      }, "aria-hidden": "true" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-5xl mx-auto px-5 sm:px-6 py-14 sm:py-20 md:py-28 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-block mb-5 sm:mb-6 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold tracking-wide uppercase", children: "With Ryan Rieder" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight mb-5 sm:mb-6", children: "Ryan Rieder's complete teaching library, built for chiropractors who want to grow." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base sm:text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8 sm:mb-10", children: "Search and watch Ryan Rieder's complete teaching library — unlimited access, built exclusively for chiropractors." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", className: "bg-gold text-gold-foreground hover:bg-gold/90 font-semibold h-12 px-8 w-full sm:w-auto", children: "Sign Up" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", variant: "outline", className: "h-12 px-8 w-full sm:w-auto border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10", children: "Sign In" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-6xl mx-auto px-6 py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-14", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl md:text-4xl font-extrabold text-foreground mb-3", children: "Everything you need to grow your practice" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-2xl mx-auto", children: "One portal. Every lesson, resource, and book Ryan has ever taught — searchable and ready when you are." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border p-6 bg-card hover:border-gold/50 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-gold/15 text-gold p-3 inline-flex mb-4", children: f.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg font-bold text-foreground mb-1", children: f.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: f.desc })
      ] }, f.title)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-muted/40 border-y border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-6 py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Quote, { className: "h-10 w-10 text-gold mx-auto mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl md:text-4xl font-extrabold text-foreground mb-3", children: "Real results from real chiropractors" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-xl mx-auto", children: "Practitioners across the UK and beyond who've grown their practices with Ryan Rieder's teaching." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:grid md:grid-cols-3 gap-6 items-stretch", children: testimonials.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(TestimonialCard, { t }, t.name)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden flex flex-col gap-4", children: [
        testimonials.slice(0, showAllTestimonials ? testimonials.length : 3).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(TestimonialCard, { t }, t.name)),
        !showAllTestimonials && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setShowAllTestimonials(true), className: "mt-2 w-full py-3 rounded-xl border border-border text-sm font-semibold text-foreground hover:border-gold hover:text-gold transition-colors", children: [
          "Show ",
          testimonials.length - 3,
          " more results ↓"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-4xl mx-auto px-6 py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl md:text-4xl font-extrabold text-foreground mb-4", children: "Ready to grow your practice?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-8 max-w-xl mx-auto", children: "Join the chiropractors using DCPG to build stronger, more profitable practices." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", className: "bg-gold text-gold-foreground hover:bg-gold/90 font-semibold h-12 px-8 w-full sm:w-auto", children: "Sign Up" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", variant: "outline", className: "h-12 px-8 w-full sm:w-auto", children: "Sign In" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t border-border bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground text-center sm:text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "© 2026 DCPG. All rights reserved." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex flex-col sm:flex-row items-center gap-2 sm:gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://dcpracticegrowth.com/privacy-cookie-policy/", target: "_blank", rel: "noopener noreferrer", className: "hover:text-gold transition-colors", children: "Privacy & Cookie Policy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://dcpracticegrowth.com/terms-of-service/", target: "_blank", rel: "noopener noreferrer", className: "hover:text-gold transition-colors", children: "Terms of Service" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LandingSearchModal, { open: searchOpen, onOpenChange: setSearchOpen })
  ] });
}
export {
  LandingPage as component
};
