import { Page, expect, Route } from '@playwright/test'
import * as axe from 'axe-core'

// =============================================================================
// CONSTANTS & THRESHOLDS
// =============================================================================

export const PERFORMANCE_THRESHOLDS = {
	maxLoadMsCI: 15000,
	maxLoadMsDev: 30000,
	PAGE_LOAD_MAX: 30000, // Alias for backwards compatibility with existing tests
}

export const ANIMATION_TIMEOUTS = {
	short: 300,    // For quick transitions
	medium: 600,   // For standard animations
	long: 1000,    // For complex animations
}

// =============================================================================
// NAVIGATION & PERFORMANCE
// =============================================================================

/**
 * Navigate to a URL with validation and performance tracking
 * @param page - Playwright Page object
 * @param url - URL to navigate to
 * @param expectedTitle - Expected page title (optional)
 * @returns Response, load time, and success status
 */
export async function navigateWithValidation(page: Page, url: string, expectedTitle?: string | RegExp) {
	const response = await page.goto(url, { waitUntil: 'load' })
	const start = Date.now()
	await page.waitForLoadState('networkidle')
	const loadTime = Date.now() - start
	if (expectedTitle) {
		const title = await page.title()
		expect(title).toEqual(expectedTitle)
	}
	return { response, loadTime, success: !!response && response.ok() }
}

/**
 * Test page performance against thresholds
 * @param page - Playwright Page object
 * @param url - URL to test
 * @param maxMs - Maximum load time in milliseconds (optional)
 * @returns Load time
 */
export async function testPagePerformance(page: Page, url: string, maxMs?: number) {
	const { loadTime } = await navigateWithValidation(page, url)
	expect(loadTime).toBeLessThan(maxMs ?? PERFORMANCE_THRESHOLDS.maxLoadMsDev)
	return { loadTime }
}

// =============================================================================
// ACCESSIBILITY TESTING
// =============================================================================

/**
 * Run comprehensive accessibility test using axe-core
 * @param page - Playwright Page object
 * @param name - Test name for logging
 * @param url - URL to test
 * @returns axe results
 */
export async function runComprehensiveAccessibilityTest(page: Page, name: string, url: string) {
	await page.goto(url)
	// Inject axe
	await page.addScriptTag({ content: axe.source })
	const results = await page.evaluate(async () => {
		// @ts-ignore
		return await window.axe.run(document, {
			runOnly: ['wcag2a', 'wcag2aa', 'best-practice'],
			resultTypes: ['violations'],
		})
	})
	if (results.violations.length > 0) {
		console.log(`♿ Accessibility violations on ${name}:`)
		for (const v of results.violations) {
			console.log(`- ${v.id}: ${v.help}`)
		}
	}
	expect(results.violations).toEqual([])
	return results
}

/**
 * Test specific accessibility rules
 * @param page - Playwright Page object
 * @param url - URL to test
 * @param rules - Array of axe rule IDs to test
 * @param contextName - Context name for logging
 * @returns axe results
 */
export async function testSpecificAccessibilityRules(
	page: Page,
	url: string,
	rules: string[],
	contextName: string,
) {
	await page.goto(url)
	await page.addScriptTag({ content: axe.source })
	const results = await page.evaluate(async (ids: string[]) => {
		// @ts-ignore
		return await window.axe.run(document, { runOnly: { type: 'rule', values: ids } })
	}, rules)
	if (results.violations.length > 0) {
		console.log(`♿ Accessibility rule violations on ${contextName}:`)
		for (const v of results.violations) console.log(`- ${v.id}: ${v.help}`)
	}
	expect(results.violations).toEqual([])
	return results
}

// =============================================================================
// AUTHENTICATION MOCKING
// =============================================================================

/**
 * Mock an authenticated session for testing
 * @param page - Playwright Page object
 * @param userData - User data to mock (optional)
 */
export async function mockAuthSession(
	page: Page, 
	userData?: {
		id?: string
		email?: string
		name?: string
		role?: string
	}
) {
	const mockUser = {
		id: userData?.id || 'test-user-123',
		email: userData?.email || 'test@example.com',
		name: userData?.name || 'Test User',
		role: userData?.role || 'user',
	}

	// Mock the session in localStorage
	await page.addInitScript((user) => {
		localStorage.setItem('auth-session', JSON.stringify({
			user,
			accessToken: 'mock-access-token',
			expiresAt: Date.now() + 3600000, // 1 hour from now
		}))
	}, mockUser)

	// Mock the session cookie
	await page.context().addCookies([{
		name: 'next-auth.session-token',
		value: 'mock-session-token',
		domain: 'localhost',
		path: '/',
		httpOnly: true,
		sameSite: 'Lax',
		expires: Math.floor(Date.now() / 1000) + 3600,
	}])

	return mockUser
}

/**
 * Clear authentication session
 * @param page - Playwright Page object
 */
export async function clearAuthSession(page: Page) {
	await page.evaluate(() => {
		localStorage.removeItem('auth-session')
		sessionStorage.clear()
	})
	await page.context().clearCookies()
}

// =============================================================================
// API MOCKING
// =============================================================================

/**
 * Mock an API response
 * @param page - Playwright Page object
 * @param urlPattern - URL pattern to match (string or regex)
 * @param responseData - Response data to return
 * @param status - HTTP status code (default: 200)
 */
export async function mockAPIResponse(
	page: Page,
	urlPattern: string | RegExp,
	responseData: any,
	status: number = 200
) {
	await page.route(urlPattern, (route: Route) => {
		route.fulfill({
			status,
			contentType: 'application/json',
			body: JSON.stringify(responseData),
		})
	})
}

/**
 * Mock newsletter subscription API
 * @param page - Playwright Page object
 * @param success - Whether the subscription should succeed
 */
export async function mockNewsletterAPI(page: Page, success: boolean = true) {
	await page.route('**/api/newsletter/subscribe', (route: Route) => {
		if (success) {
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					success: true,
					message: 'Successfully subscribed to newsletter',
				}),
			})
		} else {
			route.fulfill({
				status: 400,
				contentType: 'application/json',
				body: JSON.stringify({
					success: false,
					error: 'Email already subscribed',
				}),
			})
		}
	})
}

/**
 * Mock booking system API
 * @param page - Playwright Page object
 * @param availableSlots - Available time slots
 */
export async function mockBookingAPI(
	page: Page, 
	availableSlots?: string[]
) {
	const defaultSlots = [
		'2025-10-15T10:00:00Z',
		'2025-10-15T14:00:00Z',
		'2025-10-16T09:00:00Z',
	]

	// Mock get available slots
	await page.route('**/api/booking/slots*', (route: Route) => {
		route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				slots: availableSlots || defaultSlots,
			}),
		})
	})

	// Mock create booking
	await page.route('**/api/booking/create', (route: Route) => {
		route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				success: true,
				bookingId: 'mock-booking-123',
				confirmationEmail: 'sent',
			}),
		})
	})
}

/**
 * Mock contact form API
 * @param page - Playwright Page object
 * @param success - Whether the submission should succeed
 */
export async function mockContactFormAPI(page: Page, success: boolean = true) {
	await page.route('**/api/contact', (route: Route) => {
		if (success) {
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					success: true,
					message: 'Message sent successfully',
				}),
			})
		} else {
			route.fulfill({
				status: 500,
				contentType: 'application/json',
				body: JSON.stringify({
					success: false,
					error: 'Failed to send message',
				}),
			})
		}
	})
}

// =============================================================================
// FORM TESTING
// =============================================================================

/**
 * Test form validation behavior
 * @param page - Playwright Page object
 * @param formSelector - CSS selector for the form
 * @param fieldTests - Array of field test configurations
 */
export async function testFormValidation(
	page: Page,
	formSelector: string,
	fieldTests: Array<{
		fieldSelector: string
		invalidValue: string
		validValue: string
		expectedError?: string
	}>
) {
	const form = page.locator(formSelector)
	await expect(form).toBeVisible()

	for (const test of fieldTests) {
		const field = page.locator(test.fieldSelector)
		
		// Test invalid value
		await field.fill(test.invalidValue)
		await field.blur()
		
		if (test.expectedError) {
			const errorMessage = page.locator(`text=${test.expectedError}`).first()
			await expect(errorMessage).toBeVisible()
		}
		
		// Test valid value
		await field.fill(test.validValue)
		await field.blur()
		
		if (test.expectedError) {
			const errorMessage = page.locator(`text=${test.expectedError}`).first()
			await expect(errorMessage).not.toBeVisible()
		}
	}
}

// =============================================================================
// COMPONENT INTERACTION TESTING
// =============================================================================

/**
 * Test interactive component behavior
 * @param page - Playwright Page object
 * @param componentSelector - CSS selector for the component
 * @param interactions - Array of interaction tests
 */
export async function testInteractiveComponent(
	page: Page,
	componentSelector: string,
	interactions: Array<{
		action: 'click' | 'hover' | 'focus' | 'type'
		target?: string // Relative to component, if not provided uses component itself
		value?: string  // For 'type' action
		expectedResult: {
			selector: string
			state: 'visible' | 'hidden' | 'enabled' | 'disabled' | 'focused'
		}
	}>
) {
	const component = page.locator(componentSelector)
	await expect(component).toBeVisible()

	for (const interaction of interactions) {
		const target = interaction.target 
			? component.locator(interaction.target)
			: component

		// Perform action
		switch (interaction.action) {
			case 'click':
				await target.click()
				break
			case 'hover':
				await target.hover()
				break
			case 'focus':
				await target.focus()
				break
			case 'type':
				if (interaction.value) {
					await target.fill(interaction.value)
				}
				break
		}

		// Wait for animation to complete
		await page.waitForTimeout(ANIMATION_TIMEOUTS.medium)

		// Verify expected result
		const resultElement = page.locator(interaction.expectedResult.selector)
		switch (interaction.expectedResult.state) {
			case 'visible':
				await expect(resultElement).toBeVisible()
				break
			case 'hidden':
				await expect(resultElement).not.toBeVisible()
				break
			case 'enabled':
				await expect(resultElement).toBeEnabled()
				break
			case 'disabled':
				await expect(resultElement).toBeDisabled()
				break
			case 'focused':
				await expect(resultElement).toBeFocused()
				break
		}
	}
}

// =============================================================================
// ANIMATION HANDLING
// =============================================================================

/**
 * Wait for Framer Motion or CSS animations to complete
 * @param page - Playwright Page object
 * @param selector - CSS selector for animated element (optional)
 * @param timeout - Timeout duration in ms
 */
export async function waitForAnimation(
	page: Page, 
	selector?: string,
	timeout: number = ANIMATION_TIMEOUTS.medium
) {
	if (selector) {
		const element = page.locator(selector)
		await expect(element).toBeVisible()
		await page.waitForTimeout(timeout)
		
		// Wait for animation to complete by checking if element is stable
		await element.evaluate((el) => {
			return new Promise<void>((resolve) => {
				const observer = new IntersectionObserver((entries) => {
					if (entries[0].isIntersecting) {
						setTimeout(() => {
							observer.disconnect()
							resolve()
						}, 100)
					}
				})
				observer.observe(el)
			})
		})
	} else {
		// Just wait for the specified timeout
		await page.waitForTimeout(timeout)
	}
}

// =============================================================================
// RESPONSIVE DESIGN TESTING
// =============================================================================

/**
 * Test responsive design behavior across viewports
 * @param page - Playwright Page object
 * @param url - URL to test
 * @param tests - Viewport test configurations
 */
export async function testResponsiveDesign(
	page: Page,
	url: string,
	tests: Array<{
		viewport: { width: number; height: number }
		expectations: Array<{
			selector: string
			shouldBeVisible: boolean
		}>
	}>
) {
	for (const test of tests) {
		// Set viewport
		await page.setViewportSize(test.viewport)
		
		// Navigate if not already on page
		if (page.url() !== url) {
			await page.goto(url)
		}
		
		// Wait for layout to stabilize
		await page.waitForTimeout(ANIMATION_TIMEOUTS.short)
		
		// Check expectations
		for (const expectation of test.expectations) {
			const element = page.locator(expectation.selector)
			if (expectation.shouldBeVisible) {
				await expect(element).toBeVisible()
			} else {
				await expect(element).not.toBeVisible()
			}
		}
	}
}

// =============================================================================
// KEYBOARD NAVIGATION
// =============================================================================

/**
 * Test keyboard navigation for accessibility
 * @param page - Playwright Page object
 * @param maxTabs - Maximum number of tab presses to test
 */
export async function testKeyboardNavigation(page: Page, maxTabs: number = 5) {
	await page.keyboard.press('Tab')
	
	// Check if focus is visible and properly managed
	const focusedElement = await page.evaluate(() => {
		const active = document.activeElement
		return active ? {
			tagName: active.tagName,
			textContent: active.textContent?.slice(0, 50),
			hasFocusVisible: active.matches(':focus-visible')
		} : null
	})
	
	expect(focusedElement).not.toBeNull()
	
	// Test tab navigation through main navigation with focus tracking
	const focusHistory = []
	for (let i = 0; i < maxTabs; i++) {
		await page.keyboard.press('Tab')
		const currentFocus = await page.evaluate(() => {
			const active = document.activeElement
			return active ? {
				tagName: active.tagName,
				textContent: active.textContent?.slice(0, 30)
			} : null
		})
		focusHistory.push(currentFocus)
	}
	
	// Verify focus management - should have moved through different elements
	expect(focusHistory.filter(f => f !== null).length).toBeGreaterThan(1)
}

// =============================================================================
// STORAGE MOCKING
// =============================================================================

/**
 * Mock localStorage data
 * @param page - Playwright Page object
 * @param data - Key-value pairs to store
 */
export async function mockLocalStorage(page: Page, data: Record<string, any>) {
	await page.addInitScript((storageData) => {
		for (const [key, value] of Object.entries(storageData)) {
			localStorage.setItem(
				key,
				typeof value === 'string' ? value : JSON.stringify(value)
			)
		}
	}, data)
}

/**
 * Mock sessionStorage data
 * @param page - Playwright Page object
 * @param data - Key-value pairs to store
 */
export async function mockSessionStorage(page: Page, data: Record<string, any>) {
	await page.addInitScript((storageData) => {
		for (const [key, value] of Object.entries(storageData)) {
			sessionStorage.setItem(
				key,
				typeof value === 'string' ? value : JSON.stringify(value)
			)
		}
	}, data)
}

/**
 * Clear all storage (localStorage, sessionStorage, cookies)
 * @param page - Playwright Page object
 */
export async function clearAllStorage(page: Page) {
	await page.evaluate(() => {
		localStorage.clear()
		sessionStorage.clear()
	})
	await page.context().clearCookies()
}


