import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import BaseHero from '../../../components/features/sections/hero/base-hero';

// Mock Next.js components
jest.mock('next/link', () => {
	return ({ children, href }: { children: React.ReactNode; href: string }) => (
		<a href={href}>{children}</a>
	);
});

describe('Hero Components Simplified Tests', () => {
	describe('BaseHero Component', () => {
		it('should render with basic props', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
				/>
			);

			const title = screen.getByRole('heading', { level: 1 });
			expect(title).toBeInTheDocument();
			expect(title).toHaveTextContent('Test Title');
		});

		it('should render with subtitle', () => {
			render(
				<BaseHero
					title="Test Title"
					subtitle="Test Subtitle"
					description="Test Description"
				/>
			);

			const subtitle = screen.getByText('Test Subtitle');
			expect(subtitle).toBeInTheDocument();
		});

		it('should render with description', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
				/>
			);

			const description = screen.getByText('Test Description');
			expect(description).toBeInTheDocument();
		});

		it('should render with buttons', () => {
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
			expect(button2).toBeInTheDocument();
		});

		it('should apply custom className', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					className="custom-hero-class"
				/>
			);

			const section = screen.getByRole('heading', { level: 1 }).closest('section');
			expect(section).toHaveClass('custom-hero-class');
		});

		it('should apply custom title className', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					titleClassName="custom-title-class"
				/>
			);

			const title = screen.getByRole('heading', { level: 1 });
			expect(title).toHaveClass('custom-title-class');
		});

		it('should apply custom description className', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					descriptionClassName="custom-description-class"
				/>
			);

			const description = screen.getByText('Test Description');
			expect(description).toHaveClass('custom-description-class');
		});

		it('should handle different layouts', () => {
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

		it('should handle right layout', () => {
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

		it('should handle centered layout', () => {
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

		it('should handle split layout', () => {
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

		it('should handle custom content', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					customContent={<div data-testid="custom-content">Custom Content</div>}
				/>
			);

			const customContent = screen.getByTestId('custom-content');
			expect(customContent).toBeInTheDocument();
		});

		it('should handle children content', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
				>
					<div data-testid="children-content">Children Content</div>
				</BaseHero>
			);

			const childrenContent = screen.getByTestId('children-content');
			expect(childrenContent).toBeInTheDocument();
		});

		it('should handle animation disabled', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					animate={false}
				/>
			);

			const title = screen.getByRole('heading', { level: 1 });
			expect(title).toBeInTheDocument();
		});

		it('should handle background image', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					backgroundImage="/test-image.jpg"
				/>
			);

			const section = screen.getByRole('heading', { level: 1 }).closest('section');
			expect(section).toBeInTheDocument();
		});

		it('should handle background gradient', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					backgroundGradient="linear-gradient(to right, #ff0000, #00ff00)"
				/>
			);

			const section = screen.getByRole('heading', { level: 1 }).closest('section');
			expect(section).toBeInTheDocument();
		});

		it('should handle badge', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					badge={<div data-testid="badge">Badge Content</div>}
				/>
			);

			const badge = screen.getByTestId('badge');
			expect(badge).toBeInTheDocument();
		});

		it('should handle overlay', () => {
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
					overlay={<div data-testid="overlay">Overlay Content</div>}
				/>
			);

			const overlay = screen.getByTestId('overlay');
			expect(overlay).toBeInTheDocument();
		});
	});

	describe('Typography Tests', () => {
		it('should have proper heading hierarchy', () => {
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

	describe('Accessibility Tests', () => {
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

			expect(button1).toHaveAttribute('href', '/test1');
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
	});

	describe('Performance Tests', () => {
		it('should render without performance issues', () => {
			const startTime = Date.now();
			
			render(
				<BaseHero
					title="Test Title"
					description="Test Description"
				/>
			);

			const endTime = Date.now();
			const renderTime = endTime - startTime;

			// Should render within reasonable time (less than 100ms)
			expect(renderTime).toBeLessThan(100);
		});

		it('should handle multiple buttons efficiently', () => {
			const startTime = Date.now();
			
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

			const endTime = Date.now();
			const renderTime = endTime - startTime;

			// Should handle multiple buttons efficiently
			expect(renderTime).toBeLessThan(150);
		});
	});
});
