import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FeatureGrid, { Feature } from '@/components/projects/FeatureGrid';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
	motion: {
		div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
	},
}));

describe('FeatureGrid Component', () => {
	const mockFeatures: Feature[] = [
		{
			id: 'feature-1',
			title: 'Test Feature 1',
			description: 'This is a test feature description',
		},
		{
			id: 'feature-2',
			title: 'Test Feature 2',
			description: 'This is another test feature description',
		},
	];

	const mockFeaturesWithIcons: Feature[] = [
		{
			id: 'feature-1',
			title: 'Test Feature 1',
			description: 'This is a test feature description',
			icon: <span data-testid="icon-1">Icon 1</span>,
		},
		{
			id: 'feature-2',
			title: 'Test Feature 2',
			description: 'This is another test feature description',
			icon: <span data-testid="icon-2">Icon 2</span>,
		},
	];

	beforeEach(() => {
		// Clear console warnings/errors before each test
		jest.clearAllMocks();
	});

	describe('Basic Rendering', () => {
		it('renders with default props', () => {
			render(<FeatureGrid features={mockFeatures} />);
			
			expect(screen.getByText('Features')).toBeInTheDocument();
			expect(screen.getByText('Test Feature 1')).toBeInTheDocument();
			expect(screen.getByText('Test Feature 2')).toBeInTheDocument();
		});

		it('renders with custom title and description', () => {
			render(
				<FeatureGrid
					features={mockFeatures}
					title="Custom Title"
					description="Custom description"
				/>
			);
			
			expect(screen.getByText('Custom Title')).toBeInTheDocument();
			expect(screen.getByText('Custom description')).toBeInTheDocument();
		});

		it('renders without description when not provided', () => {
			render(<FeatureGrid features={mockFeatures} title="Test Title" />);
			
			expect(screen.getByText('Test Title')).toBeInTheDocument();
			expect(screen.queryByText('Custom description')).not.toBeInTheDocument();
		});
	});

	describe('Feature Display', () => {
		it('displays all feature titles and descriptions', () => {
			render(<FeatureGrid features={mockFeatures} />);
			
			mockFeatures.forEach(feature => {
				expect(screen.getByText(feature.title)).toBeInTheDocument();
				expect(screen.getByText(feature.description)).toBeInTheDocument();
			});
		});

		it('displays icons when showIcons is true and features have icons', () => {
			render(
				<FeatureGrid
					features={mockFeaturesWithIcons}
					showIcons={true}
				/>
			);
			
			expect(screen.getByTestId('icon-1')).toBeInTheDocument();
			expect(screen.getByTestId('icon-2')).toBeInTheDocument();
		});

		it('does not display icons when showIcons is false', () => {
			render(
				<FeatureGrid
					features={mockFeaturesWithIcons}
					showIcons={false}
				/>
			);
			
			expect(screen.queryByTestId('icon-1')).not.toBeInTheDocument();
			expect(screen.queryByTestId('icon-2')).not.toBeInTheDocument();
		});

		it('displays links when features have link property', () => {
			const featuresWithLinks: Feature[] = [
				{
					id: 'feature-1',
					title: 'Test Feature 1',
					description: 'This is a test feature description',
					link: '/test-link',
				},
			];

			render(<FeatureGrid features={featuresWithLinks} />);
			
			const link = screen.getByText('Learn more →');
			expect(link).toBeInTheDocument();
			expect(link.closest('a')).toHaveAttribute('href', '/test-link');
			expect(link.closest('a')).toHaveAttribute('target', '_blank');
			expect(link.closest('a')).toHaveAttribute('rel', 'noopener noreferrer');
		});
	});

	describe('Grid Layout', () => {
		it('applies correct grid classes for maxColumns=2', () => {
			const { container } = render(
				<FeatureGrid features={mockFeatures} maxColumns={2} />
			);
			
			const grid = container.querySelector('.grid');
			expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2');
		});

		it('applies correct grid classes for maxColumns=3', () => {
			const { container } = render(
				<FeatureGrid features={mockFeatures} maxColumns={3} />
			);
			
			const grid = container.querySelector('.grid');
			expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
		});

		it('applies correct grid classes for maxColumns=4 (default)', () => {
			const { container } = render(
				<FeatureGrid features={mockFeatures} maxColumns={4} />
			);
			
			const grid = container.querySelector('.grid');
			expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4');
		});
	});

	describe('Error Handling', () => {
		it('displays error message when features is not an array', () => {
			const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
			
			render(<FeatureGrid features={null as any} />);
			
			expect(screen.getByText('Error: Invalid features data provided')).toBeInTheDocument();
			expect(consoleSpy).toHaveBeenCalledWith('FeatureGrid: features prop must be an array');
			
			consoleSpy.mockRestore();
		});

		it('displays empty state when features array is empty', () => {
			render(<FeatureGrid features={[]} />);
			
			expect(screen.getByText('No features to display')).toBeInTheDocument();
		});

		it('filters out invalid feature objects and displays warnings', () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
			
			const invalidFeatures = [
				{ id: 'valid-1', title: 'Valid Feature', description: 'Valid description' },
				null,
				{ id: 'invalid-1', title: 'Invalid Feature' }, // Missing description
				{ id: 'valid-2', title: 'Another Valid Feature', description: 'Another valid description' },
			];

			render(<FeatureGrid features={invalidFeatures as any} />);
			
			// Should only display valid features
			expect(screen.getByText('Valid Feature')).toBeInTheDocument();
			expect(screen.getByText('Another Valid Feature')).toBeInTheDocument();
			expect(screen.queryByText('Invalid Feature')).not.toBeInTheDocument();
			
			// Should have logged warnings for invalid features
			expect(consoleSpy).toHaveBeenCalled();
			
			consoleSpy.mockRestore();
		});
	});

	describe('Interactions', () => {
		it('calls onFeatureClick when a feature card is clicked', () => {
			const mockOnFeatureClick = jest.fn();
			
			render(
				<FeatureGrid
					features={mockFeatures}
					onFeatureClick={mockOnFeatureClick}
				/>
			);
			
			const firstFeatureCard = screen.getByText('Test Feature 1').closest('.cursor-pointer');
			fireEvent.click(firstFeatureCard!);
			
			expect(mockOnFeatureClick).toHaveBeenCalledWith(mockFeatures[0]);
		});

		it('does not call onFeatureClick when not provided', () => {
			render(<FeatureGrid features={mockFeatures} />);
			
			const firstFeatureCard = screen.getByText('Test Feature 1').closest('div');
			expect(() => fireEvent.click(firstFeatureCard!)).not.toThrow();
		});

		it('applies cursor-pointer class when onFeatureClick is provided', () => {
			const { container } = render(
				<FeatureGrid
					features={mockFeatures}
					onFeatureClick={() => {}}
				/>
			);
			
			const cards = container.querySelectorAll('.cursor-pointer');
			expect(cards.length).toBeGreaterThan(0);
		});
	});

	describe('Accessibility', () => {
		it('has proper heading structure', () => {
			render(<FeatureGrid features={mockFeatures} title="Test Title" />);
			
			const heading = screen.getByRole('heading', { level: 2 });
			expect(heading).toHaveTextContent('Test Title');
		});

		it('has proper alt text for images', () => {
			const featuresWithImages: Feature[] = [
				{
					id: 'feature-1',
					title: 'Test Feature 1',
					description: 'This is a test feature description',
					image: '/test-image.jpg',
				},
			];

			render(<FeatureGrid features={featuresWithImages} />);
			
			const image = screen.getByAltText('Test Feature 1');
			expect(image).toBeInTheDocument();
			expect(image).toHaveAttribute('src', '/test-image.jpg');
			expect(image).toHaveAttribute('loading', 'lazy');
		});
	});

	describe('Custom Styling', () => {
		it('applies custom className', () => {
			const { container } = render(
				<FeatureGrid features={mockFeatures} className="custom-class" />
			);
			
			const section = container.querySelector('section');
			expect(section).toHaveClass('custom-class');
		});
	});
});