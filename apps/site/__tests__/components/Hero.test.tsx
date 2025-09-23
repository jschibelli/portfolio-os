import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import Hero from '../../components/features/homepage/hero';
import ModernHero from '../../components/features/homepage/modern-hero';
import { HeroContent, HeroCTA, HeroImage, HeroAnimation } from '../../components/features/homepage/types';

// Mock Next.js components
jest.mock('next/image', () => ({
	default: ({ src, alt, ...props }: any) => (
		<img src={src} alt={alt} {...props} />
	),
}));

jest.mock('next/link', () => ({
	default: ({ href, children, ...props }: any) => (
		<a href={href} {...props}>{children}</a>
	),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
	motion: {
		div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
		h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
		section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
		nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
	},
}));

describe('Hero Component', () => {
	const mockContent: HeroContent = {
		title: 'Test Hero Title',
		subtitle: 'Test Subtitle',
		description: 'Test description content',
		authorName: 'Test Author',
		professionalTitle: 'Test Title'
	};

	const mockCTAs: HeroCTA[] = [
		{
			text: 'Test CTA',
			href: '/test',
			variant: 'primary',
			size: 'lg',
			'aria-label': 'Test CTA button'
		}
	];

	const mockBackgroundImage: HeroImage = {
		src: '/test-image.jpg',
		alt: 'Test background image',
		quality: 85,
		priority: true
	};

	const mockAnimation: HeroAnimation = {
		duration: 0.8,
		delay: 0.2,
		ease: 'easeOut',
		enabled: true
	};

	it('renders with default props', () => {
		render(<Hero />);
		
		expect(screen.getByText('Building Smarter, Faster')).toBeInTheDocument();
		expect(screen.getByText('Web Applications')).toBeInTheDocument();
		expect(screen.getByText('John Schibelli')).toBeInTheDocument();
		expect(screen.getByText('Senior Front-End Developer')).toBeInTheDocument();
	});

	it('renders with custom content', () => {
		render(
			<Hero 
				content={mockContent}
				ctas={mockCTAs}
				backgroundImage={mockBackgroundImage}
				animation={mockAnimation}
			/>
		);

		expect(screen.getByText('Test Hero Title')).toBeInTheDocument();
		expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
		expect(screen.getByText('Test description content')).toBeInTheDocument();
		expect(screen.getByText('Test Author')).toBeInTheDocument();
		expect(screen.getByText('Test Title')).toBeInTheDocument();
	});

	it('renders CTA buttons correctly', () => {
		render(<Hero ctas={mockCTAs} />);
		
		const ctaButton = screen.getByRole('link', { name: 'Test CTA button' });
		expect(ctaButton).toBeInTheDocument();
		expect(ctaButton).toHaveAttribute('href', '/test');
	});

	it('applies custom className', () => {
		const { container } = render(<Hero className="custom-class" />);
		expect(container.firstChild).toHaveClass('custom-class');
	});

	it('renders background image with correct attributes', () => {
		render(<Hero backgroundImage={mockBackgroundImage} />);
		
		const image = screen.getByAltText('Test background image');
		expect(image).toBeInTheDocument();
		expect(image).toHaveAttribute('src', '/test-image.jpg');
	});

	it('conditionally renders gradient overlay', () => {
		const { container } = render(<Hero enableGradientOverlay={false} />);
		expect(container.querySelector('.bg-gradient-radial')).not.toBeInTheDocument();
	});

	it('handles missing optional content gracefully', () => {
		const minimalContent: HeroContent = {
			title: 'Minimal Title'
		};

		render(<Hero content={minimalContent} />);
		
		expect(screen.getByText('Minimal Title')).toBeInTheDocument();
		expect(screen.queryByText('John Schibelli')).not.toBeInTheDocument();
	});
});

describe('ModernHero Component', () => {
	const mockContent: HeroContent = {
		title: 'Modern Hero Title',
		subtitle: 'Modern Subtitle',
		description: 'Modern description content'
	};

	const mockPrimaryCTA: HeroCTA = {
		text: 'Primary CTA',
		href: '/primary',
		variant: 'primary',
		size: 'lg',
		'aria-label': 'Primary action'
	};

	const mockSecondaryCTA: HeroCTA = {
		text: 'Secondary CTA',
		href: '/secondary',
		variant: 'outline',
		size: 'lg',
		'aria-label': 'Secondary action'
	};

	const mockBackgroundImage: HeroImage = {
		src: '/modern-bg.jpg',
		alt: 'Modern background',
		quality: 90
	};

	it('renders with default props', () => {
		render(<ModernHero />);
		
		expect(screen.getByText('Building Smarter, Faster Web Applications')).toBeInTheDocument();
		expect(screen.getByText('Welcome to the Future')).toBeInTheDocument();
	});

	it('renders with custom content', () => {
		render(
			<ModernHero 
				content={mockContent}
				primaryCTA={mockPrimaryCTA}
				secondaryCTA={mockSecondaryCTA}
				backgroundImage={mockBackgroundImage}
			/>
		);

		expect(screen.getByText('Modern Hero Title')).toBeInTheDocument();
		expect(screen.getByText('Modern Subtitle')).toBeInTheDocument();
		expect(screen.getByText('Modern description content')).toBeInTheDocument();
	});

	it('renders primary CTA correctly', () => {
		render(<ModernHero primaryCTA={mockPrimaryCTA} />);
		
		const primaryButton = screen.getByRole('link', { name: 'Primary action' });
		expect(primaryButton).toBeInTheDocument();
		expect(primaryButton).toHaveAttribute('href', '/primary');
	});

	it('renders secondary CTA correctly', () => {
		render(<ModernHero secondaryCTA={mockSecondaryCTA} />);
		
		const secondaryButton = screen.getByRole('link', { name: 'Secondary action' });
		expect(secondaryButton).toBeInTheDocument();
		expect(secondaryButton).toHaveAttribute('href', '/secondary');
	});

	it('applies custom className', () => {
		const { container } = render(<ModernHero className="modern-custom-class" />);
		expect(container.firstChild).toHaveClass('modern-custom-class');
	});

	it('renders background image with correct style', () => {
		render(<ModernHero backgroundImage={mockBackgroundImage} />);
		
		const backgroundDiv = document.querySelector('[style*="url(/modern-bg.jpg)"]');
		expect(backgroundDiv).toBeInTheDocument();
	});

	it('handles missing optional content gracefully', () => {
		const minimalContent: HeroContent = {
			title: 'Minimal Modern Title'
		};

		render(<ModernHero content={minimalContent} />);
		
		expect(screen.getByText('Minimal Modern Title')).toBeInTheDocument();
		expect(screen.queryByText('Welcome to the Future')).not.toBeInTheDocument();
	});

	it('conditionally renders CTAs', () => {
		render(<ModernHero />);
		
		// Should render default CTAs
		expect(screen.getByRole('link', { name: 'Start your project journey' })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'Read our latest insights and tutorials' })).toBeInTheDocument();
	});
});

describe('Hero Component Integration', () => {
	it('maintains consistent styling across variants', () => {
		const { container: heroContainer } = render(<Hero />);
		const { container: modernContainer } = render(<ModernHero />);
		
		// Both should have similar base classes
		expect(heroContainer.firstChild).toHaveClass('relative', 'min-h-[400px]');
		expect(modernContainer.firstChild).toHaveClass('relative', 'min-h-[400px]');
	});

	it('supports accessibility attributes', () => {
		render(
			<Hero 
				aria-label="Main hero section"
				content={{
					title: 'Accessible Hero',
					authorName: 'Test Author'
				}}
			/>
		);
		
		const heroSection = screen.getByLabelText('Main hero section');
		expect(heroSection).toBeInTheDocument();
	});

	it('handles animation configuration', () => {
		const customAnimation: HeroAnimation = {
			duration: 1.5,
			delay: 0.5,
			ease: 'easeInOut',
			enabled: false
		};

		render(<Hero animation={customAnimation} />);
		
		// Component should render without errors even with custom animation
		expect(screen.getByText('Building Smarter, Faster')).toBeInTheDocument();
	});
});
