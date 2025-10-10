import { Page, Locator, expect } from '@playwright/test';
import { navigateWithValidation, PERFORMANCE_THRESHOLDS } from '../utils/test-helpers';

/**
 * Base Page Object Model
 * 
 * Provides common functionality and elements that are shared across all pages.
 * This follows the Page Object Model pattern for better test maintainability.
 */
export abstract class BasePage {
  protected page: Page;
  
  // Common page elements
  protected navigation!: Locator;
  protected main!: Locator;
  protected footer!: Locator;
  protected body!: Locator;

  constructor(page: Page) {
    this.page = page;
    this.initializeElements();
  }

  /**
   * Initialize common page elements
   */
  private initializeElements(): void {
    this.navigation = this.page.locator('nav[role="navigation"], nav:has([aria-label*="Main"])').first();
    this.main = this.page.locator('main[role="main"], main#main-content').first();
    this.footer = this.page.locator('footer, [role="contentinfo"]');
    this.body = this.page.locator('body');
  }

  /**
   * Navigate to the page with validation
   */
  async navigate(url: string, expectedTitle?: string | RegExp): Promise<{ response: any; loadTime: number; success: boolean }> {
    return await navigateWithValidation(this.page, url, expectedTitle);
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await expect(this.body).toBeVisible();
  }

  /**
   * Check if navigation is visible and accessible
   */
  async verifyNavigation(): Promise<void> {
    // Check if any navigation element is visible
    const navCount = await this.page.locator('nav').count();
    expect(navCount).toBeGreaterThan(0);
    
    // Check for main navigation specifically
    const mainNav = this.page.locator('nav[role="navigation"], nav:has([aria-label*="Main"])').first();
    if (await mainNav.count() > 0) {
      await expect(mainNav).toBeVisible();
      
      // Check for common navigation elements
      const navLinks = mainNav.locator('a');
      const linkCount = await navLinks.count();
      expect(linkCount).toBeGreaterThan(0);
    }
  }

  /**
   * Check if main content area is visible
   */
  async verifyMainContent(): Promise<void> {
    // Check if any main element is visible
    const mainCount = await this.page.locator('main').count();
    expect(mainCount).toBeGreaterThan(0);
    
    // Check for main content specifically
    const mainContent = this.page.locator('main[role="main"], main#main-content').first();
    if (await mainContent.count() > 0) {
      await expect(mainContent).toBeVisible();
    }
  }

  /**
   * Check if footer is visible
   */
  async verifyFooter(): Promise<void> {
    await expect(this.footer).toBeVisible();
  }

  /**
   * Verify basic page structure
   */
  async verifyPageStructure(): Promise<void> {
    await this.verifyNavigation();
    await this.verifyMainContent();
    await this.verifyFooter();
  }

  /**
   * Check for console errors
   */
  async checkForConsoleErrors(): Promise<string[]> {
    const errors: string[] = [];
    
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Wait a bit to catch any delayed errors
    await this.page.waitForTimeout(1000);
    
    // Filter out known non-critical errors
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('404') &&
      !error.includes('net::ERR_ABORTED') &&
      !error.includes('ResizeObserver loop limit exceeded')
    );
    
    return criticalErrors;
  }

  /**
   * Test keyboard navigation
   */
  async testKeyboardNavigation(maxTabs: number = 5): Promise<void> {
    await this.page.keyboard.press('Tab');
    
    // Check if focus is visible and properly managed
    const focusedElement = await this.page.evaluate(() => {
      const active = document.activeElement;
      return active ? {
        tagName: active.tagName,
        textContent: active.textContent?.slice(0, 50),
        hasFocusVisible: active.matches(':focus-visible')
      } : null;
    });
    
    expect(focusedElement).not.toBeNull();
    expect(focusedElement?.hasFocusVisible).toBe(true);
    
    // Test tab navigation through main navigation with focus tracking
    const focusHistory = [];
    for (let i = 0; i < maxTabs; i++) {
      await this.page.keyboard.press('Tab');
      const currentFocus = await this.page.evaluate(() => {
        const active = document.activeElement;
        return active ? {
          tagName: active.tagName,
          textContent: active.textContent?.slice(0, 30),
          tabIndex: active.tabIndex
        } : null;
      });
      focusHistory.push(currentFocus);
    }
    
    // Verify focus management - should have moved through different elements
    expect(focusHistory.filter(f => f !== null).length).toBeGreaterThan(1);
  }

  /**
   * Test responsive design
   */
  async testResponsiveDesign(): Promise<void> {
    const viewport = this.page.viewportSize();
    if (!viewport) return;
    
    // Check that main content is visible and properly sized
    await expect(this.main).toBeVisible();
    
    // Check that navigation is accessible
    await expect(this.navigation).toBeVisible();
    
    // Verify no horizontal scroll (responsive design)
    const bodyWidth = await this.page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = viewport.width;
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20); // Allow small margin
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get page URL
   */
  getUrl(): string {
    return this.page.url();
  }

  /**
   * Take screenshot for debugging
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }
}
