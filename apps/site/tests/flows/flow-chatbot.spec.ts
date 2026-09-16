import { test, expect } from '@playwright/test';

test.describe('Chatbot retirement', () => {
  test('does not render a public chatbot launcher', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1000);

    const chatbot = page.locator('[data-testid*="chatbot"], button[aria-label*="chat" i], button:has-text("Chat")');
    await expect(chatbot).toHaveCount(0);
  });
});
