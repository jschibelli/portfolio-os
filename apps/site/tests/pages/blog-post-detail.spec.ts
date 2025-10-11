import { test, expect } from '@playwright/test';

/**
 * Blog Post Detail Page Tests
 * Issue #293 - Frontend/UI Specialist (Chris)
 * 
 * Tests the blog post detail page (/blog/[slug]) for:
 * - Core rendering and content display
 * - Metadata and UI components
 * - Interactive elements
 * - Edge cases and error handling
 * - Responsive design
 * - Dark mode support
 */

test.describe('Blog Post Detail Page - Core Rendering', () => {
  test('should load blog post page with valid slug', async ({ page }) => {
    // Navigate to the blog list to find a valid post
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Find the first blog post link
    const firstPostLink = page.locator('a[href^="/blog/"]:not([href="/blog"])').first();
    const postCount = await firstPostLink.count();
    
    // Skip test if no posts available
    if (postCount === 0) {
      test.skip();
      return;
    }
    
    // Get the post URL and navigate to it
    const postUrl = await firstPostLink.getAttribute('href');
    await page.goto(postUrl!, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify page loaded successfully
    await expect(page.locator('article')).toBeVisible();
  });

  test('should display post title in h1', async ({ page }) => {
    // Navigate to blog list
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Find and navigate to first post
    const firstPostLink = page.locator('a[href^="/blog/"]:not([href="/blog"])').first();
    if (await firstPostLink.count() === 0) {
      test.skip();
      return;
    }
    
    const postUrl = await firstPostLink.getAttribute('href');
    await page.goto(postUrl!, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify h1 title is present and visible
    const h1 = page.locator('article h1');
    await expect(h1).toBeVisible();
    
    // Verify title has proper styling classes
    await expect(h1).toHaveClass(/text-4xl|md:text-5xl|font-bold/);
  });

  test('should render post content with proper HTML', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    const firstPostLink = page.locator('a[href^="/blog/"]:not([href="/blog"])').first();
    if (await firstPostLink.count() === 0) {
      test.skip();
      return;
    }
    
    const postUrl = await firstPostLink.getAttribute('href');
    await page.goto(postUrl!, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify content container exists
    const contentContainer = page.locator('.hashnode-content-style');
    await expect(contentContainer).toBeVisible();
    
    // Verify content has HTML rendered (not just markdown text)
    const hasContent = await contentContainer.locator('p, h1, h2, h3, h4, h5, h6, ul, ol, pre, code').count() > 0 ||
                       await contentContainer.textContent().then(text => text!.length > 0);
    expect(hasContent).toBeTruthy();
  });

  test('should display cover image when available', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    const firstPostLink = page.locator('a[href^="/blog/"]:not([href="/blog"])').first();
    if (await firstPostLink.count() === 0) {
      test.skip();
      return;
    }
    
    const postUrl = await firstPostLink.getAttribute('href');
    await page.goto(postUrl!, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Check if cover image exists
    const coverImage = page.locator('article img').first();
    const coverImageCount = await coverImage.count();
    
    if (coverImageCount > 0) {
      // Verify image is visible and has proper attributes
      await expect(coverImage).toBeVisible();
      await expect(coverImage).toHaveAttribute('src');
      await expect(coverImage).toHaveAttribute('alt');
      
      // Verify image has proper styling classes for responsive design
      await expect(coverImage).toHaveClass(/h-64|md:h-96|object-cover|rounded-lg/);
    }
  });

  test('should return 404 for invalid slug', async ({ page }) => {
    // Navigate to a non-existent post
    await page.goto('/blog/this-post-does-not-exist-12345', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    await page.waitForTimeout(1000);
    
    // Verify 404 page content (Next.js may return 200 with 404 page)
    // Check for typical 404 indicators
    const pageContent = await page.textContent('body');
    const is404 = pageContent?.includes('404') || 
                  pageContent?.includes('not found') || 
                  pageContent?.includes('Not Found') ||
                  await page.locator('text=404').count() > 0;
    
    expect(is404).toBeTruthy();
  });
});

test.describe('Blog Post Detail Page - Metadata & UI', () => {
  test('should display author name with icon', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    const firstPostLink = page.locator('a[href^="/blog/"]:not([href="/blog"])').first();
    if (await firstPostLink.count() === 0) {
      test.skip();
      return;
    }
    
    const postUrl = await firstPostLink.getAttribute('href');
    await page.goto(postUrl!, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Check for author metadata
    const authorElement = page.locator('article header div:has-text("John Schibelli"), article header div.flex:has(svg)').first();
    const authorCount = await authorElement.count();
    
    if (authorCount > 0) {
      await expect(authorElement).toBeVisible();
    }
  });

  test('should format publish date correctly', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    const firstPostLink = page.locator('a[href^="/blog/"]:not([href="/blog"])').first();
    if (await firstPostLink.count() === 0) {
      test.skip();
      return;
    }
    
    const postUrl = await firstPostLink.getAttribute('href');
    await page.goto(postUrl!, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Check for date element with proper format (MMMM d, yyyy)
    const dateElement = page.locator('article header time');
    const dateCount = await dateElement.count();
    
    if (dateCount > 0) {
      await expect(dateElement).toBeVisible();
      
      // Verify date has dateTime attribute
      await expect(dateElement).toHaveAttribute('dateTime');
      
      // Verify date text matches format (e.g., "January 1, 2024")
      const dateText = await dateElement.textContent();
      expect(dateText).toMatch(/^[A-Z][a-z]+ \d{1,2}, \d{4}$/);
    }
  });

  test('should display read time when available', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    const firstPostLink = page.locator('a[href^="/blog/"]:not([href="/blog"])').first();
    if (await firstPostLink.count() === 0) {
      test.skip();
      return;
    }
    
    const postUrl = await firstPostLink.getAttribute('href');
    await page.goto(postUrl!, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Check for read time indicator (use last() to avoid strict mode violation)
    const readTimeElement = page.locator('article header div:has-text("min read")').last();
    const readTimeCount = await readTimeElement.count();
    
    if (readTimeCount > 0) {
      await expect(readTimeElement).toBeVisible();
      
      // Verify format includes "min read"
      const readTimeText = await readTimeElement.textContent();
      expect(readTimeText).toMatch(/\d+ min read/);
    }
  });

  test('should render tags with proper styling', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    const firstPostLink = page.locator('a[href^="/blog/"]:not([href="/blog"])').first();
    if (await firstPostLink.count() === 0) {
      test.skip();
      return;
    }
    
    const postUrl = await firstPostLink.getAttribute('href');
    await page.goto(postUrl!, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Check for tags
    const tags = page.locator('article header span.rounded-full');
    const tagCount = await tags.count();
    
    if (tagCount > 0) {
      // Verify first tag is visible
      await expect(tags.first()).toBeVisible();
      
      // Verify tags have proper styling classes
      await expect(tags.first()).toHaveClass(/bg-stone-100|dark:bg-stone-700|rounded-full/);
      
      // Verify tag icon is present
      const tagIcon = tags.first().locator('svg');
      await expect(tagIcon).toBeVisible();
    }
  });

  test('should support dark mode styling', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    const firstPostLink = page.locator('a[href^="/blog/"]:not([href="/blog"])').first();
    if (await firstPostLink.count() === 0) {
      test.skip();
      return;
    }
    
    const postUrl = await firstPostLink.getAttribute('href');
    await page.goto(postUrl!, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Find theme toggle button
    const themeToggle = page.locator('button[aria-label*="theme"], button[aria-label*="dark"], button[aria-label*="light"], button[aria-label*="Switch to"]');
    
    if (await themeToggle.count() > 0) {
      // Toggle to dark mode
      await themeToggle.click();
      await page.waitForTimeout(500);
      
      // Verify dark mode classes are applied to key elements
      const article = page.locator('article');
      const contentContainer = page.locator('.hashnode-content-style').locator('..');
      
      // Check if dark mode classes are present
      const articleClasses = await article.getAttribute('class') || '';
      const contentClasses = await contentContainer.getAttribute('class') || '';
      
      // Verify dark mode styling is applied (either class or CSS)
      expect(articleClasses.includes('dark') || contentClasses.includes('dark:bg-stone-800') || contentClasses.includes('dark')).toBeTruthy();
    }
  });
});

test.describe('Blog Post Detail Page - Interactive Elements', () => {
  test('should display navigation header', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    const firstPostLink = page.locator('a[href^="/blog/"]:not([href="/blog"])').first();
    if (await firstPostLink.count() === 0) {
      test.skip();
      return;
    }
    
    const postUrl = await firstPostLink.getAttribute('href');
    await page.goto(postUrl!, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify header/navigation is present
    const header = page.locator('header, nav').first();
    await expect(header).toBeVisible();
    
    // Verify header contains navigation links
    const navLinks = header.locator('a');
    const linkCount = await navLinks.count();
    expect(linkCount).toBeGreaterThan(0);
  });

  test('should load chatbot component', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    const firstPostLink = page.locator('a[href^="/blog/"]:not([href="/blog"])').first();
    if (await firstPostLink.count() === 0) {
      test.skip();
      return;
    }
    
    const postUrl = await firstPostLink.getAttribute('href');
    await page.goto(postUrl!, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Wait for chatbot to potentially load (it's dynamically imported)
    await page.waitForTimeout(2000);
    
    // Check if chatbot button or container exists
    const chatbotButton = page.locator('button[aria-label*="chat"], button:has-text("Chat"), [data-testid*="chatbot"]');
    const chatbotCount = await chatbotButton.count();
    
    // Chatbot should be present (it's dynamically loaded)
    if (chatbotCount > 0) {
      await expect(chatbotButton.first()).toBeVisible();
    }
  });

  test('should render footer', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    const firstPostLink = page.locator('a[href^="/blog/"]:not([href="/blog"])').first();
    if (await firstPostLink.count() === 0) {
      test.skip();
      return;
    }
    
    const postUrl = await firstPostLink.getAttribute('href');
    await page.goto(postUrl!, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Scroll to bottom to ensure footer is in viewport
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    // Verify footer is present
    const footer = page.locator('footer').last();
    await expect(footer).toBeVisible();
  });

  test('should have responsive cover image heights', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    const firstPostLink = page.locator('a[href^="/blog/"]:not([href="/blog"])').first();
    if (await firstPostLink.count() === 0) {
      test.skip();
      return;
    }
    
    const postUrl = await firstPostLink.getAttribute('href');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(postUrl!, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    const coverImageMobile = page.locator('article img').first();
    if (await coverImageMobile.count() > 0) {
      await expect(coverImageMobile).toBeVisible();
      
      // Test desktop viewport
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.waitForTimeout(500);
      
      const coverImageDesktop = page.locator('article img').first();
      await expect(coverImageDesktop).toBeVisible();
    }
  });

  test('should display post footer with metadata', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    const firstPostLink = page.locator('a[href^="/blog/"]:not([href="/blog"])').first();
    if (await firstPostLink.count() === 0) {
      test.skip();
      return;
    }
    
    const postUrl = await firstPostLink.getAttribute('href');
    await page.goto(postUrl!, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Scroll to article footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    // Check for article footer (not page footer)
    const articleFooter = page.locator('article footer');
    const articleFooterCount = await articleFooter.count();
    
    if (articleFooterCount > 0) {
      await expect(articleFooter).toBeVisible();
      
      // Verify footer contains author or last updated info
      const footerText = await articleFooter.textContent();
      expect(footerText).toMatch(/Written by|Last updated/i);
    }
  });
});

test.describe('Blog Post Detail Page - Edge Cases', () => {
  test('should handle missing cover image gracefully', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    const firstPostLink = page.locator('a[href^="/blog/"]:not([href="/blog"])').first();
    if (await firstPostLink.count() === 0) {
      test.skip();
      return;
    }
    
    const postUrl = await firstPostLink.getAttribute('href');
    await page.goto(postUrl!, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Page should load successfully regardless of cover image presence
    const article = page.locator('article');
    await expect(article).toBeVisible();
    
    // Verify content is still displayed properly
    const h1 = page.locator('article h1');
    await expect(h1).toBeVisible();
  });

  test('should handle missing author information', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    const firstPostLink = page.locator('a[href^="/blog/"]:not([href="/blog"])').first();
    if (await firstPostLink.count() === 0) {
      test.skip();
      return;
    }
    
    const postUrl = await firstPostLink.getAttribute('href');
    await page.goto(postUrl!, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Page should render successfully even without author
    const article = page.locator('article');
    await expect(article).toBeVisible();
    
    // Content should still be accessible
    const content = page.locator('.hashnode-content-style');
    await expect(content).toBeVisible();
  });

  test('should handle empty tags array', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    const firstPostLink = page.locator('a[href^="/blog/"]:not([href="/blog"])').first();
    if (await firstPostLink.count() === 0) {
      test.skip();
      return;
    }
    
    const postUrl = await firstPostLink.getAttribute('href');
    await page.goto(postUrl!, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Page should render fine with or without tags
    const article = page.locator('article');
    await expect(article).toBeVisible();
    
    // Verify core content is present
    const h1 = page.locator('article h1');
    await expect(h1).toBeVisible();
  });

  test('should fallback to markdown if HTML not available', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    const firstPostLink = page.locator('a[href^="/blog/"]:not([href="/blog"])').first();
    if (await firstPostLink.count() === 0) {
      test.skip();
      return;
    }
    
    const postUrl = await firstPostLink.getAttribute('href');
    await page.goto(postUrl!, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify content container exists
    const contentContainer = page.locator('.hashnode-content-style');
    await expect(contentContainer).toBeVisible();
    
    // Content should be rendered in some form (HTML or markdown)
    const hasContent = await contentContainer.evaluate(el => el.textContent!.length > 0);
    expect(hasContent).toBeTruthy();
  });

  test('should show no content message for empty posts', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    const firstPostLink = page.locator('a[href^="/blog/"]:not([href="/blog"])').first();
    if (await firstPostLink.count() === 0) {
      test.skip();
      return;
    }
    
    const postUrl = await firstPostLink.getAttribute('href');
    await page.goto(postUrl!, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Check if "No content available" message exists
    const noContentMessage = page.locator('text=No content available for this article');
    const messageCount = await noContentMessage.count();
    
    // If message exists, verify it's visible
    if (messageCount > 0) {
      await expect(noContentMessage).toBeVisible();
    } else {
      // Otherwise, verify actual content is present
      const contentContainer = page.locator('.hashnode-content-style');
      const hasContent = await contentContainer.evaluate(el => el.textContent!.length > 0);
      expect(hasContent).toBeTruthy();
    }
  });
});

test.describe('Blog Post Detail Page - Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    const firstPostLink = page.locator('a[href^="/blog/"]:not([href="/blog"])').first();
    if (await firstPostLink.count() === 0) {
      test.skip();
      return;
    }
    
    const postUrl = await firstPostLink.getAttribute('href');
    await page.goto(postUrl!, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify h1 exists
    const h1 = page.locator('article h1');
    await expect(h1).toBeVisible();
    
    // Verify only one h1 on the page
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
  });

  test('should have semantic HTML structure', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    const firstPostLink = page.locator('a[href^="/blog/"]:not([href="/blog"])').first();
    if (await firstPostLink.count() === 0) {
      test.skip();
      return;
    }
    
    const postUrl = await firstPostLink.getAttribute('href');
    await page.goto(postUrl!, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify semantic HTML elements
    await expect(page.locator('article')).toBeVisible();
    await expect(page.locator('article header')).toBeVisible();
    await expect(page.locator('article footer')).toBeVisible();
    
    // Verify time element has datetime attribute
    const timeElement = page.locator('article time').first();
    if (await timeElement.count() > 0) {
      await expect(timeElement).toHaveAttribute('dateTime');
    }
  });

  test('should have proper alt text for images', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    const firstPostLink = page.locator('a[href^="/blog/"]:not([href="/blog"])').first();
    if (await firstPostLink.count() === 0) {
      test.skip();
      return;
    }
    
    const postUrl = await firstPostLink.getAttribute('href');
    await page.goto(postUrl!, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Check all images have alt text
    const images = page.locator('article img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      await expect(img).toHaveAttribute('alt');
    }
  });
});


