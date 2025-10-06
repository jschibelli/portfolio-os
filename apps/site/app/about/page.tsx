import { Metadata } from 'next';
import AboutPageClient from './about-client';

export const metadata: Metadata = {
  title: 'About John Schibelli - Senior Front-End Engineer | Portfolio',
  description: 'Learn about John Schibelli, a Senior Front-End Engineer specializing in React, Next.js, TypeScript, and modern web development. Available for freelance projects and consulting.',
  keywords: [
    'John Schibelli',
    'About',
    'Senior Front-End Engineer',
    'React Developer',
    'Next.js Developer',
    'TypeScript Developer',
    'Web Developer',
    'Freelance Developer',
    'Consultant',
    'Portfolio',
    'Experience',
    'Skills',
    'Career'
  ],
  authors: [{ name: 'John Schibelli', url: 'https://johnschibelli.dev' }],
  creator: 'John Schibelli',
  publisher: 'John Schibelli',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://johnschibelli.dev'),
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About John Schibelli - Senior Front-End Engineer',
    description: 'Learn about John Schibelli, a Senior Front-End Engineer specializing in React, Next.js, TypeScript, and modern web development.',
    url: 'https://johnschibelli.dev/about',
    siteName: 'John Schibelli Portfolio',
    images: [
      {
        url: '/about/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'About John Schibelli - Senior Front-End Engineer',
      },
    ],
    locale: 'en_US',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About John Schibelli - Senior Front-End Engineer',
    description: 'Learn about John Schibelli, a Senior Front-End Engineer specializing in React, Next.js, TypeScript, and modern web development.',
    creator: '@johnschibelli',
    images: ['/about/opengraph-image'],
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

export default function AboutPage() {
  return <AboutPageClient />;
}