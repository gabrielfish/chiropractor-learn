import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { syncAllToAlgolia } from "@/lib/algolia-sync.functions";
import { syncYouTubeChannel, syncYouTubePlaylist } from "@/lib/youtube-sync.functions";
import { useServerFn } from "@tanstack/react-start";
import { Settings, RefreshCw, CheckCircle2, AlertCircle, Database, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

  const [syncResult, setSyncResult] = useState<{
    contentCount: number;
    courseCount: number;
    total: number;
  } | null>(null);

  const [ytChannelId, setYtChannelId] = useState("");
  const [ytPlaylistId, setYtPlaylistId] = useState("");
  const [ytResult, setYtResult] = useState<{ imported: number; skipped: number } | null>(null);

  const syncMut = useMutation({
    mutationFn: () => syncAllFn({ data: undefined }),
    onSuccess: (result) => {
      setSyncResult(result as { contentCount: number; courseCount: number; total: number });
    },
  });

  const ytChannelMut = useMutation({
    mutationFn: () => syncChannelFn({ data: { channelId: ytChannelId.trim() } }),
    onSuccess: (result) => setYtResult(result as { imported: number; skipped: number }),
    onError: () => setYtResult(null),
  });

  const ytPlaylistMut = useMutation({
    mutationFn: () => syncPlaylistFn({ data: { playlistId: ytPlaylistId.trim() } }),
    onSuccess: (result) => setYtResult(result as { imported: number; skipped: number }),
    onError: () => setYtResult(null),
  });

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
                  Import all videos from a YouTube channel or playlist. Each video is created as a <strong>draft</strong> content entry with title, description, thumbnail, and auto-assigned category. Duplicates are skipped.
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Channel ID</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g. UCxxxxxxxxxxxxxxxxxxxxxx"
                        value={ytChannelId}
                        onChange={(e) => setYtChannelId(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => { setYtResult(null); ytChannelMut.mutate(); }}
                        disabled={!ytChannelId.trim() || ytChannelMut.isPending || ytPlaylistMut.isPending}
                        className="bg-red-600 hover:bg-red-700 text-white inline-flex items-center gap-2 shrink-0"
                      >
                        <RefreshCw className={`h-4 w-4 ${ytChannelMut.isPending ? "animate-spin" : ""}`} />
                        {ytChannelMut.isPending ? "Syncing…" : "Sync Channel"}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex-1 h-px bg-border" />
                    <span>or</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Playlist ID</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g. PLxxxxxxxxxxxxxxxxxxxxxx"
                        value={ytPlaylistId}
                        onChange={(e) => setYtPlaylistId(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => { setYtResult(null); ytPlaylistMut.mutate(); }}
                        disabled={!ytPlaylistId.trim() || ytChannelMut.isPending || ytPlaylistMut.isPending}
                        className="bg-red-600 hover:bg-red-700 text-white inline-flex items-center gap-2 shrink-0"
                      >
                        <RefreshCw className={`h-4 w-4 ${ytPlaylistMut.isPending ? "animate-spin" : ""}`} />
                        {ytPlaylistMut.isPending ? "Syncing…" : "Sync Playlist"}
                      </Button>
                    </div>
                  </div>

                  {(ytChannelMut.isPending || ytPlaylistMut.isPending) && (
                    <p className="text-xs text-muted-foreground animate-pulse">
                      Fetching videos from YouTube and importing to the portal. This may take a minute for large channels…
                    </p>
                  )}

                  {ytResult && !ytChannelMut.isPending && !ytPlaylistMut.isPending && (
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>
                        Imported <strong>{ytResult.imported}</strong> videos as drafts
                        {ytResult.skipped > 0 && `, ${ytResult.skipped} already existed and were skipped`}.
                      </span>
                    </div>
                  )}

                  {(ytChannelMut.isError || ytPlaylistMut.isError) && !ytChannelMut.isPending && !ytPlaylistMut.isPending && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{((ytChannelMut.error || ytPlaylistMut.error) as Error)?.message ?? "Sync failed"}</span>
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
