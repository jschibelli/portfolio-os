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
            {publication.displayTitle || publication.title || 'Hashnode Blog'} - About
          </title>
          <meta name="description" content="Learn more about me and my journey in technology" />
          <meta property="og:title" content={`${publication.displayTitle || publication.title || 'Hashnode Blog'} - About`} />
          <meta property="og:description" content="Learn more about me and my journey in technology" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={`${publication.url}/about`} />
          <meta name="twitter:title" content={`${publication.displayTitle || publication.title || 'Hashnode Blog'} - About`} />
          <meta name="twitter:description" content="Learn more about me and my journey in technology" />
        </Head>
        <CustomNavigation publication={publication} />
        
        <main className="blog-content-area feed-width mx-auto md:w-2/3 lg:w-2/3">
          <div className="blog-content-card">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-6">About Me</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Hi, I&apos;m {publication.author?.name || 'John Doe'}. I&apos;m a passionate developer and technology enthusiast who loves sharing knowledge and building amazing things.
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <h2>My Journey</h2>
              <p>
                I&apos;ve been working in the technology industry for several years, focusing on web development, 
                mobile applications, and cloud technologies. My passion lies in creating user-friendly, 
                scalable solutions that solve real-world problems.
              </p>

              <h2>What I Do</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Web Development</h3>
                  <p className="text-muted-foreground">Building modern, responsive web applications with React, Next.js, and Node.js</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Mobile Development</h3>
                  <p className="text-muted-foreground">Creating native and cross-platform mobile applications</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Cloud Solutions</h3>
                  <p className="text-muted-foreground">Designing and implementing scalable cloud infrastructure</p>
                </div>
              </div>

              <h2>My Skills</h2>
              <p>
                I specialize in modern web technologies and frameworks, including:
              </p>
              <ul>
                <li><strong>Frontend:</strong> React, Next.js, TypeScript, Tailwind CSS</li>
                <li><strong>Backend:</strong> Node.js, Express, Python, Django</li>
                <li><strong>Mobile:</strong> React Native, Flutter</li>
                <li><strong>Cloud:</strong> AWS, Google Cloud, Docker, Kubernetes</li>
                <li><strong>Databases:</strong> PostgreSQL, MongoDB, Redis</li>
              </ul>

              <h2>My Mission</h2>
              <p>
                I believe in sharing knowledge and helping others grow in their technology journey. 
                Through this blog, I aim to provide valuable insights, tutorials, and thoughts on 
                the latest trends in technology and development.
              </p>

              <h2>Get In Touch</h2>
              <p>
                I&apos;m always interested in connecting with fellow developers, discussing new projects, 
                or just having a chat about technology. Feel free to reach out!
              </p>
              <div className="text-center mt-8">
                <a
                  href="mailto:contact@example.com"
                  className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Contact Me
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
  // Mock publication data that matches the structure expected by CustomNavigation
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
}; 