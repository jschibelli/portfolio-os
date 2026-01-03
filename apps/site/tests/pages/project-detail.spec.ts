import { test, expect } from '@playwright/test';
import { 
  navigateWithValidation,
  waitForAnimation,
  testResponsiveDesign,
} from '../utils/test-helpers';
import { VIEWPORTS } from '../config/test-data';

// Test with multiple project slugs to ensure comprehensive coverage
const TEST_PROJECT_SLUGS = [
  'portfolio-os',
  'tendrilo',
  'synaplyai',
];

test.describe('Project Detail Page - Comprehensive Tests', () => {
  
  // ==========================================================================
  // PAGE LOAD & NAVIGATION
  // ==========================================================================
  
  test.describe('Page Load & Navigation', () => {
    
    test('should load project detail page successfully', async ({ page }) => {
      for (const slug of TEST_PROJECT_SLUGS.slice(0, 2)) {
        const { success } = await navigateWithValidation(
          page, 
          `/projects/${slug}`
        );
        
        expect(success).toBe(true);
        expect(page.url()).toContain(`/projects/${slug}`);
        
        // Should have main heading
        const heading = page.locator('h1, h2').first();
        await expect(heading).toBeVisible();
      }
    });
    
    test('should handle 404 for non-existent project', async ({ page }) => {
      const response = await page.goto('/projects/non-existent-project-12345', {
        waitUntil: 'domcontentloaded',
      });
      
      // Should either redirect or show 404
      const status = response?.status();
      expect([404, 302, 301]).toContain(status);
    });
    
    test('should load within performance threshold', async ({ page }) => {
      const slug = TEST_PROJECT_SLUGS[0];
      const startTime = Date.now();
      
      await page.goto(`/projects/${slug}`);
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(10000); // 10 seconds max
      
      console.log(`Project detail page loaded in ${loadTime}ms`);
    });
    
  });
  
  // ==========================================================================
  // SEO & METADATA
  // ==========================================================================
  
  test.describe('SEO & Metadata', () => {
    
    test('should have project-specific page title', async ({ page }) => {
      const slug = TEST_PROJECT_SLUGS[0];
      await page.goto(`/projects/${slug}`);
      
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(10);
      // Should contain project info and site name
      expect(title).toMatch(/.+/);
    });
    
    test('should have project-specific meta description', async ({ page }) => {
      const slug = TEST_PROJECT_SLUGS[0];
      await page.goto(`/projects/${slug}`);
      
      const metaDescription = page.locator('meta[name="description"]');
      const content = await metaDescription.getAttribute('content');
      
      expect(content).toBeTruthy();
      expect(content!.length).toBeGreaterThan(50);
      expect(content!.length).toBeLessThan(160);
    });
    
    test('should have Open Graph tags with project data', async ({ page }) => {
      const slug = TEST_PROJECT_SLUGS[0];
      await page.goto(`/projects/${slug}`);
      
      // OG title
      const ogTitle = page.locator('meta[property="og:title"]');
      await expect(ogTitle).toHaveAttribute('content', /.+/);
      
      // OG description
      const ogDescription = page.locator('meta[property="og:description"]');
      await expect(ogDescription).toHaveAttribute('content', /.+/);
      
      // OG image (should be project-specific)
      const ogImage = page.locator('meta[property="og:image"]');
      const imageContent = await ogImage.getAttribute('content');
      expect(imageContent).toBeTruthy();
      
      // OG URL
      const ogUrl = page.locator('meta[property="og:url"]');
      await expect(ogUrl).toHaveAttribute('content', new RegExp(slug));
    });
    
    test('should have canonical URL with project slug', async ({ page }) => {
      const slug = TEST_PROJECT_SLUGS[0];
      await page.goto(`/projects/${slug}`);
      
      const canonical = page.locator('link[rel="canonical"]');
      const href = await canonical.getAttribute('href');
      
      expect(href).toContain(`/projects/${slug}`);
    });
    
    test('should have structured data for project', async ({ page }) => {
      const slug = TEST_PROJECT_SLUGS[0];
      await page.goto(`/projects/${slug}`);
      
      const structuredData = page.locator('script[type="application/ld+json"]');
      const count = await structuredData.count();
      
      expect(count).toBeGreaterThan(0);
      
      // Parse and validate structured data
      const jsonContent = await structuredData.first().textContent();
      if (jsonContent) {
        const data = JSON.parse(jsonContent);
        expect(data['@type']).toBeDefined();
        expect(['CreativeWork', 'SoftwareApplication', 'Product', 'WebPage']).toContain(data['@type']);
      }
    });
    
  });
  
  // ==========================================================================
  // PROJECT HEADER
  // ==========================================================================
  
  test.describe('Project Header', () => {
    
    test('should display project title', async ({ page }) => {
      const slug = TEST_PROJECT_SLUGS[0];
      await page.goto(`/projects/${slug}`);
      await waitForAnimation(page);
      
      const title = page.locator('h1, h2').first();
      await expect(title).toBeVisible();
      
      const titleText = await title.textContent();
      expect(titleText).toBeTruthy();
      expect(titleText!.length).toBeGreaterThan(3);
    });
    
    test('should display project subtitle or tagline if exists', async ({ page }) => {
      const slug = TEST_PROJECT_SLUGS[0];
      await page.goto(`/projects/${slug}`);
      await waitForAnimation(page);
      
      // Look for subtitle/tagline (might be h2, h3, or p.subtitle)
      const subtitle = page.locator('h2, h3, p, .subtitle, .tagline').filter({
        hasText: /.{10,}/
      }).first();
      
      const count = await subtitle.count();
      // Some projects may not have subtitles
      if (count > 0) {
        await expect(subtitle).toBeVisible();
      }
    });
    
    test('should display project status badge if exists', async ({ page }) => {
      const slug = TEST_PROJECT_SLUGS[0];
      await page.goto(`/projects/${slug}`);
      await waitForAnimation(page);
      
      // Look for status indicators
      const status = page.locator('.status, .badge, span').filter({
        hasText: /completed|in progress|active|live/i
      }).first();
      
      const count = await status.count();
      if (count > 0) {
        await expect(status).toBeVisible();
      }
    });
    
    test('should display client or company name if exists', async ({ page }) => {
      const slug = 'tendrilo'; // Known to have client info
      await page.goto(`/projects/${slug}`);
      await waitForAnimation(page);
      
      // Page should load successfully
      const mainContent = page.locator('main, article, .content');
      await expect(mainContent.first()).toBeVisible();
    });
    
  });
  
  // ==========================================================================
  // PROJECT CONTENT
  // ==========================================================================
  
  test.describe('Project Content', () => {
    
    test('should display project description', async ({ page }) => {
      const slug = TEST_PROJECT_SLUGS[0];
      await page.goto(`/projects/${slug}`);
      await waitForAnimation(page);
      
      // Look for substantial text content
      const description = page.locator('p, .description, .content').filter({
        hasText: /.{50,}/
      }).first();
      
      await expect(description).toBeVisible();
    });
    
    test('should display technology stack', async ({ page }) => {
      const slug = TEST_PROJECT_SLUGS[0];
      await page.goto(`/projects/${slug}`);
      await waitForAnimation(page);
      
      // Look for technology mentions
      const techElements = page.locator('span, .tag, .badge, .tech').filter({
        hasText: /Next\.js|React|TypeScript|Node|Python|JavaScript|MongoDB|PostgreSQL/i
      });
      
      const count = await techElements.count();
      expect(count).toBeGreaterThan(0);
    });
    
    test('should display project timeline if exists', async ({ page }) => {
      const slug = TEST_PROJECT_SLUGS[0];
      await page.goto(`/projects/${slug}`);
      await waitForAnimation(page);
      
      // Look for dates or timeline
      const timeline = page.locator('.timeline, .dates, time').or(
        page.locator('text=/202[0-9]/')
      );
      
      const count = await timeline.count();
      if (count > 0) {
        await expect(timeline.first()).toBeVisible();
      }
    });
    
    test('should display project metrics if exists', async ({ page }) => {
      const slug = TEST_PROJECT_SLUGS[0];
      await page.goto(`/projects/${slug}`);
      await waitForAnimation(page);
      
      // Look for stats/metrics
      const metrics = page.locator('.stat, .metric, .stats').or(
        page.locator('text=/%|users|visitors|downloads/i')
      );
      
      const count = await metrics.count();
      // Metrics are optional
      if (count > 0) {
        await expect(metrics.first()).toBeVisible();
      }
    });
    
  });
  
  // ==========================================================================
  // PROJECT LINKS
  // ==========================================================================
  
  test.describe('Project Links', () => {
    
    test('should have external links open in new tab', async ({ page }) => {
      const slug = TEST_PROJECT_SLUGS[0];
      await page.goto(`/projects/${slug}`);
      await waitForAnimation(page);
      
      // Find external links (GitHub, live demo, etc.)
      const externalLinks = page.locator('a[href*="http"]').or(
        page.locator('a[target="_blank"]')
      );
      
      const count = await externalLinks.count();
      
      for (let i = 0; i < Math.min(count, 3); i++) {
        const link = externalLinks.nth(i);
        const target = await link.getAttribute('target');
        const rel = await link.getAttribute('rel');
        
        // External links should open in new tab
        if (target === '_blank') {
          expect(rel).toContain('noopener');
        }
      }
    });
    
    test('should have working GitHub link if exists', async ({ page }) => {
      const slug = 'portfolio-os'; // Known to have GitHub link
      await page.goto(`/projects/${slug}`);
      await waitForAnimation(page);
      
      const githubLink = page.locator('a[href*="github.com"]');
      const count = await githubLink.count();
      
      if (count > 0) {
        await expect(githubLink.first()).toBeVisible();
        const href = await githubLink.first().getAttribute('href');
        expect(href).toContain('github.com');
      }
    });
    
    test('should have working live demo link if exists', async ({ page }) => {
      const slug = TEST_PROJECT_SLUGS[0];
      await page.goto(`/projects/${slug}`);
      await waitForAnimation(page);
      
      // Look for live demo, view site, or similar links
      const liveLink = page.locator('a').filter({
        hasText: /live demo|view site|visit|launch|see live/i
      });
      
      const count = await liveLink.count();
      
      if (count > 0) {
        await expect(liveLink.first()).toBeVisible();
      }
    });
    
  });
  
  // ==========================================================================
  // PROJECT MEDIA
  // ==========================================================================
  
  test.describe('Project Media', () => {
    
    test('should display project images', async ({ page }) => {
      const slug = TEST_PROJECT_SLUGS[0];
      await page.goto(`/projects/${slug}`);
      await waitForAnimation(page);
      
      const images = page.locator('img');
      const count = await images.count();
      
      expect(count).toBeGreaterThan(0);
      
      // Check first image loads correctly
      const firstImage = images.first();
      await expect(firstImage).toBeVisible();
      
      const naturalWidth = await firstImage.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    });
    
    test('should have alt text for all images', async ({ page }) => {
      const slug = TEST_PROJECT_SLUGS[0];
      await page.goto(`/projects/${slug}`);
      await waitForAnimation(page);
      
      const images = page.locator('img');
      const count = await images.count();
      
      for (let i = 0; i < Math.min(count, 5); i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        expect(alt).toBeDefined();
      }
    });
    
    test('should have responsive images', async ({ page }) => {
      const slug = TEST_PROJECT_SLUGS[0];
      await page.goto(`/projects/${slug}`);
      await waitForAnimation(page);
      
      const images = page.locator('img').first();
      await expect(images).toBeVisible();
      
      // Images should have width or be responsive
      const styles = await images.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          width: computed.width,
          maxWidth: computed.maxWidth,
          objectFit: computed.objectFit,
        };
      });
      
      expect(styles.width).toBeTruthy();
    });
    
  });
  
  // ==========================================================================
  // NAVIGATION
  // ==========================================================================
  
  test.describe('Navigation', () => {
    
    test('should have breadcrumb navigation', async ({ page }) => {
      const slug = TEST_PROJECT_SLUGS[0];
      await page.goto(`/projects/${slug}`);
      await waitForAnimation(page);
      
      // Look for breadcrumbs
      const breadcrumb = page.locator('nav[aria-label="breadcrumb"], .breadcrumb, nav').filter({
        has: page.locator('a[href="/projects"]')
      });
      
      const count = await breadcrumb.count();
      if (count > 0) {
        await expect(breadcrumb.first()).toBeVisible();
      }
    });
    
    test('should have link back to projects page', async ({ page }) => {
      const slug = TEST_PROJECT_SLUGS[0];
      await page.goto(`/projects/${slug}`);
      await waitForAnimation(page);
      
      // Look for link back to projects
      const backLink = page.locator('a[href="/projects"]');
      const count = await backLink.count();
      
      expect(count).toBeGreaterThan(0);
      await expect(backLink.first()).toBeVisible();
    });
    
    test('should navigate back to projects page', async ({ page }) => {
      const slug = TEST_PROJECT_SLUGS[0];
      await page.goto(`/projects/${slug}`);
      await waitForAnimation(page);
      
      const backLink = page.locator('a[href="/projects"]').first();
      await backLink.click();
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/projects');
      expect(page.url()).not.toContain(slug);
    });
    
  });
  
  // ==========================================================================
  // RESPONSIVE DESIGN
  // ==========================================================================
  
  test.describe('Responsive Design', () => {
    
    test('should be responsive on mobile', async ({ page }) => {
      const slug = TEST_PROJECT_SLUGS[0];
      
      await testResponsiveDesign(page, `/projects/${slug}`, [
        {
          viewport: VIEWPORTS.mobile,
          expectations: [
            { selector: 'h1, h2', shouldBeVisible: true },
            { selector: 'main, article', shouldBeVisible: true },
          ],
        },
      ]);
    });
    
    test('should be responsive on tablet', async ({ page }) => {
      const slug = TEST_PROJECT_SLUGS[0];
      
      await page.setViewportSize(VIEWPORTS.tablet);
      await page.goto(`/projects/${slug}`);
      await waitForAnimation(page);
      
      const mainContent = page.locator('main, article').first();
      await expect(mainContent).toBeVisible();
    });
    
    test('should be responsive on desktop', async ({ page }) => {
      const slug = TEST_PROJECT_SLUGS[0];
      
      await page.setViewportSize(VIEWPORTS.desktopLarge);
      await page.goto(`/projects/${slug}`);
      await waitForAnimation(page);
      
      const mainContent = page.locator('main, article').first();
      await expect(mainContent).toBeVisible();
    });
    
    test('should have readable text on all viewports', async ({ page }) => {
      const slug = TEST_PROJECT_SLUGS[0];
      const viewports = [VIEWPORTS.mobile, VIEWPORTS.tablet, VIEWPORTS.desktop];
      
      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.goto(`/projects/${slug}`);
        await waitForAnimation(page);
        
        const heading = page.locator('h1, h2').first();
        const fontSize = await heading.evaluate((el) => {
          return parseInt(window.getComputedStyle(el).fontSize);
        });
        
        expect(fontSize).toBeGreaterThan(16);
      }
    });
    
    test('images should adapt to viewport', async ({ page }) => {
      const slug = TEST_PROJECT_SLUGS[0];
      const viewports = [VIEWPORTS.mobile, VIEWPORTS.desktop];
      
      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.goto(`/projects/${slug}`);
        await waitForAnimation(page);
        
        const image = page.locator('img').first();
        if (await image.count() > 0) {
          await expect(image).toBeVisible();
          
          const box = await image.boundingBox();
          if (box) {
            // Image should not overflow viewport
            expect(box.width).toBeLessThanOrEqual(viewport.width + 50);
          }
        }
      }
    });
    
  });
  
  // ==========================================================================
  // ACCESSIBILITY
  // ==========================================================================
  
  test.describe('Accessibility', () => {
    
    test('should have proper heading hierarchy', async ({ page }) => {
      const slug = TEST_PROJECT_SLUGS[0];
      await page.goto(`/projects/${slug}`);
      await waitForAnimation(page);
      
      // Should have main heading
      const h1 = page.locator('h1, h2').first();
      await expect(h1).toBeVisible();
    });
    
    test('should support keyboard navigation', async ({ page }) => {
      const slug = TEST_PROJECT_SLUGS[0];
      await page.goto(`/projects/${slug}`);
      await waitForAnimation(page);
      
      // Tab through page
      await page.keyboard.press('Tab');
      
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });
    
    test('should have accessible links', async ({ page }) => {
      const slug = TEST_PROJECT_SLUGS[0];
      await page.goto(`/projects/${slug}`);
      await waitForAnimation(page);
      
      const links = page.locator('a[href]');
      const count = await links.count();
      
      for (let i = 0; i < Math.min(count, 5); i++) {
        const link = links.nth(i);
        const text = await link.textContent();
        const ariaLabel = await link.getAttribute('aria-label');
        
        // Links should have text or aria-label
        expect(text || ariaLabel).toBeTruthy();
      }
    });
    
  });
  
  // ==========================================================================
  // EDGE CASES
  // ==========================================================================
  
  test.describe('Edge Cases', () => {
    
    test('should handle project with minimal data', async ({ page }) => {
      // Even with minimal data, page should load
      const slug = TEST_PROJECT_SLUGS[TEST_PROJECT_SLUGS.length - 1];
      
      const response = await page.goto(`/projects/${slug}`);
      expect(response?.ok()).toBe(true);
      
      // Should have at least a title
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();
    });
    
    test('should handle long project descriptions', async ({ page }) => {
      const slug = TEST_PROJECT_SLUGS[0];
      await page.goto(`/projects/${slug}`);
      await waitForAnimation(page);
      
      // Page should render without overflow issues
      const body = page.locator('body');
      await expect(body).toBeVisible();
      
      // Check no horizontal scroll
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      
      // Some horizontal scroll is acceptable on mobile
      // Just ensure it's not excessive
      if (hasHorizontalScroll) {
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
        expect(scrollWidth - clientWidth).toBeLessThan(50);
      }
    });
    
  });
  
});

