import { Metadata } from 'next';
import { Suspense } from 'react';
import { Container } from '../../components/shared/container';
import Chatbot from '../../components/features/chatbot/Chatbot';
import AudienceSpecificCTA from '../../components/features/cta/audience-specific-cta';
import EnhancedCTASection from '../../components/features/cta/enhanced-cta-section';
import { Layout } from '../../components/shared/layout';

import { allProjects as projectMetaList } from '../../data/projects';
import { ProjectsPageClient } from './projects-client';
import { Calendar, Code, Users, MapPin } from 'lucide-react';

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

// Server-side data preparation
function getProjectsData() {
  const projects = projectMetaList.map(projectMeta => ({
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
  }));

  const allTags = Array.from(new Set(projects.flatMap(p => p.tags))).sort();
  
  return {
    projects,
    allTags,
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
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 dark:text-stone-100 leading-tight">
                  Projects and Case Studies
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
        <section className="bg-stone-50 py-12 sm:py-16 lg:py-20 dark:bg-stone-900">
          <Container className="px-4 sm:px-6">
            <div className="mb-12 sm:mb-16 text-center">
              <h2 className="mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100">Projects</h2>
              <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-stone-600 dark:text-stone-400 px-4">
                Explore our complete portfolio of projects and case studies.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {projects.map((project, index) => (
                <article key={project.id} className="bg-white dark:bg-stone-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="aspect-video bg-stone-200 dark:bg-stone-700">
                    <img 
                      src={project.image} 
                      alt={`${project.title} project screenshot`}
                      className="w-full h-full object-cover"
                      loading={index < 6 ? 'eager' : 'lazy'}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">{project.title}</h3>
                    <p className="text-stone-600 dark:text-stone-400 mb-4 line-clamp-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="inline-block bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="inline-block bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs px-2 py-1 rounded">
                          +{project.tags.length - 3} more
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {project.liveUrl && (
                        <a 
                          href={project.liveUrl} 
                          className="inline-flex items-center px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded hover:bg-stone-800 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Live
                        </a>
                      )}
                      {project.caseStudyUrl && (
                        <a 
                          href={project.caseStudyUrl} 
                          className="inline-flex items-center px-4 py-2 border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 text-sm font-medium rounded hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
                        >
                          Case Study
                        </a>
                      )}
                      <a 
                        href={`/projects/${project.slug}`} 
                        className="inline-flex items-center px-4 py-2 border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 text-sm font-medium rounded hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
                      >
                        Details
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>

        {/* Interactive Features (Client-side) */}
        <Suspense fallback={<div className="min-h-screen bg-white dark:bg-stone-950" />}>
          <ProjectsPageClient />
        </Suspense>

        {/* Technologies & Skills */}
        <section className="bg-white py-12 sm:py-16 lg:py-20 dark:bg-stone-950">
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

