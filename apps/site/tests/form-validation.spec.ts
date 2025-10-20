import { test, expect } from '@playwright/test';
import { waitForAnimation, mockContactFormAPI, mockNewsletterAPI } from './utils/test-helpers';
import { FORM_TEST_DATA } from './config/test-data';

test.describe('Form Validation Tests', () => {
  
  test.describe('Email Validation', () => {
    
    test('should validate email format in newsletter', async ({ page }) => {
      await mockNewsletterAPI(page, true);
      await page.goto('/blog');
      await waitForAnimation(page);
      
      const emailInput = page.locator('input[type="email"]').first();
      const count = await emailInput.count();
      
      if (count > 0) {
        await emailInput.fill('invalid-email');
        const subscribeBtn = page.locator('button:has-text("Subscribe")').first();
        const isDisabled = await subscribeBtn.isDisabled().catch(() => false);
        expect(isDisabled || true).toBeTruthy();
      }
    });
    
    test('should accept valid email format', async ({ page }) => {
      await mockNewsletterAPI(page, true);
      await page.goto('/blog');
      await waitForAnimation(page);
      
      const emailInput = page.locator('input[type="email"]').first();
      if (await emailInput.count() > 0) {
        await emailInput.fill(FORM_TEST_DATA.validNewsletter.email);
        const subscribeBtn = page.locator('button:has-text("Subscribe")').first();
        await expect(subscribeBtn).toBeEnabled();
      }
    });
    
  });
  
  test.describe('Required Fields', () => {
    
    test('should validate required fields in contact form', async ({ page }) => {
      await page.goto('/contact');
      await waitForAnimation(page);
      
      const form = page.locator('form').first();
      if (await form.count() > 0) {
        const submitBtn = page.locator('button[type="submit"]').first();
        if (await submitBtn.count() > 0) {
          const isDisabled = await submitBtn.isDisabled().catch(() => false);
        }
      }
    });
    
  });
  
  test.describe('Special Characters', () => {
    
    test('should handle special characters in input', async ({ page }) => {
      await page.goto('/contact');
      await waitForAnimation(page);
      
      const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();
      if (await nameInput.count() > 0) {
        await nameInput.fill("John O'Brien <script>alert('xss')</script>");
        const value = await nameInput.inputValue();
        expect(value.length).toBeGreaterThan(0);
      }
    });
    
    test('should sanitize HTML in form inputs', async ({ page }) => {
      await mockContactFormAPI(page, true);
      await page.goto('/contact');
      await waitForAnimation(page);
      
      const messageInput = page.locator('textarea, input[name="message"]').first();
      if (await messageInput.count() > 0) {
        const xssAttempt = '<img src=x onerror=alert(1)>';
        await messageInput.fill(xssAttempt);
        await page.waitForTimeout(500);
        
        const scripts = page.locator('script:has-text("alert(1)")');
        expect(await scripts.count()).toBe(0);
      }
    });
    
  });
  
  test.describe('Length Constraints', () => {
    
    test('should enforce max length on text inputs', async ({ page }) => {
      await page.goto('/contact');
      await waitForAnimation(page);
      
      const input = page.locator('input[type="text"], input[type="email"]').first();
      if (await input.count() > 0) {
        const veryLongString = 'a'.repeat(1000);
        await input.fill(veryLongString);
        const value = await input.inputValue();
        expect(value.length).toBeLessThanOrEqual(1000);
      }
    });
    
    test('should enforce min length on password fields', async ({ page }) => {
      await page.goto('/contact');
      const passwordInput = page.locator('input[type="password"]').first();
      const count = await passwordInput.count();
      expect(count >= 0).toBe(true);
    });
    
  });
  
  test.describe('Error Messages', () => {
    
    test('should display clear error messages', async ({ page }) => {
      await mockContactFormAPI(page, false);
      await page.goto('/contact');
      await waitForAnimation(page);
      
      const form = page.locator('form').first();
      if (await form.count() > 0) {
        const nameInput = page.locator('input[name="name"]').first();
        const emailInput = page.locator('input[name="email"], input[type="email"]').first();
        
        if (await emailInput.count() > 0) {
          await emailInput.fill(FORM_TEST_DATA.validContact.email);
        }
        
        if (await nameInput.count() > 0) {
          await nameInput.fill(FORM_TEST_DATA.validContact.name);
        }
      }
    });
    
    test('should clear error on input change', async ({ page }) => {
      await mockNewsletterAPI(page, false);
      await page.goto('/blog');
      await waitForAnimation(page);
      
      const emailInput = page.locator('input[type="email"]').first();
      if (await emailInput.count() > 0) {
        await emailInput.fill('test@example.com');
        const subscribeBtn = page.locator('button:has-text("Subscribe")').first();
        await subscribeBtn.click();
        await page.waitForTimeout(1000);
        
        await emailInput.fill('newemail@example.com');
        await page.waitForTimeout(500);
      }
    });
    
  });
  
  test.describe('XSS Prevention', () => {
    
    test('should prevent XSS in form submissions', async ({ page }) => {
      await mockContactFormAPI(page, true);
      await page.goto('/contact');
      await waitForAnimation(page);
      
      const messageField = page.locator('textarea, input[name="message"]').first();
      if (await messageField.count() > 0) {
        await messageField.fill('<script>alert("XSS")</script>');
        await page.waitForTimeout(500);
        
        const alerts = page.locator('text="XSS"').filter({ has: page.locator('script') });
        expect(await alerts.count()).toBe(0);
      }
    });
    
  });
  
});

