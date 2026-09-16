import { Metadata } from 'next';
import { AboutPageClient } from './about-client';

export const metadata: Metadata = {
	title: 'About | John Schibelli',
	description:
		'John Schibelli is a Senior Software Engineer who builds software, improves existing systems, and turns product requirements into maintainable production implementations.',
	keywords: ['about', 'Senior Software Engineer', 'John Schibelli', 'portfolio'],
	authors: [{ name: 'John Schibelli' }],
	creator: 'John Schibelli',
	publisher: 'John Schibelli',
	robots: {
		index: true,
		follow: true,
	},
	openGraph: {
		title: 'About | John Schibelli',
		description:
			'John Schibelli is a Senior Software Engineer who builds software, improves existing systems, and turns product requirements into maintainable production implementations.',
		url: 'https://johnschibelli.dev/about',
		siteName: 'John Schibelli Portfolio',
		locale: 'en_US',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'About | John Schibelli',
		description:
			'John Schibelli is a Senior Software Engineer who builds software, improves existing systems, and turns product requirements into maintainable production implementations.',
	},
	alternates: {
		canonical: 'https://johnschibelli.dev/about',
	},
};

export default function AboutPage() {
	return <AboutPageClient />;
}
