import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { c as checkAndIssueCourse, d as debugCourseProgress } from "./certificates.functions-DY-Kix5X.mjs";
import { s as supabase } from "./client-IF66mSk9.mjs";
import { M as MemberNav } from "./MemberNav-C9W_HKgq.mjs";
import { c as confetti } from "../_libs/canvas-confetti.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog-pXddDSBH.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { R as Root, C as CollapsibleTrigger$1, a as CollapsibleContent$1 } from "../_libs/radix-ui__react-collapsible.mjs";
import { f as Route$7 } from "./router-BgAMxlwC.mjs";
import "../_libs/seroval.mjs";
import { A as ArrowLeft, C as ChevronDown, X, M as Menu, F as FileText, D as Download, o as CircleCheck, L as LoaderCircle, a as Award, T as ArrowRight, B as BookOpen, P as Play, V as Facebook, f as Linkedin } from "../_libs/lucide-react.mjs";
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
import "./createSsrRpc-Bc62EJ78.mjs";
import "./server-BomfFVcN.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-dN1VnyDc.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/zod.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
function CourseCompleteModal({ open, onClose, courseTitle, certificateId }) {
  reactExports.useEffect(() => {
    if (!open) return;
    const end = Date.now() + 1200;
    const colors = ["#C9A24A", "#0B1B3A", "#ffffff"];
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 70, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 70, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 }, colors });
  }, [open]);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const fbMsg = `I just completed "${courseTitle}" with Dr Ryan Rieder on the DCPG Membership Portal! #ChiropracticGrowth #DCPG`;
  const liMsg = `Excited to share that I just completed "${courseTitle}" with Dr Ryan Rieder at DC Practice Growth! 🎓 Highly recommend for any chiropractor looking to grow their practice. #Chiropractic #PracticeGrowth #DCPracticeGrowth`;
  const shares = [
    {
      label: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(fbMsg)}`
    },
    {
      label: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(liMsg)}`
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md bg-card border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-2xl text-center text-foreground", children: "Course Complete! 🎉" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-center text-gold font-medium pt-1", children: courseTitle })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-sm text-muted-foreground", children: "Share your win" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-2", children: shares.map(({ label, icon: Icon, href }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          asChild: true,
          variant: "outline",
          className: "border-gold/40 text-foreground hover:bg-gold/10 hover:text-foreground",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href, target: "_blank", rel: "noopener noreferrer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 mr-2 text-gold" }),
            " ",
            label
          ] })
        },
        label
      )) }),
      certificateId && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => {
            console.log("[certificate] navigating to certificate:", certificateId);
            window.open(`/certificate/${certificateId}`, "_blank");
          },
          variant: "outline",
          className: "w-full border-gold text-gold hover:bg-gold/10 gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-4 w-4" }),
            "View Certificate"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => {
            window.location.href = "/dashboard";
          },
          className: "w-full bg-gold text-gold-foreground hover:bg-gold/90 mt-2",
          children: "Back to Dashboard"
        }
      )
    ] })
  ] }) });
}
const Collapsible = Root;
const CollapsibleTrigger = CollapsibleTrigger$1;
const CollapsibleContent = CollapsibleContent$1;
function youtubeEmbed(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (!m) return null;
  return `https://www.youtube.com/embed/${m[1]}?rel=0&modestbranding=1`;
}
function LessonIcon({
  type,
  completed
}) {
  if (completed) return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0 text-green-500" });
  if (type === "pdf") return /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 shrink-0 text-gold/70" });
  if (type === "text") return /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-4 w-4 shrink-0 text-gold/70" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-4 w-4 shrink-0 text-gold/70" });
}
function CoursePage() {
  const {
    id: courseId
  } = Route$7.useParams();
  const {
    user
  } = Route$7.useRouteContext();
  const qc = useQueryClient();
  const [activeLessonId, setActiveLessonId] = reactExports.useState(null);
  const [sidebarOpen, setSidebarOpen] = reactExports.useState(false);
  const [courseCompleteOpen, setCourseCompleteOpen] = reactExports.useState(false);
  const [earnedCertificateId, setEarnedCertificateId] = reactExports.useState(null);
  const checkAndIssueCourseF = useServerFn(checkAndIssueCourse);
  const debugCourseProgressF = useServerFn(debugCourseProgress);
  reactExports.useEffect(() => {
    window.__debugCert = () => debugCourseProgressF({
      data: {
        courseId
      }
    }).then((r) => {
      console.log("[debugCert]", r);
      return r;
    });
  }, [courseId, debugCourseProgressF]);
  const courseQ = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const db = supabase;
      const {
        data: course2,
        error: courseErr
      } = await db.from("courses").select("id,title,description,thumbnail_url,author_id").eq("id", courseId).single();
      if (courseErr) throw courseErr;
      const {
        data: rawModules,
        error: modErr
      } = await db.from("course_modules").select("id,title,order_index").eq("course_id", courseId).order("order_index", {
        ascending: true
      });
      if (modErr) throw modErr;
      const moduleIds = (rawModules ?? []).map((m) => m.id);
      let lessons = [];
      if (moduleIds.length > 0) {
        const {
          data: rawLessons,
          error: lessonErr
        } = await db.from("course_lessons").select("id,title,description,content_type,video_url,pdf_url,text_content,order_index,module_id").in("module_id", moduleIds).order("order_index", {
          ascending: true
        });
        if (lessonErr) throw lessonErr;
        lessons = rawLessons ?? [];
      }
      const lessonsByModule = lessons.reduce((acc, l) => {
        if (!acc[l.module_id]) acc[l.module_id] = [];
        acc[l.module_id].push(l);
        return acc;
      }, {});
      const modules = (rawModules ?? []).map((m) => ({
        ...m,
        lessons: lessonsByModule[m.id] ?? []
      }));
      let author = null;
      if (course2.author_id) {
        const {
          data: a
        } = await supabase.from("author_profiles_public").select("full_name,avatar_url").eq("id", course2.author_id).maybeSingle();
        author = a ?? null;
      }
      return {
        course: course2,
        modules,
        author
      };
    }
  });
  const progressQ = useQuery({
    queryKey: ["course-progress", courseId, user.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("course_progress").select("course_lesson_id").eq("user_id", user.id).eq("course_id", courseId);
      if (error) throw error;
      return new Set((data ?? []).map((r) => r.course_lesson_id));
    },
    enabled: !!courseQ.data
  });
  const completedCount0 = progressQ.data ? [...progressQ.data].length : 0;
  const certQ = useQuery({
    queryKey: ["course-cert", courseId, user.id],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("certificates").select("id").eq("user_id", user.id).eq("type", "course").eq("reference_id", courseId).maybeSingle();
      return data?.id ?? null;
    },
    enabled: !!progressQ.data && completedCount0 > 0,
    staleTime: 6e4
  });
  const allLessons = reactExports.useMemo(() => {
    if (!courseQ.data) return [];
    return courseQ.data.modules.flatMap((m) => m.lessons);
  }, [courseQ.data]);
  const completedIds = progressQ.data ?? /* @__PURE__ */ new Set();
  const totalLessons = allLessons.length;
  const completedCount = allLessons.filter((l) => completedIds.has(l.id)).length;
  const progressPct = totalLessons > 0 ? Math.round(completedCount / totalLessons * 100) : 0;
  const isComplete = totalLessons > 0 && completedCount >= totalLessons;
  const displayCertificateId = earnedCertificateId ?? certQ.data ?? null;
  const activeLesson = reactExports.useMemo(() => {
    if (!allLessons.length) return null;
    if (activeLessonId) return allLessons.find((l) => l.id === activeLessonId) ?? allLessons[0];
    return allLessons[0];
  }, [activeLessonId, allLessons]);
  const currentIndex = activeLesson ? allLessons.findIndex((l) => l.id === activeLesson.id) : -1;
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  reactExports.useEffect(() => {
    if (!allLessons.length || activeLessonId) return;
    if (!progressQ.data) return;
    const firstIncomplete = allLessons.find((l) => !progressQ.data.has(l.id));
    setActiveLessonId(firstIncomplete ? firstIncomplete.id : allLessons[0].id);
  }, [allLessons, progressQ.data, activeLessonId]);
  const markComplete = useMutation({
    mutationFn: async (lessonId) => {
      const {
        error
      } = await supabase.from("course_progress").upsert({
        user_id: user.id,
        course_id: courseId,
        course_lesson_id: lessonId,
        completed: true,
        completed_at: (/* @__PURE__ */ new Date()).toISOString()
      }, {
        onConflict: "user_id,course_lesson_id"
      });
      if (error) throw error;
    },
    onSuccess: (_data, lessonId) => {
      qc.invalidateQueries({
        queryKey: ["course-progress", courseId, user.id]
      });
      const newCompletedCount = completedCount + (completedIds.has(lessonId) ? 0 : 1);
      if (newCompletedCount >= totalLessons) {
        setCourseCompleteOpen(true);
        checkAndIssueCourseF({
          data: {
            courseId
          }
        }).then((result) => {
          console.log("[certificate] checkAndIssueCourse result:", result);
          if (result?.certificateId) setEarnedCertificateId(result.certificateId);
        }).catch((err) => {
          console.error("[certificate] checkAndIssueCourse error:", err);
        });
      } else if (nextLesson) {
        setActiveLessonId(nextLesson.id);
      }
    },
    onError: (e) => toast.error(e.message)
  });
  const course = courseQ.data?.course;
  const sidebarContent = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-sidebar-accent/30 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard", className: "inline-flex items-center text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground mb-3 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3.5 w-3.5 mr-1" }),
        " Back to library"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-bold text-sidebar-foreground leading-snug line-clamp-2", children: course?.title ?? "Loading…" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-sidebar-foreground/60 mb-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            completedCount,
            " / ",
            totalLessons,
            " complete"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            progressPct,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full rounded-full bg-sidebar-accent/40 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full bg-gold transition-all duration-500", style: {
          width: `${progressPct}%`
        } }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 overflow-y-auto py-2", children: (courseQ.data?.modules ?? []).map((mod) => {
      const modCompleted = mod.lessons.filter((l) => completedIds.has(l.id)).length;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Collapsible, { defaultOpen: true, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CollapsibleTrigger, { className: "w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-sidebar-accent/20 transition-colors group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/70 group-hover:text-sidebar-foreground pr-2 leading-snug", children: mod.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-sidebar-foreground/50", children: [
              modCompleted,
              "/",
              mod.lessons.length
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3.5 w-3.5 text-sidebar-foreground/50 transition-transform duration-200 group-data-[state=open]:rotate-180" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleContent, { children: mod.lessons.map((lesson) => {
          const isActive = activeLesson?.id === lesson.id;
          const isDone = completedIds.has(lesson.id);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
            setActiveLessonId(lesson.id);
            setSidebarOpen(false);
          }, className: `w-full flex items-start gap-2.5 px-4 py-2.5 text-left transition-colors ${isActive ? "bg-sidebar-accent/40 text-sidebar-foreground" : "hover:bg-sidebar-accent/20 text-sidebar-foreground/70 hover:text-sidebar-foreground"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LessonIcon, { type: lesson.content_type, completed: isDone }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs leading-snug flex-1 min-w-0", children: lesson.title }),
            isActive && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1.5 h-2 w-2 rounded-full bg-gold shrink-0", "aria-hidden": "true" })
          ] }, lesson.id);
        }) })
      ] }, mod.id);
    }) })
  ] });
  const lessonDone = activeLesson ? completedIds.has(activeLesson.id) : false;
  const embed = activeLesson ? youtubeEmbed(activeLesson.video_url) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(MemberNav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden sticky top-0 z-30 bg-background border-b border-border px-3 py-2 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSidebarOpen((o) => !o), className: "p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors", "aria-label": sidebarOpen ? "Close menu" : "Open menu", children: sidebarOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium truncate text-foreground", children: course?.title ?? "" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-1 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full bg-gold transition-all", style: {
            width: `${progressPct}%`
          } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground shrink-0", children: [
            completedCount,
            "/",
            totalLessons
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 min-h-0", children: [
      sidebarOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-40 bg-black/50 md:hidden", onClick: () => setSidebarOpen(false), "aria-hidden": "true" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "hidden md:flex md:w-[300px] md:shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-accent/30 overflow-hidden", children: sidebarContent }),
      sidebarOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "fixed top-0 bottom-0 left-0 z-50 flex flex-col w-[85vw] max-w-[300px] bg-sidebar text-sidebar-foreground shadow-xl md:hidden", children: sidebarContent }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-y-auto", children: courseQ.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto p-4 sm:p-6 md:p-8 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-video w-full rounded-xl bg-muted animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-2/3 rounded-lg bg-muted animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-1/2 rounded-lg bg-muted animate-pulse" })
      ] }) : !activeLesson ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-64 text-muted-foreground", children: "No lessons found in this course." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto p-4 sm:p-6 md:p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-extrabold text-foreground mb-1", children: activeLesson.title }),
        activeLesson.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-5 leading-relaxed", children: activeLesson.description }),
        activeLesson.video_url && (embed ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-video w-full rounded-xl overflow-hidden bg-black shadow-card mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", { src: embed, title: activeLesson.title, allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share", allowFullScreen: true, className: "w-full h-full" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-video w-full rounded-xl overflow-hidden bg-black shadow-card mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("video", { src: activeLesson.video_url, controls: true, playsInline: true, controlsList: "nodownload", className: "w-full h-full" }) })),
        activeLesson.pdf_url && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-card border border-border p-6 mb-6 flex flex-col sm:flex-row items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-10 w-10 text-gold shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-center sm:text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground mb-1", children: "PDF Attachment" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-3", children: "Download the PDF resource for this lesson." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "bg-gold text-gold-foreground hover:bg-gold/90", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: activeLesson.pdf_url, target: "_blank", rel: "noopener noreferrer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2" }),
              " Open PDF"
            ] }) })
          ] })
        ] }),
        activeLesson.text_content && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-card border border-border p-5 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3", children: "Notes & Resources" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground/80 text-sm leading-relaxed whitespace-pre-wrap", children: activeLesson.text_content })
        ] }),
        !activeLesson.video_url && !activeLesson.pdf_url && !activeLesson.text_content && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-video w-full rounded-xl bg-muted flex items-center justify-center mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No content added yet." }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-border pt-6 mt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", disabled: !prevLesson, onClick: () => prevLesson && setActiveLessonId(prevLesson.id), className: "gap-1.5 w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
            " Previous"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-2", children: [
            lessonDone ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center justify-center gap-1.5 text-green-500 font-medium text-sm px-4 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }),
              " Lesson Complete"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => activeLesson && markComplete.mutate(activeLesson.id), disabled: markComplete.isPending, className: "bg-gold text-gold-foreground hover:bg-gold/90 w-full sm:w-auto", children: [
              markComplete.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 mr-2" }),
              markComplete.isPending ? "Saving…" : "Mark as Complete"
            ] }),
            isComplete && displayCertificateId && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "border-gold text-gold hover:bg-gold/10 gap-1.5 w-full sm:w-auto", onClick: () => window.open(`/certificate/${displayCertificateId}`, "_blank"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-4 w-4" }),
              "View My Certificate"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", disabled: !nextLesson, onClick: () => nextLesson && setActiveLessonId(nextLesson.id), className: "gap-1.5 w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm", children: [
            "Next ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
          ] })
        ] })
      ] }) })
    ] }),
    course && /* @__PURE__ */ jsxRuntimeExports.jsx(CourseCompleteModal, { open: courseCompleteOpen, onClose: () => setCourseCompleteOpen(false), courseTitle: course.title, certificateId: earnedCertificateId })
  ] });
}
export {
  CoursePage as component
};
