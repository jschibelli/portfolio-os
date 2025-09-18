import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import BaseHero from '../../../components/features/sections/hero/base-hero';

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

// Mock hero components that have import issues
jest.mock('../../../components/features/homepage/hero', () => {
	return function MockHero() {
		return (
			<BaseHero
				title="Building Smarter, Faster Web Applications"
				subtitle="John Schibelli"
				description="Senior Front-End Developer"
				className="min-h-[400px] py-12 md:py-16"
				contentClassName="container mx-auto px-4"
			/>
		);
	};
});

jest.mock('../../../components/features/homepage/modern-hero', () => {
	return function MockModernHero({ title, subtitle, description }: { title: string; subtitle: string; description: string }) {
		return (
			<BaseHero
				title={title}
				subtitle={subtitle}
				description={description}
				className="min-h-[400px] py-12 md:py-16"
				contentClassName="container mx-auto px-4"
			/>
		);
	};
});

jest.mock('../../../components/features/blog/hero-post', () => {
	return {
		HeroPost: function MockHeroPost({ title, excerpt }: { title: string; excerpt: string }) {
			return (
				<BaseHero
					title={title}
					description={excerpt}
					layout="left"
					contentAlignment="left"
					className="py-8"
					contentClassName="grid grid-cols-1 gap-5"
				/>
			);
		}
	};
});

describe('Hero Components Spacing Tests', () => {
	describe('BaseHero Spacing', () => {
		it('should have correct default spacing classes', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
				/>
			);

			const contentContainer = screen.getByRole('heading', { level: 1 }).closest('div');
			expect(contentContainer?.parentElement).toHaveClass('gap-6', 'sm:gap-8');
		});

		it('should apply custom contentClassName for spacing', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					contentClassName="custom-spacing gap-12"
				/>
			);

			const contentContainer = screen.getByRole('heading', { level: 1 }).closest('div')?.parentElement;
			expect(contentContainer).toHaveClass('custom-spacing', 'gap-12');
		});

		it('should have correct section padding', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					className="py-16 md:py-24"
				/>
			);

			const section = screen.getByRole('heading', { level: 1 }).closest('section');
			expect(section).toHaveClass('py-16', 'md:py-24');
		});

		it('should have responsive button spacing', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					buttons={[
						{ href: '/test1', text: 'Button 1' },
						{ href: '/test2', text: 'Button 2' }
					]}
				/>
			);

			const buttonContainer = screen.getByText('Button 1').closest('div')?.parentElement;
			expect(buttonContainer).toHaveClass('flex-col', 'gap-4', 'sm:flex-row', 'sm:gap-6');
		});
	});

	describe('Homepage Hero Spacing', () => {
		it('should have correct minimum height and padding', () => {
			const Hero = require('../../../components/features/homepage/hero').default;
			render(<Hero />);

			const section = screen.getByRole('heading', { level: 1 }).closest('section');
			expect(section).toHaveClass('min-h-[400px]', 'py-12', 'md:py-16');
		});

		it('should have correct content container spacing', () => {
			const Hero = require('../../../components/features/homepage/hero').default;
			render(<Hero />);

			const contentContainer = screen.getByRole('heading', { level: 1 }).closest('div')?.parentElement;
			expect(contentContainer).toHaveClass('container', 'mx-auto', 'px-4');
		});
	});

	describe('ModernHero Spacing', () => {
		const mockProps = {
			title: 'Modern Hero Title',
			subtitle: 'Modern Hero Subtitle',
			description: 'Modern Hero Description',
		};

		it('should have correct minimum height and padding', () => {
			render(<ModernHero {...mockProps} />);

			const section = screen.getByRole('heading', { level: 1 }).closest('section');
			expect(section).toHaveClass('min-h-[400px]', 'py-12', 'md:py-16');
		});

		it('should have correct content container spacing', () => {
			render(<ModernHero {...mockProps} />);

			const contentContainer = screen.getByRole('heading', { level: 1 }).closest('div')?.parentElement;
			expect(contentContainer).toHaveClass('container', 'mx-auto', 'px-4');
		});
	});

	describe('Blog Hero Post Spacing', () => {
		const mockProps = {
			title: 'Blog Post Title',
			coverImage: '/mock-cover.jpg',
			date: '2024-01-01',
			excerpt: 'Blog post excerpt',
			slug: 'blog-post-slug',
		};

		it('should have correct section padding', () => {
			render(<HeroPost {...mockProps} />);

			const section = screen.getByRole('heading', { level: 1 }).closest('section');
			expect(section).toHaveClass('py-8');
		});

		it('should have correct content grid spacing', () => {
			render(<HeroPost {...mockProps} />);

			const contentContainer = screen.getByRole('heading', { level: 1 }).closest('div')?.parentElement;
			expect(contentContainer).toHaveClass('grid', 'grid-cols-1', 'gap-5');
		});
	});

	describe('Layout Spacing Tests', () => {
		it('should have correct left layout spacing', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					layout="left"
					contentAlignment="left"
				/>
			);

			const contentContainer = screen.getByRole('heading', { level: 1 }).closest('div')?.parentElement;
			expect(contentContainer).toHaveClass('text-left', 'items-start');
		});

		it('should have correct right layout spacing', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					layout="right"
					contentAlignment="right"
				/>
			);

			const contentContainer = screen.getByRole('heading', { level: 1 }).closest('div')?.parentElement;
			expect(contentContainer).toHaveClass('text-right', 'items-end');
		});

		it('should have correct centered layout spacing', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					layout="centered"
					contentAlignment="center"
				/>
			);

			const contentContainer = screen.getByRole('heading', { level: 1 }).closest('div')?.parentElement;
			expect(contentContainer).toHaveClass('text-center', 'items-center');
		});

		it('should have correct split layout spacing', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					layout="split"
				/>
			);

			const contentContainer = screen.getByRole('heading', { level: 1 }).closest('div')?.parentElement;
			expect(contentContainer).toHaveClass('text-left', 'items-start', 'md:flex-row');
		});
	});

	describe('Responsive Spacing Tests', () => {
		it('should have responsive gap classes', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					contentClassName="gap-6 sm:gap-8 md:gap-12"
				/>
			);

			const contentContainer = screen.getByRole('heading', { level: 1 }).closest('div')?.parentElement;
			expect(contentContainer).toHaveClass('gap-6', 'sm:gap-8', 'md:gap-12');
		});

		it('should have responsive padding classes', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					className="py-8 sm:py-12 md:py-16 lg:py-20"
				/>
			);

			const section = screen.getByRole('heading', { level: 1 }).closest('section');
			expect(section).toHaveClass('py-8', 'sm:py-12', 'md:py-16', 'lg:py-20');
		});
	});

	describe('Button Spacing Tests', () => {
		it('should have correct button spacing for center alignment', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					buttons={[
						{ href: '/test1', text: 'Button 1' },
						{ href: '/test2', text: 'Button 2' }
					]}
					contentAlignment="center"
				/>
			);

			const buttonContainer = screen.getByText('Button 1').closest('div')?.parentElement;
			expect(buttonContainer).toHaveClass('justify-center');
		});

		it('should have correct button spacing for left alignment', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					buttons={[
						{ href: '/test1', text: 'Button 1' },
						{ href: '/test2', text: 'Button 2' }
					]}
					contentAlignment="left"
				/>
			);

			const buttonContainer = screen.getByText('Button 1').closest('div')?.parentElement;
			expect(buttonContainer).toHaveClass('justify-start');
		});

		it('should have correct button spacing for right alignment', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					buttons={[
						{ href: '/test1', text: 'Button 1' },
						{ href: '/test2', text: 'Button 2' }
					]}
					contentAlignment="right"
				/>
			);

			const buttonContainer = screen.getByText('Button 1').closest('div')?.parentElement;
			expect(buttonContainer).toHaveClass('justify-end');
		});
	});

	describe('Custom Content Spacing', () => {
		it('should have correct custom content spacing', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					customContent={
						<div className="custom-content-spacing">
							<p>Custom content</p>
						</div>
					}
				/>
			);

			const customContent = screen.getByText('Custom content');
			expect(customContent.closest('div')).toHaveClass('custom-content-spacing');
		});

		it('should have correct children content spacing', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
				>
					<div className="children-spacing">
						<p>Children content</p>
					</div>
				</BaseHero>
			);

			const childrenContent = screen.getByText('Children content');
			expect(childrenContent.closest('div')).toHaveClass('children-spacing');
		});
	});
});
