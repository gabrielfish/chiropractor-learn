import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { FileDropzone } from "@/components/FileDropzone";
import { uploadContentFile, youtubeThumbnail, slugify } from "@/lib/storage";
import { toast } from "sonner";
import { Plus, Pencil, Archive, Trash2, RotateCcw, X, Loader2 } from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { PublishNotificationModal } from "@/components/PublishNotificationModal";
import { useServerFn } from "@tanstack/react-start";
import { notifyAuthorPublished } from "@/lib/authors.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({ meta: [{ title: "Admin — DCPG" }] }),
  component: AdminPage,
});

type ContentStatus = "draft" | "published" | "archived";

type ContentType = "video" | "pdf" | "book" | "";

type FormState = {
  title: string;
  description: string;
  category_id: string;
  content_type: ContentType;
  video_url: string;
  pdf_url: string;
  thumbnail_url: string;
  status: ContentStatus;
  display_author_name: string;
};

const emptyForm: FormState = {
  title: "",
  description: "",
  category_id: "",
  content_type: "",
  video_url: "",
  pdf_url: "",
  thumbnail_url: "",
  status: "published",
  display_author_name: "",
};

function AdminPage() {
  const qc = useQueryClient();
  const { user, roles } = Route.useRouteContext() as { user: { id: string }; roles: string[] };
  const isAuthorOnly = roles.includes("author") && !roles.includes("super_admin");
  const isSuperAdmin = roles.includes("super_admin");
  const notifyAuthorFn = useServerFn(notifyAuthorPublished);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [useCustomThumb, setUseCustomThumb] = useState(false);
  const [videoSource, setVideoSource] = useState<"youtube" | "upload">("youtube");
  const [addingCat, setAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [savingCat, setSavingCat] = useState(false);
  const [publishedModal, setPublishedModal] = useState<{ id: string; title: string } | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | ContentStatus>("all");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const categoriesQ = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("order");
      if (error) throw error;
      return data;
    },
  });

  const contentQ = useQuery({
    queryKey: ["admin", "content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content")
        .select("*, category:categories(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filteredContent = useMemo(() => {
    const rows = contentQ.data ?? [];
    if (statusFilter === "all") return rows;
    return rows.filter((r) => r.status === statusFilter);
  }, [contentQ.data, statusFilter]);

  const counts = useMemo(() => {
    const rows = contentQ.data ?? [];
    return {
      all: rows.length,
      published: rows.filter((r) => r.status === "published").length,
      draft: rows.filter((r) => r.status === "draft").length,
      archived: rows.filter((r) => r.status === "archived").length,
    };
  }, [contentQ.data]);

  const ytThumb = videoSource === "youtube" && !useCustomThumb ? youtubeThumbnail(form.video_url) : null;
  const effectiveThumb = useCustomThumb ? form.thumbnail_url : (ytThumb ?? form.thumbnail_url);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setUseCustomThumb(false);
    setVideoSource("youtube");
  };

  const startEdit = (row: {
    id: string;
    title: string;
    description: string | null;
    category_id: string | null;
    content_type: string | null;
    video_url: string | null;
    pdf_url: string | null;
    thumbnail_url: string | null;
    status: ContentStatus;
  }) => {
    setEditingId(row.id);
    setForm({
      title: row.title ?? "",
      description: row.description ?? "",
      category_id: row.category_id ?? "",
      content_type: (row.content_type as ContentType) ?? "",
      video_url: row.video_url ?? "",
      pdf_url: row.pdf_url ?? "",
      thumbnail_url: row.thumbnail_url ?? "",
      status: row.status,
      display_author_name: (row as { display_author_name?: string | null }).display_author_name ?? "",
    });
    const isYt = !!row.video_url && /youtu\.?be/.test(row.video_url);
    setVideoSource(isYt ? "youtube" : row.video_url ? "upload" : "youtube");
    const ytAuto = isYt ? youtubeThumbnail(row.video_url ?? "") : null;
    setUseCustomThumb(!!row.thumbnail_url && row.thumbnail_url !== ytAuto);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onAddCategory = async () => {
    const name = newCatName.trim();
    if (!name) return;
    setSavingCat(true);
    try {
      const slug = slugify(name);
      const { data, error } = await supabase
        .from("categories")
        .insert({ name, slug })
        .select()
        .single();
      if (error) throw error;
      toast.success("Category added");
      setForm((f) => ({ ...f, category_id: data.id }));
      setNewCatName("");
      setAddingCat(false);
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
      qc.invalidateQueries({ queryKey: ["categories"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add category");
    } finally {
      setSavingCat(false);
    }
  };

  const save = useMutation({
    mutationFn: async () => {
      if (!form.title.trim()) throw new Error("Title is required");
      const payload = {
        title: form.title,
        description: form.description || null,
        category_id: form.category_id || null,
        content_type: form.content_type || null,
        video_url: form.video_url || null,
        pdf_url: form.pdf_url || null,
        thumbnail_url: effectiveThumb || null,
        status: form.status,
        display_author_name: form.display_author_name.trim() || null,
      };
      if (editingId) {
        const { data: row, error } = await supabase
          .from("content")
          .update({
            ...payload,
            published_at: form.status === "published" ? new Date().toISOString() : null,
          })
          .eq("id", editingId)
          .select("id, title, status")
          .single();
        if (error) throw error;
        return { row, isNew: false };
      }
      const { data: row, error } = await supabase
        .from("content")
        .insert({
          ...payload,
          author_id: user.id,
          published_at: form.status === "published" ? new Date().toISOString() : null,
        })
        .select("id, title, status")
        .single();
      if (error) throw error;
      return { row, isNew: true };
    },
    onSuccess: ({ row, isNew }) => {
      toast.success(isNew ? "Content saved" : "Content updated");
      const wasPublished = row?.status === "published";
      const newId = row?.id ?? null;
      const newTitle = row?.title ?? "";
      resetForm();
      qc.invalidateQueries({ queryKey: ["admin", "content"] });
      qc.invalidateQueries({ queryKey: ["content"] });
      if (isNew && wasPublished && newId) {
        if (isAuthorOnly) {
          notifyAuthorFn({ data: { contentId: newId } }).catch(() => {});
        }
        setPublishedModal({ id: newId, title: newTitle });
      }
    },
    onError: (e: Error) => toast.error(e.message),
  });

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
      if (editingId && deleteTarget?.id === editingId) resetForm();
      qc.invalidateQueries({ queryKey: ["admin", "content"] });
      qc.invalidateQueries({ queryKey: ["content"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filterTabs: { key: "all" | ContentStatus; label: string; count: number }[] = [
    { key: "all", label: "All", count: counts.all },
    { key: "published", label: "Published", count: counts.published },
    { key: "draft", label: "Draft", count: counts.draft },
    { key: "archived", label: "Archived", count: counts.archived },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar active="content" />

      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-x-hidden min-w-0">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-3xl font-extrabold mb-1">Manage content</h1>
          <p className="text-muted-foreground mb-8">Upload lessons and manage your library.</p>

          <section className="rounded-xl bg-card border border-border p-4 sm:p-6 shadow-card mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold flex items-center gap-2">
                {editingId ? <Pencil className="h-5 w-5 text-gold" /> : <Plus className="h-5 w-5 text-gold" />}
                {editingId ? "Edit lesson" : "New lesson"}
              </h2>
              {editingId && (
                <Button type="button" variant="ghost" size="sm" onClick={resetForm}>
                  <X className="h-4 w-4 mr-1" /> Cancel edit
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <Label>Title *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <Label>Description</Label>
                <Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <Label htmlFor="display_author_name">
                  Author Display Name
                  <span className="ml-2 text-xs font-normal text-muted-foreground">(optional — overrides your profile name)</span>
                </Label>
                <Input
                  id="display_author_name"
                  placeholder="e.g. Dr Ryan Rieder"
                  value={form.display_author_name}
                  onChange={(e) => setForm({ ...form, display_author_name: e.target.value })}
                  maxLength={120}
                />
                <p className="text-xs text-muted-foreground">
                  Leave blank to show your profile name. Enter a name here to attribute this content to someone else — e.g. upload on behalf of Ryan.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={addingCat ? "__add__" : form.category_id}
                  onChange={(e) => {
                    if (e.target.value === "__add__") { setAddingCat(true); }
                    else { setAddingCat(false); setForm({ ...form, category_id: e.target.value }); }
                  }}
                >
                  <option value="">Select category…</option>
                  {(categoriesQ.data ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  <option value="__add__">+ Add new category…</option>
                </select>
                {addingCat && (
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Input
                      autoFocus
                      placeholder="New category name"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void onAddCategory(); } }}
                      className="flex-1"
                    />
                    <div className="flex gap-2">
                      <Button type="button" size="sm" onClick={onAddCategory} disabled={savingCat || !newCatName.trim()} className="flex-1 sm:flex-none">
                        {savingCat ? "…" : "Save"}
                      </Button>
                      <Button type="button" size="sm" variant="ghost" onClick={() => { setAddingCat(false); setNewCatName(""); }} className="flex-1 sm:flex-none">
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as ContentStatus })}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  {isSuperAdmin && <option value="archived">Archived</option>}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Content type</Label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={form.content_type}
                  onChange={(e) => setForm({ ...form, content_type: e.target.value as ContentType })}
                >
                  <option value="">— Select type —</option>
                  <option value="video">Video</option>
                  <option value="pdf">PDF</option>
                  <option value="book">Book</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Video source</Label>
                <div className="inline-flex rounded-md border border-border bg-muted p-1">
                  <button
                    type="button"
                    onClick={() => { setVideoSource("youtube"); setForm((f) => ({ ...f, video_url: "" })); }}
                    className={`px-3 py-1.5 text-sm rounded ${videoSource === "youtube" ? "bg-card text-foreground shadow-sm font-medium" : "text-muted-foreground"}`}
                  >
                    YouTube URL
                  </button>
                  <button
                    type="button"
                    onClick={() => { setVideoSource("upload"); setForm((f) => ({ ...f, video_url: "" })); }}
                    className={`px-3 py-1.5 text-sm rounded ${videoSource === "upload" ? "bg-card text-foreground shadow-sm font-medium" : "text-muted-foreground"}`}
                  >
                    Upload Video File
                  </button>
                </div>
                {videoSource === "youtube" ? (
                  <Input placeholder="https://youtu.be/…" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} />
                ) : (
                  <div className="space-y-2">
                    <FileDropzone
                      label="Upload video file"
                      accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
                      uploaded={!!form.video_url}
                      hint="Drag and drop or click to select an MP4, MOV, or WebM file"
                      onFile={async (file) => {
                        try {
                          const url = await uploadContentFile("video", file);
                          setForm((f) => ({ ...f, video_url: url }));
                          toast.success("Video uploaded");
                        } catch (e) {
                          toast.error(e instanceof Error ? e.message : "Upload failed");
                        }
                      }}
                    />
                    {form.video_url && (
                      <video src={form.video_url} controls className="w-full max-h-56 rounded-md border border-border bg-black" />
                    )}
                    <p className="text-xs text-muted-foreground">
                      For large video files we recommend using Cloudflare Stream — ask your developer to set this up.
                    </p>
                  </div>
                )}
                <div className="flex items-center justify-between pt-3">
                  <div>
                    <div className="text-sm font-medium text-foreground">Use custom thumbnail instead</div>
                    <div className="text-xs text-muted-foreground">By default we use the YouTube thumbnail.</div>
                  </div>
                  <Switch checked={useCustomThumb} onCheckedChange={setUseCustomThumb} />
                </div>
                {!useCustomThumb && ytThumb && (
                  <div className="pt-2">
                    <img src={ytThumb} alt="YouTube thumbnail preview" className="h-24 rounded-md border border-border object-cover" />
                  </div>
                )}
                {useCustomThumb && (
                  <div className="pt-2 space-y-2">
                    <FileDropzone
                      label="Upload custom thumbnail"
                      accept="image/*"
                      uploaded={!!form.thumbnail_url}
                      hint="JPG or PNG, 16:9 recommended"
                      onFile={async (file) => {
                        try {
                          const url = await uploadContentFile("thumbnail", file);
                          setForm((f) => ({ ...f, thumbnail_url: url }));
                          toast.success("Thumbnail uploaded");
                        } catch (e) {
                          toast.error(e instanceof Error ? e.message : "Upload failed");
                        }
                      }}
                    />
                    {form.thumbnail_url && (
                      <img src={form.thumbnail_url} alt="Custom thumbnail" className="h-24 rounded-md border border-border object-cover" />
                    )}
                  </div>
                )}
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <Label>PDF</Label>
                <FileDropzone
                  label="Upload PDF"
                  accept="application/pdf"
                  uploaded={!!form.pdf_url}
                  hint="Drag and drop or click to select a PDF"
                  onFile={async (file) => {
                    try {
                      const url = await uploadContentFile("pdf", file);
                      setForm((f) => ({ ...f, pdf_url: url }));
                      toast.success("PDF uploaded");
                    } catch (e) {
                      toast.error(e instanceof Error ? e.message : "Upload failed");
                    }
                  }}
                />
              </div>

            </div>
            <div className="flex justify-end mt-5">
              <Button onClick={() => save.mutate()} disabled={save.isPending} className="w-full sm:w-auto bg-gold text-gold-foreground hover:bg-gold/90 h-11 inline-flex items-center gap-2">
                {save.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {save.isPending ? "Saving…" : editingId ? "Update lesson" : "Save lesson"}
              </Button>
            </div>
          </section>

          <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="font-display text-lg font-bold shrink-0">All content ({counts.all})</h2>
              <div className="inline-flex rounded-md border border-border bg-muted p-1 overflow-x-auto max-w-full">
                {filterTabs.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setStatusFilter(t.key)}
                    className={`px-3 py-1.5 text-xs rounded font-medium transition-colors ${
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
            <div className="rounded-xl bg-card border border-border overflow-hidden">
              <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[560px]">
                <thead className="bg-muted">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                    {isSuperAdmin && <th className="px-4 py-3 font-medium text-right">Actions</th>}
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
                      <tr key={c.id} className="border-t border-border">
                        <td className="px-4 py-3 font-medium">{c.title}</td>
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
                        <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
                        {isSuperAdmin && (
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => startEdit(c)}
                                aria-label="Edit"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
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
                                  {setStatus.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
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
                                  {setStatus.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Archive className="h-4 w-4" />}
                                </Button>
                              )}
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
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                  {filteredContent.length === 0 && (
                    <tr><td colSpan={isSuperAdmin ? 6 : 5} className="px-4 py-10 text-center text-muted-foreground">No content in this view.</td></tr>
                  )}
                </tbody>
              </table>
              </div>
            </div>
          </section>
        </div>
      </main>

      <PublishNotificationModal
        open={publishedModal !== null}
        contentId={publishedModal?.id ?? null}
        title={publishedModal?.title ?? ""}
        onClose={() => setPublishedModal(null)}
      />

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
    </div>
  );
}
