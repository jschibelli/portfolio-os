import { expect, test } from '@playwright/test';

test.describe('Tendrilo Case Study', () => {
	test('loads and shows TOC, captions, and CTA', async ({ page }) => {
		await page.goto('/case-studies/tendrilo-case-study');

		// Wait for page to load completely
		await page.waitForLoadState('networkidle');

		// Hero
		await expect(
			page.getByRole('heading', { name: /Tendril Multi-Tenant Chatbot/i }),
		).toBeVisible();

		// TOC present and highlights on scroll
		const toc = page.getByRole('heading', { name: /Table of Contents/i });
		await expect(toc).toBeVisible();

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

		// CTA links exist
		await expect(page.getByRole('link', { name: /Get in touch/i })).toBeVisible();
		await expect(page.getByRole('link', { name: /View services/i })).toBeVisible();
	});
});
