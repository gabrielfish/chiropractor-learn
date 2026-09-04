import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Library,
  Pencil,
  Archive,
  Trash2,
  RotateCcw,
  Search,
  Loader2,
  GraduationCap,
  BookCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { PublishNotificationModal } from "@/components/PublishNotificationModal";
import {
  listAdminCourses,
  deleteCourse as deleteCourseServerFn,
  publishAllDraftCourses,
} from "@/lib/courses.functions";
import { useServerFn } from "@tanstack/react-start";

const LESSONS_PER_PAGE = 20;
const COURSES_PER_PAGE = 10;

export const Route = createFileRoute("/_authenticated/admin/library")({
  head: () => ({ meta: [{ title: "Library — DCPG Admin" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    tab: (search.tab as string) === "courses" ? ("courses" as const) : ("lessons" as const),
    page: Number(search.page) > 0 ? Number(search.page) : 1,
  }),
  component: LibraryPage,
});

type ContentStatus = "draft" | "published" | "archived";

function LibraryPage() {
  const qc = useQueryClient();
  const { user, roles } = Route.useRouteContext() as { user: { id: string }; roles: string[] };
  const isAuthorOnly = roles.includes("author") && !roles.includes("super_admin");
  const isSuperAdmin = roles.includes("super_admin");

  const { tab, page } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const setTab = (t: "lessons" | "courses") =>
    navigate({ search: () => ({ tab: t, page: 1 }), replace: true });
  const setPage = (p: number) =>
    navigate({ search: (prev) => ({ ...prev, page: p }), replace: true });

  // Per-tab filter state (resets when you change status but kept per-tab with separate vars)
  const [lessonStatusFilter, setLessonStatusFilter] = useState<"all" | ContentStatus>("all");
  const [courseStatusFilter, setCourseStatusFilter] = useState<"all" | ContentStatus>("all");
  const [search, setSearch] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [publishAllOpen, setPublishAllOpen] = useState(false);
  const [publishAllCoursesOpen, setPublishAllCoursesOpen] = useState(false);
  const [deleteCourseTarget, setDeleteCourseTarget] = useState<{ id: string; title: string } | null>(null);
  // Shown after a single lesson is manually published so admin can notify members
  const [notifyLesson, setNotifyLesson] = useState<{ id: string; title: string } | null>(null);

  const listCoursesFn = useServerFn(listAdminCourses);
  const deleteCourseServer = useServerFn(deleteCourseServerFn);
  const publishAllCoursesFn = useServerFn(publishAllDraftCourses);

  // ── Data queries ──────────────────────────────────────────────────────────
  const contentQ = useQuery({
    queryKey: ["admin", "content", isAuthorOnly ? user.id : "all"],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let q = (supabase as any)
        .from("content")
        .select("*, category:categories(name)")
        .order("created_at", { ascending: false });
      if (isAuthorOnly) q = q.eq("author_id", user.id);
      const { data, error } = await q;
      if (error) throw error;
      return data as any[];
    },
  });

  const coursesQ = useQuery({
    queryKey: ["admin", "courses"],
    queryFn: () => listCoursesFn(),
  });

  // ── Lesson counts + filter ─────────────────────────────────────────────────
  const lessonCounts = useMemo(() => {
    const rows = contentQ.data ?? [];
    return {
      all: rows.length,
      published: rows.filter((r) => r.status === "published").length,
      draft: rows.filter((r) => r.status === "draft").length,
      archived: rows.filter((r) => r.status === "archived").length,
    };
  }, [contentQ.data]);

  const filteredLessons = useMemo(() => {
    let rows = contentQ.data ?? [];
    if (lessonStatusFilter !== "all") rows = rows.filter((r) => r.status === lessonStatusFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter((r) => r.title.toLowerCase().includes(q));
    }
    return rows;
  }, [contentQ.data, lessonStatusFilter, search]);

  const lessonTotalPages = Math.max(1, Math.ceil(filteredLessons.length / LESSONS_PER_PAGE));
  const lessonPage = Math.min(page, lessonTotalPages);
  const lessonPageRows = filteredLessons.slice(
    (lessonPage - 1) * LESSONS_PER_PAGE,
    lessonPage * LESSONS_PER_PAGE
  );
  const lessonStart = filteredLessons.length === 0 ? 0 : (lessonPage - 1) * LESSONS_PER_PAGE + 1;
  const lessonEnd = Math.min(lessonPage * LESSONS_PER_PAGE, filteredLessons.length);

  // ── Course counts + filter ─────────────────────────────────────────────────
  const allCourses = (coursesQ.data?.courses ?? []) as {
    id: string; title: string; status: string; category_name: string | null;
    module_count: number; lesson_count: number; created_at: string;
  }[];

  const courseCounts = useMemo(() => ({
    all: allCourses.length,
    published: allCourses.filter((c) => c.status === "published").length,
    draft: allCourses.filter((c) => c.status === "draft").length,
    archived: allCourses.filter((c) => c.status === "archived").length,
  }), [allCourses]);

  const filteredCourses = useMemo(() => {
    let rows = allCourses;
    if (courseStatusFilter !== "all") rows = rows.filter((c) => c.status === courseStatusFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter((c) => c.title.toLowerCase().includes(q));
    }
    return rows;
  }, [allCourses, courseStatusFilter, search]);

  const courseTotalPages = Math.max(1, Math.ceil(filteredCourses.length / COURSES_PER_PAGE));
  const coursePage = Math.min(page, courseTotalPages);
  const coursePageRows = filteredCourses.slice(
    (coursePage - 1) * COURSES_PER_PAGE,
    coursePage * COURSES_PER_PAGE
  );
  const courseStart = filteredCourses.length === 0 ? 0 : (coursePage - 1) * COURSES_PER_PAGE + 1;
  const courseEnd = Math.min(coursePage * COURSES_PER_PAGE, filteredCourses.length);

  // ── Mutations ──────────────────────────────────────────────────────────────
  const setStatus = useMutation({
    mutationFn: async ({ id, status, title }: { id: string; status: ContentStatus; title: string }) => {
      const patch = status === "published"
        ? { status, published_at: new Date().toISOString() }
        : { status };
      const { error } = await supabase.from("content").update(patch).eq("id", id);
      if (error) throw error;
      return { id, status, title };
    },
    onSuccess: (result) => {
      if (result.status === "published") {
        // Show notification modal so admin can choose to email members
        setNotifyLesson({ id: result.id, title: result.title });
      } else {
        toast.success("Content archived");
      }
      qc.invalidateQueries({ queryKey: ["admin", "content"] });
      qc.invalidateQueries({ queryKey: ["content"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("content").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Content deleted");
      setDeleteTarget(null);
      qc.invalidateQueries({ queryKey: ["admin", "content"] });
      qc.invalidateQueries({ queryKey: ["content"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const publishAll = useMutation({
    mutationFn: async () => {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from("content")
        .update({ status: "published", published_at: now })
        .eq("status", "draft");
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(`${lessonCounts.draft} draft${lessonCounts.draft !== 1 ? "s" : ""} published`);
      setPublishAllOpen(false);
      qc.invalidateQueries({ queryKey: ["admin", "content"] });
      qc.invalidateQueries({ queryKey: ["content"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const publishAllCoursesMut = useMutation({
    mutationFn: () => publishAllCoursesFn({ data: undefined }),
    onSuccess: (result) => {
      const r = result as { published: number };
      toast.success(`${r.published} draft course${r.published !== 1 ? "s" : ""} published`);
      setPublishAllCoursesOpen(false);
      qc.invalidateQueries({ queryKey: ["admin", "courses"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delCourseMut = useMutation({
    mutationFn: (id: string) => deleteCourseServer({ data: { id } }),
    onSuccess: () => {
      toast.success("Course deleted");
      setDeleteCourseTarget(null);
      qc.invalidateQueries({ queryKey: ["admin", "courses"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // ── Shared toolbar helpers ─────────────────────────────────────────────────
  const statusFilter = tab === "lessons" ? lessonStatusFilter : courseStatusFilter;
  const setStatusFilter = (v: "all" | ContentStatus) => {
    setPage(1);
    if (tab === "lessons") setLessonStatusFilter(v);
    else setCourseStatusFilter(v);
  };

  const activeCounts = tab === "lessons" ? lessonCounts : courseCounts;
  const filterTabs: { key: "all" | ContentStatus; label: string; count: number }[] = [
    { key: "all",       label: "All",       count: activeCounts.all },
    { key: "published", label: "Published", count: activeCounts.published },
    { key: "draft",     label: "Draft",     count: activeCounts.draft },
    { key: "archived",  label: "Archived",  count: activeCounts.archived },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <AdminSidebar active="library" />

      <main className="flex-1 pt-14 px-4 pb-4 sm:px-6 sm:pb-6 md:p-10 overflow-x-hidden min-w-0">
        <div className="max-w-6xl mx-auto">
          {/* Page header */}
          <div className="flex items-center gap-2 mb-1">
            <Library className="h-7 w-7 text-gold" />
            <h1 className="font-display text-3xl font-extrabold">
              {isAuthorOnly ? "My Library" : "Content Library"}
            </h1>
          </div>
          <p className="text-muted-foreground mb-6">
            {isAuthorOnly
              ? "All your uploaded lessons. Click Edit to make changes."
              : "All lessons and courses. Search, filter, edit, archive or delete content."}
          </p>

          {/* Top-level tab switcher */}
          <div className="inline-flex flex-wrap rounded-lg border border-border bg-muted p-1 mb-6 max-w-full">
            <button
              type="button"
              onClick={() => setTab("lessons")}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md font-medium transition-colors ${
                tab === "lessons"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Library className="h-4 w-4" />
              Lessons
              <span className="opacity-60 text-xs">({contentQ.data?.length ?? "…"})</span>
            </button>
            <button
              type="button"
              onClick={() => setTab("courses")}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md font-medium transition-colors ${
                tab === "courses"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              Courses
              <span className="opacity-60 text-xs">({allCourses.length})</span>
            </button>
          </div>

          {/* Shared toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5 flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder={tab === "lessons" ? "Search lessons by title…" : "Search courses by title…"}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9"
              />
            </div>

            {/* Publish All Drafts — lessons tab only */}
            {tab === "lessons" && isSuperAdmin && lessonCounts.draft > 0 && (
              <Button
                type="button"
                onClick={() => setPublishAllOpen(true)}
                className="bg-success hover:bg-success/90 text-success-foreground inline-flex items-center gap-2 shrink-0"
              >
                <BookCheck className="h-4 w-4" />
                Publish all drafts ({lessonCounts.draft})
              </Button>
            )}

            {/* Publish All Draft Courses — courses tab only */}
            {tab === "courses" && isSuperAdmin && courseCounts.draft > 0 && (
              <Button
                type="button"
                onClick={() => setPublishAllCoursesOpen(true)}
                className="bg-success hover:bg-success/90 text-success-foreground inline-flex items-center gap-2 shrink-0"
              >
                <BookCheck className="h-4 w-4" />
                Publish all draft courses ({courseCounts.draft})
              </Button>
            )}

            <div className="inline-flex rounded-md border border-border bg-muted p-1 overflow-x-auto max-w-full shrink-0">
              {filterTabs.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setStatusFilter(t.key)}
                  className={`px-3 py-1.5 text-xs rounded font-medium transition-colors whitespace-nowrap ${
                    statusFilter === t.key
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label} <span className="opacity-60">({t.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── LESSONS TAB ──────────────────────────────────────────────── */}
          {tab === "lessons" && (
            <>
              {contentQ.isLoading && (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />
                  ))}
                </div>
              )}

              {!contentQ.isLoading && (
                <>
                  <div className="rounded-xl bg-card border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm min-w-[600px]">
                        <thead className="bg-muted">
                          <tr className="text-left">
                            <th className="px-4 py-3 font-medium">Title</th>
                            <th className="px-4 py-3 font-medium">Category</th>
                            <th className="px-4 py-3 font-medium">Type</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Date</th>
                            <th className="px-4 py-3 font-medium text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lessonPageRows.map((c) => {
                            const statusClass =
                              c.status === "published"
                                ? "bg-success/15 text-success"
                                : c.status === "archived"
                                  ? "bg-gold/15 text-gold"
                                  : "bg-muted text-muted-foreground";
                            return (
                              <tr key={c.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-3 font-medium max-w-[220px]">
                                  <span className="block truncate" title={c.title}>{c.title}</span>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">{c.category?.name ?? "—"}</td>
                                <td className="px-4 py-3">
                                  {c.content_type ? (
                                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                                      c.content_type === "book"
                                        ? "bg-gold/15 text-gold"
                                        : c.content_type === "pdf"
                                          ? "bg-blue-500/15 text-blue-500"
                                          : "bg-primary/10 text-primary"
                                    }`}>
                                      {c.content_type}
                                    </span>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">—</span>
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusClass}`}>
                                    {c.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                                  {new Date(c.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center justify-end gap-1">
                                    <Button
                                      type="button" variant="ghost" size="sm"
                                      onClick={() => { window.location.href = "/admin?edit=" + c.id; }}
                                      aria-label="Edit" title="Edit"
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>

                                    {c.status === "archived" ? (
                                      <Button
                                        type="button" variant="ghost" size="sm"
                                        onClick={() => setStatus.mutate({ id: c.id, status: "published", title: c.title })}
                                        disabled={setStatus.isPending}
                                        aria-label="Restore" title="Restore to published"
                                      >
                                        {setStatus.isPending
                                          ? <Loader2 className="h-4 w-4 animate-spin" />
                                          : <RotateCcw className="h-4 w-4" />}
                                      </Button>
                                    ) : (
                                      <Button
                                        type="button" variant="ghost" size="sm"
                                        onClick={() => setStatus.mutate({ id: c.id, status: "archived", title: c.title })}
                                        disabled={setStatus.isPending}
                                        aria-label="Archive" title="Archive"
                                      >
                                        {setStatus.isPending
                                          ? <Loader2 className="h-4 w-4 animate-spin" />
                                          : <Archive className="h-4 w-4" />}
                                      </Button>
                                    )}

                                    {isSuperAdmin && (
                                      <Button
                                        type="button" variant="ghost" size="sm"
                                        onClick={() => setDeleteTarget({ id: c.id, title: c.title })}
                                        aria-label="Delete"
                                        className="text-destructive hover:text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                          {lessonPageRows.length === 0 && (
                            <tr>
                              <td colSpan={6} className="px-4 py-14 text-center text-muted-foreground">
                                {search.trim() ? `No results for "${search}"` : "No lessons in this view."}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Lessons pagination */}
                  {filteredLessons.length > 0 && (
                    <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                      <span>Showing {lessonStart}–{lessonEnd} of {filteredLessons.length} lesson{filteredLessons.length !== 1 ? "s" : ""}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button" variant="outline" size="sm"
                          onClick={() => setPage(lessonPage - 1)}
                          disabled={lessonPage <= 1}
                          className="gap-1"
                        >
                          <ChevronLeft className="h-4 w-4" /> Previous
                        </Button>
                        <span className="px-2">Page {lessonPage} of {lessonTotalPages}</span>
                        <Button
                          type="button" variant="outline" size="sm"
                          onClick={() => setPage(lessonPage + 1)}
                          disabled={lessonPage >= lessonTotalPages}
                          className="gap-1"
                        >
                          Next <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* ── COURSES TAB ──────────────────────────────────────────────── */}
          {tab === "courses" && (
            <>
              {coursesQ.isLoading && (
                <div className="space-y-2">
                  {[1, 2].map((i) => <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />)}
                </div>
              )}

              {!coursesQ.isLoading && (
                <>
                  <div className="rounded-xl bg-card border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm min-w-[500px]">
                        <thead className="bg-muted">
                          <tr className="text-left">
                            <th className="px-4 py-3 font-medium">Title</th>
                            <th className="px-4 py-3 font-medium">Category</th>
                            <th className="px-4 py-3 font-medium">Structure</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Date</th>
                            <th className="px-4 py-3 font-medium text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {coursePageRows.map((c) => {
                            const statusClass =
                              c.status === "published"
                                ? "bg-success/15 text-success"
                                : c.status === "archived"
                                  ? "bg-gold/15 text-gold"
                                  : "bg-muted text-muted-foreground";
                            return (
                              <tr key={c.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-3 font-medium max-w-[200px]">
                                  <span className="block truncate" title={c.title}>{c.title}</span>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">{c.category_name ?? "—"}</td>
                                <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                                  {c.module_count} module{c.module_count !== 1 ? "s" : ""} • {c.lesson_count} lesson{c.lesson_count !== 1 ? "s" : ""}
                                </td>
                                <td className="px-4 py-3">
                                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusClass}`}>
                                    {c.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                                  {new Date(c.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center justify-end gap-1">
                                    <Button
                                      type="button" variant="ghost" size="sm"
                                      onClick={() => { window.location.href = "/admin?editCourse=" + c.id; }}
                                      aria-label="Edit"
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    {isSuperAdmin && (
                                      <Button
                                        type="button" variant="ghost" size="sm"
                                        onClick={() => setDeleteCourseTarget({ id: c.id, title: c.title })}
                                        className="text-destructive hover:text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                          {coursePageRows.length === 0 && (
                            <tr>
                              <td colSpan={6} className="px-4 py-14 text-center text-muted-foreground">
                                {search.trim() ? `No results for "${search}"` : "No courses in this view."}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Courses pagination */}
                  {filteredCourses.length > 0 && (
                    <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                      <span>Showing {courseStart}–{courseEnd} of {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button" variant="outline" size="sm"
                          onClick={() => setPage(coursePage - 1)}
                          disabled={coursePage <= 1}
                          className="gap-1"
                        >
                          <ChevronLeft className="h-4 w-4" /> Previous
                        </Button>
                        <span className="px-2">Page {coursePage} of {courseTotalPages}</span>
                        <Button
                          type="button" variant="outline" size="sm"
                          onClick={() => setPage(coursePage + 1)}
                          disabled={coursePage >= courseTotalPages}
                          className="gap-1"
                        >
                          Next <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>

      {/* Publish all drafts confirmation */}
      <AlertDialog open={publishAllOpen} onOpenChange={(o) => { if (!o) setPublishAllOpen(false); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish all drafts?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to publish all <strong>{lessonCounts.draft}</strong> draft{lessonCounts.draft !== 1 ? " lessons" : " lesson"}? They will immediately become visible to all members. No notifications will be sent — use the Notifications section to announce them.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={publishAll.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={publishAll.isPending}
              onClick={(e) => { e.preventDefault(); publishAll.mutate(); }}
              className="bg-success text-success-foreground hover:bg-success/90"
            >
              {publishAll.isPending ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Publishing…</>
              ) : (
                `Publish ${lessonCounts.draft} draft${lessonCounts.draft !== 1 ? "s" : ""}`
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete lesson confirmation */}
      <AlertDialog open={deleteTarget !== null} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete content?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete "{deleteTarget?.title}"? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={del.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={del.isPending}
              onClick={(e) => {
                e.preventDefault();
                if (deleteTarget) del.mutate(deleteTarget.id);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {del.isPending ? "Deleting…" : "Delete permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Publish all draft courses confirmation */}
      <AlertDialog open={publishAllCoursesOpen} onOpenChange={(o) => { if (!o) setPublishAllCoursesOpen(false); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish all draft courses?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to publish all <strong>{courseCounts.draft}</strong> draft course{courseCounts.draft !== 1 ? "s" : ""}? They will immediately become visible to all members. No notifications will be sent — use the Notifications section to announce them.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={publishAllCoursesMut.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={publishAllCoursesMut.isPending}
              onClick={(e) => { e.preventDefault(); publishAllCoursesMut.mutate(); }}
              className="bg-success text-success-foreground hover:bg-success/90"
            >
              {publishAllCoursesMut.isPending ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Publishing…</>
              ) : (
                `Publish ${courseCounts.draft} course${courseCounts.draft !== 1 ? "s" : ""}`
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Notification modal — shown after a single lesson is manually published */}
      <PublishNotificationModal
        contentId={notifyLesson?.id ?? null}
        title={notifyLesson?.title ?? ""}
        open={notifyLesson !== null}
        onClose={() => setNotifyLesson(null)}
      />

      {/* Delete course confirmation */}
      <AlertDialog open={deleteCourseTarget !== null} onOpenChange={o => { if (!o) setDeleteCourseTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete course?</AlertDialogTitle>
            <AlertDialogDescription>
              Permanently delete "{deleteCourseTarget?.title}" and all its modules, lessons and member progress? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={delCourseMut.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={delCourseMut.isPending}
              onClick={e => { e.preventDefault(); if (deleteCourseTarget) delCourseMut.mutate(deleteCourseTarget.id); }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {delCourseMut.isPending ? "Deleting…" : "Delete permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
