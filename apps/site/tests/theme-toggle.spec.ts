import { test, expect } from '@playwright/test';

test.describe('Theme toggling', () => {
  test('respects light theme on first paint (no flicker)', async ({ page }) => {
    await page.addInitScript(() => {
      try {
        localStorage.setItem('theme', 'light');
      } catch {}
    });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).not.toHaveClass(/dark/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('switches to dark theme via preference', async ({ page }) => {
    await page.addInitScript(() => {
      try {
        localStorage.setItem('theme', 'dark');
      } catch {}
    });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('toggles via UI button', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const html = page.locator('html');
    const toggle = page.getByRole('button', { name: /toggle theme|switch to/i });
    await expect(toggle).toBeVisible();
    const initiallyDark = await html.evaluate((el) => el.classList.contains('dark'));
    await toggle.click();
    await expect(html).toHaveClass(initiallyDark ? /^(?!.*dark).*$/ : /dark/);
  });
});



