import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test.describe('Blog Page Accessibility', () => {
  test('blog page should be accessible', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Wait for page to load
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    // Run basic accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    // Check for critical violations (excluding color contrast for now)
    const criticalViolations = accessibilityScanResults.violations.filter(
      violation => (violation.impact === 'critical' || violation.impact === 'serious') 
        && violation.id !== 'color-contrast' // Temporarily exclude color contrast issues
    );
    
    expect(criticalViolations).toEqual([]);
    
    // Log any violations for review
    if (accessibilityScanResults.violations.length > 0) {
      console.log('Accessibility violations found:', accessibilityScanResults.violations);
    }
  });

  test('blog page should have proper heading structure', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Check for h1
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    
    // Check for h2 headings
    const h2s = page.locator('h2');
    const h2Count = await h2s.count();
    expect(h2Count).toBeGreaterThanOrEqual(1);
    
    // Check for h3 headings in post cards
    const h3s = page.locator('h3');
    const h3Count = await h3s.count();
    expect(h3Count).toBeGreaterThanOrEqual(1);
  });

  test('blog page should have proper ARIA labels', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Check for navigation landmark
    const nav = page.locator('nav[role="navigation"]');
    const navCount = await nav.count();
    expect(navCount).toBeGreaterThanOrEqual(1);
    
    // Check for main landmark
    const main = page.locator('main[role="main"]');
    const mainCount = await main.count();
    expect(mainCount).toBeGreaterThanOrEqual(1);
    
    // Check for social media links with proper labels
    const socialLinks = page.locator('a[aria-label*="external website"]');
    const socialLinksCount = await socialLinks.count();
    expect(socialLinksCount).toBeGreaterThanOrEqual(1);
  });

  test('blog page should be keyboard navigable', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check that focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });
});
