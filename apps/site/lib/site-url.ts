/**
 * Canonical public origin for the production Schibelli.com site.
 *
 * Apex https://schibelli.com 307s to https://www.schibelli.com on Vercel.
 * Crawler signals (robots, sitemap, canonical, Open Graph) must use the
 * final host — not johnschibelli.dev, which is a parked lander.
 */
export const SITE_URL = 'https://www.schibelli.com';

export function siteUrl(path: string = '/'): string {
	if (!path || path === '/') {
		return SITE_URL;
	}
	return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
