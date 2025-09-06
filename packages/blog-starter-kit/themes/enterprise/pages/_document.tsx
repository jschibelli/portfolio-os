import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				{/* Viewport meta tag for proper device scaling */}
				<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
				
				{/* Security headers for enhanced protection */}
				<meta httpEquiv="X-Content-Type-Options" content="nosniff" />
				<meta httpEquiv="X-Frame-Options" content="DENY" />
				<meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
				<meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
				
				{/* 
				 * Preload critical fonts for better LCP - optimized strategy
				 * 
				 * Performance Impact:
				 * - Reduces Largest Contentful Paint (LCP) by preloading above-the-fold fonts
				 * - Improves First Contentful Paint (FCP) by eliminating font loading delays
				 * - Font-display: swap ensures text remains visible during font loading
				 * 
				 * Monitoring: Track LCP, FCP, and CLS metrics to validate effectiveness
				 */}
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
				{/* Font display strategy for better loading experience */}
				<style jsx global>{`
					@font-face {
						font-family: 'Plus Jakarta Sans';
						font-display: swap;
					}
					
					/* Fallback fonts for better reliability */
					body {
						font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
					}
				`}</style>
				{/* Preload critical CSS */}
				<link rel="preload" href="/styles/index.css" as="style" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}