import { AppProvider } from '../../../components/contexts/appContext';
import Chatbot from '../../../components/features/chatbot/Chatbot';
import ModernHeader from '../../../components/features/navigation/modern-header';
import { Footer } from '../../../components/shared/footer';
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Clock, Eye, Tag } from "lucide-react";
import { fetchPostBySlug, fetchPublication } from '../../../lib/content-api';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Default publication object for fallback
const defaultPublication = {
  id: 'fallback-blog-post',
  title: 'John Schibelli',
  displayTitle: 'John Schibelli',
  descriptionSEO: 'Senior Front-End Engineer | React · Next.js · TypeScript | Automation · AI Workflows · Accessibility',
  url: 'https://johnschibelli.dev',
  posts: {
    totalDocuments: 0,
  },
  preferences: {
    logo: null,
  },
  author: {
    name: 'John Schibelli',
    profilePicture: null,
  },
  followersCount: 0,
  isTeam: false,
  favicon: null,
  ogMetaData: {
    image: null,
  },
};

export async function generateMetadata(props: BlogPostPageProps): Promise<Metadata> {
  const params = await props.params;
  
  // Fetch post from Hashnode
  const post = await fetchPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.brief || `Read ${post.title} by ${post.author?.name || "our team"}`,
    openGraph: {
      title: post.title,
      description: post.brief,
      type: "article",
      images: [
        {
          url: `/blog/${post.slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${post.title} - Blog Post`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.brief,
      images: [`/blog/${post.slug}/opengraph-image`],
    },
  };
}

export default async function BlogPostPage(props: BlogPostPageProps) {
  const params = await props.params;
  
  // Fetch post and publication data from Hashnode
  const [post, publication] = await Promise.all([
    fetchPostBySlug(params.slug),
    fetchPublication()
  ]);

  if (!post) {
    notFound();
  }

  // Use fetched publication or fallback to default
  const currentPublication = publication || defaultPublication;

  return (
    <AppProvider publication={currentPublication as any}>
      {/* Navigation */}
      <ModernHeader publication={currentPublication} />

      <article className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            {post.coverImage && (
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
                  <time dateTime={new Date(post.publishedAt).toISOString()}>
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
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: any) => (
                  <span
                    key={tag.slug}
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
            <div className="hashnode-content-style">
              {post.content?.html ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: post.content.html,
                  }}
                />
              ) : post.content?.markdown ? (
                <div>{post.content.markdown}</div>
              ) : (
                <p className="text-stone-600 dark:text-stone-400 italic">
                  No content available for this article.
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-stone-200 dark:border-stone-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-stone-600 dark:text-stone-400">
                {post.author?.name && (
                  <p>Written by {post.author.name}</p>
                )}
              </div>

              <div className="text-sm text-stone-600 dark:text-stone-400">
                <p>Last updated: {format(new Date(post.publishedAt), "MMM d, yyyy")}</p>
              </div>
            </div>
          </footer>
        </div>
      </article>

      <Chatbot />
      <Footer publication={currentPublication} />
    </AppProvider>
  );
}


