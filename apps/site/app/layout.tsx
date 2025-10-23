import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "../styles/index.css";
import { Providers } from "../components/providers/Providers";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  title: "John Schibelli - Senior Front-End Engineer",
  description: "Senior Front-End Engineer | React · Next.js · TypeScript | Automation · AI Workflows · Accessibility. Building smarter, faster web applications with modern development practices.",
  authors: [{ name: "John Schibelli" }],
  creator: "John Schibelli",
  publisher: "John Schibelli",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://johnschibelli.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'John Schibelli - Senior Front-End Engineer',
    description: 'Senior Front-End Engineer | React · Next.js · TypeScript | Automation · AI Workflows · Accessibility. Building smarter, faster web applications with modern development practices.',
    url: 'https://johnschibelli.dev',
    siteName: 'John Schibelli Portfolio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/assets/og.png',
        width: 1200,
        height: 630,
        alt: 'John Schibelli - Senior Front-End Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'John Schibelli - Senior Front-End Engineer',
    description: 'Senior Front-End Engineer | React · Next.js · TypeScript | Automation · AI Workflows · Accessibility. Building smarter, faster web applications with modern development practices.',
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
    <html lang="en" className={`${plusJakartaSans.variable} font-sans`} suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground">
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-CPM70NFZXR"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CPM70NFZXR');
          `}
        </Script>
        
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}


