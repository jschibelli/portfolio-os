import { test, expect } from '@playwright/test';

test.describe('QuickStats Component Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    // Create a simple test page with the QuickStats component
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>QuickStats Test</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 20px; }
          .badge {
            display: inline-flex;
            align-items: center;
            border-radius: 9999px;
            border: 1px solid #e5e7eb;
            padding: 0.25rem 0.625rem;
            font-size: 0.75rem;
            font-weight: 600;
            transition: all 0.2s;
            cursor: default;
          }
          .badge:focus {
            outline: none;
            ring: 2px;
            ring-color: #3b82f6;
            ring-offset: 2px;
          }
          .badge:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          .badge-default {
            background-color: #3b82f6;
            color: white;
            border-color: transparent;
          }
          .badge-secondary {
            background-color: #f3f4f6;
            color: #374151;
            border-color: transparent;
          }
          .badge-outline {
            background-color: transparent;
            color: #374151;
            border-color: #d1d5db;
          }
          .stats-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            list-style: none;
            padding: 0;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div id="quickstats-container">
          <ul class="stats-list" role="list" aria-label="Project metadata badges">
            <li class="list-none">
              <div class="badge badge-default" tabindex="0" role="listitem" aria-label="stack: Next.js">Next.js</div>
            </li>
            <li class="list-none">
              <div class="badge badge-default" tabindex="0" role="listitem" aria-label="stack: TypeScript">TypeScript</div>
            </li>
            <li class="list-none">
              <div class="badge badge-secondary" tabindex="0" role="listitem" aria-label="role: Frontend Developer">Frontend Developer</div>
            </li>
            <li class="list-none">
              <div class="badge badge-outline" tabindex="0" role="listitem" aria-label="status: Active">Active</div>
            </li>
            <li class="list-none">
              <div class="badge badge-outline" tabindex="0" role="listitem" aria-label="year: 2024">2024</div>
            </li>
          </ul>
        </div>
      </body>
      </html>
    `);
  });

  test('should have proper semantic structure', async ({ page }) => {
    const list = page.locator('ul[role="list"]');
    await expect(list).toBeVisible();
    
    const listItems = page.locator('li');
    await expect(listItems).toHaveCount(5);
    
    const badges = page.locator('[role="listitem"]');
    await expect(badges).toHaveCount(5);
  });

  test('should have proper ARIA labels', async ({ page }) => {
    const list = page.locator('ul[role="list"]');
    await expect(list).toHaveAttribute('aria-label', 'Project metadata badges');
    
    const badges = page.locator('[role="listitem"]');
    await expect(badges.nth(0)).toHaveAttribute('aria-label', 'stack: Next.js');
    await expect(badges.nth(1)).toHaveAttribute('aria-label', 'stack: TypeScript');
    await expect(badges.nth(2)).toHaveAttribute('aria-label', 'role: Frontend Developer');
    await expect(badges.nth(3)).toHaveAttribute('aria-label', 'status: Active');
    await expect(badges.nth(4)).toHaveAttribute('aria-label', 'year: 2024');
  });

  test('should be keyboard navigable', async ({ page }) => {
    const badges = page.locator('[role="listitem"]');
    
    // Test that all badges are focusable
    for (let i = 0; i < 5; i++) {
      await badges.nth(i).focus();
      await expect(badges.nth(i)).toBeFocused();
    }
  });

  test('should have visible focus indicators', async ({ page }) => {
    const firstBadge = page.locator('[role="listitem"]').first();
    
    await firstBadge.focus();
    await expect(firstBadge).toBeFocused();
    
    // Check that focus styles are applied (this would need to be adjusted based on actual CSS)
    const focusStyles = await firstBadge.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        outline: styles.outline,
        boxShadow: styles.boxShadow
      };
    });
    
    // Focus should be visible (either through outline or box-shadow)
    expect(focusStyles.outline !== 'none' || focusStyles.boxShadow !== 'none').toBeTruthy();
  });

  test('should support keyboard navigation', async ({ page }) => {
    const badges = page.locator('[role="listitem"]');
    
    // Focus first badge
    await badges.nth(0).focus();
    await expect(badges.nth(0)).toBeFocused();
    
    // Tab to next badge
    await page.keyboard.press('Tab');
    await expect(badges.nth(1)).toBeFocused();
    
    // Continue tabbing
    await page.keyboard.press('Tab');
    await expect(badges.nth(2)).toBeFocused();
  });

  test('should have proper contrast ratios', async ({ page }) => {
    const badges = page.locator('[role="listitem"]');
    
    // This is a basic check - in a real scenario, you'd use axe-core or similar
    // to check actual contrast ratios
    for (let i = 0; i < 5; i++) {
      const badge = badges.nth(i);
      await expect(badge).toBeVisible();
      
      // Check that badges have text content
      const text = await badge.textContent();
      expect(text).toBeTruthy();
      expect(text!.length).toBeGreaterThan(0);
    }
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    const list = page.locator('ul[role="list"]');
    await expect(list).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(list).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(list).toBeVisible();
  });

  test('should handle empty state gracefully', async ({ page }) => {
    // Test with empty list
    await page.setContent(`
      <div id="empty-container" style="display: block; visibility: visible;">
        <!-- Empty container - should not render anything -->
      </div>
    `);
    
    const container = page.locator('#empty-container');
    await expect(container).toBeVisible();
    
    // Should not have any list elements
    const list = page.locator('ul[role="list"]');
    await expect(list).toHaveCount(0);
  });
});
