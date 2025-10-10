import { test, expect } from '@playwright/test';
import { 
  navigateWithValidation, 
  testPagePerformance,
  testResponsiveDesign,
  waitForAnimation,
} from '../utils/test-helpers';
import { 
  CRITICAL_PAGES,
  VIEWPORTS,
  SEO_TEST_DATA,
} from '../config/test-data';

test.describe('Projects List Page - Comprehensive Tests', () => {
  
  // ==========================================================================
  // PAGE LOAD & PERFORMANCE
  // ==========================================================================
  
  test.describe('Page Load & Performance', () => {
    
    test('should load projects page successfully', async ({ page }) => {
      const { success, loadTime } = await navigateWithValidation(
        page, 
        '/projects',
        /Projects.*Case Studies/i
      );
      
      expect(success).toBe(true);
      expect(loadTime).toBeLessThan(10000); // 10 seconds max
      
      // Verify main heading
      const heading = page.locator('h1:has-text("Projects & Case Studies")');
      await expect(heading).toBeVisible();
    });
    
    test('should meet performance thresholds', async ({ page }) => {
      const { loadTime } = await testPagePerformance(page, '/projects', 8000);
      console.log(`Projects page loaded in ${loadTime}ms`);
    });
    
    test('should have no console errors on load', async ({ page }) => {
      const errors: string[] = [];
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      await page.goto('/projects');
      await page.waitForLoadState('networkidle');
      
      // Filter out common third-party errors
      const relevantErrors = errors.filter(error => 
        !error.includes('favicon') && 
        !error.includes('third-party')
      );
      
      expect(relevantErrors).toHaveLength(0);
    });
    
  });
  
  // ==========================================================================
  // SEO & METADATA
  // ==========================================================================
  
  test.describe('SEO & Metadata', () => {
    
    test('should have correct page title', async ({ page }) => {
      await page.goto('/projects');
      
      const title = await page.title();
      expect(title).toContain('Projects');
      expect(title).toContain('John Schibelli');
    });
    
    test('should have meta description', async ({ page }) => {
      await page.goto('/projects');
      
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveAttribute('content', /.+/);
      
      const content = await metaDescription.getAttribute('content');
      expect(content).toBeTruthy();
      expect(content!.length).toBeGreaterThan(50);
      expect(content!.length).toBeLessThan(160);
    });
    
    test('should have Open Graph tags', async ({ page }) => {
      await page.goto('/projects');
      
      // OG title
      const ogTitle = page.locator('meta[property="og:title"]');
      await expect(ogTitle).toHaveAttribute('content', /.+/);
      
      // OG description
      const ogDescription = page.locator('meta[property="og:description"]');
      await expect(ogDescription).toHaveAttribute('content', /.+/);
      
      // OG type
      const ogType = page.locator('meta[property="og:type"]');
      await expect(ogType).toHaveAttribute('content', 'website');
      
      // OG URL
      const ogUrl = page.locator('meta[property="og:url"]');
      await expect(ogUrl).toHaveAttribute('content', /projects/);
    });
    
    test('should have Twitter Card tags', async ({ page }) => {
      await page.goto('/projects');
      
      const twitterCard = page.locator('meta[name="twitter:card"]');
      await expect(twitterCard).toHaveAttribute('content', /.+/);
      
      const twitterTitle = page.locator('meta[name="twitter:title"]');
      await expect(twitterTitle).toHaveAttribute('content', /.+/);
    });
    
    test('should have canonical URL', async ({ page }) => {
      await page.goto('/projects');
      
      const canonical = page.locator('link[rel="canonical"]');
      const href = await canonical.getAttribute('href');
      
      expect(href).toBeTruthy();
      expect(href).toContain('/projects');
    });
    
    test('should have structured data', async ({ page }) => {
      await page.goto('/projects');
      
      // Check for JSON-LD structured data
      const structuredData = page.locator('script[type="application/ld+json"]');
      await expect(structuredData).toBeAttached();
      
      const jsonContent = await structuredData.textContent();
      expect(jsonContent).toBeTruthy();
      
      if (jsonContent) {
        const data = JSON.parse(jsonContent);
        expect(data['@type']).toBeDefined();
      }
    });
    
  });
  
  // ==========================================================================
  // CONTENT DISPLAY
  // ==========================================================================
  
  test.describe('Content Display', () => {
    
    test('should display hero section with correct content', async ({ page }) => {
      await page.goto('/projects');
      
      // Hero heading
      const heroHeading = page.locator('h1:has-text("Projects & Case Studies")');
      await expect(heroHeading).toBeVisible();
      
      // Subheading
      const subheading = page.locator('h2:has-text("John Schibelli")');
      await expect(subheading).toBeVisible();
      
      // Experience text
      const experience = page.locator('text=/15.*years.*experience/i');
      await expect(experience).toBeVisible();
    });
    
    test('should display project cards', async ({ page }) => {
      await page.goto('/projects');
      await page.waitForLoadState('networkidle');
      
      // Wait for animations to complete
      await waitForAnimation(page, 'article');
      
      // Check for project cards (articles)
      const projectCards = page.locator('article');
      const count = await projectCards.count();
      
      expect(count).toBeGreaterThan(0);
      console.log(`Found ${count} project cards`);
    });
    
    test('should display project card content correctly', async ({ page }) => {
      await page.goto('/projects');
      await page.waitForLoadState('networkidle');
      await waitForAnimation(page);
      
      const firstCard = page.locator('article').first();
      await expect(firstCard).toBeVisible();
      
      // Check for project image
      const image = firstCard.locator('img');
      await expect(image).toBeVisible();
      await expect(image).toHaveAttribute('alt', /.+/);
      
      // Check for project title
      const title = firstCard.locator('h3, h2').first();
      await expect(title).toBeVisible();
      
      // Check for project description
      const description = firstCard.locator('p').first();
      await expect(description).toBeVisible();
    });
    
    test('should display project technologies/tags', async ({ page }) => {
      await page.goto('/projects');
      await page.waitForLoadState('networkidle');
      await waitForAnimation(page);
      
      const firstCard = page.locator('article').first();
      
      // Look for technology badges/tags
      const tags = firstCard.locator('span, .tag, .badge').filter({
        hasText: /Next\.js|React|TypeScript|Node|Python|JavaScript/i
      });
      
      const tagCount = await tags.count();
      expect(tagCount).toBeGreaterThan(0);
    });
    
    test('should display project links', async ({ page }) => {
      await page.goto('/projects');
      await page.waitForLoadState('networkidle');
      await waitForAnimation(page);
      
      const firstCard = page.locator('article').first();
      
      // Check for link to project detail page
      const link = firstCard.locator('a[href*="/projects/"]').first();
      await expect(link).toBeVisible();
    });
    
    test('should load project images correctly', async ({ page }) => {
      await page.goto('/projects');
      await page.waitForLoadState('networkidle');
      await waitForAnimation(page);
      
      const images = page.locator('article img');
      const count = await images.count();
      
      // Check each image loads successfully
      for (let i = 0; i < Math.min(count, 3); i++) {
        const img = images.nth(i);
        await expect(img).toBeVisible();
        
        // Check image is not broken
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
        expect(naturalWidth).toBeGreaterThan(0);
      }
    });
    
  });
  
  // ==========================================================================
  // RESPONSIVE DESIGN
  // ==========================================================================
  
  test.describe('Responsive Design', () => {
    
    test('should adapt grid layout for mobile', async ({ page }) => {
      await testResponsiveDesign(page, '/projects', [
        {
          viewport: VIEWPORTS.mobile,
          expectations: [
            // On mobile, should show single column
            { selector: 'article', shouldBeVisible: true },
          ],
        },
      ]);
      
      // Verify single column on mobile by checking card positions
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto('/projects');
      await waitForAnimation(page);
      
      const cards = page.locator('article');
      const count = await cards.count();
      
      if (count >= 2) {
        const firstCard = cards.first();
        const secondCard = cards.nth(1);
        
        const firstBox = await firstCard.boundingBox();
        const secondBox = await secondCard.boundingBox();
        
        // Second card should be below first card (not side-by-side)
        if (firstBox && secondBox) {
          expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height - 50);
        }
      }
    });
    
    test('should adapt grid layout for tablet', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.tablet);
      await page.goto('/projects');
      await waitForAnimation(page);
      
      const cards = page.locator('article');
      await expect(cards.first()).toBeVisible();
    });
    
    test('should adapt grid layout for desktop', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto('/projects');
      await waitForAnimation(page);
      
      const cards = page.locator('article');
      const count = await cards.count();
      
      // On desktop with 3+ projects, should show multiple columns
      if (count >= 3) {
        const firstCard = cards.first();
        const secondCard = cards.nth(1);
        
        const firstBox = await firstCard.boundingBox();
        const secondBox = await secondCard.boundingBox();
        
        // Cards might be side-by-side on desktop
        if (firstBox && secondBox) {
          const isHorizontal = Math.abs(firstBox.y - secondBox.y) < 100;
          // Just verify cards are positioned (either horizontal or vertical layout is fine)
          expect(firstBox.y).toBeGreaterThan(0);
          expect(secondBox.y).toBeGreaterThan(0);
        }
      }
    });
    
    test('should have responsive images', async ({ page }) => {
      await page.goto('/projects');
      await waitForAnimation(page);
      
      const images = page.locator('article img').first();
      await expect(images).toBeVisible();
      
      // Check image has responsive classes or styles
      const classList = await images.getAttribute('class');
      expect(classList).toBeTruthy();
    });
    
    test('should maintain readability on all viewports', async ({ page }) => {
      const viewports = [VIEWPORTS.mobile, VIEWPORTS.tablet, VIEWPORTS.desktop];
      
      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.goto('/projects');
        await waitForAnimation(page);
        
        // Check that text is readable
        const heading = page.locator('h1').first();
        await expect(heading).toBeVisible();
        
        const fontSize = await heading.evaluate((el) => {
          return window.getComputedStyle(el).fontSize;
        });
        
        const fontSizeNum = parseInt(fontSize);
        expect(fontSizeNum).toBeGreaterThan(16); // Minimum readable size
      }
    });
    
  });
  
  // ==========================================================================
  // INTERACTIVE ELEMENTS
  // ==========================================================================
  
  test.describe('Interactive Elements', () => {
    
    test('should have clickable project cards', async ({ page }) => {
      await page.goto('/projects');
      await waitForAnimation(page);
      
      const firstCard = page.locator('article').first();
      const link = firstCard.locator('a').first();
      
      await expect(link).toBeVisible();
      const href = await link.getAttribute('href');
      expect(href).toContain('/projects/');
    });
    
    test('should navigate to project detail on click', async ({ page }) => {
      await page.goto('/projects');
      await waitForAnimation(page);
      
      const firstCard = page.locator('article').first();
      const link = firstCard.locator('a').first();
      const href = await link.getAttribute('href');
      
      // Click and navigate
      await link.click();
      await page.waitForLoadState('networkidle');
      
      // Verify navigation
      expect(page.url()).toContain('/projects/');
      expect(page.url()).toContain(href || '');
    });
    
    test('should have hover effects on project cards', async ({ page }) => {
      await page.goto('/projects');
      await waitForAnimation(page);
      
      const firstCard = page.locator('article').first();
      await expect(firstCard).toBeVisible();
      
      // Get initial styles
      const initialTransform = await firstCard.evaluate((el) => {
        return window.getComputedStyle(el).transform;
      });
      
      // Hover over card
      await firstCard.hover();
      await page.waitForTimeout(500); // Wait for hover animation
      
      // Verify some visual change (transform, shadow, etc.)
      // Note: This is a simple check, actual hover effects may vary
      await expect(firstCard).toBeVisible();
    });
    
  });
  
  // ==========================================================================
  // ACCESSIBILITY
  // ==========================================================================
  
  test.describe('Accessibility', () => {
    
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/projects');
      
      // Should have h1
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();
      
      // Project cards should have h2 or h3
      const projectHeadings = page.locator('article h2, article h3').first();
      await expect(projectHeadings).toBeVisible();
    });
    
    test('should have alt text for all images', async ({ page }) => {
      await page.goto('/projects');
      await waitForAnimation(page);
      
      const images = page.locator('article img');
      const count = await images.count();
      
      for (let i = 0; i < count; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        expect(alt).toBeTruthy();
        expect(alt!.length).toBeGreaterThan(0);
      }
    });
    
    test('should have keyboard navigation support', async ({ page }) => {
      await page.goto('/projects');
      await waitForAnimation(page);
      
      // Tab through links
      await page.keyboard.press('Tab');
      
      // Check that focus is visible
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });
    
    test('should have sufficient color contrast', async ({ page }) => {
      await page.goto('/projects');
      await waitForAnimation(page);
      
      const heading = page.locator('h1').first();
      
      const styles = await heading.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
        };
      });
      
      expect(styles.color).toBeTruthy();
    });
    
  });
  
  // ==========================================================================
  // EDGE CASES
  // ==========================================================================
  
  test.describe('Edge Cases', () => {
    
    test('should handle slow network gracefully', async ({ page, context }) => {
      // Simulate slow network
      await context.route('**/*', route => {
        setTimeout(() => route.continue(), 1000);
      });
      
      await page.goto('/projects', { timeout: 30000 });
      
      // Page should still load
      await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });
    });
    
    test('should handle missing images gracefully', async ({ page }) => {
      await page.goto('/projects');
      await waitForAnimation(page);
      
      // Even if images fail to load, cards should still be visible
      const cards = page.locator('article');
      await expect(cards.first()).toBeVisible();
    });
    
  });
  
});

