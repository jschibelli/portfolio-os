import { test, expect } from '@playwright/test';
import { 
	runComprehensiveAccessibilityTest,
	testKeyboardNavigation,
	testSpecificAccessibilityRules,
	navigateWithValidation
} from './utils/test-helpers';

test.describe('Accessibility Tests', () => {
	test('Homepage should meet comprehensive WCAG standards', async ({ page }) => {
		await runComprehensiveAccessibilityTest(page, 'Homepage', '/');
	});

	test('Blog page should meet comprehensive WCAG standards', async ({ page }) => {
		await runComprehensiveAccessibilityTest(page, 'Blog page', '/blog');
	});

	test('Case studies page should meet comprehensive WCAG standards', async ({ page }) => {
		await runComprehensiveAccessibilityTest(page, 'Case studies page', '/case-studies');
	});

	test('Contact page should meet comprehensive WCAG standards', async ({ page }) => {
		await runComprehensiveAccessibilityTest(page, 'Contact page', '/contact');
	});

	test('About page should meet comprehensive WCAG standards', async ({ page }) => {
		await runComprehensiveAccessibilityTest(page, 'About page', '/about');
	});

	test('Portfolio page should meet comprehensive WCAG standards', async ({ page }) => {
		await runComprehensiveAccessibilityTest(page, 'Portfolio page', '/portfolio');
	});

	test('Navigation should be keyboard accessible', async ({ page }) => {
		await navigateWithValidation(page, '/');
		await testKeyboardNavigation(page, 5);
	});

	test('Color contrast should meet WCAG AA standards', async ({ page }) => {
		await testSpecificAccessibilityRules(
			page,
			'/',
			['color-contrast', 'color-contrast-enhanced'],
			'Homepage'
		);
	});

	test('Forms should have proper labels and ARIA attributes', async ({ page }) => {
		await testSpecificAccessibilityRules(
			page,
			'/contact',
			['label', 'select-name', 'input-button-name'],
			'Contact page'
		);
	});

	test('Images should have proper alt text', async ({ page }) => {
		await testSpecificAccessibilityRules(
			page,
			'/',
			['image-alt', 'role-img-alt'],
			'Homepage'
		);
	});

	test('Headings should have proper structure', async ({ page }) => {
		await testSpecificAccessibilityRules(
			page,
			'/',
			['heading-order', 'page-has-heading-one'],
			'Homepage'
		);
	});
});
