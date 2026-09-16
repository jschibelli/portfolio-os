/**
 * Canonical public site configuration.
 *
 * Production SEO, robots, sitemap, metadata, and structured data should
 * import from this module instead of hardcoding hostnames.
 */
export const CANONICAL_HOST = 'www.schibelli.com';
export const CANONICAL_ORIGIN = 'https://www.schibelli.com';
export const COOKIE_DOMAIN = '.schibelli.com';

export const siteConfig = {
	name: 'John Schibelli',
	professionalTitle: 'Senior Software Engineer',
	description:
		'Senior Software Engineer. Front-end and full-stack systems, APIs, integrations, automation, and modernization.',
	url: CANONICAL_ORIGIN,
	host: CANONICAL_HOST,
	ogImage: `${CANONICAL_ORIGIN}/assets/og.png`,
	links: {
		twitter: 'https://twitter.com/johnschibelli',
		github: 'https://github.com/johnschibelli',
		linkedin: 'https://linkedin.com/in/johnschibelli',
		email: 'john@schibelli.dev',
	},
	resumeUrl: '/assets/John-Schibelli-Resume-2025.pdf',
	getStartedUrl: '/newsletter',
} as const;

/** Canonical origin with no trailing slash. */
export function getSiteOrigin(): string {
	return siteConfig.url;
}

/**
 * Absolute URL on the canonical production origin.
 * The homepage is returned with a trailing slash.
 */
export function getSiteUrl(path: string = '/'): string {
	const origin = siteConfig.url.replace(/\/$/, '');
	if (!path || path === '/') {
		return `${origin}/`;
	}
	const normalized = path.startsWith('/') ? path : `/${path}`;
	return `${origin}${normalized}`;
}

export function getMetadataBase(): URL {
	return new URL(siteConfig.url);
}
