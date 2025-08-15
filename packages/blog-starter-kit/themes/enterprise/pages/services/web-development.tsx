import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Container } from '../../components/container';
import { AppProvider } from '../../components/contexts/appContext';
import { Layout } from '../../components/layout';
import ModernHeader from '../../components/modern-header';
import { Button } from '../../components/ui/button';

interface Props {
  publication: any;
}

export default function WebDevelopmentPage({ publication }: Props) {
  return (
    <AppProvider publication={publication}>
      <Layout>
        <Head>
          <title>
            {publication.displayTitle || publication.title || 'Enterprise Blog'} - Web Development
          </title>
          <meta name="description" content="Custom web development services using modern technologies like React, Next.js, and full-stack solutions" />
          <meta property="og:title" content={`${publication.displayTitle || publication.title || 'Enterprise Blog'} - Web Development`} />
          <meta property="og:description" content="Custom web development services using modern technologies like React, Next.js, and full-stack solutions" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={`${publication.url}/services/web-development`} />
          <meta name="twitter:title" content={`${publication.displayTitle || publication.title || 'Enterprise Blog'} - Web Development`} />
          <meta name="twitter:description" content="Custom web development services using modern technologies like React, Next.js, and full-stack solutions" />
        </Head>
        <ModernHeader publication={publication} />
        
        <Container className="flex flex-col items-stretch gap-10 px-5 pb-10">
          {/* Hero Section */}
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Web Development
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              We build modern, scalable web applications using cutting-edge technologies and best practices.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Get Started
              </Button>
              <Button size="lg" variant="outline">
                View Portfolio
              </Button>
            </div>
          </div>

          {/* Services Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">React & Next.js</h3>
              <p className="text-muted-foreground">
                Modern frontend development with React ecosystem and Next.js for optimal performance and SEO.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Full-Stack Applications</h3>
              <p className="text-muted-foreground">
                Complete web applications with frontend, backend, and database integration.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">API Development</h3>
              <p className="text-muted-foreground">
                RESTful and GraphQL APIs built with Node.js, Python, or your preferred backend technology.
              </p>
            </div>
          </div>

          {/* Process Section */}
          <div className="bg-card border border-border rounded-lg p-8 mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Our Development Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Discovery</h3>
                <p className="text-sm text-muted-foreground">
                  Understanding your requirements and planning the architecture
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Design</h3>
                <p className="text-sm text-muted-foreground">
                  Creating wireframes and UI/UX designs for your approval
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Development</h3>
                <p className="text-sm text-muted-foreground">
                  Building your application with regular updates and feedback
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">4</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Launch</h3>
                <p className="text-sm text-muted-foreground">
                  Deploying and maintaining your application for success
                </p>
              </div>
            </div>
          </div>

          {/* Technologies */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Technologies We Use</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'GraphQL', 'Tailwind CSS', 'Figma'].map((tech) => (
                <div key={tech} className="bg-card border border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                  <span className="text-sm font-medium text-foreground">{tech}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Build Your Web Application?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Let&apos;s discuss your project and create something amazing together.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Start Your Project
              </Button>
              <Link href="/services">
                <Button size="lg" variant="outline">
                  View All Services
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Layout>
    </AppProvider>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const publication: any = {
    title: 'Enterprise Blog',
    displayTitle: 'Enterprise Blog',
    url: 'https://example.com',
    logo: null,
    author: { name: 'Enterprise Team' },
    descriptionSEO: 'Professional web development services using modern technologies',
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
}; 