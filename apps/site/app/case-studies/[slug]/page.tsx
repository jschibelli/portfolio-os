import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '../../../components/shared/container';
import { Layout } from '../../../components/shared/layout';
import { AppProvider } from '../../../components/contexts/appContext';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import Link from 'next/link';
import { CaseStudyMarkdown } from '../../../components/features/case-studies/case-study-markdown';
import { TableOfContents } from '../../../components/features/case-studies/table-of-contents';
import { getCaseStudyBySlug, getAllCaseStudySlugs } from '../../../lib/mdx-case-study-loader';
import dynamic from 'next/dynamic';

// Lazy load chatbot for better performance
const Chatbot = dynamic(() => import('../../../components/features/chatbot/Chatbot'), {
  loading: () => null,
});

interface CaseStudyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudyData = await getCaseStudyBySlug(slug);
  
  if (!caseStudyData) {
    return {
      title: 'Case Study Not Found',
    };
  }

  const { meta } = caseStudyData;
  const title = `${meta.title} | John Schibelli Portfolio`;
  const description = meta.excerpt || meta.seoDescription || 'Case study showcasing development work';
  const canonical = `https://johnschibelli.dev/case-studies/${slug}`;

  return {
    metadataBase: new URL('https://johnschibelli.dev'),
    title,
    description,
    keywords: meta.tags || [],
    authors: [{ name: meta.author?.name || 'John Schibelli' }],
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
    },
    openGraph: {
      type: 'article',
      locale: 'en_US',
      url: canonical,
      title: meta.seoTitle || title,
      description,
      siteName: 'John Schibelli Portfolio',
      images: meta.coverImage ? [
        {
          url: meta.coverImage,
          width: 1200,
          height: 630,
          alt: `${meta.title} - Case Study`,
        },
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.seoTitle || title,
      description,
      creator: '@johnschibelli',
      site: '@johnschibelli',
      images: meta.coverImage ? [meta.coverImage] : [],
    },
    alternates: {
      canonical,
    },
    other: {
      'article:author': meta.author?.name || 'John Schibelli',
      'article:section': 'Case Studies',
      'article:tag': (meta.tags || []).join(', '),
    },
  };
}

export async function generateStaticParams() {
  const slugs = getAllCaseStudySlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const caseStudyData = await getCaseStudyBySlug(slug);

  if (!caseStudyData) {
    notFound();
  }

  const { meta, content } = caseStudyData;

  return (
    <AppProvider publication={{
      title: 'John Schibelli',
      displayTitle: 'John Schibelli',
      descriptionSEO: 'Senior Front-End Developer with 15+ years of experience',
      url: 'https://johnschibelli.dev',
      author: { name: 'John Schibelli' },
      preferences: { logo: null as any },
    }}>
      <Layout>
        <main className="min-h-screen bg-background">
          <Container className="py-8 max-w-7xl mx-auto">
            <div className="flex gap-8 lg:gap-12">
              {/* Main Content */}
              <article className="flex-1 min-w-0">
                {/* Back Button */}
              <div className="mb-8">
                <Button variant="ghost" asChild>
                  <Link href="/case-studies" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Case Studies
                  </Link>
                </Button>
              </div>

              {/* Case Study Header */}
              <div className="mb-12">
                <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400 mb-4">
                  <Calendar className="h-4 w-4" />
                  <span>{meta.publishedAt ? new Date(meta.publishedAt).toLocaleDateString() : 'Not published'}</span>
                  <User className="h-4 w-4 ml-4" />
                  <span>{meta.author?.name || 'John Schibelli'}</span>
                </div>
                
                <h1 className="text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100 mb-6">
                  {meta.title}
                </h1>
                
                <p className="text-xl text-stone-600 dark:text-stone-400 mb-8">
                  {meta.excerpt || meta.seoDescription}
                </p>

                {/* Tags */}
                {meta.tags && meta.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {meta.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-sm">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Metrics */}
                {meta.metrics && Object.keys(meta.metrics).length > 0 && (
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Key Results</CardTitle>
                      <CardDescription>Measurable outcomes from this project</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(meta.metrics).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                              {value}
                            </div>
                            <div className="text-sm text-stone-600 dark:text-stone-400 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Case Study Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <CaseStudyMarkdown contentMarkdown={content} />
              </div>

              {/* CTA Section */}
              <Card className="mt-12">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
                      Interested in working together?
                    </h3>
                    <p className="text-stone-600 dark:text-stone-400 mb-4">
                      Let's discuss how we can create something amazing for your business.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                      <Button asChild>
                        <Link href="/contact">
                          Get in Touch
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/projects">
                          View More Projects
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </article>

              {/* Table of Contents - Sticky Sidebar */}
              <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
                <TableOfContents content={content} />
              </aside>
            </div>
          </Container>
        </main>
        
        <Chatbot />
      </Layout>
    </AppProvider>
  );
}
