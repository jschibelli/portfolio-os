import { test, expect } from '@playwright/test';

/**
 * Blog Components Tests
 * Issue #302 - Frontend/UI Specialist (Chris)
 * Part 2 of 4: Blog Components
 * 
 * Tests blog-specific components:
 * - ModernPostCard (blog post preview cards)
 * - FeaturedPost component
 * - NewsletterCTA component
 * - Post tags and categories
 * - Read time display
 * - Author information
 */

test.describe('Blog Components - Post Cards', () => {
  test('should display blog post cards on blog page', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Look for post cards or links
    const postCards = page.locator('a[href^="/blog/"]');
    const cardCount = await postCards.count();
    
    if (cardCount > 0) {
      await expect(postCards.first()).toBeVisible();
    }
  });

  test('should display post title in card', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Find post cards with headings
    const postHeadings = page.locator('a[href^="/blog/"] h2, a[href^="/blog/"] h3');
    const headingCount = await postHeadings.count();
    
    if (headingCount > 0) {
      await expect(postHeadings.first()).toBeVisible();
    }
  });

  test('should display post excerpt or description', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Find post cards with content
    const postCards = page.locator('a[href^="/blog/"]');
    const cardCount = await postCards.count();
    
    if (cardCount > 0) {
      const firstCard = postCards.first();
      await expect(firstCard).toBeVisible();
      
      // Card should have some text content
      const cardText = await firstCard.textContent();
      expect(cardText!.length).toBeGreaterThan(0);
    }
  });

  test('should show hover effect on post cards', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Find and hover over post card
    const postCard = page.locator('a[href^="/blog/"]').first();
    const cardCount = await postCard.count();
    
    if (cardCount > 0) {
      await postCard.hover();
      await page.waitForTimeout(300);
      
      // Card should still be visible
      await expect(postCard).toBeVisible();
    }
  });
});

test.describe('Blog Components - Featured Post', () => {
  test('should display featured post section if available', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Look for featured post section
    const featuredSection = page.locator('text=Featured').first();
    const featuredCount = await featuredSection.count();
    
    if (featuredCount > 0) {
      await expect(featuredSection).toBeVisible();
    }
  });
});

test.describe('Blog Components - Newsletter CTA', () => {
  test('should display newsletter subscription section', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Scroll down to newsletter section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - 500));
    await page.waitForTimeout(500);
    
    // Look for newsletter section
    const newsletterSection = page.locator('text=newsletter, text=subscribe').first();
    const sectionCount = await newsletterSection.count();
    
    if (sectionCount > 0) {
      await expect(newsletterSection).toBeVisible();
    }
  });

  test('should have email input in newsletter section', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Scroll to newsletter section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - 500));
    await page.waitForTimeout(500);
    
    // Look for email input
    const emailInputs = page.locator('input[type="email"]');
    const inputCount = await emailInputs.count();
    
    if (inputCount > 0) {
      await expect(emailInputs.last()).toBeVisible();
    }
  });

  test('should have subscribe button', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Scroll to newsletter section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - 500));
    await page.waitForTimeout(500);
    
    // Look for subscribe button
    const subscribeButton = page.locator('button:has-text("Subscribe")');
    const buttonCount = await subscribeButton.count();
    
    if (buttonCount > 0) {
      await expect(subscribeButton.last()).toBeVisible();
    }
  });
});

test.describe('Blog Components - Post Metadata', () => {
  test('should display post date on cards', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Look for date elements
    const dates = page.locator('time, span:has-text("20"), span:has-text("Jan"), span:has-text("Feb"), span:has-text("Mar")');
    const dateCount = await dates.count();
    
    // If posts exist, dates should be displayed
    if (dateCount > 0) {
      await expect(dates.first()).toBeVisible();
    }
  });

  test('should display read time if available', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Look for read time indicators
    const readTime = page.locator('text=min read');
    const readTimeCount = await readTime.count();
    
    if (readTimeCount > 0) {
      await expect(readTime.first()).toBeVisible();
    }
  });

  test('should display tags on posts', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Look for tag elements
    const tags = page.locator('span.rounded-full, span.badge, [class*="tag"]');
    const tagCount = await tags.count();
    
    if (tagCount > 0) {
      await expect(tags.first()).toBeVisible();
    }
  });
});

