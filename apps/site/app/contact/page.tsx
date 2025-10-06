import { Metadata } from 'next';
import ContactPageClient from './contact-client';

export const metadata: Metadata = {
  title: 'Contact John Schibelli - Freelance & Consulting | Portfolio',
  description: 'Get in touch with John Schibelli for freelance web development projects, consulting, or collaboration. Specializing in React, Next.js, and TypeScript.',
  keywords: ['contact', 'freelance', 'consulting', 'web developer', 'hire', 'react', 'next.js', 'typescript', 'john schibelli'],
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
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact John Schibelli - Freelance & Consulting',
    description: 'Get in touch with John Schibelli for freelance web development projects, consulting, or collaboration.',
    url: 'https://johnschibelli.dev/contact',
    siteName: 'John Schibelli Portfolio',
    images: [
      {
        url: '/contact/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Contact John Schibelli',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact John Schibelli - Freelance & Consulting',
    description: 'Get in touch with John Schibelli for freelance web development projects, consulting, or collaboration.',
    creator: '@johnschibelli',
    images: ['/contact/opengraph-image'],
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

export default function ContactPage() {
  return <ContactPageClient />;
}
