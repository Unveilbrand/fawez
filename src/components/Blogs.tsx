import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { getBlogs, formatBlogDate } from "@/lib/blogs";
import Carousel from "@/components/Carousel";

export function Card({
  title,
  author,
  date,
  dateTime,
  image,
  href,
}: {
  title: string;
  author: string;
  date: string;
  dateTime: string;
  image: string | null;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-[#CFE3F7] bg-white p-1.5 transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
    >
      <div className="overflow-hidden rounded-xl">
        {image ? (
          <Image
            src={image}
            alt=""
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
          <time dateTime={dateTime}>{date}</time>
        </div>
      </div>
    </Link>
  );
}

async function PostGrid() {
  const blogs = await getBlogs(3);

  if (blogs.length === 0) {
    return (
      <p className="mt-12 text-center text-gray-500 lg:mt-16">
        No posts yet — check back later.
      </p>
    );
  }

  return (
    <Carousel className="mx-auto mt-12 max-w-[1100px] lg:mt-16" itemLabel="post">
      {blogs.map((blog) => (
        <Card
          key={blog.id}
          title={blog.title}
          author={blog.author}
          date={formatBlogDate(blog.created_at)}
          dateTime={blog.created_at}
          image={blog.image_url}
          href={`/blogs/${blog.slug}`}
        />
      ))}
    </Carousel>
  );
}

export default function Blogs() {
  return (
    <section className="py-16 md:py-24">
      <div className="site-container">
        <div className="flex items-center justify-center gap-6">
          <span className="h-px w-16 bg-gray-300 sm:w-28" />
          <p className="text-sm font-medium uppercase text-primary">Blogs and Updates</p>
          <span className="h-px w-16 bg-gray-300 sm:w-28" />
        </div>
        <h2 className="mx-auto mt-6 max-w-[520px] text-center text-3xl font-bold text-black sm:text-4xl lg:text-[36px]">
          Compassionate Support for Every Part of Daily Living
        </h2>

        <Suspense
          fallback={
            <div className="mx-auto mt-12 grid max-w-[1100px] gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-8">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="aspect-[420/250] animate-pulse rounded-2xl border border-[#CFE3F7] bg-[#F3F8FF]"
                />
              ))}
            </div>
          }
        >
          <PostGrid />
        </Suspense>
      </div>
    </section>
  );
}
