import { AppProvider } from '../components/contexts/appContext';
import Chatbot from '../components/features/chatbot/Chatbot';
import Hero from '../components/features/homepage/hero';
import Intro from '../components/features/homepage/intro';
import CTABanner from '../components/features/marketing/cta-banner';
import FeaturedProjects from '../components/features/portfolio/featured-projects';
import LatestPosts from '../components/features/blog/latest-posts';
import ModernHeader from '../components/features/navigation/modern-header';
import { Footer } from '../components/shared/footer';

// Default publication object for fallback
const defaultPublication = {
  id: 'fallback-home',
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

export default function HomePage() {
  return (
    <AppProvider publication={defaultPublication as any}>
      {/* Navigation */}
      <ModernHeader publication={defaultPublication} />

      {/* Homepage Sections in order */}
      <main id="main-content" role="main">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Intro Section */}
        <Intro />

        {/* 3. Featured Projects */}
        <FeaturedProjects />

        {/* 4. Latest Blog Posts */}
        <LatestPosts />

        {/* 5. CTA Banner */}
        <CTABanner />

        {/* 6. Chatbot */}
        <Chatbot />
      </main>

      {/* Footer */}
      <Footer publication={defaultPublication} />
    </AppProvider>
  );
}