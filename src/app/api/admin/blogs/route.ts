import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/supabase/verify-admin";
import {
  BLOG_IMAGE_BUCKET,
  parseSections,
  slugify,
  uploadBlogImage,
} from "@/lib/blog-admin";

// POST /api/admin/blogs — create a blog (multipart form: title, author, content, image)
export async function POST(request: Request) {
  const { supabase, error } = await verifyAdmin(request);
  if (error) return error;

  const form = await request.formData();
  const title = String(form.get("title") ?? "").trim();
  const author = String(form.get("author") ?? "").trim();
  const content = parseSections(form.get("content"));
  const image = form.get("image");

  if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
  if (!author) return NextResponse.json({ error: "Author is required" }, { status: 400 });
  if (!content.length)
    return NextResponse.json({ error: "Blog content is required" }, { status: 400 });
  if (!(image instanceof File) || image.size === 0)
    return NextResponse.json({ error: "A featured image is required" }, { status: 400 });

  const base = slugify(title) || "post";
  let slug = base;
  for (let i = 2; ; i++) {
    const { data } = await supabase!.from("blogs").select("id").eq("slug", slug).maybeSingle();
    if (!data) break;
    slug = `${base}-${i}`;
  }

  const uploaded = await uploadBlogImage(supabase!, image, slug);
  if (uploaded.error)
    return NextResponse.json({ error: uploaded.error.message }, { status: 500 });

  const { data, error: insertError } = await supabase!
    .from("blogs")
    .insert({
      title,
      slug,
      author,
      content,
      image_path: uploaded.path,
      image_url: uploaded.publicUrl,
    })
    .select()
    .single();

  if (insertError) {
    await supabase!.storage.from(BLOG_IMAGE_BUCKET).remove([uploaded.path!]);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ blog: data }, { status: 201 });
}
