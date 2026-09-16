import robots from '../app/robots';
import { SITE_URL } from '../lib/site-url';

describe('robots.txt crawl policy', () => {
	const manifest = robots();

	it('points Host and Sitemap at the live Schibelli.com origin', () => {
		expect(SITE_URL).toBe('https://www.schibelli.com');
		expect(manifest.host).toBe(SITE_URL);
		expect(manifest.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
	});

	it('allows GPTBot and ChatGPT-User under the default public rules', () => {
		const rules = Array.isArray(manifest.rules) ? manifest.rules : [manifest.rules];
		const blockedAgents = rules
			.filter((rule) => {
				const disallow = Array.isArray(rule.disallow) ? rule.disallow : [rule.disallow];
				return disallow.includes('/');
			})
			.flatMap((rule) => (Array.isArray(rule.userAgent) ? rule.userAgent : [rule.userAgent]));

		expect(blockedAgents).not.toContain('GPTBot');
		expect(blockedAgents).not.toContain('ChatGPT-User');
		expect(blockedAgents).not.toContain('*');
	});

	it('does not disallow XML so sitemap.xml remains crawlable', () => {
		const rules = Array.isArray(manifest.rules) ? manifest.rules : [manifest.rules];
		const defaultRule = rules.find((rule) => rule.userAgent === '*');
		const disallow = Array.isArray(defaultRule?.disallow)
			? defaultRule?.disallow
			: [defaultRule?.disallow];

		expect(disallow).not.toContain('*.xml');
		expect(defaultRule?.allow).toEqual(expect.arrayContaining(['/sitemap.xml']));
	});

	it('still disallows private admin and API paths', () => {
		const rules = Array.isArray(manifest.rules) ? manifest.rules : [manifest.rules];
		const defaultRule = rules.find((rule) => rule.userAgent === '*');
		const disallow = Array.isArray(defaultRule?.disallow)
			? defaultRule?.disallow
			: [defaultRule?.disallow];

		expect(disallow).toEqual(
			expect.arrayContaining(['/admin', '/admin/*', '/api', '/api/*', '/login']),
		);
	});
});
