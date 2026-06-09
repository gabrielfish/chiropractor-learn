import { useState } from "react";
import { Link, useRouteContext } from "@tanstack/react-router";
import {
  LogOut,
  FileText,
  Library,
  BarChart3,
  ExternalLink,
  Users,
  UserCheck,
  Bell,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export type AdminSection =
  | "content"
  | "library"
  | "authors"
  | "members"
  | "analytics"
  | "notifications"
  | "settings";

export function AdminSidebar({ active }: { active: AdminSection }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const ctx = useRouteContext({ from: "/_authenticated" }) as { roles?: string[] };
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

  // ── Super-admin nav items ──────────────────────────────────────────────
  type NavItem = { to: string; icon: React.ElementType; label: string; section: AdminSection };
  const superAdminItems: NavItem[] = [
    { to: "/admin",               icon: FileText,  label: "Upload",        section: "content" },
    { to: "/admin/library",       icon: Library,   label: "Library",       section: "library" },
    { to: "/admin/authors",       icon: Users,     label: "Team Members",  section: "authors" },
    { to: "/admin/members",       icon: UserCheck, label: "Members",       section: "members" },
    { to: "/admin/analytics",     icon: BarChart3, label: "Analytics",     section: "analytics" },
    { to: "/admin/notifications", icon: Bell,      label: "Notifications", section: "notifications" },
    { to: "/admin/settings",      icon: Settings,  label: "Settings",      section: "settings" },
  ];

  const authorItems: NavItem[] = [
    { to: "/admin",         icon: FileText, label: "Upload",  section: "content" },
    { to: "/admin/library", icon: Library,  label: "Library", section: "library" },
  ];

  const navItems = isSuperAdmin ? superAdminItems : authorItems;

  // ── Desktop sidebar nav ────────────────────────────────────────────────
  const desktopNav = () => (
    <>
      {navItems.map(({ to, icon: Icon, label, section }) => (
        <Link key={section} to={to} className={`${itemBase} ${active === section ? itemActive : itemIdle}`}>
          <Icon className="h-4 w-4" /> {label}
        </Link>
      ))}
      <div className="pt-3 mt-2 border-t border-sidebar-accent/30" />
      <Link to="/dashboard" className={`${itemBase} ${itemIdle}`}>
        <ExternalLink className="h-4 w-4" /> View as member
      </Link>
    </>
  );

  return (
    <>
      {/* ── Mobile: fixed top bar (out of flex flow) ──────────────────── */}
      <header className="md:hidden fixed top-0 inset-x-0 h-14 z-50 bg-sidebar text-sidebar-foreground border-b border-sidebar-accent/30 flex items-center justify-between px-4">
        <Link to="/" className="flex items-center shrink-0">
          <img src="/dcpg-logo.png" alt="DCPG" style={{ height: 32 }} />
        </Link>
        <span className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wide">
          {isAuthorOnly ? "Author" : "Admin"}
        </span>
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 text-sidebar-foreground/80 hover:text-sidebar-foreground rounded-lg hover:bg-sidebar-accent transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* ── Mobile: backdrop overlay ───────────────────────────────────── */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* ── Mobile: slide-out drawer ───────────────────────────────────── */}
      <div
        className={`md:hidden fixed top-0 bottom-0 left-0 w-72 max-w-[85vw] z-50 bg-sidebar text-sidebar-foreground flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-14 border-b border-sidebar-accent/30 shrink-0">
          <img src="/dcpg-logo.png" alt="DCPG" style={{ height: 32 }} />
          <button
            onClick={closeDrawer}
            className="p-2 text-sidebar-foreground/70 hover:text-sidebar-foreground rounded-lg hover:bg-sidebar-accent transition-colors"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Role label */}
        <div className="px-5 py-3 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-widest border-b border-sidebar-accent/20">
          {isAuthorOnly ? "Author Portal" : "Admin Portal"}
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label, section }) => (
            <Link
              key={section}
              to={to}
              onClick={closeDrawer}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                active === section ? itemActive : itemIdle
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </Link>
          ))}

          <div className="border-t border-sidebar-accent/20 my-2" />

          <Link
            to="/dashboard"
            onClick={closeDrawer}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${itemIdle}`}
          >
            <ExternalLink className="h-5 w-5 shrink-0" />
            View as Member
          </Link>
        </nav>

        {/* Sign out */}
        <div className="px-3 py-4 border-t border-sidebar-accent/30 shrink-0">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            Sign Out
          </button>
        </div>
      </div>

      {/* ── Desktop sidebar ────────────────────────────────────────────── */}
      <aside className="w-60 bg-sidebar text-sidebar-foreground p-5 hidden md:flex flex-col shrink-0">
        <div className="mb-8">
          <Link to="/" className="inline-block mb-2">
            <img src="/dcpg-logo.png" alt="DCPG" style={{ height: 40 }} />
          </Link>
          <div className="text-xs text-sidebar-foreground/60">
            {isAuthorOnly ? "Author Portal" : "Admin Portal"}
          </div>
        </div>

        <nav className="flex-1 space-y-1">{desktopNav()}</nav>

        <button
          onClick={signOut}
          className="flex items-center gap-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground mt-4"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </aside>
    </>
  );
}
