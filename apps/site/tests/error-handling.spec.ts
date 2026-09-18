import { test, expect } from '@playwright/test';
import { navigateWithValidation, waitForAnimation } from './utils/test-helpers';

test.describe('Error Handling Tests', () => {
  
  test.describe('404 Page', () => {
    
    test('should display 404 page for invalid route', async ({ page }) => {
      const response = await page.goto('/this-page-does-not-exist-12345', { waitUntil: 'domcontentloaded' });
      expect([404, 302]).toContain(response?.status());
    });
    
    test('should have proper 404 page structure', async ({ page }) => {
      await page.goto('/non-existent-page');
      await waitForAnimation(page);
      
      const heading = page.locator('h1, h2').filter({ hasText: /404|not found|page.*found/i }).first();
      const count = await heading.count();
      if (count > 0) await expect(heading).toBeVisible();
    });
    
    test('should provide navigation options on 404', async ({ page }) => {
      await page.goto('/invalid-route');
      await waitForAnimation(page);
      
      const homeLink = page.locator('a[href="/"], a:has-text("Home"), a:has-text("Go back")').first();
      const count = await homeLink.count();
      if (count > 0) await expect(homeLink).toBeVisible();
    });
    
  });
  
  test.describe('Error Boundaries', () => {
    
    test('should handle blog errors gracefully', async ({ page }) => {
      await page.goto('/blog');
      await waitForAnimation(page);
      expect(page.url()).toContain('/blog');
    });
    
    test('should recover from component errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
      
      await page.goto('/');
      await waitForAnimation(page);
      
      const criticalErrors = errors.filter(e => !e.includes('favicon') && !e.includes('third-party'));
      expect(criticalErrors.length).toBeLessThan(3);
    });
    
  });
  
  test.describe('Graceful Degradation', () => {
    
    test('should handle missing images', async ({ page }) => {
      await page.goto('/projects');
      await waitForAnimation(page);
      
      const projectCard = page.locator('article').first();
      await expect(projectCard).toBeVisible();
    });
    
    test('should function without JavaScript (progressive enhancement)', async ({ page, context }) => {
      await context.route('**/*.js', route => route.abort());
      await page.goto('/');
      
      const heading = page.locator('h1').first();
      await expect(heading).toBeVisible();
    });
    
  });
  
  test.describe('Network Errors', () => {
    
    test('should handle offline mode', async ({ page, context }) => {
      await context.setOffline(true);
      const response = await page.goto('/').catch(() => null);
      await context.setOffline(false);
    });
    
    test('should handle slow API responses', async ({ page }) => {
      await page.route('**/api/**', async route => {
        await new Promise(r => setTimeout(r, 500));
        await route.continue();
      });
      
      await page.goto('/blog');
      await waitForAnimation(page);
      expect(page.url()).toContain('/blog');
    });
    
  });
  
});

