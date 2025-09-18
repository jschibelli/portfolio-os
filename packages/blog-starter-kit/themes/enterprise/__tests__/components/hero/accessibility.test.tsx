import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
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

describe('Hero Components Accessibility Tests', () => {
	describe('BaseHero Accessibility', () => {
		it('should have proper heading hierarchy with h1', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
				/>
			);

			const heading = screen.getByRole('heading', { level: 1 });
			expect(heading).toBeInTheDocument();
			expect(heading).toHaveTextContent('Test Title');
		});

		it('should have proper heading hierarchy with subtitle', () => {
			render(
				<BaseHero
					title="Test Title"
					subtitle="Test Subtitle"
					description="Test Description"
				/>
			);

			const heading = screen.getByRole('heading', { level: 1 });
			expect(heading).toBeInTheDocument();
			expect(heading).toHaveTextContent('Test Title');

			const subtitle = screen.getByText('Test Subtitle');
			expect(subtitle).toBeInTheDocument();
		});

		it('should have accessible button links', () => {
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

			const button1 = screen.getByRole('link', { name: 'Button 1' });
			const button2 = screen.getByRole('link', { name: 'Button 2' });

			expect(button1).toBeInTheDocument();
			expect(button1).toHaveAttribute('href', '/test1');
			expect(button2).toBeInTheDocument();
			expect(button2).toHaveAttribute('href', '/test2');
		});

		it('should have proper focus management for buttons', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					buttons={[
						{ href: '/test1', text: 'Button 1' }
					]}
				/>
			);

			const button = screen.getByRole('link', { name: 'Button 1' });
			expect(button).toBeInTheDocument();
			expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center');
		});

		it('should have proper color contrast classes', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					titleClassName="text-foreground"
					descriptionClassName="text-muted-foreground"
				/>
			);

			const title = screen.getByRole('heading', { level: 1 });
			const description = screen.getByText('Test Description');

			expect(title).toHaveClass('text-foreground');
			expect(description).toHaveClass('text-muted-foreground');
		});
	});

	describe('Homepage Hero Accessibility', () => {
		it('should have proper heading structure', () => {
			render(<Hero />);

			const heading = screen.getByRole('heading', { level: 1 });
			expect(heading).toBeInTheDocument();
			expect(heading).toHaveTextContent('Building Smarter, Faster Web Applications');
		});

		it('should have accessible CTA buttons', () => {
			render(<Hero />);

			const discussButton = screen.getByRole('link', { name: /discuss your goals/i });
			const resultsButton = screen.getByRole('link', { name: /see my results/i });

			expect(discussButton).toBeInTheDocument();
			expect(discussButton).toHaveAttribute('href', '/contact');
			expect(resultsButton).toBeInTheDocument();
			expect(resultsButton).toHaveAttribute('href', '/projects');
		});

		it('should have proper color contrast for white text on dark background', () => {
			render(<Hero />);

			const title = screen.getByRole('heading', { level: 1 });
			expect(title).toHaveClass('text-white');
		});

		it('should have accessible email link', () => {
			render(<Hero />);

			const emailLink = screen.getByRole('link', { name: /send email directly to discuss your project/i });
			expect(emailLink).toBeInTheDocument();
			expect(emailLink).toHaveAttribute('href', 'mailto:john@johnschibelli.com?subject=Project%20Discussion%20-%20Let\'s%20Talk');
		});
	});

	describe('ModernHero Accessibility', () => {
		const mockProps = {
			title: 'Modern Hero Title',
			subtitle: 'Modern Hero Subtitle',
			description: 'Modern Hero Description',
		};

		it('should have proper heading structure', () => {
			render(<ModernHero {...mockProps} />);

			const heading = screen.getByRole('heading', { level: 1 });
			expect(heading).toBeInTheDocument();
			expect(heading).toHaveTextContent('Modern Hero Title');
		});

		it('should have accessible CTA buttons when provided', () => {
			render(
				<ModernHero
					{...mockProps}
					ctaText="Get Started"
					ctaLink="/get-started"
				/>
			);

			const ctaButton = screen.getByRole('link', { name: 'Get Started' });
			const blogButton = screen.getByRole('link', { name: 'Read the Blog' });

			expect(ctaButton).toBeInTheDocument();
			expect(ctaButton).toHaveAttribute('href', '/get-started');
			expect(blogButton).toBeInTheDocument();
			expect(blogButton).toHaveAttribute('href', '/blog');
		});

		it('should have proper color contrast', () => {
			render(<ModernHero {...mockProps} />);

			const title = screen.getByRole('heading', { level: 1 });
			const description = screen.getByText('Modern Hero Description');

			expect(title).toHaveClass('text-white');
			expect(description).toHaveClass('text-stone-300');
		});
	});

	describe('Blog Hero Post Accessibility', () => {
		const mockProps = {
			title: 'Blog Post Title',
			coverImage: '/mock-cover.jpg',
			date: '2024-01-01',
			excerpt: 'Blog post excerpt',
			slug: 'blog-post-slug',
		};

		it('should have proper heading structure', () => {
			render(<HeroPost {...mockProps} />);

			const heading = screen.getByRole('heading', { level: 1 });
			expect(heading).toBeInTheDocument();
			expect(heading).toHaveTextContent('Blog Post Title');
		});

		it('should have accessible post links', () => {
			render(<HeroPost {...mockProps} />);

			const titleLink = screen.getByRole('link', { name: 'Blog Post Title' });
			const excerptLink = screen.getByRole('link', { name: 'Blog post excerpt' });
			const dateLink = screen.getByRole('link', { name: /2024-01-01/ });

			expect(titleLink).toBeInTheDocument();
			expect(titleLink).toHaveAttribute('href', '/blog-post-slug');
			expect(excerptLink).toBeInTheDocument();
			expect(excerptLink).toHaveAttribute('href', '/blog-post-slug');
			expect(dateLink).toBeInTheDocument();
			expect(dateLink).toHaveAttribute('href', '/blog-post-slug');
		});

		it('should have proper color contrast for dark mode', () => {
			render(<HeroPost {...mockProps} />);

			const title = screen.getByRole('heading', { level: 1 });
			const excerpt = screen.getByText('Blog post excerpt');

			expect(title).toHaveClass('text-slate-800', 'dark:text-neutral-50');
			expect(excerpt).toHaveClass('text-slate-500', 'dark:text-neutral-400');
		});
	});

	describe('Keyboard Navigation', () => {
		it('should have focusable buttons', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					buttons={[
						{ href: '/test1', text: 'Button 1' }
					]}
				/>
			);

			const button = screen.getByRole('link', { name: 'Button 1' });
			expect(button).toBeInTheDocument();
			expect(button).toHaveAttribute('href', '/test1');
		});

		it('should have proper tab order', () => {
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

			const buttons = screen.getAllByRole('link');
			expect(buttons).toHaveLength(2);
			expect(buttons[0]).toHaveTextContent('Button 1');
			expect(buttons[1]).toHaveTextContent('Button 2');
		});
	});

	describe('Screen Reader Support', () => {
		it('should have proper semantic structure', () => {
			render(
				<BaseHero
					title="Test Title"
					subtitle="Test Subtitle"
					description="Test Description"
				/>
			);

			const heading = screen.getByRole('heading', { level: 1 });
			expect(heading).toBeInTheDocument();

			const subtitle = screen.getByText('Test Subtitle');
			expect(subtitle).toBeInTheDocument();

			const description = screen.getByText('Test Description');
			expect(description).toBeInTheDocument();
		});

		it('should have proper button labels', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					buttons={[
						{ href: '/test1', text: 'Button 1', icon: <span>Icon</span> }
					]}
				/>
			);

			const button = screen.getByRole('link', { name: 'Button 1' });
			expect(button).toBeInTheDocument();
			expect(button).toHaveTextContent('Button 1');
		});
	});

	describe('ARIA Attributes', () => {
		it('should have proper section structure', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
				/>
			);

			const section = screen.getByRole('heading', { level: 1 }).closest('section');
			expect(section).toBeInTheDocument();
		});

		it('should have proper link attributes', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					buttons={[
						{ href: '/test1', text: 'Button 1' }
					]}
				/>
			);

			const button = screen.getByRole('link', { name: 'Button 1' });
			expect(button).toHaveAttribute('href', '/test1');
		});
	});

	describe('Color Contrast and Visual Accessibility', () => {
		it('should have sufficient color contrast for text', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					titleClassName="text-foreground"
					descriptionClassName="text-muted-foreground"
				/>
			);

			const title = screen.getByRole('heading', { level: 1 });
			const description = screen.getByText('Test Description');

			expect(title).toHaveClass('text-foreground');
			expect(description).toHaveClass('text-muted-foreground');
		});

		it('should have proper focus indicators', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					buttons={[
						{ href: '/test1', text: 'Button 1' }
					]}
				/>
			);

			const button = screen.getByRole('link', { name: 'Button 1' });
			expect(button).toHaveClass('transition-all', 'duration-300');
		});
	});
});
