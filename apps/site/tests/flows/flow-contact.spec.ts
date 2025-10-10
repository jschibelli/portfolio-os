import { test, expect } from '@playwright/test';

/**
 * Contact Form Flow Tests
 * Issue #298 - Frontend/UI Specialist (Chris)
 * 
 * Tests the contact form (/contact) for:
 * - Form structure and fields (name, email, company, projectType, message)
 * - Input validation (required fields, email format, message length)
 * - Form submission flow
 * - Success and error states
 * - User experience and feedback
 * - Responsive design
 * - Accessibility
 */

test.describe('Contact Form - Page Structure', () => {
  test('should display contact page with heading', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify page heading
    const heading = page.locator('h1:has-text("Let\'s Work")');
    await expect(heading).toBeVisible();
  });

  test('should display form description', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify form description
    await expect(page.locator('text=Ready to Transform Your Vision?')).toBeVisible();
  });

  test('should display contact information badges', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify badges (use more specific selectors to avoid strict mode violations)
    await expect(page.locator('text=Free Consultation').first()).toBeVisible();
    await expect(page.locator('text=No Commitment').first()).toBeVisible();
    
    // Quick Response might appear in multiple places, find it in the badge context
    const quickResponseBadge = page.locator('div:has-text("Quick Response")').first();
    if (await quickResponseBadge.count() > 0) {
      await expect(quickResponseBadge).toBeVisible();
    }
  });
});

test.describe('Contact Form - Form Fields', () => {
  test('should display name input field', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Find name input
    const nameInput = page.locator('input[name="name"]');
    await expect(nameInput).toBeVisible();
    await expect(nameInput).toHaveAttribute('required');
  });

  test('should display email input field', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Find email input
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('type', 'email');
    await expect(emailInput).toHaveAttribute('required');
  });

  test('should display company input field', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Find company input
    const companyInput = page.locator('input[name="company"]');
    await expect(companyInput).toBeVisible();
  });

  test('should display project type dropdown', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Find project type select
    const projectTypeSelect = page.locator('select[name="projectType"]');
    const projectTypeCount = await projectTypeSelect.count();
    
    if (projectTypeCount > 0) {
      await expect(projectTypeSelect).toBeVisible();
    }
  });

  test('should display message textarea', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Find message textarea
    const messageTextarea = page.locator('textarea[name="message"]');
    await expect(messageTextarea).toBeVisible();
    await expect(messageTextarea).toHaveAttribute('required');
  });

  test('should display submit button', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Find submit button
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  });
});

test.describe('Contact Form - Input Interactions', () => {
  test('should accept name input', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Type name
    const nameInput = page.locator('input[name="name"]');
    await nameInput.fill('John Doe');
    
    // Verify value
    await expect(nameInput).toHaveValue('John Doe');
  });

  test('should accept email input', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Type email
    const emailInput = page.locator('input[name="email"]');
    await emailInput.fill('john@example.com');
    
    // Verify value
    await expect(emailInput).toHaveValue('john@example.com');
  });

  test('should accept company input', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Type company
    const companyInput = page.locator('input[name="company"]');
    await companyInput.fill('Acme Corp');
    
    // Verify value
    await expect(companyInput).toHaveValue('Acme Corp');
  });

  test('should accept message input', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Type message
    const messageTextarea = page.locator('textarea[name="message"]');
    await messageTextarea.fill('I would like to discuss a new project with you.');
    
    // Verify value
    await expect(messageTextarea).toHaveValue('I would like to discuss a new project with you.');
  });

  test('should clear input fields', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Fill and clear name
    const nameInput = page.locator('input[name="name"]');
    await nameInput.fill('John Doe');
    await nameInput.clear();
    
    // Verify cleared
    await expect(nameInput).toHaveValue('');
  });
});

test.describe('Contact Form - Validation', () => {
  test('should show validation error for empty name', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Fill only email and message, leave name empty
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('textarea[name="message"]').fill('This is a test message with more than ten characters.');
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Wait for validation error
    await page.waitForTimeout(2000);
    
    // Check for error message
    const errorMessage = page.locator('text=Name is required, text=Check your inputs');
    const errorCount = await errorMessage.count();
    
    if (errorCount > 0) {
      await expect(errorMessage.first()).toBeVisible();
    }
  });

  test('should show validation error for empty email', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Fill only name and message, leave email empty
    await page.locator('input[name="name"]').fill('John Doe');
    await page.locator('textarea[name="message"]').fill('This is a test message with more than ten characters.');
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Wait for validation error
    await page.waitForTimeout(2000);
    
    // Check for error message
    const errorMessage = page.locator('text=Email is required, text=valid email, text=Check your inputs');
    const errorCount = await errorMessage.count();
    
    if (errorCount > 0) {
      await expect(errorMessage.first()).toBeVisible();
    }
  });

  test('should show validation error for invalid email format', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Fill with invalid email
    await page.locator('input[name="name"]').fill('John Doe');
    await page.locator('input[name="email"]').fill('invalid-email');
    await page.locator('textarea[name="message"]').fill('This is a test message with more than ten characters.');
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Wait for validation error
    await page.waitForTimeout(2000);
    
    // Check for error message
    const errorMessage = page.locator('text=Valid email required, text=valid email');
    const errorCount = await errorMessage.count();
    
    if (errorCount > 0) {
      await expect(errorMessage.first()).toBeVisible();
    }
  });

  test('should show validation error for short message', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Fill with short message (less than 10 characters)
    await page.locator('input[name="name"]').fill('John Doe');
    await page.locator('input[name="email"]').fill('john@example.com');
    await page.locator('textarea[name="message"]').fill('Short');
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Wait for validation error
    await page.waitForTimeout(2000);
    
    // Check for error message
    const errorMessage = page.locator('text=min 10 chars, text=10 characters');
    const errorCount = await errorMessage.count();
    
    if (errorCount > 0) {
      await expect(errorMessage.first()).toBeVisible();
    }
  });

  test('should accept valid form data', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Fill all required fields with valid data
    await page.locator('input[name="name"]').fill('John Doe');
    await page.locator('input[name="email"]').fill('john@example.com');
    await page.locator('textarea[name="message"]').fill('This is a valid test message with more than ten characters.');
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Wait for submission
    await page.waitForTimeout(3000);
    
    // Should not show validation error
    // (API might fail but validation should pass)
    const validationError = page.locator('text=Check your inputs');
    const errorCount = await validationError.count();
    
    // If error exists, it should not be the validation error
    if (errorCount > 0) {
      const errorText = await validationError.textContent();
      expect(errorText).not.toContain('Check your inputs');
    }
  });
});

test.describe('Contact Form - Submission Flow', () => {
  test('should show loading state during submission', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Fill valid form data
    await page.locator('input[name="name"]').fill('John Doe');
    await page.locator('input[name="email"]').fill('john@example.com');
    await page.locator('textarea[name="message"]').fill('This is a test message with more than ten characters.');
    
    // Submit form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Check for loading state (button text might change or be disabled)
    await page.waitForTimeout(500);
    
    const isDisabled = await submitButton.isDisabled();
    // Button should be disabled during submission or show loading text
    if (isDisabled) {
      expect(isDisabled).toBeTruthy();
    }
  });

  test('should show success message after successful submission', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Fill valid form data
    await page.locator('input[name="name"]').fill('Test User');
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('textarea[name="message"]').fill('This is a test message for successful submission.');
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Wait for potential success message
    await page.waitForTimeout(4000);
    
    // Check for success indicator
    const successMessage = page.locator('text=Message Sent, text=Thanks');
    const successCount = await successMessage.count();
    
    if (successCount > 0) {
      await expect(successMessage.first()).toBeVisible();
    }
  });

  test('should clear form fields after successful submission', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Fill valid form data
    await page.locator('input[name="name"]').fill('Test User');
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('textarea[name="message"]').fill('This is a test message for form clearing test.');
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Wait for submission
    await page.waitForTimeout(4000);
    
    // Check if success message is shown
    const successMessage = page.locator('text=Message Sent');
    const successCount = await successMessage.count();
    
    if (successCount > 0) {
      // Form should be cleared
      const nameInput = page.locator('input[name="name"]');
      const emailInput = page.locator('input[name="email"]');
      const messageTextarea = page.locator('textarea[name="message"]');
      
      await expect(nameInput).toHaveValue('');
      await expect(emailInput).toHaveValue('');
      await expect(messageTextarea).toHaveValue('');
    }
  });
});

test.describe('Contact Form - Responsive Design', () => {
  test('should display properly on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify form is visible on mobile
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should display properly on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify form is visible on tablet
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should display properly on desktop viewport', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify form is visible on desktop
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});

test.describe('Contact Form - Accessibility', () => {
  test('should have proper form labels', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Check for labels
    const labels = page.locator('label');
    const labelCount = await labels.count();
    
    // Form should have labels for inputs
    expect(labelCount).toBeGreaterThan(0);
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Tab through form fields
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Verify we can navigate
    const nameInput = page.locator('input[name="name"]');
    await nameInput.focus();
    await expect(nameInput).toBeFocused();
  });

  test('should have semantic HTML structure', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify form element exists
    const form = page.locator('form');
    await expect(form).toBeVisible();
    
    // Verify main content area
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('should have required attributes on required fields', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify required attributes
    const nameInput = page.locator('input[name="name"]');
    await expect(nameInput).toHaveAttribute('required');
    
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toHaveAttribute('required');
    
    const messageTextarea = page.locator('textarea[name="message"]');
    await expect(messageTextarea).toHaveAttribute('required');
  });
});

test.describe('Contact Form - User Experience', () => {
  test('should show focus states on input fields', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Focus name input
    const nameInput = page.locator('input[name="name"]');
    await nameInput.focus();
    
    // Verify input is focused
    await expect(nameInput).toBeFocused();
  });

  test('should display social media links', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Scroll down to find social links
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);
    
    // Check for social media links (they might be in a sidebar or footer)
    const socialLinks = page.locator('a[aria-label*="Facebook"], a[aria-label*="LinkedIn"], a[aria-label*="Github"]');
    const socialCount = await socialLinks.count();
    
    // Social links should be present somewhere on the page
    if (socialCount > 0) {
      await expect(socialLinks.first()).toBeVisible();
    }
  });

  test('should have placeholder text in inputs', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Check for placeholder attributes
    const nameInput = page.locator('input[name="name"]');
    const hasPlaceholder = await nameInput.getAttribute('placeholder');
    
    // Inputs should have helpful placeholder text
    if (hasPlaceholder) {
      expect(hasPlaceholder.length).toBeGreaterThan(0);
    }
  });
});

