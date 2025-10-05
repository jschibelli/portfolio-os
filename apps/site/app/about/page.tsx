import { Metadata } from 'next';
import { Layout } from '../../components/shared/layout';
import AboutPageClient from './about-client';

export const metadata: Metadata = {
  title: 'About John Schibelli - Senior Front-End Developer | Portfolio',
  description: 'Learn about John Schibelli, a Senior Front-End Developer with 15+ years of experience building React, Next.js, and TypeScript applications. Available for new projects.',
  keywords: [
    'John Schibelli',
    'Senior Front-End Developer',
    'React Developer',
    'Next.js Developer',
    'TypeScript Developer',
    'Web Development',
    'Front-End Development',
    'JavaScript Developer',
    'UI/UX Developer',
    'Portfolio',
    'Available for Hire',
    'Remote Developer',
    'New Jersey Developer',
    'AI Integration',
    'Accessibility',
    'SEO Optimization'
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
    title: 'About John Schibelli - Senior Front-End Developer',
    description: 'Learn about John Schibelli, a Senior Front-End Developer with 15+ years of experience building React, Next.js, and TypeScript applications.',
    url: 'https://johnschibelli.dev/about',
    siteName: 'John Schibelli Portfolio',
    images: [
      {
        url: '/assets/hero/profile.png',
        width: 1200,
        height: 630,
        alt: 'John Schibelli - Senior Front-End Developer',
      },
    ],
    locale: 'en_US',
    type: 'profile',
    firstName: 'John',
    lastName: 'Schibelli',
    username: 'johnschibelli',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About John Schibelli - Senior Front-End Developer',
    description: 'Learn about John Schibelli, a Senior Front-End Developer with 15+ years of experience building React, Next.js, and TypeScript applications.',
    images: ['/assets/hero/profile.png'],
    creator: '@johnschibelli',
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
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function AboutPage() {
  return (
    <Layout>
      <AboutPageClient />
    </Layout>
  );
}