import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../styles/index.css";
import { Providers } from "../components/providers/Providers";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  title: "John Schibelli - Senior Front-End Developer",
  description: "Building smarter, faster web applications. Expert in React, Next.js, and TypeScript with 15+ years of proven results.",
  authors: [{ name: "John Schibelli" }],
  creator: "John Schibelli",
  publisher: "John Schibelli",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://schibelli.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'John Schibelli - Senior Front-End Developer',
    description: 'Building smarter, faster web applications. Expert in React, Next.js, and TypeScript with 15+ years of proven results.',
    url: 'https://schibelli.dev',
    siteName: 'John Schibelli Portfolio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/assets/hero/hero-bg.png',
        width: 1200,
        height: 630,
        alt: 'John Schibelli - Senior Front-End Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'John Schibelli - Senior Front-End Developer',
    description: 'Building smarter, faster web applications. Expert in React, Next.js, and TypeScript with 15+ years of proven results.',
    creator: '@johnschibelli',
    images: ['/assets/hero/hero-bg.png'],
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
    google: 'your-google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}


