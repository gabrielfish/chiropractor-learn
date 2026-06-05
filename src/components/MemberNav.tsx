import { Link, useNavigate } from "@tanstack/react-router";
import { Search, LogOut, User, ChevronDown } from "lucide-react";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function MemberNav({ initialQuery = "" }: { initialQuery?: string }) {
  const navigate = useNavigate();
  const [q, setQ] = useState(initialQuery);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate({ to: "/dashboard", search: { q } as never });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  };

  return (
    <header className="sticky top-0 z-30 bg-background/90 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        <Link to="/dashboard" className="flex items-baseline gap-1.5 shrink-0">
          <span className="font-display font-extrabold text-primary text-xl">DCPG</span>
          <span className="hidden sm:inline font-display font-bold text-gold text-xs uppercase tracking-wider">Portal</span>
        </Link>

        <form onSubmit={onSearch} className="flex-1 max-w-xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="What do you want to learn today?"
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
          />
        </form>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 shrink-0">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">U</AvatarFallback>
              </Avatar>
              <ChevronDown className="h-4 w-4 hidden sm:inline" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem><User className="h-4 w-4 mr-2" />Profile</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}><LogOut className="h-4 w-4 mr-2" />Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
