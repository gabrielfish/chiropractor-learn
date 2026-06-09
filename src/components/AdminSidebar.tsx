import { Link, useRouteContext } from "@tanstack/react-router";
import { LogOut, FileText, BarChart3, ExternalLink, Users, UserCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function AdminSidebar({ active }: { active: "content" | "analytics" | "authors" | "members" }) {
  const ctx = useRouteContext({ from: "/_authenticated" }) as { roles?: string[] };
  const roles = ctx.roles ?? [];
  const isSuperAdmin = roles.includes("super_admin");

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const itemBase = "flex items-center gap-2 px-3 py-2 rounded-lg text-sm";
  const itemActive = "bg-sidebar-accent text-sidebar-accent-foreground font-medium";
  const itemIdle = "text-sidebar-foreground/70 hover:bg-sidebar-accent";

  const LABELS: Record<typeof active, string> = {
    content: "Content",
    authors: "Team Members",
    analytics: "Analytics",
    members: "Members",
  };

  return (
    <>
      {/* Mobile top bar — shown only on small screens */}
      <header className="md:hidden sticky top-0 z-30 bg-sidebar text-sidebar-foreground border-b border-sidebar-accent/30">
        <div className="flex items-center justify-between px-4 h-14">
          <Link to="/" className="flex items-center shrink-0">
            <img src="/dcpg-logo.png" alt="DCPG" style={{ height: 32 }} />
          </Link>
          <span className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wide">
            Admin · {LABELS[active]}
          </span>
          <button onClick={signOut} className="text-sidebar-foreground/70 hover:text-sidebar-foreground p-1.5" aria-label="Sign out">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        {/* Scrollable nav links row */}
        <nav className="flex overflow-x-auto gap-1 px-3 pb-2 no-scrollbar">
          <Link to="/admin" className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${active === "content" ? itemActive : itemIdle}`}>
            <FileText className="h-3.5 w-3.5" /> Content
          </Link>
          <Link to="/admin/authors" className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${active === "authors" ? itemActive : itemIdle}`}>
            <Users className="h-3.5 w-3.5" /> Team
          </Link>
          {isSuperAdmin && (
            <Link to="/admin/members" className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${active === "members" ? itemActive : itemIdle}`}>
              <UserCheck className="h-3.5 w-3.5" /> Members
            </Link>
          )}
          {isSuperAdmin && (
            <Link to="/admin/analytics" className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${active === "analytics" ? itemActive : itemIdle}`}>
              <BarChart3 className="h-3.5 w-3.5" /> Analytics
            </Link>
          )}
          <Link to="/dashboard" className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${itemIdle}`}>
            <ExternalLink className="h-3.5 w-3.5" /> Member view
          </Link>
        </nav>
      </header>

      {/* Desktop sidebar — hidden on mobile */}
      <aside className="w-60 bg-sidebar text-sidebar-foreground p-5 hidden md:flex flex-col shrink-0">
        <div className="mb-8">
          <Link to="/" className="inline-block mb-2">
            <img src="/dcpg-logo.png" alt="DCPG" style={{ height: 40 }} />
          </Link>
          <div className="text-xs text-sidebar-foreground/60">Admin Portal</div>
        </div>
        <nav className="flex-1 space-y-1">
          <Link to="/admin" className={`${itemBase} ${active === "content" ? itemActive : itemIdle}`}>
            <FileText className="h-4 w-4" /> Content
          </Link>
          <Link to="/admin/authors" className={`${itemBase} ${active === "authors" ? itemActive : itemIdle}`}>
            <Users className="h-4 w-4" /> Team Members
          </Link>
          {isSuperAdmin && (
            <Link to="/admin/members" className={`${itemBase} ${active === "members" ? itemActive : itemIdle}`}>
              <UserCheck className="h-4 w-4" /> Members
            </Link>
          )}
          {isSuperAdmin && (
            <Link to="/admin/analytics" className={`${itemBase} ${active === "analytics" ? itemActive : itemIdle}`}>
              <BarChart3 className="h-4 w-4" /> Analytics
            </Link>
          )}
          <Link to="/dashboard" className={`${itemBase} ${itemIdle} mt-4`}>
            <ExternalLink className="h-4 w-4" /> View as member
          </Link>
        </nav>
        <button onClick={signOut} className="flex items-center gap-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground">
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </aside>
    </>
  );
}
