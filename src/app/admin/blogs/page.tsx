"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { formatBlogDate, type Blog } from "@/lib/blogs";

function BlogsDashboard() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Blog | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await getSupabaseBrowser()
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });
      setBlogs((data ?? []) as Blog[]);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return blogs;
    return blogs.filter(
      (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    );
  }, [blogs, query]);

  async function remove(blog: Blog) {
    setDeleting(blog.id);
    setError(null);
    try {
      const {
        data: { session },
      } = await getSupabaseBrowser().auth.getSession();
      const res = await fetch(`/api/admin/blogs/${blog.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.access_token ?? ""}` },
      });
      if (!res.ok) {
        const { error: msg } = await res.json();
        setError(msg ?? "Delete failed");
        return;
      }
      setBlogs((prev) => prev.filter((b) => b.id !== blog.id));
      setPendingDelete(null);
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-primary">Blogs</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or author"
              className="w-56 rounded-lg border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-primary/30 sm:w-72"
            />
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </div>
          <Link
            href="/admin/blogs/new"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Create Blog
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </Link>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 overflow-x-auto rounded-xl bg-white p-2 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs uppercase text-gray-400">
              <th className="px-4 py-3 font-medium">Blog</th>
              <th className="px-4 py-3 font-medium">Author</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-gray-400">
                  Loading blogs…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-gray-400">
                  {blogs.length === 0 ? "No blogs yet. Create your first one." : "No blogs match your search."}
                </td>
              </tr>
            ) : (
              filtered.map((blog) => (
                <tr key={blog.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {blog.image_url ? (
                        <Image
                          src={blog.image_url}
                          alt=""
                          width={56}
                          height={40}
                          className="size-10 shrink-0 rounded-md object-cover"
                        />
                      ) : (
                        <span className="size-10 shrink-0 rounded-md bg-gray-100" />
                      )}
                      <div className="min-w-0">
                        <p className="max-w-[320px] truncate font-medium text-black">{blog.title}</p>
                        <p className="text-xs text-gray-400">/{blog.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-black">{blog.author}</td>
                  <td className="px-4 py-3 text-black">{formatBlogDate(blog.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/blogs/${blog.slug}`}
                        target="_blank"
                        aria-label="View blog"
                        className="text-gray-400 transition-colors hover:text-primary"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </Link>
                      <Link
                        href={`/admin/blogs/${blog.id}/edit`}
                        aria-label="Edit blog"
                        className="text-gray-400 transition-colors hover:text-primary"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                        </svg>
                      </Link>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(blog)}
                        disabled={deleting === blog.id}
                        aria-label="Delete blog"
                        className="text-gray-400 transition-colors hover:text-red-600 disabled:opacity-50"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pendingDelete && (
        <ConfirmDelete
          title="Delete Blog"
          message={`Deleting "${pendingDelete.title}" will permanently remove it and its featured image. This action cannot be undone.`}
          loading={deleting === pendingDelete.id}
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => remove(pendingDelete)}
        />
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminShell>
      <BlogsDashboard />
    </AdminShell>
  );
}
