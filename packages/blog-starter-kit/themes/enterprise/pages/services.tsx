import { GetStaticProps } from 'next';
import Head from 'next/head';
import { Container } from '../components/shared/container';
import { AppProvider } from '../components/contexts/appContext';
import { Layout } from '../components/shared/layout';
import ModernHeader from '../components/features/navigation/modern-header';
import Chatbot from '../components/features/chatbot/Chatbot';

interface Props {
  publication: any;
}

export default function ServicesPage({ publication }: Props) {

  return (
    <AppProvider publication={publication}>
      <Layout>
        <Head>
          <title>
            {publication.displayTitle || publication.title || 'John Schibelli'} - Services
          </title>
          <meta name="description" content="Professional services and solutions we offer" />
          <meta property="og:title" content={`${publication.displayTitle || publication.title || 'John Schibelli'} - Services`} />
          <meta property="og:description" content="Professional services and solutions we offer" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={`${publication.url}/services`} />
          <meta name="twitter:title" content={`${publication.displayTitle || publication.title || 'John Schibelli'} - Services`} />
          <meta name="twitter:description" content="Professional services and solutions we offer" />
        </Head>
        <ModernHeader publication={publication} />
        
        <Container className="flex flex-col items-stretch gap-10 px-5 pb-10">
          {/* Services Hero Section */}
          <div 
            id="services-hero-section"
            data-animate-section
            className={`text-center transition-all duration-1000 ease-out ${
              true ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Our Services
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We provide comprehensive technology solutions to help your business grow and succeed in the digital world.
            </p>
          </div>

          {/* Services Grid Section */}
          <div 
            id="services-grid-section"
            data-animate-section
            className={`transition-all duration-1200 ease-out ${
              true ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Web Development */}
            <div className="group">
              <div className="bg-card border border-border rounded-lg p-6 h-full hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Web Development</h3>
                <p className="text-muted-foreground mb-4">
                  Custom web applications built with modern technologies and best practices.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• React & Next.js Development</li>
                  <li>• Full-Stack Applications</li>
                  <li>• API Development</li>
                  <li>• Performance Optimization</li>
                </ul>
              </div>
            </div>

            {/* Mobile Development */}
            <div className="group">
              <div className="bg-card border border-border rounded-lg p-6 h-full hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Mobile Development</h3>
                <p className="text-muted-foreground mb-4">
                  Native and cross-platform mobile applications for iOS and Android.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• React Native Development</li>
                  <li>• Native iOS/Android Apps</li>
                  <li>• App Store Optimization</li>
                  <li>• Cross-Platform Solutions</li>
                </ul>
              </div>
            </div>

            {/* Cloud Solutions */}
            <div className="group">
              <div className="bg-card border border-border rounded-lg p-6 h-full hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Cloud Solutions</h3>
                <p className="text-muted-foreground mb-4">
                  Scalable cloud infrastructure and DevOps solutions.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• AWS/Azure/GCP Setup</li>
                  <li>• CI/CD Pipelines</li>
                  <li>• Container Orchestration</li>
                  <li>• Infrastructure as Code</li>
                </ul>
              </div>
            </div>

            {/* UI/UX Design */}
            <div className="group">
              <div className="bg-card border border-border rounded-lg p-6 h-full hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">UI/UX Design</h3>
                <p className="text-muted-foreground mb-4">
                  User-centered design solutions for engaging experiences.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• User Interface Design</li>
                  <li>• User Experience Research</li>
                  <li>• Prototyping & Wireframing</li>
                  <li>• Design Systems</li>
                </ul>
              </div>
            </div>

            {/* Consulting */}
            <div className="group">
              <div className="bg-card border border-border rounded-lg p-6 h-full hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Technical Consulting</h3>
                <p className="text-muted-foreground mb-4">
                  Expert guidance on technology strategy and implementation.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Technology Strategy</li>
                  <li>• Architecture Review</li>
                  <li>• Code Audits</li>
                  <li>• Team Training</li>
                </ul>
              </div>
            </div>

            {/* Maintenance */}
            <div className="group">
              <div className="bg-card border border-border rounded-lg p-6 h-full hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Maintenance & Support</h3>
                <p className="text-muted-foreground mb-4">
                  Ongoing maintenance and technical support for applications.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Bug Fixes & Updates</li>
                  <li>• Security Patches</li>
                  <li>• Performance Monitoring</li>
                  <li>• 24/7 Support</li>
                </ul>
              </div>
            </div>
          </div>
          </div>

          {/* Why Choose Us Section */}
          <div 
            id="why-choose-us-section"
            data-animate-section
            className={`transition-all duration-1300 ease-out ${
              true ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="bg-card border border-border rounded-lg p-8 mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Why Choose Us?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Expert Team</h3>
                  <p className="text-muted-foreground">
                    Our team consists of experienced developers, designers, and consultants with years of industry experience.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Modern Technologies</h3>
                  <p className="text-muted-foreground">
                    We use the latest technologies and best practices to ensure your projects are future-proof and scalable.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Quality Assurance</h3>
                  <p className="text-muted-foreground">
                    Every project goes through rigorous testing and quality assurance processes to ensure excellence.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Ongoing Support</h3>
                  <p className="text-muted-foreground">
                    We provide continuous support and maintenance to keep your applications running smoothly.
                  </p>
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
            <h2 className="text-3xl font-bold text-foreground mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Let&apos;s discuss your project requirements and find the perfect solution for your needs.
            </p>
            <a
              href="mailto:contact@example.com"
              className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Contact Us
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
  // Mock publication data that matches the structure expected by ModernHeader
  const publication: any = {
    		title: 'John Schibelli',
		displayTitle: 'John Schibelli',
          url: 'https://mindware.hashnode.dev',
    logo: null,
          author: { name: 'John Schibelli' },
    descriptionSEO: 'Professional technology solutions and consulting services',
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