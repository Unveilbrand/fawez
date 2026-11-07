import { Suspense } from "react";
import EditBlogClient from "./EditBlogClient";

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#F5F6FA]">
          <p className="text-sm text-gray-500">Loading…</p>
        </main>
      }
    >
      <EditBlogClient params={params} />
    </Suspense>
  );
}
