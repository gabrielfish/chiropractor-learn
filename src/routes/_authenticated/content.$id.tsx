import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MemberNav } from "@/components/MemberNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Download, FileText, Book, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { LessonCompleteModal } from "@/components/LessonCompleteModal";

export const Route = createFileRoute("/_authenticated/content/$id")({
  head: () => ({ meta: [{ title: "Lesson — DCPG Membership Portal" }] }),
  component: ContentDetail,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <p className="text-muted-foreground">{error.message}</p>
    </div>
  ),
});

function youtubeEmbed(url: string | null | undefined): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (!m) return null;
  // rel=0          — suppress related videos from other channels at end
  // modestbranding=1 — hide YouTube wordmark in control bar
  // iv_load_policy=3 — disable video annotations
  // disablekb=0    — keep keyboard controls enabled for accessibility
  return `https://www.youtube.com/embed/${m[1]}?rel=0&modestbranding=1&iv_load_policy=3&disablekb=0`;
}

function isYoutube(url: string | null | undefined): boolean {
  return !!url && /(?:youtube\.com|youtu\.be)/.test(url);
}

function ContentDetail() {
  const { id } = Route.useParams();
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const [commentBody, setCommentBody] = useState("");
  const [celebrateOpen, setCelebrateOpen] = useState(false);

  const contentQ = useQuery({
    queryKey: ["content", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content")
        .select("*, category:categories(name,slug)")
        .eq("id", id)
        .single();
      if (error) throw error;
      if (!data) throw notFound();
      let author: { full_name: string | null; avatar_url: string | null; job_title: string | null } | null = null;
      if (data.author_id) {
        const { data: a } = await supabase
          .from("author_profiles_public")
          .select("full_name,avatar_url,job_title")
          .eq("id", data.author_id)
          .maybeSingle();
        author = a ?? null;
      }
      return { ...data, author };
    },
  });

  const progressQ = useQuery({
    queryKey: ["progress", id, user.id],
    queryFn: async () => {
      const { data } = await supabase.from("progress").select("*").eq("user_id", user.id).eq("content_id", id).maybeSingle();
      return data;
    },
  });

  const commentsQ = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*, author:profiles(full_name,avatar_url)")
        .eq("content_id", id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const markComplete = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("progress").upsert(
        { user_id: user.id, content_id: id, completed: true, completed_at: new Date().toISOString() },
        { onConflict: "user_id,content_id" }
      );
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["progress", id, user.id] });
      setCelebrateOpen(true);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const postComment = useMutation({
    mutationFn: async () => {
      const body = commentBody.trim();
      if (!body) throw new Error("Comment cannot be empty");
      const { error } = await supabase.from("comments").insert({ content_id: id, user_id: user.id, body });
      if (error) throw error;
    },
    onSuccess: () => {
      setCommentBody("");
      qc.invalidateQueries({ queryKey: ["comments", id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });




  const item = contentQ.data;
  if (contentQ.isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <MemberNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="h-96 rounded-xl bg-muted animate-pulse" />
        </div>
      </div>
    );
  }
  if (!item) return null;

  const embed = youtubeEmbed(item.video_url);
  const completed = !!progressQ.data?.completed;

  return (
    <div className="min-h-screen bg-background">
      <MemberNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        <Link to="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to library
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {embed ? (
              /*
               * YouTube embed hardening:
               * - Transparent overlay div sits on top of the iframe and intercepts
               *   right-click (onContextMenu) to prevent "Open in YouTube" context menus.
               * - pointer-events: none on the iframe itself means mouse events (including
               *   the YouTube logo click-through) are absorbed by the overlay instead.
               * - pointer-events: auto is restored on the overlay so the browser still
               *   passes click/play/pause through to the embedded player via the iframe's
               *   own controls (which YouTube renders inside the iframe document).
               * Note: YouTube's own iframe API/controls are inside the sandboxed document
               * and are unaffected — play/pause/seek/fullscreen all work normally.
               */
              <div
                className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-card"
                style={{ position: "relative" }}
                onContextMenu={(e) => e.preventDefault()}
              >
                {/* Transparent intercept layer — catches right-click and logo clicks */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 1,
                    pointerEvents: "auto",
                    background: "transparent",
                  }}
                  onContextMenu={(e) => e.preventDefault()}
                />
                <iframe
                  src={embed}
                  title={item.title}
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ pointerEvents: "none" }}
                  className="w-full h-full"
                />
              </div>
            ) : item.video_url && !isYoutube(item.video_url) ? (
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-card">
                <video
                  src={item.video_url}
                  controls
                  playsInline
                  poster={item.thumbnail_url ?? undefined}
                  className="w-full h-full"
                />
              </div>
            ) : (
              <div className="aspect-video w-full rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
                <p>No video for this lesson</p>
              </div>
            )}

            <div className="mt-6">
              {item.category && <Badge className="bg-gold/15 text-gold hover:bg-gold/15 border-0 mb-3">{item.category.name}</Badge>}
              <h1 className="font-display text-3xl md:text-4xl font-extrabold text-foreground mb-3">{item.title}</h1>
              {item.author?.full_name && (
                <div className="flex items-center gap-3 mb-5 p-3 rounded-lg bg-card border border-border">
                  {item.author.avatar_url ? (
                    <img src={item.author.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover border border-border" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-gold flex items-center justify-center font-display font-bold">
                      {item.author.full_name.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-gold font-semibold">Taught by</p>
                    <p className="text-foreground font-medium truncate">{item.author.full_name}</p>
                    {item.author.job_title && <p className="text-xs text-muted-foreground truncate">{item.author.job_title}</p>}
                  </div>
                </div>
              )}
              {item.description && (
                <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{item.description}</p>
              )}

              <div className="flex flex-wrap gap-3 mt-6">
                <Button
                  onClick={() => markComplete.mutate()}
                  disabled={completed || markComplete.isPending}
                  className={completed ? "bg-success text-success-foreground hover:bg-success" : "bg-gold text-gold-foreground hover:bg-gold/90"}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {completed ? "Completed" : "Mark as complete"}
                </Button>
                {item.pdf_url && (
                  <Button asChild variant="outline">
                    <a href={item.pdf_url} target="_blank" rel="noopener noreferrer" download>
                      <FileText className="h-4 w-4 mr-2" /> Download PDF
                    </a>
                  </Button>
                )}
                {item.book_url && (
                  <Button asChild variant="outline">
                    <a href={item.book_url} target="_blank" rel="noopener noreferrer" download>
                      <Book className="h-4 w-4 mr-2" /> Download workbook
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* Comments */}
            <section className="mt-12">
              <h2 className="font-display text-xl font-bold mb-4">
                Comments <span className="text-muted-foreground font-normal">({commentsQ.data?.length ?? 0})</span>
              </h2>

              <div className="rounded-xl bg-card border border-border p-4 mb-6">
                <textarea
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  placeholder="Share your thoughts…"
                  className="w-full min-h-[80px] resize-y bg-transparent text-sm focus:outline-none"
                />
                <div className="flex justify-end mt-2">
                  <Button onClick={() => postComment.mutate()} disabled={postComment.isPending || !commentBody.trim()} size="sm" className="bg-primary hover:bg-primary/90">
                    Post comment
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {(commentsQ.data ?? []).map((c) => (
                  <div key={c.id} className="rounded-lg bg-card border border-border p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-medium text-sm text-foreground">{c.author?.full_name ?? "Member"}</span>
                      <span className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-foreground/80 whitespace-pre-line">{c.body}</p>
                  </div>
                ))}
                {(commentsQ.data ?? []).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">Be the first to comment.</p>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-xl bg-card border border-border p-5">
              <h3 className="font-display font-bold mb-3">Resources</h3>
              <ul className="space-y-2 text-sm">
                {item.video_url && <li className="flex items-center gap-2 text-foreground/80"><CheckCircle2 className="h-4 w-4 text-success" /> Video lesson</li>}
                {item.pdf_url && <li className="flex items-center gap-2 text-foreground/80"><Download className="h-4 w-4 text-gold" /> {item.pdf_name ?? "PDF"}</li>}
                {item.book_url && <li className="flex items-center gap-2 text-foreground/80"><Download className="h-4 w-4 text-gold" /> {item.book_name ?? "Workbook"}</li>}
              </ul>
            </div>
            <div className="rounded-xl bg-primary text-primary-foreground p-5">
              <h3 className="font-display font-bold mb-2">Keep growing</h3>
              <p className="text-sm text-primary-foreground/80 mb-3">Mark lessons complete to earn category certificates.</p>
              <Link to="/dashboard" className="text-gold text-sm font-medium hover:underline">Browse more lessons →</Link>
            </div>
          </aside>
        </div>
      </main>
      <LessonCompleteModal
        open={celebrateOpen}
        onClose={() => setCelebrateOpen(false)}
        lessonTitle={item.title}
      />
    </div>
  );
}
