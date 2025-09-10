import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProjectMeta } from '../../../data/projects/types';
import { getAllProjects, getProjectBySlug } from '../../../lib/project-utils';
import { ProjectHeader } from '../_components/project-header';
import { ProjectContent } from '../_components/project-content';
import { ProjectTechnologies } from '../_components/project-technologies';
import { ProjectLinks } from '../_components/project-links';
import { ProjectTimeline } from '../_components/project-timeline';
import { Container } from '../../../components/shared/container';
import { Badge } from '../../../components/ui/badge';

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  
  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  const title = `${project.title} | John Schibelli Portfolio`;
  const description = project.description;
  const canonical = `https://schibelli.dev/projects/${project.slug}`;

  return {
    title,
    description,
    keywords: project.tags,
    authors: [{ name: 'John Schibelli' }],
    creator: 'John Schibelli',
    publisher: 'John Schibelli',
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
      facebookBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
      twitterBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: canonical,
      title,
      description,
      siteName: 'John Schibelli Portfolio',
      images: [
        {
          url: `/projects/${project.slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${project.title} - Project Overview`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@johnschibelli',
      site: '@johnschibelli',
      images: [`/projects/${project.slug}/opengraph-image`],
    },
    alternates: {
      canonical,
    },
    other: {
      'article:author': 'John Schibelli',
      'article:section': 'Projects',
      'article:tag': project.tags.join(', '),
    },
  };
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-stone-950">
      <Container className="py-8">
        <article className="max-w-4xl mx-auto">
          {/* Project Header */}
          <ProjectHeader project={project} />
          
          {/* Project Content */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <ProjectContent project={project} />
              <ProjectTechnologies project={project} />
            </div>
            
            {/* Sidebar */}
            <div className="space-y-8">
              <ProjectLinks project={project} />
              <ProjectTimeline project={project} />
              
              {/* Project Tags */}
              <div className="bg-stone-50 dark:bg-stone-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
                  Technologies & Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </article>
      </Container>
    </div>
  );
}
