import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import AnalyticsTracker from '../components/analytics/AnalyticsTracker';
import { Providers } from '../components/providers/Providers';
import { getMetadataBase, getSiteUrl } from '../config/site';
import { generateWebSiteStructuredData } from '../lib/structured-data';
import '../styles/index.css';

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
	display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
	subsets: ['latin'],
	variable: '--font-jetbrains-mono',
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'John Schibelli - Senior Software Engineer',
	description:
		'Senior Software Engineer. Front-end and full-stack systems, APIs, integrations, automation, and modernization.',
	authors: [{ name: 'John Schibelli' }],
	creator: 'John Schibelli',
	publisher: 'John Schibelli',
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	metadataBase: getMetadataBase(),
	openGraph: {
		title: 'John Schibelli - Senior Software Engineer',
		description:
			'Senior Software Engineer. Front-end and full-stack systems, APIs, integrations, automation, and modernization.',
		url: getSiteUrl('/'),
		siteName: 'John Schibelli Portfolio',
		locale: 'en_US',
		type: 'website',
		images: [
			{
				url: '/assets/og.png',
				width: 1200,
				height: 630,
				alt: 'John Schibelli - Senior Software Engineer',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'John Schibelli - Senior Software Engineer',
		description:
			'Senior Software Engineer. Front-end and full-stack systems, APIs, integrations, automation, and modernization.',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html
			lang="en"
			className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}
			suppressHydrationWarning
		>
			<body className="bg-background text-foreground antialiased">
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(generateWebSiteStructuredData()),
					}}
				/>
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
					<AnalyticsTracker />
				</Providers>
			</body>
		</html>
	);
}
