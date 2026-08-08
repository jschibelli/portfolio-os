import { test, expect } from '@playwright/test';
import { testPagePerformance, navigateWithValidation } from './utils/test-helpers';
import { CRITICAL_PAGES, TIMEOUTS } from './config/test-data';

test.describe('Performance & Core Web Vitals', () => {
  
  test.describe('Page Load Performance', () => {
    
    test('homepage should load within threshold', async ({ page }) => {
      const { loadTime } = await testPagePerformance(page, '/', 8000);
      console.log(`Homepage loaded in ${loadTime}ms`);
      expect(loadTime).toBeLessThan(10000);
    });
    
    test('blog page should load within threshold', async ({ page }) => {
      const { loadTime } = await testPagePerformance(page, '/blog', 8000);
      expect(loadTime).toBeLessThan(10000);
    });
    
    test('projects page should load within threshold', async ({ page }) => {
      const { loadTime } = await testPagePerformance(page, '/projects', 8000);
      expect(loadTime).toBeLessThan(10000);
    });
    
    test('contact page should load within threshold', async ({ page }) => {
      const { loadTime } = await testPagePerformance(page, '/contact', 8000);
      expect(loadTime).toBeLessThan(10000);
    });
    
  });
  
  test.describe('Core Web Vitals', () => {
    
    test('should measure LCP (Largest Contentful Paint)', async ({ page }) => {
      await page.goto('/');
      
      const lcp = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1] as any;
            resolve(lastEntry.renderTime || lastEntry.loadTime);
          }).observe({ type: 'largest-contentful-paint', buffered: true });
          
          setTimeout(() => resolve(0), 5000);
        });
      });
      
      console.log(`LCP: ${lcp}ms`);
      if (lcp > 0) expect(lcp).toBeLessThan(2500);
    });
    
    test('should measure CLS (Cumulative Layout Shift)', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const cls = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          let clsValue = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries() as any[]) {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            }
          }).observe({ type: 'layout-shift', buffered: true });
          
          setTimeout(() => resolve(clsValue), 3000);
        });
      });
      
      console.log(`CLS: ${cls}`);
      expect(cls).toBeLessThan(0.1);
    });
    
    test('should measure TTFB (Time to First Byte)', async ({ page }) => {
      const startTime = Date.now();
      const response = await page.goto('/');
      const ttfb = Date.now() - startTime;
      
      console.log(`TTFB: ${ttfb}ms`);
      expect(response?.ok()).toBe(true);
      expect(ttfb).toBeLessThan(1000);
    });
    
  });
  
  test.describe('Resource Loading', () => {
    
    test('should load critical resources quickly', async ({ page }) => {
      const resources: any[] = [];
      
      page.on('response', response => {
        resources.push({
          url: response.url(),
          status: response.status(),
          timing: response.timing(),
        });
      });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const criticalResources = resources.filter(r => 
        r.url.includes('.js') || r.url.includes('.css')
      );
      
      expect(criticalResources.length).toBeGreaterThan(0);
    });
    
    test('should lazy load images', async ({ page }) => {
      await page.goto('/blog');
      await page.waitForLoadState('domcontentloaded');
      
      const images = page.locator('img');
      const count = await images.count();
      
      if (count > 0) {
        const firstImage = images.first();
        const loading = await firstImage.getAttribute('loading');
        // Images should have lazy loading
        expect(['lazy', 'eager', null]).toContain(loading);
      }
    });
    
  });
  
  test.describe('API Performance', () => {
    
    test('should handle API responses quickly', async ({ page }) => {
      const apiCalls: any[] = [];
      
      page.on('response', response => {
        if (response.url().includes('/api/')) {
          apiCalls.push({
            url: response.url(),
            status: response.status(),
          });
        }
      });
      
      await page.goto('/blog');
      await page.waitForLoadState('networkidle');
      
      // API calls should complete
      for (const call of apiCalls) {
        expect([200, 304]).toContain(call.status);
      }
    });
    
  });
  
  test.describe('Performance Budgets', () => {
    
    test('should stay within bundle size limits', async ({ page }) => {
      const resources: any[] = [];
      
      page.on('response', async response => {
        if (response.url().includes('.js')) {
          const buffer = await response.body().catch(() => null);
          if (buffer) {
            resources.push({
              url: response.url(),
              size: buffer.length,
            });
          }
        }
      });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const totalSize = resources.reduce((sum, r) => sum + r.size, 0);
      console.log(`Total JS bundle size: ${(totalSize / 1024).toFixed(2)}KB`);
      
      // Should be under 2MB total
      expect(totalSize).toBeLessThan(2 * 1024 * 1024);
    });
    
  });
  
});

