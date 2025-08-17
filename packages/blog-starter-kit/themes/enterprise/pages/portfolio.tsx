import { GetStaticProps } from 'next';
import Head from 'next/head';
import request from 'graphql-request';
import { Container } from '../components/container';
import { AppProvider } from '../components/contexts/appContext';
import { Layout } from '../components/layout';
import ModernHeader from '../components/modern-header';
import Chatbot from '../components/ui/Chatbot';
import { PublicationByHostDocument } from '../generated/graphql';

interface Props {
  publication: any;
}

export default function PortfolioPage({ publication }: Props) {
  return (
    <AppProvider publication={publication}>
      <Layout>
        <Head>
          <title>
            {publication.displayTitle || publication.title} - Portfolio
          </title>
          <meta name="description" content="Explore our latest projects and case studies" />
          <meta property="og:title" content={`${publication.displayTitle || publication.title} - Portfolio`} />
          <meta property="og:description" content="Explore our latest projects and case studies" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={`${publication.url}/portfolio`} />
          <meta name="twitter:title" content={`${publication.displayTitle || publication.title} - Portfolio`} />
          <meta name="twitter:description" content="Explore our latest projects and case studies" />
        </Head>
        <ModernHeader publication={publication} />
        
        <Container className="flex flex-col items-stretch gap-10 px-5 pb-10">
          {/* Portfolio Hero Section */}
          <div 
            id="portfolio-hero-section"
            data-animate-section
            className={`text-center transition-all duration-1000 ease-out ${
              true ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Our Portfolio
              </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover our latest projects and see how we&apos;ve helped businesses achieve their digital transformation goals.
              </p>
            </div>

          {/* Featured Projects */}
          <div 
            id="featured-projects-section"
            data-animate-section
            className={`transition-all duration-1200 ease-out ${
              true ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-3xl font-bold text-foreground mb-8">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Project 1 */}
              <div className="group">
                <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">E-Commerce Platform</h3>
                    <p className="text-muted-foreground mb-4">
                      A modern e-commerce platform built with Next.js, featuring real-time inventory management and seamless payment processing.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">Next.js</span>
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm rounded-full">TypeScript</span>
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm rounded-full">Stripe</span>
                    </div>
                    <a href="#" className="text-primary hover:text-primary/80 font-medium">
                      View Project →
                    </a>
                  </div>
                </div>
              </div>

              {/* Project 2 */}
              <div className="group">
                <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                  <div className="h-48 bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">Mobile Banking App</h3>
                    <p className="text-muted-foreground mb-4">
                      A secure mobile banking application with biometric authentication and real-time transaction monitoring.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">React Native</span>
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm rounded-full">Node.js</span>
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm rounded-full">AWS</span>
                    </div>
                    <a href="#" className="text-primary hover:text-primary/80 font-medium">
                      View Project →
                    </a>
                  </div>
                </div>
              </div>

              {/* Project 3 */}
              <div className="group">
                <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                  <div className="h-48 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">Cloud Analytics Dashboard</h3>
                    <p className="text-muted-foreground mb-4">
                      A comprehensive analytics dashboard for cloud infrastructure monitoring and performance optimization.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">React</span>
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm rounded-full">D3.js</span>
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm rounded-full">Kubernetes</span>
                    </div>
                    <a href="#" className="text-primary hover:text-primary/80 font-medium">
                      View Project →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Case Studies */}
          <div 
            id="case-studies-section"
            data-animate-section
            className={`transition-all duration-1300 ease-out ${
              true ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-3xl font-bold text-foreground mb-8">Case Studies</h2>
            <div className="space-y-8">
              <div className="bg-card border border-border rounded-lg p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-foreground mb-2">TechCorp Digital Transformation</h3>
                    <p className="text-muted-foreground mb-4">
                      Helped TechCorp modernize their legacy systems with a microservices architecture, resulting in 40% faster deployment times and 60% reduction in downtime.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Duration: 6 months</span>
                      <span>Team: 8 developers</span>
                      <span>Technologies: Docker, Kubernetes, Node.js</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-foreground mb-2">FinTech Startup MVP</h3>
                    <p className="text-muted-foreground mb-4">
                      Developed a complete MVP for a fintech startup, including user authentication, payment processing, and real-time notifications, launched in just 3 months.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Duration: 3 months</span>
                      <span>Team: 4 developers</span>
                      <span>Technologies: React, Firebase, Stripe</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div 
            id="contact-section"
            data-animate-section
            className={`text-center transition-all duration-1400 ease-out ${
              true ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-3xl font-bold text-foreground mb-6">Ready to Start Your Project?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Let&apos;s discuss how we can help bring your vision to life with cutting-edge technology solutions.
            </p>
            <a
              href="mailto:contact@example.com"
              className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Start Your Project
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </Container>
        <Chatbot />
      </Layout>
    </AppProvider>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const GQL_ENDPOINT = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT || 'https://gql.hashnode.com/';
  	const host = process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST || 'mindware.hashnode.dev';
  
  try {
    const data = await request(GQL_ENDPOINT, PublicationByHostDocument, { host });
    const publication = data.publication;

    if (!publication) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        publication,
      },
      revalidate: 1,
    };
  } catch (error) {
    console.error('Error fetching publication data:', error);
    
    // Return a fallback response to prevent the build from failing
    return {
      props: {
        publication: {
          id: 'fallback',
          title: 'John Schibelli - Senior Front-End Developer',
          displayTitle: 'John Schibelli - Senior Front-End Developer',
          descriptionSEO: 'Senior Front-End Developer with 15+ years of experience',
          					url: 'https://mindware.hashnode.dev',
          posts: {
            totalDocuments: 0
          },
          preferences: {
            logo: null
          },
          author: {
            name: 'John Schibelli',
            profilePicture: null
          },
          followersCount: 0,
          isTeam: false,
          favicon: null,
          ogMetaData: {
            image: null
          }
        } as any,
      },
      revalidate: 1,
    };
  }
}; 