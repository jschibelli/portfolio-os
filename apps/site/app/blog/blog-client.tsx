"use client";

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

export function BlogPageClient() {
  // All the existing blog page logic would go here
  // For now, I'll create a simple placeholder
  return (
    <AppProvider publication={defaultPublication as any}>
      <ModernHeader publication={defaultPublication} />
      <main className="min-h-screen bg-white dark:bg-stone-950">
        <Container className="px-4 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold text-stone-900 dark:text-stone-100">
              Blog
            </h1>
            <p className="mb-8 text-lg text-stone-600 dark:text-stone-400">
              Read insights on front-end development, React, Next.js, TypeScript, and modern web development practices
            </p>
          </div>
        </Container>
      </main>
      <Chatbot />
      <Footer publication={defaultPublication} />
    </AppProvider>
  );
}
