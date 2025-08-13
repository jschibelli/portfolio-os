import { GetStaticProps } from 'next';
import Head from 'next/head';
import request from 'graphql-request';
import { AppProvider } from '../components/contexts/appContext';
import { Layout } from '../components/layout';
import { CustomNavigation } from '../components/custom-navigation';
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
        <CustomNavigation publication={publication} />
        
        <main className="blog-content-area feed-width mx-auto md:w-2/3 lg:w-2/3">
          <div className="blog-content-card">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-6">Our Portfolio</h1>
                              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Discover our latest projects and see how we&apos;ve helped businesses achieve their digital transformation goals.
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <h2>Featured Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-8">
                <div className="group">
                  <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                    <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">E-Commerce Platform</h3>
                      <p className="text-muted-foreground mb-4">
                        A modern e-commerce platform built with Next.js, featuring real-time inventory management.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">Next.js</span>
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm rounded-full">TypeScript</span>
                      </div>
                      <a href="#" className="text-primary hover:text-primary/80 font-medium">
                        View Project →
                      </a>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                    <div className="h-48 bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">Mobile Banking App</h3>
                      <p className="text-muted-foreground mb-4">
                        A secure mobile banking application with biometric authentication.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">React Native</span>
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm rounded-full">Node.js</span>
                      </div>
                      <a href="#" className="text-primary hover:text-primary/80 font-medium">
                        View Project →
                      </a>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                    <div className="h-48 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">Cloud Analytics Dashboard</h3>
                      <p className="text-muted-foreground mb-4">
                        A comprehensive analytics dashboard for cloud infrastructure monitoring.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">React</span>
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm rounded-full">D3.js</span>
                      </div>
                      <a href="#" className="text-primary hover:text-primary/80 font-medium">
                        View Project →
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <h2>Case Studies</h2>
              <div className="space-y-8 my-8">
                <div className="bg-card border border-border rounded-lg p-8">
                  <h3 className="text-2xl font-semibold mb-4">TechCorp Digital Transformation</h3>
                  <p className="text-muted-foreground mb-4">
                    Helped TechCorp modernize their legacy systems with a microservices architecture, resulting in 40% faster deployment times and 60% reduction in downtime.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Duration: 6 months</span>
                    <span>Team: 8 developers</span>
                    <span>Technologies: Docker, Kubernetes, Node.js</span>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-8">
                  <h3 className="text-2xl font-semibold mb-4">FinTech Startup MVP</h3>
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

              <div className="text-center mt-12">
                <h2 className="text-3xl font-bold mb-6">Ready to Start Your Project?</h2>
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
            </div>
          </div>
        </main>
      </Layout>
    </AppProvider>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const endpoint = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT;
  const host = process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST;

  if (!endpoint || !host) {
    // Fallback to mock data if environment variables are not set
    const publication: any = {
      title: 'Hashnode Blog Starter Kit',
      displayTitle: 'Hashnode Blog Starter Kit',
      url: 'https://example.com',
      logo: null,
      author: { name: 'John Doe' },
      descriptionSEO: 'A modern blog built with Next.js and Hashnode',
      ogMetaData: {
        image: 'https://via.placeholder.com/1200x630',
      },
      preferences: {
        disableFooterBranding: false,
        logo: null,
        darkMode: false,
      },
      isTeam: false,
      imprint: null,
      features: {
        tableOfContents: { isEnabled: true },
        newsletter: { isEnabled: true },
        readMore: { isEnabled: true },
      },
    };

    return {
      props: {
        publication,
      },
      revalidate: 1,
    };
  }

  try {
    const data = await request(endpoint, PublicationByHostDocument, { host });
    const publication = data.publication;

    return {
      props: {
        publication,
      },
      revalidate: 1,
    };
  } catch (error) {
    console.error('Error fetching publication data:', error);
    
    // Fallback to mock data if GraphQL request fails
    const publication: any = {
      title: 'Hashnode Blog Starter Kit',
      displayTitle: 'Hashnode Blog Starter Kit',
      url: 'https://example.com',
      logo: null,
      author: { name: 'John Doe' },
      descriptionSEO: 'A modern blog built with Next.js and Hashnode',
      ogMetaData: {
        image: 'https://via.placeholder.com/1200x630',
      },
      preferences: {
        disableFooterBranding: false,
        logo: null,
        darkMode: false,
      },
      isTeam: false,
      imprint: null,
      features: {
        tableOfContents: { isEnabled: true },
        newsletter: { isEnabled: true },
        readMore: { isEnabled: true },
      },
    };

    return {
      props: {
        publication,
      },
      revalidate: 1,
    };
  }
}; 