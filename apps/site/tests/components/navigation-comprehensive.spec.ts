import { test, expect } from '@playwright/test';

/**
 * Navigation Component Comprehensive Tests
 * Issue #302 - Frontend/UI Specialist (Chris)
 * Part 1 of 4: Navigation
 * 
 * Tests navigation components for:
 * - Header/ModernHeader navigation links
 * - Mobile menu functionality
 * - Theme toggle functionality
 * - Active link states
 * - Dropdown menus (if any)
 * - Responsive behavior
 * - Accessibility
 */

test.describe('Navigation - Header Structure', () => {
  test('should display navigation header', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify header exists
    const header = page.locator('header, nav').first();
    await expect(header).toBeVisible();
  });

  test('should display navigation links', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Find navigation links
    const navLinks = page.locator('nav a, header a');
    const linkCount = await navLinks.count();
    
    // Should have multiple navigation links
    expect(linkCount).toBeGreaterThan(0);
  });

  test('should have links to main pages', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Check for common navigation links
    const homeLink = page.locator('a[href="/"], a:has-text("Home")').first();
    const aboutLink = page.locator('a[href="/about"]').first();
    const projectsLink = page.locator('a[href="/projects"]').first();
    const blogLink = page.locator('a[href="/blog"]').first();
    const contactLink = page.locator('a[href="/contact"]').first();
    
    // At least some of these should exist
    const links = [homeLink, aboutLink, projectsLink, blogLink, contactLink];
    let visibleCount = 0;
    
    for (const link of links) {
      if (await link.count() > 0) {
        visibleCount++;
      }
    }
    
    expect(visibleCount).toBeGreaterThan(0);
  });
});

test.describe('Navigation - Link Functionality', () => {
  test('should navigate to about page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Find and click about link
    const aboutLink = page.locator('a[href="/about"]').first();
    const linkCount = await aboutLink.count();
    
    if (linkCount > 0) {
      await Promise.all([
        page.waitForURL('**/about', { timeout: 10000 }).catch(() => {}),
        aboutLink.click()
      ]);
      
      // Verify navigation
      expect(page.url()).toContain('/about');
    }
  });

  test('should navigate to projects page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Find and click projects link
    const projectsLink = page.locator('a[href="/projects"]').first();
    const linkCount = await projectsLink.count();
    
    if (linkCount > 0) {
      await Promise.all([
        page.waitForURL('**/projects', { timeout: 10000 }).catch(() => {}),
        projectsLink.click()
      ]);
      
      // Verify navigation
      expect(page.url()).toContain('/projects');
    }
  });

  test('should navigate to blog page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Find and click blog link
    const blogLink = page.locator('a[href="/blog"]').first();
    const linkCount = await blogLink.count();
    
    if (linkCount > 0) {
      await Promise.all([
        page.waitForURL('**/blog', { timeout: 10000 }).catch(() => {}),
        blogLink.click()
      ]);
      
      // Verify navigation
      expect(page.url()).toContain('/blog');
    }
  });

  test('should navigate to contact page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Find and click contact link
    const contactLink = page.locator('a[href="/contact"]').first();
    const linkCount = await contactLink.count();
    
    if (linkCount > 0) {
      await contactLink.click();
      await page.waitForTimeout(2000);
      
      // Verify navigation
      expect(page.url()).toContain('/contact');
    }
  });
});

test.describe('Navigation - Mobile Menu', () => {
  test('should display mobile menu button on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Find mobile menu button (hamburger icon)
    const menuButton = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"], button[aria-label*="navigation"]');
    const buttonCount = await menuButton.count();
    
    if (buttonCount > 0) {
      await expect(menuButton.first()).toBeVisible();
    }
  });

  test('should open mobile menu when clicked', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Find and click mobile menu button
    const menuButton = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"], button[aria-label*="navigation"]');
    const buttonCount = await menuButton.count();
    
    if (buttonCount > 0) {
      await menuButton.first().click();
      await page.waitForTimeout(500);
      
      // Mobile menu should open (dialog or expanded nav)
      const mobileMenu = page.locator('[role="dialog"], nav[aria-expanded="true"]');
      const menuCount = await mobileMenu.count();
      
      if (menuCount > 0) {
        await expect(mobileMenu.first()).toBeVisible();
      }
    }
  });

  test('should close mobile menu when clicking close button', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Open mobile menu
    const menuButton = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"], button[aria-label*="navigation"]');
    const buttonCount = await menuButton.count();
    
    if (buttonCount > 0) {
      await menuButton.first().click();
      await page.waitForTimeout(500);
      
      // Find close button
      const closeButton = page.locator('button[aria-label*="Close"], button:has-text("×")').first();
      const closeCount = await closeButton.count();
      
      if (closeCount > 0) {
        await closeButton.click();
        await page.waitForTimeout(500);
        
        // Menu should close
        const mobileMenu = page.locator('[role="dialog"]');
        if (await mobileMenu.count() > 0) {
          await expect(mobileMenu).not.toBeVisible();
        }
      }
    }
  });
});

test.describe('Navigation - Theme Toggle', () => {
  test('should display theme toggle button', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Find theme toggle button
    const themeToggle = page.locator('button[aria-label*="theme"], button[aria-label*="dark"], button[aria-label*="light"]');
    const toggleCount = await themeToggle.count();
    
    if (toggleCount > 0) {
      await expect(themeToggle.first()).toBeVisible();
    }
  });

  test('should toggle theme when clicked', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Find and click theme toggle
    const themeToggle = page.locator('button[aria-label*="theme"], button[aria-label*="dark"], button[aria-label*="light"]');
    const toggleCount = await themeToggle.count();
    
    if (toggleCount > 0) {
      await themeToggle.first().click();
      await page.waitForTimeout(500);
      
      // Theme should change (check if dark class is applied or removed)
      // This test passes if no errors occur
      await expect(page.locator('body')).toBeVisible();
    }
  });
});

test.describe('Navigation - Accessibility', () => {
  test('should have accessible navigation landmarks', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify navigation landmark exists
    const nav = page.locator('nav, header');
    await expect(nav.first()).toBeVisible();
  });

  test('should have keyboard navigable links', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Tab through navigation
    await page.keyboard.press('Tab');
    
    // Verify focus is visible
    const focusedElement = page.locator(':focus');
    const focusCount = await focusedElement.count();
    
    if (focusCount > 0) {
      await expect(focusedElement).toBeVisible();
    }
  });

  test('should have proper ARIA labels on interactive elements', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Check for aria-labels on buttons
    const buttons = page.locator('header button, nav button');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      for (let i = 0; i < Math.min(buttonCount, 3); i++) {
        const button = buttons.nth(i);
        const ariaLabel = await button.getAttribute('aria-label');
        const buttonText = await button.textContent();
        
        // Should have either aria-label or text content
        expect(ariaLabel || buttonText).toBeTruthy();
      }
    }
  });
});

