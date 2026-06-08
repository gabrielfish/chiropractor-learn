import { useRef, useState, type DragEvent } from "react";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  accept: string;
  onFile: (file: File) => Promise<void> | void;
  uploaded?: boolean;
  hint?: string;
}

export function FileDropzone({ label, accept, onFile, uploaded, hint }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);

  const handle = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      await onFile(file);
    } finally {
      setBusy(false);
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    void handle(e.dataTransfer.files?.[0]);
  };

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
      className={cn(
        "w-full rounded-md border-2 border-dashed px-4 py-6 flex flex-col items-center justify-center gap-2 text-sm transition-colors cursor-pointer",
        drag ? "border-gold bg-gold/5" : "border-border bg-background hover:border-gold/60",
        busy && "opacity-70 cursor-wait",
      )}
    >
      {busy ? (
        <Loader2 className="h-5 w-5 animate-spin text-gold" />
      ) : uploaded ? (
        <CheckCircle2 className="h-5 w-5 text-success" />
      ) : (
        <Upload className="h-5 w-5 text-muted-foreground" />
      )}
      <span className="font-medium text-foreground">
        {busy ? "Uploading…" : uploaded ? "Uploaded — click to replace" : label}
      </span>
      {hint && !busy && <span className="text-xs text-muted-foreground">{hint}</span>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => { void handle(e.target.files?.[0] ?? undefined); e.target.value = ""; }}
      />
    </button>
  );
}
