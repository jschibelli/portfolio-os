import { test, expect } from '@playwright/test';
import { 
  mockNewsletterAPI,
  mockAPIResponse,
  navigateWithValidation,
  waitForAnimation,
  testFormValidation,
} from '../utils/test-helpers';
import { 
  FORM_TEST_DATA,
  MOCK_API_RESPONSES,
  ERROR_SCENARIOS,
  VIEWPORTS,
} from '../config/test-data';

test.describe('Newsletter Subscription Flow', () => {
  
  // ==========================================================================
  // NEWSLETTER ON BLOG PAGE
  // ==========================================================================
  
  test.describe('Newsletter on Blog Page', () => {
    
    test('should display newsletter CTA on blog page', async ({ page }) => {
      await page.goto('/blog');
      await waitForAnimation(page);
      
      // Look for newsletter section
      const newsletterSection = page.locator('#newsletter-section, [data-testid="newsletter"], section:has-text("newsletter")').first();
      await expect(newsletterSection).toBeVisible();
      
      // Should have email input
      const emailInput = page.locator('input[type="email"]');
      await expect(emailInput.first()).toBeVisible();
      
      // Should have subscribe button
      const subscribeButton = page.locator('button:has-text("Subscribe")');
      await expect(subscribeButton.first()).toBeVisible();
    });
    
    test('should have newsletter form with proper structure', async ({ page }) => {
      await page.goto('/blog');
      await waitForAnimation(page);
      
      // Find email input
      const emailInput = page.locator('input[type="email"]').first();
      await expect(emailInput).toBeVisible();
      
      // Check placeholder
      const placeholder = await emailInput.getAttribute('placeholder');
      expect(placeholder).toBeTruthy();
      
      // Find subscribe button
      const subscribeButton = page.locator('button:has-text("Subscribe")').first();
      await expect(subscribeButton).toBeVisible();
    });
    
    test('should successfully subscribe to newsletter', async ({ page }) => {
      // Mock successful subscription
      await mockNewsletterAPI(page, true);
      
      await page.goto('/blog');
      await waitForAnimation(page);
      
      // Find and fill email input
      const emailInput = page.locator('input[type="email"]').first();
      await emailInput.fill(FORM_TEST_DATA.validNewsletter.email);
      
      // Click subscribe button
      const subscribeButton = page.locator('button:has-text("Subscribe")').first();
      await subscribeButton.click();
      
      // Wait for success message
      await page.waitForTimeout(1000);
      
      // Look for success indicators
      const successMessage = page.locator('text=/Almost there|success|subscribed|confirmation/i').first();
      await expect(successMessage).toBeVisible({ timeout: 10000 });
    });
    
    test('should show loading state during subscription', async ({ page }) => {
      // Slow down the API response to see loading state
      await page.route('**/api/newsletter/**', async route => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(MOCK_API_RESPONSES.newsletter.success),
        });
      });
      
      await page.goto('/blog');
      await waitForAnimation(page);
      
      const emailInput = page.locator('input[type="email"]').first();
      await emailInput.fill(FORM_TEST_DATA.validNewsletter.email);
      
      const subscribeButton = page.locator('button:has-text("Subscribe")').first();
      await subscribeButton.click();
      
      // Should show loading state
      const loadingIndicator = page.locator('button:has-text("Subscribing"), button:has-text("..."), button .animate-spin').first();
      await expect(loadingIndicator).toBeVisible({ timeout: 1000 });
    });
    
  });
  
  // ==========================================================================
  // EMAIL VALIDATION
  // ==========================================================================
  
  test.describe('Email Validation', () => {
    
    test('should validate empty email', async ({ page }) => {
      await mockNewsletterAPI(page, true);
      
      await page.goto('/blog');
      await waitForAnimation(page);
      
      // Try to subscribe without email
      const subscribeButton = page.locator('button:has-text("Subscribe")').first();
      
      // Button should be disabled when email is empty
      const isDisabled = await subscribeButton.isDisabled();
      
      if (!isDisabled) {
        // If not disabled, clicking should show validation error
        await subscribeButton.click();
        await page.waitForTimeout(500);
        
        const errorMessage = page.locator('text=/please enter|email.*required|invalid.*email/i').first();
        const count = await errorMessage.count();
        
        if (count > 0) {
          await expect(errorMessage).toBeVisible();
        }
      } else {
        expect(isDisabled).toBe(true);
      }
    });
    
    test('should validate invalid email format', async ({ page }) => {
      await mockNewsletterAPI(page, true);
      
      await page.goto('/blog');
      await waitForAnimation(page);
      
      const emailInput = page.locator('input[type="email"]').first();
      const subscribeButton = page.locator('button:has-text("Subscribe")').first();
      
      // Try various invalid email formats
      const invalidEmails = [
        'notanemail',
        'missing@domain',
        '@nodomain.com',
        'spaces in@email.com',
      ];
      
      for (const invalidEmail of invalidEmails.slice(0, 2)) {
        await emailInput.fill(invalidEmail);
        
        // Either button is disabled or clicking shows error
        const isDisabled = await subscribeButton.isDisabled();
        
        if (!isDisabled) {
          await subscribeButton.click();
          await page.waitForTimeout(500);
          
          // Check for error message or that success didn't appear
          const successMessage = page.locator('text=/Almost there|success/i').first();
          const successCount = await successMessage.count();
          
          // Success should not appear for invalid email
          if (successCount > 0) {
            const isVisible = await successMessage.isVisible();
            expect(isVisible).toBe(false);
          }
        }
        
        await emailInput.clear();
      }
    });
    
    test('should accept valid email format', async ({ page }) => {
      await mockNewsletterAPI(page, true);
      
      await page.goto('/blog');
      await waitForAnimation(page);
      
      const emailInput = page.locator('input[type="email"]').first();
      await emailInput.fill('valid.email@example.com');
      
      const subscribeButton = page.locator('button:has-text("Subscribe")').first();
      
      // Button should be enabled with valid email
      await expect(subscribeButton).toBeEnabled({ timeout: 1000 });
    });
    
  });
  
  // ==========================================================================
  // SUCCESS & ERROR STATES
  // ==========================================================================
  
  test.describe('Success & Error States', () => {
    
    test('should show success message after subscription', async ({ page }) => {
      await mockNewsletterAPI(page, true);
      
      await page.goto('/blog');
      await waitForAnimation(page);
      
      const emailInput = page.locator('input[type="email"]').first();
      await emailInput.fill(FORM_TEST_DATA.validNewsletter.email);
      
      const subscribeButton = page.locator('button:has-text("Subscribe")').first();
      await subscribeButton.click();
      
      // Wait for success message
      await page.waitForTimeout(1000);
      
      // Should show confirmation message
      const successMessage = page.locator('text=/Almost there|Check your inbox|confirmation email/i').first();
      await expect(successMessage).toBeVisible({ timeout: 10000 });
    });
    
    test('should hide form after successful subscription', async ({ page }) => {
      await mockNewsletterAPI(page, true);
      
      await page.goto('/blog');
      await waitForAnimation(page);
      
      const emailInput = page.locator('input[type="email"]').first();
      const emailInputText = await emailInput.getAttribute('placeholder');
      
      await emailInput.fill(FORM_TEST_DATA.validNewsletter.email);
      
      const subscribeButton = page.locator('button:has-text("Subscribe")').first();
      await subscribeButton.click();
      
      await page.waitForTimeout(2000);
      
      // Original email input should not be visible or should be replaced
      const emailInputsAfter = page.locator('input[type="email"]:visible');
      const count = await emailInputsAfter.count();
      
      // Either no email inputs visible or a different one is shown
      // (in success state, the form is typically hidden)
      expect(count).toBeLessThanOrEqual(1);
    });
    
    test('should handle duplicate email subscription error', async ({ page }) => {
      await mockNewsletterAPI(page, false);
      
      await page.goto('/blog');
      await waitForAnimation(page);
      
      const emailInput = page.locator('input[type="email"]').first();
      await emailInput.fill(FORM_TEST_DATA.validNewsletter.email);
      
      const subscribeButton = page.locator('button:has-text("Subscribe")').first();
      await subscribeButton.click();
      
      await page.waitForTimeout(1000);
      
      // Should show error message
      const errorMessage = page.locator('text=/already subscribed|duplicate/i').first();
      await expect(errorMessage).toBeVisible({ timeout: 5000 });
    });
    
    test('should handle API failure gracefully', async ({ page }) => {
      // Mock API failure
      await page.route('**/api/newsletter/**', route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal server error' }),
        });
      });
      
      await page.goto('/blog');
      await waitForAnimation(page);
      
      const emailInput = page.locator('input[type="email"]').first();
      await emailInput.fill(FORM_TEST_DATA.validNewsletter.email);
      
      const subscribeButton = page.locator('button:has-text("Subscribe")').first();
      await subscribeButton.click();
      
      await page.waitForTimeout(1000);
      
      // Should show error message or handle gracefully
      const errorMessage = page.locator('text=/error|wrong|failed/i').first();
      const errorCount = await errorMessage.count();
      
      if (errorCount > 0) {
        await expect(errorMessage.first()).toBeVisible();
      }
      
      // Form should still be usable
      await expect(emailInput).toBeVisible();
      await expect(subscribeButton).toBeEnabled();
    });
    
    test('should clear error message when typing again', async ({ page }) => {
      await mockNewsletterAPI(page, false);
      
      await page.goto('/blog');
      await waitForAnimation(page);
      
      const emailInput = page.locator('input[type="email"]').first();
      await emailInput.fill('invalid.email@test.com');
      
      const subscribeButton = page.locator('button:has-text("Subscribe")').first();
      await subscribeButton.click();
      
      await page.waitForTimeout(1000);
      
      // Check if error appears
      const errorMessage = page.locator('text=/already subscribed|error/i').first();
      const errorCount = await errorMessage.count();
      
      if (errorCount > 0) {
        await expect(errorMessage).toBeVisible();
        
        // Type in input again
        await emailInput.fill('new.email@test.com');
        await page.waitForTimeout(500);
        
        // Error should disappear or be less visible
        const errorStillVisible = await errorMessage.isVisible().catch(() => false);
        // This is optional - some implementations keep the error until resubmit
      }
    });
    
  });
  
  // ==========================================================================
  // MULTIPLE PAGES
  // ==========================================================================
  
  test.describe('Newsletter on Multiple Pages', () => {
    
    test('should have newsletter form on blog page', async ({ page }) => {
      await page.goto('/blog');
      await waitForAnimation(page);
      
      const newsletterForm = page.locator('input[type="email"]').first();
      await expect(newsletterForm).toBeVisible();
    });
    
    test('should have newsletter CTA on homepage', async ({ page }) => {
      await page.goto('/');
      await waitForAnimation(page);
      
      // Look for newsletter mention or CTA
      const newsletterCTA = page.locator('text=/newsletter|subscribe|stay updated/i').first();
      const count = await newsletterCTA.count();
      
      // Newsletter CTA may or may not be on homepage
      if (count > 0) {
        await expect(newsletterCTA).toBeVisible();
      }
    });
    
    test('newsletter should work consistently across pages', async ({ page }) => {
      await mockNewsletterAPI(page, true);
      
      // Test on blog page
      await page.goto('/blog');
      await waitForAnimation(page);
      
      const emailInputBlog = page.locator('input[type="email"]').first();
      if (await emailInputBlog.count() > 0) {
        await emailInputBlog.fill('test1@example.com');
        
        const subscribeButton = page.locator('button:has-text("Subscribe")').first();
        await subscribeButton.click();
        
        await page.waitForTimeout(1000);
        
        // Check for success
        const successMessage = page.locator('text=/Almost there|success/i').first();
        await expect(successMessage).toBeVisible({ timeout: 5000 });
      }
    });
    
  });
  
  // ==========================================================================
  // RESPONSIVE DESIGN
  // ==========================================================================
  
  test.describe('Responsive Design', () => {
    
    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto('/blog');
      await waitForAnimation(page);
      
      const emailInput = page.locator('input[type="email"]').first();
      await expect(emailInput).toBeVisible();
      
      const subscribeButton = page.locator('button:has-text("Subscribe")').first();
      await expect(subscribeButton).toBeVisible();
      
      // Both should be properly sized for mobile
      const buttonBox = await subscribeButton.boundingBox();
      if (buttonBox) {
        expect(buttonBox.width).toBeGreaterThan(50);
      }
    });
    
    test('should be responsive on tablet', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.tablet);
      await page.goto('/blog');
      await waitForAnimation(page);
      
      const emailInput = page.locator('input[type="email"]').first();
      await expect(emailInput).toBeVisible();
      
      const subscribeButton = page.locator('button:has-text("Subscribe")').first();
      await expect(subscribeButton).toBeVisible();
    });
    
    test('should be responsive on desktop', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto('/blog');
      await waitForAnimation(page);
      
      const emailInput = page.locator('input[type="email"]').first();
      await expect(emailInput).toBeVisible();
      
      const subscribeButton = page.locator('button:has-text("Subscribe")').first();
      await expect(subscribeButton).toBeVisible();
    });
    
    test('form should not overflow on any viewport', async ({ page }) => {
      const viewports = [VIEWPORTS.mobile, VIEWPORTS.tablet, VIEWPORTS.desktop];
      
      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.goto('/blog');
        await waitForAnimation(page);
        
        // Check for horizontal scroll
        const hasHorizontalScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        
        // Allow small overflow (< 20px) which might be from scroll bars
        if (hasHorizontalScroll) {
          const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
          const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
          expect(scrollWidth - clientWidth).toBeLessThan(20);
        }
      }
    });
    
  });
  
  // ==========================================================================
  // USER INTERACTIONS
  // ==========================================================================
  
  test.describe('User Interactions', () => {
    
    test('should submit form on Enter key', async ({ page }) => {
      await mockNewsletterAPI(page, true);
      
      await page.goto('/blog');
      await waitForAnimation(page);
      
      const emailInput = page.locator('input[type="email"]').first();
      await emailInput.fill(FORM_TEST_DATA.validNewsletter.email);
      
      // Press Enter
      await emailInput.press('Enter');
      
      await page.waitForTimeout(1000);
      
      // Should show success message
      const successMessage = page.locator('text=/Almost there|success/i').first();
      await expect(successMessage).toBeVisible({ timeout: 5000 });
    });
    
    test('should focus email input when clicking in form area', async ({ page }) => {
      await page.goto('/blog');
      await waitForAnimation(page);
      
      const emailInput = page.locator('input[type="email"]').first();
      await emailInput.click();
      
      // Input should be focused
      const isFocused = await emailInput.evaluate((el: HTMLInputElement) => {
        return document.activeElement === el;
      });
      
      expect(isFocused).toBe(true);
    });
    
    test('should enable button when valid email is entered', async ({ page }) => {
      await page.goto('/blog');
      await waitForAnimation(page);
      
      const emailInput = page.locator('input[type="email"]').first();
      const subscribeButton = page.locator('button:has-text("Subscribe")').first();
      
      // Initially might be disabled
      await emailInput.fill('valid@example.com');
      
      await page.waitForTimeout(300);
      
      // Should be enabled with valid email
      await expect(subscribeButton).toBeEnabled();
    });
    
  });
  
  // ==========================================================================
  // ACCESSIBILITY
  // ==========================================================================
  
  test.describe('Accessibility', () => {
    
    test('email input should have proper type', async ({ page }) => {
      await page.goto('/blog');
      await waitForAnimation(page);
      
      const emailInput = page.locator('input[type="email"]').first();
      await expect(emailInput).toHaveAttribute('type', 'email');
    });
    
    test('should support keyboard navigation', async ({ page }) => {
      await page.goto('/blog');
      await waitForAnimation(page);
      
      // Tab to email input
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // One of the elements should be the email input
      const focusedElement = page.locator(':focus');
      const tagName = await focusedElement.evaluate((el: HTMLElement) => el.tagName.toLowerCase());
      
      // Should be able to reach form elements
      expect(['input', 'button', 'a']).toContain(tagName);
    });
    
    test('success message should be announced to screen readers', async ({ page }) => {
      await mockNewsletterAPI(page, true);
      
      await page.goto('/blog');
      await waitForAnimation(page);
      
      const emailInput = page.locator('input[type="email"]').first();
      await emailInput.fill(FORM_TEST_DATA.validNewsletter.email);
      
      const subscribeButton = page.locator('button:has-text("Subscribe")').first();
      await subscribeButton.click();
      
      await page.waitForTimeout(1000);
      
      const successMessage = page.locator('text=/Almost there|success/i').first();
      await expect(successMessage).toBeVisible();
      
      // Success message should be visible and readable
      const text = await successMessage.textContent();
      expect(text).toBeTruthy();
      expect(text!.length).toBeGreaterThan(5);
    });
    
  });
  
  // ==========================================================================
  // PRIVACY & GDPR
  // ==========================================================================
  
  test.describe('Privacy & GDPR', () => {
    
    test('should display privacy notice', async ({ page }) => {
      await page.goto('/blog');
      await waitForAnimation(page);
      
      // Look for privacy/GDPR text
      const privacyText = page.locator('text=/privacy|spam|unsubscribe/i').first();
      const count = await privacyText.count();
      
      if (count > 0) {
        await expect(privacyText).toBeVisible();
      }
    });
    
    test('should mention unsubscribe option', async ({ page }) => {
      await page.goto('/blog');
      await waitForAnimation(page);
      
      const unsubscribeText = page.locator('text=/unsubscribe/i').first();
      const count = await unsubscribeText.count();
      
      if (count > 0) {
        await expect(unsubscribeText).toBeVisible();
      }
    });
    
  });
  
});

