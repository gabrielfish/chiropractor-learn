import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FileDropzone } from "@/components/FileDropzone";
import { uploadContentFile, youtubeThumbnail, slugify } from "@/lib/storage";
import { toast } from "sonner";
import { Plus, Pencil, X, Loader2, GraduationCap, ChevronUp, ChevronDown, GripVertical } from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { PublishNotificationModal } from "@/components/PublishNotificationModal";
import { saveCourse } from "@/lib/courses.functions";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({ meta: [{ title: "Upload — DCPG Admin" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    edit: typeof search.edit === "string" ? search.edit : undefined,
    editCourse: typeof search.editCourse === "string" ? search.editCourse : undefined,
  }),
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
  display_author_name: "Dr Ryan Rieder",
};

type LessonDraft = {
  id: string | null; localId: string; title: string;
  content_type: 'video' | 'pdf' | 'text'; video_url: string;
  pdf_url: string; text_content: string; description: string;
  lessonVideoSource?: 'youtube' | 'upload';
}
type ModuleDraft = {
  id: string | null; localId: string; title: string;
  description: string; lessons: LessonDraft[];
}
type CourseFormState = {
  title: string; description: string; category_id: string;
  display_author_name: string; thumbnail_url: string;
  status: 'draft' | 'published'; modules: ModuleDraft[];
}
const emptyCourseForm: CourseFormState = {
  title: '', description: '', category_id: '', display_author_name: 'Dr Ryan Rieder',
  thumbnail_url: '', status: 'published', modules: []
}

function AdminPage() {
  const qc = useQueryClient();
  const { user, roles } = Route.useRouteContext() as { user: { id: string }; roles: string[] };
  const isAuthorOnly = roles.includes("author") && !roles.includes("super_admin");
  const isSuperAdmin = roles.includes("super_admin");
  const { edit: editParam, editCourse: editCourseParam } = Route.useSearch();

  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [useCustomThumb, setUseCustomThumb] = useState(false);
  const [videoSource, setVideoSource] = useState<"youtube" | "upload">("youtube");
  const [addingCat, setAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [savingCat, setSavingCat] = useState(false);
  const [publishedModal, setPublishedModal] = useState<{ id: string | null; title: string; contentUrl?: string } | null>(null);

  const [contentMode, setContentMode] = useState<'lesson' | 'course'>('lesson');
  const [courseForm, setCourseForm] = useState<CourseFormState>(emptyCourseForm);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const saveCourseF = useServerFn(saveCourse);

  let _localIdCounter = 0;

  const categoriesQ = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("order");
      if (error) throw error;
      return data;
    },
  });

  // Load a specific content item when navigating here from Library's Edit button
  const editItemQ = useQuery({
    queryKey: ["admin", "content-item", editParam],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content")
        .select("*, category:categories(name)")
        .eq("id", editParam!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!editParam && !editingId,
  });

  const editCourseQ = useQuery({
    queryKey: ["admin", "course-edit", editCourseParam],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any
      const { data: course } = await db.from("courses").select("*").eq("id", editCourseParam!).single()
      const { data: modules } = await db.from("course_modules").select("*").eq("course_id", editCourseParam!).order("order_index")
      const modIds = (modules ?? []).map((m: any) => m.id as string)
      const lessons = modIds.length > 0
        ? ((await db.from("course_lessons").select("*").in("module_id", modIds).order("order_index")).data ?? [])
        : []
      return { course, modules: modules ?? [], lessons }
    },
    enabled: !!editCourseParam && !editingCourseId,
  });

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

  // Auto-fill form when the ?edit=<id> item finishes loading
  useEffect(() => {
    if (editItemQ.data && !editingId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      startEdit(editItemQ.data as any);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editItemQ.data]);

  useEffect(() => {
    if (!editCourseQ.data || editingCourseId) return
    const { course, modules, lessons } = editCourseQ.data
    if (!course) return
    setContentMode('course')
    setEditingCourseId(course.id as string)
    setCourseForm({
      title: (course.title as string) ?? '',
      description: (course.description as string) ?? '',
      category_id: (course.category_id as string) ?? '',
      display_author_name: (course.display_author_name as string) ?? 'Dr Ryan Rieder',
      thumbnail_url: (course.thumbnail_url as string) ?? '',
      status: (course.status as 'draft' | 'published') ?? 'published',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      modules: modules.map((m: any) => ({
        id: m.id as string,
        localId: m.id as string,
        title: (m.title as string) ?? '',
        description: (m.description as string) ?? '',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        lessons: (lessons as any[])
          .filter((l: any) => l.module_id === m.id)
          .map((l: any) => ({
            id: l.id as string,
            localId: l.id as string,
            title: (l.title as string) ?? '',
            description: (l.description as string) ?? '',
            content_type: (l.content_type as 'video' | 'pdf' | 'text') ?? 'video',
            video_url: (l.video_url as string) ?? '',
            pdf_url: (l.pdf_url as string) ?? '',
            text_content: (l.text_content as string) ?? '',
          }))
      }))
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editCourseQ.data]);

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: row, error } = await (supabase as any)
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: row, error } = await (supabase as any)
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
        setPublishedModal({ id: newId, title: newTitle });
      }
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const mkLesson = () => ({ id: null, localId: 'new-' + (++_localIdCounter), title: '', content_type: 'video' as const, video_url: '', pdf_url: '', text_content: '', description: '', lessonVideoSource: 'youtube' as const })
  const mkModule = (): ModuleDraft => ({ id: null, localId: 'mod-' + (++_localIdCounter), title: '', description: '', lessons: [mkLesson()] })
  const addMod = () => setCourseForm(f => ({ ...f, modules: [...f.modules, mkModule()] }))
  const removeMod = (i: number) => setCourseForm(f => ({ ...f, modules: f.modules.filter((_, x) => x !== i) }))
  const moveMod = (i: number, dir: -1 | 1) => setCourseForm(f => { const a = [...f.modules]; [a[i], a[i + dir]] = [a[i + dir], a[i]]; return { ...f, modules: a } })
  const updateMod = (i: number, patch: Partial<ModuleDraft>) => setCourseForm(f => { const a = [...f.modules]; a[i] = { ...a[i], ...patch }; return { ...f, modules: a } })
  const addLesson = (mi: number) => setCourseForm(f => { const m = [...f.modules]; m[mi] = { ...m[mi], lessons: [...m[mi].lessons, mkLesson()] }; return { ...f, modules: m } })
  const removeLesson = (mi: number, li: number) => setCourseForm(f => { const m = [...f.modules]; m[mi] = { ...m[mi], lessons: m[mi].lessons.filter((_, x) => x !== li) }; return { ...f, modules: m } })
  const moveLesson = (mi: number, li: number, dir: -1 | 1) => setCourseForm(f => { const m = [...f.modules]; const ls = [...m[mi].lessons]; [ls[li], ls[li + dir]] = [ls[li + dir], ls[li]]; m[mi] = { ...m[mi], lessons: ls }; return { ...f, modules: m } })
  const updateLesson = (mi: number, li: number, patch: Partial<LessonDraft>) => setCourseForm(f => { const m = [...f.modules]; const ls = [...m[mi].lessons]; ls[li] = { ...ls[li], ...patch }; m[mi] = { ...m[mi], lessons: ls }; return { ...f, modules: m } })

  const saveCourseMut = useMutation({
    mutationFn: async () => {
      if (!courseForm.title.trim()) throw new Error("Course title is required")
      return saveCourseF({ data: {
        id: editingCourseId,
        ...courseForm,
        modules: courseForm.modules.map((m, mi) => ({
          id: m.id, title: m.title, description: m.description || null, order_index: mi,
          lessons: m.lessons.map((l, li) => ({
            id: l.id, title: l.title, description: l.description || null,
            content_type: l.content_type, video_url: l.video_url || null,
            pdf_url: l.pdf_url || null, text_content: l.text_content || null, order_index: li,
          }))
        }))
      }})
    },
    onSuccess: (result) => {
      toast.success(editingCourseId ? "Course updated!" : "Course saved!")
      setCourseForm(emptyCourseForm)
      setEditingCourseId(null)
      setContentMode('lesson')
      qc.invalidateQueries({ queryKey: ["admin", "courses"] })
      if (!editingCourseId && courseForm.status === 'published' && result?.courseId) {
        setPublishedModal({ id: null, title: courseForm.title, contentUrl: `/course/${result.courseId}` })
      }
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <AdminSidebar active="content" />

      <main className="flex-1 pt-14 px-4 pb-4 sm:px-6 sm:pb-6 md:p-10 overflow-x-hidden min-w-0">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-display text-3xl font-extrabold mb-1">
            {isAuthorOnly ? "Upload content" : "Upload content"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {isAuthorOnly
              ? "Upload a new lesson. It will appear in your Library once saved."
              : "Upload a new lesson. Find and manage all content in the Library."}
          </p>

          <div className="mb-6">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">What are you creating?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { mode: 'lesson' as const, label: 'Single Lesson', desc: 'One video, PDF, or text lesson', Icon: Plus },
                { mode: 'course' as const, label: 'Course with Modules', desc: 'Multiple modules with lessons inside', Icon: GraduationCap },
              ].map(({ mode, label, desc, Icon }) => (
                <button key={mode} type="button" onClick={() => setContentMode(mode)}
                  className={"rounded-xl border-2 p-4 text-left transition-all flex items-start gap-3 " + (contentMode === mode ? "border-gold bg-gold/5" : "border-border hover:border-gold/40")}>
                  <div className={"p-2 rounded-lg shrink-0 " + (contentMode === mode ? "bg-gold/20 text-gold" : "bg-muted text-muted-foreground")}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-sm mb-0.5">{label}</div>
                    <div className="text-xs text-muted-foreground">{desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {contentMode === 'lesson' && (
            <section className="rounded-xl bg-card border border-border p-4 sm:p-6 shadow-card">
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
                    Leave blank to show your profile name. Enter a name here to attribute this content to someone else.
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
                <div className="md:col-span-2 space-y-1.5">
                  <Label>Notes & Text Content <span className="text-xs font-normal text-muted-foreground">(optional)</span></Label>
                  <Textarea
                    rows={5}
                    placeholder="Add supplementary notes, instructions, or text content that members will see alongside the video/PDF…"
                    value={(form as any).text_content ?? ""}
                    onChange={(e) => setForm({ ...form, text_content: e.target.value } as any)}
                  />
                  <p className="text-xs text-muted-foreground">This text appears below the video on the member lesson page.</p>
                </div>
              </div>
              <div className="flex justify-end mt-5">
                <Button
                  onClick={() => save.mutate()}
                  disabled={save.isPending}
                  className="w-full sm:w-auto bg-gold text-gold-foreground hover:bg-gold/90 h-11 inline-flex items-center gap-2"
                >
                  {save.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  {save.isPending ? "Saving…" : editingId ? "Update lesson" : "Save lesson"}
                </Button>
              </div>
            </section>
          )}

          {contentMode === 'course' && (
            <section className="rounded-xl bg-card border border-border p-4 sm:p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-bold flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-gold" />
                  {editingCourseId ? "Edit course" : "New course"}
                </h2>
                {editingCourseId && (
                  <Button variant="ghost" size="sm" onClick={() => { setCourseForm(emptyCourseForm); setEditingCourseId(null) }}>
                    <X className="h-4 w-4 mr-1" /> Cancel edit
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <Label>Course title *</Label>
                  <Input value={courseForm.title} onChange={e => setCourseForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. New Patient Conversion Mastery" />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <Label>Description</Label>
                  <Textarea rows={3} value={courseForm.description} onChange={e => setCourseForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <Label>Author Display Name</Label>
                  <Input value={courseForm.display_author_name} onChange={e => setCourseForm(f => ({ ...f, display_author_name: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={courseForm.category_id} onChange={e => setCourseForm(f => ({ ...f, category_id: e.target.value }))}>
                    <option value="">Select category…</option>
                    {(categoriesQ.data ?? []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={courseForm.status} onChange={e => setCourseForm(f => ({ ...f, status: e.target.value as 'draft' | 'published' }))}>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <Label>Course thumbnail</Label>
                  <FileDropzone label="Upload thumbnail" accept="image/*" uploaded={!!courseForm.thumbnail_url}
                    hint="JPG or PNG, 16:9 recommended"
                    onFile={async file => { try { const url = await uploadContentFile('thumbnail', file); setCourseForm(f => ({ ...f, thumbnail_url: url })); toast.success("Thumbnail uploaded") } catch (e) { toast.error("Upload failed") } }} />
                  {courseForm.thumbnail_url && <img src={courseForm.thumbnail_url} alt="" className="h-20 rounded-md border border-border object-cover mt-2" />}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-display font-bold mb-3">Modules ({courseForm.modules.length})</h3>
                <div className="space-y-3">
                  {courseForm.modules.map((mod, mi) => (
                    <div key={mod.localId} className="rounded-lg border border-border bg-background p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-muted-foreground">Module {mi + 1}</span>
                        <div className="flex gap-1">
                          <button type="button" onClick={() => moveMod(mi, -1)} disabled={mi === 0} className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 rounded"><ChevronUp className="h-4 w-4" /></button>
                          <button type="button" onClick={() => moveMod(mi, 1)} disabled={mi === courseForm.modules.length - 1} className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 rounded"><ChevronDown className="h-4 w-4" /></button>
                          <button type="button" onClick={() => removeMod(mi)} className="p-1 text-destructive hover:text-destructive/80 rounded"><X className="h-4 w-4" /></button>
                        </div>
                      </div>
                      <Input className="mb-3" placeholder="Module title" value={mod.title} onChange={e => updateMod(mi, { title: e.target.value })} />
                      <div className="space-y-2">
                        {mod.lessons.map((lesson, li) => (
                          <div key={lesson.localId} className="flex gap-2 items-start p-3 rounded-lg bg-muted/40 border border-border/50">
                            <GripVertical className="h-4 w-4 text-muted-foreground mt-2.5 shrink-0" />
                            <div className="flex-1 space-y-2 min-w-0">
                              <Input placeholder={"Lesson " + (li + 1) + " title"} value={lesson.title} onChange={e => updateLesson(mi, li, { title: e.target.value })} />
                              <div className="space-y-2">
                                {/* Video — YouTube URL or Upload toggle */}
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-2">
                                    <div className="inline-flex rounded-md border border-border bg-muted p-0.5 text-xs">
                                      <button type="button"
                                        onClick={() => updateLesson(mi, li, { lessonVideoSource: 'youtube' } as any)}
                                        className={"px-2.5 py-1 rounded " + (((lesson as any).lessonVideoSource ?? 'youtube') === 'youtube' ? "bg-card text-foreground shadow-sm font-medium" : "text-muted-foreground")}>
                                        YouTube URL
                                      </button>
                                      <button type="button"
                                        onClick={() => updateLesson(mi, li, { lessonVideoSource: 'upload', video_url: '' } as any)}
                                        className={"px-2.5 py-1 rounded " + (((lesson as any).lessonVideoSource ?? 'youtube') === 'upload' ? "bg-card text-foreground shadow-sm font-medium" : "text-muted-foreground")}>
                                        Upload File
                                      </button>
                                    </div>
                                  </div>
                                  {((lesson as any).lessonVideoSource ?? 'youtube') === 'youtube' ? (
                                    <Input placeholder="YouTube URL (optional)" value={lesson.video_url} onChange={e => updateLesson(mi, li, { video_url: e.target.value })} />
                                  ) : (
                                    <div className="space-y-1">
                                      <FileDropzone label="Upload video file" accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm" uploaded={!!lesson.video_url} hint="MP4, MOV, or WebM"
                                        onFile={async file => { try { const url = await uploadContentFile('video', file); updateLesson(mi, li, { video_url: url }); toast.success("Video uploaded") } catch(e) { toast.error("Upload failed") } }} />
                                      {lesson.video_url && <p className="text-xs text-green-600">✓ Video uploaded</p>}
                                    </div>
                                  )}
                                </div>
                                {/* PDF attachment */}
                                <div className="space-y-1">
                                  <FileDropzone label="PDF attachment (optional)" accept="application/pdf" uploaded={!!lesson.pdf_url} hint="PDF file"
                                    onFile={async file => { try { const url = await uploadContentFile('pdf', file); updateLesson(mi, li, { pdf_url: url }); toast.success("PDF uploaded") } catch(e) { toast.error("Upload failed") } }} />
                                  {lesson.pdf_url && <p className="text-xs text-green-600">✓ PDF uploaded</p>}
                                </div>
                                {/* Text/notes */}
                                <Textarea rows={2} placeholder="Notes or text content (optional)…" value={lesson.text_content} onChange={e => updateLesson(mi, li, { text_content: e.target.value })} />
                              </div>
                            </div>
                            <div className="flex flex-col gap-0.5 shrink-0">
                              <button type="button" onClick={() => moveLesson(mi, li, -1)} disabled={li === 0} className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 rounded"><ChevronUp className="h-3 w-3" /></button>
                              <button type="button" onClick={() => moveLesson(mi, li, 1)} disabled={li === mod.lessons.length - 1} className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 rounded"><ChevronDown className="h-3 w-3" /></button>
                              <button type="button" onClick={() => removeLesson(mi, li)} className="p-1 text-destructive hover:text-destructive/80 rounded"><X className="h-3 w-3" /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={() => addLesson(mi)} className="mt-2 w-full">
                        <Plus className="h-3.5 w-3.5 mr-1.5" />Add Lesson
                      </Button>
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" onClick={addMod} className="w-full mt-3">
                  <Plus className="h-4 w-4 mr-2" />Add Module
                </Button>
              </div>

              <div className="flex justify-end mt-6">
                <Button onClick={() => saveCourseMut.mutate()} disabled={saveCourseMut.isPending}
                  className="w-full sm:w-auto bg-gold text-gold-foreground hover:bg-gold/90 h-11 inline-flex items-center gap-2">
                  {saveCourseMut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  {saveCourseMut.isPending ? "Saving…" : editingCourseId ? "Update course" : "Save course"}
                </Button>
              </div>
            </section>
          )}
        </div>
      </main>

      <PublishNotificationModal
        open={publishedModal !== null}
        contentId={publishedModal?.id ?? null}
        contentUrl={publishedModal?.contentUrl}
        title={publishedModal?.title ?? ""}
        onClose={() => setPublishedModal(null)}
      />
    </div>
  );
}
