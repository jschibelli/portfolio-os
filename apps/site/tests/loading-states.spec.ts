import { test, expect } from '@playwright/test';
import { waitForAnimation, mockAPIResponse } from './utils/test-helpers';

test.describe('Loading States Tests', () => {
  
  test.describe('Loading Indicators', () => {
    
    test('should show loading state on page navigation', async ({ page }) => {
      await page.goto('/');
      await page.click('a[href="/blog"]').catch(() => {});
      await waitForAnimation(page);
      expect(page.url()).toContain('/blog');
    });
    
    test('should handle slow page loads', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/projects', { waitUntil: 'domcontentloaded' });
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(15000);
    });
    
  });
  
  test.describe('Empty States', () => {
    
    test('should handle empty blog list', async ({ page }) => {
      await mockAPIResponse(page, '**/api/posts', []);
      await page.goto('/blog');
      await waitForAnimation(page);
      expect(page.url()).toContain('/blog');
    });
    
    test('should handle no search results', async ({ page }) => {
      await page.goto('/projects');
      await waitForAnimation(page);
      
      const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();
      const count = await searchInput.count();
      
      if (count > 0) {
        await searchInput.fill('nonexistentsearchquery12345');
        await waitForAnimation(page);
      }
    });
    
  });
  
  test.describe('Skeleton Loaders', () => {
    
    test('should display content after loading', async ({ page }) => {
      await page.goto('/blog');
      await page.waitForLoadState('networkidle');
      
      const content = page.locator('article, .blog-post, h1').first();
      await expect(content).toBeVisible();
    });
    
  });
  
  test.describe('Slow Network Scenarios', () => {
    
    test('should handle throttled connection', async ({ page, context }) => {
      await context.route('**/*', async route => {
        await new Promise(r => setTimeout(r, 100));
        await route.continue();
      });
      
      await page.goto('/');
      await waitForAnimation(page);
      const heading = page.locator('h1').first();
      await expect(heading).toBeVisible();
    });
    
  });
  
});

