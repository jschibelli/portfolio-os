import { Metadata } from 'next';
import ProjectsPageClient from './projects-client';

export const metadata: Metadata = {
  title: 'Projects | John Schibelli Portfolio - React & Next.js Developer',
  description: 'Explore John Schibelli\'s portfolio of React, Next.js, and TypeScript projects. View case studies, live demos, and technical implementations.',
  keywords: [
    'John Schibelli',
    'Projects',
    'Portfolio',
    'React Projects',
    'Next.js Projects',
    'TypeScript Projects',
    'Web Development',
    'Front-End Development',
    'Case Studies',
    'Live Demos',
    'Technical Implementation',
    'JavaScript Projects',
    'UI/UX Projects'
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
    canonical: '/projects',
  },
  openGraph: {
    title: 'Projects | John Schibelli Portfolio',
    description: 'Explore John Schibelli\'s portfolio of React, Next.js, and TypeScript projects. View case studies, live demos, and technical implementations.',
    url: 'https://johnschibelli.dev/projects',
    siteName: 'John Schibelli Portfolio',
    images: [
      {
        url: '/projects/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'John Schibelli - Projects Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects | John Schibelli Portfolio',
    description: 'Explore John Schibelli\'s portfolio of React, Next.js, and TypeScript projects. View case studies, live demos, and technical implementations.',
    creator: '@johnschibelli',
    images: ['/projects/opengraph-image'],
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

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}