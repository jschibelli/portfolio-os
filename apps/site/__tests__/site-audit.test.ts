import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { chromium, Browser, Page } from 'playwright';

describe('Site Audit - Link and Navigation Tests', () => {
  let browser: Browser;
  let page: Page;
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

  beforeAll(async () => {
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  describe('Main Navigation', () => {
    it('should have working homepage', async () => {
      await page.goto(baseUrl);
      await page.waitForLoadState('networkidle');
      
      const title = await page.title();
      expect(title).toContain('John Schibelli');
      
      // Check for main navigation elements
      const navLinks = await page.locator('nav a').all();
      expect(navLinks.length).toBeGreaterThan(0);
    });

    it('should have working projects page', async () => {
      await page.goto(`${baseUrl}/projects`);
      await page.waitForLoadState('networkidle');
      
      const title = await page.title();
      expect(title).toContain('Projects');
      
      // Check for project cards
      const projectCards = await page.locator('[data-testid="project-card"], .project-card').all();
      expect(projectCards.length).toBeGreaterThan(0);
    });

    it('should have working blog page', async () => {
      await page.goto(`${baseUrl}/blog`);
      await page.waitForLoadState('networkidle');
      
      const title = await page.title();
      expect(title).toContain('Blog');
    });

    it('should have working contact page', async () => {
      await page.goto(`${baseUrl}/contact`);
      await page.waitForLoadState('networkidle');
      
      const title = await page.title();
      expect(title).toContain('Contact');
    });
  });

  describe('Case Studies and Projects', () => {
    it('should display Tendril project on projects page', async () => {
      await page.goto(`${baseUrl}/projects`);
      await page.waitForLoadState('networkidle');
      
      // Look for Tendril project
      const tendrilProject = page.locator('text=Tendril');
      await expect(tendrilProject).toBeVisible();
    });

    it('should have working Tendril project detail page', async () => {
      await page.goto(`${baseUrl}/projects/tendrilo`);
      await page.waitForLoadState('networkidle');
      
      const title = await page.title();
      expect(title).toContain('Tendril');
      
      // Check for case study link
      const caseStudyLink = page.locator('a[href*="case-study"]');
      if (await caseStudyLink.count() > 0) {
        const href = await caseStudyLink.first().getAttribute('href');
        expect(href).toBeTruthy();
      }
    });

    it('should have working case studies page', async () => {
      await page.goto(`${baseUrl}/case-studies`);
      await page.waitForLoadState('networkidle');
      
      const title = await page.title();
      expect(title).toContain('Case Studies');
    });

    it('should have working Tendril case study page', async () => {
      await page.goto(`${baseUrl}/case-studies/tendrilo-case-study`);
      await page.waitForLoadState('networkidle');
      
      const title = await page.title();
      expect(title).toContain('Tendril');
    });
  });

  describe('Internal Link Validation', () => {
    it('should validate all internal links on homepage', async () => {
      await page.goto(baseUrl);
      await page.waitForLoadState('networkidle');
      
      const links = await page.locator('a[href^="/"]').all();
      const brokenLinks: string[] = [];
      
      for (const link of links) {
        const href = await link.getAttribute('href');
        if (href) {
          try {
            const response = await page.goto(`${baseUrl}${href}`);
            if (response && response.status() >= 400) {
              brokenLinks.push(`${href} (${response.status()})`);
            }
          } catch (error) {
            brokenLinks.push(`${href} (error: ${error})`);
          }
        }
      }
      
      expect(brokenLinks).toEqual([]);
    });

    it('should validate all internal links on projects page', async () => {
      await page.goto(`${baseUrl}/projects`);
      await page.waitForLoadState('networkidle');
      
      const links = await page.locator('a[href^="/"]').all();
      const brokenLinks: string[] = [];
      
      for (const link of links) {
        const href = await link.getAttribute('href');
        if (href) {
          try {
            const response = await page.goto(`${baseUrl}${href}`);
            if (response && response.status() >= 400) {
              brokenLinks.push(`${href} (${response.status()})`);
            }
          } catch (error) {
            brokenLinks.push(`${href} (error: ${error})`);
          }
        }
      }
      
      expect(brokenLinks).toEqual([]);
    });
  });

  describe('Navigation Consistency', () => {
    it('should have consistent navigation across all pages', async () => {
      const pages = ['/', '/projects', '/blog', '/contact'];
      
      for (const pagePath of pages) {
        await page.goto(`${baseUrl}${pagePath}`);
        await page.waitForLoadState('networkidle');
        
        // Check for main navigation
        const nav = page.locator('nav');
        await expect(nav).toBeVisible();
        
        // Check for footer
        const footer = page.locator('footer');
        await expect(footer).toBeVisible();
      }
    });
  });

  describe('SEO and Meta Tags', () => {
    it('should have proper meta tags on all pages', async () => {
      const pages = ['/', '/projects', '/blog', '/contact'];
      
      for (const pagePath of pages) {
        await page.goto(`${baseUrl}${pagePath}`);
        await page.waitForLoadState('networkidle');
        
        const title = await page.title();
        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(10);
        
        const description = await page.locator('meta[name="description"]').getAttribute('content');
        expect(description).toBeTruthy();
      }
    });
  });

  describe('Case Study Integration', () => {
    it('should have case study links in project cards', async () => {
      await page.goto(`${baseUrl}/projects`);
      await page.waitForLoadState('networkidle');
      
      const projectCards = await page.locator('[data-testid="project-card"], .project-card').all();
      
      for (const card of projectCards) {
        const caseStudyLink = card.locator('a[href*="case-study"]');
        if (await caseStudyLink.count() > 0) {
          const href = await caseStudyLink.first().getAttribute('href');
          expect(href).toBeTruthy();
          
          // Test the case study link
          if (href) {
            const response = await page.goto(`${baseUrl}${href}`);
            expect(response?.status()).toBeLessThan(400);
          }
        }
      }
    });
  });
});
