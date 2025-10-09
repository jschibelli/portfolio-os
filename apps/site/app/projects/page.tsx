import { Metadata } from 'next';
import { Suspense } from 'react';
import { Container } from '../../components/shared/container';
import dynamic from 'next/dynamic';
import AudienceSpecificCTA from '../../components/features/cta/audience-specific-cta';
import EnhancedCTASection from '../../components/features/cta/enhanced-cta-section';
import { Layout } from '../../components/shared/layout';

import { allProjects as projectMetaList } from '../../data/projects';
import { ArrowRight, Calendar, Code, Users, MapPin, CheckCircle, Search, Award } from 'lucide-react';
import { ProjectsPageClient } from './projects-client';
import { AnimatedProjectCard } from '../../components/features/projects/animated-project-card';

// Lazy load chatbot for better performance
const Chatbot = dynamic(() => import('../../components/features/chatbot/Chatbot'), {
  loading: () => null,
});

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
    creator: '@johnschibelli',
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
  // Filter to only show published projects
  const publishedProjects = projectMetaList.filter(project => project.published !== false).map(toProjectCard);
  
  // Get all unique tags for filtering
  const allTags = Array.from(new Set(publishedProjects.flatMap(p => p.tags))).sort();
  
  // Get all unique categories
  const allCategories = Array.from(new Set(publishedProjects.map(p => p.category || 'other'))).sort();
  
  // Get all unique technologies
  const allTechnologies = Array.from(new Set(publishedProjects.flatMap(p => p.technologies || []))).sort();
  
  // Get all unique statuses
  const allStatuses = Array.from(new Set(publishedProjects.map(p => p.status || 'completed'))).sort();
  
  // Get all unique clients
  const allClients = Array.from(new Set(publishedProjects.map(p => p.client).filter(Boolean))).sort();
  
  return {
    projects: publishedProjects,
    allTags,
    allCategories,
    allTechnologies,
    allStatuses,
    allClients,
    projectCount: publishedProjects.length,
  };
}
export default function ProjectsPage() {
  const { projects, allTags, projectCount } = getProjectsData();

  return (
    <Layout>
      <main className="min-h-screen bg-white dark:bg-stone-950">
        {/* Hero Section - Server-side rendered */}
        <section
          className="relative min-h-[300px] overflow-hidden bg-stone-50 py-12 md:py-16 dark:bg-stone-900"
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
                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-stone-800 dark:text-stone-200">John Schibelli</h2>
                  <p className="text-base sm:text-lg md:text-xl font-medium text-stone-700 dark:text-stone-300">15+ years of experience in web development</p>
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                  <span className="inline-flex items-center justify-center gap-2"><MapPin className="h-3 w-3 sm:h-4 sm:w-4" /> Towaco, NJ</span>
                  <span className="inline-flex items-center justify-center gap-2"><Calendar className="h-3 w-3 sm:h-4 sm:w-4" /> {projectCount} Projects</span>
                  <span className="inline-flex items-center justify-center gap-2"><Users className="h-3 w-3 sm:h-4 sm:w-4" /> Client Success</span>
                  <span className="inline-flex items-center justify-center gap-2"><Code className="h-3 w-3 sm:h-4 sm:w-4" /> {allTags.length} Technologies</span>
                </div>
              </div>
            </Container>
          </div>
        </section>

        {/* Server-side rendered project cards for SEO */}
        <section className="bg-stone-50 py-12 md:py-16 dark:bg-stone-900">
          <Container className="px-4 sm:px-6">
            <div className="mb-12 sm:mb-16 text-center">
              <h2 className="mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100">Projects</h2>
              <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-stone-600 dark:text-stone-400 px-4">
                Explore our complete portfolio of projects and case studies.
              </p>
            </div>

            {/* Dynamic grid layout based on project count */}
            <div className={
              projects.length === 1 
                ? "max-w-5xl mx-auto" 
                : projects.length === 2 
                ? "grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            }>
              {projects.map((project, index) => (
                <AnimatedProjectCard 
                  key={project.id}
                  project={project}
                  index={index}
                  featured={projects.length === 1}
                />
              ))}
            </div>
          </Container>
        </section>

        {/* Interactive Features (Client-side) - Hidden for now */}
        {/* <Suspense fallback={<div className="min-h-screen bg-white dark:bg-stone-950" />}>
          <ProjectsPageClient 
            initialProjects={projects}
            allTags={allTags}
            projectCount={projectCount}
          />
        </Suspense> */}

        {/* Technologies & Skills */}
        <section className="bg-white py-12 md:py-16 dark:bg-stone-950">
          <Container className="px-4 sm:px-6">
            <div className="mb-12 sm:mb-16 text-center">
              <h2 className="mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100">Technologies & Skills</h2>
              <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-stone-600 dark:text-stone-400 px-4">I work with modern technologies to create digital experiences.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                { category: 'Frontend', technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
                { category: 'Backend', technologies: ['Node.js', 'Prisma', 'PostgreSQL', 'GraphQL', 'REST APIs'] },
                { category: 'Cloud & DevOps', technologies: ['AWS', 'Vercel', 'Docker', 'CI/CD', 'Monitoring'] },
                { category: 'Design & UX', technologies: ['Figma', 'Accessibility', 'Responsive Design', 'Performance', 'SEO'] },
              ].map((group) => (
                <div key={group.category} className="rounded-lg bg-stone-50 p-4 sm:p-6 dark:bg-stone-900">
                  <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-stone-900 dark:text-stone-100">{group.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {group.technologies.map((tech) => (
                      <span key={tech} className="inline-block bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs px-2 py-1 rounded border border-stone-200 dark:border-stone-700">{tech}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

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
