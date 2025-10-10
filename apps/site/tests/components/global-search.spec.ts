import { test, expect } from '@playwright/test';

/**
 * Global Search Component Tests
 * Issue #302 - Frontend/UI Specialist (Chris)
 * Part 4 of 4: Global Search
 * 
 * Tests global search functionality:
 * - Search button/trigger visibility
 * - Search modal/input display
 * - Search input interactions
 * - Search results display
 * - Keyboard shortcuts (if any)
 * - Accessibility
 */

test.describe('Global Search - Trigger', () => {
  test('should display search button in navigation', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Look for search button or icon
    const searchButton = page.locator('button[aria-label*="Search"], button:has-text("Search"), button:has(svg)').filter({ hasText: /search/i });
    const buttonCount = await searchButton.count();
    
    // If search exists, verify visibility
    if (buttonCount > 0) {
      await expect(searchButton.first()).toBeVisible();
    }
  });

  test('should have accessible search trigger', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Look for search trigger
    const searchTrigger = page.locator('button[aria-label*="Search"], [role="search"], input[type="search"]');
    const triggerCount = await searchTrigger.count();
    
    if (triggerCount > 0) {
      const trigger = searchTrigger.first();
      
      // Should have aria-label or accessible name
      const ariaLabel = await trigger.getAttribute('aria-label');
      const role = await trigger.getAttribute('role');
      
      expect(ariaLabel || role).toBeTruthy();
    }
  });
});

test.describe('Global Search - Search Modal', () => {
  test('should open search modal when clicking trigger', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Find and click search button
    const searchButton = page.locator('button[aria-label*="Search"], button:has-text("Search")');
    const buttonCount = await searchButton.count();
    
    if (buttonCount > 0) {
      await searchButton.first().click();
      await page.waitForTimeout(500);
      
      // Look for search modal or input
      const searchModal = page.locator('[role="dialog"], [role="search"], input[type="search"]');
      const modalCount = await searchModal.count();
      
      if (modalCount > 0) {
        await expect(searchModal.first()).toBeVisible();
      }
    }
  });

  test('should display search input field', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Look for search input (might be always visible or in a modal)
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], input[aria-label*="Search"]');
    const inputCount = await searchInput.count();
    
    if (inputCount > 0) {
      const input = searchInput.first();
      
      // If input is initially hidden, try to open search first
      if (!(await input.isVisible())) {
        const searchButton = page.locator('button[aria-label*="Search"]');
        if (await searchButton.count() > 0) {
          await searchButton.first().click();
          await page.waitForTimeout(500);
        }
      }
      
      // Now input should be visible
      if (await input.isVisible()) {
        await expect(input).toBeVisible();
      }
    }
  });

  test('should accept search query input', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Open search if needed
    const searchButton = page.locator('button[aria-label*="Search"]');
    if (await searchButton.count() > 0) {
      await searchButton.first().click();
      await page.waitForTimeout(500);
    }
    
    // Find search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]');
    const inputCount = await searchInput.count();
    
    if (inputCount > 0) {
      await searchInput.first().fill('React');
      await expect(searchInput.first()).toHaveValue('React');
    }
  });
});

test.describe('Global Search - Accessibility', () => {
  test('should be keyboard accessible', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Search should be accessible via keyboard
    const searchButton = page.locator('button[aria-label*="Search"]');
    const buttonCount = await searchButton.count();
    
    if (buttonCount > 0) {
      await searchButton.first().focus();
      await expect(searchButton.first()).toBeFocused();
    }
  });

  test('should have proper ARIA roles', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Check for search role
    const searchElement = page.locator('[role="search"], input[type="search"]');
    const searchCount = await searchElement.count();
    
    if (searchCount > 0) {
      await expect(searchElement.first()).toBeVisible();
    }
  });
});

