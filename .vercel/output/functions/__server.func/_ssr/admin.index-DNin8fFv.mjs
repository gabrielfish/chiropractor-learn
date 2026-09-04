import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-IF66mSk9.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { I as Input } from "./input-DwaGuH4D.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { y as youtubeThumbnail, T as Textarea, F as FileDropzone, a as uploadContentFile, s as slugify } from "./storage-BcoHSXhA.mjs";
import { S as Switch } from "./switch-DDHih_sy.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { A as AdminSidebar } from "./AdminSidebar-D42diM0w.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog-pXddDSBH.mjs";
import { a as notifyContentPublished } from "./notify.functions-C2jnqAvX.mjs";
import { s as saveCourse } from "./courses.functions-CqfwLXBM.mjs";
import { s as syncContentToAlgolia, a as syncCourseToAlgolia } from "./algolia-sync.functions-B0A5QT5C.mjs";
import { e as Route$8 } from "./router-BgAMxlwC.mjs";
import "../_libs/seroval.mjs";
import { u as Plus, l as GraduationCap, v as Pencil, X, L as LoaderCircle, i as ChevronUp, C as ChevronDown, w as GripVertical, x as Send, y as Mail, z as Link2 } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "../_libs/radix-ui__react-switch.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "./createSsrRpc-Bc62EJ78.mjs";
import "./server-BomfFVcN.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-dN1VnyDc.mjs";
import "../_libs/zod.mjs";
function PublishNotificationModal({
  contentId,
  contentUrl,
  title,
  open,
  onClose
}) {
  const [sent, setSent] = reactExports.useState(false);
  const notify = useServerFn(notifyContentPublished);
  const url = contentUrl ?? (contentId && typeof window !== "undefined" ? `${window.location.origin}/content/${contentId}` : "");
  const notifyMut = useMutation({
    mutationFn: async () => {
      if (!contentId) throw new Error("Missing content id");
      return notify({ data: { contentId } });
    },
    onSuccess: (res) => {
      setSent(true);
      toast.success(
        `Emails sent to ${res.emailCount} member${res.emailCount === 1 ? "" : "s"}`
      );
      setTimeout(onClose, 1200);
    },
    onError: (e) => toast.error(e.message)
  });
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied — share it with whoever you like");
      onClose();
    } catch {
      toast.error("Couldn't copy link");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md p-0 overflow-hidden border-border bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary text-primary-foreground p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display text-xl font-extrabold flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-5 w-5 text-gold" }),
        " Content published"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { className: "text-primary-foreground/70 mt-1", children: [
        '"',
        title,
        '" is now live. How would you like to share it?'
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          disabled: notifyMut.isPending || sent || !contentId,
          onClick: () => notifyMut.mutate(),
          className: "w-full text-left rounded-lg border-2 border-gold bg-gold/5 hover:bg-gold/10 transition-colors p-4 flex items-start gap-3 disabled:opacity-60 disabled:cursor-not-allowed",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-gold/15 text-gold p-2 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-foreground", children: notifyMut.isPending ? "Sending…" : "Notify All Members" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Email everyone with notifications enabled, with a direct link." })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: onCopy,
          className: "w-full text-left rounded-lg border border-border bg-card hover:border-gold/60 hover:bg-muted/40 transition-colors p-4 flex items-start gap-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-primary/5 text-primary p-2 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-foreground", children: "Copy Link Instead" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Grab the URL and share it manually — no notification sent." })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: onClose,
          className: "w-full text-left rounded-lg border border-border bg-card hover:border-border hover:bg-muted/40 transition-colors p-4 flex items-start gap-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-muted text-muted-foreground p-2 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-foreground", children: "Skip for now" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Content is live — members will discover it naturally." })
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 pb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "w-full text-muted-foreground", onClick: onClose, children: "Close" }) })
  ] }) });
}
const emptyForm = {
  title: "",
  description: "",
  category_id: "",
  content_type: "",
  video_url: "",
  pdf_url: "",
  thumbnail_url: "",
  status: "published",
  display_author_name: "Dr Ryan Rieder"
};
const emptyCourseForm = {
  title: "",
  description: "",
  category_id: "",
  display_author_name: "Dr Ryan Rieder",
  thumbnail_url: "",
  status: "published",
  modules: []
};
function AdminPage() {
  const qc = useQueryClient();
  const {
    user,
    roles
  } = Route$8.useRouteContext();
  const isAuthorOnly = roles.includes("author") && !roles.includes("super_admin");
  const isSuperAdmin = roles.includes("super_admin");
  const {
    edit: editParam,
    editCourse: editCourseParam
  } = Route$8.useSearch();
  const [form, setForm] = reactExports.useState(emptyForm);
  const [editingId, setEditingId] = reactExports.useState(null);
  const [useCustomThumb, setUseCustomThumb] = reactExports.useState(false);
  const [videoSource, setVideoSource] = reactExports.useState("youtube");
  const [addingCat, setAddingCat] = reactExports.useState(false);
  const [newCatName, setNewCatName] = reactExports.useState("");
  const [savingCat, setSavingCat] = reactExports.useState(false);
  const [publishedModal, setPublishedModal] = reactExports.useState(null);
  const [contentMode, setContentMode] = reactExports.useState("lesson");
  const [courseForm, setCourseForm] = reactExports.useState(emptyCourseForm);
  const [editingCourseId, setEditingCourseId] = reactExports.useState(null);
  const saveCourseF = useServerFn(saveCourse);
  const syncContentF = useServerFn(syncContentToAlgolia);
  const syncCourseF = useServerFn(syncCourseToAlgolia);
  let _localIdCounter = 0;
  const categoriesQ = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("categories").select("*").order("order");
      if (error) throw error;
      return data;
    }
  });
  const editItemQ = useQuery({
    queryKey: ["admin", "content-item", editParam],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("content").select("*, category:categories(name)").eq("id", editParam).single();
      if (error) throw error;
      return data;
    },
    enabled: !!editParam && !editingId
  });
  const editCourseQ = useQuery({
    queryKey: ["admin", "course-edit", editCourseParam],
    queryFn: async () => {
      const db = supabase;
      const {
        data: course
      } = await db.from("courses").select("*").eq("id", editCourseParam).single();
      const {
        data: modules
      } = await db.from("course_modules").select("*").eq("course_id", editCourseParam).order("order_index");
      const modIds = (modules ?? []).map((m) => m.id);
      const lessons = modIds.length > 0 ? (await db.from("course_lessons").select("*").in("module_id", modIds).order("order_index")).data ?? [] : [];
      return {
        course,
        modules: modules ?? [],
        lessons
      };
    },
    enabled: !!editCourseParam && !editingCourseId
  });
  const ytThumb = videoSource === "youtube" && !useCustomThumb ? youtubeThumbnail(form.video_url) : null;
  const effectiveThumb = useCustomThumb ? form.thumbnail_url : ytThumb ?? form.thumbnail_url;
  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setUseCustomThumb(false);
    setVideoSource("youtube");
  };
  const startEdit = (row) => {
    setEditingId(row.id);
    setForm({
      title: row.title ?? "",
      description: row.description ?? "",
      category_id: row.category_id ?? "",
      content_type: row.content_type ?? "",
      video_url: row.video_url ?? "",
      pdf_url: row.pdf_url ?? "",
      thumbnail_url: row.thumbnail_url ?? "",
      status: row.status,
      display_author_name: row.display_author_name ?? ""
    });
    const isYt = !!row.video_url && /youtu\.?be/.test(row.video_url);
    setVideoSource(isYt ? "youtube" : row.video_url ? "upload" : "youtube");
    const ytAuto = isYt ? youtubeThumbnail(row.video_url ?? "") : null;
    setUseCustomThumb(!!row.thumbnail_url && row.thumbnail_url !== ytAuto);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  reactExports.useEffect(() => {
    if (editItemQ.data && !editingId) {
      startEdit(editItemQ.data);
    }
  }, [editItemQ.data]);
  reactExports.useEffect(() => {
    if (!editCourseQ.data || editingCourseId) return;
    const {
      course,
      modules,
      lessons
    } = editCourseQ.data;
    if (!course) return;
    setContentMode("course");
    setEditingCourseId(course.id);
    setCourseForm({
      title: course.title ?? "",
      description: course.description ?? "",
      category_id: course.category_id ?? "",
      display_author_name: course.display_author_name ?? "Dr Ryan Rieder",
      thumbnail_url: course.thumbnail_url ?? "",
      status: course.status ?? "published",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      modules: modules.map((m) => ({
        id: m.id,
        localId: m.id,
        title: m.title ?? "",
        description: m.description ?? "",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        lessons: lessons.filter((l) => l.module_id === m.id).map((l) => ({
          id: l.id,
          localId: l.id,
          title: l.title ?? "",
          description: l.description ?? "",
          content_type: l.content_type ?? "video",
          video_url: l.video_url ?? "",
          pdf_url: l.pdf_url ?? "",
          text_content: l.text_content ?? "",
          lessonVideoSource: l.video_url && !/youtu/.test(l.video_url) ? "upload" : "youtube"
        }))
      }))
    });
  }, [editCourseQ.data]);
  const onAddCategory = async () => {
    const name = newCatName.trim();
    if (!name) return;
    setSavingCat(true);
    try {
      const slug = slugify(name);
      const {
        data,
        error
      } = await supabase.from("categories").insert({
        name,
        slug
      }).select().single();
      if (error) throw error;
      toast.success("Category added");
      setForm((f) => ({
        ...f,
        category_id: data.id
      }));
      setNewCatName("");
      setAddingCat(false);
      qc.invalidateQueries({
        queryKey: ["admin", "categories"]
      });
      qc.invalidateQueries({
        queryKey: ["categories"]
      });
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
        display_author_name: form.display_author_name.trim() || null
      };
      if (editingId) {
        const {
          data: row2,
          error: error2
        } = await supabase.from("content").update({
          ...payload,
          published_at: form.status === "published" ? (/* @__PURE__ */ new Date()).toISOString() : null
        }).eq("id", editingId).select("id, title, status").single();
        if (error2) throw error2;
        return {
          row: row2,
          isNew: false
        };
      }
      const {
        data: row,
        error
      } = await supabase.from("content").insert({
        ...payload,
        author_id: user.id,
        published_at: form.status === "published" ? (/* @__PURE__ */ new Date()).toISOString() : null
      }).select("id, title, status").single();
      if (error) throw error;
      return {
        row,
        isNew: true
      };
    },
    onSuccess: ({
      row,
      isNew
    }) => {
      toast.success(isNew ? "Content saved" : "Content updated");
      const wasPublished = row?.status === "published";
      const newId = row?.id ?? null;
      const newTitle = row?.title ?? "";
      resetForm();
      qc.invalidateQueries({
        queryKey: ["admin", "content"]
      });
      qc.invalidateQueries({
        queryKey: ["content"]
      });
      if (newId) {
        syncContentF({
          data: {
            contentId: newId
          }
        }).catch(() => {
        });
      }
      if (isNew && wasPublished && newId) {
        setPublishedModal({
          id: newId,
          title: newTitle
        });
      }
    },
    onError: (e) => toast.error(e.message)
  });
  const mkLesson = () => ({
    id: null,
    localId: "new-" + ++_localIdCounter,
    title: "",
    content_type: "video",
    video_url: "",
    pdf_url: "",
    text_content: "",
    description: "",
    lessonVideoSource: "youtube"
  });
  const mkModule = () => ({
    id: null,
    localId: "mod-" + ++_localIdCounter,
    title: "",
    description: "",
    lessons: [mkLesson()]
  });
  const addMod = () => setCourseForm((f) => ({
    ...f,
    modules: [...f.modules, mkModule()]
  }));
  const removeMod = (i) => setCourseForm((f) => ({
    ...f,
    modules: f.modules.filter((_, x) => x !== i)
  }));
  const moveMod = (i, dir) => setCourseForm((f) => {
    const a = [...f.modules];
    [a[i], a[i + dir]] = [a[i + dir], a[i]];
    return {
      ...f,
      modules: a
    };
  });
  const updateMod = (i, patch) => setCourseForm((f) => {
    const a = [...f.modules];
    a[i] = {
      ...a[i],
      ...patch
    };
    return {
      ...f,
      modules: a
    };
  });
  const addLesson = (mi) => setCourseForm((f) => {
    const m = [...f.modules];
    m[mi] = {
      ...m[mi],
      lessons: [...m[mi].lessons, mkLesson()]
    };
    return {
      ...f,
      modules: m
    };
  });
  const removeLesson = (mi, li) => setCourseForm((f) => {
    const m = [...f.modules];
    m[mi] = {
      ...m[mi],
      lessons: m[mi].lessons.filter((_, x) => x !== li)
    };
    return {
      ...f,
      modules: m
    };
  });
  const moveLesson = (mi, li, dir) => setCourseForm((f) => {
    const m = [...f.modules];
    const ls = [...m[mi].lessons];
    [ls[li], ls[li + dir]] = [ls[li + dir], ls[li]];
    m[mi] = {
      ...m[mi],
      lessons: ls
    };
    return {
      ...f,
      modules: m
    };
  });
  const updateLesson = (mi, li, patch) => setCourseForm((f) => {
    const m = [...f.modules];
    const ls = [...m[mi].lessons];
    ls[li] = {
      ...ls[li],
      ...patch
    };
    m[mi] = {
      ...m[mi],
      lessons: ls
    };
    return {
      ...f,
      modules: m
    };
  });
  const saveCourseMut = useMutation({
    mutationFn: async () => {
      if (!courseForm.title.trim()) throw new Error("Course title is required");
      return saveCourseF({
        data: {
          id: editingCourseId,
          ...courseForm,
          modules: courseForm.modules.map((m, mi) => ({
            id: m.id,
            title: m.title,
            description: m.description || null,
            order_index: mi,
            lessons: m.lessons.map((l, li) => ({
              id: l.id,
              title: l.title,
              description: l.description || null,
              content_type: l.content_type,
              video_url: l.video_url || null,
              pdf_url: l.pdf_url || null,
              text_content: l.text_content || null,
              order_index: li
            }))
          }))
        }
      });
    },
    onSuccess: (result) => {
      toast.success(editingCourseId ? "Course updated!" : "Course saved!");
      const savedCourseId = result?.courseId ?? editingCourseId;
      setCourseForm(emptyCourseForm);
      setEditingCourseId(null);
      setContentMode("lesson");
      qc.invalidateQueries({
        queryKey: ["admin", "courses"]
      });
      if (savedCourseId) {
        syncCourseF({
          data: {
            courseId: savedCourseId
          }
        }).catch(() => {
        });
      }
      if (!editingCourseId && courseForm.status === "published" && result?.courseId) {
        setPublishedModal({
          id: null,
          title: courseForm.title,
          contentUrl: `/course/${result.courseId}`
        });
      }
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col md:flex-row bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AdminSidebar, { active: "content" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 pt-14 px-4 pb-4 sm:px-6 sm:pb-6 md:p-10 overflow-x-hidden min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-extrabold mb-1", children: isAuthorOnly ? "Upload content" : "Upload content" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-8", children: isAuthorOnly ? "Upload a new lesson. It will appear in your Library once saved." : "Upload a new lesson. Find and manage all content in the Library." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3", children: "What are you creating?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [{
          mode: "lesson",
          label: "Single Lesson",
          desc: "One video, PDF, or text lesson",
          Icon: Plus
        }, {
          mode: "course",
          label: "Course with Modules",
          desc: "Multiple modules with lessons inside",
          Icon: GraduationCap
        }].map(({
          mode,
          label,
          desc,
          Icon
        }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setContentMode(mode), className: "rounded-xl border-2 p-4 text-left transition-all flex items-start gap-3 " + (contentMode === mode ? "border-gold bg-gold/5" : "border-border hover:border-gold/40"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg shrink-0 " + (contentMode === mode ? "bg-gold/20 text-gold" : "bg-muted text-muted-foreground"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-sm mb-0.5", children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: desc })
          ] })
        ] }, mode)) })
      ] }),
      contentMode === "lesson" && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-xl bg-card border border-border p-4 sm:p-6 shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-lg font-bold flex items-center gap-2", children: [
            editingId ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-5 w-5 text-gold" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-5 w-5 text-gold" }),
            editingId ? "Edit lesson" : "New lesson"
          ] }),
          editingId && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "ghost", size: "sm", onClick: resetForm, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1" }),
            " Cancel edit"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Title *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.title, onChange: (e) => setForm({
              ...form,
              title: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 4, value: form.description, onChange: (e) => setForm({
              ...form,
              description: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "display_author_name", children: [
              "Author Display Name",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-xs font-normal text-muted-foreground", children: "(optional — overrides your profile name)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "display_author_name", placeholder: "e.g. Dr Ryan Rieder", value: form.display_author_name, onChange: (e) => setForm({
              ...form,
              display_author_name: e.target.value
            }), maxLength: 120 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Leave blank to show your profile name. Enter a name here to attribute this content to someone else." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm", value: addingCat ? "__add__" : form.category_id, onChange: (e) => {
              if (e.target.value === "__add__") {
                setAddingCat(true);
              } else {
                setAddingCat(false);
                setForm({
                  ...form,
                  category_id: e.target.value
                });
              }
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select category…" }),
              (categoriesQ.data ?? []).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.id, children: c.name }, c.id)),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "__add__", children: "+ Add new category…" })
            ] }),
            addingCat && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-2 pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { autoFocus: true, placeholder: "New category name", value: newCatName, onChange: (e) => setNewCatName(e.target.value), onKeyDown: (e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void onAddCategory();
                }
              }, className: "flex-1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", size: "sm", onClick: onAddCategory, disabled: savingCat || !newCatName.trim(), className: "flex-1 sm:flex-none", children: savingCat ? "…" : "Save" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", size: "sm", variant: "ghost", onClick: () => {
                  setAddingCat(false);
                  setNewCatName("");
                }, className: "flex-1 sm:flex-none", children: "Cancel" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm", value: form.status, onChange: (e) => setForm({
              ...form,
              status: e.target.value
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "published", children: "Published" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "draft", children: "Draft" }),
              isSuperAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "archived", children: "Archived" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Content type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm", value: form.content_type, onChange: (e) => setForm({
              ...form,
              content_type: e.target.value
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Select type —" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "video", children: "Video" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "pdf", children: "PDF" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "book", children: "Book" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Video source" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex rounded-md border border-border bg-muted p-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
                setVideoSource("youtube");
                setForm((f) => ({
                  ...f,
                  video_url: ""
                }));
              }, className: `px-3 py-1.5 text-sm rounded ${videoSource === "youtube" ? "bg-card text-foreground shadow-sm font-medium" : "text-muted-foreground"}`, children: "YouTube URL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
                setVideoSource("upload");
                setForm((f) => ({
                  ...f,
                  video_url: ""
                }));
              }, className: `px-3 py-1.5 text-sm rounded ${videoSource === "upload" ? "bg-card text-foreground shadow-sm font-medium" : "text-muted-foreground"}`, children: "Upload Video File" })
            ] }),
            videoSource === "youtube" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "https://youtu.be/…", value: form.video_url, onChange: (e) => setForm({
              ...form,
              video_url: e.target.value
            }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileDropzone, { label: "Upload video file", accept: "video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm", uploaded: !!form.video_url, hint: "Drag and drop or click to select an MP4, MOV, or WebM file", onFile: async (file) => {
                try {
                  const url = await uploadContentFile("video", file);
                  setForm((f) => ({
                    ...f,
                    video_url: url
                  }));
                  toast.success("Video uploaded");
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : "Upload failed");
                }
              } }),
              form.video_url && /* @__PURE__ */ jsxRuntimeExports.jsx("video", { src: form.video_url, controls: true, className: "w-full max-h-56 rounded-md border border-border bg-black" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-foreground", children: "Use custom thumbnail instead" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "By default we use the YouTube thumbnail." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: useCustomThumb, onCheckedChange: setUseCustomThumb })
            ] }),
            !useCustomThumb && ytThumb && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: ytThumb, alt: "YouTube thumbnail preview", className: "h-24 rounded-md border border-border object-cover" }) }),
            useCustomThumb && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileDropzone, { label: "Upload custom thumbnail", accept: "image/*", uploaded: !!form.thumbnail_url, hint: "JPG or PNG, 16:9 recommended", onFile: async (file) => {
                try {
                  const url = await uploadContentFile("thumbnail", file);
                  setForm((f) => ({
                    ...f,
                    thumbnail_url: url
                  }));
                  toast.success("Thumbnail uploaded");
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : "Upload failed");
                }
              } }),
              form.thumbnail_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: form.thumbnail_url, alt: "Custom thumbnail", className: "h-24 rounded-md border border-border object-cover" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "PDF" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileDropzone, { label: "Upload PDF", accept: "application/pdf", uploaded: !!form.pdf_url, hint: "Drag and drop or click to select a PDF", onFile: async (file) => {
              try {
                const url = await uploadContentFile("pdf", file);
                setForm((f) => ({
                  ...f,
                  pdf_url: url
                }));
                toast.success("PDF uploaded");
              } catch (e) {
                toast.error(e instanceof Error ? e.message : "Upload failed");
              }
            } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
              "Notes & Text Content ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-normal text-muted-foreground", children: "(optional)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 5, placeholder: "Add supplementary notes, instructions, or text content that members will see alongside the video/PDF…", value: form.text_content ?? "", onChange: (e) => setForm({
              ...form,
              text_content: e.target.value
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "This text appears below the video on the member lesson page." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end mt-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => save.mutate(), disabled: save.isPending, className: "w-full sm:w-auto bg-gold text-gold-foreground hover:bg-gold/90 h-11 inline-flex items-center gap-2", children: [
          save.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
          save.isPending ? "Saving…" : editingId ? "Update lesson" : "Save lesson"
        ] }) })
      ] }),
      contentMode === "course" && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-xl bg-card border border-border p-4 sm:p-6 shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-lg font-bold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "h-5 w-5 text-gold" }),
            editingCourseId ? "Edit course" : "New course"
          ] }),
          editingCourseId && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: () => {
            setCourseForm(emptyCourseForm);
            setEditingCourseId(null);
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1" }),
            " Cancel edit"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Course title *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: courseForm.title, onChange: (e) => setCourseForm((f) => ({
              ...f,
              title: e.target.value
            })), placeholder: "e.g. New Patient Conversion Mastery" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 3, value: courseForm.description, onChange: (e) => setCourseForm((f) => ({
              ...f,
              description: e.target.value
            })) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Author Display Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: courseForm.display_author_name, onChange: (e) => setCourseForm((f) => ({
              ...f,
              display_author_name: e.target.value
            })) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm", value: courseForm.category_id, onChange: (e) => setCourseForm((f) => ({
              ...f,
              category_id: e.target.value
            })), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select category…" }),
              (categoriesQ.data ?? []).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.id, children: c.name }, c.id))
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm", value: courseForm.status, onChange: (e) => setCourseForm((f) => ({
              ...f,
              status: e.target.value
            })), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "published", children: "Published" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "draft", children: "Draft" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Course thumbnail" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileDropzone, { label: "Upload thumbnail", accept: "image/*", uploaded: !!courseForm.thumbnail_url, hint: "JPG or PNG, 16:9 recommended", onFile: async (file) => {
              try {
                const url = await uploadContentFile("thumbnail", file);
                setCourseForm((f) => ({
                  ...f,
                  thumbnail_url: url
                }));
                toast.success("Thumbnail uploaded");
              } catch (e) {
                toast.error("Upload failed");
              }
            } }),
            courseForm.thumbnail_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: courseForm.thumbnail_url, alt: "", className: "h-20 rounded-md border border-border object-cover mt-2" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display font-bold mb-3", children: [
            "Modules (",
            courseForm.modules.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: courseForm.modules.map((mod, mi) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-background p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold text-muted-foreground", children: [
                "Module ",
                mi + 1
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => moveMod(mi, -1), disabled: mi === 0, className: "p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => moveMod(mi, 1), disabled: mi === courseForm.modules.length - 1, className: "p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeMod(mi), className: "p-1 text-destructive hover:text-destructive/80 rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "mb-3", placeholder: "Module title", value: mod.title, onChange: (e) => updateMod(mi, {
              title: e.target.value
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: mod.lessons.map((lesson, li) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-start p-3 rounded-lg bg-muted/40 border border-border/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "h-4 w-4 text-muted-foreground mt-2.5 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Lesson " + (li + 1) + " title", value: lesson.title, onChange: (e) => updateLesson(mi, li, {
                  title: e.target.value
                }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex rounded-md border border-border bg-muted p-0.5 text-xs", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => updateLesson(mi, li, {
                        lessonVideoSource: "youtube",
                        video_url: ""
                      }), className: "px-2.5 py-1 rounded " + ((lesson.lessonVideoSource ?? "youtube") === "youtube" ? "bg-card text-foreground shadow-sm font-medium" : "text-muted-foreground"), children: "YouTube URL" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => updateLesson(mi, li, {
                        lessonVideoSource: "upload",
                        video_url: ""
                      }), className: "px-2.5 py-1 rounded " + ((lesson.lessonVideoSource ?? "youtube") === "upload" ? "bg-card text-foreground shadow-sm font-medium" : "text-muted-foreground"), children: "Upload File" })
                    ] }) }),
                    (lesson.lessonVideoSource ?? "youtube") === "youtube" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "YouTube URL (optional)", value: lesson.video_url, onChange: (e) => updateLesson(mi, li, {
                      video_url: e.target.value
                    }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FileDropzone, { label: "Upload video file", accept: "video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm", uploaded: !!lesson.video_url, hint: "MP4, MOV, or WebM", onFile: async (file) => {
                        try {
                          const url = await uploadContentFile("video", file);
                          updateLesson(mi, li, {
                            video_url: url
                          });
                          toast.success("Video uploaded");
                        } catch (e) {
                          toast.error("Upload failed");
                        }
                      } }),
                      lesson.video_url && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-green-600", children: "✓ Video uploaded" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FileDropzone, { label: "PDF attachment (optional)", accept: "application/pdf", uploaded: !!lesson.pdf_url, hint: "PDF file", onFile: async (file) => {
                      try {
                        const url = await uploadContentFile("pdf", file);
                        updateLesson(mi, li, {
                          pdf_url: url
                        });
                        toast.success("PDF uploaded");
                      } catch (e) {
                        toast.error("Upload failed");
                      }
                    } }),
                    lesson.pdf_url && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-green-600", children: "✓ PDF uploaded" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 2, placeholder: "Notes or text content (optional)…", value: lesson.text_content, onChange: (e) => updateLesson(mi, li, {
                    text_content: e.target.value
                  }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5 shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => moveLesson(mi, li, -1), disabled: li === 0, className: "p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3 w-3" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => moveLesson(mi, li, 1), disabled: li === mod.lessons.length - 1, className: "p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeLesson(mi, li), className: "p-1 text-destructive hover:text-destructive/80 rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }) })
              ] })
            ] }, lesson.localId)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: () => addLesson(mi), className: "mt-2 w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5 mr-1.5" }),
              "Add Lesson"
            ] })
          ] }, mod.localId)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", onClick: addMod, className: "w-full mt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
            "Add Module"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => saveCourseMut.mutate(), disabled: saveCourseMut.isPending, className: "w-full sm:w-auto bg-gold text-gold-foreground hover:bg-gold/90 h-11 inline-flex items-center gap-2", children: [
          saveCourseMut.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
          saveCourseMut.isPending ? "Saving…" : editingCourseId ? "Update course" : "Save course"
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PublishNotificationModal, { open: publishedModal !== null, contentId: publishedModal?.id ?? null, contentUrl: publishedModal?.contentUrl, title: publishedModal?.title ?? "", onClose: () => setPublishedModal(null) })
  ] });
}
export {
  AdminPage as component
};
