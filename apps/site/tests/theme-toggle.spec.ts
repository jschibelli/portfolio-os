import { test, expect } from '@playwright/test';

test.describe('Theme toggling', () => {
  test('respects light theme on first paint (no flicker)', async ({ page }) => {
    await page.addInitScript(() => {
      try {
        localStorage.setItem('theme', 'light');
      } catch {}
    });
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveClass(/dark/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('switches to dark theme via preference', async ({ page }) => {
    await page.addInitScript(() => {
      try {
        localStorage.setItem('theme', 'dark');
      } catch {}
    });
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/dark/);
  });
});



