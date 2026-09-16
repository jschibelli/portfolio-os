import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { siteUrl } from '../../lib/site-url';

export const metadata: Metadata = {
	title: 'Contact | John Schibelli',
	description:
		'Contact John Schibelli about Senior Software Engineer opportunities and contract engineering work.',
	alternates: {
		canonical: siteUrl('/contact'),
	},
	openGraph: {
		url: siteUrl('/contact'),
		title: 'Contact | John Schibelli',
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default function ContactLayout({ children }: { children: ReactNode }) {
	return children;
}
