import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Metadata } from "next";
import { TiptapRenderer } from "../../../components/blog/TiptapRenderer";

const prisma = new PrismaClient();

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await prisma.article.findUnique({
    where: {
      slug: params.slug,
      status: "PUBLISHED",
      visibility: "PUBLIC",
    },
    select: {
      title: true,
      subtitle: true,
      excerpt: true,
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

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt || post.subtitle || `Read ${post.title} by ${post.author?.name || "our team"}`,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.subtitle,
      type: "article",
      images: post.cover ? [post.cover.url] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || post.subtitle,
      images: post.cover ? [post.cover.url] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await prisma.article.findUnique({
    where: {
      slug: params.slug,
      status: "PUBLISHED",
      visibility: "PUBLIC",
    },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
      cover: true,
      tags: {
        include: {
          tag: true,
        },
      },
      series: true,
    },
  });

  if (!post) {
    notFound();
  }

  // Increment view count (in production, you might want to do this asynchronously)
  try {
    await prisma.article.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });
  } catch (error) {
    console.error("Failed to increment view count:", error);
  }

  return (
    <article className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          {post.cover && (
            <div className="mb-6">
              <img
                src={post.cover.url}
                alt={post.cover.alt || post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg"
              />
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          {post.subtitle && (
            <h2 className="text-xl md:text-2xl text-gray-700 mb-6">
              {post.subtitle}
            </h2>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            {post.author?.name && (
              <span>By {post.author.name}</span>
            )}
            {post.publishedAt && (
              <time dateTime={post.publishedAt.toISOString()}>
                {format(post.publishedAt, "MMMM d, yyyy")}
              </time>
            )}
            {post.readingMinutes && (
              <span>{post.readingMinutes} min read</span>
            )}
            {post.views > 0 && (
              <span>{post.views} views</span>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map(({ tag }) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {post.contentJson ? (
            <TiptapRenderer content={post.contentJson} />
          ) : post.contentMdx ? (
            <div
              dangerouslySetInnerHTML={{
                __html: post.contentMdx,
              }}
            />
          ) : (
            <p className="text-gray-600 italic">
              No content available for this article.
            </p>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          {post.series && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Part of the series:{" "}
                <span className="font-medium text-gray-900">
                  {post.series.title}
                </span>
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {post.author?.name && (
                <p>Written by {post.author.name}</p>
              )}
            </div>

            <div className="text-sm text-gray-600">
              <p>Last updated: {format(post.updatedAt, "MMM d, yyyy")}</p>
            </div>
          </div>
        </footer>
      </div>
    </article>
  );
}


