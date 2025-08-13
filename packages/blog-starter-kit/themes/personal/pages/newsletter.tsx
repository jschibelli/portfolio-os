import { GetStaticProps } from 'next';
import Head from 'next/head';
import request from 'graphql-request';
import { AppProvider } from '../components/contexts/appContext';
import { Layout } from '../components/layout';
import { CustomNavigation } from '../../../components/custom-navigation';
import { PublicationByHostDocument } from '../generated/graphql';

interface Props {
  publication: any;
}

export default function NewsletterPage({ publication }: Props) {
  return (
    <AppProvider publication={publication}>
      <Layout>
        <Head>
          <title>
            {publication.displayTitle || publication.title} - Newsletter
          </title>
          <meta name="description" content="Subscribe to our newsletter for the latest insights and updates" />
          <meta property="og:title" content={`${publication.displayTitle || publication.title} - Newsletter`} />
          <meta property="og:description" content="Subscribe to our newsletter for the latest insights and updates" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={`${publication.url}/newsletter`} />
          <meta name="twitter:title" content={`${publication.displayTitle || publication.title} - Newsletter`} />
          <meta name="twitter:description" content="Subscribe to our newsletter for the latest insights and updates" />
        </Head>
        <CustomNavigation publication={publication} />
        
        <div className="min-h-screen bg-white dark:bg-neutral-900">
          <div className="mx-auto max-w-4xl px-4 py-8">
            <main className="mt-16">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-6">Stay Updated</h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Get the latest insights on technology trends, development tips, and industry updates delivered straight to your inbox.
                </p>
              </div>

              <div className="prose prose-lg max-w-none">
                <div className="bg-card border border-border rounded-lg p-8 max-w-2xl mx-auto mb-12">
                  <h2 className="text-3xl font-bold mb-6 text-center">Subscribe to Our Newsletter</h2>
                  <p className="text-muted-foreground mb-8 text-center">
                    Join thousands of developers and tech enthusiasts who get our weekly insights.
                  </p>
                  
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter your email address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Topics of Interest
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            name="topics"
                            value="web-development"
                            className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                          />
                          <span className="text-sm">Web Development</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            name="topics"
                            value="mobile-development"
                            className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                          />
                          <span className="text-sm">Mobile Development</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            name="topics"
                            value="cloud-computing"
                            className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                          />
                          <span className="text-sm">Cloud Computing</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            name="topics"
                            value="ai-ml"
                            className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                          />
                          <span className="text-sm">AI & Machine Learning</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="privacy"
                        name="privacy"
                        required
                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2 mt-1"
                      />
                      <label htmlFor="privacy" className="text-sm text-muted-foreground">
                        I agree to receive email communications and acknowledge the{' '}
                        <a href="#" className="text-primary hover:text-primary/80 underline">
                          Privacy Policy
                        </a>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Subscribe to Newsletter
                    </button>
                  </form>
                </div>

                <h2>What You&apos;ll Get</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Weekly Insights</h3>
                    <p className="text-muted-foreground">
                      Curated articles and tutorials on the latest in web development, mobile apps, and cloud technologies.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Exclusive Resources</h3>
                    <p className="text-muted-foreground">
                      Access to premium templates, code snippets, and development tools only available to subscribers.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Community Access</h3>
                    <p className="text-muted-foreground">
                      Join our exclusive community of developers and get early access to new features and beta programs.
                    </p>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-8 text-center">
                  <h2 className="text-3xl font-bold mb-8">Join Our Growing Community</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                      <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                      <div className="text-muted-foreground">Active Subscribers</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-primary mb-2">50+</div>
                      <div className="text-muted-foreground">Weekly Articles</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-primary mb-2">95%</div>
                      <div className="text-muted-foreground">Open Rate</div>
                    </div>
                  </div>
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
  const endpoint = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT;
  const host = process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST;

  if (!endpoint || !host) {
    // Fallback to mock data if environment variables are not set
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
  }
}; 