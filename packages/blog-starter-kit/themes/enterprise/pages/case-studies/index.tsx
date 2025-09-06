import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { AppProvider } from '../../components/contexts/appContext';
import Chatbot from '../../components/features/chatbot/Chatbot';
import ModernHeader from '../../components/features/navigation/modern-header';
import { Container } from '../../components/shared/container';
import { Layout } from '../../components/shared/layout';
import { Badge, Card, CardContent } from '../../components/ui';
import { siteConfig } from '../../config/site';

interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: string;
  visibility: string;
  publishedAt: string;
  featured: boolean;
  client?: string;
  industry?: string;
  duration?: string;
  teamSize?: string;
  technologies: string[];
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
  caseStudies: CaseStudy[];
  publication: any;
}

export default function CaseStudiesPage({ caseStudies, publication }: Props) {
  return (
    <AppProvider publication={publication}>
      <Layout>
        <Head>
          <title>Case Studies - {siteConfig.name}</title>
          <meta name="description" content="Explore our project case studies showcasing innovative solutions and successful implementations." />
        </Head>

        <ModernHeader publication={publication} />

        <main className="min-h-screen">
          <Container>
            <div className="py-8 lg:py-12">
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4">
                  Case Studies
                </h1>
                <p className="text-xl text-stone-600 dark:text-stone-400 max-w-3xl mx-auto">
                  Explore our project case studies showcasing innovative solutions, 
                  technical challenges overcome, and measurable results delivered.
                </p>
              </div>

              {/* Featured Case Studies */}
              {caseStudies.filter(cs => cs.featured).length > 0 && (
                <div className="mb-16">
                  <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-6">
                    Featured Case Studies
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {caseStudies
                      .filter(cs => cs.featured)
                      .map((caseStudy) => (
                        <FeaturedCaseStudyCard key={caseStudy.id} caseStudy={caseStudy} />
                      ))}
                  </div>
                </div>
              )}

              {/* All Case Studies */}
              <div>
                <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-6">
                  All Case Studies
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {caseStudies.map((caseStudy) => (
                    <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy} />
                  ))}
                </div>
              </div>

              {/* Empty State */}
              {caseStudies.length === 0 && (
                <div className="text-center py-16">
                  <div className="mx-auto w-24 h-24 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mb-6">
                    <svg className="h-12 w-12 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-stone-900 dark:text-stone-100 mb-2">
                    No case studies yet
                  </h3>
                  <p className="text-stone-600 dark:text-stone-400">
                    Check back soon for our latest project case studies.
                  </p>
                </div>
              )}
            </div>
          </Container>
        </main>

        <Chatbot />
      </Layout>
    </AppProvider>
  );
}

function FeaturedCaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-2 border-stone-200 dark:border-stone-700">
      <CardContent className="p-0">
        {caseStudy.coverImage && (
          <div className="relative h-48 overflow-hidden rounded-t-lg">
            <Image
              src={caseStudy.coverImage}
              alt={caseStudy.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 right-3">
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
                Featured
              </Badge>
            </div>
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-stone-500 dark:text-stone-400">
              {new Date(caseStudy.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
            {caseStudy.category && (
              <>
                <span className="text-stone-300 dark:text-stone-600">•</span>
                <span className="text-sm text-stone-500 dark:text-stone-400">{caseStudy.category}</span>
              </>
            )}
          </div>
          
          <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-3 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">
            <Link href={`/case-studies/${caseStudy.slug}`}>
              {caseStudy.title}
            </Link>
          </h3>
          
          <p className="text-stone-600 dark:text-stone-400 mb-4 line-clamp-3">
            {caseStudy.excerpt}
          </p>

          {/* Project Details */}
          {(caseStudy.client || caseStudy.duration) && (
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              {caseStudy.client && (
                <div>
                  <span className="text-stone-500 dark:text-stone-400">Client:</span>
                  <span className="ml-1 text-stone-700 dark:text-stone-300">{caseStudy.client}</span>
                </div>
              )}
              {caseStudy.duration && (
                <div>
                  <span className="text-stone-500 dark:text-stone-400">Duration:</span>
                  <span className="ml-1 text-stone-700 dark:text-stone-300">{caseStudy.duration}</span>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {caseStudy.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {caseStudy.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{caseStudy.tags.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardContent className="p-0">
        {caseStudy.coverImage && (
          <div className="relative h-40 overflow-hidden rounded-t-lg">
            <Image
              src={caseStudy.coverImage}
              alt={caseStudy.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-stone-500 dark:text-stone-400">
              {new Date(caseStudy.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
            {caseStudy.category && (
              <>
                <span className="text-stone-300 dark:text-stone-600">•</span>
                <span className="text-sm text-stone-500 dark:text-stone-400">{caseStudy.category}</span>
              </>
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-3 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">
            <Link href={`/case-studies/${caseStudy.slug}`}>
              {caseStudy.title}
            </Link>
          </h3>
          
          <p className="text-stone-600 dark:text-stone-400 mb-4 line-clamp-2">
            {caseStudy.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {caseStudy.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {caseStudy.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{caseStudy.tags.length - 2} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Fetch case studies from API
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/case-studies`);
    
    if (!response.ok) {
      return {
        props: {
          caseStudies: [],
          publication: siteConfig,
        },
      };
    }

    const caseStudies = await response.json();

    return {
      props: {
        caseStudies,
        publication: siteConfig,
      },
    };
  } catch (error) {
    console.error('Error fetching case studies:', error);
    return {
      props: {
        caseStudies: [],
        publication: siteConfig,
      },
    };
  }
};
