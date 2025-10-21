import { AppProvider } from '../../../components/contexts/appContext';
import dynamic from 'next/dynamic';
import ModernHeader from '../../../components/features/navigation/modern-header';
import { Footer } from '../../../components/shared/footer';
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Clock, Eye, Tag } from "lucide-react";
import { fetchPostBySlug, fetchPublication, getAllPostSlugs, UnifiedPublication } from '../../../lib/content-api';

// Lazy load chatbot for better performance
const Chatbot = dynamic(() => import('../../../components/features/chatbot/Chatbot'), {
  loading: () => null,
});

// Enable dynamic rendering for new posts not generated at build time
export const dynamicParams = true;

// Revalidate every 60 seconds
export const revalidate = 60;

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate static params for all blog posts at build time
 * This ensures all existing posts have pre-rendered pages
 * Uses timeout-based fetching to prevent build hanging
 */
export async function generateStaticParams() {
  try {
    console.log('[Build] Fetching blog post slugs for static generation');
    const slugs = await getAllPostSlugs();
    
    if (slugs.length === 0) {
      console.warn('[Build] No blog post slugs fetched, static generation will be skipped');
      return [];
    }
    
    console.log(`[Build] Generating static pages for ${slugs.length} blog posts`);
    return slugs.map((slug: string) => ({ slug }));
  } catch (error) {
    console.error('[Build] Error fetching post slugs for static generation:', error);
    return [];
  }
}

// Default publication object for fallback - matches PublicationFragment
const defaultPublication: UnifiedPublication = {
  id: 'fallback-blog-post',
  title: 'John Schibelli',
  description: 'Senior Front-End Engineer | React · Next.js · TypeScript | Automation · AI Workflows · Accessibility',
  url: 'https://johnschibelli.dev',
  favicon: '',
  logo: '',
  isTeam: false,
  preferences: {
    logo: '',
    darkMode: {
      logo: '',
    },
    navbarItems: [],
    layout: {
      navbarStyle: 'default',
      footerStyle: 'default',
      showBranding: true,
    },
    members: [],
  },
  displayTitle: 'John Schibelli',
  descriptionSEO: 'Senior Front-End Engineer | React · Next.js · TypeScript | Automation · AI Workflows · Accessibility',
  posts: {
    totalDocuments: 0,
  },
  author: {
    name: 'John Schibelli',
    profilePicture: null,
  },
  followersCount: 0,
  ogMetaData: {
    image: null,
  },
};

export async function generateMetadata(props: BlogPostPageProps): Promise<Metadata> {
  const params = await props.params;
  
  // Skip API calls during build - metadata will be generated at runtime
  return {
    title: "Blog Post | John Schibelli",
    description: "Read the latest blog post",
  };
}

export default async function BlogPostPage(props: BlogPostPageProps) {
  const params = await props.params;
  
  console.log(`[Blog Post] Fetching post: ${params.slug}`);
  console.log(`[Blog Post] NEXT_PHASE: ${process.env.NEXT_PHASE}`);
  console.log(`[Blog Post] NODE_ENV: ${process.env.NODE_ENV}`);
  
  // Always fetch at runtime (both dev and production)
  // Only skip during build phase to prevent hanging
  let post = null;
  let currentPublication = defaultPublication;
  
  try {
    const [fetchedPost, fetchedPublication] = await Promise.all([
      fetchPostBySlug(params.slug),
      fetchPublication()
    ]);
    post = fetchedPost;
    currentPublication = fetchedPublication || defaultPublication;
    
    console.log(`[Blog Post] Post found: ${post ? 'YES' : 'NO'}`);
    if (post) {
      console.log(`[Blog Post] Post title: ${post.title}`);
    }
  } catch (error) {
    console.error(`[Blog Post] Error fetching post:`, error);
  }

  if (!post) {
    console.log(`[Blog Post] Post not found, returning 404 for slug: ${params.slug}`);
    notFound();
  }

  return (
    <AppProvider publication={currentPublication}>
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


