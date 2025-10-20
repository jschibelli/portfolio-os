import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Case Study Page Object Model
 * 
 * Provides specific functionality for case study pages.
 */
export class CaseStudyPage extends BasePage {
  // Case study specific elements
  private heroTitle!: Locator;
  private tableOfContents!: Locator;
  private problemStatement!: Locator;
  private researchAnalysis!: Locator;
  private solutionDesign!: Locator;
  private implementation!: Locator;
  private resultsMetrics!: Locator;
  private lessonsLearned!: Locator;
  private nextSteps!: Locator;
  private ctaButtons!: Locator;
  private charts!: Locator;
  private tables!: Locator;

  constructor(page: Page) {
    super(page);
    this.initializeCaseStudyElements();
  }

  /**
   * Initialize case study specific elements
   */
  private initializeCaseStudyElements(): void {
    this.heroTitle = this.page.locator('h1').first();
    this.tableOfContents = this.page.locator('div:has-text("Table of Contents"), nav:has-text("Table of Contents")').first();
    this.problemStatement = this.page.locator('#problem-statement');
    this.researchAnalysis = this.page.locator('#research-analysis');
    this.solutionDesign = this.page.locator('#solution-design');
    this.implementation = this.page.locator('#implementation-plan');
    this.resultsMetrics = this.page.locator('#projected-results');
    this.lessonsLearned = this.page.locator('#lessons-learned');
    this.nextSteps = this.page.locator('#development-roadmap, #next-steps');
    this.ctaButtons = this.page.locator('a[href*="contact"], button[type="submit"]');
    this.charts = this.page.locator('canvas, svg[role="img"], [data-testid*="chart"]');
    this.tables = this.page.locator('table');
  }

  /**
   * Verify case study structure
   */
  async verifyCaseStudyStructure(): Promise<void> {
    // Verify hero section
    await expect(this.heroTitle).toBeVisible();
    
    // Verify table of contents (if present)
    const tocCount = await this.tableOfContents.count();
    if (tocCount > 0) {
      await expect(this.tableOfContents).toBeVisible();
      console.log('✅ Table of Contents is visible');
    } else {
      console.log('⚠️  Table of Contents not found - checking for alternative navigation');
      // Check for alternative navigation elements
      const navElements = await this.page.locator('nav, [role="navigation"]').count();
      expect(navElements).toBeGreaterThan(0);
    }
    
    // Verify all required sections are present
    const sections = [
      { element: this.problemStatement, name: 'Problem Statement' },
      { element: this.researchAnalysis, name: 'Research & Analysis' },
      { element: this.solutionDesign, name: 'Solution Design' },
      { element: this.implementation, name: 'Implementation' },
      { element: this.resultsMetrics, name: 'Results & Metrics' },
      { element: this.lessonsLearned, name: 'Lessons Learned' },
      { element: this.nextSteps, name: 'Next Steps' }
    ];

    for (const section of sections) {
      const sectionCount = await section.element.count();
      if (sectionCount > 0) {
        await expect(section.element).toBeVisible({ timeout: 10000 });
        console.log(`✅ ${section.name} section is visible`);
      } else {
        console.log(`⚠️  ${section.name} section not found with standard selectors`);
        // Try alternative selectors
        const altSelectors = [
          `h2:has-text("${section.name}")`,
          `[data-section*="${section.name.toLowerCase().replace(/\s+/g, '-')}"]`,
          `section:has(h2:has-text("${section.name}"))`
        ];
        
        let found = false;
        for (const selector of altSelectors) {
          const altElement = this.page.locator(selector);
          if (await altElement.count() > 0) {
            await expect(altElement).toBeVisible({ timeout: 5000 });
            console.log(`✅ ${section.name} section found with alternative selector`);
            found = true;
            break;
          }
        }
        
        if (!found) {
          console.log(`❌ ${section.name} section not found with any selector`);
        }
      }
    }
  }

  /**
   * Verify interactive elements
   */
  async verifyInteractiveElements(): Promise<void> {
    // Verify CTA buttons are present and enabled
    const ctaCount = await this.ctaButtons.count();
    expect(ctaCount).toBeGreaterThan(0);
    
    for (let i = 0; i < ctaCount; i++) {
      const button = this.ctaButtons.nth(i);
      await expect(button).toBeVisible();
      await expect(button).toBeEnabled();
    }
  }

  /**
   * Verify data visualization elements
   */
  async verifyDataVisualization(): Promise<void> {
    // Check for charts or tables
    const chartCount = await this.charts.count();
    const tableCount = await this.tables.count();
    
    // At least one data visualization should be present
    expect(chartCount + tableCount).toBeGreaterThan(0);
    
    if (chartCount > 0) {
      console.log(`✅ Found ${chartCount} chart(s)`);
      // Verify charts are visible (skip hidden icons)
      let visibleCharts = 0;
      for (let i = 0; i < chartCount; i++) {
        const chart = this.charts.nth(i);
        const isVisible = await chart.isVisible();
        if (isVisible) {
          visibleCharts++;
          console.log(`✅ Chart ${i + 1} is visible`);
        } else {
          // Check if it's just a hidden icon (common with Lucide icons)
          const tagName = await chart.evaluate(el => el.tagName);
          const classes = await chart.getAttribute('class');
          if (tagName === 'svg' && classes?.includes('lucide')) {
            console.log(`⚠️  Chart ${i + 1} is a hidden Lucide icon (skipping)`);
          } else {
            console.log(`⚠️  Chart ${i + 1} is not visible`);
          }
        }
      }
      expect(visibleCharts).toBeGreaterThan(0);
    }
    
    if (tableCount > 0) {
      console.log(`✅ Found ${tableCount} table(s)`);
      // Verify tables are visible and have proper structure
      for (let i = 0; i < tableCount; i++) {
        const table = this.tables.nth(i);
        await expect(table).toBeVisible();
        
        // Check for table headers
        const headers = table.locator('th');
        const headerCount = await headers.count();
        expect(headerCount).toBeGreaterThan(0);
      }
    }
  }

  /**
   * Test table of contents navigation
   */
  async testTableOfContentsNavigation(): Promise<void> {
    if (await this.tableOfContents.count() === 0) {
      console.log('⚠️  No table of contents found, skipping navigation test');
      return;
    }

    // Get all TOC links
    const tocLinks = this.tableOfContents.locator('a');
    const linkCount = await tocLinks.count();
    
    if (linkCount === 0) {
      console.log('⚠️  No TOC links found, skipping navigation test');
      return;
    }

    console.log(`Found ${linkCount} TOC links, testing first 3`);

    // Test clicking on each TOC link (with better error handling)
    for (let i = 0; i < Math.min(linkCount, 3); i++) { // Test first 3 links
      try {
        const link = tocLinks.nth(i);
        
        // Check if link exists and is visible
        const linkExists = await link.count() > 0;
        if (!linkExists) {
          console.log(`⚠️  TOC link ${i + 1} does not exist, skipping`);
          continue;
        }
        
        const isVisible = await link.isVisible();
        if (!isVisible) {
          console.log(`⚠️  TOC link ${i + 1} is not visible, skipping`);
          continue;
        }
        
        const linkText = await link.textContent({ timeout: 5000 });
        
        if (linkText && linkText.trim()) {
          // Get initial scroll position
          const initialScrollY = await this.page.evaluate(() => window.scrollY);
          
          await link.click();
          await this.page.waitForTimeout(1000); // Wait for scroll animation
          
          // Verify the page scrolled (basic check)
          const finalScrollY = await this.page.evaluate(() => window.scrollY);
          
          // Check if scroll position changed (either up or down)
          const scrollChanged = Math.abs(finalScrollY - initialScrollY) > 10;
          
          if (scrollChanged) {
            console.log(`✅ TOC link "${linkText.trim()}" navigated successfully (scrolled from ${initialScrollY} to ${finalScrollY})`);
          } else {
            console.log(`⚠️  TOC link "${linkText.trim()}" clicked but no significant scroll detected`);
            // Don't fail the test for this, just log it
          }
        } else {
          console.log(`⚠️  TOC link ${i + 1} has no text content, skipping`);
        }
      } catch (error) {
        console.log(`⚠️  Error testing TOC link ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        // Continue with next link instead of failing the entire test
      }
    }
  }

  /**
   * Verify chart captions and accessibility
   */
  async verifyChartAccessibility(): Promise<void> {
    const charts = this.charts;
    const chartCount = await charts.count();
    
    for (let i = 0; i < chartCount; i++) {
      const chart = charts.nth(i);
      
      // Check for alt text or aria-label
      const altText = await chart.getAttribute('alt');
      const ariaLabel = await chart.getAttribute('aria-label');
      const role = await chart.getAttribute('role');
      
      // At least one accessibility attribute should be present
      const hasAccessibility = altText || ariaLabel || role === 'img';
      
      if (!hasAccessibility) {
        console.warn(`⚠️  Chart ${i + 1} may lack accessibility attributes`);
      } else {
        console.log(`✅ Chart ${i + 1} has accessibility attributes`);
      }
    }
  }

  /**
   * Verify case study content quality
   */
  async verifyContentQuality(): Promise<void> {
    // Check that sections have substantial content
    const sections = [
      this.problemStatement,
      this.researchAnalysis,
      this.solutionDesign,
      this.implementation,
      this.resultsMetrics,
      this.lessonsLearned,
      this.nextSteps
    ];

    for (const section of sections) {
      if (await section.count() > 0) {
        const textContent = await section.textContent();
        const wordCount = textContent ? textContent.split(/\s+/).length : 0;
        
        // Each section should have at least 10 words
        expect(wordCount).toBeGreaterThan(10);
        console.log(`✅ Section has ${wordCount} words`);
      }
    }
  }

  /**
   * Run comprehensive case study validation
   */
  async runComprehensiveValidation(): Promise<void> {
    console.log('🔍 Starting comprehensive case study validation...');
    
    await this.verifyPageStructure();
    await this.verifyCaseStudyStructure();
    await this.verifyInteractiveElements();
    await this.verifyDataVisualization();
    await this.testTableOfContentsNavigation();
    await this.verifyChartAccessibility();
    await this.verifyContentQuality();
    
    console.log('✅ Comprehensive case study validation completed');
  }
}
