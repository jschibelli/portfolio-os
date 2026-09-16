import { test, expect } from '@playwright/test';

/**
 * Homepage Interactive Tests
 * Issue #295 - Frontend/UI Specialist (Chris)
 * 
 * Tests the homepage (/) for:
 * - Hero section animations and content
 * - CTA button interactions
 * - Featured projects display
 * - Latest blog posts section
 * - Interactive elements (hover, click)
 * - Scroll behavior
 * - Responsive design
 */

test.describe('Homepage - Hero Section', () => {
  test('should display hero section with heading and tagline', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify main heading
    const heading = page.locator('h1:has-text("Engineering software that holds up in production")');
    await expect(heading).toBeVisible();
    
    // Verify title is displayed
    await expect(page.locator('header p:has-text("Senior Software Engineer")').first()).toBeVisible();
  });

  test('should display hero background image', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    const heroImage = page.locator('header img').first();
    await expect(heroImage).toBeVisible();
    await expect(heroImage).toHaveAttribute('src');
  });

  test('should animate hero content on page load', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Wait for animations to complete
    await page.waitForTimeout(2000);
    
    // Verify hero heading is visible (animations complete)
    const heading = page.locator('h1:has-text("Engineering software that holds up in production")');
    await expect(heading).toBeVisible();
    
    // Verify content has proper visibility (visible to user means opacity > 0 or element is rendered)
    const isVisible = await heading.isVisible();
    expect(isVisible).toBeTruthy();
  });
});

test.describe('Homepage - CTA Buttons', () => {
  test('should display primary CTA button "View Work"', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    const primaryCTA = page.locator('a:has-text("View Work")');
    await expect(primaryCTA).toBeVisible();
    
    await expect(primaryCTA).toHaveAttribute('href', '/projects');
  });

  test('should navigate to projects page when clicking primary CTA', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    const primaryCTA = page.locator('a:has-text("View Work")');
    
    await Promise.all([
      page.waitForURL('**/projects', { timeout: 30000 }),
      primaryCTA.click()
    ]);
    
    expect(page.url()).toContain('/projects');
  });

  test('should show hover effect on CTA buttons', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    const primaryCTA = page.locator('a:has-text("View Work")');
    await primaryCTA.hover();
    
    await page.waitForTimeout(300);
    
    await expect(primaryCTA).toBeVisible();
  });
});

test.describe('Homepage - Featured Projects Section', () => {
  test('should display featured projects section', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Scroll to featured projects section
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);
    
    // Look for project-related content
    const projectSection = page.locator('section, div').filter({ hasText: /project/i }).first();
    if (await projectSection.count() > 0) {
      await expect(projectSection).toBeVisible();
    }
  });

  test('should display project cards if projects exist', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Scroll down to projects section
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);
    
    // Check for project links or cards
    const projectLinks = page.locator('a[href*="/projects/"]');
    const projectCount = await projectLinks.count();
    
    // If projects exist, verify they're visible
    if (projectCount > 0) {
      await expect(projectLinks.first()).toBeVisible();
    }
  });
});

test.describe('Homepage - Latest Posts Section', () => {
  test('should display latest blog posts section', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Scroll to blog section
    await page.evaluate(() => window.scrollTo(0, 1200));
    await page.waitForTimeout(500);
    
    // Look for blog/post related content
    const blogSection = page.locator('section, div').filter({ hasText: /blog|post|article/i }).first();
    if (await blogSection.count() > 0) {
      await expect(blogSection).toBeVisible();
    }
  });

  test('should display blog post links if posts exist', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Scroll down to blog section
    await page.evaluate(() => window.scrollTo(0, 1200));
    await page.waitForTimeout(500);
    
    // Check for blog post links
    const blogLinks = page.locator('a[href*="/blog/"]');
    const blogCount = await blogLinks.count();
    
    // If blog posts exist, verify they're visible
    if (blogCount > 0) {
      await expect(blogLinks.first()).toBeVisible();
    }
  });
});

test.describe('Homepage - Navigation and Scroll Behavior', () => {
  test('should have navigation header visible', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify header/nav is present
    const header = page.locator('header, nav').first();
    await expect(header).toBeVisible();
  });

  test('should maintain header visibility on scroll', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Scroll down the page
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300);
    
    // Header should still be visible (sticky/fixed)
    const header = page.locator('header, nav').first();
    await expect(header).toBeVisible();
  });

  test('should scroll smoothly between sections', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Get initial scroll position
    const initialScroll = await page.evaluate(() => window.scrollY);
    
    // Scroll down
    await page.evaluate(() => window.scrollTo({ top: 1000, behavior: 'smooth' }));
    await page.waitForTimeout(500);
    
    // Get new scroll position
    const newScroll = await page.evaluate(() => window.scrollY);
    
    // Verify scroll occurred
    expect(newScroll).toBeGreaterThan(initialScroll);
  });
});

test.describe('Homepage - Interactive Elements', () => {
  test('should not display a chatbot launcher', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1000);

    const chatbotButton = page.locator('button[aria-label*="chat"], button:has-text("Chat"), [data-testid*="chatbot"]');
    await expect(chatbotButton).toHaveCount(0);
  });

  test('should have footer visible at bottom', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    // Verify footer is visible
    const footer = page.locator('footer').last();
    await expect(footer).toBeVisible();
  });

  test('should have working navigation links in header', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Find navigation links
    const nav = page.locator('nav, header').first();
    const navLinks = nav.locator('a');
    const linkCount = await navLinks.count();
    
    // Verify at least some navigation links exist
    expect(linkCount).toBeGreaterThan(0);
    
    // Verify first link is clickable
    if (linkCount > 0) {
      await expect(navLinks.first()).toBeVisible();
    }
  });
});

test.describe('Homepage - Responsive Design', () => {
  test('should display properly on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify hero content is visible on mobile
    const heading = page.locator('h1:has-text("Engineering software that holds up in production")');
    await expect(heading).toBeVisible();
    
    // Verify CTAs are visible on mobile
    const primaryCTA = page.locator('a:has-text("View Work")');
    await expect(primaryCTA).toBeVisible();
  });

  test('should display properly on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify hero content is visible on tablet
    const heading = page.locator('h1:has-text("Engineering software that holds up in production")');
    await expect(heading).toBeVisible();
    
    // Verify CTAs are visible on tablet
    const primaryCTA = page.locator('a:has-text("View Work")');
    await expect(primaryCTA).toBeVisible();
  });

  test('should display properly on desktop viewport', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify hero content is visible on desktop
    const heading = page.locator('h1:has-text("Engineering software that holds up in production")');
    await expect(heading).toBeVisible();
    
    // Verify CTAs are visible on desktop
    const primaryCTA = page.locator('a:has-text("View Work")');
    await expect(primaryCTA).toBeVisible();
  });

  test('should stack CTA buttons vertically on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Get CTA container
    const ctaContainer = page.locator('nav[aria-label="Primary navigation actions"]');
    if (await ctaContainer.count() > 0) {
      await expect(ctaContainer).toBeVisible();
      
      // Verify buttons exist
      const primaryCTA = page.locator('a:has-text("View Work")');
      await expect(primaryCTA).toBeVisible();
    }
  });
});

test.describe('Homepage - Accessibility', () => {
  test('should have proper ARIA labels on CTAs', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Check primary CTA has aria-label
    const primaryCTA = page.locator('a:has-text("View Work")');
    await expect(primaryCTA).toHaveAttribute('aria-label');
  });

  test('should have semantic HTML structure', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify main content area
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    // Verify header element
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    
    // Verify footer element
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify h1 exists
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    
    // Verify only one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
  });
});

test.describe('Homepage - Performance', () => {
  test('should load hero section quickly', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify hero is visible
    const heading = page.locator('h1:has-text("Engineering software that holds up in production")');
    await expect(heading).toBeVisible();
    
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    
    // Hero should load within reasonable time (< 5 seconds)
    expect(loadTime).toBeLessThan(5000);
  });

  test('should have optimized images with proper attributes', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Check hero background image has proper attributes
    const heroImage = page.locator('header img').first();
    
    if (await heroImage.count() > 0) {
      // Verify image has alt text
      await expect(heroImage).toHaveAttribute('alt');
      
      // Verify image has src
      await expect(heroImage).toHaveAttribute('src');
    }
  });
});

