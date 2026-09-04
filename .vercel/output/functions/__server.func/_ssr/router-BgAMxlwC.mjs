import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider, u as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { S as redirect } from "../_libs/tanstack__router-core.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-IF66mSk9.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
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
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const appCss = "/assets/styles-Bw83U-Sp.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-primary", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: error.message }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => {
          router2.invalidate();
          reset();
        },
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
        children: "Try again"
      }
    ) })
  ] }) });
}
const Route$k = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "DCPG Membership Portal — Ryan Rieder's Teaching Library for Chiropractors" },
      { name: "description", content: "Access Ryan Rieder's complete chiropractic practice growth library. Search and watch unlimited video lessons, download proven resources, and grow your practice." },
      // Open Graph
      { property: "og:title", content: "DCPG Membership Portal — Ryan Rieder's Teaching Library for Chiropractors" },
      { property: "og:description", content: "Access Ryan Rieder's complete chiropractic practice growth library. Search and watch unlimited video lessons, download proven resources, and grow your practice." },
      { property: "og:image", content: "https://learn.dcpracticegrowth.com/ryan-rieder.webp" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Ryan Rieder — DCPG Membership Portal" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://learn.dcpracticegrowth.com" },
      { property: "og:site_name", content: "DCPG Membership Portal" },
      // Twitter / X
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "DCPG Membership Portal — Ryan Rieder's Teaching Library for Chiropractors" },
      { name: "twitter:description", content: "Access Ryan Rieder's complete chiropractic practice growth library. Search and watch unlimited video lessons, download proven resources, and grow your practice." },
      { name: "twitter:image", content: "https://learn.dcpracticegrowth.com/ryan-rieder.webp" },
      { name: "twitter:image:alt", content: "Ryan Rieder — DCPG Membership Portal" },
      // Robots
      { name: "robots", content: "index, follow" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: "https://learn.dcpracticegrowth.com" },
      { rel: "icon", href: "/dcpg-logo.png", type: "image/png" },
      { rel: "shortcut icon", href: "/dcpg-logo.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/dcpg-logo.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,100..900&family=Geist:wght@100..900&display=swap" }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { suppressHydrationWarning: true, children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function AuthSync() {
  const router2 = useRouter();
  const queryClient = useQueryClient();
  reactExports.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router2.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => subscription.unsubscribe();
  }, [router2, queryClient]);
  return null;
}
function RootComponent() {
  const { queryClient } = Route$k.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AuthSync, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {})
  ] });
}
const $$splitComponentImporter$j = () => import("./team-signup-BUJxDs1M.mjs");
const Route$j = createFileRoute("/team-signup")({
  ssr: false,
  head: () => ({
    meta: [{
      title: "Team Sign up — DCPG Membership Portal"
    }, {
      name: "description",
      content: "Activate your DCPG team member account with your access code."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./signup-BIkyw209.mjs");
const Route$i = createFileRoute("/signup")({
  ssr: false,
  head: () => ({
    meta: [{
      title: "Sign up - DCPG Membership Portal"
    }, {
      name: "description",
      content: "Activate your DCPG membership and access Ryan Rieder's complete chiropractic teaching library."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./reset-password-DAxsQC-N.mjs");
const Route$h = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [{
      title: "Reset Password — DCPG Membership Portal"
    }, {
      name: "description",
      content: "Set a new password for your DCPG membership account."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./login-DCXilJER.mjs");
const Route$g = createFileRoute("/login")({
  head: () => ({
    meta: [{
      title: "Sign in — DCPG Membership Portal"
    }, {
      name: "description",
      content: "Sign in to access Ryan Rieder's complete chiropractic teaching library."
    }]
  }),
  validateSearch: (search) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : void 0
  }),
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./route-BFsOu0JM.mjs");
const Route$f = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({
    location
  }) => {
    const {
      data,
      error
    } = await supabase.auth.getUser();
    if (error || !data.user) {
      const dest = location.pathname + (location.searchStr ?? "") + (location.hash ?? "");
      throw redirect({
        to: "/login",
        search: {
          redirect: dest
        }
      });
    }
    const {
      data: roles
    } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
    const roleList = (roles ?? []).map((r) => r.role);
    return {
      user: data.user,
      roles: roleList
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./index-CPnrEn7M.mjs");
const Route$e = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "DCPG Membership Portal — Ryan Rieder's Teaching Library for Chiropractors"
      },
      {
        name: "description",
        content: "Access Ryan Rieder's complete chiropractic practice growth library. Search and watch unlimited video lessons, download proven resources, and grow your practice."
      },
      // Open Graph
      {
        property: "og:title",
        content: "DCPG Membership Portal — Ryan Rieder's Teaching Library for Chiropractors"
      },
      {
        property: "og:description",
        content: "Access Ryan Rieder's complete chiropractic practice growth library. Search and watch unlimited video lessons, download proven resources, and grow your practice."
      },
      {
        property: "og:image",
        content: "https://learn.dcpracticegrowth.com/ryan-rieder.webp"
      },
      {
        property: "og:image:width",
        content: "1200"
      },
      {
        property: "og:image:height",
        content: "630"
      },
      {
        property: "og:image:alt",
        content: "Ryan Rieder — DCPG Membership Portal"
      },
      {
        property: "og:type",
        content: "website"
      },
      {
        property: "og:url",
        content: "https://learn.dcpracticegrowth.com"
      },
      {
        property: "og:site_name",
        content: "DCPG Membership Portal"
      },
      // Twitter / X
      {
        name: "twitter:card",
        content: "summary_large_image"
      },
      {
        name: "twitter:title",
        content: "DCPG Membership Portal — Ryan Rieder's Teaching Library for Chiropractors"
      },
      {
        name: "twitter:description",
        content: "Access Ryan Rieder's complete chiropractic practice growth library. Search and watch unlimited video lessons, download proven resources, and grow your practice."
      },
      {
        name: "twitter:image",
        content: "https://learn.dcpracticegrowth.com/ryan-rieder.webp"
      },
      {
        name: "twitter:image:alt",
        content: "Ryan Rieder — DCPG Membership Portal"
      },
      // Canonical & robots
      {
        name: "robots",
        content: "index, follow"
      }
    ],
    links: [{
      rel: "canonical",
      href: "https://learn.dcpracticegrowth.com"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./signup.confirm-D02xX9Oj.mjs");
const searchSchema$1 = objectType({
  email: stringType().optional()
});
const Route$d = createFileRoute("/signup/confirm")({
  validateSearch: searchSchema$1,
  head: () => ({
    meta: [{
      title: "Check your inbox - DCPG Membership Portal"
    }, {
      name: "description",
      content: "Verify your email to activate your DCPG membership."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./certificate._id-CvfYzf9r.mjs");
const Route$c = createFileRoute("/certificate/$id")({
  head: () => ({
    meta: [{
      title: "Certificate of Completion — DCPG Membership Portal"
    }, {
      name: "description",
      content: "Certificate of Completion from Dr Ryan Rieder's DC Practice Growth Membership Portal."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./profile-DZuGWHir.mjs");
const Route$b = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [{
      title: "Profile — DCPG Membership Portal"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./dashboard-FDJB4MUH.mjs");
const searchSchema = objectType({
  q: stringType().optional()
});
const Route$a = createFileRoute("/_authenticated/dashboard")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [{
      title: "Dashboard — DCPG Membership Portal"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./admin-BFsOu0JM.mjs");
const Route$9 = createFileRoute("/_authenticated/admin")({
  beforeLoad: ({
    context
  }) => {
    const roles = context.roles ?? [];
    if (!roles.includes("super_admin") && !roles.includes("author")) {
      throw redirect({
        to: "/dashboard"
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./admin.index-DNin8fFv.mjs");
const Route$8 = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [{
      title: "Upload — DCPG Admin"
    }]
  }),
  validateSearch: (search) => ({
    edit: typeof search.edit === "string" ? search.edit : void 0,
    editCourse: typeof search.editCourse === "string" ? search.editCourse : void 0
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./course._id-BNhTmvCe.mjs");
const Route$7 = createFileRoute("/_authenticated/course/$id")({
  head: () => ({
    meta: [{
      title: "Course — DCPG Membership Portal"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitErrorComponentImporter = () => import("./content._id-CWMgLFYa.mjs");
const $$splitComponentImporter$6 = () => import("./content._id-DameLhN2.mjs");
const Route$6 = createFileRoute("/_authenticated/content/$id")({
  head: () => ({
    meta: [{
      title: "Lesson — DCPG Membership Portal"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent")
});
const $$splitComponentImporter$5 = () => import("./admin.settings-CMnJ55NU.mjs");
const Route$5 = createFileRoute("/_authenticated/admin/settings")({
  head: () => ({
    meta: [{
      title: "Settings — DCPG Admin"
    }]
  }),
  beforeLoad: ({
    context
  }) => {
    const roles = context.roles ?? [];
    if (!roles.includes("super_admin")) throw redirect({
      to: "/dashboard"
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./admin.notifications-BgOqD2eZ.mjs");
const Route$4 = createFileRoute("/_authenticated/admin/notifications")({
  head: () => ({
    meta: [{
      title: "Notifications — DCPG Admin"
    }]
  }),
  beforeLoad: ({
    context
  }) => {
    const roles = context.roles ?? [];
    if (!roles.includes("super_admin")) throw redirect({
      to: "/dashboard"
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./admin.members-DAEn5Ntp.mjs");
const Route$3 = createFileRoute("/_authenticated/admin/members")({
  head: () => ({
    meta: [{
      title: "Members — DCPG Admin"
    }]
  }),
  beforeLoad: ({
    context
  }) => {
    const roles = context.roles ?? [];
    if (!roles.includes("super_admin")) throw redirect({
      to: "/dashboard"
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./admin.library-XfEAtVgR.mjs");
const Route$2 = createFileRoute("/_authenticated/admin/library")({
  head: () => ({
    meta: [{
      title: "Library — DCPG Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./admin.authors-DgUeSzNR.mjs");
const Route$1 = createFileRoute("/_authenticated/admin/authors")({
  head: () => ({
    meta: [{
      title: "Team Members — DCPG Admin"
    }]
  }),
  beforeLoad: ({
    context
  }) => {
    const roles = context.roles ?? [];
    if (!roles.includes("super_admin")) throw redirect({
      to: "/dashboard"
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./admin.analytics-DJbOkYkm.mjs");
const Route = createFileRoute("/_authenticated/admin/analytics")({
  head: () => ({
    meta: [{
      title: "Analytics — DCPG Admin"
    }]
  }),
  beforeLoad: ({
    context
  }) => {
    const roles = context.roles ?? [];
    if (!roles.includes("super_admin")) {
      throw redirect({
        to: "/dashboard"
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const TeamSignupRoute = Route$j.update({
  id: "/team-signup",
  path: "/team-signup",
  getParentRoute: () => Route$k
});
const SignupRoute = Route$i.update({
  id: "/signup",
  path: "/signup",
  getParentRoute: () => Route$k
});
const ResetPasswordRoute = Route$h.update({
  id: "/reset-password",
  path: "/reset-password",
  getParentRoute: () => Route$k
});
const LoginRoute = Route$g.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$k
});
const AuthenticatedRouteRoute = Route$f.update({
  id: "/_authenticated",
  getParentRoute: () => Route$k
});
const IndexRoute = Route$e.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$k
});
const SignupConfirmRoute = Route$d.update({
  id: "/confirm",
  path: "/confirm",
  getParentRoute: () => SignupRoute
});
const CertificateIdRoute = Route$c.update({
  id: "/certificate/$id",
  path: "/certificate/$id",
  getParentRoute: () => Route$k
});
const AuthenticatedProfileRoute = Route$b.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedDashboardRoute = Route$a.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedAdminRoute = Route$9.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedAdminIndexRoute = Route$8.update({
  id: "/",
  path: "/",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedCourseIdRoute = Route$7.update({
  id: "/course/$id",
  path: "/course/$id",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedContentIdRoute = Route$6.update({
  id: "/content/$id",
  path: "/content/$id",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedAdminSettingsRoute = Route$5.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminNotificationsRoute = Route$4.update({
  id: "/notifications",
  path: "/notifications",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminMembersRoute = Route$3.update({
  id: "/members",
  path: "/members",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminLibraryRoute = Route$2.update({
  id: "/library",
  path: "/library",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminAuthorsRoute = Route$1.update({
  id: "/authors",
  path: "/authors",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminAnalyticsRoute = Route.update({
  id: "/analytics",
  path: "/analytics",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminRouteChildren = {
  AuthenticatedAdminAnalyticsRoute,
  AuthenticatedAdminAuthorsRoute,
  AuthenticatedAdminLibraryRoute,
  AuthenticatedAdminMembersRoute,
  AuthenticatedAdminNotificationsRoute,
  AuthenticatedAdminSettingsRoute,
  AuthenticatedAdminIndexRoute
};
const AuthenticatedAdminRouteWithChildren = AuthenticatedAdminRoute._addFileChildren(AuthenticatedAdminRouteChildren);
const AuthenticatedRouteRouteChildren = {
  AuthenticatedAdminRoute: AuthenticatedAdminRouteWithChildren,
  AuthenticatedDashboardRoute,
  AuthenticatedProfileRoute,
  AuthenticatedContentIdRoute,
  AuthenticatedCourseIdRoute
};
const AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
const SignupRouteChildren = {
  SignupConfirmRoute
};
const SignupRouteWithChildren = SignupRoute._addFileChildren(SignupRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
  LoginRoute,
  ResetPasswordRoute,
  SignupRoute: SignupRouteWithChildren,
  TeamSignupRoute,
  CertificateIdRoute
};
const routeTree = Route$k._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$g as R,
  Route$d as a,
  Route$c as b,
  Route$b as c,
  Route$a as d,
  Route$8 as e,
  Route$7 as f,
  Route$6 as g,
  Route$2 as h,
  router as r
};
