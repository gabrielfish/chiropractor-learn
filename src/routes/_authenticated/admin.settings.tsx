import { createFileRoute, redirect } from "@tanstack/react-router";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Settings } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — DCPG Admin" }] }),
  beforeLoad: ({ context }) => {
    const roles = (context as { roles?: string[] }).roles ?? [];
    if (!roles.includes("super_admin")) throw redirect({ to: "/dashboard" });
  },
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar active="settings" />

      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-x-hidden min-w-0">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-3xl font-extrabold mb-1">Settings</h1>
          <p className="text-muted-foreground mb-8">
            Portal configuration and account settings.
          </p>

          <div className="rounded-xl bg-card border border-border p-8 shadow-card flex flex-col items-center justify-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Settings className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold mb-2">Coming soon</h2>
              <p className="text-muted-foreground max-w-md">
                Portal settings — including invite codes, member access controls, and branding options — will be available here.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
