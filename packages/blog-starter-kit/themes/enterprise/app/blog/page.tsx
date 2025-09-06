import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { AppProvider } from '../../components/contexts/appContext';
import ModernHeader from '../../components/features/navigation/modern-header';
import { Footer } from '../../components/shared/footer';

export default async function BlogIndex() {
  // Use mock data for better performance testing
  const mockPosts = [
    {
      title: "Getting Started with Modern Web Development",
      subtitle: "A comprehensive guide to building scalable web applications",
      slug: "getting-started-modern-web-development",
      excerpt: "Learn the fundamentals of modern web development with React, Next.js, and TypeScript. This guide covers everything from setup to deployment.",
      publishedAt: new Date().toISOString(),
      readingMinutes: 8,
      views: 1250,
      featured: true,
      author: { name: "John Schibelli" },
      cover: {
        url: "/assets/placeholder-blog-1.jpg",
        alt: "Modern web development concepts"
      },
      tags: [
        { tag: { name: "Web Development" } },
        { tag: { name: "React" } },
        { tag: { name: "Next.js" } }
      ]
    },
    {
      title: "Building Scalable React Applications",
      subtitle: "Best practices for large-scale React development",
      slug: "building-scalable-react-applications",
      excerpt: "Discover the key patterns and practices for building maintainable and scalable React applications that can grow with your business.",
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      readingMinutes: 12,
      views: 890,
      featured: false,
      author: { name: "John Schibelli" },
      cover: {
        url: "/assets/placeholder-blog-2.jpg",
        alt: "React application architecture"
      },
      tags: [
        { tag: { name: "React" } },
        { tag: { name: "Architecture" } },
        { tag: { name: "Best Practices" } }
      ]
    },
    {
      title: "TypeScript for Modern Development",
      subtitle: "Leveraging TypeScript for better code quality",
      slug: "typescript-modern-development",
      excerpt: "Explore how TypeScript can improve your development workflow and help you catch errors before they reach production.",
      publishedAt: new Date(Date.now() - 172800000).toISOString(),
      readingMinutes: 10,
      views: 650,
      featured: false,
      author: { name: "John Schibelli" },
      cover: {
        url: "/assets/placeholder-blog-3.jpg",
        alt: "TypeScript development workflow"
      },
      tags: [
        { tag: { name: "TypeScript" } },
        { tag: { name: "Development" } },
        { tag: { name: "Code Quality" } }
      ]
    }
  ];

  const featuredPost = mockPosts.find(post => post.featured) || mockPosts[0];
  const latestPosts = mockPosts.filter(post => post.slug !== featuredPost?.slug).slice(0, 3);

  // Mock publication object for consistent navigation
  const publication = {
    id: 'blog-publication',
    title: 'John Schibelli',
    displayTitle: 'John Schibelli',
    descriptionSEO: 'Senior Front-End Developer with 15+ years of experience',
    url: 'https://mindware.hashnode.dev',
    posts: {
      totalDocuments: 0,
    },
    preferences: {
      logo: null,
      navbarItems: [],
    },
    author: {
      name: 'John Schibelli',
      username: 'johnschibelli',
      profilePicture: null,
      followersCount: 0,
    },
    followersCount: 0,
    isTeam: false,
    favicon: null,
    ogMetaData: {
      image: null,
    },
  };

  return (
      <AppProvider publication={publication}>
        <div className="min-h-screen bg-background text-foreground">
          {/* Main Navigation Header - Same as used across the app */}
          <ModernHeader publication={publication} />

          {/* Hero Section */}
          <section className="relative py-20 px-4">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-90"></div>
            <div className="absolute inset-0 bg-[url('/assets/circuit-pattern.png')] bg-cover bg-center opacity-20"></div>
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
                The Developer&apos;s Lens
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Unfiltered perspectives on code, creativity, and the constant evolution of technology.
              </p>
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Featured Post */}
            {featuredPost && (
              <section className="mb-16">
                <div className="bg-card rounded-lg overflow-hidden shadow-lg border border-border">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                    <div className="flex items-center justify-center bg-muted rounded-lg p-12">
                      {featuredPost.cover ? (
                        <Image 
                          src={featuredPost.cover.url} 
                          alt={featuredPost.cover.alt || featuredPost.title}
                          width={600}
                          height={256}
                          className="w-full h-64 object-cover rounded-lg"
                          priority
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="text-center">
                          <svg className="w-24 h-24 mx-auto text-muted-foreground mb-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                            <path d="M14 2v6h6"/>
                            <path d="M16 13H8"/>
                            <path d="M16 17H8"/>
                            <path d="M10 9H8"/>
                          </svg>
                          <p className="text-muted-foreground">Document Icon</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                          Featured
                        </span>
                        <span className="text-muted-foreground">
                          {featuredPost.publishedAt && format(new Date(featuredPost.publishedAt), "MMM d, yyyy")}
                        </span>
                        <span className="text-muted-foreground">
                          {featuredPost.readingMinutes || 5} min read
                        </span>
                      </div>
                      <h2 className="text-3xl font-bold mb-4 leading-tight text-foreground">
                        {featuredPost.title}
                      </h2>
                      <p className="text-muted-foreground mb-6 line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
                          Featured
                        </span>
                        {featuredPost.tags && featuredPost.tags.length > 0 ? (
                          featuredPost.tags.slice(0, 2).map((tag) => (
                            <span key={tag.tag.name} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                              {tag.tag.name}
                            </span>
                          ))
                        ) : (
                          <>
                            <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                              Technology
                            </span>
                            <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                              Insights
                            </span>
                          </>
                        )}
                      </div>
                      <Link
                        href={`/blog/${featuredPost.slug}`}
                        className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        Read full article →
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Latest Posts */}
            <section>
              <h2 className="text-3xl font-bold mb-8 text-foreground">Latest Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {latestPosts.map((post) => (
                  <article key={post.slug} className="bg-card rounded-lg overflow-hidden hover:bg-accent transition-colors shadow-lg border border-border">
                    <div className="relative">
                      {post.cover ? (
                        <Image
                          src={post.cover.url}
                          alt={post.cover.alt || post.title}
                          width={400}
                          height={192}
                          className="w-full h-48 object-cover"
                          loading="lazy"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="bg-muted h-48 flex items-center justify-center">
                          <div className="text-center">
                            <svg className="w-16 h-16 mx-auto text-muted-foreground mb-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                            <p className="text-muted-foreground text-sm">Article Image</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                          {post.tags && post.tags.length > 0 ? post.tags[0].tag.name : 'Technology'}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <span>
                          {post.publishedAt && format(new Date(post.publishedAt), "MMM d, yyyy")}
                        </span>
                        <span className="mx-2">•</span>
                        <span>{post.readingMinutes || 5} min read</span>
                      </div>
                      <h3 className="text-xl font-bold mb-3 line-clamp-2 text-foreground">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                          {post.tags && post.tags.length > 1 ? post.tags[1].tag.name : 'Development'}
                        </span>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-primary hover:text-primary/80 font-medium transition-colors"
                        >
                          Read more →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Newsletter Section */}
            <section className="mt-20 text-center">
              <div className="bg-card rounded-lg p-12 shadow-lg border border-border">
                <h2 className="text-3xl font-bold mb-4 text-foreground">Stay updated with our newsletter</h2>
                <div className="max-w-md mx-auto">
                  <div className="flex">
                    <input
                      type="email"
                      placeholder="Email address"
                      className="flex-1 px-4 py-3 bg-background text-foreground placeholder-muted-foreground rounded-l-lg focus:outline-none focus:ring-2 focus:ring-ring border border-input"
                    />
                    <button className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-r-lg hover:bg-primary/90 transition-colors">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Footer - Same as used across the app */}
          <Footer publication={publication} />
        </div>
      </AppProvider>
    );
} 
