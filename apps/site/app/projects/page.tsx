import { AppProvider } from '../../components/contexts/appContext';
import Chatbot from '../../components/features/chatbot/Chatbot';
import ModernHeader from '../../components/features/navigation/modern-header';
import { Footer } from '../../components/shared/footer';
import { Container } from '../../components/shared/container';
import { allProjects } from '../../data/projects';
import { Button } from '../../components/ui/button';
import Link from 'next/link';
import { ArrowRight, Calendar, Code, ExternalLink, Users, MapPin, CheckCircle, Search, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import ProjectCard, { Project } from '../../components/features/portfolio/project-card';

// Default publication object for fallback
const defaultPublication = {
  id: 'fallback-projects',
  title: 'John Schibelli',
  displayTitle: 'John Schibelli',
  descriptionSEO: 'Senior Front-End Developer with 15+ years of experience building scalable, high-performance web applications. Expert in React, Next.js, TypeScript, and modern development practices. Available for freelance projects and consulting.',
  url: 'https://schibelli.dev',
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

export default function ProjectsPage() {
  return (
    <AppProvider publication={defaultPublication as any}>
      {/* Navigation */}
      <ModernHeader publication={defaultPublication} />

      <main className="min-h-screen bg-white dark:bg-stone-950">
        {/* Hero Section - Mobile Optimized */}
        <section
          className="relative min-h-[300px] sm:min-h-[400px] md:min-h-[500px] overflow-hidden bg-stone-50 py-8 sm:py-12 md:py-16 lg:py-20 dark:bg-stone-900"
          style={{
            backgroundImage: 'url(/assets/hero/hero-bg2.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Background Overlay */}
          <div className="absolute inset-0 z-0 bg-stone-50/80 dark:bg-stone-900/80"></div>
          {/* Content Overlay */}
          <div className="relative z-10">
            <Container className="px-4 sm:px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="mx-auto max-w-5xl text-center space-y-6 sm:space-y-8"
              >
                {/* Main Hero Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 dark:text-stone-100 leading-tight"
                >
                  Building Smarter, Faster<br />
                  Web Applications
                </motion.h1>

                {/* Personal Branding Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                  className="space-y-3 sm:space-y-4"
                >
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-stone-800 dark:text-stone-200">
                    John Schibelli
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl font-medium text-stone-700 dark:text-stone-300">
                    15+ years of experience turning ideas into high-performance web apps
                  </p>
                </motion.div>

                {/* Value Propositions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto"
                >
                  <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-white/50 dark:bg-stone-800/50 backdrop-blur-sm">
                    <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400" />
                    <h3 className="text-sm sm:text-base font-semibold text-stone-900 dark:text-stone-100">Accessibility First</h3>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 text-center">WCAG compliant, inclusive design</p>
                  </div>
                  <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-white/50 dark:bg-stone-800/50 backdrop-blur-sm">
                    <Search className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-sm sm:text-base font-semibold text-stone-900 dark:text-stone-100">SEO Optimized</h3>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 text-center">Performance & search visibility</p>
                  </div>
                  <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-white/50 dark:bg-stone-800/50 backdrop-blur-sm">
                    <Award className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-sm sm:text-base font-semibold text-stone-900 dark:text-stone-100">Client Success</h3>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 text-center">Proven results & partnerships</p>
                  </div>
                </motion.div>

                {/* Location and Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
                  className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-stone-500 dark:text-stone-400"
                >
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Towaco, NJ</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{allProjects.length} Projects</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Client Success Stories</span>
                    <span className="sm:hidden">Success Stories</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Code className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{allProjects.reduce((acc, p) => acc + p.tags.length, 0)} Technologies</span>
                  </div>
                </motion.div>
              </motion.div>
            </Container>
          </div>
        </section>

        {/* Projects Grid Section - Mobile Optimized */}
        <section className="bg-stone-50 py-12 sm:py-16 lg:py-20 dark:bg-stone-900">
          <Container className="px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              viewport={{ once: true }}
              className="mb-12 sm:mb-16 text-center"
            >
              <h2 className="mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100">
                Projects
              </h2>
              <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-stone-600 dark:text-stone-400 px-4">
                Explore our complete portfolio of projects and case studies.
              </p>
            </motion.div>

            {/* Projects Grid - Mobile Optimized */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {allProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                />
              ))}
            </div>
          </Container>
        </section>
      </main>

      {/* Chatbot */}
      <Chatbot />
      <Footer publication={defaultPublication} />
    </AppProvider>
  );
}

