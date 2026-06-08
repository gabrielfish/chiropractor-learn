import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FileDropzone } from "@/components/FileDropzone";
import { uploadContentFile, youtubeThumbnail, slugify } from "@/lib/storage";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { PublishNotificationModal } from "@/components/PublishNotificationModal";
import { useServerFn } from "@tanstack/react-start";
import { notifyAuthorPublished } from "@/lib/authors.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({ meta: [{ title: "Admin — DCPG" }] }),
  component: AdminPage,
});

function AdminPage() {
  const qc = useQueryClient();
  const { user, roles } = Route.useRouteContext() as { user: { id: string }; roles: string[] };
  const isAuthorOnly = roles.includes("author") && !roles.includes("super_admin");
  const notifyAuthorFn = useServerFn(notifyAuthorPublished);
  const [form, setForm] = useState({
    title: "", description: "", category_id: "", video_url: "",
    pdf_url: "", thumbnail_url: "",
    status: "published" as "draft" | "published",
  });
  const [useCustomThumb, setUseCustomThumb] = useState(false);
  const [videoSource, setVideoSource] = useState<"youtube" | "upload">("youtube");
  const [addingCat, setAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [savingCat, setSavingCat] = useState(false);
  const [publishedModal, setPublishedModal] = useState<{ id: string; title: string } | null>(null);

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

  // Derived thumbnail: YouTube auto (only when using YouTube source) unless custom toggled
  const ytThumb = videoSource === "youtube" && !useCustomThumb ? youtubeThumbnail(form.video_url) : null;
  const effectiveThumb = useCustomThumb ? form.thumbnail_url : (ytThumb ?? form.thumbnail_url);

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

  const create = useMutation({
    mutationFn: async () => {
      if (!form.title.trim()) throw new Error("Title is required");
      const { data: row, error } = await supabase.from("content").insert({
        title: form.title,
        description: form.description || null,
        category_id: form.category_id || null,
        video_url: form.video_url || null,
        pdf_url: form.pdf_url || null,
        thumbnail_url: effectiveThumb || null,
        author_id: user.id,
        status: form.status,
        published_at: form.status === "published" ? new Date().toISOString() : null,
      }).select("id, title, status").single();
      if (error) throw error;
      return row;
    },
    onSuccess: (row) => {
      toast.success("Content saved");
      const wasPublished = row?.status === "published";
      const newId = row?.id ?? null;
      const newTitle = row?.title ?? "";
      setForm({ title: "", description: "", category_id: "", video_url: "", pdf_url: "", thumbnail_url: "", status: "published" });
      setUseCustomThumb(false);
      qc.invalidateQueries({ queryKey: ["admin", "content"] });
      qc.invalidateQueries({ queryKey: ["content"] });
      if (wasPublished && newId) {
        if (isAuthorOnly) {
          // Author publishing — notify super admins in the background
          notifyAuthorFn({ data: { contentId: newId } }).catch(() => {});
        }
        setPublishedModal({ id: newId, title: newTitle });
      }
    },
    onError: (e: Error) => toast.error(e.message),
  });


  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar active="content" />



      <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-3xl font-extrabold mb-1">Manage content</h1>
          <p className="text-muted-foreground mb-8">Upload lessons and manage your library.</p>

          <section className="rounded-xl bg-card border border-border p-6 shadow-card mb-10">
            <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2"><Plus className="h-5 w-5 text-gold" /> New lesson</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <Label>Title *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <Label>Description</Label>
                <Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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
                  <div className="flex gap-2 pt-2">
                    <Input
                      autoFocus
                      placeholder="New category name"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void onAddCategory(); } }}
                    />
                    <Button type="button" size="sm" onClick={onAddCategory} disabled={savingCat || !newCatName.trim()}>
                      {savingCat ? "…" : "Save"}
                    </Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => { setAddingCat(false); setNewCatName(""); }}>
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" })}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
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
              <Button onClick={() => create.mutate()} disabled={create.isPending} className="bg-gold text-gold-foreground hover:bg-gold/90">
                {create.isPending ? "Saving…" : "Save lesson"}
              </Button>
            </div>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold mb-4">All content ({contentQ.data?.length ?? 0})</h2>
            <div className="rounded-xl bg-card border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {(contentQ.data ?? []).map((c) => (
                    <tr key={c.id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium">{c.title}</td>
                      <td className="px-4 py-3 text-muted-foreground">{c.category?.name ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === "published" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {(contentQ.data ?? []).length === 0 && (
                    <tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">No content yet.</td></tr>
                  )}
                </tbody>
              </table>
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
    </div>
  );
}
