import React from 'react';
import Head from 'next/head';
import Hero from '../components/hero';
import Intro from '../components/intro';
import FeaturedProjects from '../components/featured-projects';
import SkillsTicker from '../components/skills-ticker';
import CTABanner from '../components/cta-banner';
import LatestPosts from '../components/latest-posts';

export default function TestHomepage() {
  return (
    <>
      <Head>
        <title>Test Homepage - John Schibelli</title>
        <meta name="description" content="Test homepage with all new components" />
      </Head>

      <main>
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Intro Section */}
        <Intro />

        {/* 3. Featured Projects */}
        <FeaturedProjects />

        {/* 4. Skills & Tools Ticker */}
        <SkillsTicker />

        {/* 5. CTA Banner */}
        <CTABanner />

        {/* 6. Latest Posts Teaser */}
        <LatestPosts />
      </main>
    </>
  );
}
