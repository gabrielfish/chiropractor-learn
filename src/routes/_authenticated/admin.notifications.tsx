import { createFileRoute, redirect } from "@tanstack/react-router";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Bell } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/notifications")({
  head: () => ({ meta: [{ title: "Notifications — DCPG Admin" }] }),
  beforeLoad: ({ context }) => {
    const roles = (context as { roles?: string[] }).roles ?? [];
    if (!roles.includes("super_admin")) throw redirect({ to: "/dashboard" });
  },
  component: NotificationsPage,
});

function NotificationsPage() {
  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar active="notifications" />

      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-x-hidden min-w-0">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-3xl font-extrabold mb-1">Notifications</h1>
          <p className="text-muted-foreground mb-8">
            Manage email notifications to members.
          </p>

          <div className="rounded-xl bg-card border border-border p-8 shadow-card flex flex-col items-center justify-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
              <Bell className="h-8 w-8 text-gold" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold mb-2">Notification centre</h2>
              <p className="text-muted-foreground max-w-md">
                Email notifications are sent automatically when you publish a lesson.
                Use the <strong>Notify members</strong> button on any published lesson card in the Content section to send a broadcast email to all members who have notifications enabled.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
