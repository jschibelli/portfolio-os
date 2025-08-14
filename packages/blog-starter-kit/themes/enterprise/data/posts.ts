export interface Post {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  readTime: string;
}

export const recentPosts: Post[] = [
  {
    id: '1',
    title: 'Building Scalable React Applications with TypeScript',
    excerpt: 'Learn how to structure large React applications using TypeScript, proper state management, and performance optimization techniques.',
    date: '2024-01-15',
    slug: 'building-scalable-react-applications',
    readTime: '8 min read'
  },
  {
    id: '2',
    title: 'The Future of AI-Driven Development',
    excerpt: 'Exploring how AI tools are transforming the development workflow and what this means for developers in 2024.',
    date: '2024-01-10',
    slug: 'future-of-ai-driven-development',
    readTime: '6 min read'
  },
  {
    id: '3',
    title: 'Optimizing Next.js Performance for Production',
    excerpt: 'Deep dive into Next.js performance optimization strategies, from image optimization to bundle analysis.',
    date: '2024-01-05',
    slug: 'optimizing-nextjs-performance',
    readTime: '10 min read'
  }
];
