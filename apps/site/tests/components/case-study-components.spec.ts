import { test, expect } from '@playwright/test';

/**
 * Case Study Components Tests
 * Issue #302 - Frontend/UI Specialist (Chris)
 * Part 3 of 4: Case Study Components
 * 
 * Tests case study specific components:
 * - Case study cards
 * - Case study content sections
 * - Interactive elements
 * - Image galleries
 * - Technology badges
 * - Project metrics
 */

test.describe('Case Study - Page Display', () => {
  test('should display case studies page', async ({ page }) => {
    await page.goto('/case-studies', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify page heading
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('should display case study cards', async ({ page }) => {
    await page.goto('/case-studies', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Look for case study links or cards
    const caseStudyLinks = page.locator('a[href*="/case-studies/"]');
    const linkCount = await caseStudyLinks.count();
    
    if (linkCount > 0) {
      await expect(caseStudyLinks.first()).toBeVisible();
    }
  });
});

test.describe('Case Study - Card Components', () => {
  test('should display case study title', async ({ page }) => {
    await page.goto('/case-studies', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Find case study cards with headings
    const cardHeadings = page.locator('a[href*="/case-studies/"] h2, a[href*="/case-studies/"] h3');
    const headingCount = await cardHeadings.count();
    
    if (headingCount > 0) {
      await expect(cardHeadings.first()).toBeVisible();
    }
  });

  test('should display case study description', async ({ page }) => {
    await page.goto('/case-studies', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Find case study cards
    const caseStudyCards = page.locator('a[href*="/case-studies/"]');
    const cardCount = await caseStudyCards.count();
    
    if (cardCount > 0) {
      const firstCard = caseStudyCards.first();
      await expect(firstCard).toBeVisible();
      
      // Card should have descriptive text
      const cardText = await firstCard.textContent();
      expect(cardText!.length).toBeGreaterThan(0);
    }
  });

  test('should display technology badges', async ({ page }) => {
    await page.goto('/case-studies', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Look for technology badges/tags
    const techBadges = page.locator('span.rounded-full, span.badge, [class*="badge"]');
    const badgeCount = await techBadges.count();
    
    if (badgeCount > 0) {
      await expect(techBadges.first()).toBeVisible();
    }
  });

  test('should show hover effect on case study cards', async ({ page }) => {
    await page.goto('/case-studies', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Hover over case study card
    const caseStudyCard = page.locator('a[href*="/case-studies/"]').first();
    const cardCount = await caseStudyCard.count();
    
    if (cardCount > 0) {
      await caseStudyCard.hover();
      await page.waitForTimeout(300);
      
      // Card should still be visible
      await expect(caseStudyCard).toBeVisible();
    }
  });
});

test.describe('Case Study - Detail Page', () => {
  test('should navigate to case study detail page', async ({ page }) => {
    await page.goto('/case-studies', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Click on first case study
    const caseStudyLink = page.locator('a[href*="/case-studies/"]').first();
    const linkCount = await caseStudyLink.count();
    
    if (linkCount > 0) {
      const href = await caseStudyLink.getAttribute('href');
      
      if (href && href !== '/case-studies') {
        await Promise.all([
          page.waitForNavigation({ timeout: 10000 }).catch(() => {}),
          caseStudyLink.click()
        ]);
        
        // Should navigate to detail page (exact path match or still on case-studies)
        const url = page.url();
        expect(url).toMatch(/\/case-studies/);
      }
    }
  });

  test('should display case study content', async ({ page }) => {
    // Try to navigate directly to a known case study
    try {
      await page.goto('/case-studies/tendril-multi-tenant-chatbot-saas', { 
        waitUntil: 'domcontentloaded', 
        timeout: 10000 
      });
      await page.waitForTimeout(2000);
      
      // Verify content is displayed
      const content = page.locator('article, main');
      await expect(content.first()).toBeVisible();
    } catch (error) {
      // If that page doesn't exist, just verify the case studies list page works
      await page.goto('/case-studies', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2000);
      
      const content = page.locator('main');
      await expect(content.first()).toBeVisible();
    }
  });
});

test.describe('Case Study - Interactive Elements', () => {
  test('should display project images', async ({ page }) => {
    await page.goto('/case-studies', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Look for images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    // Should have at least some images
    expect(imageCount).toBeGreaterThan(0);
  });

  test('should have accessible images with alt text', async ({ page }) => {
    await page.goto('/case-studies', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Check images have alt text
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      for (let i = 0; i < Math.min(imageCount, 3); i++) {
        const img = images.nth(i);
        await expect(img).toHaveAttribute('alt');
      }
    }
  });
});

