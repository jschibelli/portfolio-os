import { AppProvider } from '../../components/contexts/appContext';
import dynamic from 'next/dynamic';
import ModernHero from '../../components/features/homepage/modern-hero';
import ModernHeader from '../../components/features/navigation/modern-header';
import { Footer } from '../../components/shared/footer';
import { Container } from '../../components/shared/container';
import { DEFAULT_COVER } from '../../utils/const';
import { BlueskySVG, FacebookSVG, GithubSVG, LinkedinSVG, RssSVG } from '../../components/icons';
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArticleSVG } from '../../components/icons';
import FeaturedPost from '../../components/features/blog/featured-post';
import ModernPostCard from '../../components/features/blog/modern-post-card';
import NewsletterCTA from '../../components/features/newsletter/newsletter-cta';
import { fetchPosts, fetchPublication } from '../../lib/content-api';
import { Metadata } from 'next';

// Lazy load chatbot for better performance
const Chatbot = dynamic(() => import('../../components/features/chatbot/Chatbot'), {
  loading: () => null,
});

// ISR with 30 second revalidation (reduced from 60 for faster updates)
// Webhook revalidation will make new posts appear immediately when configured
export const revalidate = 30;

export const metadata: Metadata = {
  title: 'Blog | John Schibelli',
  description: 'Unfiltered perspectives on code, creativity, and the constant evolution of technology. Articles on React, Next.js, TypeScript, AI workflows, and modern web development.',
  keywords: ['blog', 'technology', 'web development', 'React', 'Next.js', 'TypeScript', 'AI', 'automation'],
  authors: [{ name: 'John Schibelli' }],
  creator: 'John Schibelli',
  publisher: 'John Schibelli',
  metadataBase: new URL('https://johnschibelli.dev'),
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://johnschibelli.dev/blog',
    title: 'Blog | John Schibelli',
    description: 'Unfiltered perspectives on code, creativity, and the constant evolution of technology. Articles on React, Next.js, TypeScript, AI workflows, and modern web development.',
    siteName: 'John Schibelli Portfolio',
    images: [
      {
        url: '/assets/og.png',
        width: 1200,
        height: 630,
        alt: 'John Schibelli - Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | John Schibelli',
    description: 'Unfiltered perspectives on code, creativity, and the constant evolution of technology.',
    creator: '@johnschibelli',
    images: ['/assets/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Default publication object for fallback
const defaultPublication = {
  id: 'fallback-blog',
  title: 'John Schibelli',
  displayTitle: 'John Schibelli',
  descriptionSEO: 'Senior Front-End Engineer | React · Next.js · TypeScript | Automation · AI Workflows · Accessibility. Building scalable, high-performance web applications with modern development practices. Available for freelance projects and consulting.',
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

export default async function BlogPage({
  searchParams,
}: {
  // Next.js 15: `searchParams` is async in server components and must be awaited
  searchParams?: Promise<{ page?: string }>;
}) {
  // Pagination
  // Page 1: 1 featured + 9 list items (total 10 shown)
  // Page 2+: 10 list items per page
  // We fetch a larger set from the API and paginate locally for reliability.
  // (Cursor-based pagination is possible but requires storing/deriving cursors.)
  const PAGE_SIZE = 10;
  const resolvedSearchParams = await searchParams;
  const rawPage = Number.parseInt(resolvedSearchParams?.page ?? '1', 10);
  const requestedPage = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  // Fetch posts during build and runtime with graceful fallback
  let posts: any[] = [];
  let currentPublication = defaultPublication;
  let page = requestedPage;
  
  try {
    // Fetch more posts to ensure we get all articles including older ones
    const [fetchedPosts, fetchedPublication] = await Promise.all([
      fetchPosts(50), // Increased from 10 to 50 to ensure all posts are included
      fetchPublication()
    ]);
    posts = fetchedPosts || [];
    currentPublication = fetchedPublication || defaultPublication;
  } catch (error) {
    console.error('[Blog Page] Error fetching posts or publication:', error);
    // Fall back to empty posts and default publication
    posts = [];
    currentPublication = defaultPublication;
  }

  const totalPages =
    posts.length <= PAGE_SIZE ? 1 : 1 + Math.ceil((posts.length - PAGE_SIZE) / PAGE_SIZE);

  // Clamp requested page to valid range
  page = Math.min(Math.max(page, 1), totalPages);

  const isFirstPage = page === 1;
  const featuredPost = isFirstPage && posts.length > 0 ? posts[0] : null;

  const listStartIndex = isFirstPage ? 1 : PAGE_SIZE + (page - 2) * PAGE_SIZE;
  const listCount = isFirstPage ? PAGE_SIZE - 1 : PAGE_SIZE;
  const pagedPosts = posts.length > listStartIndex ? posts.slice(listStartIndex, listStartIndex + listCount) : [];

  return (
    <AppProvider publication={currentPublication as any}>
      {/* Navigation */}
      <ModernHeader publication={currentPublication} />

      {/* Modern Hero Section */}
      {posts.length > 0 && (
        <div id="hero-section" data-animate-section className="transition-all duration-1000 ease-out">
          <ModernHero
            title="The Developer's Lens"
            subtitle="Technology & Development"
            description="Unfiltered perspectives on code, creativity, and the constant evolution of technology."
            imageUrl="/assets/hero/hero-image.webp"
          />
        </div>
      )}

      {/* Social Media Icons - Right under the hero */}
      <div className="bg-white py-8 dark:bg-stone-950">
        <Container className="px-5">
          <div className="flex justify-center">
            <div className="flex items-center gap-4">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Find us on Facebook, external website, opens in new tab"
                className="flex items-center justify-center rounded-full border border-stone-200 p-3 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
              >
                <FacebookSVG className="h-5 w-5" />
              </a>

              {/* GitHub */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Find us on Github, external website, opens in new tab"
                className="flex items-center justify-center rounded-full border border-stone-200 p-3 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
              >
                <GithubSVG className="h-5 w-5 stroke-current" />
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Find us on Linkedin, external website, opens in new tab"
                className="flex items-center justify-center rounded-full border border-stone-200 p-3 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
              >
                <LinkedinSVG className="h-5 w-5 stroke-current" />
              </a>

              {/* Bluesky */}
              <a
                href="https://bsky.app"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Find us on Bluesky, external website, opens in new tab"
                className="flex items-center justify-center rounded-full border border-stone-200 p-3 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
              >
                <BlueskySVG className="h-5 w-5 stroke-current" />
              </a>

              {/* RSS Feed */}
              <Link
                prefetch={false}
                href="/blog/rss.xml"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open blog XML Feed, opens in new tab"
                className="flex items-center justify-center rounded-full border border-stone-200 p-3 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
              >
                <RssSVG className="h-5 w-5 stroke-current" />
              </Link>
            </div>
          </div>
        </Container>
      </div>

      <Container className="flex flex-col items-stretch gap-10 px-5 pb-10">
        {/* Empty State */}
        {posts.length === 0 && (
          <div id="empty-state-section" data-animate-section className="duration-800 grid grid-cols-1 py-20 transition-all ease-out lg:grid-cols-3">
            <div className="col-span-1 flex flex-col items-center gap-5 text-center text-stone-700 lg:col-start-2 dark:text-stone-400">
              <div className="animate-fade-in-up w-20">
                <ArticleSVG className="stroke-current" />
              </div>
              <p className="animate-fade-in-up animation-delay-200 text-xl font-semibold">
                Hang tight! We're drafting the first article.
              </p>
            </div>
          </div>
        )}

        {/* Featured Post Section */}
        {posts.length > 0 && featuredPost && (
          <div id="featured-section" data-animate-section className="duration-900 space-y-12 transition-all ease-out">
            <FeaturedPost
              post={featuredPost}
              coverImage={featuredPost.coverImage?.url || DEFAULT_COVER}
              readTime="5 min read"
              tags={['Featured', 'Technology', 'Insights']}
            />

            {/* Posts Grid */}
            {pagedPosts.length > 0 && (
              <div id="latest-posts-section" data-animate-section className="space-y-6 transition-all duration-1000 ease-out">
                <h2 className="animate-fade-in-up text-2xl font-bold text-stone-900 dark:text-stone-100">
                  Latest Posts
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {pagedPosts.map((post, index) => (
                    <div
                      key={post.id}
                      className={`animate-fade-in-up transition-all duration-300 hover:scale-[1.02] ${
                        index === 0
                          ? 'animation-delay-200'
                          : index === 1
                            ? 'animation-delay-300'
                            : 'animation-delay-400'
                      }`}
                    >
                      <ModernPostCard
                        title={post.title}
                        excerpt={post.brief}
                        coverImage={post.coverImage?.url || DEFAULT_COVER}
                        date={post.publishedAt}
                        slug={post.slug}
                        readTime="3 min read"
                        tags={['Technology', 'Development']}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Non-featured pages: show only the paged list */}
        {posts.length > 0 && !featuredPost && pagedPosts.length > 0 && (
          <div id="posts-section" data-animate-section className="duration-900 space-y-12 transition-all ease-out">
            <div className="space-y-6 transition-all duration-1000 ease-out">
              <h2 className="animate-fade-in-up text-2xl font-bold text-stone-900 dark:text-stone-100">
                Posts
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pagedPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className={`animate-fade-in-up transition-all duration-300 hover:scale-[1.02] ${
                      index === 0
                        ? 'animation-delay-200'
                        : index === 1
                          ? 'animation-delay-300'
                          : 'animation-delay-400'
                    }`}
                  >
                    <ModernPostCard
                      title={post.title}
                      excerpt={post.brief}
                      coverImage={post.coverImage?.url || DEFAULT_COVER}
                      date={post.publishedAt}
                      slug={post.slug}
                      readTime="3 min read"
                      tags={['Technology', 'Development']}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pagination (placeholder: we'll wire up ?page= in the next patch via searchParams) */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-6">
            {page > 1 ? (
              <Link
                prefetch={false}
                href={page - 1 === 1 ? '/blog' : `/blog?page=${page - 1}`}
                className="rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
              >
                Prev
              </Link>
            ) : (
              <span className="cursor-not-allowed rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-stone-400 dark:border-stone-700 dark:text-stone-600">
                Prev
              </span>
            )}

            <span className="text-sm text-stone-600 dark:text-stone-400">
              Page {page} of {totalPages}
            </span>

            {page < totalPages ? (
              <Link
                prefetch={false}
                href={`/blog?page=${page + 1}`}
                className="rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
              >
                Next
              </Link>
            ) : (
              <span className="cursor-not-allowed rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-stone-400 dark:border-stone-700 dark:text-stone-600">
                Next
              </span>
            )}
          </div>
        )}

        {/* Newsletter CTA Section */}
        {posts.length > 0 && (
          <div id="newsletter-section" data-animate-section className="duration-1100 py-8 transition-all ease-out">
            <NewsletterCTA
              title="Stay updated with our newsletter"
              showNewsletterForm={true}
              className="py-16"
            />
          </div>
        )}
      </Container>
      <Chatbot />
      <Footer publication={currentPublication} />
    </AppProvider>
  );
}
