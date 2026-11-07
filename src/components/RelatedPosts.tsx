import { getBlogs, formatBlogDate } from "@/lib/blogs";
import { Card } from "@/components/Blogs";

export default async function RelatedPosts({ slugPromise }: { slugPromise: Promise<string> }) {
  const excludeSlug = await slugPromise;
  const blogs = (await getBlogs()).filter((b) => b.slug !== excludeSlug).slice(0, 3);

  if (blogs.length === 0) return null;

  return (
    <section className="pb-16 md:pb-24">
      <div className="site-container">
        <div className="flex items-center justify-center gap-6">
          <span className="h-px w-16 bg-gray-300 sm:w-28" />
          <p className="text-sm font-medium uppercase text-primary">Other Related Blogs</p>
          <span className="h-px w-16 bg-gray-300 sm:w-28" />
        </div>
        <h2 className="mx-auto mt-6 max-w-[560px] text-center text-3xl font-bold text-black sm:text-4xl lg:text-[36px]">
          Compassionate Support for Every Part of Daily Living
        </h2>

        <div className="mx-auto mt-12 grid max-w-[1100px] gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-8">
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
        </div>
      </div>
    </section>
  );
}
