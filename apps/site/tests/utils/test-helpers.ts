import { Page, expect } from '@playwright/test'
import axe from 'axe-core'

export const PERFORMANCE_THRESHOLDS = {
	maxLoadMsCI: 15000,
	maxLoadMsDev: 30000,
}

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

export async function testPagePerformance(page: Page, url: string, maxMs?: number) {
	const { loadTime } = await navigateWithValidation(page, url)
	expect(loadTime).toBeLessThan(maxMs ?? PERFORMANCE_THRESHOLDS.maxLoadMsDev)
	return { loadTime }
}

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


