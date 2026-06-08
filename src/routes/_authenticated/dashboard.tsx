import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { z } from "zod";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MemberNav } from "@/components/MemberNav";
import { ContentCard } from "@/components/ContentCard";
import * as Icons from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const searchSchema = z.object({ q: z.string().optional() });

export const Route = createFileRoute("/_authenticated/dashboard")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Dashboard — DCPG Membership Portal" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { q } = Route.useSearch();
  const query = q?.trim() ?? "";
  const searchInputRef = useRef<HTMLInputElement>(null);

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
      const term = query.replace(/[%,()]/g, " ").trim();
      let categoryIds: string[] = [];
      if (term) {
        const { data: cats } = await supabase
          .from("categories")
          .select("id")
          .ilike("name", `%${term}%`);
        categoryIds = (cats ?? []).map((c) => c.id as string);
      }
      let req = supabase
        .from("content")
        .select("*, category:categories(name,slug), author:profiles(full_name,avatar_url,job_title)")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (term) {
        const orParts = [
          `title.ilike.%${term}%`,
          `description.ilike.%${term}%`,
          `tags.cs.{${term}}`,
        ];
        if (categoryIds.length) {
          orParts.push(`category_id.in.(${categoryIds.join(",")})`);
        }
        req = req.or(orParts.join(","));
      }
      const { data, error } = await req.limit(24);
      if (error) throw error;
      return data;
    },
  });

  const matchedCategory = categoriesQ.data?.find(
    (c) => c.name.toLowerCase() === query.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-background">
      <MemberNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {matchedCategory && (
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/dashboard">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{matchedCategory.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        )}

        <section className={`text-center max-w-3xl mx-auto ${query ? 'mb-6' : 'mb-12'}`}>
          {!query && (
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-foreground mb-6">
              What do you want to learn today?
            </h1>
          )}
          <HeroSearch inputRef={searchInputRef} />
          {!query && (
            <p className="text-muted-foreground mt-4 text-sm">
              Search the library, or browse by category below.
            </p>
          )}
        </section>

        {query && !matchedCategory && (
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
            <CategoryGrid categories={categoriesQ.data} />
          </section>
        )}

        {/* Tools & Resources */}
        {!query && (
          <section className="mb-12">
            <h2 className="font-display text-xl font-bold mb-4">Tools & Resources</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "Website AI Audit Tool",
                  description: "Get a free AI audit of your chiropractic website",
                  button: "Open Tool",
                  href: "https://audit.dcpracticegrowth.com/",
                  icon: Icons.Globe,
                },
                {
                  title: "Workshop AI Builder",
                  description: "Build your next workshop with AI in minutes",
                  button: "Open Tool",
                  href: "https://workshop-builder.dcpracticegrowth.com/",
                  icon: Icons.Sparkles,
                },
                {
                  title: "Book A Call With Ryan",
                  description: "Schedule a 1-on-1 strategy call with Ryan directly",
                  button: "Book Now",
                  href: "https://go.dcpracticegrowth.com/ryans-calendar",
                  icon: Icons.Calendar,
                },
                {
                  title: "Join The Inner Circle",
                  description: "Connect with 300+ chiropractors in Ryan's private Facebook group",
                  button: "Join Now",
                  href: "https://www.facebook.com/groups/ryanriederinnercircle",
                  icon: Icons.Users,
                },
              ].map((tool) => (
                <a
                  key={tool.title}
                  href={tool.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl bg-card border border-border p-5 shadow-card hover:shadow-card-hover hover:border-gold transition-all flex flex-col"
                >
                  <div className="rounded-lg bg-primary/5 text-gold p-2.5 w-fit mb-3 group-hover:bg-gold/10 transition-colors">
                    <tool.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display font-bold text-sm text-foreground leading-tight mb-1">
                    {tool.title}
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed flex-1 mb-4">
                    {tool.description}
                  </p>
                  <span className="inline-flex items-center justify-center rounded-lg bg-gold text-gold-foreground font-semibold text-xs px-4 py-2 hover:bg-gold/90 transition-colors">
                    {tool.button}
                  </span>
                </a>
              ))}
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
            query ? (
              <div className="text-center py-12">
                <button
                  onClick={() => {
                    searchInputRef.current?.focus();
                    searchInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  className="mx-auto mb-6 w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors"
                  aria-label="Focus search bar"
                >
                  <Search className="h-8 w-8 text-gold" />
                </button>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  No results for "{query}"
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-10">
                  Try shorter keywords — for example search "new patient" instead of "how to get new patients"
                </p>
                <div className="text-left">
                  <h4 className="font-display text-lg font-bold text-foreground mb-4">Browse by category instead</h4>
                  <CategoryGrid categories={categoriesQ.data} />
                  <div className="mt-6">
                    <Link
                      to="/dashboard"
                      className="text-sm text-primary hover:text-gold transition-colors inline-flex items-center gap-1"
                    >
                      <span>←</span> Back to dashboard
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 rounded-xl bg-card border border-border">
                <p className="text-muted-foreground">
                  No content published yet. Check back soon.
                </p>
              </div>
            )
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

const SEARCH_PLACEHOLDERS = [
  "Search for marketing strategies...",
  "Find Ryan's Facebook Ads training...",
  "How do I grow my new patient numbers...",
  "Search quarterly meeting training...",
];

function HeroSearch({ inputRef }: { inputRef: React.RefObject<HTMLInputElement | null> }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [phIdx, setPhIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPhIdx((i) => (i + 1) % SEARCH_PLACEHOLDERS.length), 3000);
    return () => clearInterval(t);
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (term) {
      const { data } = await supabase.auth.getUser();
      supabase.from("search_logs").insert({ query: term, user_id: data.user?.id ?? null }).then(() => {});
    }
    navigate({ to: "/dashboard", search: { q } as never });
  };

  return (
    <form onSubmit={onSubmit} className="relative w-full max-w-2xl mx-auto">
      <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={SEARCH_PLACEHOLDERS[phIdx]}
        aria-label="Search library"
        style={{ fontSize: "18px" }}
        className="w-full h-14 pl-14 pr-32 rounded-full border-2 border-border bg-card shadow-card transition-all focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/20 placeholder:text-muted-foreground/70"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-5 rounded-full bg-gold text-gold-foreground font-semibold text-sm hover:bg-gold/90 transition-colors"
      >
        Search
      </button>
    </form>
  );
}


function CategoryGrid({ categories }: { categories: { id: string; name: string; icon?: string | null; slug?: string | null }[] | null | undefined }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {(categories ?? []).map((c) => {
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
  );
}
