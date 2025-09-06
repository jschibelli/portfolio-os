import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				{/* Preload critical fonts for better LCP */}
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
