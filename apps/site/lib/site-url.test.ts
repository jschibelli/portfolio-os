import { siteUrl } from '../lib/site-url';

describe('siteUrl', () => {
	it('returns the www.schibelli.com origin for the homepage', () => {
		expect(siteUrl()).toBe('https://www.schibelli.com');
		expect(siteUrl('/')).toBe('https://www.schibelli.com');
	});

	it('joins public paths onto the live origin', () => {
		expect(siteUrl('/about')).toBe('https://www.schibelli.com/about');
		expect(siteUrl('blog')).toBe('https://www.schibelli.com/blog');
	});
});
