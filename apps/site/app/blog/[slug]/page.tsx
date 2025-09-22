import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Clock, Tag } from "lucide-react";

export const revalidate = 60;

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(props: BlogPostPageProps): Promise<Metadata> {
  const params = await props.params;
  const GQL_ENDPOINT = 'https://gql.hashnode.com/';
  const host = process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST || 'mindware.hashnode.dev';
  const query = `
    query SinglePost($slug: String!, $host: String!) {
      publication(host: $host) {
        post(slug: $slug) {
          title
          brief
          coverImage { url }
          author { name }
        }
      }
    }
  `;

  try {
    const res = await fetch(GQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { slug: params.slug, host } }),
      next: { revalidate: 60 },
    });
    const data = await res.json();
    const post = data?.data?.publication?.post;
    if (!post) return { title: 'Post Not Found' };

    return {
      title: post.title,
      description: post.brief || undefined,
      openGraph: {
        title: post.title,
        description: post.brief || undefined,
        type: 'article',
        images: post.coverImage?.url ? [post.coverImage.url] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.brief || undefined,
        images: post.coverImage?.url ? [post.coverImage.url] : [],
      },
    };
  } catch (e) {
    return { title: 'Post Not Found' };
  }
}

export default async function BlogPostPage(props: BlogPostPageProps) {
  const params = await props.params;
  const GQL_ENDPOINT = 'https://gql.hashnode.com/';
  const host = process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST || 'mindware.hashnode.dev';
  const query = `
    query SinglePost($slug: String!, $host: String!) {
      publication(host: $host) {
        post(slug: $slug) {
          id
          title
          brief
          content { html }
          publishedAt
          updatedAt
          readTimeInMinutes
          coverImage { url }
          author { name }
          tags { id name slug }
          series { id title }
        }
      }
    }
  `;

  let post: any = null;
  try {
    const res = await fetch(GQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { slug: params.slug, host } }),
      next: { revalidate: 60 },
    });
    const data = await res.json();
    post = data?.data?.publication?.post;
  } catch (e) {
    notFound();
  }

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/admin/articles" 
            className="inline-flex items-center text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Link>
        </div>
      </nav>

      <article className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            {post.coverImage?.url && (
              <div className="mb-6">
                <img
                  src={post.coverImage.url}
                  alt={post.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                  loading="lazy"
                />
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              {post.title}
            </h1>

            {post.subtitle && (
              <h2 className="text-xl md:text-2xl text-stone-700 dark:text-stone-300 mb-6">
                {post.subtitle}
              </h2>
            )}

            <div className="flex flex-wrap items-center gap-6 text-sm text-stone-600 dark:text-stone-400 mb-6">
              {post.author?.name && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>{post.author.name}</span>
                </div>
              )}
              {post.publishedAt && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <time dateTime={post.publishedAt}>
                    {format(new Date(post.publishedAt), "MMMM d, yyyy")}
                  </time>
                </div>
              )}
              {post.readTimeInMinutes && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{post.readTimeInMinutes} min read</span>
                </div>
              )}
              {post.views > 0 && (
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  <span>{post.views} views</span>
                </div>
              )}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: any) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center px-3 py-1 bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-full text-sm"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Content */}
            <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-8">
              <div className="prose prose-stone prose-lg max-w-none dark:prose-invert hashnode-content-style">
                {post.content?.html ? (
                  <div dangerouslySetInnerHTML={{ __html: post.content.html }} />
                ) : (
                  <p className="text-stone-600 dark:text-stone-400 italic">
                    No content available for this article.
                  </p>
                )}
              </div>
            </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-stone-200 dark:border-stone-700">
            {post.series && (
              <div className="mb-4">
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  Part of the series:{" "}
                  <span className="font-medium text-stone-900 dark:text-stone-100">
                    {post.series.title}
                  </span>
                </p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm text-stone-600 dark:text-stone-400">
                {post.author?.name && (
                  <p>Written by {post.author.name}</p>
                )}
              </div>

              {post.updatedAt && (
                <div className="text-sm text-stone-600 dark:text-stone-400">
                  <p>Last updated: {format(new Date(post.updatedAt), "MMM d, yyyy")}</p>
                </div>
              )}
            </div>
          </footer>
        </div>
      </article>
    </div>
  );
}


