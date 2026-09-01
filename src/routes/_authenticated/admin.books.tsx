import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { listBooks, saveChapter, deleteChapter } from "@/lib/books.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { BookOpen, Plus, Pencil, Trash2, Loader2, ChevronDown, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/books")({
  head: () => ({ meta: [{ title: "Book Content — DCPG Admin" }] }),
  beforeLoad: ({ context }) => {
    const roles = (context as { roles?: string[] }).roles ?? [];
    if (!roles.includes("super_admin")) throw redirect({ to: "/dashboard" });
  },
  component: BooksPage,
});

type Chapter = {
  id: string;
  book_title: string;
  chapter_title: string | null;
  order_index: number;
  created_at: string;
};

const EMPTY_FORM = {
  id: undefined as string | undefined,
  book_title: "",
  chapter_title: "",
  content_text: "",
  order_index: 0,
};

function BooksPage() {
  const listFn = useServerFn(listBooks);
  const saveFn = useServerFn(saveChapter);
  const deleteFn = useServerFn(deleteChapter);
  const qc = useQueryClient();

  const [form, setForm] = useState(EMPTY_FORM);
  const [expandedBooks, setExpandedBooks] = useState<Set<string>>(new Set());
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const booksQ = useQuery({
    queryKey: ["admin", "books"],
    queryFn: () => listFn(),
  });

  const saveMut = useMutation({
    mutationFn: () =>
      saveFn({
        data: {
          id: form.id,
          book_title: form.book_title,
          chapter_title: form.chapter_title || null,
          content_text: form.content_text,
          order_index: form.order_index,
        },
      }),
    onSuccess: () => {
      toast.success(form.id ? "Chapter updated" : "Chapter saved");
      setForm(EMPTY_FORM);
      qc.invalidateQueries({ queryKey: ["admin", "books"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => {
      setDeletingId(id);
      return deleteFn({ data: { id } });
    },
    onSuccess: () => {
      toast.success("Chapter deleted");
      setDeletingId(null);
      qc.invalidateQueries({ queryKey: ["admin", "books"] });
    },
    onError: (e: Error) => { setDeletingId(null); toast.error(e.message); },
  });

  const chapters = (booksQ.data ?? []) as Chapter[];

  // Group by book_title
  const books = chapters.reduce<Record<string, Chapter[]>>((acc, ch) => {
    (acc[ch.book_title] ??= []).push(ch);
    return acc;
  }, {});

  const toggleBook = (title: string) => {
    setExpandedBooks((prev) => {
      const next = new Set(prev);
      next.has(title) ? next.delete(title) : next.add(title);
      return next;
    });
  };

  const editChapter = (ch: Chapter & { content_text?: string }) => {
    setForm({
      id: ch.id,
      book_title: ch.book_title,
      chapter_title: ch.chapter_title ?? "",
      content_text: ch.content_text ?? "",
      order_index: ch.order_index,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalChapters = chapters.length;
  const totalBooks = Object.keys(books).length;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <AdminSidebar active="settings" />

      <main className="flex-1 pt-14 px-4 pb-4 sm:px-6 sm:pb-6 md:p-10 overflow-x-hidden min-w-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <BookOpen className="h-7 w-7 text-primary" />
            <h1 className="font-display text-3xl font-extrabold">Book Content</h1>
          </div>
          <p className="text-muted-foreground mb-8">
            Paste Ryan's written teaching content here. Each chapter is indexed and searchable by Claude via the MCP <code className="text-xs bg-muted px-1 py-0.5 rounded">get_book_content</code> tool.
            {totalBooks > 0 && ` ${totalBooks} book${totalBooks !== 1 ? "s" : ""}, ${totalChapters} chapter${totalChapters !== 1 ? "s" : ""} stored.`}
          </p>

          {/* ── Add / Edit form ────────────────────────────────────────────── */}
          <div className="rounded-xl bg-card border border-border p-6 shadow-card mb-8">
            <h2 className="font-display text-lg font-bold mb-4">
              {form.id ? "Edit Chapter" : "Add Chapter"}
            </h2>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="book_title">Book Title</Label>
                  <Input
                    id="book_title"
                    placeholder="e.g. The New Patient Avalanche"
                    value={form.book_title}
                    onChange={(e) => setForm((f) => ({ ...f, book_title: e.target.value }))}
                    maxLength={300}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="chapter_title">Chapter Title (optional)</Label>
                  <Input
                    id="chapter_title"
                    placeholder="e.g. Chapter 1: The Foundation"
                    value={form.chapter_title}
                    onChange={(e) => setForm((f) => ({ ...f, chapter_title: e.target.value }))}
                    maxLength={300}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="order_index">Order (within book)</Label>
                <Input
                  id="order_index"
                  type="number"
                  min={0}
                  className="w-32"
                  value={form.order_index}
                  onChange={(e) => setForm((f) => ({ ...f, order_index: Math.max(0, Number(e.target.value) || 0) }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="content_text">Chapter Content</Label>
                <Textarea
                  id="content_text"
                  placeholder="Paste the full chapter text here…"
                  rows={16}
                  value={form.content_text}
                  onChange={(e) => setForm((f) => ({ ...f, content_text: e.target.value }))}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  {form.content_text.length.toLocaleString()} characters
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => saveMut.mutate()}
                  disabled={saveMut.isPending || !form.book_title.trim() || !form.content_text.trim()}
                  className="inline-flex items-center gap-2"
                >
                  {saveMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {saveMut.isPending ? "Saving…" : form.id ? "Update Chapter" : "Save Chapter"}
                </Button>
                {form.id && (
                  <Button variant="outline" onClick={() => setForm(EMPTY_FORM)}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* ── Existing chapters grouped by book ─────────────────────────── */}
          {booksQ.isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-8">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          )}

          {!booksQ.isLoading && totalChapters === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No book content yet. Add the first chapter above.</p>
            </div>
          )}

          <div className="space-y-3">
            {Object.entries(books).map(([bookTitle, chs]) => {
              const isOpen = expandedBooks.has(bookTitle);
              return (
                <div key={bookTitle} className="rounded-xl border border-border bg-card overflow-hidden">
                  <button
                    onClick={() => toggleBook(bookTitle)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                      <span className="font-semibold text-foreground">{bookTitle}</span>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {chs.length} chapter{chs.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-border divide-y divide-border">
                      {chs.map((ch) => (
                        <div key={ch.id} className="flex items-center justify-between px-5 py-3 gap-4">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              <span className="text-muted-foreground mr-2">#{ch.order_index}</span>
                              {ch.chapter_title ?? <span className="italic text-muted-foreground">No chapter title</span>}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => editChapter(ch as any)}
                              className="h-8 w-8 p-0"
                              title="Edit"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                if (confirm(`Delete "${ch.chapter_title ?? "this chapter"}"?`)) {
                                  deleteMut.mutate(ch.id);
                                }
                              }}
                              disabled={deletingId === ch.id}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              title="Delete"
                            >
                              {deletingId === ch.id
                                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                : <Trash2 className="h-3.5 w-3.5" />}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
