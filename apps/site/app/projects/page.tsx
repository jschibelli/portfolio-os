import { Metadata } from 'next';
import { Suspense } from 'react';
import { Container } from '../../components/shared/container';
import Chatbot from '../../components/features/chatbot/Chatbot';
import AudienceSpecificCTA from '../../components/features/cta/audience-specific-cta';
import EnhancedCTASection from '../../components/features/cta/enhanced-cta-section';
import { Layout } from '../../components/shared/layout';

import { allProjects as projectMetaList } from '../../data/projects';
import { ArrowRight, Calendar, Code, Users, MapPin, CheckCircle, Search, Award } from 'lucide-react';
import { ProjectsPageClient } from './projects-client';

export const metadata: Metadata = {
  title: 'Projects and Case Studies | John Schibelli',
  description: 'Explore my portfolio of web development projects and case studies. 15+ years of experience building scalable applications with React, Next.js, TypeScript, and modern technologies.',
  keywords: ['projects', 'portfolio', 'case studies', 'web development', 'React', 'Next.js', 'TypeScript', 'John Schibelli'],
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
    title: 'Projects and Case Studies | John Schibelli',
    description: 'Explore my portfolio of web development projects and case studies. 15+ years of experience building scalable applications with React, Next.js, TypeScript, and modern technologies.',
    url: 'https://johnschibelli.dev/projects',
    siteName: 'John Schibelli Portfolio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/assets/og.png',
        width: 1200,
        height: 630,
        alt: 'John Schibelli - Projects and Case Studies',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects and Case Studies | John Schibelli',
    description: 'Explore my portfolio of web development projects and case studies. 15+ years of experience building scalable applications with React, Next.js, TypeScript, and modern technologies.',
    images: ['/assets/og.png'],
  },
  alternates: {
    canonical: 'https://johnschibelli.dev/projects',
  },
};

// Transform data/projects ProjectMeta into ProjectCard Project shape
function toProjectCard(projectMeta: any) {
  return {
    id: projectMeta.id,
    title: projectMeta.title,
    description: projectMeta.description,
    image: projectMeta.image || '/assets/hero/hero-image.webp',
    tags: projectMeta.tags || [],
    caseStudyUrl: projectMeta.caseStudyUrl,
    slug: projectMeta.slug,
    liveUrl: projectMeta.liveUrl,
    category: projectMeta.category,
    status: projectMeta.status,
    technologies: projectMeta.technologies,
    client: projectMeta.client,
    industry: projectMeta.industry,
    startDate: projectMeta.startDate,
    endDate: projectMeta.endDate,
  };
}

function getProjectsData() {
  const projects = projectMetaList.map(toProjectCard);
  
  // Get all unique tags for filtering
  const allTags = Array.from(new Set(projects.flatMap(p => p.tags))).sort();
  
  // Get all unique categories
  const allCategories = Array.from(new Set(projects.map(p => p.category || 'other'))).sort();
  
  // Get all unique technologies
  const allTechnologies = Array.from(new Set(projects.flatMap(p => p.technologies || []))).sort();
  
  // Get all unique statuses
  const allStatuses = Array.from(new Set(projects.map(p => p.status || 'completed'))).sort();
  
  // Get all unique clients
  const allClients = Array.from(new Set(projects.map(p => p.client).filter(Boolean))).sort();
  
  return {
    projects,
    allTags,
    allCategories,
    allTechnologies,
    allStatuses,
    allClients,
    projectCount: projects.length,
  };
}

export default function ProjectsPage() {
  const { projects, allTags, projectCount } = getProjectsData();

  return (
    <Layout>
      <main className="min-h-screen bg-white dark:bg-stone-950">
        {/* Hero Section - Server-side rendered */}
        <section
          className="relative min-h-[300px] sm:min-h-[400px] md:min-h-[500px] overflow-hidden bg-stone-50 py-8 sm:py-12 md:py-16 lg:py-20 dark:bg-stone-900"
          style={{ backgroundImage: 'url(/assets/hero/hero-bg2.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
        >
          <div className="absolute inset-0 z-0 bg-stone-50/80 dark:bg-stone-900/80"></div>
          <div className="relative z-10">
            <Container className="px-4 sm:px-6">
              <div className="mx-auto max-w-5xl text-center space-y-6 sm:space-y-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 dark:text-stone-100 leading-tight
                  bg-gradient-to-r from-stone-900 via-stone-700 to-stone-900 dark:from-stone-100 dark:via-stone-300 dark:to-stone-100
                  bg-clip-text text-transparent">
                  Projects & Case Studies
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-stone-600 dark:text-stone-300 max-w-3xl mx-auto leading-relaxed">
                  Explore my portfolio of web development projects and case studies. 15+ years of experience building scalable applications with React, Next.js, TypeScript, and modern technologies.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                    <Calendar className="h-5 w-5" />
                    <span className="text-sm font-medium">{projectCount} Projects</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                    <Code className="h-5 w-5" />
                    <span className="text-sm font-medium">Modern Tech Stack</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                    <Users className="h-5 w-5" />
                    <span className="text-sm font-medium">Client-Focused</span>
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </section>

        {/* Client-side interactive components */}
        <Suspense fallback={<div className="py-12 text-center">Loading projects...</div>}>
          <ProjectsPageClient 
            initialProjects={projects}
            allTags={allTags}
            projectCount={projectCount}
          />
        </Suspense>

        {/* Audience-specific CTAs */}
        <AudienceSpecificCTA audience="recruiters" className="bg-stone-50 dark:bg-stone-900" />
        <AudienceSpecificCTA audience="startup-founders" className="bg-white dark:bg-stone-950" />
        <AudienceSpecificCTA audience="clients" className="bg-stone-50 dark:bg-stone-900" />
        <EnhancedCTASection audience="general" />
      </main>
      <Chatbot />
    </Layout>
  );
}