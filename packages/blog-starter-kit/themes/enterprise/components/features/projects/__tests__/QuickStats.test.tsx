import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import QuickStats, { ProjectMeta, createProjectMeta, createMixedProjectMeta } from '../QuickStats';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('QuickStats Component', () => {
  const mockProjectMeta: ProjectMeta[] = [
    { label: 'Next.js', type: 'stack', variant: 'default' },
    { label: 'TypeScript', type: 'stack', variant: 'default' },
    { label: 'Frontend Developer', type: 'role', variant: 'secondary' },
    { label: 'Active', type: 'status', variant: 'outline' },
    { label: '2024', type: 'year', variant: 'outline' }
  ];

  it('renders without crashing', () => {
    render(<QuickStats items={mockProjectMeta} />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('renders all badges correctly', () => {
    render(<QuickStats items={mockProjectMeta} />);
    
    expect(screen.getByText('Next.js')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
  });

  it('renders with custom aria-label', () => {
    const customAriaLabel = "Custom project badges";
    render(<QuickStats items={mockProjectMeta} aria-label={customAriaLabel} />);
    
    const list = screen.getByRole('list');
    expect(list).toHaveAttribute('aria-label', customAriaLabel);
  });

  it('renders with custom className', () => {
    const customClassName = "custom-stats-class";
    const { container } = render(<QuickStats items={mockProjectMeta} className={customClassName} />);
    
    expect(container.firstChild).toHaveClass(customClassName);
  });

  it('returns null when items array is empty', () => {
    const { container } = render(<QuickStats items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when items is undefined', () => {
    const { container } = render(<QuickStats items={undefined as any} />);
    expect(container.firstChild).toBeNull();
  });

  it('has proper semantic structure', () => {
    render(<QuickStats items={mockProjectMeta} />);
    
    const list = screen.getByRole('list');
    const listItems = screen.getAllByRole('listitem');
    
    expect(list).toBeInTheDocument();
    expect(listItems).toHaveLength(mockProjectMeta.length);
  });

  it('has proper accessibility attributes', () => {
    render(<QuickStats items={mockProjectMeta} />);
    
    const badges = screen.getAllByRole('listitem');
    badges.forEach((badge, index) => {
      expect(badge).toHaveAttribute('aria-label', `${mockProjectMeta[index].type}: ${mockProjectMeta[index].label}`);
      expect(badge).toHaveAttribute('tabIndex', '0');
    });
  });

  it('passes accessibility checks', async () => {
    const { container } = render(<QuickStats items={mockProjectMeta} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  describe('createProjectMeta utility', () => {
    it('creates ProjectMeta array from tags', () => {
      const tags = ['React', 'TypeScript', 'Tailwind'];
      const result = createProjectMeta(tags, 'stack');
      
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        label: 'React',
        type: 'stack',
        variant: 'default'
      });
    });

    it('uses default type when not specified', () => {
      const tags = ['React', 'TypeScript'];
      const result = createProjectMeta(tags);
      
      expect(result[0].type).toBe('stack');
    });
  });

  describe('createMixedProjectMeta utility', () => {
    it('creates mixed ProjectMeta array', () => {
      const result = createMixedProjectMeta(
        ['React', 'TypeScript'],
        ['Frontend Developer'],
        ['Active'],
        ['2024']
      );
      
      expect(result).toHaveLength(5);
      expect(result[0].type).toBe('stack');
      expect(result[2].type).toBe('role');
      expect(result[3].type).toBe('status');
      expect(result[4].type).toBe('year');
    });

    it('handles empty arrays', () => {
      const result = createMixedProjectMeta();
      expect(result).toHaveLength(0);
    });
  });

  describe('keyboard navigation', () => {
    it('all badges are focusable', () => {
      render(<QuickStats items={mockProjectMeta} />);
      
      const badges = screen.getAllByRole('listitem');
      badges.forEach(badge => {
        expect(badge).toHaveAttribute('tabIndex', '0');
      });
    });

    it('has focus styles applied', () => {
      render(<QuickStats items={mockProjectMeta} />);
      
      const badges = screen.getAllByRole('listitem');
      badges.forEach(badge => {
        expect(badge).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-primary');
      });
    });
  });
});
