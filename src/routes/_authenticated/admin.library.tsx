import { createFileRoute } from "@tanstack/react-router";
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
import { Library, Pencil, Archive, Trash2, RotateCcw, Search, Loader2, GraduationCap } from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { listAdminCourses, deleteCourse as deleteCourseServerFn } from "@/lib/courses.functions";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/_authenticated/admin/library")({
  head: () => ({ meta: [{ title: "Library — DCPG Admin" }] }),
  component: LibraryPage,
});

type ContentStatus = "draft" | "published" | "archived";

function LibraryPage() {
  const qc = useQueryClient();
  const { user, roles } = Route.useRouteContext() as { user: { id: string }; roles: string[] };
  const isAuthorOnly = roles.includes("author") && !roles.includes("super_admin");
  const isSuperAdmin = roles.includes("super_admin");

  const [statusFilter, setStatusFilter] = useState<"all" | ContentStatus>("all");
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const listCoursesFn = useServerFn(listAdminCourses);
  const deleteCourseServer = useServerFn(deleteCourseServerFn);
  const [deleteCourseTarget, setDeleteCourseTarget] = useState<{ id: string; title: string } | null>(null);

  const coursesQ = useQuery({
    queryKey: ["admin", "courses"],
    queryFn: () => listCoursesFn(),
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

  const counts = useMemo(() => {
    const rows = contentQ.data ?? [];
    return {
      all: rows.length,
      published: rows.filter((r) => r.status === "published").length,
      draft: rows.filter((r) => r.status === "draft").length,
      archived: rows.filter((r) => r.status === "archived").length,
    };
  }, [contentQ.data]);

  const filteredContent = useMemo(() => {
    let rows = contentQ.data ?? [];
    if (statusFilter !== "all") rows = rows.filter((r) => r.status === statusFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter((r) => r.title.toLowerCase().includes(q));
    }
    return rows;
  }, [contentQ.data, statusFilter, search]);

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ContentStatus }) => {
      const patch = status === "published"
        ? { status, published_at: new Date().toISOString() }
        : { status };
      const { error } = await supabase.from("content").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_d, vars) => {
      toast.success(vars.status === "archived" ? "Content archived" : "Content restored");
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

  const filterTabs: { key: "all" | ContentStatus; label: string; count: number }[] = [
    { key: "all",       label: "All",       count: counts.all },
    { key: "published", label: "Published", count: counts.published },
    { key: "draft",     label: "Draft",     count: counts.draft },
    { key: "archived",  label: "Archived",  count: counts.archived },
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
          <p className="text-muted-foreground mb-8">
            {isAuthorOnly
              ? "All your uploaded lessons. Click Edit to make changes."
              : "All uploaded lessons. Search, filter, edit, archive or delete content."}
          </p>

          {/* Toolbar: search + filter tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search by title…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status filter tabs */}
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

          {/* Loading skeleton */}
          {contentQ.isLoading && (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          )}

          {/* Table */}
          {!contentQ.isLoading && (
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
                    {filteredContent.map((c) => {
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
                              {/* Edit — navigates to upload form with ?edit=id */}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => { window.location.href = "/admin?edit=" + c.id; }}
                                aria-label="Edit"
                                title="Edit"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>

                              {/* Archive / Restore */}
                              {c.status === "archived" ? (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setStatus.mutate({ id: c.id, status: "published" })}
                                  disabled={setStatus.isPending}
                                  aria-label="Restore"
                                  title="Restore to published"
                                >
                                  {setStatus.isPending
                                    ? <Loader2 className="h-4 w-4 animate-spin" />
                                    : <RotateCcw className="h-4 w-4" />}
                                </Button>
                              ) : (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setStatus.mutate({ id: c.id, status: "archived" })}
                                  disabled={setStatus.isPending}
                                  aria-label="Archive"
                                  title="Archive"
                                >
                                  {setStatus.isPending
                                    ? <Loader2 className="h-4 w-4 animate-spin" />
                                    : <Archive className="h-4 w-4" />}
                                </Button>
                              )}

                              {/* Delete — super_admin only */}
                              {isSuperAdmin && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
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
                    {filteredContent.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-14 text-center text-muted-foreground">
                          {search.trim()
                            ? `No results for "${search}"`
                            : "No content in this view."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Course Library Section */}
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="h-7 w-7 text-gold" />
              <h1 className="font-display text-3xl font-extrabold">Course Library</h1>
            </div>
            <p className="text-muted-foreground mb-5">All courses with modules and lessons.</p>

            {coursesQ.isLoading && (
              <div className="space-y-2">{[1, 2].map(i => <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />)}</div>
            )}

            {!coursesQ.isLoading && (
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
                      {(coursesQ.data?.courses ?? []).map((c: { id: string; title: string; status: string; category_name: string | null; module_count: number; lesson_count: number; created_at: string }) => {
                        const statusClass = c.status === 'published' ? 'bg-success/15 text-success' : c.status === 'archived' ? 'bg-gold/15 text-gold' : 'bg-muted text-muted-foreground';
                        return (
                          <tr key={c.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3 font-medium max-w-[200px]"><span className="block truncate" title={c.title}>{c.title}</span></td>
                            <td className="px-4 py-3 text-muted-foreground">{c.category_name ?? '—'}</td>
                            <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{c.module_count} modules • {c.lesson_count} lessons</td>
                            <td className="px-4 py-3"><span className={"text-xs px-2 py-0.5 rounded-full capitalize " + statusClass}>{c.status}</span></td>
                            <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">{new Date(c.created_at).toLocaleDateString()}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-1">
                                <Button type="button" variant="ghost" size="sm" onClick={() => { window.location.href = '/admin?editCourse=' + c.id; }} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>
                                {isSuperAdmin && <Button type="button" variant="ghost" size="sm" onClick={() => setDeleteCourseTarget({ id: c.id, title: c.title })} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {(coursesQ.data?.courses ?? []).length === 0 && (
                        <tr><td colSpan={6} className="px-4 py-14 text-center text-muted-foreground">No courses yet. Create one from the Upload page.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

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

      {/* Delete course confirmation */}
      <AlertDialog open={deleteCourseTarget !== null} onOpenChange={o => { if (!o) setDeleteCourseTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete course?</AlertDialogTitle>
            <AlertDialogDescription>Permanently delete "{deleteCourseTarget?.title}" and all its modules, lessons and member progress? This cannot be undone.</AlertDialogDescription>
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
