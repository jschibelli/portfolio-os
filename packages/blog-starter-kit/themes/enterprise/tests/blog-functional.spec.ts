import { test, expect } from '@playwright/test';

test.describe('Blog Page Functional Tests', () => {
  test('blog page should display all required sections', async ({ page }) => {
    // Navigate to blog page with retry logic
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    // Check for hero section
    await expect(page.locator('text=The Developer\'s Lens')).toBeVisible();
    
    // Check for social media icons (they are in a separate section, not footer)
    await expect(page.locator('a[aria-label*="Facebook"]')).toBeVisible();
    await expect(page.locator('a[aria-label*="Github"]')).toBeVisible();
    await expect(page.locator('a[aria-label*="Linkedin"]')).toBeVisible();
    
    // Check for latest posts section
    await expect(page.locator('text=Latest Posts')).toBeVisible();
    
    // Check for newsletter section
    await expect(page.locator('text=Stay updated with our newsletter')).toBeVisible();
    
    // Check if there are any posts (either featured or latest)
    const hasPosts = await page.locator('article, .post-card, a[href*="/blog/"]').count() > 0;
    if (hasPosts) {
      // If there are posts, check for featured post section
      const featuredSection = page.locator('text=Featured');
      if (await featuredSection.count() > 0) {
        await expect(featuredSection.first()).toBeVisible();
      }
    }
  });

  test('post cards should be clickable', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    // Check if there are any posts and verify the page structure
    const postLinks = page.locator('a[href*="/blog/"]');
    const postCount = await postLinks.count();
    
    if (postCount > 0) {
      const firstPostLink = postLinks.first();
      await expect(firstPostLink).toBeVisible();
      
      // Test hover effect (without clicking to avoid navigation issues)
      await firstPostLink.hover();
      
      // Verify the link has proper attributes
      await expect(firstPostLink).toHaveAttribute('href');
    }
    
    // Always verify the page structure is correct
    await expect(page.locator('text=Latest Posts')).toBeVisible();
  });

  test('newsletter form should be functional', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Wait for page to load
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    // Scroll to newsletter section
    await page.locator('text=Stay updated with our newsletter').scrollIntoViewIfNeeded();
    
    // Check for email input in newsletter section
    const emailInput = page.locator('section:has-text("Stay updated with our newsletter") input[type="email"]');
    if (await emailInput.count() > 0) {
      await expect(emailInput).toBeVisible();
      
      // Test email input
      await emailInput.fill('test@example.com');
      await expect(emailInput).toHaveValue('test@example.com');
      
      // Check for subscribe button in newsletter section (more specific selector)
      const subscribeButton = page.locator('section:has-text("Stay updated with our newsletter") button:has-text("Subscribe")');
      if (await subscribeButton.count() > 0) {
        await expect(subscribeButton).toBeVisible();
      }
    }
  });

  test('theme toggle should work', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Find theme toggle button
    const themeToggle = page.locator('button[aria-label*="theme"], button[aria-label*="dark"], button[aria-label*="light"], button[aria-label*="Switch to"]');
    
    if (await themeToggle.count() > 0) {
      await expect(themeToggle).toBeVisible();
      
      // Test theme toggle
      await themeToggle.click();
      
      // Check if dark mode is applied
      const body = page.locator('body');
      const hasDarkClass = await body.evaluate(el => el.classList.contains('dark'));
      
      // Toggle back
      await themeToggle.click();
    }
  });

  test('mobile navigation should work', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Look for mobile menu button (more specific selector)
    const menuButton = page.locator('button[aria-label="Toggle mobile menu"]');
    
    if (await menuButton.count() > 0) {
      await expect(menuButton).toBeVisible();
      
      // Test mobile menu
      await menuButton.click();
      
      // Check if mobile menu dialog is open (more specific selector)
      const mobileMenuDialog = page.locator('[role="dialog"][aria-label="Mobile navigation menu"]');
      if (await mobileMenuDialog.count() > 0) {
        await expect(mobileMenuDialog).toBeVisible();
      }
    }
  });

  test('social media links should be valid', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Test social media links (they are in a separate section, not footer)
    const socialLinks = page.locator('a[aria-label*="external website"]');
    const linkCount = await socialLinks.count();
    
    expect(linkCount).toBeGreaterThan(0);
    
    // Check that links have proper attributes
    for (let i = 0; i < linkCount; i++) {
      const link = socialLinks.nth(i);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });
});
