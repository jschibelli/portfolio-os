import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Comprehensive Accessibility-Performance Testing Suite
 * 
 * This test suite combines accessibility validation with performance monitoring
 * to ensure both user experience and performance standards are met.
 */

test.describe('Accessibility-Performance Integration', () => {
  test('blog page should meet both accessibility and performance standards', async ({ page }) => {
    // Initialize performance monitoring
    await page.evaluate(() => {
      window.performanceMetrics = {
        lcp: null,
        fid: null,
        cls: 0,
        fcp: null,
        ttfb: null,
        accessibilityScore: null
      };

      // LCP Observer
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        window.performanceMetrics.lcp = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // FID Observer
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          window.performanceMetrics.fid = entry.processingStart - entry.startTime;
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // CLS Observer
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            window.performanceMetrics.cls += entry.value;
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // FCP Observer
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.name === 'first-contentful-paint') {
            window.performanceMetrics.fcp = entry.startTime;
          }
        });
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
    });

    // Navigate to the page
    const startTime = Date.now();
    await page.goto('/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    const loadTime = Date.now() - startTime;

    // Wait for performance metrics to be collected
    await page.waitForTimeout(2000);

    // Run accessibility audit
    const accessibilityResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    // Get performance metrics
    const performanceMetrics = await page.evaluate(() => {
      return window.performanceMetrics || {};
    });

    // Calculate accessibility score
    const accessibilityScore = calculateAccessibilityScore(accessibilityResults);
    performanceMetrics.accessibilityScore = accessibilityScore;

    console.log('Combined Metrics:', {
      performance: {
        lcp: performanceMetrics.lcp,
        fid: performanceMetrics.fid,
        cls: performanceMetrics.cls,
        fcp: performanceMetrics.fcp,
        loadTime
      },
      accessibility: {
        score: accessibilityScore,
        violations: accessibilityResults.violations.length,
        passes: accessibilityResults.passes.length
      }
    });

    // Performance assertions
    if (performanceMetrics.lcp !== null && performanceMetrics.lcp !== undefined) {
      expect(performanceMetrics.lcp).toBeLessThan(2500); // LCP < 2.5s
    }
    
    if (performanceMetrics.fid !== null && performanceMetrics.fid !== undefined) {
      expect(performanceMetrics.fid).toBeLessThan(100); // FID < 100ms
    }
    
    if (performanceMetrics.cls !== null && performanceMetrics.cls !== undefined) {
      expect(performanceMetrics.cls).toBeLessThan(0.1); // CLS < 0.1
    }

    if (performanceMetrics.fcp !== null && performanceMetrics.fcp !== undefined) {
      expect(performanceMetrics.fcp).toBeLessThan(1800); // FCP < 1.8s
    }

    expect(loadTime).toBeLessThan(15000); // Load time < 15s

    // Accessibility assertions
    expect(accessibilityScore).toBeGreaterThanOrEqual(90); // Accessibility score >= 90%
    expect(accessibilityResults.violations).toHaveLength(0); // No accessibility violations

    // Combined UX score calculation
    const uxScore = calculateUXScore(performanceMetrics, accessibilityScore);
    console.log(`Overall UX Score: ${uxScore}%`);
    expect(uxScore).toBeGreaterThanOrEqual(85); // Combined UX score >= 85%
  });

  test('homepage should maintain accessibility during performance optimization', async ({ page }) => {
    // Test homepage with performance monitoring
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Run accessibility audit
    const accessibilityResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    // Check for common accessibility issues that might be introduced by performance optimizations
    const criticalIssues = accessibilityResults.violations.filter(violation => 
      violation.impact === 'critical' || violation.impact === 'serious'
    );

    expect(criticalIssues).toHaveLength(0);

    // Ensure images have proper alt text (common issue with performance optimizations)
    const imagesWithoutAlt = await page.locator('img:not([alt])').count();
    expect(imagesWithoutAlt).toBe(0);

    // Ensure proper heading hierarchy
    const headingStructure = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      return headings.map(h => ({ tag: h.tagName, text: h.textContent?.trim() }));
    });

    // Check for proper heading hierarchy
    expect(headingStructure.length).toBeGreaterThan(0);
    expect(headingStructure[0].tag).toBe('H1'); // Should start with H1
  });

  test('case study pages should be both accessible and performant', async ({ page }) => {
    // Test case study pages
    await page.goto('/case-studies', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Run accessibility audit
    const accessibilityResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    // Performance check
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart
      };
    });

    // Accessibility assertions
    expect(accessibilityResults.violations).toHaveLength(0);
    
    // Performance assertions
    expect(performanceMetrics.domContentLoaded).toBeLessThan(3000); // DOM ready < 3s
    expect(performanceMetrics.loadComplete).toBeLessThan(5000); // Load complete < 5s

    // Check for proper semantic structure in case studies
    const semanticElements = await page.locator('article, section, header, footer, nav, main').count();
    expect(semanticElements).toBeGreaterThan(0);

    // Ensure proper focus management
    const focusableElements = await page.locator('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])').count();
    expect(focusableElements).toBeGreaterThan(0);
  });

  test('chatbot should maintain accessibility with performance optimizations', async ({ page }) => {
    // Test chatbot accessibility and performance
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Wait for chatbot to load
    await page.waitForSelector('[data-testid="chatbot"]', { timeout: 10000 });
    
    // Test chatbot accessibility
    const chatbotAccessibility = await new AxeBuilder({ page })
      .include('[data-testid="chatbot"]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    // Check for ARIA attributes and keyboard navigation
    const chatbotButton = page.locator('[data-testid="chatbot-toggle"]');
    await expect(chatbotButton).toHaveAttribute('aria-label');
    await expect(chatbotButton).toHaveAttribute('aria-expanded');

    // Test keyboard navigation
    await chatbotButton.focus();
    await page.keyboard.press('Enter');
    
    // Wait for chatbot to open
    await page.waitForSelector('[data-testid="chatbot-panel"]', { timeout: 5000 });
    
    // Check if chatbot panel is accessible
    const panelAccessibility = await new AxeBuilder({ page })
      .include('[data-testid="chatbot-panel"]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(chatbotAccessibility.violations).toHaveLength(0);
    expect(panelAccessibility.violations).toHaveLength(0);

    // Performance check for chatbot interaction
    const interactionStart = Date.now();
    await page.keyboard.press('Escape'); // Close chatbot
    const interactionTime = Date.now() - interactionStart;
    
    expect(interactionTime).toBeLessThan(500); // Interaction should be < 500ms
  });
});

/**
 * Calculate accessibility score based on axe results
 */
function calculateAccessibilityScore(results: any): number {
  const total = results.passes.length + results.violations.length + results.incomplete.length;
  const passes = results.passes.length;
  return total > 0 ? Math.round((passes / total) * 100) : 100;
}

/**
 * Calculate combined UX score (performance + accessibility)
 */
function calculateUXScore(performanceMetrics: any, accessibilityScore: number): number {
  const performanceScore = calculatePerformanceScore(performanceMetrics);
  return Math.round((performanceScore + accessibilityScore) / 2);
}

/**
 * Calculate performance score based on Core Web Vitals
 */
function calculatePerformanceScore(metrics: any): number {
  let score = 100;
  
  if (metrics.lcp && metrics.lcp > 2500) score -= 20;
  if (metrics.fid && metrics.fid > 100) score -= 20;
  if (metrics.cls && metrics.cls > 0.1) score -= 20;
  if (metrics.fcp && metrics.fcp > 1800) score -= 20;
  
  return Math.max(0, score);
}
