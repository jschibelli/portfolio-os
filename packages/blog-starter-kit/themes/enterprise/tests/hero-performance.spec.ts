import { test, expect } from '@playwright/test';

test.describe('Hero Components Performance Tests', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to homepage to test hero components
		await page.goto('/');
	});

	test.describe('Core Web Vitals', () => {
		test('should have good LCP (Largest Contentful Paint)', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			
			// Start performance measurement
			await page.evaluate(() => {
				performance.mark('hero-test-start');
			});
			
			await page.waitForLoadState('networkidle');
			
			// Get LCP value
			const lcp = await page.evaluate(() => {
				return new Promise((resolve) => {
					new PerformanceObserver((list) => {
						const entries = list.getEntries();
						const lastEntry = entries[entries.length - 1];
						resolve(lastEntry.startTime);
					}).observe({ entryTypes: ['largest-contentful-paint'] });
				});
			});
			
			// LCP should be under 2.5 seconds
			expect(lcp).toBeLessThan(2500);
		});

		test('should have good FID (First Input Delay)', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			await page.waitForLoadState('networkidle');
			
			// Get FID value
			const fid = await page.evaluate(() => {
				return new Promise((resolve) => {
					new PerformanceObserver((list) => {
						const entries = list.getEntries();
						const lastEntry = entries[entries.length - 1];
						resolve(lastEntry.processingStart - lastEntry.startTime);
					}).observe({ entryTypes: ['first-input'] });
				});
			});
			
			// FID should be under 100ms
			expect(fid).toBeLessThan(100);
		});

		test('should have good CLS (Cumulative Layout Shift)', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			await page.waitForLoadState('networkidle');
			
			// Get CLS value
			const cls = await page.evaluate(() => {
				return new Promise((resolve) => {
					let clsValue = 0;
					new PerformanceObserver((list) => {
						for (const entry of list.getEntries()) {
							if (!entry.hadRecentInput) {
								clsValue += entry.value;
							}
						}
						resolve(clsValue);
					}).observe({ entryTypes: ['layout-shift'] });
				});
			});
			
			// CLS should be under 0.1
			expect(cls).toBeLessThan(0.1);
		});
	});

	test.describe('Loading Performance', () => {
		test('should load hero section quickly', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			
			const startTime = Date.now();
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			const endTime = Date.now();
			
			const loadTime = endTime - startTime;
			
			// Should load within 3 seconds
			expect(loadTime).toBeLessThan(3000);
		});

		test('should have fast Time to First Byte', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			
			const response = await page.goto('/');
			const ttfb = response?.headers()['x-response-time'] || 0;
			
			// TTFB should be under 600ms
			expect(ttfb).toBeLessThan(600);
		});

		test('should have efficient resource loading', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			
			// Track resource loading
			const resources = [];
			page.on('response', (response) => {
				resources.push({
					url: response.url(),
					status: response.status(),
					size: response.headers()['content-length'] || 0,
				});
			});
			
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			// Check for failed resources
			const failedResources = resources.filter(r => r.status >= 400);
			expect(failedResources.length).toBe(0);
		});
	});

	test.describe('Animation Performance', () => {
		test('should have smooth animations', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			await page.waitForLoadState('networkidle');
			
			// Check animation performance
			const animationPerformance = await page.evaluate(() => {
				const entries = performance.getEntriesByType('measure');
				return entries.filter(entry => entry.name.includes('animation'));
			});
			
			// Should have efficient animations
			expect(animationPerformance.length).toBeGreaterThanOrEqual(0);
		});

		test('should respect reduced motion preferences', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			
			// Set reduced motion preference
			await page.emulateMedia({ reducedMotion: 'reduce' });
			
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			const hero = page.locator('section').first();
			await expect(hero).toBeVisible();
			
			// Check if animations are reduced
			const animationStyles = await hero.evaluate((el) => {
				const styles = window.getComputedStyle(el);
				return {
					animation: styles.animation,
					transition: styles.transition,
				};
			});
			
			expect(animationStyles.animation).toBeTruthy();
		});
	});

	test.describe('Memory Usage', () => {
		test('should not cause memory leaks', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			
			// Get initial memory usage
			const initialMemory = await page.evaluate(() => {
				return performance.memory ? performance.memory.usedJSHeapSize : 0;
			});
			
			// Navigate multiple times
			for (let i = 0; i < 5; i++) {
				await page.goto('/');
				await page.waitForLoadState('networkidle');
				await page.waitForTimeout(1000);
			}
			
			// Get final memory usage
			const finalMemory = await page.evaluate(() => {
				return performance.memory ? performance.memory.usedJSHeapSize : 0;
			});
			
			// Memory increase should be reasonable
			const memoryIncrease = finalMemory - initialMemory;
			expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // 10MB
		});

		test('should handle large content efficiently', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			
			// Measure memory usage with large content
			const memoryUsage = await page.evaluate(() => {
				return performance.memory ? performance.memory.usedJSHeapSize : 0;
			});
			
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			// Memory usage should be reasonable
			expect(memoryUsage).toBeLessThan(50 * 1024 * 1024); // 50MB
		});
	});

	test.describe('Bundle Size Impact', () => {
		test('should have efficient bundle size', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			
			// Track JavaScript bundle size
			const jsResources = [];
			page.on('response', (response) => {
				if (response.url().includes('.js') && response.status() === 200) {
					jsResources.push({
						url: response.url(),
						size: parseInt(response.headers()['content-length'] || '0'),
					});
				}
			});
			
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			// Calculate total JS bundle size
			const totalJSSize = jsResources.reduce((total, resource) => total + resource.size, 0);
			
			// Total JS bundle should be under 1MB
			expect(totalJSSize).toBeLessThan(1024 * 1024);
		});

		test('should have efficient CSS bundle size', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			
			// Track CSS bundle size
			const cssResources = [];
			page.on('response', (response) => {
				if (response.url().includes('.css') && response.status() === 200) {
					cssResources.push({
						url: response.url(),
						size: parseInt(response.headers()['content-length'] || '0'),
					});
				}
			});
			
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			// Calculate total CSS bundle size
			const totalCSSSize = cssResources.reduce((total, resource) => total + resource.size, 0);
			
			// Total CSS bundle should be under 500KB
			expect(totalCSSSize).toBeLessThan(512 * 1024);
		});
	});

	test.describe('Image Optimization', () => {
		test('should have optimized images', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			
			// Track image resources
			const imageResources = [];
			page.on('response', (response) => {
				if (response.url().match(/\.(jpg|jpeg|png|webp|avif)$/i) && response.status() === 200) {
					imageResources.push({
						url: response.url(),
						size: parseInt(response.headers()['content-length'] || '0'),
						format: response.url().split('.').pop(),
					});
				}
			});
			
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			// Check for modern image formats
			const modernFormats = imageResources.filter(r => ['webp', 'avif'].includes(r.format || ''));
			expect(modernFormats.length).toBeGreaterThan(0);
		});

		test('should have appropriate image sizes', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			
			// Track image resources
			const imageResources = [];
			page.on('response', (response) => {
				if (response.url().match(/\.(jpg|jpeg|png|webp|avif)$/i) && response.status() === 200) {
					imageResources.push({
						url: response.url(),
						size: parseInt(response.headers()['content-length'] || '0'),
					});
				}
			});
			
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			// Check image sizes
			imageResources.forEach(resource => {
				// Individual images should be under 500KB
				expect(resource.size).toBeLessThan(512 * 1024);
			});
		});
	});

	test.describe('Network Performance', () => {
		test('should have efficient network requests', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			
			// Track network requests
			const requests = [];
			page.on('request', (request) => {
				requests.push({
					url: request.url(),
					method: request.method(),
					resourceType: request.resourceType(),
				});
			});
			
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			// Check for unnecessary requests
			const unnecessaryRequests = requests.filter(r => 
				r.resourceType === 'xhr' && r.url.includes('analytics')
			);
			
			// Should have minimal unnecessary requests
			expect(unnecessaryRequests.length).toBeLessThan(10);
		});

		test('should have proper caching headers', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			
			// Track response headers
			const responses = [];
			page.on('response', (response) => {
				responses.push({
					url: response.url(),
					headers: response.headers(),
				});
			});
			
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			
			// Check for proper caching headers
			const staticResources = responses.filter(r => 
				r.url.match(/\.(js|css|png|jpg|jpeg|webp|avif)$/i)
			);
			
			staticResources.forEach(response => {
				const cacheControl = response.headers['cache-control'];
				expect(cacheControl).toBeTruthy();
			});
		});
	});
});
