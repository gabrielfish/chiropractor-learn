import { Link, useRouteContext } from "@tanstack/react-router";
import { LogOut, FileText, BarChart3, ExternalLink, Users, UserCheck, Bell, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export type AdminSection =
  | "content"
  | "authors"
  | "members"
  | "analytics"
  | "notifications"
  | "settings";

export function AdminSidebar({ active }: { active: AdminSection }) {
  const ctx = useRouteContext({ from: "/_authenticated" }) as { roles?: string[] };
  const roles = ctx.roles ?? [];
  const isSuperAdmin = roles.includes("super_admin");
  // Author-only: has author role but NOT super_admin
  const isAuthorOnly = roles.includes("author") && !isSuperAdmin;

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const itemBase = "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors";
  const itemActive = "bg-sidebar-accent text-sidebar-accent-foreground font-medium";
  const itemIdle = "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground";

  // Section labels used in the mobile header
  const LABELS: Record<AdminSection, string> = {
    content: isSuperAdmin ? "Content" : "My Content",
    authors: "Team Members",
    members: "Members",
    analytics: "Analytics",
    notifications: "Notifications",
    settings: "Settings",
  };

  // ── Super-admin nav ───────────────────────────────────────────────────
  const superAdminNav = (mobile = false) => {
    const sz = mobile ? "h-3.5 w-3.5" : "h-4 w-4";
    const base = mobile
      ? "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors"
      : itemBase;
    const act = (s: AdminSection) => `${base} ${active === s ? itemActive : itemIdle}`;

    return (
      <>
        <Link to="/admin" className={act("content")}>
          <FileText className={sz} /> {mobile ? "Content" : "Content"}
        </Link>
        <Link to="/admin/authors" className={act("authors")}>
          <Users className={sz} /> {mobile ? "Team" : "Team Members"}
        </Link>
        <Link to="/admin/members" className={act("members")}>
          <UserCheck className={sz} /> Members
        </Link>
        <Link to="/admin/analytics" className={act("analytics")}>
          <BarChart3 className={sz} /> Analytics
        </Link>
        <Link to="/admin/notifications" className={act("notifications")}>
          <Bell className={sz} /> Notifications
        </Link>
        <Link to="/admin/settings" className={act("settings")}>
          <Settings className={sz} /> Settings
        </Link>
      </>
    );
  };

  // ── Author-only nav ───────────────────────────────────────────────────
  const authorNav = (mobile = false) => {
    const sz = mobile ? "h-3.5 w-3.5" : "h-4 w-4";
    const base = mobile
      ? "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors"
      : itemBase;
    const act = (s: AdminSection) => `${base} ${active === s ? itemActive : itemIdle}`;

    return (
      <>
        <Link to="/admin" className={act("content")}>
          <FileText className={sz} /> My Content
        </Link>
      </>
    );
  };

  return (
    <>
      {/* ── Mobile top bar ───────────────────────────────────────────── */}
      <header className="md:hidden sticky top-0 z-30 bg-sidebar text-sidebar-foreground border-b border-sidebar-accent/30">
        <div className="flex items-center justify-between px-4 h-14">
          <Link to="/" className="flex items-center shrink-0">
            <img src="/dcpg-logo.png" alt="DCPG" style={{ height: 32 }} />
          </Link>
          <span className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wide">
            {isAuthorOnly ? "Author" : "Admin"} · {LABELS[active]}
          </span>
          <button
            onClick={signOut}
            className="text-sidebar-foreground/70 hover:text-sidebar-foreground p-1.5"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex overflow-x-auto gap-1 px-3 pb-2 no-scrollbar">
          {isSuperAdmin ? superAdminNav(true) : authorNav(true)}
          <Link
            to="/dashboard"
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${itemIdle}`}
          >
            <ExternalLink className="h-3.5 w-3.5" /> Member view
          </Link>
        </nav>
      </header>

      {/* ── Desktop sidebar ──────────────────────────────────────────── */}
      <aside className="w-60 bg-sidebar text-sidebar-foreground p-5 hidden md:flex flex-col shrink-0">
        <div className="mb-8">
          <Link to="/" className="inline-block mb-2">
            <img src="/dcpg-logo.png" alt="DCPG" style={{ height: 40 }} />
          </Link>
          <div className="text-xs text-sidebar-foreground/60">
            {isAuthorOnly ? "Author Portal" : "Admin Portal"}
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {isSuperAdmin ? superAdminNav() : authorNav()}

          {/* Divider before cross-links */}
          <div className="pt-3 mt-2 border-t border-sidebar-accent/30" />

          <Link to="/dashboard" className={`${itemBase} ${itemIdle}`}>
            <ExternalLink className="h-4 w-4" /> View as member
          </Link>
        </nav>

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
