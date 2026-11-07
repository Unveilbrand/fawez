import { createClient } from "@supabase/supabase-js";

export type BlogSection = {
  subtitle: string;
  paragraphs: string[];
};

export type Blog = {
  id: string;
  title: string;
  slug: string;
  author: string;
  image_path: string | null;
  image_url: string | null;
  content: BlogSection[];
  created_at: string;
  updated_at: string;
};

// Public reads use the anon key; the blogs table has a public SELECT policy.
function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function getBlogs(limit?: number): Promise<Blog[]> {
  let query = getClient()
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) return [];
  return (data ?? []) as Blog[];
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const { data } = await getClient()
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return (data as Blog) ?? null;
}

export function formatBlogDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
