import { supabase } from "@/integrations/supabase/client";

// 100 years in seconds — effectively permanent for our purposes
const LONG_EXPIRY = 60 * 60 * 24 * 365 * 100;

function extOf(name: string) {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "bin";
}

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const path = `${userId}/${Date.now()}.${extOf(file.name)}`;
  const { error } = await supabase.storage.from("avatars").upload(path, file, {
    upsert: true,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  const { data, error: signErr } = await supabase.storage
    .from("avatars")
    .createSignedUrl(path, LONG_EXPIRY);
  if (signErr || !data) throw signErr ?? new Error("Failed to sign avatar URL");
  return data.signedUrl;
}

export async function uploadContentFile(
  kind: "pdf" | "thumbnail" | "video",
  file: File,
): Promise<string> {
  const path = `${kind}/${crypto.randomUUID()}.${extOf(file.name)}`;
  const { error } = await supabase.storage.from("content-files").upload(path, file, {
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  const { data, error: signErr } = await supabase.storage
    .from("content-files")
    .createSignedUrl(path, LONG_EXPIRY);
  if (signErr || !data) throw signErr ?? new Error("Failed to sign file URL");
  return data.signedUrl;
}

export function youtubeThumbnail(url: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (!m) return null;
  return `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`;
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
