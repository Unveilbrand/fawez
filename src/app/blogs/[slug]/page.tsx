import Image from "next/image";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Consultation from "@/components/Consultation";
import Footer from "@/components/Footer";
import { getBlogBySlug, formatBlogDate } from "@/lib/blogs";

async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) notFound();

  return (
    <>
      {/* Banner: featured image */}
      <section className="relative isolate h-[460px] overflow-hidden md:h-[520px]">
        {blog.image_url && (
          <Image
            src={blog.image_url}
            alt={blog.title}
            fill
            preload
            sizes="100vw"
            className="-z-10 object-cover"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,#930965_0%,#930965_15%,#930965B3_35%,#93096559_55%,transparent_75%)]" />
        <div className="absolute inset-x-0 bottom-12">
          <div className="site-container flex flex-col gap-4 text-white sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm">
                <span className="italic">{blog.author}</span>
                <span className="mx-3 inline-block h-3 w-px bg-white/70 align-middle" />
                <time dateTime={blog.created_at}>{formatBlogDate(blog.created_at)}</time>
              </p>
              <h1 className="mt-2 max-w-[720px] text-3xl font-bold sm:text-4xl lg:text-5xl">
                {blog.title}
              </h1>
            </div>
            <p className="max-w-[320px] text-sm leading-snug sm:text-right">
              More Than Helping Hands, We Bring Comfort, Care, and Peace of Mind.
            </p>
          </div>
        </div>
      </section>

      {/* Article body */}
      <article className="py-14 md:py-20">
        <div className="site-container max-w-[860px]">
          {blog.content.map((section, i) => (
            <section key={i} className={i > 0 ? "mt-10" : ""}>
              {section.subtitle && (
                <h2 className="text-xl font-bold text-primary sm:text-2xl">
                  {section.subtitle}
                </h2>
              )}
              {section.paragraphs.map((p, j) => (
                <p
                  key={j}
                  className={`leading-relaxed text-[#4a4a4a] ${section.subtitle || j > 0 ? "mt-4" : ""}`}
                >
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>
    </>
  );
}

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <main className="flex-1">
      <Suspense fallback={<div className="h-[72px]" />}>
        <Navbar />
      </Suspense>
      <Suspense
        fallback={
          <div className="flex h-[460px] items-center justify-center">
            <p className="text-sm text-gray-400">Loading post…</p>
          </div>
        }
      >
        <Article params={params} />
      </Suspense>
      <Consultation />
      <Footer />
    </main>
  );
}
