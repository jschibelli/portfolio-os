import { test, expect } from '@playwright/test';

test.describe('Comprehensive SEO Tests', () => {
	test('Homepage SEO validation', async ({ page }) => {
		await page.goto('/');

		// Check title
		const title = await page.title();
		expect(title).toContain('John Schibelli');
		expect(title.length).toBeGreaterThan(10);
		expect(title.length).toBeLessThan(60);

		// Check meta description
		const description = await page.locator('meta[name="description"]').getAttribute('content');
		expect(description).toBeTruthy();
		expect(description!.length).toBeGreaterThan(120);
		expect(description!.length).toBeLessThan(160);

		// Check canonical URL
		const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
		expect(canonical).toBe('https://johnschibelli.com/');

		// Check Open Graph tags
		const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
		const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
		const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
		const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');

		expect(ogTitle).toBeTruthy();
		expect(ogDescription).toBeTruthy();
		expect(ogType).toBe('website');
		expect(ogImage).toBeTruthy();

		// Check Twitter Card tags
		const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
		const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content');
		const twitterDescription = await page.locator('meta[name="twitter:description"]').getAttribute('content');

		expect(twitterCard).toBe('summary_large_image');
		expect(twitterTitle).toBeTruthy();
		expect(twitterDescription).toBeTruthy();

		// Check structured data
		const structuredData = await page.locator('script[type="application/ld+json"]').textContent();
		expect(structuredData).toBeTruthy();
		
		const parsedData = JSON.parse(structuredData!);
		expect(parsedData['@type']).toBe('WebSite');
		expect(parsedData.name).toContain('John Schibelli');

		// Check heading structure
		const h1Count = await page.locator('h1').count();
		expect(h1Count).toBe(1);

		// Check for skip link
		const skipLink = page.locator('.skip-link');
		await expect(skipLink).toBeVisible();
	});

	test('About page SEO validation', async ({ page }) => {
		await page.goto('/about');

		// Check title
		const title = await page.title();
		expect(title).toContain('About');
		expect(title).toContain('John Schibelli');

		// Check meta description
		const description = await page.locator('meta[name="description"]').getAttribute('content');
		expect(description).toContain('John Schibelli');
		expect(description).toContain('Front-End Developer');

		// Check canonical URL
		const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
		expect(canonical).toBe('https://johnschibelli.com/about');

		// Check Open Graph type
		const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
		expect(ogType).toBe('profile');

		// Check structured data
		const structuredData = await page.locator('script[type="application/ld+json"]').textContent();
		const parsedData = JSON.parse(structuredData!);
		expect(parsedData['@type']).toBe('Person');
		expect(parsedData.name).toBe('John Schibelli');
	});

	test('Blog page SEO validation', async ({ page }) => {
		await page.goto('/blog');

		// Check title
		const title = await page.title();
		expect(title).toContain('Blog');
		expect(title).toContain('John Schibelli');

		// Check meta description
		const description = await page.locator('meta[name="description"]').getAttribute('content');
		expect(description).toContain('blog');
		expect(description).toContain('development');

		// Check canonical URL
		const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
		expect(canonical).toBe('https://johnschibelli.com/blog');

		// Check structured data
		const structuredData = await page.locator('script[type="application/ld+json"]').textContent();
		const parsedData = JSON.parse(structuredData!);
		expect(parsedData['@type']).toBe('WebSite');
	});

	test('Contact page SEO validation', async ({ page }) => {
		await page.goto('/contact');

		// Check title
		const title = await page.title();
		expect(title).toContain('Contact');
		expect(title).toContain('John Schibelli');

		// Check meta description
		const description = await page.locator('meta[name="description"]').getAttribute('content');
		expect(description).toContain('contact');
		expect(description).toContain('project');

		// Check canonical URL
		const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
		expect(canonical).toBe('https://johnschibelli.com/contact');

		// Check structured data
		const structuredData = await page.locator('script[type="application/ld+json"]').textContent();
		const parsedData = JSON.parse(structuredData!);
		expect(parsedData['@type']).toBe('Organization');
		expect(parsedData.contactPoint).toBeTruthy();
	});

	test('Service page SEO validation', async ({ page }) => {
		await page.goto('/services/web-development');

		// Check title
		const title = await page.title();
		expect(title).toContain('Web Development');
		expect(title).toContain('John Schibelli');

		// Check meta description
		const description = await page.locator('meta[name="description"]').getAttribute('content');
		expect(description).toContain('web development');
		expect(description).toContain('React');

		// Check canonical URL
		const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
		expect(canonical).toBe('https://johnschibelli.com/services/web-development');

		// Check structured data
		const structuredData = await page.locator('script[type="application/ld+json"]').textContent();
		const parsedData = JSON.parse(structuredData!);
		expect(parsedData['@type']).toBe('Service');
		expect(parsedData.name).toContain('Web Development');
	});

	test('Image accessibility validation', async ({ page }) => {
		await page.goto('/');

		// Check all images have alt text
		const images = page.locator('img');
		const imageCount = await images.count();

		for (let i = 0; i < imageCount; i++) {
			const alt = await images.nth(i).getAttribute('alt');
			const role = await images.nth(i).getAttribute('role');
			
			// Images should have alt text unless they're decorative
			if (role !== 'presentation' && role !== 'none') {
				expect(alt).toBeTruthy();
			}
		}
	});

	test('Heading hierarchy validation', async ({ page }) => {
		await page.goto('/');

		// Check for proper heading hierarchy
		const headings = await page.evaluate(() => {
			const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
			return Array.from(elements).map(el => ({
				tag: el.tagName.toLowerCase(),
				text: el.textContent?.trim()
			}));
		});

		// Should have at least one H1
		expect(headings.some(h => h.tag === 'h1')).toBeTruthy();

		// Check for logical hierarchy (no skipping levels)
		let previousLevel = 0;
		for (const heading of headings) {
			const currentLevel = parseInt(heading.tag.charAt(1));
			expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
			previousLevel = currentLevel;
		}
	});

	test('Internal linking validation', async ({ page }) => {
		await page.goto('/');

		// Check internal links use Next.js Link component
		const internalLinks = page.locator('a[href^="/"]');
		const linkCount = await internalLinks.count();

		// Should have internal links
		expect(linkCount).toBeGreaterThan(0);

		// Check for descriptive anchor text
		for (let i = 0; i < Math.min(linkCount, 10); i++) {
			const link = internalLinks.nth(i);
			const text = await link.textContent();
			const href = await link.getAttribute('href');
			
			// Anchor text should be descriptive
			expect(text!.trim().length).toBeGreaterThan(0);
			expect(href).toBeTruthy();
		}
	});

	test('Performance validation', async ({ page }) => {
		await page.goto('/');

		// Check for preconnect links
		const preconnectLinks = page.locator('link[rel="preconnect"]');
		const preconnectCount = await preconnectLinks.count();
		expect(preconnectCount).toBeGreaterThan(0);

		// Check for font preloading
		const fontPreload = page.locator('link[rel="preload"][as="font"]');
		const fontPreloadCount = await fontPreload.count();
		expect(fontPreloadCount).toBeGreaterThan(0);

		// Check for proper image loading
		const images = page.locator('img');
		const imageCount = await images.count();

		for (let i = 0; i < Math.min(imageCount, 5); i++) {
			const loading = await images.nth(i).getAttribute('loading');
			// Images should have loading attribute for lazy loading
			expect(loading).toBeTruthy();
		}
	});

	test('Sitemap validation', async ({ page }) => {
		await page.goto('/sitemap.xml');

		// Check sitemap is accessible
		const content = await page.content();
		expect(content).toContain('<?xml version="1.0" encoding="UTF-8"?>');
		expect(content).toContain('<urlset');
		expect(content).toContain('</urlset>');

		// Check for main pages in sitemap
		expect(content).toContain('<loc>https://johnschibelli.com/</loc>');
		expect(content).toContain('<loc>https://johnschibelli.com/about</loc>');
		expect(content).toContain('<loc>https://johnschibelli.com/contact</loc>');
		expect(content).toContain('<loc>https://johnschibelli.com/blog</loc>');
	});

	test('Robots.txt validation', async ({ page }) => {
		await page.goto('/robots.txt');

		// Check robots.txt is accessible
		const content = await page.content();
		expect(content).toContain('User-agent: *');
		expect(content).toContain('Allow: /');
		expect(content).toContain('Sitemap:');

		// Check for proper disallow rules
		expect(content).toContain('Disallow: /admin/');
		expect(content).toContain('Disallow: /api/');
	});

	test('Mobile optimization validation', async ({ page }) => {
		// Test on mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/');

		// Check viewport meta tag
		const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
		expect(viewport).toContain('width=device-width');
		expect(viewport).toContain('initial-scale=1');

		// Check touch-friendly elements
		const buttons = page.locator('button, a[href]');
		const buttonCount = await buttons.count();

		for (let i = 0; i < Math.min(buttonCount, 10); i++) {
			const button = buttons.nth(i);
			const box = await button.boundingBox();
			
			// Touch targets should be at least 44x44 pixels
			if (box) {
				expect(box.width).toBeGreaterThanOrEqual(44);
				expect(box.height).toBeGreaterThanOrEqual(44);
			}
		}
	});

	test('Social media validation', async ({ page }) => {
		await page.goto('/');

		// Check for social media meta tags
		const ogTags = [
			'og:title',
			'og:description',
			'og:type',
			'og:url',
			'og:image',
			'og:site_name',
		];

		for (const tag of ogTags) {
			const element = page.locator(`meta[property="${tag}"]`);
			await expect(element).toHaveCount(1);
		}

		// Check for Twitter Card tags
		const twitterTags = [
			'twitter:card',
			'twitter:title',
			'twitter:description',
			'twitter:image',
		];

		for (const tag of twitterTags) {
			const element = page.locator(`meta[name="${tag}"]`);
			await expect(element).toHaveCount(1);
		}
	});
});
