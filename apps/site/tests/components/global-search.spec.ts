import { test, expect } from '@playwright/test';

test.describe('Site search retirement', () => {
  test('does not render global search UI in the header', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1000);

    const search = page.locator('input[type="search"], input[placeholder*="Search"], button[aria-label*="Search"]');
    await expect(search).toHaveCount(0);
  });
});
