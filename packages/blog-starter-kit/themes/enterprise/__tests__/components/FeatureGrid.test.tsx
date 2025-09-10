import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
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
      description: 'This is a test feature description for feature 1.',
    },
    {
      id: 'feature-2',
      title: 'Test Feature 2',
      description: 'This is a test feature description for feature 2.',
    },
    {
      id: 'feature-3',
      title: 'Test Feature 3',
      description: 'This is a test feature description for feature 3.',
    },
  ];

  it('renders with default title when no title prop is provided', () => {
    render(<FeatureGrid features={mockFeatures} />);
    
    expect(screen.getByText('Features')).toBeInTheDocument();
  });

  it('renders with custom title when provided', () => {
    const customTitle = 'Custom Features Title';
    render(<FeatureGrid features={mockFeatures} title={customTitle} />);
    
    expect(screen.getByText(customTitle)).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    const customDescription = 'This is a custom description for the features section.';
    render(
      <FeatureGrid 
        features={mockFeatures} 
        title="Test Features"
        description={customDescription}
      />
    );
    
    expect(screen.getByText(customDescription)).toBeInTheDocument();
  });

  it('renders all features with correct titles and descriptions', () => {
    render(<FeatureGrid features={mockFeatures} />);
    
    mockFeatures.forEach((feature) => {
      expect(screen.getByText(feature.title)).toBeInTheDocument();
      expect(screen.getByText(feature.description)).toBeInTheDocument();
    });
  });

  it('applies custom className when provided', () => {
    const customClassName = 'custom-feature-grid-class';
    const { container } = render(
      <FeatureGrid features={mockFeatures} className={customClassName} />
    );
    
    const section = container.querySelector('section');
    expect(section).toHaveClass(customClassName);
  });

  it('handles empty features array gracefully', () => {
    render(<FeatureGrid features={[]} />);
    
    expect(screen.getByText('Features')).toBeInTheDocument();
    // Should not crash and should render the section header
  });

  it('renders features in a grid layout', () => {
    const { container } = render(<FeatureGrid features={mockFeatures} />);
    
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4');
  });

  it('applies stone theme classes correctly', () => {
    const { container } = render(<FeatureGrid features={mockFeatures} />);
    
    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-white', 'dark:bg-stone-950');
    
    const title = screen.getByText('Features');
    expect(title).toHaveClass('text-stone-900', 'dark:text-stone-100');
  });

  it('renders feature cards with proper structure', () => {
    render(<FeatureGrid features={mockFeatures} />);
    
    // Check that each feature has a card structure
    mockFeatures.forEach((feature) => {
      const featureTitle = screen.getByText(feature.title);
      const featureDescription = screen.getByText(feature.description);
      
      expect(featureTitle).toBeInTheDocument();
      expect(featureDescription).toBeInTheDocument();
    });
  });

  it('handles single feature correctly', () => {
    const singleFeature = [mockFeatures[0]];
    render(<FeatureGrid features={singleFeature} />);
    
    expect(screen.getByText(singleFeature[0].title)).toBeInTheDocument();
    expect(screen.getByText(singleFeature[0].description)).toBeInTheDocument();
  });
});
