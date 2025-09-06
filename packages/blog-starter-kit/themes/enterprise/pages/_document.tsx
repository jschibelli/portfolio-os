import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
					{/* 
					 * Preload critical fonts for better LCP - optimized strategy
					 * 
					 * Performance Impact:
					 * - Reduces Largest Contentful Paint (LCP) by preloading above-the-fold fonts
					 * - Improves First Contentful Paint (FCP) by eliminating font loading delays
					 * - Font-display: swap ensures text remains visible during font loading
					 * 
					 * Monitoring: Track LCP, FCP, and CLS metrics to validate effectiveness
					 */
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
