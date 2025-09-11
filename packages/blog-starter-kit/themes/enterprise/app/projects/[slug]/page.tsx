import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftIcon, ExternalLinkIcon, CalendarIcon, CodeIcon, UsersIcon } from 'lucide-react';
import { Container } from '../../../components/shared/container';
import { Badge, Button } from '../../../components/ui';
import portfolioData from '../../../data/portfolio.json';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  caseStudyUrl?: string;
}

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return portfolioData.map((project: Project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = portfolioData.find((p: Project) => p.slug === params.slug);
  
  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  const title = `${project.title} - Project Case Study`;
  const description = project.description;
  const url = `https://mindware.hashnode.dev/projects/${project.slug}`;

  return {
    title,
    description,
    keywords: project.tags.join(', '),
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
      type: 'article',
      title,
      description,
      url,
      siteName: 'John Schibelli - Portfolio',
      locale: 'en_US',
      images: [
        {
          url: `/projects/${project.slug}/opengraph-image/route`,
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
      images: [`/projects/${project.slug}/opengraph-image/route`],
      creator: '@mindware',
    },
    alternates: {
      canonical: url,
    },
  };
}

export default function ProjectPage({ params }: Props) {
  const project = portfolioData.find((p: Project) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-stone-950">
        {/* Simple Header */}
        <header className="border-b border-stone-200 bg-white/80 backdrop-blur-sm dark:border-stone-700 dark:bg-stone-900/80">
          <Container className="px-4">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="text-xl font-bold text-stone-900 dark:text-stone-100">
                John Schibelli
              </Link>
              <nav className="flex items-center space-x-6">
                <Link href="/work" className="text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100">
                  Work
                </Link>
                <Link href="/about" className="text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100">
                  About
                </Link>
                <Link href="/contact" className="text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100">
                  Contact
                </Link>
              </nav>
            </div>
          </Container>
        </header>
        
        <main className="min-h-screen bg-white dark:bg-stone-950">
          {/* Hero Section */}
          <section className="relative min-h-[500px] overflow-hidden bg-stone-50 py-16 md:py-24 dark:bg-stone-900">
            <Container className="px-4">
              <div className="mx-auto max-w-4xl text-center">
                {/* Back Button */}
                <div className="mb-8 flex justify-start">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-stone-200 bg-white/80 backdrop-blur-sm hover:bg-white dark:border-stone-700 dark:bg-stone-800/80 dark:hover:bg-stone-800"
                  >
                    <Link href="/work">
                      <ArrowLeftIcon className="mr-2 h-4 w-4" />
                      Back to Projects
                    </Link>
                  </Button>
                </div>

                {/* Project Badge */}
                <div className="mb-6">
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm font-medium"
                  >
                    Project Case Study
                  </Badge>
                </div>

                {/* Project Title */}
                <h1 className="mb-6 text-4xl font-bold leading-tight text-stone-900 md:text-5xl lg:text-6xl dark:text-stone-100">
                  {project.title}
                </h1>

                {/* Project Description */}
                <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-stone-600 md:text-2xl dark:text-stone-400">
                  {project.description}
                </p>

                {/* Technology Tags */}
                <div className="mb-8 flex flex-wrap justify-center gap-3">
                  {project.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="border-stone-200 bg-white/80 backdrop-blur-sm text-stone-700 dark:border-stone-700 dark:bg-stone-800/80 dark:text-stone-300"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  {project.liveUrl && (
                    <Button
                      size="lg"
                      className="px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
                      asChild
                    >
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Live Demo
                        <ExternalLinkIcon className="ml-2 h-5 w-5" />
                      </a>
                    </Button>
                  )}
                  {project.caseStudyUrl && (
                    <Button
                      size="lg"
                      variant="outline"
                      className="px-8 py-4 text-lg font-semibold transition-all duration-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                      asChild
                    >
                      <Link href={project.caseStudyUrl}>
                        Read Case Study
                        <ExternalLinkIcon className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </Container>
          </section>

          {/* Project Image Section */}
          <section className="bg-white py-16 dark:bg-stone-950">
            <Container className="px-4">
              <div className="mx-auto max-w-5xl">
                <div className="relative h-64 w-full overflow-hidden rounded-2xl md:h-80 lg:h-96">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </div>
            </Container>
          </section>

          {/* Project Details Section */}
          <section className="bg-stone-50 py-16 dark:bg-stone-900">
            <Container className="px-4">
              <div className="mx-auto max-w-4xl">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {/* Project Overview */}
                  <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-stone-800">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <CodeIcon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                        Technology Stack
                      </h3>
                    </div>
                    <p className="text-stone-600 dark:text-stone-400">
                      Built with modern technologies including {project.tags.slice(0, 3).join(', ')} and more.
                    </p>
                  </div>

                  {/* Project Type */}
                  <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-stone-800">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                        <CalendarIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                        Project Type
                      </h3>
                    </div>
                    <p className="text-stone-600 dark:text-stone-400">
                      {project.tags.includes('SaaS') ? 'SaaS Platform' : 
                       project.tags.includes('E-commerce') ? 'E-commerce Solution' :
                       'Web Application'}
                    </p>
                  </div>

                  {/* Development Approach */}
                  <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-stone-800">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <UsersIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                        Development
                      </h3>
                    </div>
                    <p className="text-stone-600 dark:text-stone-400">
                      Full-stack development with focus on performance, scalability, and user experience.
                    </p>
                  </div>
                </div>
              </div>
            </Container>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-br from-stone-900 to-stone-800 py-16 dark:from-stone-800 dark:to-stone-900">
            <Container className="px-4">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
                  Interested in Similar Projects?
                </h2>
                <p className="mb-8 text-xl text-stone-300">
                  Let&apos;s discuss how we can bring your vision to life with cutting-edge technology solutions.
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <Button
                    size="lg"
                    className="px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
                    asChild
                  >
                    <Link href="/contact">
                      Get In Touch
                      <ExternalLinkIcon className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white hover:text-stone-900"
                    asChild
                  >
                    <Link href="/work">
                      View All Projects
                      <ExternalLinkIcon className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Container>
          </section>
        </main>
      </div>
  );
}
