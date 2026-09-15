import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-IF66mSk9.mjs";
import { B as Button, c as cn, b as buttonVariants } from "./button-BXrfXN_b.mjs";
import { I as Input } from "./input-DwaGuH4D.mjs";
import { R as Root2, P as Portal2, C as Content2, T as Title2, D as Description2, a as Cancel, A as Action, O as Overlay2 } from "../_libs/radix-ui__react-alert-dialog.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { A as AdminSidebar } from "./AdminSidebar-B6Sw1hS_.mjs";
import { P as PublishNotificationModal, p as publishAllDraftCourses, d as deleteCourse, l as listAdminCourses } from "./courses.functions-ByKUMNqi.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { h as Route$3 } from "./router-QLVMFfDU.mjs";
import "../_libs/seroval.mjs";
import { N as Library, w as GraduationCap, c as Search, a8 as BookCheck, H as Pencil, L as LoaderCircle, a9 as RotateCcw, aa as Archive, ab as Trash2, ac as ChevronLeft, r as ChevronRight } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "../_libs/isbot.mjs";
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
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
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
import "./dialog-pXddDSBH.mjs";
import "./notify.functions-CrRd-XzN.mjs";
import "./createSsrRpc-D1HIuwD_.mjs";
import "./server-DAhjTOZR.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-CINWQ1Vb.mjs";
import "../_libs/zod.mjs";
const AlertDialog = Root2;
const AlertDialogPortal = Portal2;
const AlertDialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay2,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = Overlay2.displayName;
const AlertDialogContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content2,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = Content2.displayName;
const AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title2,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = Title2.displayName;
const AlertDialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description2,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = Description2.displayName;
const AlertDialogAction = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Action, { ref, className: cn(buttonVariants(), className), ...props }));
AlertDialogAction.displayName = Action.displayName;
const AlertDialogCancel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Cancel,
  {
    ref,
    className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
    ...props
  }
));
AlertDialogCancel.displayName = Cancel.displayName;
const LESSONS_PER_PAGE = 20;
const COURSES_PER_PAGE = 10;
function LibraryPage() {
  const qc = useQueryClient();
  const {
    user,
    roles
  } = Route$3.useRouteContext();
  const isAuthorOnly = roles.includes("author") && !roles.includes("super_admin");
  const isSuperAdmin = roles.includes("super_admin");
  const {
    tab,
    page
  } = Route$3.useSearch();
  const navigate = useNavigate({
    from: Route$3.fullPath
  });
  const setTab = (t) => navigate({
    search: () => ({
      tab: t,
      page: 1
    }),
    replace: true
  });
  const setPage = (p) => navigate({
    search: (prev) => ({
      ...prev,
      page: p
    }),
    replace: true
  });
  const [lessonStatusFilter, setLessonStatusFilter] = reactExports.useState("all");
  const [courseStatusFilter, setCourseStatusFilter] = reactExports.useState("all");
  const [search, setSearch] = reactExports.useState("");
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const [publishAllOpen, setPublishAllOpen] = reactExports.useState(false);
  const [publishAllCoursesOpen, setPublishAllCoursesOpen] = reactExports.useState(false);
  const [deleteCourseTarget, setDeleteCourseTarget] = reactExports.useState(null);
  const [notifyLesson, setNotifyLesson] = reactExports.useState(null);
  const listCoursesFn = useServerFn(listAdminCourses);
  const deleteCourseServer = useServerFn(deleteCourse);
  const publishAllCoursesFn = useServerFn(publishAllDraftCourses);
  const contentQ = useQuery({
    queryKey: ["admin", "content", isAuthorOnly ? user.id : "all"],
    queryFn: async () => {
      let q = supabase.from("content").select("*, category:categories(name)").order("created_at", {
        ascending: false
      });
      if (isAuthorOnly) q = q.eq("author_id", user.id);
      const {
        data,
        error
      } = await q;
      if (error) throw error;
      return data;
    }
  });
  const coursesQ = useQuery({
    queryKey: ["admin", "courses"],
    queryFn: () => listCoursesFn()
  });
  const lessonCounts = reactExports.useMemo(() => {
    const rows = contentQ.data ?? [];
    return {
      all: rows.length,
      published: rows.filter((r) => r.status === "published").length,
      draft: rows.filter((r) => r.status === "draft").length,
      archived: rows.filter((r) => r.status === "archived").length
    };
  }, [contentQ.data]);
  const filteredLessons = reactExports.useMemo(() => {
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
  const lessonPageRows = filteredLessons.slice((lessonPage - 1) * LESSONS_PER_PAGE, lessonPage * LESSONS_PER_PAGE);
  const lessonStart = filteredLessons.length === 0 ? 0 : (lessonPage - 1) * LESSONS_PER_PAGE + 1;
  const lessonEnd = Math.min(lessonPage * LESSONS_PER_PAGE, filteredLessons.length);
  const allCourses = coursesQ.data?.courses ?? [];
  const courseCounts = reactExports.useMemo(() => ({
    all: allCourses.length,
    published: allCourses.filter((c) => c.status === "published").length,
    draft: allCourses.filter((c) => c.status === "draft").length,
    archived: allCourses.filter((c) => c.status === "archived").length
  }), [allCourses]);
  const filteredCourses = reactExports.useMemo(() => {
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
  const coursePageRows = filteredCourses.slice((coursePage - 1) * COURSES_PER_PAGE, coursePage * COURSES_PER_PAGE);
  const courseStart = filteredCourses.length === 0 ? 0 : (coursePage - 1) * COURSES_PER_PAGE + 1;
  const courseEnd = Math.min(coursePage * COURSES_PER_PAGE, filteredCourses.length);
  const setStatus = useMutation({
    mutationFn: async ({
      id,
      status,
      title
    }) => {
      const patch = status === "published" ? {
        status,
        published_at: (/* @__PURE__ */ new Date()).toISOString()
      } : {
        status
      };
      const {
        error
      } = await supabase.from("content").update(patch).eq("id", id);
      if (error) throw error;
      return {
        id,
        status,
        title
      };
    },
    onSuccess: (result) => {
      if (result.status === "published") {
        setNotifyLesson({
          id: result.id,
          title: result.title
        });
      } else {
        toast.success("Content archived");
      }
      qc.invalidateQueries({
        queryKey: ["admin", "content"]
      });
      qc.invalidateQueries({
        queryKey: ["content"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const del = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await supabase.from("content").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Content deleted");
      setDeleteTarget(null);
      qc.invalidateQueries({
        queryKey: ["admin", "content"]
      });
      qc.invalidateQueries({
        queryKey: ["content"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const publishAll = useMutation({
    mutationFn: async () => {
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const {
        error
      } = await supabase.from("content").update({
        status: "published",
        published_at: now
      }).eq("status", "draft");
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(`${lessonCounts.draft} draft${lessonCounts.draft !== 1 ? "s" : ""} published`);
      setPublishAllOpen(false);
      qc.invalidateQueries({
        queryKey: ["admin", "content"]
      });
      qc.invalidateQueries({
        queryKey: ["content"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const publishAllCoursesMut = useMutation({
    mutationFn: () => publishAllCoursesFn({
      data: void 0
    }),
    onSuccess: (result) => {
      const r = result;
      toast.success(`${r.published} draft course${r.published !== 1 ? "s" : ""} published`);
      setPublishAllCoursesOpen(false);
      qc.invalidateQueries({
        queryKey: ["admin", "courses"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const delCourseMut = useMutation({
    mutationFn: (id) => deleteCourseServer({
      data: {
        id
      }
    }),
    onSuccess: () => {
      toast.success("Course deleted");
      setDeleteCourseTarget(null);
      qc.invalidateQueries({
        queryKey: ["admin", "courses"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const statusFilter = tab === "lessons" ? lessonStatusFilter : courseStatusFilter;
  const setStatusFilter = (v) => {
    setPage(1);
    if (tab === "lessons") setLessonStatusFilter(v);
    else setCourseStatusFilter(v);
  };
  const activeCounts = tab === "lessons" ? lessonCounts : courseCounts;
  const filterTabs = [{
    key: "all",
    label: "All",
    count: activeCounts.all
  }, {
    key: "published",
    label: "Published",
    count: activeCounts.published
  }, {
    key: "draft",
    label: "Draft",
    count: activeCounts.draft
  }, {
    key: "archived",
    label: "Archived",
    count: activeCounts.archived
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col md:flex-row bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AdminSidebar, { active: "library" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 pt-14 px-4 pb-4 sm:px-6 sm:pb-6 md:p-10 overflow-x-hidden min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Library, { className: "h-7 w-7 text-gold" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-extrabold", children: isAuthorOnly ? "My Library" : "Content Library" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: isAuthorOnly ? "All your uploaded lessons. Click Edit to make changes." : "All lessons and courses. Search, filter, edit, archive or delete content." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex flex-wrap rounded-lg border border-border bg-muted p-1 mb-6 max-w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setTab("lessons"), className: `flex items-center gap-2 px-4 py-2 text-sm rounded-md font-medium transition-colors ${tab === "lessons" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Library, { className: "h-4 w-4" }),
          "Lessons",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "opacity-60 text-xs", children: [
            "(",
            contentQ.data?.length ?? "…",
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setTab("courses"), className: `flex items-center gap-2 px-4 py-2 text-sm rounded-md font-medium transition-colors ${tab === "courses" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "h-4 w-4" }),
          "Courses",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "opacity-60 text-xs", children: [
            "(",
            allCourses.length,
            ")"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-3 mb-5 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: tab === "lessons" ? "Search lessons by title…" : "Search courses by title…", value: search, onChange: (e) => {
            setSearch(e.target.value);
            setPage(1);
          }, className: "pl-9" })
        ] }),
        tab === "lessons" && isSuperAdmin && lessonCounts.draft > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", onClick: () => setPublishAllOpen(true), className: "bg-success hover:bg-success/90 text-success-foreground inline-flex items-center gap-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookCheck, { className: "h-4 w-4" }),
          "Publish all drafts (",
          lessonCounts.draft,
          ")"
        ] }),
        tab === "courses" && isSuperAdmin && courseCounts.draft > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", onClick: () => setPublishAllCoursesOpen(true), className: "bg-success hover:bg-success/90 text-success-foreground inline-flex items-center gap-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookCheck, { className: "h-4 w-4" }),
          "Publish all draft courses (",
          courseCounts.draft,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex rounded-md border border-border bg-muted p-1 overflow-x-auto max-w-full shrink-0", children: filterTabs.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setStatusFilter(t.key), className: `px-3 py-1.5 text-xs rounded font-medium transition-colors whitespace-nowrap ${statusFilter === t.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`, children: [
          t.label,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "opacity-60", children: [
            "(",
            t.count,
            ")"
          ] })
        ] }, t.key)) })
      ] }),
      tab === "lessons" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        contentQ.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 rounded-xl bg-muted animate-pulse" }, i)) }),
        !contentQ.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl bg-card border border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm min-w-[600px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Title" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
              lessonPageRows.map((c) => {
                const statusClass = c.status === "published" ? "bg-success/15 text-success" : c.status === "archived" ? "bg-gold/15 text-gold" : "bg-muted text-muted-foreground";
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border hover:bg-muted/30 transition-colors", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium max-w-[220px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block truncate", title: c.title, children: c.title }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: c.category?.name ?? "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: c.content_type ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-2 py-0.5 rounded-full capitalize ${c.content_type === "book" ? "bg-gold/15 text-gold" : c.content_type === "pdf" ? "bg-blue-500/15 text-blue-500" : "bg-primary/10 text-primary"}`, children: c.content_type }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "—" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-2 py-0.5 rounded-full capitalize ${statusClass}`, children: c.status }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground text-xs whitespace-nowrap", children: new Date(c.created_at).toLocaleDateString() }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => {
                      window.location.href = "/admin?edit=" + c.id;
                    }, "aria-label": "Edit", title: "Edit", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
                    c.status === "archived" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => setStatus.mutate({
                      id: c.id,
                      status: "published",
                      title: c.title
                    }), disabled: setStatus.isPending, "aria-label": "Restore", title: "Restore to published", children: setStatus.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-4 w-4" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => setStatus.mutate({
                      id: c.id,
                      status: "archived",
                      title: c.title
                    }), disabled: setStatus.isPending, "aria-label": "Archive", title: "Archive", children: setStatus.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "h-4 w-4" }) }),
                    isSuperAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => setDeleteTarget({
                      id: c.id,
                      title: c.title
                    }), "aria-label": "Delete", className: "text-destructive hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
                  ] }) })
                ] }, c.id);
              }),
              lessonPageRows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "px-4 py-14 text-center text-muted-foreground", children: search.trim() ? `No results for "${search}"` : "No lessons in this view." }) })
            ] })
          ] }) }) }),
          filteredLessons.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-4 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Showing ",
              lessonStart,
              "–",
              lessonEnd,
              " of ",
              filteredLessons.length,
              " lesson",
              filteredLessons.length !== 1 ? "s" : ""
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: () => setPage(lessonPage - 1), disabled: lessonPage <= 1, className: "gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" }),
                " Previous"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-2", children: [
                "Page ",
                lessonPage,
                " of ",
                lessonTotalPages
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: () => setPage(lessonPage + 1), disabled: lessonPage >= lessonTotalPages, className: "gap-1", children: [
                "Next ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
              ] })
            ] })
          ] })
        ] })
      ] }),
      tab === "courses" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        coursesQ.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 rounded-xl bg-muted animate-pulse" }, i)) }),
        !coursesQ.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl bg-card border border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm min-w-[500px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Title" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Structure" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
              coursePageRows.map((c) => {
                const statusClass = c.status === "published" ? "bg-success/15 text-success" : c.status === "archived" ? "bg-gold/15 text-gold" : "bg-muted text-muted-foreground";
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border hover:bg-muted/30 transition-colors", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium max-w-[200px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block truncate", title: c.title, children: c.title }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: c.category_name ?? "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-xs text-muted-foreground whitespace-nowrap", children: [
                    c.module_count,
                    " module",
                    c.module_count !== 1 ? "s" : "",
                    " • ",
                    c.lesson_count,
                    " lesson",
                    c.lesson_count !== 1 ? "s" : ""
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-2 py-0.5 rounded-full capitalize ${statusClass}`, children: c.status }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground text-xs whitespace-nowrap", children: new Date(c.created_at).toLocaleDateString() }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => {
                      window.location.href = "/admin?editCourse=" + c.id;
                    }, "aria-label": "Edit", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
                    isSuperAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => setDeleteCourseTarget({
                      id: c.id,
                      title: c.title
                    }), className: "text-destructive hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
                  ] }) })
                ] }, c.id);
              }),
              coursePageRows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "px-4 py-14 text-center text-muted-foreground", children: search.trim() ? `No results for "${search}"` : "No courses in this view." }) })
            ] })
          ] }) }) }),
          filteredCourses.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-4 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Showing ",
              courseStart,
              "–",
              courseEnd,
              " of ",
              filteredCourses.length,
              " course",
              filteredCourses.length !== 1 ? "s" : ""
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: () => setPage(coursePage - 1), disabled: coursePage <= 1, className: "gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" }),
                " Previous"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-2", children: [
                "Page ",
                coursePage,
                " of ",
                courseTotalPages
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: () => setPage(coursePage + 1), disabled: coursePage >= courseTotalPages, className: "gap-1", children: [
                "Next ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
              ] })
            ] })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: publishAllOpen, onOpenChange: (o) => {
      if (!o) setPublishAllOpen(false);
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Publish all drafts?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
          "Are you sure you want to publish all ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: lessonCounts.draft }),
          " draft",
          lessonCounts.draft !== 1 ? " lessons" : " lesson",
          "? They will immediately become visible to all members. No notifications will be sent — use the Notifications section to announce them."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { disabled: publishAll.isPending, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { disabled: publishAll.isPending, onClick: (e) => {
          e.preventDefault();
          publishAll.mutate();
        }, className: "bg-success text-success-foreground hover:bg-success/90", children: publishAll.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
          "Publishing…"
        ] }) : `Publish ${lessonCounts.draft} draft${lessonCounts.draft !== 1 ? "s" : ""}` })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: deleteTarget !== null, onOpenChange: (o) => {
      if (!o) setDeleteTarget(null);
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete content?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
          'Are you sure you want to permanently delete "',
          deleteTarget?.title,
          '"? This cannot be undone.'
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { disabled: del.isPending, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { disabled: del.isPending, onClick: (e) => {
          e.preventDefault();
          if (deleteTarget) del.mutate(deleteTarget.id);
        }, className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: del.isPending ? "Deleting…" : "Delete permanently" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: publishAllCoursesOpen, onOpenChange: (o) => {
      if (!o) setPublishAllCoursesOpen(false);
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Publish all draft courses?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
          "Are you sure you want to publish all ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: courseCounts.draft }),
          " draft course",
          courseCounts.draft !== 1 ? "s" : "",
          "? They will immediately become visible to all members. No notifications will be sent — use the Notifications section to announce them."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { disabled: publishAllCoursesMut.isPending, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { disabled: publishAllCoursesMut.isPending, onClick: (e) => {
          e.preventDefault();
          publishAllCoursesMut.mutate();
        }, className: "bg-success text-success-foreground hover:bg-success/90", children: publishAllCoursesMut.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
          "Publishing…"
        ] }) : `Publish ${courseCounts.draft} course${courseCounts.draft !== 1 ? "s" : ""}` })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PublishNotificationModal, { contentId: notifyLesson?.id ?? null, title: notifyLesson?.title ?? "", open: notifyLesson !== null, onClose: () => setNotifyLesson(null) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: deleteCourseTarget !== null, onOpenChange: (o) => {
      if (!o) setDeleteCourseTarget(null);
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete course?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
          'Permanently delete "',
          deleteCourseTarget?.title,
          '" and all its modules, lessons and member progress? This cannot be undone.'
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { disabled: delCourseMut.isPending, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { disabled: delCourseMut.isPending, onClick: (e) => {
          e.preventDefault();
          if (deleteCourseTarget) delCourseMut.mutate(deleteCourseTarget.id);
        }, className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: delCourseMut.isPending ? "Deleting…" : "Delete permanently" })
      ] })
    ] }) })
  ] });
}
export {
  LibraryPage as component
};
