import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect, useMemo } from "react";
import { checkAndIssueCourse, debugCourseProgress } from "@/lib/certificates.functions";
import { supabase } from "@/integrations/supabase/client";
import { MemberNav } from "@/components/MemberNav";
import { CourseCompleteModal } from "@/components/CourseCompleteModal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  Play,
  FileText,
  BookOpen,
  Download,
  Loader2,
  Menu,
  X,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/course/$id")({
  head: () => ({ meta: [{ title: "Course — DCPG Membership Portal" }] }),
  component: CoursePage,
});

function youtubeEmbed(url: string | null | undefined): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (!m) return null;
  return `https://www.youtube.com/embed/${m[1]}?rel=0&modestbranding=1`;
}

type ContentType = "video" | "pdf" | "text" | string;

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  content_type: ContentType;
  video_url: string | null;
  pdf_url: string | null;
  text_content: string | null;
  order_index: number;
  module_id: string;
}

interface Module {
  id: string;
  title: string;
  order_index: number;
  lessons: Lesson[];
}

interface CourseData {
  course: {
    id: string;
    title: string;
    description: string | null;
    thumbnail_url: string | null;
  };
  modules: Module[];
  author: { full_name: string | null; avatar_url: string | null } | null;
}

function LessonIcon({ type, completed }: { type: ContentType; completed: boolean }) {
  if (completed) return <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />;
  if (type === "pdf") return <FileText className="h-4 w-4 shrink-0 text-gold/70" />;
  if (type === "text") return <BookOpen className="h-4 w-4 shrink-0 text-gold/70" />;
  return <Play className="h-4 w-4 shrink-0 text-gold/70" />;
}

function CoursePage() {
  const { id: courseId } = Route.useParams();
  const { user } = Route.useRouteContext() as { user: { id: string } };
  const qc = useQueryClient();

  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courseCompleteOpen, setCourseCompleteOpen] = useState(false);
  const [earnedCertificateId, setEarnedCertificateId] = useState<string | null>(null);
  const checkAndIssueCourseF = useServerFn(checkAndIssueCourse);
  const debugCourseProgressF = useServerFn(debugCourseProgress);

  // Expose debug helper to browser console: window.__debugCert()
  useEffect(() => {
    (window as any).__debugCert = () =>
      debugCourseProgressF({ data: { courseId } }).then((r) => { console.log("[debugCert]", r); return r; });
  }, [courseId, debugCourseProgressF]);

  // Main course data query
  const courseQ = useQuery<CourseData>({
    queryKey: ["course", courseId],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any;
      const { data: course, error: courseErr } = await db
        .from("courses")
        .select("id,title,description,thumbnail_url,author_id")
        .eq("id", courseId)
        .single();
      if (courseErr) throw courseErr;

      const { data: rawModules, error: modErr } = await db
        .from("course_modules")
        .select("id,title,order_index")
        .eq("course_id", courseId)
        .order("order_index", { ascending: true });
      if (modErr) throw modErr;

      const moduleIds = (rawModules ?? []).map((m: { id: string }) => m.id);

      let lessons: Lesson[] = [];
      if (moduleIds.length > 0) {
        const { data: rawLessons, error: lessonErr } = await db
          .from("course_lessons")
          .select("id,title,description,content_type,video_url,pdf_url,text_content,order_index,module_id")
          .in("module_id", moduleIds)
          .order("order_index", { ascending: true });
        if (lessonErr) throw lessonErr;
        lessons = rawLessons ?? [];
      }

      const lessonsByModule = lessons.reduce<Record<string, Lesson[]>>((acc, l) => {
        if (!acc[l.module_id]) acc[l.module_id] = [];
        acc[l.module_id].push(l);
        return acc;
      }, {});

      const modules: Module[] = (rawModules ?? []).map((m: { id: string; title: string; order_index: number }) => ({
        ...m,
        lessons: lessonsByModule[m.id] ?? [],
      }));

      let author: { full_name: string | null; avatar_url: string | null } | null = null;
      if ((course as any).author_id) {
        const { data: a } = await supabase
          .from("author_profiles_public")
          .select("full_name,avatar_url")
          .eq("id", (course as any).author_id)
          .maybeSingle();
        author = a ?? null;
      }

      return { course, modules, author };
    },
  });

  // Progress query
  const progressQ = useQuery<Set<string>>({
    queryKey: ["course-progress", courseId, user.id],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("course_progress")
        .select("course_lesson_id")
        .eq("user_id", user.id)
        .eq("course_id", courseId);
      if (error) throw error;
      return new Set((data ?? []).map((r: { course_lesson_id: string }) => r.course_lesson_id));
    },
    enabled: !!courseQ.data,
  });

  // Flatten all lessons in order
  const allLessons = useMemo<Lesson[]>(() => {
    if (!courseQ.data) return [];
    return courseQ.data.modules.flatMap((m) => m.lessons);
  }, [courseQ.data]);

  const completedIds = progressQ.data ?? new Set<string>();
  const totalLessons = allLessons.length;
  const completedCount = allLessons.filter((l) => completedIds.has(l.id)).length;
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const activeLesson = useMemo<Lesson | null>(() => {
    if (!allLessons.length) return null;
    if (activeLessonId) return allLessons.find((l) => l.id === activeLessonId) ?? allLessons[0];
    return allLessons[0];
  }, [activeLessonId, allLessons]);

  const currentIndex = activeLesson ? allLessons.findIndex((l) => l.id === activeLesson.id) : -1;
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Set initial active lesson: first incomplete, or first if all complete
  useEffect(() => {
    if (!allLessons.length || activeLessonId) return;
    if (!progressQ.data) return;
    const firstIncomplete = allLessons.find((l) => !progressQ.data!.has(l.id));
    setActiveLessonId(firstIncomplete ? firstIncomplete.id : allLessons[0].id);
  }, [allLessons, progressQ.data, activeLessonId]);

  // Mark complete mutation
  const markComplete = useMutation({
    mutationFn: async (lessonId: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any).from("course_progress").upsert(
        { user_id: user.id, course_id: courseId, course_lesson_id: lessonId, completed: true, completed_at: new Date().toISOString() },
        { onConflict: "user_id,course_lesson_id" }
      );
      if (error) throw error;
    },
    onSuccess: (_data, lessonId) => {
      qc.invalidateQueries({ queryKey: ["course-progress", courseId, user.id] });
      // Check if all lessons will be complete after this
      const newCompletedCount = completedCount + (completedIds.has(lessonId) ? 0 : 1);
      if (newCompletedCount >= totalLessons) {
        // Open the modal immediately — certificate button appears once the async call resolves
        setCourseCompleteOpen(true);
        checkAndIssueCourseF({ data: { courseId } })
          .then((result) => {
            console.log("[certificate] checkAndIssueCourse result:", result);
            if (result?.certificateId) setEarnedCertificateId(result.certificateId);
          })
          .catch((err) => {
            console.error("[certificate] checkAndIssueCourse error:", err);
          });
      } else if (nextLesson) {
        setActiveLessonId(nextLesson.id);
      }
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const course = courseQ.data?.course;

  // Sidebar content (shared between desktop and mobile)
  const sidebarContent = (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Sidebar header */}
      <div className="p-4 border-b border-sidebar-accent/30 shrink-0">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground mb-3 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to library
        </Link>
        <h2 className="font-display text-sm font-bold text-sidebar-foreground leading-snug line-clamp-2">
          {course?.title ?? "Loading…"}
        </h2>
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-sidebar-foreground/60 mb-1.5">
            <span>{completedCount} / {totalLessons} complete</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-sidebar-accent/40 overflow-hidden">
            <div
              className="h-full rounded-full bg-gold transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Module list */}
      <nav className="flex-1 overflow-y-auto py-2">
        {(courseQ.data?.modules ?? []).map((mod) => {
          const modCompleted = mod.lessons.filter((l) => completedIds.has(l.id)).length;
          return (
            <Collapsible key={mod.id} defaultOpen>
              <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-sidebar-accent/20 transition-colors group">
                <span className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/70 group-hover:text-sidebar-foreground pr-2 leading-snug">
                  {mod.title}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-xs text-sidebar-foreground/50">
                    {modCompleted}/{mod.lessons.length}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-sidebar-foreground/50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {mod.lessons.map((lesson) => {
                  const isActive = activeLesson?.id === lesson.id;
                  const isDone = completedIds.has(lesson.id);
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        setActiveLessonId(lesson.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-start gap-2.5 px-4 py-2.5 text-left transition-colors ${
                        isActive
                          ? "bg-sidebar-accent/40 text-sidebar-foreground"
                          : "hover:bg-sidebar-accent/20 text-sidebar-foreground/70 hover:text-sidebar-foreground"
                      }`}
                    >
                      <span className="mt-0.5 shrink-0">
                        <LessonIcon type={lesson.content_type} completed={isDone} />
                      </span>
                      <span className="text-xs leading-snug flex-1 min-w-0">{lesson.title}</span>
                      {isActive && (
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-gold shrink-0" aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </nav>
    </div>
  );

  const lessonDone = activeLesson ? completedIds.has(activeLesson.id) : false;
  const embed = activeLesson ? youtubeEmbed(activeLesson.video_url) : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MemberNav />

      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-30 bg-background border-b border-border px-3 py-2 flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate text-foreground">{course?.title ?? ""}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="text-xs text-muted-foreground shrink-0">{completedCount}/{totalLessons}</span>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 min-h-0">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar — desktop */}
        <aside className="hidden md:flex md:w-[300px] md:shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-accent/30 overflow-hidden">
          {sidebarContent}
        </aside>

        {/* Sidebar — mobile drawer */}
        {sidebarOpen && (
          <aside className="fixed top-0 bottom-0 left-0 z-50 flex flex-col w-[85vw] max-w-[300px] bg-sidebar text-sidebar-foreground shadow-xl md:hidden">
            {sidebarContent}
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {courseQ.isLoading ? (
            <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8 space-y-4">
              <div className="aspect-video w-full rounded-xl bg-muted animate-pulse" />
              <div className="h-8 w-2/3 rounded-lg bg-muted animate-pulse" />
              <div className="h-4 w-1/2 rounded-lg bg-muted animate-pulse" />
            </div>
          ) : !activeLesson ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              No lessons found in this course.
            </div>
          ) : (
            <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8">
              {/* Lesson header */}
              <h1 className="font-display text-2xl font-extrabold text-foreground mb-1">
                {activeLesson.title}
              </h1>
              {activeLesson.description && (
                <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                  {activeLesson.description}
                </p>
              )}

              {/* Video — shown if video_url is set */}
              {activeLesson.video_url && (
                embed ? (
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-card mb-6">
                    <iframe src={embed} title={activeLesson.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="w-full h-full" />
                  </div>
                ) : (
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-card mb-6">
                    <video src={activeLesson.video_url} controls playsInline className="w-full h-full" />
                  </div>
                )
              )}

              {/* PDF — shown if pdf_url is set regardless of content_type */}
              {activeLesson.pdf_url && (
                <div className="rounded-xl bg-card border border-border p-6 mb-6 flex flex-col sm:flex-row items-center gap-4">
                  <FileText className="h-10 w-10 text-gold shrink-0" />
                  <div className="flex-1 text-center sm:text-left">
                    <p className="font-medium text-foreground mb-1">PDF Attachment</p>
                    <p className="text-muted-foreground text-sm mb-3">Download the PDF resource for this lesson.</p>
                    <Button asChild className="bg-gold text-gold-foreground hover:bg-gold/90">
                      <a href={activeLesson.pdf_url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" /> Open PDF
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              {/* Text content — shown if text_content is set regardless of content_type */}
              {activeLesson.text_content && (
                <div className="rounded-xl bg-card border border-border p-5 mb-6">
                  <h3 className="font-display font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">Notes & Resources</h3>
                  <p className="text-foreground/80 text-sm leading-relaxed whitespace-pre-wrap">{activeLesson.text_content}</p>
                </div>
              )}

              {/* Fallback if nothing is set */}
              {!activeLesson.video_url && !activeLesson.pdf_url && !activeLesson.text_content && (
                <div className="aspect-video w-full rounded-xl bg-muted flex items-center justify-center mb-6">
                  <p className="text-muted-foreground text-sm">No content added yet.</p>
                </div>
              )}

              {/* Controls bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-border pt-6 mt-6">
                <Button
                  variant="outline"
                  disabled={!prevLesson}
                  onClick={() => prevLesson && setActiveLessonId(prevLesson.id)}
                  className="gap-1.5 w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm"
                >
                  <ArrowLeft className="h-4 w-4" /> Previous
                </Button>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  {lessonDone ? (
                    <span className="inline-flex items-center justify-center gap-1.5 text-green-500 font-medium text-sm px-4 py-2">
                      <CheckCircle2 className="h-4 w-4" /> Lesson Complete
                    </span>
                  ) : (
                    <Button
                      onClick={() => activeLesson && markComplete.mutate(activeLesson.id)}
                      disabled={markComplete.isPending}
                      className="bg-gold text-gold-foreground hover:bg-gold/90 w-full sm:w-auto"
                    >
                      {markComplete.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                      )}
                      {markComplete.isPending ? "Saving…" : "Mark as Complete"}
                    </Button>
                  )}
                </div>

                <Button
                  variant="outline"
                  disabled={!nextLesson}
                  onClick={() => nextLesson && setActiveLessonId(nextLesson.id)}
                  className="gap-1.5 w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>

      {course && (
        <CourseCompleteModal
          open={courseCompleteOpen}
          onClose={() => setCourseCompleteOpen(false)}
          courseTitle={course.title}
          certificateId={earnedCertificateId}
        />
      )}
    </div>
  );
}
