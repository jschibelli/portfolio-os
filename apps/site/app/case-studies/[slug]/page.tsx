import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '../../../components/shared/container';
import { Layout } from '../../../components/shared/layout';
import { Footer } from '../../../components/shared/footer';
import Chatbot from '../../../components/features/chatbot/Chatbot';
import { AppProvider } from '../../../components/contexts/appContext';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { ArrowLeft, Calendar, User, Tag, ExternalLink, Github, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { CaseStudyMarkdown } from '../../../components/features/case-studies/case-study-markdown';

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
      revenueIncrease: 'Strong Growth',
      userRetention: 'High',
      setupTime: '18 minutes'
    },
    liveUrl: 'https://tendril.intrawebtech.com',
    githubUrl: 'https://github.com/jschibelli/tendrilo',
    documentationUrl: 'https://docs.tendrilo.ai',
    caseStudyUrl: '/case-studies/tendrilo-case-study',
    content: `# Tendril Multi-Tenant Chatbot SaaS: Strategic Analysis and Implementation Plan

## Problem Statement

The SMB market was underserved by existing chatbot solutions, with most platforms either too complex for small businesses or lacking the multi-tenant capabilities needed for agencies serving multiple client accounts. We identified a significant gap in the market for a user-friendly, scalable chatbot platform that could serve both individual businesses and agencies managing multiple client accounts.

## Market Research & Analysis

### Target Market Segmentation
- **Primary**: Small to medium businesses (1-50 employees) needing customer support automation
- **Secondary**: Digital agencies managing multiple client accounts
- **Tertiary**: Enterprise clients requiring white-label solutions

### Competitive Analysis
Our research revealed that existing solutions like Intercom, Zendesk, and Drift were either:
- Too expensive for SMBs
- Too complex for quick implementation
- Lacked multi-tenant architecture for agencies

## Solution Architecture

### Multi-Tenant Design
- **Database Isolation**: Each tenant's data is completely isolated
- **Custom Branding**: White-label capabilities for agencies
- **Scalable Infrastructure**: Auto-scaling based on usage patterns

### Key Features
- **AI-Powered Conversations**: Natural language processing for customer interactions
- **Easy Setup**: 18-minute average setup time
- **Analytics Dashboard**: Comprehensive insights for each tenant
- **API Integration**: RESTful APIs for custom integrations

## Implementation Results

### Performance Metrics
<<<<<<< HEAD
- **Architecture**: Multi-tenant scalable design with complete data isolation
- **AI Integration**: Advanced natural language processing with GPT-4
=======
- **Revenue Increase**: Strong growth in first 6 months
- **User Retention**: High monthly retention rate
>>>>>>> origin/main
- **Setup Time**: Average 18 minutes from signup to first conversation
- **Active Users**: 2,500+ monthly active users

### Technical Achievements
- **Response Time**: <200ms average response time
- **Uptime**: High availability
- **Scalability**: Handles 10,000+ concurrent conversations

## Lessons Learned

### What Worked Well
1. **Multi-tenant architecture** provided clear value proposition for agencies
2. **Quick setup process** reduced friction for SMB adoption
3. **AI integration** differentiated us from rule-based competitors

### Challenges Overcome
1. **Data isolation** required careful planning for performance
2. **Custom branding** needed flexible theming system
3. **Scalability** demanded robust infrastructure planning

## Next Steps

### Phase 2 Development
- Advanced analytics and reporting
- Enterprise SSO integration
- Mobile app for agents
- Advanced AI training capabilities

### Market Expansion
- International market entry
- Vertical-specific solutions
- Partnership program with agencies

## Conclusion

<<<<<<< HEAD
The Tendril project successfully addressed the SMB chatbot market gap by providing a scalable, multi-tenant solution that serves both individual businesses and agencies. The robust architecture and AI-powered features demonstrate strong technical execution and platform scalability.
=======
The Tendril project successfully addressed the SMB chatbot market gap by providing a scalable, multi-tenant solution that serves both individual businesses and agencies. The strong revenue increase and high user retention demonstrate strong product-market fit and customer satisfaction.
>>>>>>> origin/main

The strategic analysis and implementation plan provided a clear roadmap for success, resulting in a platform that now serves thousands of users across multiple industries.`
  }
];

interface CaseStudyPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = caseStudies.find(cs => cs.slug === slug);
  
  if (!caseStudy) {
    return {
      title: 'Case Study Not Found',
    };
  }

  const title = `${caseStudy.title} | John Schibelli Portfolio`;
  const description = caseStudy.description;
  const canonical = `https://schibelli.dev/case-studies/${caseStudy.slug}`;

  return {
    metadataBase: new URL('https://schibelli.dev'),
    title,
    description,
    keywords: caseStudy.tags,
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
    },
    openGraph: {
      type: 'article',
      locale: 'en_US',
      url: canonical,
      title,
      description,
      siteName: 'John Schibelli Portfolio',
      images: [
        {
          url: caseStudy.image,
          width: 1200,
          height: 630,
          alt: `${caseStudy.title} - Case Study`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@johnschibelli',
      site: '@johnschibelli',
      images: [caseStudy.image],
    },
    alternates: {
      canonical,
    },
    other: {
      'article:author': 'John Schibelli',
      'article:section': 'Case Studies',
      'article:tag': caseStudy.tags.join(', '),
    },
  };
}

export async function generateStaticParams() {
  return caseStudies.map((caseStudy) => ({
    slug: caseStudy.slug,
  }));
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = caseStudies.find(cs => cs.slug === slug);

  if (!caseStudy) {
    notFound();
  }

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
          <Container className="py-8">
            <article className="max-w-4xl mx-auto">
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
                  <span>{new Date(caseStudy.publishedAt).toLocaleDateString()}</span>
                  <User className="h-4 w-4 ml-4" />
                  <span>{caseStudy.author}</span>
                </div>
                
                <h1 className="text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100 mb-6">
                  {caseStudy.title}
                </h1>
                
                <p className="text-xl text-stone-600 dark:text-stone-400 mb-8">
                  {caseStudy.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {caseStudy.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-sm">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Metrics */}
                {caseStudy.metrics && (
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Key Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(caseStudy.metrics).map(([key, value]) => (
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

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  {caseStudy.liveUrl && (
                    <Button asChild>
                      <Link href={caseStudy.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Live Site
                      </Link>
                    </Button>
                  )}
                  {caseStudy.githubUrl && (
                    <Button variant="outline" asChild>
                      <Link href={caseStudy.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        View Code
                      </Link>
                    </Button>
                  )}
                  {caseStudy.documentationUrl && (
                    <Button variant="outline" asChild>
                      <Link href={caseStudy.documentationUrl} target="_blank" rel="noopener noreferrer">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Documentation
                      </Link>
                    </Button>
                  )}
                </div>
              </div>

              {/* Case Study Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <CaseStudyMarkdown contentMarkdown={caseStudy.content} />
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
          </Container>
        </main>
        
        <Chatbot />
      </Layout>
    </AppProvider>
  );
}
