import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InlineCaseStudy, createInlineCaseStudy } from '../../components/projects/InlineCaseStudy';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ChevronDown: ({ className, ...props }: any) => <div className={className} data-testid="chevron-down" {...props}>▼</div>,
  ChevronUp: ({ className, ...props }: any) => <div className={className} data-testid="chevron-up" {...props}>▲</div>,
  Target: ({ className, ...props }: any) => <div className={className} data-testid="target" {...props}>🎯</div>,
  Lightbulb: ({ className, ...props }: any) => <div className={className} data-testid="lightbulb" {...props}>💡</div>,
  AlertTriangle: ({ className, ...props }: any) => <div className={className} data-testid="alert-triangle" {...props}>⚠️</div>,
  TrendingUp: ({ className, ...props }: any) => <div className={className} data-testid="trending-up" {...props}>📈</div>,
}));

describe('InlineCaseStudy', () => {
  const mockCaseStudyData = createInlineCaseStudy(
    'Test Case Study',
    'A test case study for unit testing',
    [
      {
        id: 'problem',
        title: 'Problem Statement',
        description: 'The challenge that needed to be solved',
        content: <div>Problem content</div>,
      },
      {
        id: 'solution',
        title: 'Solution Design',
        description: 'The approach and architecture chosen',
        content: <div>Solution content</div>,
      },
    ]
  );

  beforeEach(() => {
    // Reset any mocks
    jest.clearAllMocks();
  });

  it('renders the case study title and description', () => {
    render(<InlineCaseStudy data={mockCaseStudyData} />);
    
    expect(screen.getByText('Test Case Study')).toBeInTheDocument();
    // Check for the visible description (not the screen reader one)
    expect(screen.getByText('A test case study for unit testing', { selector: 'p' })).toBeInTheDocument();
  });

  it('renders all section titles', () => {
    render(<InlineCaseStudy data={mockCaseStudyData} />);
    
    expect(screen.getByText('Problem Statement')).toBeInTheDocument();
    expect(screen.getByText('Solution Design')).toBeInTheDocument();
  });

  it('renders section descriptions', () => {
    render(<InlineCaseStudy data={mockCaseStudyData} />);
    
    expect(screen.getByText('The challenge that needed to be solved')).toBeInTheDocument();
    expect(screen.getByText('The approach and architecture chosen')).toBeInTheDocument();
  });

  it('toggles section content on click', async () => {
    render(<InlineCaseStudy data={mockCaseStudyData} />);
    
    const problemTrigger = screen.getByRole('button', { name: /problem statement/i });
    
    // Initially closed
    expect(problemTrigger).toHaveAttribute('aria-expanded', 'false');
    
    // Click to open
    fireEvent.click(problemTrigger);
    expect(problemTrigger).toHaveAttribute('aria-expanded', 'true');
    
    // Content should be visible
    await waitFor(() => {
      expect(screen.getByText('Problem content')).toBeInTheDocument();
    });
    
    // Click to close
    fireEvent.click(problemTrigger);
    expect(problemTrigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens default section when specified', () => {
    render(<InlineCaseStudy data={mockCaseStudyData} defaultOpenSection="problem" />);
    
    const problemTrigger = screen.getByRole('button', { name: /problem statement/i });
    expect(problemTrigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<InlineCaseStudy data={mockCaseStudyData} />);
    
    const problemTrigger = screen.getByRole('button', { name: /problem statement/i });
    const solutionTrigger = screen.getByRole('button', { name: /solution design/i });
    
    // Focus first trigger
    problemTrigger.focus();
    expect(problemTrigger).toHaveFocus();
    
    // Arrow down should focus next trigger
    await user.keyboard('{ArrowDown}');
    expect(solutionTrigger).toHaveFocus();
    
    // Arrow up should focus previous trigger
    await user.keyboard('{ArrowUp}');
    expect(problemTrigger).toHaveFocus();
  });

  it('handles Enter key to toggle sections', async () => {
    const user = userEvent.setup();
    render(<InlineCaseStudy data={mockCaseStudyData} />);
    
    const problemTrigger = screen.getByRole('button', { name: /problem statement/i });
    
    // Focus and press Enter
    problemTrigger.focus();
    await user.keyboard('{Enter}');
    
    expect(problemTrigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('handles Space key to toggle sections', async () => {
    const user = userEvent.setup();
    render(<InlineCaseStudy data={mockCaseStudyData} />);
    
    const problemTrigger = screen.getByRole('button', { name: /problem statement/i });
    
    // Focus and press Space
    problemTrigger.focus();
    await user.keyboard(' ');
    
    expect(problemTrigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('handles Home key to focus first section', async () => {
    const user = userEvent.setup();
    render(<InlineCaseStudy data={mockCaseStudyData} />);
    
    const problemTrigger = screen.getByRole('button', { name: /problem statement/i });
    const solutionTrigger = screen.getByRole('button', { name: /solution design/i });
    
    // Focus second trigger
    solutionTrigger.focus();
    expect(solutionTrigger).toHaveFocus();
    
    // Press Home to focus first
    await user.keyboard('{Home}');
    expect(problemTrigger).toHaveFocus();
  });

  it('handles End key to focus last section', async () => {
    const user = userEvent.setup();
    render(<InlineCaseStudy data={mockCaseStudyData} />);
    
    const problemTrigger = screen.getByRole('button', { name: /problem statement/i });
    const solutionTrigger = screen.getByRole('button', { name: /solution design/i });
    
    // Focus first trigger
    problemTrigger.focus();
    expect(problemTrigger).toHaveFocus();
    
    // Press End to focus last
    await user.keyboard('{End}');
    expect(solutionTrigger).toHaveFocus();
  });

  it('toggles all sections with expand/collapse all button', async () => {
    render(<InlineCaseStudy data={mockCaseStudyData} />);
    
    const expandAllButton = screen.getByRole('button', { name: /expand all/i });
    const problemTrigger = screen.getByRole('button', { name: /problem statement/i });
    const solutionTrigger = screen.getByRole('button', { name: /solution design/i });
    
    // Initially all closed
    expect(problemTrigger).toHaveAttribute('aria-expanded', 'false');
    expect(solutionTrigger).toHaveAttribute('aria-expanded', 'false');
    
    // Click expand all
    fireEvent.click(expandAllButton);
    
    // All should be open
    expect(problemTrigger).toHaveAttribute('aria-expanded', 'true');
    expect(solutionTrigger).toHaveAttribute('aria-expanded', 'true');
    
    // Button text should change
    expect(screen.getByRole('button', { name: /collapse all/i })).toBeInTheDocument();
  });

  it('has proper ARIA attributes', () => {
    render(<InlineCaseStudy data={mockCaseStudyData} />);
    
    const problemTrigger = screen.getByRole('button', { name: /problem statement/i });
    
    // Check ARIA attributes
    expect(problemTrigger).toHaveAttribute('aria-expanded');
    expect(problemTrigger).toHaveAttribute('aria-controls');
    expect(problemTrigger).toHaveAttribute('aria-describedby');
    expect(problemTrigger).toHaveAttribute('role', 'button');
  });

  it('applies custom className', () => {
    const { container } = render(
      <InlineCaseStudy data={mockCaseStudyData} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('shows section numbers', () => {
    render(<InlineCaseStudy data={mockCaseStudyData} />);
    
    expect(screen.getByText('1 of 2')).toBeInTheDocument();
    expect(screen.getByText('2 of 2')).toBeInTheDocument();
  });

  it('renders expand/collapse all button with correct text', () => {
    render(<InlineCaseStudy data={mockCaseStudyData} />);
    
    // Initially should show "Expand All"
    expect(screen.getByRole('button', { name: /expand all/i })).toBeInTheDocument();
  });
});
