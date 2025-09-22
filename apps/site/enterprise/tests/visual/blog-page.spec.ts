import { test, expect } from '@playwright/test';

test.describe('Blog Page Visual Regression', () => {
  // Set up consistent test environment
  test.beforeEach(async ({ page }) => {
    // Disable animations for consistent screenshots
    await page.addInitScript(() => {
      // Disable CSS animations and transitions
      const style = document.createElement('style');
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `;
      // Safely append to head, ensuring it exists
      if (document.head) {
        document.head.appendChild(style);
      } else {
        // Fallback: wait for head to be available
        const observer = new MutationObserver(() => {
          if (document.head) {
            document.head.appendChild(style);
            observer.disconnect();
          }
        });
        if (document.documentElement) {
          observer.observe(document.documentElement, { childList: true });
        } else {
          // If documentElement is not available, just append to body as fallback
          document.body?.appendChild(style);
        }
      }
    });

    // Set up error handling for better debugging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error(`Browser console error: ${msg.text()}`);
      }
    });

    page.on('pageerror', error => {
      console.error(`Page error: ${error.message}`);
    });
  });

  test('blog page desktop view', async ({ page }) => {
    try {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/blog');
      
      // Wait for page to fully load
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Take full page screenshot
      await expect(page).toHaveScreenshot('blog-page-desktop.png', {
        fullPage: true,
        threshold: 0.1, // 0.1% threshold for visual differences
        animations: 'disabled',
      });
    } catch (error) {
      console.error('Desktop view test failed:', error);
      // Take a screenshot for debugging
      await page.screenshot({ path: 'test-results/desktop-error.png', fullPage: true });
      throw error;
    }
  });

  test('blog page tablet view', async ({ page }) => {
    await page.setViewportSize({ width: 834, height: 1112 });
    await page.goto('/blog');
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('blog-page-tablet.png', {
      fullPage: true,
      threshold: 0.1,
      animations: 'disabled',
    });
  });

  test('blog page mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/blog');
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('blog-page-mobile.png', {
      fullPage: true,
      threshold: 0.1,
      animations: 'disabled',
    });
  });

  test('blog page dark mode', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/blog');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Toggle to dark mode
    const themeToggle = page.locator('button[aria-label*="theme"], button[aria-label*="dark"], button[aria-label*="light"]');
    if (await themeToggle.count() > 0) {
      await themeToggle.click();
      await page.waitForTimeout(500);
    }
    
    await expect(page).toHaveScreenshot('blog-page-desktop-dark.png', {
      fullPage: true,
      threshold: 0.1,
      animations: 'disabled',
    });
  });

  test('blog page component states', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/blog');
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Test post card hover state
    const postCard = page.locator('[data-testid="post-card"], .post-card, a[href*="/"]').first();
    if (await postCard.count() > 0) {
      await postCard.hover();
      await page.waitForTimeout(300);
      
      await expect(postCard).toHaveScreenshot('post-card-hover.png', {
        threshold: 0.1,
        animations: 'disabled',
      });
    }
  });

  test('newsletter form states', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/blog');
    
    await page.waitForLoadState('networkidle');
    
    // Scroll to newsletter section
    await page.locator('text=Stay updated with our newsletter').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    // Test newsletter form default state
    const newsletterSection = page.locator('text=Stay updated with our newsletter').locator('..');
    await expect(newsletterSection).toHaveScreenshot('newsletter-form-default.png', {
      threshold: 0.1,
      animations: 'disabled',
    });
    
    // Test filled state
    const emailInput = page.locator('input[type="email"]');
    if (await emailInput.count() > 0) {
      await emailInput.fill('test@example.com');
      await page.waitForTimeout(300);
      
      await expect(newsletterSection).toHaveScreenshot('newsletter-form-filled.png', {
        threshold: 0.1,
        animations: 'disabled',
      });
    }
  });
});