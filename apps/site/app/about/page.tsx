import { Metadata } from 'next';
import { AboutPageClient } from './about-client';

export const metadata: Metadata = {
  title: 'About | John Schibelli',
  description: 'Learn more about John Schibelli, a senior full-stack developer with 15+ years of experience building scalable web applications.',
  keywords: ['about', 'developer', 'full-stack', 'John Schibelli', 'portfolio'],
  authors: [{ name: 'John Schibelli' }],
  creator: 'John Schibelli',
  publisher: 'John Schibelli',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'About | John Schibelli',
    description: 'Learn more about John Schibelli, a senior full-stack developer with 15+ years of experience building scalable web applications.',
    url: 'https://johnschibelli.dev/about',
    siteName: 'John Schibelli Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About | John Schibelli',
    description: 'Learn more about John Schibelli, a senior full-stack developer with 15+ years of experience building scalable web applications.',
  },
  alternates: {
    canonical: 'https://johnschibelli.dev/about',
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}