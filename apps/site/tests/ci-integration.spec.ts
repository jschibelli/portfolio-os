import { test, expect } from '@playwright/test';
import { 
	runComprehensiveAccessibilityTest,
	testPagePerformance,
	navigateWithValidation
} from './utils/test-helpers';

/**
 * CI Integration Tests
 * 
 * These tests are specifically designed for continuous integration environments
 * and provide comprehensive coverage across multiple browsers and devices.
 */

test.describe('CI Integration Tests', () => {
	// Test critical user journeys across all browsers
	const criticalPages = [
		{ url: '/', name: 'Homepage' },
		{ url: '/blog', name: 'Blog' },
		{ url: '/case-studies', name: 'Case Studies' },
		{ url: '/contact', name: 'Contact' },
		{ url: '/about', name: 'About' },
		{ url: '/portfolio', name: 'Portfolio' }
	];

	// Test each critical page for basic functionality
	criticalPages.forEach(({ url, name }) => {
		test(`${name} page loads successfully across all browsers`, async ({ page }) => {
			await navigateWithValidation(page, url);
			
			// Verify basic page structure
			await expect(page.locator('body')).toBeVisible();
			await expect(page.locator('main, [role="main"]')).toBeVisible();
			
			// Check for navigation
			await expect(page.locator('nav, [role="navigation"]')).toBeVisible();
			
			// Verify no console errors
			const errors: string[] = [];
			page.on('console', msg => {
				if (msg.type() === 'error') {
					errors.push(msg.text());
				}
			});
			
			// Wait a bit to catch any delayed errors
			await page.waitForTimeout(1000);
			
			// Filter out known non-critical errors
			const criticalErrors = errors.filter(error => 
				!error.includes('favicon') && 
				!error.includes('404') &&
				!error.includes('net::ERR_ABORTED')
			);
			
			expect(criticalErrors).toEqual([]);
		});
	});

	// Performance tests for critical pages
	test('Critical pages meet performance benchmarks', async ({ page }) => {
		const performanceResults = [];
		
		for (const { url, name } of criticalPages) {
			const result = await testPagePerformance(page, url, 15000); // 15s max for CI
			performanceResults.push({ page: name, loadTime: result.loadTime });
		}
		
		// Log performance summary
		console.log('📊 Performance Summary:');
		performanceResults.forEach(({ page, loadTime }) => {
			console.log(`   ${page}: ${loadTime}ms`);
		});
		
		// All pages should load within acceptable time
		performanceResults.forEach(({ page, loadTime }) => {
			expect(loadTime).toBeLessThan(15000);
		});
	});

	// Accessibility tests for critical pages
	test('Critical pages meet accessibility standards', async ({ page }) => {
		const accessibilityResults = [];
		
		for (const { url, name } of criticalPages) {
			try {
				const result = await runComprehensiveAccessibilityTest(page, name, url);
				accessibilityResults.push({ page: name, violations: result.violations.length });
			} catch (error) {
				console.error(`❌ Accessibility test failed for ${name}:`, error);
				accessibilityResults.push({ page: name, violations: -1 });
			}
		}
		
		// Log accessibility summary
		console.log('♿ Accessibility Summary:');
		accessibilityResults.forEach(({ page, violations }) => {
			if (violations === -1) {
				console.log(`   ${page}: FAILED`);
			} else {
				console.log(`   ${page}: ${violations} violations`);
			}
		});
		
		// All pages should have no accessibility violations
		accessibilityResults.forEach(({ page, violations }) => {
			expect(violations).toBe(0);
		});
	});

	// Test responsive design across different viewports
	test('Responsive design works across viewports', async ({ page }) => {
		const viewports = [
			{ width: 1920, height: 1080, name: 'Desktop' },
			{ width: 1024, height: 768, name: 'Tablet' },
			{ width: 375, height: 667, name: 'Mobile' }
		];
		
		for (const viewport of viewports) {
			await page.setViewportSize({ width: viewport.width, height: viewport.height });
			await navigateWithValidation(page, '/');
			
			// Check that main content is visible and properly sized
			const mainContent = page.locator('main, [role="main"]');
			await expect(mainContent).toBeVisible();
			
			// Check that navigation is accessible
			const navigation = page.locator('nav, [role="navigation"]');
			await expect(navigation).toBeVisible();
			
			// Verify no horizontal scroll (responsive design)
			const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
			const viewportWidth = viewport.width;
			expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20); // Allow small margin
		}
	});

	// Test error handling and 404 pages
	test('Error pages work correctly', async ({ page }) => {
		// Test 404 page
		const response = await page.goto('/non-existent-page');
		expect(response?.status()).toBe(404);
		
		// Should show 404 content
		await expect(page.locator('body')).toBeVisible();
		
		// Should have navigation back to main site
		const homeLink = page.locator('a[href="/"]');
		await expect(homeLink).toBeVisible();
	});

	// Test SEO basics
	test('SEO basics are implemented', async ({ page }) => {
		await navigateWithValidation(page, '/');
		
		// Check for essential meta tags
		const title = await page.title();
		expect(title).toBeTruthy();
		expect(title.length).toBeGreaterThan(10);
		
		// Check for meta description
		const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
		expect(metaDescription).toBeTruthy();
		expect(metaDescription?.length).toBeGreaterThan(50);
		
		// Check for canonical URL
		const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
		expect(canonical).toBeTruthy();
		
		// Check for Open Graph tags
		const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
		expect(ogTitle).toBeTruthy();
	});

	// Test form functionality
	test('Contact form is functional', async ({ page }) => {
		await navigateWithValidation(page, '/contact');
		
		// Check that form elements are present and accessible
		const form = page.locator('form');
		await expect(form).toBeVisible();
		
		// Check for required form fields
		const nameField = page.locator('input[name*="name"], input[type="text"]').first();
		await expect(nameField).toBeVisible();
		
		const emailField = page.locator('input[name*="email"], input[type="email"]').first();
		await expect(emailField).toBeVisible();
		
		const messageField = page.locator('textarea[name*="message"], textarea').first();
		await expect(messageField).toBeVisible();
		
		// Check for submit button
		const submitButton = page.locator('button[type="submit"], input[type="submit"]');
		await expect(submitButton).toBeVisible();
		await expect(submitButton).toBeEnabled();
	});
});
