export const dynamic = 'force-dynamic';
// Avoid build-time DB requirement; lazy import at runtime
let prisma: any;
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, User, Clock, Eye, Tag, ArrowRight } from "lucide-react";

export const revalidate = 60;

export default async function BlogPage() {
  const GQL_ENDPOINT = 'https://gql.hashnode.com/';
  const host = process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST || 'mindware.hashnode.dev';

  // Fetch latest posts from Hashnode
  const query = `
    query PostsByPublication($host: String!, $first: Int!, $after: String) {
      publication(host: $host) {
        posts(first: $first, after: $after) {
          edges {
            node {
              id
              title
              brief
              slug
              publishedAt
              readTimeInMinutes
              coverImage { url }
              author { name }
              tags { name slug }
            }
          }
        }
      }
    }
  `;

  let posts: any[] = [];
  try {
    const res = await fetch(GQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { host, first: 10 } }),
      next: { revalidate: 60 },
    });
    const data = await res.json();
    const edges = data?.data?.publication?.posts?.edges || [];
    posts = edges.map((e: any) => {
      const n = e.node;
      return {
        id: n.id,
        title: n.title,
        subtitle: undefined,
        excerpt: n.brief,
        slug: n.slug,
        publishedAt: n.publishedAt ? new Date(n.publishedAt) : undefined,
        readingMinutes: n.readTimeInMinutes,
        views: 0,
        author: { name: n.author?.name },
        cover: n.coverImage ? { url: n.coverImage.url, alt: n.title } : null,
        tags: n.tags?.map((t: any) => ({ tag: { id: t.slug, name: t.name } })) || [],
      };
    });
  } catch (error) {
    console.error('Error fetching Hashnode posts:', error);
    posts = [];
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              Blog
            </h1>
            <p className="text-xl text-stone-600 dark:text-stone-400">
              Thoughts, insights, and stories from our team
            </p>
          </header>

          {/* Blog Posts */}
          {posts.length > 0 ? (
            <div className="space-y-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {post.cover && (
                    <div className="aspect-video">
                      <img
                        src={post.cover.url}
                        alt={post.cover.alt || post.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-3">
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="hover:text-stone-600 dark:hover:text-stone-400 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h2>

                    {post.subtitle && (
                      <p className="text-lg text-stone-700 dark:text-stone-300 mb-4">
                        {post.subtitle}
                      </p>
                    )}

                    {post.excerpt && (
                      <p className="text-stone-600 dark:text-stone-400 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm text-stone-600 dark:text-stone-400 mb-4">
                      {post.author?.name && (
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          <span>{post.author.name}</span>
                        </div>
                      )}
                      {post.publishedAt && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <time dateTime={post.publishedAt.toISOString()}>
                            {format(post.publishedAt, "MMM d, yyyy")}
                          </time>
                        </div>
                      )}
                      {post.readingMinutes && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{post.readingMinutes} min read</span>
                        </div>
                      )}
                    </div>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map(({ tag }: any) => (
                          <span
                            key={tag.id}
                            className="inline-flex items-center px-2 py-1 bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-full text-xs"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-stone-900 dark:text-stone-100 hover:text-stone-600 dark:hover:text-stone-400 font-medium transition-colors"
                    >
                      Read more
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-4">
                No posts yet
              </h2>
              <p className="text-stone-600 dark:text-stone-400">
                Check back soon for new articles and insights!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
