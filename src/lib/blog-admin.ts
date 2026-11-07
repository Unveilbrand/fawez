import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const BLOG_IMAGE_BUCKET = "blog-images";

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function parseSections(raw: FormDataEntryValue | null) {
  try {
    const parsed = JSON.parse(String(raw ?? "[]"));
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((s) => ({
        subtitle: String(s?.subtitle ?? "").trim(),
        paragraphs: (Array.isArray(s?.paragraphs) ? s.paragraphs : [])
          .map((p: unknown) => String(p).trim())
          .filter(Boolean),
      }))
      .filter((s) => s.subtitle || s.paragraphs.length);
  } catch {
    return [];
  }
}

export async function uploadBlogImage(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  file: File,
  name: string
) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${name}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from(BLOG_IMAGE_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) return { error };
  const {
    data: { publicUrl },
  } = supabase.storage.from(BLOG_IMAGE_BUCKET).getPublicUrl(path);
  return { path, publicUrl };
}
