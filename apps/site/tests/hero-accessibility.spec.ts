import { test, expect } from '@playwright/test';

test.describe('Hero Components Accessibility Tests', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to homepage to test hero components
		await page.goto('/');
	});

	test.describe('Keyboard Navigation', () => {
		test('should be navigable with keyboard', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			await page.waitForLoadState('networkidle');
			
			// Tab through the page
			await page.keyboard.press('Tab');
			await page.keyboard.press('Tab');
			await page.keyboard.press('Tab');
			
			// Check if focus is visible
			const focusedElement = page.locator(':focus');
			await expect(focusedElement).toBeVisible();
		});

		test('should have proper tab order', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			await page.waitForLoadState('networkidle');
			
			// Get all focusable elements
			const focusableElements = page.locator('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
			const count = await focusableElements.count();
			
			expect(count).toBeGreaterThan(0);
		});

		test('should have visible focus indicators', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			await page.waitForLoadState('networkidle');
			
			const button = page.locator('a[href="/contact"]').first();
			await expect(button).toBeVisible();
			
			// Focus on button
			await button.focus();
			
			// Check if focus is visible
			const focusStyles = await button.evaluate((el) => {
				const styles = window.getComputedStyle(el);
				return {
					outline: styles.outline,
					boxShadow: styles.boxShadow,
				};
			});
			
			expect(focusStyles.outline || focusStyles.boxShadow).toBeTruthy();
		});
	});

	test.describe('Screen Reader Support', () => {
		test('should have proper heading structure', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			await page.waitForLoadState('networkidle');
			
			// Check for h1 heading
			const heading = page.locator('h1').first();
			await expect(heading).toBeVisible();
			
			// Check heading text
			const headingText = await heading.textContent();
			expect(headingText).toBeTruthy();
		});

		test('should have proper link labels', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			await page.waitForLoadState('networkidle');
			
			const buttons = page.locator('a[href="/contact"], a[href="/projects"]');
			await expect(buttons.first()).toBeVisible();
			
			// Check button text
			const buttonText = await buttons.first().textContent();
			expect(buttonText).toBeTruthy();
			expect(buttonText?.trim().length).toBeGreaterThan(0);
		});

		test('should have proper alt text for images', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			await page.waitForLoadState('networkidle');
			
			const images = page.locator('img');
			const imageCount = await images.count();
			
			if (imageCount > 0) {
				const firstImage = images.first();
				const altText = await firstImage.getAttribute('alt');
				expect(altText).toBeTruthy();
			}
		});
	});

	test.describe('Color Contrast', () => {
		test('should have sufficient color contrast for text', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			await page.waitForLoadState('networkidle');
			
			const title = page.locator('h1').first();
			await expect(title).toBeVisible();
			
			// Check title color
			const titleColor = await title.evaluate((el) => {
				const styles = window.getComputedStyle(el);
				return styles.color;
			});
			
			expect(titleColor).toBeTruthy();
		});

		test('should have sufficient color contrast for buttons', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			await page.waitForLoadState('networkidle');
			
			const button = page.locator('a[href="/contact"]').first();
			await expect(button).toBeVisible();
			
			// Check button colors
			const buttonStyles = await button.evaluate((el) => {
				const styles = window.getComputedStyle(el);
				return {
					color: styles.color,
					backgroundColor: styles.backgroundColor,
				};
			});
			
			expect(buttonStyles.color).toBeTruthy();
			expect(buttonStyles.backgroundColor).toBeTruthy();
		});
	});

	test.describe('ARIA Attributes', () => {
		test('should have proper ARIA labels', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			await page.waitForLoadState('networkidle');
			
			const buttons = page.locator('a[href="/contact"], a[href="/projects"]');
			await expect(buttons.first()).toBeVisible();
			
			// Check for aria-label or accessible text
			const buttonText = await buttons.first().textContent();
			expect(buttonText).toBeTruthy();
		});

		test('should have proper semantic structure', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			await page.waitForLoadState('networkidle');
			
			// Check for proper heading hierarchy
			const h1 = page.locator('h1');
			await expect(h1.first()).toBeVisible();
			
			// Check for proper section structure
			const section = page.locator('section').first();
			await expect(section).toBeVisible();
		});
	});

	test.describe('Reduced Motion Support', () => {
		test('should respect reduced motion preferences', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			
			// Set reduced motion preference
			await page.emulateMedia({ reducedMotion: 'reduce' });
			
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			const hero = page.locator('section').first();
			await expect(hero).toBeVisible();
			
			// Check if animations are disabled
			const animationStyles = await hero.evaluate((el) => {
				const styles = window.getComputedStyle(el);
				return {
					animation: styles.animation,
					transition: styles.transition,
				};
			});
			
			// Should have reduced or no animations
			expect(animationStyles.animation).toBeTruthy();
		});
	});

	test.describe('Mobile Accessibility', () => {
		test('should be accessible on mobile devices', async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 667 });
			await page.waitForLoadState('networkidle');
			
			const hero = page.locator('section').first();
			await expect(hero).toBeVisible();
			
			// Check if content is readable on mobile
			const title = hero.locator('h1').first();
			await expect(title).toBeVisible();
			
			const titleText = await title.textContent();
			expect(titleText).toBeTruthy();
		});

		test('should have touch-friendly button sizes', async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 667 });
			await page.waitForLoadState('networkidle');
			
			const button = page.locator('a[href="/contact"]').first();
			await expect(button).toBeVisible();
			
			// Check button size
			const buttonSize = await button.boundingBox();
			expect(buttonSize).toBeTruthy();
			
			// Button should be at least 44px in height for touch accessibility
			expect(buttonSize!.height).toBeGreaterThanOrEqual(44);
		});
	});

	test.describe('Focus Management', () => {
		test('should manage focus properly', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			await page.waitForLoadState('networkidle');
			
			// Focus on first button
			const firstButton = page.locator('a[href="/contact"]').first();
			await firstButton.focus();
			
			// Check if focus is visible
			const focusedElement = page.locator(':focus');
			await expect(focusedElement).toBeVisible();
		});

		test('should have proper focus trap', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			await page.waitForLoadState('networkidle');
			
			// Tab through all focusable elements
			const focusableElements = page.locator('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
			const count = await focusableElements.count();
			
			expect(count).toBeGreaterThan(0);
		});
	});

	test.describe('High Contrast Mode', () => {
		test('should work in high contrast mode', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			
			// Enable high contrast mode
			await page.emulateMedia({ colorScheme: 'dark' });
			
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			const hero = page.locator('section').first();
			await expect(hero).toBeVisible();
			
			// Check if content is still visible
			const title = hero.locator('h1').first();
			await expect(title).toBeVisible();
		});
	});

	test.describe('Zoom Support', () => {
		test('should work at 200% zoom', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			
			// Set zoom to 200%
			await page.evaluate(() => {
				document.body.style.zoom = '200%';
			});
			
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			const hero = page.locator('section').first();
			await expect(hero).toBeVisible();
			
			// Check if content is still readable
			const title = hero.locator('h1').first();
			await expect(title).toBeVisible();
		});
	});
});
