import { Metadata } from 'next';
import { Container } from '../../components/shared/container';
import { Layout } from '../../components/shared/layout';
import { Footer } from '../../components/shared/footer';
import Chatbot from '../../components/features/chatbot/Chatbot';
import { AppProvider } from '../../components/contexts/appContext';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { ArrowRight, Calendar, User, Tag } from 'lucide-react';
import Link from 'next/link';

// Mock case studies data - in a real app, this would come from your CMS or database
const caseStudies = [
  {
    id: 'tendrilo-case-study',
    title: 'Tendril Multi-Tenant Chatbot SaaS: Strategic Analysis and Implementation Plan',
    slug: 'tendrilo-case-study',
    description: 'Comprehensive strategic analysis and implementation plan for Tendril Multi-Tenant Chatbot SaaS platform targeting SMB market gaps.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
    tags: ['SaaS', 'AI', 'Multi-tenant', 'Chatbot'],
    publishedAt: '2025-01-10',
    author: 'John Schibelli',
    featured: true,
    metrics: {
      revenueIncrease: '150%',
      userRetention: '91%',
      setupTime: '18 minutes'
    },
    liveUrl: 'https://tendril.intrawebtech.com',
    caseStudyUrl: '/case-studies/tendrilo-case-study'
  }
];

export const metadata: Metadata = {
  title: 'Case Studies | John Schibelli Portfolio',
  description: 'Explore detailed case studies showcasing successful projects, strategic analysis, and implementation results.',
  keywords: ['case studies', 'portfolio', 'projects', 'strategic analysis', 'implementation'],
  openGraph: {
    title: 'Case Studies | John Schibelli Portfolio',
    description: 'Explore detailed case studies showcasing successful projects, strategic analysis, and implementation results.',
    type: 'website',
  },
};

export default function CaseStudiesPage() {
  return (
    <AppProvider publication={{
      title: 'John Schibelli',
      displayTitle: 'John Schibelli',
      descriptionSEO: 'Senior Front-End Developer with 15+ years of experience',
      url: 'https://schibelli.dev',
      author: { name: 'John Schibelli' },
      preferences: { logo: null as any },
    }}>
      <Layout>
        <main className="min-h-screen bg-background">
          {/* Hero Section */}
          <section className="bg-stone-50 dark:bg-stone-900 py-16 lg:py-24">
            <Container className="px-4 sm:px-6">
              <div className="mx-auto max-w-4xl text-center">
                <h1 className="text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100 sm:text-6xl">
                  Case Studies
                </h1>
                <p className="mt-6 text-lg leading-8 text-stone-600 dark:text-stone-400">
                  Deep dives into successful projects, strategic analysis, and implementation results that drive business growth.
                </p>
              </div>
            </Container>
          </section>

          {/* Case Studies Grid */}
          <section className="py-16 lg:py-24">
            <Container className="px-4 sm:px-6">
              <div className="grid gap-8 lg:grid-cols-2">
                {caseStudies.map((caseStudy) => (
                  <Card key={caseStudy.id} className="group overflow-hidden border border-stone-200 bg-white shadow-lg transition-all duration-300 hover:border-stone-300 hover:shadow-xl dark:border-stone-700 dark:bg-stone-800 dark:hover:border-stone-600">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={caseStudy.image}
                        alt={caseStudy.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      
                      {/* Featured Badge */}
                      {caseStudy.featured && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-amber-500 text-white">Featured</Badge>
                        </div>
                      )}
                    </div>

                    <CardHeader>
                      <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(caseStudy.publishedAt).toLocaleDateString()}</span>
                        <User className="h-4 w-4 ml-4" />
                        <span>{caseStudy.author}</span>
                      </div>
                      <CardTitle className="text-xl font-bold text-stone-900 dark:text-stone-100">
                        {caseStudy.title}
                      </CardTitle>
                      <CardDescription className="text-stone-600 dark:text-stone-400">
                        {caseStudy.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {caseStudy.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Metrics */}
                      {caseStudy.metrics && (
                        <div className="grid grid-cols-3 gap-4 rounded-lg bg-stone-50 p-4 dark:bg-stone-900">
                          {Object.entries(caseStudy.metrics).map(([key, value]) => (
                            <div key={key} className="text-center">
                              <div className="text-lg font-bold text-stone-900 dark:text-stone-100">
                                {value}
                              </div>
                              <div className="text-xs text-stone-600 dark:text-stone-400 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Button asChild className="flex-1">
                          <Link href={caseStudy.caseStudyUrl}>
                            Read Case Study
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                        {caseStudy.liveUrl && (
                          <Button variant="outline" asChild>
                            <Link href={caseStudy.liveUrl} target="_blank" rel="noopener noreferrer">
                              View Live Site
                            </Link>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Empty State */}
              {caseStudies.length === 0 && (
                <div className="text-center py-16">
                  <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
                    No case studies yet
                  </h3>
                  <p className="text-stone-600 dark:text-stone-400">
                    Check back soon for detailed case studies of our projects.
                  </p>
                </div>
              )}
            </Container>
          </section>

          {/* CTA Section */}
          <section className="bg-stone-50 dark:bg-stone-900 py-16 lg:py-24">
            <Container className="px-4 sm:px-6">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100 sm:text-4xl">
                  Ready to work together?
                </h2>
                <p className="mt-6 text-lg leading-8 text-stone-600 dark:text-stone-400">
                  Let's discuss your project and create something amazing together.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <Button asChild size="lg">
                    <Link href="/contact">
                      Get in touch
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild size="lg">
                    <Link href="/projects">
                      View Projects
                    </Link>
                  </Button>
                </div>
              </div>
            </Container>
          </section>
        </main>
        
        <Chatbot />
      </Layout>
    </AppProvider>
  );
}
