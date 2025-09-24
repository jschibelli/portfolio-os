import Head from 'next/head';
import { ReactNode } from 'react';

export interface SEOHeadProps {
	title: string;
	description: string;
	keywords?: string[];
	canonical?: string;
	ogImage?: string;
	ogType?: 'website' | 'article' | 'profile';
	twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
	author?: string;
	publishedTime?: string;
	modifiedTime?: string;
	section?: string;
	tags?: string[];
	structuredData?: object;
	noIndex?: boolean;
	children?: ReactNode;
}

export function SEOHead({
	title,
	description,
	keywords = [],
	canonical,
	ogImage,
	ogType = 'website',
	twitterCard = 'summary_large_image',
	author,
	publishedTime,
	modifiedTime,
	section,
	tags = [],
	structuredData,
	noIndex = false,
	children,
}: SEOHeadProps) {
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://johnschibelli.com';
	const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;
	const fullOgImage = ogImage ? `${siteUrl}${ogImage}` : `${siteUrl}/og.png`;

	// Default keywords for the site
	const defaultKeywords = [
		'John Schibelli',
		'Front-End Developer',
		'React Developer',
		'Next.js Developer',
		'TypeScript Developer',
		'Web Development',
		'UI/UX Design',
		'JavaScript',
		'React',
		'Next.js',
		'TypeScript',
		'Tailwind CSS',
		'Web Accessibility',
		'SEO',
		'Performance',
		'Mobile Development',
		'Cloud Solutions',
		'Consulting',
	];

	const allKeywords = [...new Set([...defaultKeywords, ...keywords])];

	return (
		<Head>
			{/* Basic Meta Tags */}
			<title>{title}</title>
			<meta name="description" content={description} />
			<meta name="keywords" content={allKeywords.join(', ')} />
			<meta name="author" content={author || 'John Schibelli'} />
			<link rel="canonical" href={fullCanonical} />

			{/* Robots */}
			{noIndex ? (
				<meta name="robots" content="noindex, nofollow" />
			) : (
				<meta name="robots" content="index, follow" />
			)}

			{/* Open Graph */}
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:type" content={ogType} />
			<meta property="og:url" content={fullCanonical} />
			<meta property="og:image" content={fullOgImage} />
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:height" content="630" />
			<meta property="og:image:alt" content={title} />
			<meta property="og:site_name" content="John Schibelli - Senior Front-End Developer" />
			<meta property="og:locale" content="en_US" />

			{/* Article specific Open Graph tags */}
			{ogType === 'article' && (
				<>
					{author && <meta property="article:author" content={author} />}
					{publishedTime && <meta property="article:published_time" content={publishedTime} />}
					{modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
					{section && <meta property="article:section" content={section} />}
					{tags.map((tag) => (
						<meta key={tag} property="article:tag" content={tag} />
					))}
				</>
			)}

			{/* Twitter Card */}
			<meta name="twitter:card" content={twitterCard} />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={fullOgImage} />
			<meta name="twitter:image:alt" content={title} />
			<meta name="twitter:creator" content="@johnschibelli" />
			<meta name="twitter:site" content="@johnschibelli" />

			{/* Additional Meta Tags */}
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<meta name="theme-color" content="#000000" />
			<meta name="msapplication-TileColor" content="#000000" />
			<meta name="apple-mobile-web-app-capable" content="yes" />
			<meta name="apple-mobile-web-app-status-bar-style" content="default" />
			<meta name="apple-mobile-web-app-title" content="John Schibelli" />

			{/* Preconnect to external domains */}
			<link rel="preconnect" href="https://fonts.googleapis.com" />
			<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
			<link rel="preconnect" href="https://www.google-analytics.com" />
			<link rel="preconnect" href="https://www.googletagmanager.com" />

			{/* Font preloading - Commented out until fonts are available */}
			{/* 
			<link
				rel="preload"
				href="/assets/PlusJakartaSans-Regular.ttf"
				as="font"
				type="font/ttf"
				crossOrigin="anonymous"
			/>
			<link
				rel="preload"
				href="/assets/PlusJakartaSans-Medium.ttf"
				as="font"
				type="font/ttf"
				crossOrigin="anonymous"
			/>
			<link
				rel="preload"
				href="/assets/PlusJakartaSans-SemiBold.ttf"
				as="font"
				type="font/ttf"
				crossOrigin="anonymous"
			/>
			*/}

			{/* Favicon */}
			<link rel="icon" href="/favicon.ico" />
			<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
			<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
			<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
			{/* <link rel="manifest" href="/site.webmanifest" /> */}

			{/* Structured Data */}
			{structuredData && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(structuredData),
					}}
				/>
			)}

			{children}
		</Head>
	);
}
