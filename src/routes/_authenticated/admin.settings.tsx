import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { syncAllToAlgolia } from "@/lib/algolia-sync.functions";
import { useServerFn } from "@tanstack/react-start";
import { Settings, RefreshCw, CheckCircle2, AlertCircle, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [syncResult, setSyncResult] = useState<{
    contentCount: number;
    courseCount: number;
    total: number;
  } | null>(null);

  const syncMut = useMutation({
    mutationFn: () => syncAllFn({ data: undefined }),
    onSuccess: (result) => {
      setSyncResult(result as { contentCount: number; courseCount: number; total: number });
    },
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
