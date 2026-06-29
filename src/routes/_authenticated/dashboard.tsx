import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { z } from "zod";
import { Search, Loader2, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getSearchClient, ALGOLIA_INDEX, type AlgoliaHit } from "@/lib/algolia";
import { MemberNav } from "@/components/MemberNav";
import { ContentCard } from "@/components/ContentCard";
import { CourseCard } from "@/components/CourseCard";
import { AlgoliaSearchCard } from "@/components/AlgoliaSearchCard";
import type { CourseCardData } from "@/components/CourseCard";
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
  const [contentFilter, setContentFilter] = useState<'all' | 'lessons' | 'courses'>('all')
  const [visibleLessonCount, setVisibleLessonCount] = useState(9)
  const [visibleCourseCount, setVisibleCourseCount] = useState(9)
  const [visibleAlgoliaCount, setVisibleAlgoliaCount] = useState(20)

  useEffect(() => {
    setVisibleLessonCount(9)
    setVisibleCourseCount(9)
    setVisibleAlgoliaCount(20)
  }, [contentFilter, query])

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
        .select("*, category:categories(name,slug)")
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
      const { data, error } = await req.limit(100);
      if (error) throw error;
      const authorIds = Array.from(new Set((data ?? []).map((d) => d.author_id).filter(Boolean) as string[]));
      let authorsById = new Map<string, { full_name: string | null; avatar_url: string | null; job_title: string | null }>();
      if (authorIds.length) {
        const { data: authors } = await supabase
          .from("author_profiles_public")
          .select("id,full_name,avatar_url,job_title")
          .in("id", authorIds);
        authorsById = new Map((authors ?? []).map((a) => [a.id as string, a]));
      }
      return (data ?? []).map((row) => ({
        ...row,
        author: row.author_id ? authorsById.get(row.author_id as string) ?? null : null,
      }));
    },
  });

  const BOOK_TITLES = [
    "Conversion Alchemy System",
    "New Patient Avalanche System",
    "New Patient Retention System",
    "Practice Growth Speaking Secrets",
  ];

  const booksQ = useQuery({
    queryKey: ["dashboard-books"],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("content")
        .select("id, title, book_url, book_name")
        .eq("status", "published")
        .eq("content_type", "book");
      if (error) throw error;
      // Index by lowercase title for fast lookup
      const byTitle = new Map((data ?? []).map((d: any) => [d.title.toLowerCase().trim(), d]));
      return BOOK_TITLES.map((title) => ({
        title,
        content: byTitle.get(title.toLowerCase()) ?? null,
      }));
    },
  });

  const categoryCountsQ = useQuery({
    queryKey: ["category-content-counts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content")
        .select("category_id")
        .eq("status", "published")
        .not("category_id", "is", null);
      if (error) throw error;
      const counts: Record<string, number> = {};
      for (const row of data ?? []) {
        if (row.category_id) {
          counts[row.category_id] = (counts[row.category_id] ?? 0) + 1;
        }
      }
      return counts;
    },
  });

  const coursesQ = useQuery({
    queryKey: ["published-courses"],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any
      const { data: courses, error } = await db
        .from("courses")
        .select("*, category:categories(name,slug)")
        .eq("status", "published")
        .order("created_at", { ascending: false })
      if (error) throw error
      if (!courses || courses.length === 0) return [] as CourseCardData[]

      const courseIds = (courses as any[]).map((c: any) => c.id as string)

      const [{ data: mods }, { data: lsns }] = await Promise.all([
        db.from("course_modules").select("id,course_id").in("course_id", courseIds),
        db.from("course_lessons").select("id,course_id").in("course_id", courseIds),
      ])

      const { data: { user } } = await supabase.auth.getUser()
      const progressMap = new Map<string,number>()
      if (user) {
        const { data: prog } = await db.from("course_progress")
          .select("course_id").in("course_id", courseIds).eq("user_id", user.id).eq("completed", true)
        for (const p of (prog ?? []) as any[]) progressMap.set(p.course_id as string, (progressMap.get(p.course_id as string) ?? 0) + 1)
      }

      const modMap = new Map<string,number>()
      const lsnMap = new Map<string,number>()
      for (const m of (mods ?? []) as any[]) modMap.set(m.course_id as string, (modMap.get(m.course_id as string)??0)+1)
      for (const l of (lsns ?? []) as any[]) lsnMap.set(l.course_id as string, (lsnMap.get(l.course_id as string)??0)+1)

      const mapped = (courses as any[]).map((c: any) => ({
        id: c.id as string,
        title: c.title as string,
        description: c.description as string|null,
        thumbnail_url: c.thumbnail_url as string|null,
        display_author_name: (c.display_author_name as string|null) ?? 'Dr Ryan Rieder',
        category: c.category as {name:string|null;slug:string|null}|null,
        module_count: modMap.get(c.id as string) ?? 0,
        lesson_count: lsnMap.get(c.id as string) ?? 0,
        completed_count: progressMap.get(c.id as string) ?? 0,
        status: c.status as string,
      } as CourseCardData))
      const seen = new Set<string>()
      return mapped.filter((c: CourseCardData) => { if (seen.has(c.id)) return false; seen.add(c.id); return true; })
    }
  })

  const algoliaQ = useQuery({
    queryKey: ["algolia-search", query],
    enabled: !!query,
    queryFn: async (): Promise<AlgoliaHit[] | null> => {
      const client = getSearchClient();
      if (!client) return null;
      const res = await client.searchSingleIndex({
        indexName: ALGOLIA_INDEX,
        searchParams: { query, hitsPerPage: 50 },
      });
      return (res.hits ?? []) as AlgoliaHit[];
    },
  });

  const matchedCategory = categoriesQ.data?.find(
    (c) => c.name.toLowerCase() === query.toLowerCase()
  );

  // When Algolia returns results, use them. When no query, show everything from Supabase.
  const algoliaHits = algoliaQ.data ?? null;
  const usingAlgolia = !!query && algoliaHits !== null;

  const algoliaContentHits: AlgoliaHit[] = usingAlgolia
    ? algoliaHits.filter((h) => h.type === "content")
    : [];
  const algoliaCourseHits: AlgoliaHit[] = usingAlgolia
    ? algoliaHits.filter((h) => h.type === "course")
    : [];

  const filteredCourses: CourseCardData[] = usingAlgolia
    ? algoliaCourseHits.map((h) => ({
        id: h.id,
        title: h.title,
        description: h.description ?? null,
        thumbnail_url: h.thumbnail_url ?? null,
        display_author_name: h.display_author_name ?? "Dr Ryan Rieder",
        category: h.category_name ? { name: h.category_name, slug: h.category_slug ?? null } : null,
        module_count: 0,
        lesson_count: 0,
        completed_count: 0,
        status: "published",
      }))
    : (coursesQ.data ?? []).filter(c => {
        if (!query) return true
        if (matchedCategory) return c.category?.name?.toLowerCase() === matchedCategory.name.toLowerCase()
        const lq = query.toLowerCase()
        return (c.title?.toLowerCase() ?? '').includes(lq) || (c.description?.toLowerCase() ?? '').includes(lq)
      })

  return (
    <div className="min-h-screen bg-background">
      <MemberNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 flex gap-8">
        {/* Left filter panel — desktop only */}
        <aside className="hidden lg:block w-48 shrink-0">
          <div className="sticky top-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Filter</p>
            <nav className="space-y-1">
              {([
                { key: 'all', label: 'All Content' },
                { key: 'lessons', label: 'Single Lessons' },
                { key: 'courses', label: 'Courses' },
              ] as const).map(({ key, label }) => (
                <button key={key} type="button" onClick={() => setContentFilter(key)}
                  className={"w-full text-left px-3 py-2 rounded-lg text-sm transition-colors " + (contentFilter === key ? "bg-gold/10 text-gold font-semibold" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </aside>
        <main className="flex-1 min-w-0">
        {/* Mobile filter pills */}
        <div className="lg:hidden flex gap-2 mb-6 overflow-x-auto pb-1 -mx-1 px-1">
          {([
            { key: 'all', label: 'All Content' },
            { key: 'lessons', label: 'Lessons' },
            { key: 'courses', label: 'Courses' },
          ] as const).map(({ key, label }) => (
            <button key={key} type="button" onClick={() => setContentFilter(key)}
              className={"shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors " + (contentFilter === key ? "bg-gold text-gold-foreground border-gold" : "border-border text-muted-foreground hover:border-gold/40 hover:text-foreground")}>
              {label}
            </button>
          ))}
        </div>
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
          <HeroSearch inputRef={searchInputRef} isSearching={contentQ.isLoading && !!query} />
          {!query && (
            <p className="text-muted-foreground mt-4 text-sm">
              Search the library, or browse by category below.
            </p>
          )}
        </section>

        {query && !matchedCategory && (
          <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
            Results for "{query}"
            {algoliaQ.isLoading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
            {!algoliaQ.isLoading && (
              <span className="text-muted-foreground font-normal text-base">
                ({usingAlgolia
                  ? algoliaHits!.length
                  : (contentQ.data?.length ?? 0) + filteredCourses.length})
              </span>
            )}
          </h2>
        )}

        {/* Categories */}
        {!query && contentFilter !== 'courses' && (
          <section className="mb-12">
            <h2 className="font-display text-xl font-bold mb-4">Browse by category</h2>
            {categoriesQ.isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-[60px] rounded-xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : (
              <CategoryGrid categories={categoriesQ.data} categoryCounts={categoryCountsQ.data} />
            )}
          </section>
        )}

        {/* Tools & Resources */}
        {!query && contentFilter !== 'courses' && (
          <section className="mb-12">
            <h2 className="font-display text-xl font-bold mb-4">Tools & Resources</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* Ryan's Books */}
        {!query && contentFilter !== 'courses' && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold">Ryan's Books</h2>
            </div>
            {booksQ.isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-[140px] rounded-xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : null}
            {!booksQ.isLoading && <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Conversion Alchemy System",
                  desc: "Step-by-step what to say to patients so they pay without friction or hard sales tactics.",
                  cover: "/ca.webp",
                },
                {
                  title: "New Patient Avalanche System",
                  desc: "How to grow a seven figure chiropractic practice from six figures or less.",
                  cover: "/npa.webp",
                },
                {
                  title: "New Patient Retention System",
                  desc: "Your system to attract, retain and grow a loyal patient base that stays for life.",
                  cover: "/prs.png",
                },
                {
                  title: "Practice Growth Speaking Secrets",
                  desc: "How Ryan used live events and workshops to generate consistent high quality new patients.",
                  cover: "/ss.webp",
                },
              ].map((book) => {
                const match = booksQ.data?.find((b) => b.title === book.title);
                const content = match?.content as any;
                const contentId = content?.id ?? null;
                const bookUrl = content?.book_url ?? null;
                return (
                  <div
                    key={book.title}
                    className="group relative rounded-xl bg-primary border border-primary/80 overflow-hidden hover:border-gold/60 transition-all shadow-card flex"
                  >
                    {/* Book cover image */}
                    <div className="w-28 sm:w-32 shrink-0 relative overflow-hidden">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0 p-4 flex flex-col justify-between">
                      <div>
                        <div className="font-display font-extrabold text-primary-foreground text-sm leading-tight mb-1">
                          {book.title}
                        </div>
                        <p className="text-xs text-primary-foreground/70 leading-relaxed">
                          {book.desc}
                        </p>
                      </div>
                      <div className="mt-3">
                        {bookUrl ? (
                          <a
                            href={bookUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg bg-gold text-gold-foreground font-semibold text-xs px-3 py-1.5 hover:bg-gold/90 transition-colors"
                          >
                            <Icons.Download className="h-3.5 w-3.5" />
                            Download Free Book
                          </a>
                        ) : contentId ? (
                          <Link to="/content/$id" params={{ id: contentId }}>
                            <span className="inline-flex items-center gap-2 rounded-lg bg-gold text-gold-foreground font-semibold text-xs px-3 py-1.5 hover:bg-gold/90 transition-colors">
                              <Icons.Download className="h-3.5 w-3.5" />
                              Download Free Book
                            </span>
                          </Link>
                        ) : (
                          <span className="inline-flex items-center gap-2 rounded-lg bg-gold/30 text-gold-foreground/50 font-semibold text-xs px-3 py-1.5 cursor-not-allowed">
                            <Icons.Download className="h-3.5 w-3.5" />
                            Coming Soon
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>}
          </section>
        )}

        {/* ── Algolia unified results grid (when search is active + Algolia configured) ── */}
        {usingAlgolia && (
          <section className="mb-10">
            {algoliaQ.isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-[16/12] rounded-xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : algoliaHits!.length === 0 ? (
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
                  Try different keywords — for example "new patient" instead of "how do I get more new patients"
                </p>
                <div className="text-left">
                  <h4 className="font-display text-lg font-bold text-foreground mb-4">Browse by category instead</h4>
                  <CategoryGrid categories={categoriesQ.data} categoryCounts={categoryCountsQ.data} />
                  <div className="mt-6">
                    <Link to="/dashboard" className="text-sm text-primary hover:text-gold transition-colors inline-flex items-center gap-1">
                      <span>←</span> Back to dashboard
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {algoliaHits!.slice(0, visibleAlgoliaCount).map((hit) => (
                    <AlgoliaSearchCard key={hit.objectID} hit={hit} />
                  ))}
                </div>
                {visibleAlgoliaCount < algoliaHits!.length && (
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={() => setVisibleAlgoliaCount(n => n + 20)}
                      className="px-6 py-2.5 rounded-full border-2 border-border hover:border-gold text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Load More ({algoliaHits!.length - visibleAlgoliaCount} remaining)
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {/* ── Courses (Supabase browse / fallback only — hidden when Algolia active) ── */}
        {!usingAlgolia && contentFilter !== 'lessons' && filteredCourses.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <GraduationCap className="h-5 w-5 text-gold" />
              <h2 className="font-display text-xl font-bold">Courses</h2>
              <span className="text-sm text-muted-foreground">({filteredCourses.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCourses.slice(0, visibleCourseCount).map(course => <CourseCard key={course.id} item={course} />)}
            </div>
            {visibleCourseCount < filteredCourses.length && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setVisibleCourseCount(n => n + 9)}
                  className="px-6 py-2.5 rounded-full border-2 border-border hover:border-gold text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Load More ({filteredCourses.length - visibleCourseCount} remaining)
                </button>
              </div>
            )}
          </section>
        )}

        {/* Content (Supabase browse / fallback — hidden when Algolia active) */}
        {!usingAlgolia && contentFilter !== 'courses' && (
          <section>
            <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
              {query ? "Matching lessons" : "Recently added"}
              {(contentQ.isLoading || algoliaQ.isLoading) && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </h2>
            {(usingAlgolia ? algoliaQ.isLoading : contentQ.isLoading) ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="aspect-[16/12] rounded-xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : (usingAlgolia ? algoliaContentHits : (contentQ.data ?? [])).length === 0 ? (
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
                    <CategoryGrid categories={categoriesQ.data} categoryCounts={categoryCountsQ.data} />
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
                  <p className="text-muted-foreground">No content published yet. Check back soon.</p>
                </div>
              )
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {(usingAlgolia
                    ? algoliaContentHits.map((h) => ({
                        id: h.id,
                        title: h.title,
                        description: h.description ?? null,
                        thumbnail_url: h.thumbnail_url ?? null,
                        video_url: h.video_url ?? null,
                        pdf_url: h.pdf_url ?? null,
                        book_url: h.book_url ?? null,
                        content_type: h.content_type ?? null,
                        display_author_name: h.display_author_name ?? null,
                        category: h.category_name ? { name: h.category_name, slug: h.category_slug ?? null } : null,
                      }))
                    : (contentQ.data ?? [])
                  ).slice(0, visibleLessonCount).map((item) => (
                    <ContentCard key={item.id} item={item as never} />
                  ))}
                </div>
                {(() => {
                  const total = usingAlgolia ? algoliaContentHits.length : (contentQ.data ?? []).length;
                  return visibleLessonCount < total ? (
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() => setVisibleLessonCount(n => n + 9)}
                        className="px-6 py-2.5 rounded-full border-2 border-border hover:border-gold text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Load More ({total - visibleLessonCount} remaining)
                      </button>
                    </div>
                  ) : null;
                })()}
              </>
            )}
          </section>
        )}
        </main>
      </div>
    </div>
  );
}

const SEARCH_PLACEHOLDERS = [
  "Search for marketing strategies...",
  "Find Ryan's Facebook Ads training...",
  "How do I grow my new patient numbers...",
  "Search quarterly meeting training...",
];

function HeroSearch({
  inputRef,
  isSearching = false,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  isSearching?: boolean;
}) {
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
      if (data.user?.id) {
        supabase.from("search_logs").insert({ query: term, user_id: data.user.id }).then(() => {});
      }
    }
    navigate({ to: "/dashboard", search: { q } as never });
  };

  return (
    <form onSubmit={onSubmit} className="relative w-full max-w-2xl mx-auto">
      {isSearching ? (
        <Loader2 className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gold animate-spin pointer-events-none" />
      ) : (
        <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
      )}
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={SEARCH_PLACEHOLDERS[phIdx]}
        aria-label="Search library"
        style={{ fontSize: "16px" }}
        className="w-full h-14 pl-12 sm:pl-14 pr-24 sm:pr-32 rounded-full border-2 border-border bg-card shadow-card transition-all focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/20 placeholder:text-muted-foreground/70"
      />
      <button
        type="submit"
        disabled={isSearching}
        className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-3 sm:px-5 rounded-full bg-gold text-gold-foreground font-semibold text-sm hover:bg-gold/90 transition-colors whitespace-nowrap disabled:opacity-70 inline-flex items-center gap-1.5"
      >
        {isSearching && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        {isSearching ? "Searching…" : "Search"}
      </button>
    </form>
  );
}


function CategoryGrid({
  categories,
  categoryCounts,
}: {
  categories: { id: string; name: string; icon?: string | null; slug?: string | null }[] | null | undefined;
  categoryCounts?: Record<string, number>;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {(categories ?? []).map((c) => {
        const Icon = ((Icons as unknown as Record<string, typeof Icons.Folder>)[c.icon ?? "Folder"] ?? Icons.Folder);
        const count = categoryCounts?.[c.id] ?? 0;
        return (
          <Link
            key={c.id}
            to="/dashboard"
            search={{ q: c.name } as never}
            className="group relative rounded-xl bg-card border border-border p-4 shadow-card hover:shadow-card-hover hover:border-gold transition-all flex items-center gap-3"
          >
            {count > 0 && (
              <span className="absolute top-2.5 right-2.5 min-w-[1.25rem] h-5 px-1.5 rounded-full bg-gold text-gold-foreground text-[10px] font-bold flex items-center justify-center leading-none">
                {count}
              </span>
            )}
            <div className="rounded-lg bg-primary/5 text-primary p-2.5 group-hover:bg-gold/10 group-hover:text-gold transition-colors">
              <Icon className="h-5 w-5" />
            </div>
            <div className="font-display font-bold text-sm text-foreground leading-tight pr-5">
              {c.name}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
