"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { Blog } from "@/lib/blogs";

type Section = { subtitle: string; body: string };

const field =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-primary/30";

export default function BlogForm({ blog }: { blog?: Blog }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(blog?.title ?? "");
  const [author, setAuthor] = useState(blog?.author ?? "");
  const [sections, setSections] = useState<Section[]>(
    blog?.content?.map((s) => ({
      subtitle: s.subtitle,
      body: s.paragraphs.join("\n\n"),
    })) ?? [{ subtitle: "", body: "" }]
  );
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(blog?.image_url ?? null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function updateSection(i: number, patch: Partial<Section>) {
    setSections((prev) => prev.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  }

  function onPickImage(file: File | undefined) {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const content = sections
      .map((s) => ({
        subtitle: s.subtitle.trim(),
        paragraphs: s.body
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter(Boolean),
      }))
      .filter((s) => s.subtitle || s.paragraphs.length);

    if (!image && !blog?.image_url) {
      setError("Please choose a featured image.");
      return;
    }
    if (!content.length) {
      setError("Add at least one content section.");
      return;
    }

    setSaving(true);
    try {
      const {
        data: { session },
      } = await getSupabaseBrowser().auth.getSession();

      const form = new FormData();
      form.set("title", title.trim());
      form.set("author", author.trim());
      form.set("content", JSON.stringify(content));
      if (image) form.set("image", image);

      const res = await fetch(blog ? `/api/admin/blogs/${blog.id}` : "/api/admin/blogs", {
        method: blog ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${session?.access_token ?? ""}` },
        body: form,
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Could not save the blog.");
        return;
      }
      router.push("/admin/blogs");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-primary">{blog ? "Edit Blog" : "Create Blog"}</h1>
        <Link href="/admin/blogs" className="text-sm text-gray-500 hover:text-primary">
          ← Back to blogs
        </Link>
      </div>

      <div className="mt-6 space-y-6 rounded-xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="blog-title" className="mb-2 block text-sm font-medium text-black">
              Blog Title*
            </label>
            <input
              id="blog-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="How To Talk To Aging Parents About Home Care."
              className={field}
            />
          </div>
          <div>
            <label htmlFor="blog-author" className="mb-2 block text-sm font-medium text-black">
              Author*
            </label>
            <input
              id="blog-author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              placeholder="Eric Carter"
              className={field}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-black">Featured Image*</label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onPickImage(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-200 px-4 py-6 text-sm text-gray-500 transition-colors hover:border-primary/40 hover:text-primary"
          >
            {preview ? "Change image" : "Click to upload featured image"}
          </button>
          {preview && (
            <div className="relative mt-3 aspect-[16/9] w-full max-w-md overflow-hidden rounded-lg">
              <Image src={preview} alt="Featured preview" fill unoptimized className="object-cover" />

            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-black">Blog Content*</label>
            <button
              type="button"
              onClick={() => setSections((prev) => [...prev, { subtitle: "", body: "" }])}
              className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add Section
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-400">
            Each section has an optional subtitle (shown in the brand color) followed by paragraphs.
            Separate paragraphs with a blank line.
          </p>

          <div className="mt-4 space-y-4">
            {sections.map((section, i) => (
              <div key={i} className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-gray-400">
                    Section {i + 1}
                  </span>
                  {sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setSections((prev) => prev.filter((_, j) => j !== i))}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  value={section.subtitle}
                  onChange={(e) => updateSection(i, { subtitle: e.target.value })}
                  placeholder="Subtitle (optional) — e.g. Understand Your Parent's Feelings"
                  className={`${field} mt-3`}
                />
                <textarea
                  value={section.body}
                  onChange={(e) => updateSection(i, { body: e.target.value })}
                  placeholder="Write this section's paragraphs here. Leave a blank line between paragraphs."
                  rows={5}
                  className={`${field} mt-3 resize-y`}
                />
              </div>
            ))}
          </div>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-primary py-4 text-sm font-bold uppercase text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {saving ? "Saving…" : blog ? "Save Changes" : "Publish Blog"}
        </button>
      </div>
    </form>
  );
}
