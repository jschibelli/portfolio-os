/* eslint-disable @next/next/no-img-element */
import { resizeImage } from '@starter-kit/utils/image';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { AppProvider } from '../../components/contexts/appContext';
import { CaseStudyMarkdown } from '../../components/features/case-studies/case-study-markdown';
import Chatbot from '../../components/features/chatbot/chatbot';
import ModernHeader from '../../components/features/navigation/modern-header';
import { Container } from '../../components/shared/container';
import { Layout } from '../../components/shared/layout';
import { Badge, Card, CardContent, ScrollArea } from '../../components/ui';
import { siteConfig } from '../../config/site';
import { generateStandardizedTOC } from '../../lib/case-study-template';

interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: string;
  visibility: string;
  publishedAt: string;
  featured: boolean;
  client?: string;
  industry?: string;
  duration?: string;
  teamSize?: string;
  technologies: string[];
  challenges?: string;
  solution?: string;
  results?: string;
  metrics?: any;
  lessonsLearned?: string;
  nextSteps?: string;
  coverImage?: string;
  tags: string[];
  category?: string;
  views: number;
  author?: {
    name: string;
    email: string;
  };
}

interface Props {
  caseStudy: CaseStudy;
  publication: any;
}

export default function CaseStudyPage({ caseStudy, publication }: Props) {
  const [activeSection, setActiveSection] = useState<string>('');
  const tocItems = generateStandardizedTOC();

  useEffect(() => {
    const handleScroll = () => {
      const sections = tocItems.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(tocItems[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!caseStudy) {
    return (
      <AppProvider publication={publication}>
        <Layout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-4">
                Case Study Not Found
              </h1>
              <p className="text-stone-600 dark:text-stone-400">
                The case study you&apos;re looking for doesn&apos;t exist or has been removed.
              </p>
            </div>
          </div>
        </Layout>
      </AppProvider>
    );
  }

  return (
    <AppProvider publication={publication}>
      <Layout>
        <Head>
          <title>{caseStudy.title} – Case Study</title>
          <meta name="description" content={caseStudy.excerpt} />
          <meta property="og:title" content={caseStudy.title} />
          <meta property="og:description" content={caseStudy.excerpt} />
          {caseStudy.coverImage && <meta property="og:image" content={caseStudy.coverImage} />}
        </Head>

        <ModernHeader publication={publication} />

        <main className="min-h-screen">
          <Container>
            <div className="py-8 lg:py-12">
              <div className="flex gap-6 lg:gap-8">
                {/* Main content */}
                <div className="min-w-0 flex-1">
                  {/* Header Section - Consistent with ModernPostHeader */}
                  <div className="mb-8 lg:mb-12">
                    <div className="space-y-6 text-center">
                      <div className="prose md:prose-xl dark:prose-invert prose-h1:text-center mx-auto max-w-screen-lg px-5">
                        <div className="text-muted-foreground mb-3 flex items-center justify-center gap-2 text-sm">
                          <span>Case Study</span>
                          <span>•</span>
                          <span>
                            {new Date(caseStudy.publishedAt + 'T00:00:00').toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              },
                            )}
                          </span>
                        </div>
                        <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                          {caseStudy.title}
                        </h1>
                        <p className="text-muted-foreground mx-auto max-w-3xl text-lg md:text-xl">
                          {caseStudy.excerpt}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Featured Image Section */}
                  {caseStudy.coverImage && (
                    <div className="mb-8 lg:mb-12">
                      <div className="relative h-64 w-full overflow-hidden rounded-xl md:h-80 lg:h-96">
                        <img
                          src={caseStudy.coverImage}
                          alt={caseStudy.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    </div>
                  )}

                  {/* Project Details */}
                  {(caseStudy.client || caseStudy.industry || caseStudy.duration || caseStudy.teamSize) && (
                    <div className="mb-8 lg:mb-12">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {caseStudy.client && (
                          <div className="bg-stone-50 dark:bg-stone-800 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">Client</h3>
                            <p className="text-stone-900 dark:text-stone-100">{caseStudy.client}</p>
                          </div>
                        )}
                        {caseStudy.industry && (
                          <div className="bg-stone-50 dark:bg-stone-800 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">Industry</h3>
                            <p className="text-stone-900 dark:text-stone-100">{caseStudy.industry}</p>
                          </div>
                        )}
                        {caseStudy.duration && (
                          <div className="bg-stone-50 dark:bg-stone-800 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">Duration</h3>
                            <p className="text-stone-900 dark:text-stone-100">{caseStudy.duration}</p>
                          </div>
                        )}
                        {caseStudy.teamSize && (
                          <div className="bg-stone-50 dark:bg-stone-800 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">Team Size</h3>
                            <p className="text-stone-900 dark:text-stone-100">{caseStudy.teamSize}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Content Section - Consistent with other pages */}
                  <div className="mx-auto w-full px-5 text-slate-600 md:max-w-screen-md dark:text-neutral-300">
                    <div className="prose prose-base lg:prose-lg dark:prose-invert max-w-none">
                      <CaseStudyMarkdown contentMarkdown={caseStudy.content} />
                    </div>
                  </div>

                  {/* Author Section */}
                  <div className="mx-auto mb-5 mt-10 w-full px-5 md:max-w-screen-md">
                    <div className="flex-1">
                      <div className="flex flex-col items-start">
                        <h3 className="text-foreground border-border mb-6 w-full border-b pb-2 text-lg font-semibold">
                          Written by
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
                                src={resizeImage(
                                  'https://cdn.hashnode.com/res/hashnode/image/upload/v1659089761812/fsOct5gl6.png',
                                  { w: 256, h: 256, c: 'face' },
                                )}
                                alt={caseStudy.author?.name || 'Author'}
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
                                  {caseStudy.author?.name || 'Mindware Team'}
                                </a>
                              </h4>
                              <p className="text-muted-foreground mb-4 text-base leading-relaxed">
                                Full-stack developer and technical consultant with expertise in SaaS
                                platforms, AI integration, and scalable architectures. Passionate
                                about building innovative solutions that drive business growth and
                                user engagement.
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {caseStudy.tags.map((tag) => (
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
                {/* Sticky TOC */}
                <aside className="hidden w-72 flex-shrink-0 lg:block xl:w-80">
                  <div className="sticky top-20">
                    <Card className="border-border/50">
                      <CardContent className="p-4 lg:p-6">
                        <h3 className="mb-3 text-base font-semibold lg:mb-4 lg:text-lg">
                          Table of Contents
                        </h3>
                        <ScrollArea className="h-[calc(100vh-180px)]">
                          <nav className="space-y-1 lg:space-y-2">
                            {tocItems.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`w-full rounded-lg px-2 py-1.5 text-left text-sm transition-colors duration-200 lg:px-3 lg:py-2 lg:text-base ${
                                  activeSection === item.id
                                    ? 'bg-primary/10 text-primary border-primary/20 border'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                }`}
                              >
                                {item.title}
                              </button>
                            ))}
                          </nav>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>
                </aside>
              </div>
            </div>
          </Container>
        </main>

        <Chatbot />
      </Layout>
    </AppProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    
    if (!slug) {
      return {
        notFound: true,
      };
    }

    // Fetch case study from API
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/case-studies/${slug}`);
    
    if (!response.ok) {
      return {
        notFound: true,
      };
    }

    const caseStudy = await response.json();

    return {
      props: {
        caseStudy,
        publication: siteConfig,
      },
    };
  } catch (error) {
    console.error('Error fetching case study:', error);
    return {
      notFound: true,
    };
  }
};
