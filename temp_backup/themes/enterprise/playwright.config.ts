import { defineConfig, devices } from '@playwright/test';

// Constants for better maintainability
const TEST_DIR = './tests';
const REDUCED_MOTION = 'reduce';
const DEV_SERVER_URL = 'http://localhost:3000';
const DEV_SERVER_TIMEOUT = 120 * 1000; // 2 minutes

// Shared configuration for hero testing projects
const heroTestConfig = {
	use: { 
		...devices['Desktop Chrome'],
		contextOptions: {
			reducedMotion: REDUCED_MOTION,
		},
	},
};

// Shared function for creating accessibility test configurations
const createAccessibilityConfig = (device: any, description: string) => ({
	use: { 
		...device,
		// Enable accessibility testing with reduced motion for consistent results
		contextOptions: {
			reducedMotion: REDUCED_MOTION,
		},
	},
	// Add description for better documentation
	description,
});

export default defineConfig({
	// Test directory containing all test files
	testDir: TEST_DIR,
	// Run tests in parallel for faster execution
	fullyParallel: true,
	// Prevent .only() tests in CI environment
	forbidOnly: !!process.env.CI,
	// Retry failed tests in CI (2 retries) but not locally for faster feedback
	retries: process.env.CI ? 2 : 0,
	// Use single worker in CI for stability, multiple workers locally for speed
	workers: process.env.CI ? 1 : undefined,
	// Use GitHub reporter in CI for PR comments, HTML reporter for local debugging
	reporter: process.env.CI ? [['github'], ['html']] : [['html']],
	// Global setup for handling missing snapshots
	globalSetup: require.resolve('./tests/global-setup.ts'),
	use: {
		// Base URL for all tests
		baseURL: DEV_SERVER_URL,
		// Enable tracing on first retry for debugging
		trace: 'on-first-retry',
		// Visual regression testing configuration
		screenshot: 'only-on-failure', // Capture screenshots only when tests fail
		video: 'retain-on-failure',    // Record videos only when tests fail
		// Increase timeout for page operations
		actionTimeout: 10000,
		navigationTimeout: 30000,
		// Visual comparison configuration
		expect: {
			// Threshold for visual comparisons (0.1% difference allowed)
			threshold: 0.1,
			// Animation handling for consistent screenshots
			animations: 'disabled',
		},
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] },
		},
		{
			name: 'webkit',
			use: { ...devices['Desktop Safari'] },
		},
		{
			name: 'Mobile Chrome',
			use: { ...devices['Pixel 5'] },
		},
		{
			name: 'Mobile Safari',
			use: { ...devices['iPhone 12'] },
		},
		{
			name: 'Tablet Chrome',
			use: { ...devices['iPad Pro'] },
		},
		{
			name: 'Tablet Safari',
			use: { ...devices['iPad (gen 7)'] },
		},
		{
			name: 'accessibility',
			...createAccessibilityConfig(devices['Desktop Chrome'], 'Desktop accessibility testing with reduced motion for consistent results'),
		},
		{
			name: 'accessibility-mobile',
			...createAccessibilityConfig(devices['Pixel 5'], 'Mobile accessibility testing with reduced motion for consistency'),
		},
		{
			name: 'hero-visual-regression',
			...heroTestConfig,
			// Hero visual regression testing - optimized for consistent screenshots
		},
		{
			name: 'hero-performance',
			...heroTestConfig,
			// Hero performance testing - optimized for Core Web Vitals measurement
		},
	],
	webServer: {
		command: 'npm run dev',
		url: DEV_SERVER_URL,
		reuseExistingServer: !process.env.CI,
		timeout: DEV_SERVER_TIMEOUT, // 2 minutes timeout for server startup
		stdout: 'pipe',
		stderr: 'pipe',
	},
});
