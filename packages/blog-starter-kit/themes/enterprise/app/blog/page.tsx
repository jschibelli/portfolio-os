import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { format } from "date-fns";

const prisma = new PrismaClient();

export default async function BlogIndex() {
  try {
    const posts = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        visibility: "PUBLIC",
      },
      orderBy: { publishedAt: "desc" },
      select: {
        title: true,
        subtitle: true,
        slug: true,
        excerpt: true,
        publishedAt: true,
        readingMinutes: true,
        views: true,
        author: {
          select: {
            name: true,
          },
        },
        cover: {
          select: {
            url: true,
            alt: true,
          },
        },
      },
    });

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Blog
            </h1>
            <p className="text-xl text-gray-600">
              Insights, tutorials, and thoughts on technology
            </p>
          </header>

          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="border-b border-gray-200 pb-8 last:border-b-0"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {post.cover && (
                    <div className="md:col-span-1">
                      <img
                        src={post.cover.url}
                        alt={post.cover.alt || post.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  <div className={`${post.cover ? 'md:col-span-2' : 'md:col-span-3'}`}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="block group"
                    >
                      <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                        {post.title}
                      </h2>
                      {post.subtitle && (
                        <h3 className="text-lg text-gray-700 mb-3">
                          {post.subtitle}
                        </h3>
                      )}
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        {post.author?.name && (
                          <span>By {post.author.name}</span>
                        )}
                        {post.publishedAt && (
                          <time dateTime={post.publishedAt.toISOString()}>
                            {format(post.publishedAt, "MMM d, yyyy")}
                          </time>
                        )}
                        {post.readingMinutes && (
                          <span>{post.readingMinutes} min read</span>
                        )}
                        {post.views > 0 && (
                          <span>{post.views} views</span>
                        )}
                      </div>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No published articles yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Blog
          </h1>
          <p className="text-gray-600">
            Unable to load blog posts at the moment. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}


