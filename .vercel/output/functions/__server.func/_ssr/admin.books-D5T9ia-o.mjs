import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { A as AdminSidebar } from "./AdminSidebar-B6Sw1hS_.mjs";
import { c as createSsrRpc } from "./createSsrRpc-D1HIuwD_.mjs";
import { a as createServerFn } from "./server-DAhjTOZR.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CINWQ1Vb.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { I as Input } from "./input-DwaGuH4D.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { T as Textarea } from "./textarea-BBisE2jS.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { B as BookOpen, L as LoaderCircle, z as Plus, n as ChevronDown, r as ChevronRight, H as Pencil, ab as Trash2 } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType, n as numberType } from "../_libs/zod.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "../_libs/isbot.mjs";
import "./client-IF66mSk9.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
const listBooks = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("f5b6ee29111170bd39f20fb34febf3d2d98e3666516a2f5584027ceb0881cddc"));
const chapterSchema = objectType({
  id: stringType().uuid().optional(),
  book_title: stringType().trim().min(1).max(300),
  chapter_title: stringType().trim().max(300).optional().nullable(),
  content_text: stringType().trim().min(1),
  order_index: numberType().int().min(0)
});
const saveChapter = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => chapterSchema.parse(d)).handler(createSsrRpc("c429422d71e5c800b44b02321e9e43324f1e29fa70658bd4c97fffe72643f22d"));
const deleteChapter = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  id: stringType().uuid()
}).parse(d)).handler(createSsrRpc("4ed937a7ac13aec98804bf324fb3ed866c82b4eb008f2ba6fd1fbf2ef649a916"));
const EMPTY_FORM = {
  id: void 0,
  book_title: "",
  chapter_title: "",
  content_text: "",
  order_index: 0
};
function BooksPage() {
  const listFn = useServerFn(listBooks);
  const saveFn = useServerFn(saveChapter);
  const deleteFn = useServerFn(deleteChapter);
  const qc = useQueryClient();
  const [form, setForm] = reactExports.useState(EMPTY_FORM);
  const [expandedBooks, setExpandedBooks] = reactExports.useState(/* @__PURE__ */ new Set());
  const [deletingId, setDeletingId] = reactExports.useState(null);
  const booksQ = useQuery({
    queryKey: ["admin", "books"],
    queryFn: () => listFn()
  });
  const saveMut = useMutation({
    mutationFn: () => saveFn({
      data: {
        id: form.id,
        book_title: form.book_title,
        chapter_title: form.chapter_title || null,
        content_text: form.content_text,
        order_index: form.order_index
      }
    }),
    onSuccess: () => {
      toast.success(form.id ? "Chapter updated" : "Chapter saved");
      setForm(EMPTY_FORM);
      qc.invalidateQueries({
        queryKey: ["admin", "books"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const deleteMut = useMutation({
    mutationFn: (id) => {
      setDeletingId(id);
      return deleteFn({
        data: {
          id
        }
      });
    },
    onSuccess: () => {
      toast.success("Chapter deleted");
      setDeletingId(null);
      qc.invalidateQueries({
        queryKey: ["admin", "books"]
      });
    },
    onError: (e) => {
      setDeletingId(null);
      toast.error(e.message);
    }
  });
  const chapters = booksQ.data ?? [];
  const books = chapters.reduce((acc, ch) => {
    (acc[ch.book_title] ??= []).push(ch);
    return acc;
  }, {});
  const toggleBook = (title) => {
    setExpandedBooks((prev) => {
      const next = new Set(prev);
      next.has(title) ? next.delete(title) : next.add(title);
      return next;
    });
  };
  const editChapter = (ch) => {
    setForm({
      id: ch.id,
      book_title: ch.book_title,
      chapter_title: ch.chapter_title ?? "",
      content_text: ch.content_text ?? "",
      order_index: ch.order_index
    });
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  const totalChapters = chapters.length;
  const totalBooks = Object.keys(books).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col md:flex-row bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AdminSidebar, { active: "settings" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 pt-14 px-4 pb-4 sm:px-6 sm:pb-6 md:p-10 overflow-x-hidden min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-7 w-7 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-extrabold", children: "Book Content" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground mb-8", children: [
        "Paste Ryan's written teaching content here. Each chapter is indexed and searchable by Claude via the MCP ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-xs bg-muted px-1 py-0.5 rounded", children: "get_book_content" }),
        " tool.",
        totalBooks > 0 && ` ${totalBooks} book${totalBooks !== 1 ? "s" : ""}, ${totalChapters} chapter${totalChapters !== 1 ? "s" : ""} stored.`
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-card border border-border p-6 shadow-card mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold mb-4", children: form.id ? "Edit Chapter" : "Add Chapter" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "book_title", children: "Book Title" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "book_title", placeholder: "e.g. The New Patient Avalanche", value: form.book_title, onChange: (e) => setForm((f) => ({
                ...f,
                book_title: e.target.value
              })), maxLength: 300 })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "chapter_title", children: "Chapter Title (optional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "chapter_title", placeholder: "e.g. Chapter 1: The Foundation", value: form.chapter_title, onChange: (e) => setForm((f) => ({
                ...f,
                chapter_title: e.target.value
              })), maxLength: 300 })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "order_index", children: "Order (within book)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "order_index", type: "number", min: 0, className: "w-32", value: form.order_index, onChange: (e) => setForm((f) => ({
              ...f,
              order_index: Math.max(0, Number(e.target.value) || 0)
            })) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "content_text", children: "Chapter Content" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "content_text", placeholder: "Paste the full chapter text here…", rows: 16, value: form.content_text, onChange: (e) => setForm((f) => ({
              ...f,
              content_text: e.target.value
            })), className: "font-mono text-sm" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              form.content_text.length.toLocaleString(),
              " characters"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => saveMut.mutate(), disabled: saveMut.isPending || !form.book_title.trim() || !form.content_text.trim(), className: "inline-flex items-center gap-2", children: [
              saveMut.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              saveMut.isPending ? "Saving…" : form.id ? "Update Chapter" : "Save Chapter"
            ] }),
            form.id && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setForm(EMPTY_FORM), children: "Cancel" })
          ] })
        ] })
      ] }),
      booksQ.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground py-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
        " Loading…"
      ] }),
      !booksQ.isLoading && totalChapters === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16 text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-12 w-12 mx-auto mb-3 opacity-20" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "No book content yet. Add the first chapter above." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: Object.entries(books).map(([bookTitle, chs]) => {
        const isOpen = expandedBooks.has(bookTitle);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggleBook(bookTitle), className: "w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/40 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            isOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: bookTitle }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full", children: [
              chs.length,
              " chapter",
              chs.length !== 1 ? "s" : ""
            ] })
          ] }) }),
          isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border divide-y divide-border", children: chs.map((ch) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-3 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground truncate", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground mr-2", children: [
                "#",
                ch.order_index
              ] }),
              ch.chapter_title ?? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic text-muted-foreground", children: "No chapter title" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", onClick: () => editChapter(ch), className: "h-8 w-8 p-0", title: "Edit", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", onClick: () => {
                if (confirm(`Delete "${ch.chapter_title ?? "this chapter"}"?`)) {
                  deleteMut.mutate(ch.id);
                }
              }, disabled: deletingId === ch.id, className: "h-8 w-8 p-0 text-destructive hover:text-destructive", title: "Delete", children: deletingId === ch.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
            ] })
          ] }, ch.id)) })
        ] }, bookTitle);
      }) })
    ] }) })
  ] });
}
export {
  BooksPage as component
};
