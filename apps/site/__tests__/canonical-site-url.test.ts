import robots from '../app/robots';
import { CANONICAL_HOST, getSiteOrigin, getSiteUrl, siteConfig } from '../config/site';
import { generateWebSiteStructuredData } from '../lib/structured-data';

describe('canonical site URL', () => {
	it('identifies www.schibelli.com as the production origin', () => {
		expect(CANONICAL_HOST).toBe('www.schibelli.com');
		expect(siteConfig.url).toBe('https://www.schibelli.com');
		expect(getSiteOrigin()).toBe('https://www.schibelli.com');
		expect(getSiteUrl('/')).toBe('https://www.schibelli.com/');
		expect(getSiteUrl('/about')).toBe('https://www.schibelli.com/about');
		expect(getSiteUrl('projects')).toBe('https://www.schibelli.com/projects');
	});

	it('does not use johnschibelli.dev as the canonical origin', () => {
		expect(getSiteOrigin()).not.toContain('johnschibelli.dev');
		expect(getSiteUrl('/')).not.toContain('johnschibelli.dev');
	});
});

describe('robots', () => {
	const manifest = robots();
	const rules = Array.isArray(manifest.rules) ? manifest.rules : [manifest.rules];
	const byAgent = (agent: string) => rules.find((rule) => rule.userAgent === agent);

	it('advertises the Schibelli.com sitemap and host', () => {
		expect(manifest.sitemap).toBe('https://www.schibelli.com/sitemap.xml');
		expect(manifest.host).toBe('https://www.schibelli.com');
	});

	it('keeps public pages crawlable and private surfaces blocked', () => {
		const star = byAgent('*');
		expect(star?.allow).toEqual(expect.arrayContaining(['/', '/about', '/projects', '/blog', '/contact', '/sitemap.xml']));
		expect(star?.disallow).toEqual(
			expect.arrayContaining(['/admin', '/admin/*', '/api', '/api/*', '/login']),
		);
		expect(star?.disallow).not.toEqual(expect.arrayContaining(['*.xml']));
	});

	it('allows ChatGPT-User and OAI-SearchBot without enabling GPTBot', () => {
		const chatGptUser = byAgent('ChatGPT-User');
		const searchBot = byAgent('OAI-SearchBot');
		const gptBot = byAgent('GPTBot');

		expect(chatGptUser?.allow).toEqual(expect.arrayContaining(['/']));
		expect(chatGptUser?.disallow).not.toEqual('/');
		expect(searchBot?.allow).toEqual(expect.arrayContaining(['/']));
		expect(gptBot?.disallow).toEqual('/');
	});
});

describe('website structured data', () => {
	it('uses the canonical Schibelli.com origin', () => {
		const data = generateWebSiteStructuredData();
		expect(data.url).toBe('https://www.schibelli.com');
		expect(JSON.stringify(data)).not.toContain('johnschibelli.dev');
	});
});
