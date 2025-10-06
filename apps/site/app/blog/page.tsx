import { Metadata } from 'next';
import { AppProvider } from '../../components/contexts/appContext';
import Chatbot from '../../components/features/chatbot/Chatbot';
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

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Blog | John Schibelli - Web Development Insights',
  description: 'Explore web development insights, tutorials, and industry thoughts from John Schibelli. Covering React, Next.js, TypeScript, AI integration, and modern web development practices.',
  keywords: ['blog', 'web development', 'React', 'Next.js', 'TypeScript', 'tutorials', 'insights', 'John Schibelli', 'front-end development'],
  authors: [{ name: 'John Schibelli' }],
  creator: 'John Schibelli',
  publisher: 'John Schibelli',
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
  openGraph: {
    title: 'Blog | John Schibelli - Web Development Insights',
    description: 'Explore web development insights, tutorials, and industry thoughts from John Schibelli. Covering React, Next.js, TypeScript, AI integration, and modern web development practices.',
    url: 'https://johnschibelli.dev/blog',
    siteName: 'John Schibelli Portfolio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/assets/og.png',
        width: 1200,
        height: 630,
        alt: 'John Schibelli Blog - Web Development Insights',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | John Schibelli - Web Development Insights',
    description: 'Explore web development insights, tutorials, and industry thoughts from John Schibelli.',
    creator: '@johnschibelli',
    images: ['/assets/og.png'],
  },
  alternates: {
    canonical: 'https://johnschibelli.dev/blog',
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
  // Fetch latest posts and publication data from Hashnode
  const [posts, publication] = await Promise.all([
    fetchPosts(10),
    fetchPublication()
  ]);

<<<<<<< HEAD
  // Use fetched publication or fallback to default
  const currentPublication = publication || defaultPublication;
=======
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
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
      body: JSON.stringify({ query, variables: { host, first: 10 } }),
      next: { 
        revalidate: 60,
        tags: ['blog-posts'],
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch blog posts: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    
    // Check for GraphQL errors
    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      throw new Error(`GraphQL error: ${data.errors[0]?.message || 'Unknown error'}`);
    }

    const edges = data?.data?.publication?.posts?.edges || [];
    posts = edges.map((e: any) => e.node);
  } catch (error) {
    console.error('Error fetching Hashnode posts:', error);
    // Re-throw the error to be caught by the error boundary
    // In production, you might want to handle this differently
    if (process.env.NODE_ENV === 'production') {
      // In production, return empty array instead of throwing
      posts = [];
    } else {
      // In development, throw to see error details
      throw error;
    }
  }
>>>>>>> origin/copilot/fix-56aab07e-3258-4fb2-868f-299adc76e886

  const featuredPost = posts[0];
  const morePosts = posts.slice(1, 4);

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
        {posts.length > 0 && (
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
