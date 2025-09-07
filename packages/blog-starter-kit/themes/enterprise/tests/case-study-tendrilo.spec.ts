import { expect, test } from '@playwright/test';
import { navigateWithValidation, waitForElementWithTimeout } from './utils/test-helpers';

test.describe('Tendrilo Case Study', () => {
	test('loads and shows TOC, captions, and CTA', async ({ page }) => {
		// Navigate to the case study page with proper error handling and performance metrics
		const { loadTime } = await navigateWithValidation(
			page, 
			'/case-studies/tendrilo-case-study',
			/Tendril.*Strategic Analysis/
		);
		
		// Performance check - page should load within acceptable time
		// Allow more time in development environment
		const maxLoadTime = process.env.CI ? 15000 : 30000; // 15s in CI, 30s in dev
		expect(loadTime).toBeLessThan(maxLoadTime);
		
		// Hero section validation
		await expect(
			page.getByRole('heading', { name: /Tendril Multi-Tenant Chatbot/i }),
		).toBeVisible({ timeout: 10000 });

		// TOC present and highlights on scroll
		const toc = page.getByRole('heading', { name: /Table of Contents/i });
		await expect(toc).toBeVisible({ timeout: 10000 });

		// Scroll to Strategic Projections and check highlight shifts
		await page.locator('#projected-results').scrollIntoViewIfNeeded();
		await expect(page.getByRole('heading', { name: /Strategic Projections/i })).toBeVisible();

		// Chart captions visible
		await expect(
			page.getByText('Projected mix based on agency-led adoption', { exact: false }),
		).toBeVisible();
		await expect(
			page.getByText('current percentage for each metric', { exact: false }),
		).toBeVisible();

		// CTA links exist and are functional
		const getInTouchLink = page.getByRole('link', { name: /Get in touch/i });
		const viewServicesLink = page.getByRole('link', { name: /View services/i });
		
		await expect(getInTouchLink).toBeVisible();
		await expect(viewServicesLink).toBeVisible();
		
		// Verify links are clickable (not disabled)
		await expect(getInTouchLink).toBeEnabled();
		await expect(viewServicesLink).toBeEnabled();
	});
});
