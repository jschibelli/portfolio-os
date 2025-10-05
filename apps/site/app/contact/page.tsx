import { Metadata } from 'next'
import ContactPageClient from './contact-client'

export const metadata: Metadata = {
  title: 'Contact John Schibelli - Senior Front-End Developer | Available for Projects',
  description: 'Get in touch with John Schibelli, Senior Front-End Developer. Available for React, Next.js, and TypeScript projects. Let\'s discuss your next web development project.',
  keywords: [
    'Contact John Schibelli',
    'Hire Front-End Developer',
    'React Developer Available',
    'Next.js Developer',
    'TypeScript Developer',
    'Web Development Services',
    'Project Consultation',
    'Front-End Development',
    'JavaScript Developer',
    'UI/UX Developer',
    'Remote Developer',
    'New Jersey Developer',
    'Portfolio Contact',
    'Development Services'
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
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact John Schibelli - Senior Front-End Developer',
    description: 'Get in touch with John Schibelli, Senior Front-End Developer. Available for React, Next.js, and TypeScript projects. Let\'s discuss your next web development project.',
    url: 'https://johnschibelli.dev/contact',
    siteName: 'John Schibelli Portfolio',
    images: [
      {
        url: '/assets/og.png',
        width: 1200,
        height: 630,
        alt: 'Contact John Schibelli - Senior Front-End Developer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact John Schibelli - Senior Front-End Developer',
    description: 'Get in touch with John Schibelli, Senior Front-End Developer. Available for React, Next.js, and TypeScript projects.',
    creator: '@johnschibelli',
    images: ['/assets/og.png'],
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
}

export default function ContactPage() {
  return <ContactPageClient />
}
