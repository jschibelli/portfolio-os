# Visual Baseline Documentation

## Overview

This directory contains visual baseline screenshots for the Blog page at different viewport sizes. These images serve as the "golden standard" for visual regression testing.

## Required Screenshots

### Desktop View (1280×800)
- **File**: `desktop.png`
- **Description**: Full blog page on desktop viewport
- **Captures**: Hero section, featured post, latest posts grid, newsletter CTA, social media icons

### Tablet View (834×1112)
- **File**: `tablet.png`
- **Description**: Blog page on tablet viewport (portrait)
- **Captures**: Responsive layout adjustments, mobile navigation, grid changes

### Mobile View (390×844)
- **File**: `mobile.png`
- **Description**: Blog page on mobile viewport
- **Captures**: Single column layout, mobile menu, touch-friendly interactions

## How to Capture Screenshots

### Using Playwright
```bash
# Install Playwright if not already installed
npm install -D @playwright/test

# Run the visual test
npx playwright test tests/visual/blog-page.spec.ts --headed
```

### Using Browser DevTools
1. Open the blog page in Chrome/Firefox
2. Open DevTools (F12)
3. Set viewport to desired size
4. Take screenshot (Cmd+Shift+P → "screenshot")
5. Save as appropriate filename

### Using Playwright CLI
```bash
# Capture desktop screenshot
npx playwright screenshot --viewport-size=1280,800 http://localhost:3000/blog docs/pages/blog/visual-baseline/desktop.png

# Capture tablet screenshot
npx playwright screenshot --viewport-size=834,1112 http://localhost:3000/blog docs/pages/blog/visual-baseline/tablet.png

# Capture mobile screenshot
npx playwright screenshot --viewport-size=390,844 http://localhost:3000/blog docs/pages/blog/visual-baseline/mobile.png
```

## Visual Regression Testing

These baseline images are used for visual regression testing to ensure the blog page maintains its visual integrity across updates.

### Test Configuration
```typescript
// tests/visual/blog-page.spec.ts
test.describe('Blog Page Visual Regression', () => {
  test('desktop view', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/blog');
    await page.waitForTimeout(2000); // Wait for animations
    await expect(page).toHaveScreenshot('desktop.png');
  });

  test('tablet view', async ({ page }) => {
    await page.setViewportSize({ width: 834, height: 1112 });
    await page.goto('/blog');
    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot('tablet.png');
  });

  test('mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/blog');
    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot('mobile.png');
  });
});
```

## Updating Baselines

When the blog page design changes intentionally:

1. **Update Screenshots**:
   ```bash
   npx playwright test tests/visual/blog-page.spec.ts --update-snapshots
   ```

2. **Review Changes**: Ensure the new screenshots reflect the intended design changes

3. **Commit Changes**: Include the updated baseline images in your commit

## Troubleshooting

### Common Issues
- **Animations**: Wait for animations to complete before capturing
- **Loading States**: Ensure all content is loaded
- **Dynamic Content**: Use consistent test data
- **Font Loading**: Wait for fonts to load completely

### Best Practices
- Capture screenshots in consistent conditions
- Use the same browser for all captures
- Ensure consistent test data
- Wait for all animations to complete
- Check for any loading states

---

*This visual baseline documentation was generated on $(date) and should be updated whenever the blog page design changes.*
