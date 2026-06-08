import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MemberNav } from "@/components/MemberNav";
import { ContentCard } from "@/components/ContentCard";
import * as Icons from "lucide-react";

const searchSchema = z.object({ q: z.string().optional() });

export const Route = createFileRoute("/_authenticated/dashboard")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Dashboard — DCPG Membership Portal" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { q } = Route.useSearch();
  const query = q?.trim() ?? "";

  const categoriesQ = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("order");
      if (error) throw error;
      return data;
    },
  });

  const contentQ = useQuery({
    queryKey: ["content", "published", query],
    queryFn: async () => {
      let req = supabase
        .from("content")
        .select("*, category:categories(name,slug), author:profiles(full_name)")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (query) {
        req = req.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
      }
      const { data, error } = await req.limit(24);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <MemberNav initialQuery={query} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {!query && (
          <section className="mb-12 text-center max-w-3xl mx-auto">
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-foreground mb-6">
              What do you want to learn today?
            </h1>
            <HeroSearch />
            <p className="text-muted-foreground mt-4 text-sm">
              Search the library, or browse by category below.
            </p>
          </section>
        )}


        {query && (
          <h2 className="font-display text-2xl font-bold mb-6">
            Results for "{query}"{" "}
            <span className="text-muted-foreground font-normal text-base">
              ({contentQ.data?.length ?? 0})
            </span>
          </h2>
        )}

        {/* Categories */}
        {!query && (
          <section className="mb-12">
            <h2 className="font-display text-xl font-bold mb-4">Browse by category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {(categoriesQ.data ?? []).map((c) => {
                const Icon = ((Icons as unknown as Record<string, typeof Icons.Folder>)[c.icon ?? "Folder"] ?? Icons.Folder);
                return (
                  <Link
                    key={c.id}
                    to="/dashboard"
                    search={{ q: c.name } as never}
                    className="group rounded-xl bg-card border border-border p-4 shadow-card hover:shadow-card-hover hover:border-gold transition-all flex items-center gap-3"
                  >
                    <div className="rounded-lg bg-primary/5 text-primary p-2.5 group-hover:bg-gold/10 group-hover:text-gold transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="font-display font-bold text-sm text-foreground leading-tight">
                      {c.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Content */}
        <section>
          <h2 className="font-display text-xl font-bold mb-4">
            {query ? "Matching lessons" : "Recently added"}
          </h2>
          {contentQ.isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[16/12] rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (contentQ.data ?? []).length === 0 ? (
            <div className="text-center py-16 rounded-xl bg-card border border-border">
              <p className="text-muted-foreground">
                {query ? `No results for "${query}".` : "No content published yet. Check back soon."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(contentQ.data ?? []).map((item) => (
                <ContentCard key={item.id} item={item as never} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
