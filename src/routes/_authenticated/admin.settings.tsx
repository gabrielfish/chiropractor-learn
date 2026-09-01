import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { syncAllToAlgolia } from "@/lib/algolia-sync.functions";
import {
  syncYouTubeChannel,
  syncYouTubePlaylist,
  syncAllYouTubeChannelPlaylists,
} from "@/lib/youtube-sync.functions";
import { useServerFn } from "@tanstack/react-start";
import { Settings, RefreshCw, CheckCircle2, AlertCircle, Database, Youtube, ListVideo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — DCPG Admin" }] }),
  beforeLoad: ({ context }) => {
    const roles = (context as { roles?: string[] }).roles ?? [];
    if (!roles.includes("super_admin")) throw redirect({ to: "/dashboard" });
  },
  component: SettingsPage,
});

function SettingsPage() {
  const syncAllFn = useServerFn(syncAllToAlgolia);
  const syncChannelFn = useServerFn(syncYouTubeChannel);
  const syncPlaylistFn = useServerFn(syncYouTubePlaylist);
  const syncAllPlaylistsFn = useServerFn(syncAllYouTubeChannelPlaylists);

  const [syncResult, setSyncResult] = useState<{
    contentCount: number;
    courseCount: number;
    total: number;
  } | null>(null);

  const [ytChannelId, setYtChannelId] = useState("");
  const [ytPlaylistId, setYtPlaylistId] = useState("");
  const [ytCourseTitle, setYtCourseTitle] = useState("");
  const [ytMaxResults, setYtMaxResults] = useState(50);
  const [ytMaxPerPlaylist, setYtMaxPerPlaylist] = useState(200);
  const [ytPublishedAfter, setYtPublishedAfter] = useState("");
  const [ytForceUpdate, setYtForceUpdate] = useState(false);
  const [ytProgress, setYtProgress] = useState<string | null>(null);
  const [ytResult, setYtResult] = useState<{ imported: number; updated: number; skipped: number } | null>(null);
  const [ytCourseResult, setYtCourseResult] = useState<{ courseTitle: string; lessonsCreated: number } | null>(null);
  const [ytAllResult, setYtAllResult] = useState<{
    coursesCreated: number; lessonsImported: number; skipped: number; total: number;
    results: { playlistTitle: string; action: "created" | "skipped"; courseTitle?: string; lessonsCreated?: number; reason?: string }[];
  } | null>(null);

  const syncMut = useMutation({
    mutationFn: () => syncAllFn({ data: undefined }),
    onSuccess: (result) => {
      setSyncResult(result as { contentCount: number; courseCount: number; total: number });
    },
  });

  const ytChannelMut = useMutation({
    mutationFn: () => {
      setYtProgress(ytForceUpdate ? "Fetching videos and updating existing records…" : "Fetching videos from YouTube channel…");
      setYtResult(null);
      return syncChannelFn({
        data: {
          channelId: ytChannelId.trim(),
          maxResults: ytMaxResults,
          publishedAfter: ytPublishedAfter || undefined,
          forceUpdate: ytForceUpdate,
        },
      });
    },
    onSuccess: (result) => {
      const r = result as { imported: number; updated: number; skipped: number };
      setYtResult(r);
      setYtProgress(null);
    },
    onError: () => { setYtProgress(null); },
  });

  const ytPlaylistMut = useMutation({
    mutationFn: () => {
      setYtProgress("Fetching playlist and creating course…");
      setYtCourseResult(null);
      return syncPlaylistFn({
        data: {
          playlistId: ytPlaylistId.trim(),
          maxResults: ytMaxResults,
          publishedAfter: ytPublishedAfter || undefined,
          courseTitle: ytCourseTitle.trim() || undefined,
        },
      });
    },
    onSuccess: (result) => {
      const r = result as { courseTitle: string; lessonsCreated: number };
      setYtCourseResult(r);
      setYtProgress(null);
    },
    onError: () => { setYtProgress(null); },
  });

  const ytAllPlaylistsMut = useMutation({
    mutationFn: () => {
      setYtProgress("Fetching all playlists from channel…");
      setYtAllResult(null);
      return syncAllPlaylistsFn({
        data: {
          channelId: ytChannelId.trim(),
          maxVideosPerPlaylist: ytMaxPerPlaylist,
        },
      });
    },
    onSuccess: (result) => {
      const r = result as {
        coursesCreated: number; lessonsImported: number; skipped: number; total: number;
        results: { playlistTitle: string; action: "created" | "skipped"; courseTitle?: string; lessonsCreated?: number; reason?: string }[];
      };
      setYtAllResult(r);
      setYtProgress(null);
    },
    onError: () => { setYtProgress(null); },
  });

  const ytBusy = ytChannelMut.isPending || ytPlaylistMut.isPending || ytAllPlaylistsMut.isPending;

  const progressLabel = ytAllPlaylistsMut.isPending
    ? (ytProgress ?? "Syncing all playlists — this may take several minutes for large channels…")
    : (ytProgress ?? "Importing… this may take a minute.");

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <AdminSidebar active="settings" />

      <main className="flex-1 pt-14 px-4 pb-4 sm:px-6 sm:pb-6 md:p-10 overflow-x-hidden min-w-0">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-3xl font-extrabold mb-1">Settings</h1>
          <p className="text-muted-foreground mb-8">
            Portal configuration and maintenance tools.
          </p>

          {/* Algolia Search Index card */}
          <div className="rounded-xl bg-card border border-border p-6 shadow-card mb-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <Database className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-display text-lg font-bold mb-1">Algolia Search Index</h2>
                <p className="text-sm text-muted-foreground mb-5">
                  Sync all published content and courses to the Algolia search index
                  (<code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">dcpg_content</code>).
                  Run this after bulk-importing content, or if search results seem out of date.
                  New content is indexed automatically when published.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    onClick={() => { setSyncResult(null); syncMut.mutate(); }}
                    disabled={syncMut.isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${syncMut.isPending ? "animate-spin" : ""}`} />
                    {syncMut.isPending ? "Syncing…" : "Sync All Content to Algolia"}
                  </Button>

                  {syncResult && !syncMut.isPending && (
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>
                        Synced <strong>{syncResult.total}</strong> records —{" "}
                        {syncResult.contentCount} lessons, {syncResult.courseCount} courses
                      </span>
                    </div>
                  )}

                  {syncMut.isError && !syncMut.isPending && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{(syncMut.error as Error).message}</span>
                    </div>
                  )}
                </div>

                {syncMut.isPending && (
                  <p className="mt-3 text-xs text-muted-foreground animate-pulse">
                    Fetching all published content from Supabase and pushing to Algolia…
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* YouTube Sync card */}
          <div className="rounded-xl bg-card border border-border p-6 shadow-card mb-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                <Youtube className="h-5 w-5 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-display text-lg font-bold mb-1">YouTube Sync</h2>
                <p className="text-sm text-muted-foreground mb-5">
                  <strong>Channel sync</strong> imports each video as an individual draft content
                  entry. <strong>Playlist sync</strong> creates a full{" "}
                  <strong>draft Course</strong> with one Module and a Lesson per video — ideal
                  for structured learning programs. Categories are auto-assigned by AI.
                </p>

                {/* Shared options — Channel ID + max results/date for channel/single playlist */}
                <div className="space-y-3 mb-5 p-4 rounded-lg bg-muted/40 border border-border">
                  <div className="space-y-1.5">
                    <Label htmlFor="yt-channel">Channel ID</Label>
                    <Input
                      id="yt-channel"
                      placeholder="e.g. UCxxxxxxxxxxxxxxxxxxxxxx"
                      value={ytChannelId}
                      onChange={(e) => setYtChannelId(e.target.value)}
                      disabled={ytBusy}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="yt-max">Max videos (channel/playlist sync)</Label>
                      <Input
                        id="yt-max"
                        type="number"
                        min={1}
                        max={200}
                        value={ytMaxResults}
                        onChange={(e) => setYtMaxResults(Math.max(1, Math.min(200, Number(e.target.value) || 50)))}
                        disabled={ytBusy}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="yt-after">Published after (optional)</Label>
                      <Input
                        id="yt-after"
                        type="date"
                        value={ytPublishedAfter}
                        onChange={(e) => setYtPublishedAfter(e.target.value)}
                        disabled={ytBusy}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Channel sync */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <Button
                        onClick={() => { setYtResult(null); ytChannelMut.mutate(); }}
                        disabled={!ytChannelId.trim() || ytBusy}
                        className="bg-red-600 hover:bg-red-700 text-white inline-flex items-center gap-2"
                      >
                        <RefreshCw className={`h-4 w-4 ${ytChannelMut.isPending ? "animate-spin" : ""}`} />
                        {ytChannelMut.isPending ? "Syncing…" : "Sync Channel → Lessons"}
                      </Button>
                      <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={ytForceUpdate}
                          onChange={(e) => setYtForceUpdate(e.target.checked)}
                          disabled={ytBusy}
                          className="h-4 w-4 accent-red-600"
                        />
                        Force update existing records
                      </label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Imports up to {ytMaxResults} recent videos from the channel's upload feed as individual draft lessons.
                      {ytForceUpdate && " Force update will patch video_url and youtube_video_id on existing records matched by title."}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex-1 h-px bg-border" />
                    <span>or sync a single playlist</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  {/* Single playlist sync → creates one Course */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label>Playlist ID</Label>
                      <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Creates 1 Course</span>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g. PLxxxxxxxxxxxxxxxxxxxxxx"
                        value={ytPlaylistId}
                        onChange={(e) => setYtPlaylistId(e.target.value)}
                        disabled={ytBusy}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => { setYtCourseResult(null); ytPlaylistMut.mutate(); }}
                        disabled={!ytPlaylistId.trim() || ytBusy}
                        className="bg-red-600 hover:bg-red-700 text-white inline-flex items-center gap-2 shrink-0"
                      >
                        <RefreshCw className={`h-4 w-4 ${ytPlaylistMut.isPending ? "animate-spin" : ""}`} />
                        {ytPlaylistMut.isPending ? "Creating Course…" : "Sync Playlist → Course"}
                      </Button>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="yt-course-title" className="text-xs text-muted-foreground">
                        Course name override (optional — defaults to playlist title)
                      </Label>
                      <Input
                        id="yt-course-title"
                        placeholder="e.g. Advanced Chiropractic Techniques"
                        value={ytCourseTitle}
                        onChange={(e) => setYtCourseTitle(e.target.value)}
                        disabled={ytBusy}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex-1 h-px bg-border" />
                    <span>or sync all playlists at once</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  {/* Sync All Playlists → All Courses */}
                  <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <ListVideo className="h-4 w-4 text-red-500 shrink-0" />
                      <span className="text-sm font-medium">Sync All Playlists → All Courses</span>
                      <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Uses Channel ID above</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Fetches every playlist on the channel and creates one draft Course per playlist.
                      Playlists whose title matches an existing course are skipped automatically.
                      Each course gets up to the limit below in lessons.
                    </p>
                    <div className="space-y-1.5">
                      <Label htmlFor="yt-max-per-playlist" className="text-xs">
                        Max lessons per course (default 200)
                      </Label>
                      <Input
                        id="yt-max-per-playlist"
                        type="number"
                        min={1}
                        max={500}
                        value={ytMaxPerPlaylist}
                        onChange={(e) => setYtMaxPerPlaylist(Math.max(1, Math.min(500, Number(e.target.value) || 200)))}
                        disabled={ytBusy}
                        className="max-w-[140px]"
                      />
                    </div>
                    <Button
                      onClick={() => { setYtAllResult(null); ytAllPlaylistsMut.mutate(); }}
                      disabled={!ytChannelId.trim() || ytBusy}
                      className="bg-red-700 hover:bg-red-800 text-white inline-flex items-center gap-2"
                    >
                      <RefreshCw className={`h-4 w-4 ${ytAllPlaylistsMut.isPending ? "animate-spin" : ""}`} />
                      {ytAllPlaylistsMut.isPending ? "Syncing all playlists…" : "Sync All Playlists → All Courses"}
                    </Button>
                  </div>

                  {/* Progress */}
                  {ytBusy && (
                    <div className="rounded-lg bg-muted/60 border border-border p-3 text-sm text-muted-foreground animate-pulse">
                      {progressLabel}
                    </div>
                  )}

                  {/* Success — channel lessons */}
                  {ytResult && !ytBusy && (
                    <div className="flex items-start gap-2 text-sm text-green-600 dark:text-green-400 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-3">
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>
                        Done!{" "}
                        {ytResult.imported > 0 && <><strong>{ytResult.imported}</strong> imported as drafts</>}
                        {ytResult.imported > 0 && (ytResult.updated > 0 || ytResult.skipped > 0) && ", "}
                        {ytResult.updated > 0 && <><strong>{ytResult.updated}</strong> updated (video_url + youtube_video_id)</>}
                        {ytResult.updated > 0 && ytResult.skipped > 0 && ", "}
                        {ytResult.skipped > 0 && <><strong>{ytResult.skipped}</strong> skipped</>}
                        {ytResult.imported === 0 && ytResult.updated === 0 && ytResult.skipped === 0 && "Nothing to process"}.
                      </span>
                    </div>
                  )}

                  {/* Success — single playlist course */}
                  {ytCourseResult && !ytBusy && (
                    <div className="flex items-start gap-2 text-sm text-green-600 dark:text-green-400 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-3">
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>
                        Course created as draft: <strong>"{ytCourseResult.courseTitle}"</strong>{" "}
                        with <strong>{ytCourseResult.lessonsCreated}</strong> lesson{ytCourseResult.lessonsCreated !== 1 ? "s" : ""}.
                      </span>
                    </div>
                  )}

                  {/* Success — all playlists */}
                  {ytAllResult && !ytBusy && (
                    <div className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-4 space-y-3">
                      <div className="flex items-start gap-2 text-sm text-green-600 dark:text-green-400">
                        <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>
                          Done! <strong>{ytAllResult.coursesCreated}</strong> course{ytAllResult.coursesCreated !== 1 ? "s" : ""} created
                          with <strong>{ytAllResult.lessonsImported}</strong> total lessons.
                          {ytAllResult.skipped > 0 && (
                            <> <strong>{ytAllResult.skipped}</strong> playlist{ytAllResult.skipped !== 1 ? "s" : ""} skipped.</>
                          )}
                          {" "}({ytAllResult.total} playlists found on channel.)
                        </span>
                      </div>
                      {ytAllResult.results.length > 0 && (
                        <div className="max-h-48 overflow-y-auto space-y-1">
                          {ytAllResult.results.map((r, i) => (
                            <div key={i} className="text-xs flex items-start gap-2">
                              {r.action === "created" ? (
                                <span className="text-green-600 dark:text-green-400 shrink-0">✓</span>
                              ) : (
                                <span className="text-muted-foreground shrink-0">—</span>
                              )}
                              <span className={r.action === "skipped" ? "text-muted-foreground" : "text-foreground"}>
                                {r.playlistTitle}
                                {r.action === "created" && r.lessonsCreated !== undefined && (
                                  <span className="text-muted-foreground"> ({r.lessonsCreated} lessons)</span>
                                )}
                                {r.action === "skipped" && r.reason && (
                                  <span className="text-muted-foreground"> — {r.reason}</span>
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Error */}
                  {(ytChannelMut.isError || ytPlaylistMut.isError || ytAllPlaylistsMut.isError) && !ytBusy && (
                    <div className="flex items-start gap-2 text-sm text-destructive rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>
                        {((ytChannelMut.error || ytPlaylistMut.error || ytAllPlaylistsMut.error) as Error)?.message ?? "Sync failed"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Placeholder for future settings */}
          <div className="rounded-xl bg-card border border-border p-8 shadow-card flex flex-col items-center justify-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Settings className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold mb-2">More settings coming soon</h2>
              <p className="text-muted-foreground max-w-md">
                Invite codes, member access controls, and branding options will be available here.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
