import { test, expect } from '@playwright/test';

test.describe('InlineCaseStudy Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the demo page
    await page.goto('/inline-case-study-demo');
  });

  test('renders case study title and description', async ({ page }) => {
    await expect(page.getByText('InlineCaseStudy Component Demo')).toBeVisible();
    await expect(page.getByText('Test Case Study')).toBeVisible();
    await expect(page.getByText('A test case study for unit testing')).toBeVisible();
  });

  test('renders all section titles', async ({ page }) => {
    await expect(page.getByText('Problem Statement')).toBeVisible();
    await expect(page.getByText('Solution Design')).toBeVisible();
    await expect(page.getByText('Challenges & Implementation')).toBeVisible();
    await expect(page.getByText('Results & Metrics')).toBeVisible();
  });

  test('toggles section content on click', async ({ page }) => {
    const problemTrigger = page.getByRole('button', { name: /problem statement/i });
    
    // Initially closed
    await expect(problemTrigger).toHaveAttribute('aria-expanded', 'false');
    
    // Click to open
    await problemTrigger.click();
    await expect(problemTrigger).toHaveAttribute('aria-expanded', 'true');
    
    // Content should be visible
    await expect(page.getByText('The market lacked a comprehensive multi-tenant chatbot platform')).toBeVisible();
    
    // Click to close
    await problemTrigger.click();
    await expect(problemTrigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('opens default section when specified', async ({ page }) => {
    // The first case study should have the problem section open by default
    const problemTrigger = page.getByRole('button', { name: /problem statement/i }).first();
    await expect(problemTrigger).toHaveAttribute('aria-expanded', 'true');
  });

  test('handles keyboard navigation', async ({ page }) => {
    const problemTrigger = page.getByRole('button', { name: /problem statement/i }).first();
    const solutionTrigger = page.getByRole('button', { name: /solution design/i }).first();
    
    // Focus first trigger
    await problemTrigger.focus();
    await expect(problemTrigger).toBeFocused();
    
    // Arrow down should focus next trigger
    await page.keyboard.press('ArrowDown');
    await expect(solutionTrigger).toBeFocused();
    
    // Arrow up should focus previous trigger
    await page.keyboard.press('ArrowUp');
    await expect(problemTrigger).toBeFocused();
  });

  test('handles Enter key to toggle sections', async ({ page }) => {
    const problemTrigger = page.getByRole('button', { name: /problem statement/i }).first();
    
    // Focus and press Enter
    await problemTrigger.focus();
    await page.keyboard.press('Enter');
    
    await expect(problemTrigger).toHaveAttribute('aria-expanded', 'true');
  });

  test('handles Space key to toggle sections', async ({ page }) => {
    const problemTrigger = page.getByRole('button', { name: /problem statement/i }).first();
    
    // Focus and press Space
    await problemTrigger.focus();
    await page.keyboard.press(' ');
    
    await expect(problemTrigger).toHaveAttribute('aria-expanded', 'true');
  });

  test('handles Home key to focus first section', async ({ page }) => {
    const problemTrigger = page.getByRole('button', { name: /problem statement/i }).first();
    const solutionTrigger = page.getByRole('button', { name: /solution design/i }).first();
    
    // Focus second trigger
    await solutionTrigger.focus();
    await expect(solutionTrigger).toBeFocused();
    
    // Press Home to focus first
    await page.keyboard.press('Home');
    await expect(problemTrigger).toBeFocused();
  });

  test('handles End key to focus last section', async ({ page }) => {
    const problemTrigger = page.getByRole('button', { name: /problem statement/i }).first();
    const resultsTrigger = page.getByRole('button', { name: /results & metrics/i }).first();
    
    // Focus first trigger
    await problemTrigger.focus();
    await expect(problemTrigger).toBeFocused();
    
    // Press End to focus last
    await page.keyboard.press('End');
    await expect(resultsTrigger).toBeFocused();
  });

  test('toggles all sections with expand/collapse all button', async ({ page }) => {
    const expandAllButton = page.getByRole('button', { name: /expand all/i }).first();
    const problemTrigger = page.getByRole('button', { name: /problem statement/i }).first();
    const solutionTrigger = page.getByRole('button', { name: /solution design/i }).first();
    
    // Click expand all
    await expandAllButton.click();
    
    // All should be open
    await expect(problemTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(solutionTrigger).toHaveAttribute('aria-expanded', 'true');
    
    // Button text should change
    await expect(page.getByRole('button', { name: /collapse all/i }).first()).toBeVisible();
  });

  test('has proper ARIA attributes', async ({ page }) => {
    const problemTrigger = page.getByRole('button', { name: /problem statement/i }).first();
    
    // Check ARIA attributes
    await expect(problemTrigger).toHaveAttribute('aria-expanded');
    await expect(problemTrigger).toHaveAttribute('aria-controls');
    await expect(problemTrigger).toHaveAttribute('aria-describedby');
    await expect(problemTrigger).toHaveAttribute('role', 'button');
  });

  test('shows section numbers', async ({ page }) => {
    await expect(page.getByText('1 of 4')).toBeVisible();
    await expect(page.getByText('2 of 4')).toBeVisible();
    await expect(page.getByText('3 of 4')).toBeVisible();
    await expect(page.getByText('4 of 4')).toBeVisible();
  });

  test('renders expand/collapse all button with correct text', async ({ page }) => {
    // Initially should show "Expand All"
    await expect(page.getByRole('button', { name: /expand all/i }).first()).toBeVisible();
  });

  test('displays custom styling', async ({ page }) => {
    // Check that the custom styled case study has the blue border
    const customStyledCaseStudy = page.locator('.border-2.border-blue-200').first();
    await expect(customStyledCaseStudy).toBeVisible();
  });

  test('shows usage instructions', async ({ page }) => {
    await expect(page.getByText('How to Use')).toBeVisible();
    await expect(page.getByText('Keyboard Navigation:')).toBeVisible();
    await expect(page.getByText('Accessibility Features:')).toBeVisible();
  });

  test('is responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that the component is still visible and functional
    await expect(page.getByText('Test Case Study')).toBeVisible();
    
    // Test mobile interaction
    const problemTrigger = page.getByRole('button', { name: /problem statement/i }).first();
    await problemTrigger.click();
    await expect(problemTrigger).toHaveAttribute('aria-expanded', 'true');
  });

  test('maintains focus after section toggle', async ({ page }) => {
    const problemTrigger = page.getByRole('button', { name: /problem statement/i }).first();
    
    // Focus and toggle
    await problemTrigger.focus();
    await page.keyboard.press('Enter');
    
    // Focus should remain on the trigger
    await expect(problemTrigger).toBeFocused();
  });

  test('announces state changes to screen readers', async ({ page }) => {
    const problemTrigger = page.getByRole('button', { name: /problem statement/i }).first();
    
    // Check that aria-expanded changes appropriately
    await expect(problemTrigger).toHaveAttribute('aria-expanded', 'false');
    
    await problemTrigger.click();
    await expect(problemTrigger).toHaveAttribute('aria-expanded', 'true');
    
    await problemTrigger.click();
    await expect(problemTrigger).toHaveAttribute('aria-expanded', 'false');
  });
});
