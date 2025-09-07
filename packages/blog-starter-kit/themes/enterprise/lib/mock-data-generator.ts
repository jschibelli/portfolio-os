/**
 * Mock Data Generator for Performance Testing
 * 
 * This utility generates realistic mock data for different testing scenarios
 * while maintaining consistent performance characteristics.
 */

export interface MockPost {
  title: string;
  subtitle: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  readingMinutes: number;
  views: number;
  featured: boolean;
  author: { name: string };
  cover: {
    url: string;
    alt: string;
  };
  tags: Array<{ tag: { name: string } }>;
}

export interface MockDataConfig {
  postCount: number;
  includeFeatured: boolean;
  dateRange: {
    start: Date;
    end: Date;
  };
  categories: string[];
  authors: string[];
}

const DEFAULT_CONFIG: MockDataConfig = {
  postCount: 10,
  includeFeatured: true,
  dateRange: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date()
  },
  categories: [
    'Web Development', 'React', 'Next.js', 'TypeScript', 'Performance',
    'Accessibility', 'SEO', 'Design', 'Architecture', 'Best Practices'
  ],
  authors: ['John Schibelli', 'Tech Team', 'Development Team']
};

const SAMPLE_TITLES = [
  'Building Scalable React Applications',
  'Mastering TypeScript for Modern Development',
  'Performance Optimization Techniques',
  'Accessibility Best Practices',
  'SEO Strategies for Modern Web Apps',
  'Design System Implementation',
  'Microservices Architecture Patterns',
  'Database Optimization Strategies',
  'Security Best Practices',
  'DevOps Automation Workflows'
];

const SAMPLE_EXCERPTS = [
  'Discover the key patterns and practices for building maintainable applications.',
  'Learn how to leverage modern tools and frameworks for better development experience.',
  'Explore proven techniques for optimizing performance and user experience.',
  'Understand the importance of accessibility in modern web development.',
  'Master the art of search engine optimization for better visibility.',
  'Implement consistent design systems across your applications.',
  'Build robust and scalable architectures for enterprise applications.',
  'Optimize your database queries and improve application performance.',
  'Secure your applications with industry-standard security practices.',
  'Automate your development and deployment workflows for efficiency.'
];

/**
 * Generate a random date within the specified range
 */
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Generate a random slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Generate random tags from categories
 */
function generateTags(categories: string[], count: number = 2): Array<{ tag: { name: string } }> {
  const shuffled = [...categories].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(category => ({ tag: { name: category } }));
}

/**
 * Generate mock blog posts
 */
export function generateMockPosts(config: Partial<MockDataConfig> = {}): MockPost[] {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const posts: MockPost[] = [];
  
  for (let i = 0; i < finalConfig.postCount; i++) {
    const titleIndex = i % SAMPLE_TITLES.length;
    const excerptIndex = i % SAMPLE_EXCERPTS.length;
    const authorIndex = i % finalConfig.authors.length;
    
    const title = SAMPLE_TITLES[titleIndex];
    const publishedAt = randomDate(finalConfig.dateRange.start, finalConfig.dateRange.end);
    const isFeatured = finalConfig.includeFeatured && i === 0;
    
    posts.push({
      title,
      subtitle: `A comprehensive guide to ${title.toLowerCase()}`,
      slug: generateSlug(title),
      excerpt: SAMPLE_EXCERPTS[excerptIndex],
      publishedAt: publishedAt.toISOString(),
      readingMinutes: Math.floor(Math.random() * 15) + 5, // 5-20 minutes
      views: Math.floor(Math.random() * 2000) + 100, // 100-2100 views
      featured: isFeatured,
      author: { name: finalConfig.authors[authorIndex] },
      cover: {
        url: `/assets/placeholder-blog-${(i % 5) + 1}.jpg`,
        alt: `${title} - Featured image`
      },
      tags: generateTags(finalConfig.categories, Math.floor(Math.random() * 3) + 1)
    });
  }
  
  return posts;
}

/**
 * Generate mock analytics data
 */
export function generateMockAnalytics() {
  return {
    overview: {
      visitors: Math.floor(Math.random() * 1000) + 500,
      pageviews: Math.floor(Math.random() * 3000) + 1000,
      bounce_rate: Math.random() * 30 + 30, // 30-60%
      visit_duration: Math.floor(Math.random() * 300) + 60, // 1-6 minutes
      sessions: Math.floor(Math.random() * 800) + 400,
      newUsers: Math.floor(Math.random() * 600) + 200
    },
    timeSeriesData: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: Math.floor(Math.random() * 200) + 50
    }))
  };
}

/**
 * Performance testing scenarios
 */
export const PERFORMANCE_SCENARIOS = {
  minimal: {
    postCount: 3,
    includeFeatured: true,
    categories: ['Web Development', 'React']
  },
  standard: {
    postCount: 10,
    includeFeatured: true,
    categories: ['Web Development', 'React', 'Next.js', 'TypeScript']
  },
  heavy: {
    postCount: 25,
    includeFeatured: true,
    categories: ['Web Development', 'React', 'Next.js', 'TypeScript', 'Performance', 'Accessibility', 'SEO']
  }
} as const;
