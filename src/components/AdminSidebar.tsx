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

  return (
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
  );
}
