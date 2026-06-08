import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { listAuthors, updateAuthorProfile } from "@/lib/authors.functions";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FileDropzone } from "@/components/FileDropzone";
import { uploadAvatar } from "@/lib/storage";
import { toast } from "sonner";
import { Users, FileText, Pencil } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/authors")({
  head: () => ({ meta: [{ title: "Authors — DCPG Admin" }] }),
  beforeLoad: ({ context }) => {
    const roles = (context as { roles?: string[] }).roles ?? [];
    if (!roles.includes("super_admin")) throw redirect({ to: "/dashboard" });
  },
  component: AuthorsPage,
});

type Author = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  job_title: string | null;
  bio: string | null;
  content_count: number;
};

function AuthorsPage() {
  const list = useServerFn(listAuthors);
  const update = useServerFn(updateAuthorProfile);
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Author | null>(null);

  const authorsQ = useQuery({
    queryKey: ["admin", "authors"],
    queryFn: () => list(),
  });

  const saveMut = useMutation({
    mutationFn: (a: Author) =>
      update({
        data: {
          id: a.id,
          full_name: a.full_name ?? "",
          job_title: a.job_title,
          bio: a.bio,
          avatar_url: a.avatar_url,
        },
      }),
    onSuccess: () => {
      toast.success("Author profile updated");
      qc.invalidateQueries({ queryKey: ["admin", "authors"] });
      setEditing(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar active="authors" />
      <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-7 w-7 text-gold" />
            <h1 className="font-display text-3xl font-extrabold">Authors</h1>
          </div>
          <p className="text-muted-foreground mb-8">All team members with publishing access.</p>

          {authorsQ.isLoading && <div className="h-40 rounded-xl bg-muted animate-pulse" />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(authorsQ.data?.authors ?? []).map((a) => (
              <div key={a.id} className="rounded-xl bg-card border border-border p-5 shadow-card">
                <div className="flex items-start gap-4">
                  {a.avatar_url ? (
                    <img src={a.avatar_url} alt={a.full_name ?? ""} className="w-16 h-16 rounded-full object-cover border border-border" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary/10 text-gold flex items-center justify-center font-display font-bold text-xl">
                      {(a.full_name ?? "?").slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display font-bold text-foreground truncate">{a.full_name ?? "Unnamed author"}</h3>
                      <Button size="sm" variant="ghost" onClick={() => setEditing(a)} className="text-muted-foreground hover:text-gold">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                    {a.job_title && <p className="text-sm text-gold font-medium">{a.job_title}</p>}
                    {a.email && <p className="text-xs text-muted-foreground truncate">{a.email}</p>}
                    {a.bio && <p className="text-sm text-foreground/80 mt-2 line-clamp-3">{a.bio}</p>}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-3">
                      <FileText className="h-3.5 w-3.5" />
                      {a.content_count} {a.content_count === 1 ? "lesson" : "lessons"} published
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {!authorsQ.isLoading && (authorsQ.data?.authors ?? []).length === 0 && (
              <div className="md:col-span-2 rounded-xl bg-card border border-border p-10 text-center text-muted-foreground">
                No authors yet. Share the team signup link with someone to add the first author.
              </div>
            )}
          </div>
        </div>
      </main>

      <Dialog open={editing !== null} onOpenChange={(o) => { if (!o) setEditing(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Edit author</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {editing.avatar_url ? (
                  <img src={editing.avatar_url} alt="" className="w-20 h-20 rounded-full object-cover border border-border" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary/10 text-gold flex items-center justify-center font-display font-bold text-2xl">
                    {(editing.full_name ?? "?").slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <FileDropzone
                    label="Upload photo"
                    accept="image/*"
                    uploaded={!!editing.avatar_url}
                    hint="JPG or PNG, square recommended"
                    onFile={async (file) => {
                      try {
                        const url = await uploadAvatar(editing.id, file);
                        setEditing({ ...editing, avatar_url: url });
                        toast.success("Photo uploaded");
                      } catch (e) {
                        toast.error(e instanceof Error ? e.message : "Upload failed");
                      }
                    }}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Display name</Label>
                <Input value={editing.full_name ?? ""} onChange={(e) => setEditing({ ...editing, full_name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Job title</Label>
                <Input placeholder="e.g. Practice Growth Coach" value={editing.job_title ?? ""} onChange={(e) => setEditing({ ...editing, job_title: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Bio</Label>
                <Textarea rows={4} value={editing.bio ?? ""} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={() => editing && saveMut.mutate(editing)} disabled={saveMut.isPending} className="bg-gold text-gold-foreground hover:bg-gold/90">
              {saveMut.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
