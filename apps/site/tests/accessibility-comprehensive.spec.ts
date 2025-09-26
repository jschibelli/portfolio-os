import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test.describe('Comprehensive Accessibility Tests', () => {
	test('Complete WCAG 2.1 AA compliance test', async ({ page }) => {
		await page.goto('/');
		
		// Run comprehensive axe-core accessibility tests
		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
			.analyze();

		// Assert no critical accessibility violations
		expect(accessibilityScanResults.violations).toEqual([]);
		
		// Log any accessibility issues for debugging
		if (accessibilityScanResults.violations.length > 0) {
			console.log('Accessibility violations found:', accessibilityScanResults.violations);
		}

		// Test for specific accessibility features
		await testAccessibilityFeatures(page);
	});

	test('Keyboard navigation and focus management', async ({ page }) => {
		await page.goto('/');
		
		// Test skip link functionality - find the skip link and ensure it's focusable
		// Skip link removed per design request; ensure page still loads and focus works
		await expect(page.locator('.skip-link')).toHaveCount(0);
		// Move focus via Tab to ensure keyboard navigation still works
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		
		// Test tab navigation through interactive elements
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		
		// Verify focus is visible
		const focusedElement = await page.evaluate(() => document.activeElement);
		expect(focusedElement).not.toBeNull();
	});

	test('Screen reader compatibility', async ({ page }) => {
		await page.goto('/');
		
		// Test ARIA landmarks
		const landmarks = await page.evaluate(() => {
			const elements = document.querySelectorAll('[role]');
			return Array.from(elements).map(el => ({
				tag: el.tagName.toLowerCase(),
				role: el.getAttribute('role'),
				ariaLabel: el.getAttribute('aria-label')
			}));
		});
		
		// Verify proper landmarks exist
		expect(landmarks.some(l => l.role === 'banner')).toBeTruthy();
		expect(landmarks.some(l => l.role === 'main')).toBeTruthy();
		expect(landmarks.some(l => l.role === 'contentinfo')).toBeTruthy();
		expect(landmarks.some(l => l.role === 'navigation')).toBeTruthy();
		
		// Test heading structure
		const headings = await page.evaluate(() => {
			const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
			return Array.from(elements).map(el => ({
				tag: el.tagName.toLowerCase(),
				text: el.textContent?.trim()
			}));
		});
		
		// Verify proper heading hierarchy
		expect(headings.some(h => h.tag === 'h1')).toBeTruthy();
		expect(headings.length).toBeGreaterThan(0);
	});

	test('Form accessibility', async ({ page }) => {
		await page.goto('/contact');
		
		// Test form labels and inputs
		const formElements = await page.evaluate(() => {
			const inputs = document.querySelectorAll('input, select, textarea');
			return Array.from(inputs).map(input => ({
				id: input.getAttribute('id'),
				label: input.getAttribute('aria-label') || 
					   document.querySelector(`label[for="${input.getAttribute('id')}"]`)?.textContent?.trim(),
				required: input.hasAttribute('required'),
				ariaInvalid: input.getAttribute('aria-invalid'),
				ariaDescribedby: input.getAttribute('aria-describedby')
			}));
		});
		
		// Verify all form elements have proper labels
		formElements.forEach(element => {
			expect(element.label).toBeTruthy();
		});
	});

	test('Color contrast compliance', async ({ page }) => {
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

	test('Image accessibility', async ({ page }) => {
		await page.goto('/');
		
		// Test image alt text
		const images = await page.evaluate(() => {
			const imgElements = document.querySelectorAll('img');
			return Array.from(imgElements).map(img => ({
				src: img.getAttribute('src'),
				alt: img.getAttribute('alt'),
				ariaLabel: img.getAttribute('aria-label'),
				role: img.getAttribute('role')
			}));
		});
		
		// Verify all images have proper alt text or are decorative
		images.forEach(image => {
			if (image.role !== 'presentation' && image.role !== 'none') {
				expect(image.alt || image.ariaLabel).toBeTruthy();
			}
		});
	});

	test('Interactive element accessibility', async ({ page }) => {
		await page.goto('/');
		
		// Test buttons and links
		const interactiveElements = await page.evaluate(() => {
			const buttons = document.querySelectorAll('button, [role="button"]');
			const links = document.querySelectorAll('a[href]');
			
			return {
				buttons: Array.from(buttons).map(btn => ({
					text: btn.textContent?.trim(),
					ariaLabel: btn.getAttribute('aria-label'),
					ariaPressed: btn.getAttribute('aria-pressed')
				})),
				links: Array.from(links).map(link => ({
					text: link.textContent?.trim(),
					ariaLabel: link.getAttribute('aria-label'),
					href: link.getAttribute('href')
				}))
			};
		});
		
		// Verify interactive elements have accessible names
		interactiveElements.buttons.forEach(button => {
			expect(button.text || button.ariaLabel).toBeTruthy();
		});
		
		interactiveElements.links.forEach(link => {
			expect(link.text || link.ariaLabel).toBeTruthy();
		});
	});
});

async function testAccessibilityFeatures(page: any) {
	// Skip link intentionally removed; assert it's not present
	await expect(page.locator('.skip-link')).toHaveCount(0);
	
	// Test for main landmark
	const mainLandmark = page.locator('main[role="main"]');
	await expect(mainLandmark).toBeVisible();
	
	// Test for proper document language
	const htmlLang = await page.evaluate(() => document.documentElement.getAttribute('lang'));
	expect(htmlLang).toBe('en');
	
	// Test for proper page title
	const title = await page.title();
	expect(title).toBeTruthy();
	expect(title.length).toBeGreaterThan(0);
}
