"use client";

import { use, useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import BlogForm from "@/components/admin/BlogForm";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { Blog } from "@/lib/blogs";

export default function EditBlogClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await getSupabaseBrowser()
        .from("blogs")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (data) setBlog(data as Blog);
      else setNotFound(true);
    })();
  }, [id]);

  return (
    <AdminShell>
      {blog ? (
        <BlogForm blog={blog} />
      ) : (
        <p className="text-sm text-gray-500">
          {notFound ? "Blog not found." : "Loading blog…"}
        </p>
      )}
    </AdminShell>
  );
}
