import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	// Test directory containing all test files
	testDir: './tests',
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
		baseURL: 'http://localhost:3000',
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
			name: 'accessibility',
			use: { 
				...devices['Desktop Chrome'],
				// Enable accessibility testing
				contextOptions: {
					reducedMotion: 'reduce',
				},
			},
		},
	],
	webServer: {
		command: 'npm run dev',
		url: 'http://localhost:3000',
		reuseExistingServer: !process.env.CI,
		timeout: 120 * 1000, // 2 minutes timeout for server startup
		stdout: 'pipe',
		stderr: 'pipe',
	},
});
