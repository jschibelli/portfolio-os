import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AppProvider } from '../../../components/contexts/appContext';
import Chatbot from '../../../components/features/chatbot/Chatbot';
import ModernHeader from '../../../components/features/navigation/modern-header';
import { Container } from '../../../components/shared/container';
import { Layout } from '../../../components/shared/layout';
import { Badge, Card, CardContent, Button } from '../../../components/ui';
import { siteConfig } from '../../../config/site';
import { getProjectBySlug, ProjectMeta } from '../../../lib/project-loader';
import { generateCreativeWorkStructuredData, generateSoftwareApplicationStructuredData } from '../../../lib/structured-data';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  const title = `${project.title} – Project Portfolio`;
  const description = project.description;
  const canonical = `/projects/${project.slug}`;
  const ogImage = project.image || '/og-image.jpg';

  return {
    title,
    description,
    canonical: {
      url: canonical,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonical,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    keywords: project.tags,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // Generate structured data based on project type
  const isSoftwareProject = project.tags.some(tag => 
    ['Next.js', 'TypeScript', 'React', 'JavaScript', 'SaaS', 'AI/ML'].includes(tag)
  );

  const structuredData = isSoftwareProject 
    ? generateSoftwareApplicationStructuredData({
        name: project.title,
        description: project.description,
        url: `${siteConfig.url}/projects/${project.slug}`,
        image: project.image,
        applicationCategory: 'WebApplication',
        operatingSystem: 'Web Browser',
        offers: {
          price: '0',
          priceCurrency: 'USD',
        },
        author: {
          name: 'John Schibelli',
          description: 'Senior Front-End Developer with expertise in React, Next.js, TypeScript, and modern web technologies.',
          url: siteConfig.url,
          jobTitle: 'Senior Front-End Developer',
        },
        publisher: {
          name: 'John Schibelli',
          url: siteConfig.url,
        },
        keywords: project.tags,
      })
    : generateCreativeWorkStructuredData({
        name: project.title,
        description: project.description,
        url: `${siteConfig.url}/projects/${project.slug}`,
        image: project.image,
        author: {
          name: 'John Schibelli',
          description: 'Senior Front-End Developer with expertise in React, Next.js, TypeScript, and modern web technologies.',
          url: siteConfig.url,
          jobTitle: 'Senior Front-End Developer',
        },
        publisher: {
          name: 'John Schibelli',
          url: siteConfig.url,
        },
        keywords: project.tags,
      });

  return (
    <AppProvider publication={siteConfig}>
      <Layout>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        <ModernHeader publication={siteConfig} />

        <main className="min-h-screen">
          <Container>
            <div className="py-8 lg:py-12">
              <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="mb-8 lg:mb-12">
                  <div className="space-y-6 text-center">
                    <div className="prose md:prose-xl dark:prose-invert prose-h1:text-center mx-auto max-w-screen-lg px-5">
                      <div className="text-muted-foreground mb-3 flex items-center justify-center gap-2 text-sm">
                        <span>Project Portfolio</span>
                        <span>•</span>
                        <span>{project.id}</span>
                      </div>
                      <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                        {project.title}
                      </h1>
                      <p className="text-muted-foreground mx-auto max-w-3xl text-lg md:text-xl">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Featured Image Section */}
                {project.image && (
                  <div className="mb-8 lg:mb-12">
                    <div className="relative h-64 w-full overflow-hidden rounded-xl md:h-80 lg:h-96">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  </div>
                )}

                {/* Project Details */}
                <div className="mb-8 lg:mb-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Project Info Card */}
                    <Card className="border-border/50">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Project Details</h3>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Project ID:</span>
                            <p className="text-foreground">{project.id}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Slug:</span>
                            <p className="text-foreground font-mono text-sm">{project.slug}</p>
                          </div>
                          {project.liveUrl && (
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Live URL:</span>
                              <p className="text-foreground">
                                <a 
                                  href={project.liveUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  {project.liveUrl}
                                </a>
                              </p>
                            </div>
                          )}
                          {project.caseStudyUrl && (
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Case Study:</span>
                              <p className="text-foreground">
                                <a 
                                  href={project.caseStudyUrl} 
                                  className="text-primary hover:underline"
                                >
                                  View Case Study
                                </a>
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Technologies Card */}
                    <Card className="border-border/50">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Technologies Used</h3>
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-sm">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  {project.liveUrl && (
                    <Button asChild size="lg">
                      <a 
                        href={project.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Live Project
                      </a>
                    </Button>
                  )}
                  {project.caseStudyUrl && (
                    <Button asChild variant="outline" size="lg">
                      <a 
                        href={project.caseStudyUrl}
                        className="inline-flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Read Case Study
                      </a>
                    </Button>
                  )}
                </div>

                {/* Author Section */}
                <div className="mx-auto mb-5 mt-10 w-full px-5 md:max-w-screen-md">
                  <div className="flex-1">
                    <div className="flex flex-col items-start">
                      <h3 className="text-foreground border-border mb-6 w-full border-b pb-2 text-lg font-semibold">
                        Project by
                      </h3>
                      <div className="flex w-full flex-col gap-8">
                        <div className="flex items-start gap-6">
                          <a
                            href="https://hashnode.com/@mindware"
                            className="border-primary/20 block h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-2 dark:border-slate-700"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src="https://cdn.hashnode.com/res/hashnode/image/upload/v1659089761812/fsOct5gl6.png"
                              alt="John Schibelli"
                              className="block h-full w-full object-cover"
                            />
                          </a>
                          <div className="flex flex-1 flex-col">
                            <h4 className="text-foreground mb-2 text-xl font-semibold">
                              <a
                                href="https://hashnode.com/@mindware"
                                className="hover:text-primary transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                John Schibelli
                              </a>
                            </h4>
                            <p className="text-muted-foreground mb-4 text-base leading-relaxed">
                              Full-stack developer and technical consultant with expertise in SaaS
                              platforms, AI integration, and scalable architectures. Passionate
                              about building innovative solutions that drive business growth and
                              user engagement.
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {project.tags.slice(0, 5).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-sm">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </main>

        <Chatbot />
      </Layout>
    </AppProvider>
  );
}
