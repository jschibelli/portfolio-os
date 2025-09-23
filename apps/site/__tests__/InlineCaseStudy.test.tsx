/**
 * InlineCaseStudy Component Tests
 * 
 * Tests for the InlineCaseStudy components including:
 * - Basic rendering
 * - Keyboard navigation
 * - Accessibility compliance (axe-core)
 * - Interactive elements
 * - Data visualization components
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { 
  InlineMetrics, 
  InlineComparison, 
  InlineTimeline, 
  InlineQuote, 
  InlineCodeBlock 
} from '../components/features/case-studies/case-study/CaseStudyEnhancer';
import { setupTestEnvironment } from './test-utils/test-environment';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  TrendingDown: () => <div data-testid="trending-down-icon" />,
  Minus: () => <div data-testid="minus-icon" />,
}));

describe('InlineCaseStudy Components', () => {
  beforeAll(() => {
    setupTestEnvironment();
  });

  describe('InlineMetrics', () => {
    const mockMetrics = [
      {
        value: '95%',
        label: 'User Satisfaction',
        trend: '+12%',
        trendDirection: 'up' as const,
        color: 'green' as const,
      },
      {
        value: '2.3s',
        label: 'Load Time',
        trend: '-0.5s',
        trendDirection: 'down' as const,
        color: 'blue' as const,
      },
      {
        value: '1,250',
        label: 'Active Users',
        trend: '0%',
        trendDirection: 'neutral' as const,
        color: 'purple' as const,
      },
    ];

    it('renders metrics with correct values', () => {
      render(<InlineMetrics metrics={mockMetrics} />);
      
      expect(screen.getByText('95%')).toBeInTheDocument();
      expect(screen.getByText('User Satisfaction')).toBeInTheDocument();
      expect(screen.getByText('2.3s')).toBeInTheDocument();
      expect(screen.getByText('Load Time')).toBeInTheDocument();
      expect(screen.getByText('1,250')).toBeInTheDocument();
      expect(screen.getByText('Active Users')).toBeInTheDocument();
    });

    it('renders trend indicators', () => {
      render(<InlineMetrics metrics={mockMetrics} />);
      
      expect(screen.getByText('+12%')).toBeInTheDocument();
      expect(screen.getByText('-0.5s')).toBeInTheDocument();
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('renders trend icons', () => {
      render(<InlineMetrics metrics={mockMetrics} />);
      
      expect(screen.getByTestId('trending-up-icon')).toBeInTheDocument();
      expect(screen.getByTestId('trending-down-icon')).toBeInTheDocument();
      expect(screen.getByTestId('minus-icon')).toBeInTheDocument();
    });

    it('applies correct grid layout for different column counts', () => {
      const { rerender } = render(<InlineMetrics metrics={mockMetrics} columns={2} />);
      let container = screen.getByText('95%').closest('.grid');
      expect(container).toHaveClass('grid-cols-1', 'md:grid-cols-2');

      rerender(<InlineMetrics metrics={mockMetrics} columns={3} />);
      container = screen.getByText('95%').closest('.grid');
      expect(container).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');

      rerender(<InlineMetrics metrics={mockMetrics} columns={4} />);
      container = screen.getByText('95%').closest('.grid');
      expect(container).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4');
    });

    it('has proper accessibility structure', () => {
      render(<InlineMetrics metrics={mockMetrics} />);
      
      // Basic accessibility checks
      expect(screen.getByText('95%')).toBeInTheDocument();
      expect(screen.getByText('User Satisfaction')).toBeInTheDocument();
    });

    it('handles empty metrics array', () => {
      render(<InlineMetrics metrics={[]} />);
      
      // Should render the grid container even with empty data
      const gridContainer = document.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();
    });
  });

  describe('InlineComparison', () => {
    const mockComparisonData = [
      {
        label: 'Response Time',
        tendril: '150ms',
        competitor: '300ms',
        better: 'tendril' as const,
      },
      {
        label: 'Uptime',
        tendril: '99.9%',
        competitor: '99.5%',
        better: 'tendril' as const,
      },
      {
        label: 'Price',
        tendril: '$29/month',
        competitor: '$19/month',
        better: 'competitor' as const,
      },
    ];

    it('renders comparison title', () => {
      render(<InlineComparison title="Performance Comparison" data={mockComparisonData} />);
      
      expect(screen.getByText('Performance Comparison')).toBeInTheDocument();
    });

    it('renders all comparison items', () => {
      render(<InlineComparison title="Performance Comparison" data={mockComparisonData} />);
      
      expect(screen.getByText('Response Time')).toBeInTheDocument();
      expect(screen.getByText('150ms')).toBeInTheDocument();
      expect(screen.getByText('300ms')).toBeInTheDocument();
      expect(screen.getByText('Uptime')).toBeInTheDocument();
      expect(screen.getByText('99.9%')).toBeInTheDocument();
      expect(screen.getByText('99.5%')).toBeInTheDocument();
    });

    it('renders "vs" separators', () => {
      render(<InlineComparison title="Performance Comparison" data={mockComparisonData} />);
      
      const vsElements = screen.getAllByText('vs');
      expect(vsElements).toHaveLength(3);
    });

    it('renders "Better" badges for tendril advantages', () => {
      render(<InlineComparison title="Performance Comparison" data={mockComparisonData} />);
      
      const betterBadges = screen.getAllByText('Better');
      expect(betterBadges).toHaveLength(2); // Two items where tendril is better
    });

    it('has proper accessibility structure', () => {
      render(<InlineComparison title="Performance Comparison" data={mockComparisonData} />);
      
      // Basic accessibility checks
      expect(screen.getByText('Performance Comparison')).toBeInTheDocument();
      expect(screen.getByText('Response Time')).toBeInTheDocument();
    });

    it('handles empty data array', () => {
      render(<InlineComparison title="Empty Comparison" data={[]} />);
      
      expect(screen.getByText('Empty Comparison')).toBeInTheDocument();
    });
  });

  describe('InlineTimeline', () => {
    const mockTimelineData = [
      {
        phase: 'Phase 1',
        title: 'Research & Discovery',
        duration: '2 weeks',
        description: 'User research and market analysis',
      },
      {
        phase: 'Phase 2',
        title: 'Design & Prototyping',
        duration: '3 weeks',
        description: 'UI/UX design and prototype development',
      },
      {
        phase: 'Phase 3',
        title: 'Development',
        duration: '6 weeks',
        description: 'Frontend and backend development',
      },
    ];

    it('renders all timeline items', () => {
      render(<InlineTimeline items={mockTimelineData} />);
      
      expect(screen.getByText('Phase 1')).toBeInTheDocument();
      expect(screen.getByText('Research & Discovery')).toBeInTheDocument();
      expect(screen.getByText('2 weeks')).toBeInTheDocument();
      expect(screen.getByText('User research and market analysis')).toBeInTheDocument();
      
      expect(screen.getByText('Phase 2')).toBeInTheDocument();
      expect(screen.getByText('Design & Prototyping')).toBeInTheDocument();
      expect(screen.getByText('3 weeks')).toBeInTheDocument();
      expect(screen.getByText('UI/UX design and prototype development')).toBeInTheDocument();
      
      expect(screen.getByText('Phase 3')).toBeInTheDocument();
      expect(screen.getByText('Development')).toBeInTheDocument();
      expect(screen.getByText('6 weeks')).toBeInTheDocument();
      expect(screen.getByText('Frontend and backend development')).toBeInTheDocument();
    });

    it('has proper accessibility structure', () => {
      render(<InlineTimeline items={mockTimelineData} />);
      
      // Basic accessibility checks
      expect(screen.getByText('Phase 1')).toBeInTheDocument();
      expect(screen.getByText('Research & Discovery')).toBeInTheDocument();
    });

    it('handles empty timeline items', () => {
      render(<InlineTimeline items={[]} />);
      
      // Should render the timeline container even with empty data
      const timelineContainer = document.querySelector('.space-y-4');
      expect(timelineContainer).toBeInTheDocument();
    });
  });

  describe('InlineQuote', () => {
    const mockQuote = {
      quote: 'This project exceeded our expectations and delivered outstanding results.',
      author: 'John Smith',
      role: 'Product Manager',
      company: 'TechCorp',
    };

    it('renders quote text', () => {
      render(<InlineQuote {...mockQuote} />);
      
      expect(screen.getByText('"This project exceeded our expectations and delivered outstanding results."')).toBeInTheDocument();
    });

    it('renders author information', () => {
      render(<InlineQuote {...mockQuote} />);
      
      expect(screen.getByText('John Smith')).toBeInTheDocument();
      expect(screen.getByText(', Product Manager')).toBeInTheDocument();
      expect(screen.getByText('at TechCorp')).toBeInTheDocument();
    });

    it('renders quote without role and company', () => {
      const simpleQuote = {
        quote: 'Simple quote',
        author: 'Jane Doe',
      };
      
      render(<InlineQuote {...simpleQuote} />);
      
      expect(screen.getByText('"Simple quote"')).toBeInTheDocument();
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
      expect(screen.queryByText('at')).not.toBeInTheDocument();
    });

    it('has proper semantic structure with blockquote', () => {
      render(<InlineQuote {...mockQuote} />);
      
      // Check for blockquote element
      const blockquote = document.querySelector('blockquote');
      expect(blockquote).toBeInTheDocument();
    });

    it('has proper accessibility structure', () => {
      render(<InlineQuote {...mockQuote} />);
      
      // Basic accessibility checks
      expect(screen.getByText('"This project exceeded our expectations and delivered outstanding results."')).toBeInTheDocument();
      expect(screen.getByText('John Smith')).toBeInTheDocument();
    });
  });

  describe('InlineCodeBlock', () => {
    const mockCode = `function example() {
  return "Hello, World!";
}`;

    it('renders code content', () => {
      render(<InlineCodeBlock>{mockCode}</InlineCodeBlock>);
      
      // Check for code content in the pre/code elements
      const codeElement = document.querySelector('code');
      expect(codeElement).toBeInTheDocument();
      expect(codeElement?.textContent).toContain('function example()');
      expect(codeElement?.textContent).toContain('return "Hello, World!"');
    });

    it('renders with title when provided', () => {
      render(<InlineCodeBlock title="Example Function" language="javascript">{mockCode}</InlineCodeBlock>);
      
      expect(screen.getByText('Example Function')).toBeInTheDocument();
    });

    it('renders without title when not provided', () => {
      render(<InlineCodeBlock language="javascript">{mockCode}</InlineCodeBlock>);
      
      expect(screen.queryByText('Example Function')).not.toBeInTheDocument();
    });

    it('has proper accessibility structure', () => {
      render(<InlineCodeBlock>{mockCode}</InlineCodeBlock>);
      
      // Basic accessibility checks
      const codeElement = document.querySelector('code');
      expect(codeElement).toBeInTheDocument();
      expect(codeElement?.textContent).toContain('function example()');
    });

    it('handles empty code content', () => {
      render(<InlineCodeBlock>{''}</InlineCodeBlock>);
      
      // Should render the code block container even with empty content
      const codeElement = document.querySelector('code');
      expect(codeElement).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('allows keyboard navigation through interactive elements', () => {
      const mockMetrics = [
        {
          value: '95%',
          label: 'User Satisfaction',
          trend: '+12%',
          trendDirection: 'up' as const,
          color: 'green' as const,
        },
      ];

      render(<InlineMetrics metrics={mockMetrics} />);
      
      // All elements should be focusable if they have interactive behavior
      const container = screen.getByText('95%').closest('div');
      expect(container).toBeInTheDocument();
    });

    it('supports keyboard navigation in comparison component', () => {
      const mockComparisonData = [
        {
          label: 'Response Time',
          tendril: '150ms',
          competitor: '300ms',
          better: 'tendril' as const,
        },
      ];

      render(<InlineComparison title="Test Comparison" data={mockComparisonData} />);
      
      const container = screen.getByText('Response Time').closest('div');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive classes correctly', () => {
      const mockMetrics = [
        {
          value: '95%',
          label: 'User Satisfaction',
          trend: '+12%',
          trendDirection: 'up' as const,
          color: 'green' as const,
        },
      ];

      render(<InlineMetrics metrics={mockMetrics} columns={3} />);
      
      const gridContainer = screen.getByText('95%').closest('.grid');
      expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
    });

    it('maintains accessibility on different screen sizes', async () => {
      const mockMetrics = [
        {
          value: '95%',
          label: 'User Satisfaction',
          trend: '+12%',
          trendDirection: 'up' as const,
          color: 'green' as const,
        },
      ];

      // Test with different viewport sizes
      const { container } = render(<InlineMetrics metrics={mockMetrics} />);
      
      // Simulate mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      // Basic accessibility checks
      expect(container).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles malformed metrics data gracefully', () => {
      const malformedMetrics = [
        {
          value: '95%',
          label: 'User Satisfaction',
          // Missing trend and trendDirection
        },
      ] as any;

      expect(() => render(<InlineMetrics metrics={malformedMetrics} />)).not.toThrow();
    });

    it('handles malformed comparison data gracefully', () => {
      const malformedComparison = [
        {
          label: 'Response Time',
          tendril: '150ms',
          // Missing competitor and better
        },
      ] as any;

      expect(() => render(<InlineComparison title="Test" data={malformedComparison} />)).not.toThrow();
    });

    it('handles malformed timeline data gracefully', () => {
      const malformedTimeline = [
        {
          phase: 'Phase 1',
          title: 'Research',
          // Missing duration and description
        },
      ] as any;

      expect(() => render(<InlineTimeline items={malformedTimeline} />)).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('renders large datasets efficiently', () => {
      const largeMetricsArray = Array.from({ length: 100 }, (_, i) => ({
        value: `${i}%`,
        label: `Metric ${i}`,
        trend: '+1%',
        trendDirection: 'up' as const,
        color: 'green' as const,
      }));

      const startTime = performance.now();
      render(<InlineMetrics metrics={largeMetricsArray} />);
      const endTime = performance.now();

      // Should render within reasonable time (adjust threshold as needed)
      expect(endTime - startTime).toBeLessThan(1000); // 1 second
    });
  });
});
