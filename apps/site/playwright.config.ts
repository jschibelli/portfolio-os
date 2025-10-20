import { defineConfig, devices } from '@playwright/test';

// Environment configuration
const useProdServer = process.env.PW_USE_BUILD === '1'
const isCI = !!process.env.CI
const isCIDebug = process.env.CI_DEBUG === '1'

// Timeout configurations (in milliseconds)
const TIMEOUTS = {
	// Test execution timeouts
	test: isCI ? 60000 : 30000,           // Overall test timeout
	expect: isCI ? 10000 : 5000,          // Assertion timeout
	
	// Page operation timeouts
	action: 10000,                         // Click, fill, etc.
	navigation: isCI ? 60000 : 30000,      // Page.goto, etc.
	
	// API and network timeouts
	apiCall: 15000,                        // API response timeout
	
	// Animation timeouts
	animation: 600,                        // Wait for animations
}

export default defineConfig({
	// Test directory containing all test files
	testDir: './tests',
	
	// Test execution settings
	fullyParallel: true,
	forbidOnly: isCI,
	
	// Retry configuration
	retries: isCI ? 2 : 0,
	
	// Worker configuration for parallel execution
	workers: isCI ? 1 : undefined,
	
	// Test timeout
	timeout: TIMEOUTS.test,
	
	// Reporter configuration
	reporter: isCI 
		? [
			['github'],
			['html', { open: 'never' }],
			['json', { outputFile: 'test-results/results.json' }],
		]
		: [
			['html', { open: 'on-failure' }],
			['list'],
		],
	
	// Global setup for handling missing snapshots and environment preparation
	globalSetup: require.resolve('./tests/global-setup.ts'),
	
	// Shared test configuration
	use: {
		// Base URL for all tests
		baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
		
		// Tracing configuration
		trace: isCIDebug ? 'on' : 'on-first-retry',
		
		// Screenshot configuration
		screenshot: isCI ? 'only-on-failure' : 'off',
		
		// Video configuration
		video: isCI ? 'retain-on-failure' : 'off',
		
		// Timeout configuration
		actionTimeout: TIMEOUTS.action,
		navigationTimeout: TIMEOUTS.navigation,
		
		// Visual comparison configuration
		expect: {
			timeout: TIMEOUTS.expect,
			// Threshold for visual comparisons (0.1% difference allowed)
			toHaveScreenshot: {
				threshold: 0.1,
				maxDiffPixels: 100,
				animations: 'disabled',
			},
			// Threshold for visual comparisons
			toMatchSnapshot: {
				threshold: 0.1,
				maxDiffPixels: 100,
			},
		},
		
		// Browser context options
		contextOptions: {
			// Permissions
			permissions: [],
			// Geolocation (optional)
			// geolocation: { longitude: -122.4194, latitude: 37.7749 },
			// locale: 'en-US',
			// timezoneId: 'America/Los_Angeles',
		},
		
		// Ignore HTTPS errors in development
		ignoreHTTPSErrors: !isCI,
		
		// User agent for all tests
		// userAgent: 'Playwright Test Bot',
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
			use: { 
				...devices['Desktop Chrome'],
				// Enable accessibility testing
				contextOptions: {
					reducedMotion: 'reduce',
				},
			},
		},
		{
			name: 'accessibility-mobile',
			use: { 
				...devices['Pixel 5'],
				// Enable accessibility testing on mobile
				contextOptions: {
					reducedMotion: 'reduce',
				},
			},
		},
	],
	webServer: {
		command: useProdServer ? 'pnpm --filter @mindware-blog/site start' : 'npm run dev',
		url: 'http://localhost:3000',
		reuseExistingServer: !process.env.CI,
		timeout: 120 * 1000,
		stdout: 'pipe',
		stderr: 'pipe',
	},
});
