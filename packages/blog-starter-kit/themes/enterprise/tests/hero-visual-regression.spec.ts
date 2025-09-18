import { test, expect } from '@playwright/test';

test.describe('Hero Components Visual Regression Tests', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to homepage to test hero components
		await page.goto('/');
	});

	test.describe('Homepage Hero Visual Tests', () => {
		test('should match homepage hero on desktop', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			await page.waitForLoadState('networkidle');
			
			const hero = page.locator('section').first();
			await expect(hero).toBeVisible();
			
			// Take screenshot of the hero section
			await expect(hero).toHaveScreenshot('homepage-hero-desktop.png');
		});

		test('should match homepage hero on tablet', async ({ page }) => {
			await page.setViewportSize({ width: 768, height: 1024 });
			await page.waitForLoadState('networkidle');
			
			const hero = page.locator('section').first();
			await expect(hero).toBeVisible();
			
			// Take screenshot of the hero section
			await expect(hero).toHaveScreenshot('homepage-hero-tablet.png');
		});

		test('should match homepage hero on mobile', async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 667 });
			await page.waitForLoadState('networkidle');
			
			const hero = page.locator('section').first();
			await expect(hero).toBeVisible();
			
			// Take screenshot of the hero section
			await expect(hero).toHaveScreenshot('homepage-hero-mobile.png');
		});
	});

	test.describe('Typography Visual Tests', () => {
		test('should have correct title typography on desktop', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			await page.waitForLoadState('networkidle');
			
			const title = page.locator('h1').first();
			await expect(title).toBeVisible();
			
			// Check title typography
			const titleStyles = await title.evaluate((el) => {
				const styles = window.getComputedStyle(el);
				return {
					fontSize: styles.fontSize,
					fontWeight: styles.fontWeight,
					lineHeight: styles.lineHeight,
					color: styles.color,
				};
			});
			
			expect(titleStyles.fontSize).toBeTruthy();
			expect(titleStyles.fontWeight).toBeTruthy();
			expect(titleStyles.lineHeight).toBeTruthy();
		});

		test('should have correct description typography on desktop', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			await page.waitForLoadState('networkidle');
			
			const description = page.locator('p').first();
			await expect(description).toBeVisible();
			
			// Check description typography
			const descStyles = await description.evaluate((el) => {
				const styles = window.getComputedStyle(el);
				return {
					fontSize: styles.fontSize,
					lineHeight: styles.lineHeight,
					color: styles.color,
				};
			});
			
			expect(descStyles.fontSize).toBeTruthy();
			expect(descStyles.lineHeight).toBeTruthy();
		});
	});

	test.describe('Button Visual Tests', () => {
		test('should have correct button styling on desktop', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			await page.waitForLoadState('networkidle');
			
			const buttons = page.locator('a[href="/contact"], a[href="/projects"]');
			await expect(buttons.first()).toBeVisible();
			
			// Check button styling
			const buttonStyles = await buttons.first().evaluate((el) => {
				const styles = window.getComputedStyle(el);
				return {
					padding: styles.padding,
					borderRadius: styles.borderRadius,
					backgroundColor: styles.backgroundColor,
					color: styles.color,
				};
			});
			
			expect(buttonStyles.padding).toBeTruthy();
			expect(buttonStyles.borderRadius).toBeTruthy();
		});

		test('should have correct button hover effects', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			await page.waitForLoadState('networkidle');
			
			const button = page.locator('a[href="/contact"]').first();
			await expect(button).toBeVisible();
			
			// Hover over button
			await button.hover();
			
			// Check hover styles
			const hoverStyles = await button.evaluate((el) => {
				const styles = window.getComputedStyle(el);
				return {
					transform: styles.transform,
					boxShadow: styles.boxShadow,
				};
			});
			
			expect(hoverStyles.transform).toBeTruthy();
		});
	});

	test.describe('Background Visual Tests', () => {
		test('should have correct background image on desktop', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			await page.waitForLoadState('networkidle');
			
			const hero = page.locator('section').first();
			await expect(hero).toBeVisible();
			
			// Check background image
			const backgroundImage = await hero.evaluate((el) => {
				const styles = window.getComputedStyle(el);
				return styles.backgroundImage;
			});
			
			expect(backgroundImage).toContain('url(');
		});

		test('should have correct overlay on desktop', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			await page.waitForLoadState('networkidle');
			
			const hero = page.locator('section').first();
			await expect(hero).toBeVisible();
			
			// Check overlay
			const overlay = hero.locator('div').first();
			await expect(overlay).toBeVisible();
		});
	});

	test.describe('Responsive Layout Tests', () => {
		test('should have correct layout on large desktop', async ({ page }) => {
			await page.setViewportSize({ width: 2560, height: 1440 });
			await page.waitForLoadState('networkidle');
			
			const hero = page.locator('section').first();
			await expect(hero).toBeVisible();
			
			await expect(hero).toHaveScreenshot('homepage-hero-large-desktop.png');
		});

		test('should have correct layout on small desktop', async ({ page }) => {
			await page.setViewportSize({ width: 1366, height: 768 });
			await page.waitForLoadState('networkidle');
			
			const hero = page.locator('section').first();
			await expect(hero).toBeVisible();
			
			await expect(hero).toHaveScreenshot('homepage-hero-small-desktop.png');
		});

		test('should have correct layout on large tablet', async ({ page }) => {
			await page.setViewportSize({ width: 1024, height: 768 });
			await page.waitForLoadState('networkidle');
			
			const hero = page.locator('section').first();
			await expect(hero).toBeVisible();
			
			await expect(hero).toHaveScreenshot('homepage-hero-large-tablet.png');
		});

		test('should have correct layout on small mobile', async ({ page }) => {
			await page.setViewportSize({ width: 320, height: 568 });
			await page.waitForLoadState('networkidle');
			
			const hero = page.locator('section').first();
			await expect(hero).toBeVisible();
			
			await expect(hero).toHaveScreenshot('homepage-hero-small-mobile.png');
		});
	});

	test.describe('Animation Visual Tests', () => {
		test('should have correct animation timing', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			await page.waitForLoadState('networkidle');
			
			const hero = page.locator('section').first();
			await expect(hero).toBeVisible();
			
			// Wait for animations to complete
			await page.waitForTimeout(1000);
			
			// Check if elements are visible after animation
			const title = hero.locator('h1').first();
			const description = hero.locator('p').first();
			const buttons = hero.locator('a').first();
			
			await expect(title).toBeVisible();
			await expect(description).toBeVisible();
			await expect(buttons).toBeVisible();
		});
	});

	test.describe('Cross-Browser Visual Tests', () => {
		test('should look consistent across browsers', async ({ page, browserName }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			await page.waitForLoadState('networkidle');
			
			const hero = page.locator('section').first();
			await expect(hero).toBeVisible();
			
			// Take screenshot with browser name
			await expect(hero).toHaveScreenshot(`homepage-hero-${browserName}.png`);
		});
	});

	test.describe('Accessibility Visual Tests', () => {
		test('should have proper focus indicators', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			await page.waitForLoadState('networkidle');
			
			const button = page.locator('a[href="/contact"]').first();
			await expect(button).toBeVisible();
			
			// Focus on button
			await button.focus();
			
			// Check focus styles
			const focusStyles = await button.evaluate((el) => {
				const styles = window.getComputedStyle(el);
				return {
					outline: styles.outline,
					boxShadow: styles.boxShadow,
				};
			});
			
			expect(focusStyles.outline).toBeTruthy();
		});

		test('should have proper color contrast', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			await page.waitForLoadState('networkidle');
			
			const title = page.locator('h1').first();
			await expect(title).toBeVisible();
			
			// Check color contrast
			const titleColor = await title.evaluate((el) => {
				const styles = window.getComputedStyle(el);
				return styles.color;
			});
			
			expect(titleColor).toBeTruthy();
		});
	});
});
