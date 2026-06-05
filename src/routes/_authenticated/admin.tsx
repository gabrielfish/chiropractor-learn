import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { LogOut, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — DCPG" }] }),
  beforeLoad: ({ context }) => {
    const roles = (context as { roles?: string[] }).roles ?? [];
    if (!roles.includes("super_admin") && !roles.includes("author")) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: AdminPage,
});

function AdminPage() {
  const qc = useQueryClient();
  const { user } = Route.useRouteContext();
  const [form, setForm] = useState({
    title: "", description: "", category_id: "", video_url: "", video_duration: "",
    pdf_url: "", thumbnail_url: "", status: "published" as "draft" | "published",
  });

  const categoriesQ = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("order");
      if (error) throw error;
      return data;
    },
  });

  const contentQ = useQuery({
    queryKey: ["admin", "content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content")
        .select("*, category:categories(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      if (!form.title.trim()) throw new Error("Title is required");
      const { error } = await supabase.from("content").insert({
        title: form.title,
        description: form.description || null,
        category_id: form.category_id || null,
        video_url: form.video_url || null,
        video_duration: form.video_duration || null,
        pdf_url: form.pdf_url || null,
        thumbnail_url: form.thumbnail_url || null,
        author_id: user.id,
        status: form.status,
        published_at: form.status === "published" ? new Date().toISOString() : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Content saved");
      setForm({ title: "", description: "", category_id: "", video_url: "", video_duration: "", pdf_url: "", thumbnail_url: "", status: "published" });
      qc.invalidateQueries({ queryKey: ["admin", "content"] });
      qc.invalidateQueries({ queryKey: ["content"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-60 bg-sidebar text-sidebar-foreground p-5 hidden md:flex flex-col">
        <div className="mb-8">
          <div className="font-display font-extrabold text-xl">DCPG Admin</div>
          <div className="text-xs text-sidebar-foreground/60">Membership Portal</div>
        </div>
        <nav className="flex-1 space-y-1 text-sm">
          <div className="px-3 py-2 rounded-lg bg-sidebar-accent text-sidebar-accent-foreground font-medium">Content</div>
          <Link to="/dashboard" className="block px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent">View as member</Link>
        </nav>
        <button onClick={signOut} className="flex items-center gap-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground">
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-3xl font-extrabold mb-1">Manage content</h1>
          <p className="text-muted-foreground mb-8">Upload lessons and manage your library.</p>

          <section className="rounded-xl bg-card border border-border p-6 shadow-card mb-10">
            <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2"><Plus className="h-5 w-5 text-gold" /> New lesson</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <Label>Title *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <Label>Description</Label>
                <Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                >
                  <option value="">Select category…</option>
                  {(categoriesQ.data ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" })}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>YouTube URL</Label>
                <Input placeholder="https://youtu.be/…" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Duration</Label>
                <Input placeholder="32 min" value={form.video_duration} onChange={(e) => setForm({ ...form, video_duration: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>PDF URL</Label>
                <Input value={form.pdf_url} onChange={(e) => setForm({ ...form, pdf_url: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Thumbnail URL</Label>
                <Input value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end mt-5">
              <Button onClick={() => create.mutate()} disabled={create.isPending} className="bg-gold text-gold-foreground hover:bg-gold/90">
                {create.isPending ? "Saving…" : "Save lesson"}
              </Button>
            </div>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold mb-4">All content ({contentQ.data?.length ?? 0})</h2>
            <div className="rounded-xl bg-card border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {(contentQ.data ?? []).map((c) => (
                    <tr key={c.id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium">{c.title}</td>
                      <td className="px-4 py-3 text-muted-foreground">{c.category?.name ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === "published" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {(contentQ.data ?? []).length === 0 && (
                    <tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">No content yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
