import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useRouteContext, L as Link } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-IF66mSk9.mjs";
import { M as Menu, X, F as FileText, H as Library, U as Users, J as UserCheck, N as ChartColumn, O as Bell, R as Settings, g as ExternalLink, r as LogOut } from "../_libs/lucide-react.mjs";
function AdminSidebar({ active }) {
  const [drawerOpen, setDrawerOpen] = reactExports.useState(false);
  const ctx = useRouteContext({ from: "/_authenticated" });
  const roles = ctx.roles ?? [];
  const isSuperAdmin = roles.includes("super_admin");
  const isAuthorOnly = roles.includes("author") && !isSuperAdmin;
  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };
  const closeDrawer = () => setDrawerOpen(false);
  const itemBase = "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors";
  const itemActive = "bg-sidebar-accent text-sidebar-accent-foreground font-medium";
  const itemIdle = "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground";
  const superAdminItems = [
    { to: "/admin", icon: FileText, label: "Upload", section: "content" },
    { to: "/admin/library", icon: Library, label: "Library", section: "library" },
    { to: "/admin/authors", icon: Users, label: "Team Members", section: "authors" },
    { to: "/admin/members", icon: UserCheck, label: "Members", section: "members" },
    { to: "/admin/analytics", icon: ChartColumn, label: "Analytics", section: "analytics" },
    { to: "/admin/notifications", icon: Bell, label: "Notifications", section: "notifications" },
    { to: "/admin/settings", icon: Settings, label: "Settings", section: "settings" }
  ];
  const authorItems = [
    { to: "/admin", icon: FileText, label: "Upload", section: "content" },
    { to: "/admin/library", icon: Library, label: "Library", section: "library" }
  ];
  const navItems = isSuperAdmin ? superAdminItems : authorItems;
  const desktopNav = () => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    navItems.map(({ to, icon: Icon, label, section }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to, className: `${itemBase} ${active === section ? itemActive : itemIdle}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
      " ",
      label
    ] }, section)),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-3 mt-2 border-t border-sidebar-accent/30" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard", className: `${itemBase} ${itemIdle}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-4 w-4" }),
      " View as member"
    ] })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "md:hidden fixed top-0 inset-x-0 h-14 z-50 bg-sidebar text-sidebar-foreground border-b border-sidebar-accent/30 flex items-center justify-between px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "flex items-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/dcpg-logo.png", alt: "DCPG", style: { height: 32 } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wide", children: isAuthorOnly ? "Author" : "Admin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setDrawerOpen(true),
          className: "p-2 text-sidebar-foreground/80 hover:text-sidebar-foreground rounded-lg hover:bg-sidebar-accent transition-colors",
          "aria-label": "Open navigation",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `md:hidden fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`,
        onClick: closeDrawer,
        "aria-hidden": "true"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `md:hidden fixed top-0 bottom-0 left-0 w-72 max-w-[85vw] z-50 bg-sidebar text-sidebar-foreground flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 h-14 border-b border-sidebar-accent/30 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/dcpg-logo.png", alt: "DCPG", style: { height: 32 } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: closeDrawer,
                className: "p-2 text-sidebar-foreground/70 hover:text-sidebar-foreground rounded-lg hover:bg-sidebar-accent transition-colors",
                "aria-label": "Close navigation",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-3 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-widest border-b border-sidebar-accent/20", children: isAuthorOnly ? "Author Portal" : "Admin Portal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex-1 overflow-y-auto py-3 px-3 space-y-1", children: [
            navItems.map(({ to, icon: Icon, label, section }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to,
                onClick: closeDrawer,
                className: `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${active === section ? itemActive : itemIdle}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 shrink-0" }),
                  label
                ]
              },
              section
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-sidebar-accent/20 my-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/dashboard",
                onClick: closeDrawer,
                className: `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${itemIdle}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-5 w-5 shrink-0" }),
                  "View as Member"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-4 border-t border-sidebar-accent/30 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: signOut,
              className: "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-5 w-5 shrink-0" }),
                "Sign Out"
              ]
            }
          ) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "w-60 bg-sidebar text-sidebar-foreground p-5 hidden md:flex flex-col shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "inline-block mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/dcpg-logo.png", alt: "DCPG", style: { height: 40 } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-sidebar-foreground/60", children: isAuthorOnly ? "Author Portal" : "Admin Portal" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 space-y-1", children: desktopNav() }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: signOut,
          className: "flex items-center gap-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground mt-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
            " Sign Out"
          ]
        }
      )
    ] })
  ] });
}
export {
  AdminSidebar as A
};
