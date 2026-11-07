import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import PageBanner from "@/components/PageBanner";
import Consultation from "@/components/Consultation";
import Footer from "@/components/Footer";
import { getBlogs, formatBlogDate } from "@/lib/blogs";

async function BlogGrid() {
  const blogs = await getBlogs();

  if (blogs.length === 0) {
    return (
      <p className="mt-12 text-center text-gray-500">
        No posts yet — check back soon.
      </p>
    );
  }

  return (
    <div className="mx-auto mt-12 grid max-w-[1100px] gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-8">
      {blogs.map(({ id, title, author, created_at, image_url, slug }) => (
        <Link
          key={id}
          href={`/blogs/${slug}`}
          className="group block rounded-2xl border border-[#CFE3F7] bg-white p-1.5 transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
        >
          <div className="overflow-hidden rounded-xl">
            {image_url ? (
              <Image
                src={image_url}
                alt={title}
                width={420}
                height={250}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="aspect-[420/250] w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="aspect-[420/250] w-full bg-[#B2DAFF]" />
            )}
          </div>
          <div className="px-4 pt-5 pb-8">
            <h3 className="text-base leading-snug text-black lg:text-lg">{title}</h3>
            <div className="mt-3 flex items-center gap-5 text-xs text-black">
              <span className="italic">{author}</span>
              <time dateTime={created_at}>{formatBlogDate(created_at)}</time>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function BlogsPage() {
  return (
    <main className="flex-1">
      <Navbar />
      <PageBanner
        title="Blogs"
        subtitle="More Than Helping Hands, We Bring Comfort, Care, and Peace of Mind."
        image="/images/blog_bg.png"
        alt="Stack of medical books with a stethoscope"
      />
      <section className="py-16 md:py-24">
        <div className="site-container">
          <h2 className="mx-auto max-w-[560px] text-center text-3xl font-bold text-black sm:text-4xl lg:text-[36px]">
            Compassionate Support for Every Part of Daily Living
          </h2>
          <Suspense
            fallback={
              <p className="mt-12 text-center text-sm text-gray-400">Loading posts…</p>
            }
          >
            <BlogGrid />
          </Suspense>
        </div>
      </section>
      <Consultation />
      <Footer />
    </main>
  );
}
