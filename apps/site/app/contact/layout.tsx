import type { Metadata } from 'next';
import { getSiteUrl } from '../../config/site';

export const metadata: Metadata = {
	title: 'Contact | John Schibelli',
	description:
		'Senior Software Engineer. Open to engineering roles and contract engineering work.',
	alternates: {
		canonical: getSiteUrl('/contact'),
	},
	openGraph: {
		title: 'Contact | John Schibelli',
		description:
			'Senior Software Engineer. Open to engineering roles and contract engineering work.',
		url: getSiteUrl('/contact'),
		siteName: 'John Schibelli Portfolio',
		locale: 'en_US',
		type: 'website',
	},
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
	return children;
}
