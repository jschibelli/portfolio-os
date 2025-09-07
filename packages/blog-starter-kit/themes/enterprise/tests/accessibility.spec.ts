import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
	test('Homepage should meet WCAG 2.1 AA standards', async ({ page }) => {
		await page.goto('/');
		
		// Run axe-core accessibility tests
		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
			.analyze();

		// Assert no critical accessibility violations
		expect(accessibilityScanResults.violations).toEqual([]);
		
		// Log any accessibility issues for debugging
		if (accessibilityScanResults.violations.length > 0) {
			console.log('Accessibility violations found:', accessibilityScanResults.violations);
		}
	});

	test('Blog page should meet WCAG 2.1 AA standards', async ({ page }) => {
		await page.goto('/blog');
		
		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
			.analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test('Case studies page should meet WCAG 2.1 AA standards', async ({ page }) => {
		await page.goto('/case-studies');
		
		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
			.analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test('Contact page should meet WCAG 2.1 AA standards', async ({ page }) => {
		await page.goto('/contact');
		
		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
			.analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test('About page should meet WCAG 2.1 AA standards', async ({ page }) => {
		await page.goto('/about');
		
		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
			.analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test('Portfolio page should meet WCAG 2.1 AA standards', async ({ page }) => {
		await page.goto('/portfolio');
		
		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
			.analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test('Navigation should be keyboard accessible', async ({ page }) => {
		await page.goto('/');
		
		// Test keyboard navigation
		await page.keyboard.press('Tab');
		
		// Check if focus is visible
		const focusedElement = await page.evaluate(() => document.activeElement);
		expect(focusedElement).not.toBeNull();
		
		// Test tab navigation through main navigation
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		
		// Verify focus management
		const currentFocus = await page.evaluate(() => document.activeElement);
		expect(currentFocus).not.toBeNull();
	});

	test('Color contrast should meet WCAG AA standards', async ({ page }) => {
		await page.goto('/');
		
		// Test color contrast specifically
		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2aa'])
			.analyze();

		// Filter for color contrast violations only
		const colorContrastViolations = accessibilityScanResults.violations.filter(
			violation => violation.id === 'color-contrast'
		);

		expect(colorContrastViolations).toEqual([]);
	});

	test('Forms should have proper labels and ARIA attributes', async ({ page }) => {
		await page.goto('/contact');
		
		// Test form accessibility
		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa'])
			.analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test('Images should have proper alt text', async ({ page }) => {
		await page.goto('/');
		
		// Test image accessibility
		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa'])
			.analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test('Headings should have proper structure', async ({ page }) => {
		await page.goto('/');
		
		// Test heading structure
		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa'])
			.analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});
});
