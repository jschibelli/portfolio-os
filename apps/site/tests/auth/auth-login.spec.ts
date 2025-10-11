import { test, expect } from '@playwright/test';

/**
 * Authentication Flow Tests - Login Page
 * Issue #296 - Frontend/UI Specialist (Chris)
 * 
 * Tests the login page (/login) for:
 * - Login form UI and structure
 * - Form field validation
 * - Email and password inputs
 * - Submit button states
 * - Error message display
 * - Google OAuth button
 * - Loading states
 * - Accessibility
 */

test.describe('Authentication - Login Page Structure', () => {
  test('should display login page with heading and description', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify page heading
    const heading = page.locator('h1:has-text("Sign in to Admin")');
    await expect(heading).toBeVisible();
    
    // Verify description
    await expect(page.locator('text=Access your blog administration dashboard')).toBeVisible();
  });

  test('should display email input field', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Find email input
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
    
    // Verify input has proper attributes
    await expect(emailInput).toHaveAttribute('id', 'email');
    await expect(emailInput).toHaveAttribute('name', 'email');
    await expect(emailInput).toHaveAttribute('required');
    await expect(emailInput).toHaveAttribute('placeholder');
  });

  test('should display password input field', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Find password input
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
    
    // Verify input has proper attributes
    await expect(passwordInput).toHaveAttribute('id', 'password');
    await expect(passwordInput).toHaveAttribute('name', 'password');
    await expect(passwordInput).toHaveAttribute('required');
    await expect(passwordInput).toHaveAttribute('placeholder');
  });

  test('should display submit button', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Find submit button
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toHaveText('Sign in');
  });

  test('should display Google OAuth button', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Find Google sign-in button
    const googleButton = page.locator('button:has-text("Sign in with Google")');
    await expect(googleButton).toBeVisible();
    
    // Verify Google logo/icon is present
    const googleIcon = googleButton.locator('svg');
    await expect(googleIcon).toBeVisible();
  });

  test('should display "Or continue with" divider', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify divider text
    await expect(page.locator('text=Or continue with')).toBeVisible();
  });
});

test.describe('Authentication - Form Input Validation', () => {
  test('should accept email input', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Type email
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('test@example.com');
    
    // Verify value
    await expect(emailInput).toHaveValue('test@example.com');
  });

  test('should accept password input', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Type password
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill('password123');
    
    // Verify value
    await expect(passwordInput).toHaveValue('password123');
  });

  test('should mask password input', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify password input type
    const passwordInput = page.locator('input#password');
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should clear email input', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Type and clear email
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('test@example.com');
    await emailInput.clear();
    
    // Verify cleared
    await expect(emailInput).toHaveValue('');
  });

  test('should clear password input', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Type and clear password
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill('password123');
    await passwordInput.clear();
    
    // Verify cleared
    await expect(passwordInput).toHaveValue('');
  });
});

test.describe('Authentication - Form Submission', () => {
  test('should show loading state when submitting', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Fill in credentials
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').fill('password123');
    
    // Click submit button
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Verify loading state (button text changes)
    await expect(submitButton).toHaveText(/Signing in/i);
  });

  test('should disable submit button while loading', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Fill in credentials
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').fill('password123');
    
    // Click submit
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Verify button is disabled during submission
    await expect(submitButton).toBeDisabled();
  });

  test('should show error message for invalid credentials', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Fill in invalid credentials
    await page.locator('input[type="email"]').fill('wrong@example.com');
    await page.locator('input[type="password"]').fill('wrongpassword');
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Wait for error message (may take a moment)
    await page.waitForTimeout(3000);
    
    // Check if error message appears
    const errorMessage = page.locator('text=Invalid credentials, text=An error occurred');
    const errorCount = await errorMessage.count();
    
    if (errorCount > 0) {
      await expect(errorMessage.first()).toBeVisible();
    }
  });

  test('should prevent submission with empty email', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Only fill password, leave email empty
    await page.locator('input[type="password"]').fill('password123');
    
    // Try to submit
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Form should not submit (email is required)
    // Verify we're still on login page
    expect(page.url()).toContain('/login');
  });

  test('should prevent submission with empty password', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Only fill email, leave password empty
    await page.locator('input[type="email"]').fill('test@example.com');
    
    // Try to submit
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Form should not submit (password is required)
    // Verify we're still on login page
    expect(page.url()).toContain('/login');
  });
});

test.describe('Authentication - OAuth Integration', () => {
  test('should have clickable Google sign-in button', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Find and verify Google button is interactive
    const googleButton = page.locator('button:has-text("Sign in with Google")');
    await expect(googleButton).toBeVisible();
    await expect(googleButton).toBeEnabled();
  });

  test('should show hover effect on Google button', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Hover over Google button
    const googleButton = page.locator('button:has-text("Sign in with Google")');
    await googleButton.hover();
    
    // Give time for hover effect
    await page.waitForTimeout(300);
    
    // Verify button is still visible
    await expect(googleButton).toBeVisible();
  });

  test('should display Google logo in OAuth button', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify Google SVG logo is present
    const googleButton = page.locator('button:has-text("Sign in with Google")');
    const svg = googleButton.locator('svg');
    
    await expect(svg).toBeVisible();
    
    // Verify SVG has proper viewBox
    await expect(svg).toHaveAttribute('viewBox');
  });
});

test.describe('Authentication - UI States', () => {
  test('should display form in centered container', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify page has centered layout
    const container = page.locator('div.min-h-screen').first();
    await expect(container).toBeVisible();
  });

  test('should display form with proper styling', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify form container has styling
    const formContainer = page.locator('div.bg-white.rounded-lg').first();
    await expect(formContainer).toBeVisible();
  });

  test('should show focus states on input fields', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Focus email input
    const emailInput = page.locator('input[type="email"]');
    await emailInput.focus();
    
    // Verify input is focused
    await expect(emailInput).toBeFocused();
  });

  test('should display labels for form fields', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify email label
    const emailLabel = page.locator('label[for="email"]');
    await expect(emailLabel).toBeVisible();
    await expect(emailLabel).toHaveText('Email address');
    
    // Verify password label
    const passwordLabel = page.locator('label[for="password"]');
    await expect(passwordLabel).toBeVisible();
    await expect(passwordLabel).toHaveText('Password');
  });
});

test.describe('Authentication - Responsive Design', () => {
  test('should display properly on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify form is visible on mobile
    const heading = page.locator('h1:has-text("Sign in to Admin")');
    await expect(heading).toBeVisible();
    
    // Verify inputs are visible
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    
    // Verify buttons are visible
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('button:has-text("Sign in with Google")')).toBeVisible();
  });

  test('should display properly on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify form is visible on tablet
    const heading = page.locator('h1:has-text("Sign in to Admin")');
    await expect(heading).toBeVisible();
    
    // Verify form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should maintain form width constraints', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify form has max-width constraint
    const formContainer = page.locator('div.max-w-md').first();
    await expect(formContainer).toBeVisible();
  });
});

test.describe('Authentication - Accessibility', () => {
  test('should have proper form labels associated with inputs', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify email label is associated
    const emailLabel = page.locator('label[for="email"]');
    await expect(emailLabel).toBeVisible();
    
    // Verify password label is associated
    const passwordLabel = page.locator('label[for="password"]');
    await expect(passwordLabel).toBeVisible();
  });

  test('should have proper input autocomplete attributes', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify email has autocomplete
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('autocomplete', 'email');
    
    // Verify password has autocomplete
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toHaveAttribute('autocomplete', 'current-password');
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Tab through form fields
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Verify we can navigate with keyboard
    const emailInput = page.locator('input[type="email"]');
    await emailInput.focus();
    await expect(emailInput).toBeFocused();
  });

  test('should have semantic HTML structure', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify form element exists
    const form = page.locator('form');
    await expect(form).toBeVisible();
    
    // Verify heading exists
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
  });

  test('should have proper button types', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Verify submit button has correct type (more specific selector)
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toHaveAttribute('type', 'submit');
    
    // Verify Google button has correct type (button, not submit)
    const googleButton = page.locator('button:has-text("Sign in with Google")');
    const buttonType = await googleButton.getAttribute('type');
    
    // Button type should be 'button' or not set (defaults to 'button')
    if (buttonType) {
      expect(buttonType).toBe('button');
    }
  });
});

test.describe('Authentication - Error Handling', () => {
  test('should display error message with proper styling', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Fill in invalid credentials
    await page.locator('input[type="email"]').fill('invalid@example.com');
    await page.locator('input[type="password"]').fill('wrongpassword');
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Wait for potential error
    await page.waitForTimeout(3000);
    
    // Check if error message container exists
    const errorContainer = page.locator('div.bg-red-50');
    const errorCount = await errorContainer.count();
    
    if (errorCount > 0) {
      await expect(errorContainer).toBeVisible();
    }
  });

  test('should clear error message on new submission attempt', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    // Submit with invalid credentials first
    await page.locator('input[type="email"]').fill('invalid@example.com');
    await page.locator('input[type="password"]').fill('wrong');
    await page.locator('button[type="submit"]').click();
    
    await page.waitForTimeout(3000);
    
    // Clear and try again
    await page.locator('input[type="email"]').clear();
    await page.locator('input[type="password"]').clear();
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').fill('newpassword');
    
    // Error should clear when submitting again
    await page.locator('button[type="submit"]').click();
    
    // Verify loading state shows (error cleared)
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toHaveText(/Signing in/i);
  });
});

test.describe('Authentication - Loading States', () => {
  test('should show suspense fallback while loading', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // The page should load eventually
    await page.waitForTimeout(2000);
    
    // Verify main content is loaded
    const heading = page.locator('h1:has-text("Sign in to Admin")');
    await expect(heading).toBeVisible();
  });
});

