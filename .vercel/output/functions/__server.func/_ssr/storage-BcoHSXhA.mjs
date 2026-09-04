import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as cn } from "./button-BXrfXN_b.mjs";
import { s as supabase } from "./client-IF66mSk9.mjs";
import { L as LoaderCircle, o as CircleCheck, t as Upload } from "../_libs/lucide-react.mjs";
const Textarea = reactExports.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";
function FileDropzone({ label, accept, onFile, uploaded, hint }) {
  const inputRef = reactExports.useRef(null);
  const [busy, setBusy] = reactExports.useState(false);
  const [drag, setDrag] = reactExports.useState(false);
  const handle = async (file) => {
    if (!file) return;
    setBusy(true);
    try {
      await onFile(file);
    } finally {
      setBusy(false);
    }
  };
  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    void handle(e.dataTransfer.files?.[0]);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: () => inputRef.current?.click(),
      onDragOver: (e) => {
        e.preventDefault();
        setDrag(true);
      },
      onDragLeave: () => setDrag(false),
      onDrop,
      className: cn(
        "w-full rounded-md border-2 border-dashed px-4 py-6 flex flex-col items-center justify-center gap-2 text-sm transition-colors cursor-pointer",
        drag ? "border-gold bg-gold/5" : "border-border bg-background hover:border-gold/60",
        busy && "opacity-70 cursor-wait"
      ),
      children: [
        busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-gold" }) : uploaded ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5 text-success" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-5 w-5 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: busy ? "Uploading…" : uploaded ? "Uploaded — click to replace" : label }),
        hint && !busy && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: hint }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: inputRef,
            type: "file",
            accept,
            className: "hidden",
            onChange: (e) => {
              void handle(e.target.files?.[0] ?? void 0);
              e.target.value = "";
            }
          }
        )
      ]
    }
  );
}
const LONG_EXPIRY = 60 * 60 * 24 * 365 * 100;
function extOf(name) {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "bin";
}
async function uploadAvatar(userId, file) {
  const path = `${userId}/${Date.now()}.${extOf(file.name)}`;
  const { error } = await supabase.storage.from("avatars").upload(path, file, {
    upsert: true,
    contentType: file.type || void 0
  });
  if (error) throw error;
  const { data, error: signErr } = await supabase.storage.from("avatars").createSignedUrl(path, LONG_EXPIRY);
  if (signErr || !data) throw signErr ?? new Error("Failed to sign avatar URL");
  return data.signedUrl;
}
async function uploadContentFile(kind, file) {
  const path = `${kind}/${crypto.randomUUID()}.${extOf(file.name)}`;
  const { error } = await supabase.storage.from("content-files").upload(path, file, {
    upsert: false,
    contentType: file.type || void 0
  });
  if (error) throw error;
  const { data, error: signErr } = await supabase.storage.from("content-files").createSignedUrl(path, LONG_EXPIRY);
  if (signErr || !data) throw signErr ?? new Error("Failed to sign file URL");
  return data.signedUrl;
}
function youtubeThumbnail(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (!m) return null;
  return `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`;
}
function slugify(s) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}
export {
  FileDropzone as F,
  Textarea as T,
  uploadContentFile as a,
  slugify as s,
  uploadAvatar as u,
  youtubeThumbnail as y
};
