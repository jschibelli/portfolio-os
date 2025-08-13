import { GetStaticProps } from 'next';
import Head from 'next/head';
import { AppProvider } from '../components/contexts/appContext';
import { Layout } from '../components/layout';
import { CustomNavigation } from '../../../components/custom-navigation';

interface Props {
  publication: any;
}

export default function AboutPage({ publication }: Props) {
  return (
    <AppProvider publication={publication}>
      <Layout>
        <Head>
          <title>
            {publication.displayTitle || publication.title || 'Personal Blog'} - About
          </title>
          <meta name="description" content="Learn more about our team and mission" />
          <meta property="og:title" content={`${publication.displayTitle || publication.title || 'Personal Blog'} - About`} />
          <meta property="og:description" content="Learn more about our team and mission" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={`${publication.url}/about`} />
          <meta name="twitter:title" content={`${publication.displayTitle || publication.title || 'Personal Blog'} - About`} />
          <meta name="twitter:description" content="Learn more about our team and mission" />
        </Head>
        <CustomNavigation publication={publication} />
        
        <div className="min-h-screen bg-white dark:bg-neutral-900">
          <div className="mx-auto max-w-4xl px-4 py-8">
            <main className="mt-16">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-6">About Us</h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  We are a team of passionate developers, designers, and technology enthusiasts dedicated to creating innovative solutions.
                </p>
              </div>

              <div className="prose prose-lg max-w-none">
                <h2>Our Mission</h2>
                <p>
                  To empower businesses with cutting-edge technology solutions that drive growth, efficiency, and innovation. 
                  We believe in creating software that not only meets today's needs but anticipates tomorrow's challenges.
                </p>

                <h2>Our Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                    <p className="text-muted-foreground">Pushing the boundaries of what's possible with technology</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Quality</h3>
                    <p className="text-muted-foreground">Delivering excellence in every project we undertake</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
                    <p className="text-muted-foreground">Working together to achieve extraordinary results</p>
                  </div>
                </div>

                <h2>Our Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-8">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-2xl">JD</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">John Doe</h3>
                    <p className="text-muted-foreground mb-2">Lead Developer</p>
                    <p className="text-sm text-muted-foreground">
                      Full-stack developer with 8+ years of experience in React, Node.js, and cloud technologies.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-2xl">JS</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Jane Smith</h3>
                    <p className="text-muted-foreground mb-2">UI/UX Designer</p>
                    <p className="text-sm text-muted-foreground">
                      Creative designer focused on user experience and modern interface design.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-2xl">MB</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Mike Brown</h3>
                    <p className="text-muted-foreground mb-2">DevOps Engineer</p>
                    <p className="text-sm text-muted-foreground">
                      Infrastructure specialist with expertise in AWS, Docker, and CI/CD pipelines.
                    </p>
                  </div>
                </div>

                <h2>Get In Touch</h2>
                <p>
                  Ready to start your next project? Let&apos;s discuss how we can help bring your ideas to life.
                </p>
                <div className="text-center mt-8">
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
              </div>
            </main>
          </div>
        </div>
      </Layout>
    </AppProvider>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  // Mock publication data that matches the structure expected by CustomNavigation
  const publication: any = {
    title: 'Personal Blog',
    displayTitle: 'Personal Blog',
    url: 'https://example.com',
    logo: null,
    author: { name: 'John Doe' },
    descriptionSEO: 'A personal blog about technology and development',
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