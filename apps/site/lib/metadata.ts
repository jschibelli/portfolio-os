import { Metadata } from 'next';

// Site configuration
export const SITE_CONFIG = {
  name: 'John Schibelli',
  title: 'John Schibelli - Senior Front-End Engineer',
  description: 'Senior Front-End Engineer | React · Next.js · TypeScript | Automation · AI Workflows · Accessibility. Building smarter, faster web applications with modern development practices.',
  url: 'https://johnschibelli.dev',
  ogImage: '/assets/og.png',
  twitterHandle: '@johnschibelli',
  author: 'John Schibelli',
  creator: 'John Schibelli',
  publisher: 'John Schibelli',
} as const;

// Default OpenGraph configuration
export const DEFAULT_OPENGRAPH: Metadata['openGraph'] = {
  type: 'website',
  locale: 'en_US',
  url: SITE_CONFIG.url,
  siteName: 'John Schibelli Portfolio',
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  images: [
    {
      url: SITE_CONFIG.ogImage,
      width: 1200,
      height: 630,
      alt: SITE_CONFIG.title,
    },
  ],
};

// Default Twitter configuration
export const DEFAULT_TWITTER: Metadata['twitter'] = {
  card: 'summary_large_image',
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  creator: SITE_CONFIG.twitterHandle,
  images: [SITE_CONFIG.ogImage],
};

// Page-specific OpenGraph images
export const PAGE_OG_IMAGES = {
  home: '/assets/og.png',
  about: '/assets/og-about.png',
  contact: '/assets/og-contact.png',
  blog: '/assets/og-blog.png',
  projects: '/assets/og-projects.png',
  caseStudies: '/assets/og-case-studies.png',
  default: '/assets/og.png',
} as const;

// Helper function to generate page metadata
export function generatePageMetadata({
  title,
  description,
  path = '',
  ogImage,
  twitterImage,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
}: {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  twitterImage?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: { name: string; url?: string }[];
}): Metadata {
  const url = path ? `${SITE_CONFIG.url}${path}` : SITE_CONFIG.url;
  const imageUrl = ogImage || SITE_CONFIG.ogImage;
  const twitterImageUrl = twitterImage || ogImage || SITE_CONFIG.ogImage;

  const baseMetadata: Metadata = {
    title,
    description,
    authors: authors || [{ name: SITE_CONFIG.author }],
    creator: SITE_CONFIG.creator,
    publisher: SITE_CONFIG.publisher,
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical: path || '/',
    },
    openGraph: {
      ...DEFAULT_OPENGRAPH,
      title,
      description,
      url,
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && { authors: authors.map(author => author.name) }),
    },
    twitter: {
      ...DEFAULT_TWITTER,
      title,
      description,
      images: [twitterImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };

  return baseMetadata;
}

// Pre-defined metadata for common pages
export const PAGE_METADATA = {
  home: generatePageMetadata({
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    ogImage: PAGE_OG_IMAGES.home,
  }),
  
  about: generatePageMetadata({
    title: 'About John Schibelli | Senior Front-End Engineer',
    description: 'Learn about John Schibelli\'s 15+ years of experience in front-end development, specializing in React, Next.js, TypeScript, and AI integration. Based in Northern New Jersey.',
    path: '/about',
    ogImage: PAGE_OG_IMAGES.about,
  }),
  
  contact: generatePageMetadata({
    title: 'Contact John Schibelli | Get In Touch',
    description: 'Ready to start your next project? Contact John Schibelli for expert front-end development services. Specializing in React, Next.js, TypeScript, and AI integration.',
    path: '/contact',
    ogImage: PAGE_OG_IMAGES.contact,
  }),
  
  blog: generatePageMetadata({
    title: 'Blog | John Schibelli - Front-End Development Insights',
    description: 'Read insights on front-end development, React, Next.js, TypeScript, and modern web development practices from John Schibelli.',
    path: '/blog',
    ogImage: PAGE_OG_IMAGES.blog,
  }),
  
  projects: generatePageMetadata({
    title: 'Projects | John Schibelli Portfolio',
    description: 'Explore John Schibelli\'s portfolio of front-end development projects, including React applications, Next.js websites, and modern web solutions.',
    path: '/projects',
    ogImage: PAGE_OG_IMAGES.projects,
  }),
  
  caseStudies: generatePageMetadata({
    title: 'Case Studies | John Schibelli Development Work',
    description: 'Detailed case studies of John Schibelli\'s front-end development projects, showcasing React, Next.js, and TypeScript implementations.',
    path: '/case-studies',
    ogImage: PAGE_OG_IMAGES.caseStudies,
  }),
} as const;
