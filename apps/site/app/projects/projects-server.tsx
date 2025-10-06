import { Suspense } from 'react';
import { Layout } from '../../components/shared/layout';
import { Container } from '../../components/shared/container';
import { ProjectMeta } from '../../data/projects/types';
import { Project } from '../../components/features/portfolio/project-card';
import { ProjectCardServer } from './project-card-server';
import { Badge } from '../../components/ui/badge';
import { ArrowRight, Calendar, Code, Users, MapPin, CheckCircle, Award } from 'lucide-react';
import { ProjectsStructuredData } from './structured-data';

// Transform data/projects ProjectMeta into ProjectCard Project shape
function toProjectCard(projectMeta: ProjectMeta): Project {
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

interface ProjectsPageServerProps {
  projects: ProjectMeta[];
}

export default function ProjectsPageServer({ projects }: ProjectsPageServerProps) {
  const projectCards = projects.map(toProjectCard);
  
  // Calculate stats from projects data
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalTechnologies = new Set(projects.flatMap(p => p.technologies || [])).size;
  const totalClients = new Set(projects.map(p => p.client).filter(Boolean)).size;

  return (
    <Layout>
      <ProjectsStructuredData projects={projects} />
      <Container className="py-16 md:py-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Projects
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            A collection of web development projects showcasing my expertise in React, Next.js, TypeScript, and modern web technologies.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{totalProjects}</div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{completedProjects}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{totalTechnologies}</div>
              <div className="text-sm text-muted-foreground">Technologies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{totalClients}</div>
              <div className="text-sm text-muted-foreground">Clients</div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {projectCards.map((project) => (
            <ProjectCardServer key={project.id} project={project} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let's work together to bring your ideas to life with modern web technologies and best practices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get In Touch
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a
              href="/case-studies"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
            >
              View Case Studies
            </a>
          </div>
        </div>
      </Container>
    </Layout>
  );
}
