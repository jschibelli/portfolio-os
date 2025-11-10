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

// ISR with 60 second revalidation
export const revalidate = 60;

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

export default async function BlogPage() {
  // Fetch posts during build and runtime with graceful fallback
  let posts: any[] = [];
  let currentPublication = defaultPublication;
  
  try {
    const [fetchedPosts, fetchedPublication] = await Promise.all([
      fetchPosts(10),
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

  const featuredPost = posts.length > 0 ? posts[0] : null;
  const morePosts = posts.length > 1 ? posts.slice(1, 4) : [];

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
                href="/rss.xml"
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

            {/* Latest Posts Grid */}
            {posts.length > 1 && (
              <div id="latest-posts-section" data-animate-section className="space-y-6 transition-all duration-1000 ease-out">
                <h2 className="animate-fade-in-up text-2xl font-bold text-stone-900 dark:text-stone-100">
                  Latest Posts
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {morePosts.map((post, index) => (
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
