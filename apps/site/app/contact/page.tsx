import { Metadata } from 'next';
import { ContactPageClient } from './contact-client';

export const metadata: Metadata = {
  title: 'Contact John Schibelli | Get In Touch',
  description: 'Ready to start your next project? Contact John Schibelli for expert front-end development services. Specializing in React, Next.js, TypeScript, and AI integration. Available for new opportunities.',
  keywords: ['contact', 'John Schibelli', 'hire', 'freelance', 'front-end developer', 'React', 'Next.js', 'TypeScript', 'web development'],
  authors: [{ name: 'John Schibelli' }],
  creator: 'John Schibelli',
  publisher: 'John Schibelli',
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
  openGraph: {
    title: 'Contact John Schibelli | Get In Touch',
    description: 'Ready to start your next project? Contact John Schibelli for expert front-end development services. Specializing in React, Next.js, TypeScript, and AI integration.',
    url: 'https://johnschibelli.dev/contact',
    siteName: 'John Schibelli Portfolio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/assets/og.png',
        width: 1200,
        height: 630,
        alt: 'Contact John Schibelli - Senior Front-End Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact John Schibelli | Get In Touch',
    description: 'Ready to start your next project? Contact John Schibelli for expert front-end development services.',
    creator: '@johnschibelli',
    images: ['/assets/og.png'],
  },
  alternates: {
    canonical: 'https://johnschibelli.dev/contact',
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}