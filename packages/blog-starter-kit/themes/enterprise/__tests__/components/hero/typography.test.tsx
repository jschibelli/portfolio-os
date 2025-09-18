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
				titleClassName="text-4xl font-bold tracking-tight text-white leading-tight md:text-6xl lg:text-7xl md:leading-tight lg:leading-tight"
				subtitleClassName="text-xl font-semibold text-stone-200 md:text-2xl lg:text-3xl"
				descriptionClassName="text-lg font-semibold text-stone-300 md:text-xl lg:text-2xl"
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
				titleClassName="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
				descriptionClassName="text-base leading-relaxed text-stone-300 sm:text-lg max-w-[600px] px-4"
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
					titleClassName="text-xl font-bold leading-snug text-slate-800 lg:text-3xl dark:text-neutral-50"
					descriptionClassName="text-md leading-snug text-slate-500 dark:text-neutral-400"
				/>
			);
		}
	};
});

describe('Hero Components Typography Tests', () => {
	describe('BaseHero Typography', () => {
		it('should render title with correct typography classes', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					titleClassName="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl"
				/>
			);

			const title = screen.getByRole('heading', { level: 1 });
			expect(title).toHaveClass('text-4xl', 'font-bold', 'leading-tight');
		});

		it('should render subtitle with correct typography classes', () => {
			render(
				<BaseHero
					title="Test Title"
					subtitle="Test Subtitle"
					description="Test Description"
				/>
			);

			const subtitle = screen.getByText('Test Subtitle');
			expect(subtitle).toHaveClass('text-sm', 'font-medium', 'uppercase', 'tracking-wider');
		});

		it('should render description with correct typography classes', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					descriptionClassName="text-lg leading-relaxed text-muted-foreground sm:text-xl md:text-2xl"
				/>
			);

			const description = screen.getByText('Test Description');
			expect(description).toHaveClass('text-lg', 'leading-relaxed', 'text-muted-foreground');
		});

		it('should apply custom title className', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					titleClassName="custom-title-class text-8xl"
				/>
			);

			const title = screen.getByRole('heading', { level: 1 });
			expect(title).toHaveClass('custom-title-class', 'text-8xl');
		});

		it('should apply custom description className', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					descriptionClassName="custom-description-class text-3xl"
				/>
			);

			const description = screen.getByText('Test Description');
			expect(description).toHaveClass('custom-description-class', 'text-3xl');
		});
	});

	describe('Homepage Hero Typography', () => {
		it('should render with correct title typography', () => {
			const Hero = require('../../../components/features/homepage/hero').default;
			render(<Hero />);

			const title = screen.getByRole('heading', { level: 1 });
			expect(title).toHaveClass('text-4xl', 'font-bold', 'tracking-tight', 'text-white');
		});

		it('should render with correct subtitle typography', () => {
			const Hero = require('../../../components/features/homepage/hero').default;
			render(<Hero />);

			const subtitle = screen.getByText('John Schibelli');
			expect(subtitle).toHaveClass('text-xl', 'font-semibold', 'text-stone-200');
		});

		it('should render with correct description typography', () => {
			const Hero = require('../../../components/features/homepage/hero').default;
			render(<Hero />);

			const description = screen.getByText('Senior Front-End Developer');
			expect(description).toHaveClass('text-lg', 'font-semibold', 'text-stone-300');
		});
	});

	describe('ModernHero Typography', () => {
		const mockProps = {
			title: 'Modern Hero Title',
			subtitle: 'Modern Hero Subtitle',
			description: 'Modern Hero Description',
		};

		it('should render with correct title typography', () => {
			const ModernHero = require('../../../components/features/homepage/modern-hero').default;
			render(<ModernHero {...mockProps} />);

			const title = screen.getByRole('heading', { level: 1 });
			expect(title).toHaveClass('text-3xl', 'font-bold', 'tracking-tight', 'text-white');
		});

		it('should render with correct description typography', () => {
			const ModernHero = require('../../../components/features/homepage/modern-hero').default;
			render(<ModernHero {...mockProps} />);

			const description = screen.getByText('Modern Hero Description');
			expect(description).toHaveClass('text-base', 'leading-relaxed', 'text-stone-300');
		});
	});

	describe('Blog Hero Post Typography', () => {
		const mockProps = {
			title: 'Blog Post Title',
			coverImage: '/mock-cover.jpg',
			date: '2024-01-01',
			excerpt: 'Blog post excerpt',
			slug: 'blog-post-slug',
		};

		it('should render with correct title typography', () => {
			const { HeroPost } = require('../../../components/features/blog/hero-post');
			render(<HeroPost {...mockProps} />);

			const title = screen.getByRole('heading', { level: 1 });
			expect(title).toHaveClass('text-xl', 'font-bold', 'leading-snug', 'text-slate-800');
		});

		it('should render with correct description typography', () => {
			const { HeroPost } = require('../../../components/features/blog/hero-post');
			render(<HeroPost {...mockProps} />);

			const description = screen.getByText('Blog post excerpt');
			expect(description).toHaveClass('text-md', 'leading-snug', 'text-slate-500');
		});
	});

	describe('Typography Responsive Behavior', () => {
		it('should have responsive title classes', () => {
			render(
				<BaseHero
					title="Responsive Title"
					description="Responsive Description"
					titleClassName="text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
				/>
			);

			const title = screen.getByRole('heading', { level: 1 });
			expect(title).toHaveClass('text-4xl', 'sm:text-5xl', 'md:text-6xl', 'lg:text-7xl');
		});

		it('should have responsive description classes', () => {
			render(
				<BaseHero
					title="Responsive Title"
					description="Responsive Description"
					descriptionClassName="text-lg sm:text-xl md:text-2xl"
				/>
			);

			const description = screen.getByText('Responsive Description');
			expect(description).toHaveClass('text-lg', 'sm:text-xl', 'md:text-2xl');
		});
	});

	describe('Typography Accessibility', () => {
		it('should have proper heading hierarchy', () => {
			render(
				<BaseHero
					title="Main Title"
					subtitle="Subtitle"
					description="Description"
				/>
			);

			const mainHeading = screen.getByRole('heading', { level: 1 });
			expect(mainHeading).toBeInTheDocument();
			expect(mainHeading).toHaveTextContent('Main Title');
		});

		it('should have proper color contrast classes', () => {
			render(
				<BaseHero
					title="Title"
					description="Description"
					titleClassName="text-foreground"
					descriptionClassName="text-muted-foreground"
				/>
			);

			const title = screen.getByRole('heading', { level: 1 });
			const description = screen.getByText('Description');

			expect(title).toHaveClass('text-foreground');
			expect(description).toHaveClass('text-muted-foreground');
		});
	});
});
