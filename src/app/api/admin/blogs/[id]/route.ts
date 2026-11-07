import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/supabase/verify-admin";
import { BLOG_IMAGE_BUCKET, parseSections, uploadBlogImage } from "@/lib/blog-admin";

// PUT /api/admin/blogs/[id] — update a blog; optional new image replaces + removes the old one
export async function PUT(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { supabase, error } = await verifyAdmin(request);
  if (error) return error;

  const { id } = await ctx.params;
  const { data: existing } = await supabase!
    .from("blogs")
    .select("id, image_path")
    .eq("id", id)
    .maybeSingle();
  if (!existing) return NextResponse.json({ error: "Blog not found" }, { status: 404 });

  const form = await request.formData();
  const title = String(form.get("title") ?? "").trim();
  const author = String(form.get("author") ?? "").trim();
  const content = parseSections(form.get("content"));
  const image = form.get("image");

  if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
  if (!author) return NextResponse.json({ error: "Author is required" }, { status: 400 });
  if (!content.length)
    return NextResponse.json({ error: "Blog content is required" }, { status: 400 });

  const updates: Record<string, unknown> = { title, author, content };

  if (image instanceof File && image.size > 0) {
    const uploaded = await uploadBlogImage(supabase!, image, id);
    if (uploaded.error)
      return NextResponse.json({ error: uploaded.error.message }, { status: 500 });
    updates.image_path = uploaded.path;
    updates.image_url = uploaded.publicUrl;
  }

  const { data, error: updateError } = await supabase!
    .from("blogs")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    if (updates.image_path)
      await supabase!.storage.from(BLOG_IMAGE_BUCKET).remove([updates.image_path as string]);
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Remove the replaced image from storage
  if (updates.image_path && existing.image_path) {
    await supabase!.storage.from(BLOG_IMAGE_BUCKET).remove([existing.image_path]);
  }

  return NextResponse.json({ blog: data });
}

// DELETE /api/admin/blogs/[id] — removes the row and its storage image
export async function DELETE(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { supabase, error } = await verifyAdmin(request);
  if (error) return error;

  const { id } = await ctx.params;
  const { data: existing } = await supabase!
    .from("blogs")
    .select("id, image_path")
    .eq("id", id)
    .maybeSingle();
  if (!existing) return NextResponse.json({ error: "Blog not found" }, { status: 404 });

  const { error: deleteError } = await supabase!.from("blogs").delete().eq("id", id);
  if (deleteError)
    return NextResponse.json({ error: deleteError.message }, { status: 500 });

  if (existing.image_path) {
    await supabase!.storage.from(BLOG_IMAGE_BUCKET).remove([existing.image_path]);
  }

  return NextResponse.json({ ok: true });
}
