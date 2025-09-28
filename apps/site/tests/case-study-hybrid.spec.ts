import { expect, test } from '@playwright/test';

test.describe('Case Study Hybrid Implementation', () => {
	test('should display React-based case study page correctly', async ({ page }) => {
		// Navigate to the new React-based case study page
		await page.goto('/case-studies/tendril-multi-tenant-chatbot-saas');

		// Wait for page to load completely
		await page.waitForLoadState('networkidle');

		// Check that the page loads without errors
		await expect(page).toHaveTitle(/Tendril Multi-Tenant Chatbot SaaS.*Case Study/);

		// Verify the main content sections are present
		await expect(page.locator('h1')).toContainText('Tendril Multi-Tenant Chatbot SaaS');
		await expect(page.locator('#problem-statement')).toBeVisible();
		await expect(page.locator('#research-analysis')).toBeVisible();
		await expect(page.locator('#solution-design')).toBeVisible();
		await expect(page.locator('#implementation')).toBeVisible();
		await expect(page.locator('#results-metrics')).toBeVisible();
		await expect(page.locator('#lessons-learned')).toBeVisible();
		await expect(page.locator('#next-steps')).toBeVisible();

		// Check that React components are rendering correctly
		await expect(page.locator('table')).toBeVisible(); // Comparison table
		await expect(page.locator('#results-metrics .grid').first()).toBeVisible(); // KPIs grid

		// Verify the table of contents sidebar
		await expect(page.locator('nav').filter({ hasText: 'Problem Statement' })).toBeVisible();
		await expect(page.locator('nav').filter({ hasText: 'Research & Analysis' })).toBeVisible();
		await expect(page.locator('nav').filter({ hasText: 'Solution Design' })).toBeVisible();

		// Check that animations are working (Framer Motion)
		// Note: Framer Motion elements don't always have data-framer-motion attribute

		// Verify the CTA section
		await expect(page.getByRole('button', { name: 'Start a conversation' })).toBeVisible();
	});

	test('should display chart components correctly', async ({ page }) => {
		await page.goto('/case-studies/tendril-multi-tenant-chatbot-saas');

		// Wait for page to load completely
		await page.waitForLoadState('networkidle');

		// Check that chart components are present
		await expect(page.locator('#results-metrics svg')).toBeVisible(); // Pie charts
		await expect(page.locator('#results-metrics .h-48').first()).toBeVisible(); // Line charts
		
		// Check bar charts - expect multiple containers
		const barChartContainers = page.locator('#results-metrics .space-y-3');
		await expect(barChartContainers).toHaveCount(3);
		await expect(barChartContainers.first()).toBeVisible();

		// Verify chart titles are displayed
		await expect(page.locator('text=Market Share by Platform')).toBeVisible();
		await expect(page.locator('text=User Complaints Analysis')).toBeVisible();
		await expect(page.locator('text=Feature Completion Over Time')).toBeVisible();
		await expect(page.locator('text=User Growth Over Time')).toBeVisible();
		await expect(page.locator('text=Revenue by Plan Type')).toBeVisible();
		await expect(page.locator('text=Satisfaction Scores by Category')).toBeVisible();
		await expect(page.locator('text=Feature Development Timeline')).toBeVisible();

		// Check that chart data is displayed - use first() to avoid strict mode violations
		await expect(page.locator('text=Intercom: 35').first()).toBeVisible();
		await expect(page.locator('text=Hidden Costs: 85').first()).toBeVisible();
		await expect(page.locator('text=Pro Plan ($49): 65').first()).toBeVisible();
		await expect(page.locator('text=Ease of Setup: 90').first()).toBeVisible();
	});

	test('should have proper SEO meta tags', async ({ page }) => {
		await page.goto('/case-studies/tendril-multi-tenant-chatbot-saas');

		// Check meta tags
		await expect(page.locator('meta[name="description"]')).toHaveAttribute(
			'content',
			/How we built a multi-tenant chatbot platform/,
		);
		await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
			'content',
			/Tendril Multi-Tenant Chatbot SaaS/,
		);
		await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
			'content',
			/How we built a multi-tenant chatbot platform/,
		);
	});

	test('should be responsive on mobile devices', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/case-studies/tendril-multi-tenant-chatbot-saas');

		// Check that content is properly responsive
		await expect(page.locator('h1')).toBeVisible();
		await expect(page.locator('#problem-statement')).toBeVisible();

		// Verify table of contents is hidden on mobile (sidebar)
		const sidebar = page.locator('.hidden.lg\\:block');
		await expect(sidebar).not.toBeVisible();

		// Check that charts are still visible on mobile
		await expect(page.locator('#results-metrics svg')).toBeVisible();
		await expect(page.locator('#results-metrics .h-48').first()).toBeVisible();
	});

	test('should have working navigation links', async ({ page }) => {
		await page.goto('/case-studies/tendril-multi-tenant-chatbot-saas');

		// Test table of contents navigation
		await page.click('a[href="#problem-statement"]');
		await expect(page.locator('#problem-statement')).toBeInViewport();

		await page.click('a[href="#research-analysis"]');
		await expect(page.locator('#research-analysis')).toBeInViewport();

		await page.click('a[href="#solution-design"]');
		await expect(page.locator('#solution-design')).toBeInViewport();
	});

	test('should display case study data correctly', async ({ page }) => {
		await page.goto('/case-studies/tendril-multi-tenant-chatbot-saas');

		// Check that the case study data is displayed correctly
		await expect(page.locator('text=Case Study')).toBeVisible();
		await expect(page.locator('text=December 15, 2024')).toBeVisible();

		// Check tags
		await expect(page.locator('text=#case-study')).toBeVisible();
		await expect(page.locator('text=#saas')).toBeVisible();
		await expect(page.locator('text=#chatbot')).toBeVisible();
		await expect(page.locator('text=#startup')).toBeVisible();
	});

	test('should have proper accessibility features', async ({ page }) => {
		await page.goto('/case-studies/tendril-multi-tenant-chatbot-saas');

		// Check that headings have proper hierarchy
		const h1 = page.locator('h1');
		const h2s = page.locator('h2');

		await expect(h1).toHaveCount(1);
		await expect(h2s).toHaveCount(7); // 7 main sections

		// Check that sections have proper IDs for navigation
		await expect(page.locator('#problem-statement')).toBeVisible();
		await expect(page.locator('#research-analysis')).toBeVisible();
		await expect(page.locator('#solution-design')).toBeVisible();
		await expect(page.locator('#implementation')).toBeVisible();
		await expect(page.locator('#results-metrics')).toBeVisible();
		await expect(page.locator('#lessons-learned')).toBeVisible();
		await expect(page.locator('#next-steps')).toBeVisible();
	});

	test('should load without critical console errors', async ({ page }) => {
		const consoleErrors: string[] = [];

		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				// Filter out speech recognition errors which are not critical
				if (!msg.text().includes('speech recognition') && !msg.text().includes('SpeechRecognition')) {
					consoleErrors.push(msg.text());
				}
			}
		});

		await page.goto('/case-studies/tendril-multi-tenant-chatbot-saas');

		// Wait for page to fully load
		await page.waitForLoadState('networkidle');

		// Check that there are no critical console errors
		expect(consoleErrors).toHaveLength(0);
	});

	test('should have interactive chart elements', async ({ page }) => {
		await page.goto('/case-studies/tendril-multi-tenant-chatbot-saas');

		// Wait for page to load completely
		await page.waitForLoadState('networkidle');

		// Check that chart elements are present
		const pieChartPaths = page.locator('#results-metrics svg path');
		await expect(pieChartPaths).toHaveCount(5); // 5 segments in pie chart

		// Check bar chart elements - use first() to avoid strict mode violation
		const barChartContainers = page.locator('#results-metrics .space-y-3');
		await expect(barChartContainers).toHaveCount(3); // Should have 3 bar chart containers
		await expect(barChartContainers.first()).toBeVisible();

		// Check for specific bar chart items - use more specific selectors
		await expect(page.locator('text=Hidden Costs').first()).toBeVisible();
		await expect(page.locator('text=Setup Complexity').first()).toBeVisible();
		await expect(page.locator('text=Poor AI Responses').first()).toBeVisible();
		await expect(page.locator('text=Limited Features').first()).toBeVisible();
		await expect(page.locator('text=Support Issues').first()).toBeVisible();

		// Check line chart elements - expect multiple containers
		const lineChartContainers = page.locator('#results-metrics .h-48');
		await expect(lineChartContainers).toHaveCount(3); // Should have 3 line chart containers
		await expect(lineChartContainers.first()).toBeVisible();

		// Verify chart legends are present - use first() to avoid strict mode violations
		await expect(page.locator('text=Intercom: 35').first()).toBeVisible();
		await expect(page.locator('text=Hidden Costs: 85').first()).toBeVisible();
		await expect(page.locator('text=Pro Plan ($49): 65').first()).toBeVisible();
	});

	test('should display metrics and KPIs correctly', async ({ page }) => {
		await page.goto('/case-studies/tendril-multi-tenant-chatbot-saas');

		// Check that key metrics are displayed
		await expect(page.locator('#results-metrics').getByText('47')).toBeVisible(); // First Month Sign-ups
		await expect(page.locator('#results-metrics').getByText('23 (49%)')).toBeVisible(); // Paid Conversions
		await expect(page.locator('#results-metrics').getByText('Advanced')).toBeVisible(); // AI Integration
		await expect(page.locator('#results-metrics').getByText('18 minutes')).toBeVisible(); // Avg Setup Time

		// Check business impact metrics
		await expect(page.locator('#results-metrics').getByText('$3,400')).toBeVisible(); // MRR
		await expect(page.locator('#results-metrics').getByText('$67')).toBeVisible(); // ARPU
		await expect(page.locator('#results-metrics').getByText('$23')).toBeVisible(); // CAC
		await expect(page.locator('#results-metrics').getByText('72')).toBeVisible(); // NPS Score
	});
});
