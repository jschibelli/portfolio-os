import { test, expect } from '@playwright/test';

/**
 * Contact Page Visual Regression Tests
 * Issue #304 - Frontend/UI Specialist (Chris)
 * Part 2 of 4: Contact Page Visual Tests
 */

test.describe('Contact Page Visual Regression', () => {
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

  test('contact page desktop view - light mode', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    await expect(page).toHaveScreenshot('contact-desktop-light.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled',
    });
  });

  test('contact page desktop view - dark mode', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    const themeToggle = page.locator('button[aria-label*="theme"]');
    if (await themeToggle.count() > 0) {
      await themeToggle.first().click();
      await page.waitForTimeout(500);
    }
    
    await expect(page).toHaveScreenshot('contact-desktop-dark.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled',
    });
  });

  test('contact page mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    await expect(page).toHaveScreenshot('contact-mobile.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled',
    });
  });
});

