import { test, expect } from '@playwright/test';

/**
 * Homepage Visual Regression Tests
 * Issue #304 - Frontend/UI Specialist (Chris)
 * Part 1 of 4: Homepage Visual Tests
 */

test.describe('Homepage Visual Regression', () => {
  // Disable animations for consistent screenshots
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const style = document.createElement('style');
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `;
      if (document.head) {
        document.head.appendChild(style);
      }
    });
  });

  test('homepage desktop view - light mode', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000); // Extra time for stability
    
    await expect(page).toHaveScreenshot('homepage-desktop-light.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled',
      maxDiffPixelRatio: 0.03, // Allow 3% difference for dynamic content
    });
  });

  test('homepage desktop view - dark mode', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    // Toggle to dark mode
    const themeToggle = page.locator('button[aria-label*="theme"]');
    if (await themeToggle.count() > 0) {
      await themeToggle.first().click();
      await page.waitForTimeout(500);
    }
    
    await expect(page).toHaveScreenshot('homepage-desktop-dark.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled',
    });
  });

  test('homepage tablet view', async ({ page }) => {
    await page.setViewportSize({ width: 834, height: 1112 });
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled',
    });
  });

  test('homepage mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled',
    });
  });
});

