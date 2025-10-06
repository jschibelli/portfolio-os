import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BlogPostSkeleton, BlogListSkeleton } from '../../components/features/blog/blog-skeleton';

describe('BlogPostSkeleton', () => {
  it('should render post skeleton with all sections', () => {
    const { container } = render(<BlogPostSkeleton />);
    
    // Check that skeleton elements are present
    const skeletonElements = container.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('should have proper structure for article skeleton', () => {
    const { container } = render(<BlogPostSkeleton />);
    
    // Check for article element
    const article = container.querySelector('article');
    expect(article).toBeInTheDocument();
    expect(article).toHaveClass('container', 'mx-auto');
  });

  it('should render cover image skeleton', () => {
    const { container } = render(<BlogPostSkeleton />);
    
    // Check for cover image skeleton
    const coverImageSkeleton = container.querySelector('.h-64.md\\:h-96');
    expect(coverImageSkeleton).toBeInTheDocument();
    expect(coverImageSkeleton).toHaveClass('animate-pulse');
  });

  it('should render title skeleton lines', () => {
    const { container } = render(<BlogPostSkeleton />);
    
    // Check for title skeleton elements
    const titleSkeletons = container.querySelectorAll('.h-10.bg-stone-200');
    expect(titleSkeletons.length).toBeGreaterThanOrEqual(2);
  });

  it('should render meta information skeleton', () => {
    const { container } = render(<BlogPostSkeleton />);
    
    // Check for meta information skeleton
    const metaSkeletons = container.querySelectorAll('.h-5.bg-stone-200');
    expect(metaSkeletons.length).toBeGreaterThanOrEqual(3);
  });

  it('should render tags skeleton', () => {
    const { container } = render(<BlogPostSkeleton />);
    
    // Check for tags skeleton
    const tagSkeletons = container.querySelectorAll('.h-8.bg-stone-200.rounded-full');
    expect(tagSkeletons.length).toBeGreaterThanOrEqual(3);
  });

  it('should render content skeleton', () => {
    const { container } = render(<BlogPostSkeleton />);
    
    // Check for content skeleton
    const contentSkeletons = container.querySelectorAll('.h-4.bg-stone-200');
    expect(contentSkeletons.length).toBeGreaterThanOrEqual(7);
  });

  it('should have responsive classes', () => {
    const { container } = render(<BlogPostSkeleton />);
    
    const coverImage = container.querySelector('.h-64.md\\:h-96');
    expect(coverImage).toHaveClass('h-64');
  });
});

describe('BlogListSkeleton', () => {
  it('should render list skeleton with all sections', () => {
    const { container } = render(<BlogListSkeleton />);
    
    // Check that skeleton elements are present
    const skeletonElements = container.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('should render featured post skeleton', () => {
    const { container } = render(<BlogListSkeleton />);
    
    // Check for featured post skeleton
    const featuredPostSkeleton = container.querySelector('.h-96');
    expect(featuredPostSkeleton).toBeInTheDocument();
    expect(featuredPostSkeleton).toHaveClass('animate-pulse');
  });

  it('should render latest posts grid', () => {
    const { container } = render(<BlogListSkeleton />);
    
    // Check for grid layout
    const grid = container.querySelector('.grid.gap-6.md\\:grid-cols-2.lg\\:grid-cols-3');
    expect(grid).toBeInTheDocument();
  });

  it('should render three post card skeletons', () => {
    const { container } = render(<BlogListSkeleton />);
    
    // Check for post card skeletons
    const grid = container.querySelector('.grid.gap-6.md\\:grid-cols-2.lg\\:grid-cols-3');
    expect(grid?.children.length).toBe(3);
  });

  it('should render post card cover images', () => {
    const { container } = render(<BlogListSkeleton />);
    
    // Check for post card cover images
    const coverImages = container.querySelectorAll('.h-48.bg-stone-200');
    expect(coverImages.length).toBe(3);
  });

  it('should have proper spacing and layout', () => {
    const { container } = render(<BlogListSkeleton />);
    
    // Check for proper spacing
    const wrapper = container.querySelector('.space-y-12');
    expect(wrapper).toBeInTheDocument();
  });

  it('should have responsive grid classes', () => {
    const { container } = render(<BlogListSkeleton />);
    
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('md:grid-cols-2', 'lg:grid-cols-3');
  });

  it('should have rounded corners on cards', () => {
    const { container } = render(<BlogListSkeleton />);
    
    const cards = container.querySelectorAll('.rounded-xl');
    expect(cards.length).toBeGreaterThanOrEqual(3);
  });

  it('should have shadow effects on cards', () => {
    const { container } = render(<BlogListSkeleton />);
    
    const cards = container.querySelectorAll('.shadow-md, .shadow-lg');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should render tag skeletons in post cards', () => {
    const { container } = render(<BlogListSkeleton />);
    
    const tagSkeletons = container.querySelectorAll('.rounded-full.animate-pulse');
    // Each card should have at least 2 tag skeletons
    expect(tagSkeletons.length).toBeGreaterThanOrEqual(6);
  });
});
