import { Link } from "@tanstack/react-router";
import { LogOut, FileText, BarChart3, ExternalLink, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function AdminSidebar({ active }: { active: "content" | "analytics" | "authors" }) {
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
        <div className="font-display font-extrabold text-xl">DCPG Admin</div>
        <div className="text-xs text-sidebar-foreground/60">Membership Portal</div>
      </div>
      <nav className="flex-1 space-y-1">
        <Link to="/admin" className={`${itemBase} ${active === "content" ? itemActive : itemIdle}`}>
          <FileText className="h-4 w-4" /> Content
        </Link>
        <Link to="/admin/authors" className={`${itemBase} ${active === "authors" ? itemActive : itemIdle}`}>
          <Users className="h-4 w-4" /> Team Members
        </Link>
        <Link to="/admin/analytics" className={`${itemBase} ${active === "analytics" ? itemActive : itemIdle}`}>
          <BarChart3 className="h-4 w-4" /> Analytics
        </Link>
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
