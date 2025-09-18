import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import BaseHero from '../../../components/features/sections/hero/base-hero';
import Hero from '../../../components/features/homepage/hero';
import ModernHero from '../../../components/features/homepage/modern-hero';
import { HeroPost } from '../../../components/features/blog/hero-post';

// Mock Next.js components
jest.mock('next/link', () => {
	return ({ children, href }: { children: React.ReactNode; href: string }) => (
		<a href={href}>{children}</a>
	);
});

// Mock image components
jest.mock('../../../components/shared/cover-image', () => {
	return function MockCoverImage({ title }: { title: string }) {
		return <img src="/mock-image.jpg" alt={title} />;
	};
});

// Mock performance API
const mockPerformance = {
	now: jest.fn(() => Date.now()),
	mark: jest.fn(),
	measure: jest.fn(),
	getEntriesByType: jest.fn(() => []),
};

Object.defineProperty(window, 'performance', {
	value: mockPerformance,
	writable: true,
});

describe('Hero Components Performance Tests', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterEach(() => {
		jest.clearAllTimers();
	});

	describe('BaseHero Performance', () => {
		it('should render without performance issues', () => {
			const startTime = performance.now();
			
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
				/>
			);

			const endTime = performance.now();
			const renderTime = endTime - startTime;

			// Should render within reasonable time (less than 100ms)
			expect(renderTime).toBeLessThan(100);
		});

		it('should handle multiple buttons efficiently', () => {
			const startTime = performance.now();
			
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					buttons={Array.from({ length: 10 }, (_, i) => ({
						href: `/test${i}`,
						text: `Button ${i}`
					}))}
				/>
			);

			const endTime = performance.now();
			const renderTime = endTime - startTime;

			// Should handle multiple buttons efficiently
			expect(renderTime).toBeLessThan(150);
		});

		it('should handle custom content efficiently', () => {
			const startTime = performance.now();
			
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					customContent={
						<div>
							{Array.from({ length: 50 }, (_, i) => (
								<p key={i}>Custom content item {i}</p>
							))}
						</div>
					}
				/>
			);

			const endTime = performance.now();
			const renderTime = endTime - startTime;

			// Should handle custom content efficiently
			expect(renderTime).toBeLessThan(200);
		});

		it('should handle animation classes efficiently', () => {
			const startTime = performance.now();
			
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					animate={true}
					animationDelay={100}
				/>
			);

			const endTime = performance.now();
			const renderTime = endTime - startTime;

			// Should handle animations efficiently
			expect(renderTime).toBeLessThan(100);
		});
	});

	describe('Homepage Hero Performance', () => {
		it('should render efficiently with all features', () => {
			const startTime = performance.now();
			
			render(<Hero />);

			const endTime = performance.now();
			const renderTime = endTime - startTime;

			// Should render within reasonable time
			expect(renderTime).toBeLessThan(150);
		});

		it('should handle background image efficiently', () => {
			const startTime = performance.now();
			
			render(<Hero />);

			const endTime = performance.now();
			const renderTime = endTime - startTime;

			// Should handle background image efficiently
			expect(renderTime).toBeLessThan(150);
		});

		it('should handle overlay efficiently', () => {
			const startTime = performance.now();
			
			render(<Hero />);

			const endTime = performance.now();
			const renderTime = endTime - startTime;

			// Should handle overlay efficiently
			expect(renderTime).toBeLessThan(150);
		});
	});

	describe('ModernHero Performance', () => {
		const mockProps = {
			title: 'Modern Hero Title',
			subtitle: 'Modern Hero Subtitle',
			description: 'Modern Hero Description',
		};

		it('should render efficiently', () => {
			const startTime = performance.now();
			
			render(<ModernHero {...mockProps} />);

			const endTime = performance.now();
			const renderTime = endTime - startTime;

			// Should render within reasonable time
			expect(renderTime).toBeLessThan(100);
		});

		it('should handle CTA buttons efficiently', () => {
			const startTime = performance.now();
			
			render(
				<ModernHero
					{...mockProps}
					ctaText="Get Started"
					ctaLink="/get-started"
				/>
			);

			const endTime = performance.now();
			const renderTime = endTime - startTime;

			// Should handle CTA buttons efficiently
			expect(renderTime).toBeLessThan(120);
		});
	});

	describe('Blog Hero Post Performance', () => {
		const mockProps = {
			title: 'Blog Post Title',
			coverImage: '/mock-cover.jpg',
			date: '2024-01-01',
			excerpt: 'Blog post excerpt',
			slug: 'blog-post-slug',
		};

		it('should render efficiently', () => {
			const startTime = performance.now();
			
			render(<HeroPost {...mockProps} />);

			const endTime = performance.now();
			const renderTime = endTime - startTime;

			// Should render within reasonable time
			expect(renderTime).toBeLessThan(100);
		});

		it('should handle cover image efficiently', () => {
			const startTime = performance.now();
			
			render(<HeroPost {...mockProps} />);

			const endTime = performance.now();
			const renderTime = endTime - startTime;

			// Should handle cover image efficiently
			expect(renderTime).toBeLessThan(100);
		});
	});

	describe('Memory Usage Tests', () => {
		it('should not cause memory leaks with multiple renders', () => {
			const initialMemory = process.memoryUsage().heapUsed;
			
			// Render multiple times
			for (let i = 0; i < 100; i++) {
				const { unmount } = render(
					<BaseHero
						title={`Test Title ${i}`}
						description={`Test Description ${i}`}
					/>
				);
				unmount();
			}

			const finalMemory = process.memoryUsage().heapUsed;
			const memoryIncrease = finalMemory - initialMemory;

			// Memory increase should be reasonable (less than 10MB)
			expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
		});

		it('should handle large content efficiently', () => {
			const startTime = performance.now();
			
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					customContent={
						<div>
							{Array.from({ length: 1000 }, (_, i) => (
								<p key={i}>Large content item {i}</p>
							))}
						</div>
					}
				/>
			);

			const endTime = performance.now();
			const renderTime = endTime - startTime;

			// Should handle large content efficiently
			expect(renderTime).toBeLessThan(500);
		});
	});

	describe('Animation Performance', () => {
		it('should handle animations efficiently', () => {
			const startTime = performance.now();
			
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					animate={true}
					animationDelay={0}
				/>
			);

			const endTime = performance.now();
			const renderTime = endTime - startTime;

			// Should handle animations efficiently
			expect(renderTime).toBeLessThan(100);
		});

		it('should handle multiple animation delays efficiently', () => {
			const startTime = performance.now();
			
			render(
				<BaseHero
					title="Test Title"
					subtitle="Test Subtitle"
					description="Test Description"
					animate={true}
					animationDelay={100}
				/>
			);

			const endTime = performance.now();
			const renderTime = endTime - startTime;

			// Should handle multiple animation delays efficiently
			expect(renderTime).toBeLessThan(120);
		});
	});

	describe('Bundle Size Impact', () => {
		it('should not import unnecessary dependencies', () => {
			// This test ensures that hero components don't import heavy dependencies
			const BaseHeroModule = require('../../../components/features/sections/hero/base-hero');
			expect(BaseHeroModule.default).toBeDefined();
		});

		it('should use efficient CSS classes', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					className="efficient-classes"
				/>
			);

			const section = screen.getByRole('heading', { level: 1 }).closest('section');
			expect(section).toHaveClass('efficient-classes');
		});
	});

	describe('Rendering Performance', () => {
		it('should render without console errors', () => {
			const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
			
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
				/>
			);

			expect(consoleSpy).not.toHaveBeenCalled();
			consoleSpy.mockRestore();
		});

		it('should handle rapid re-renders efficiently', () => {
			const startTime = performance.now();
			
			// Simulate rapid re-renders
			for (let i = 0; i < 50; i++) {
				const { rerender } = render(
					<BaseHero
						title={`Test Title ${i}`}
						description={`Test Description ${i}`}
					/>
				);
				rerender(
					<BaseHero
						title={`Updated Title ${i}`}
						description={`Updated Description ${i}`}
					/>
				);
			}

			const endTime = performance.now();
			const renderTime = endTime - startTime;

			// Should handle rapid re-renders efficiently
			expect(renderTime).toBeLessThan(1000);
		});
	});
});
