// Simple MDX renderer that works without external dependencies
// This provides basic MDX-like functionality using existing markdown rendering
// 
// Performance considerations:
// - Uses React.memo for component memoization to prevent unnecessary re-renders
// - Memoizes content to avoid re-parsing on every render
// - Custom components are pre-memoized for optimal performance

import React, { memo, useMemo } from 'react';
import { CaseStudyMarkdown } from '../components/features/case-studies/case-study-markdown';

interface SimpleMDXRendererProps {
  content: string;
  components?: Record<string, React.ComponentType<any>>;
}

export const SimpleMDXRenderer = memo(function SimpleMDXRenderer({ 
  content, 
  components = {} 
}: SimpleMDXRendererProps) {
  // Memoize the content to avoid unnecessary re-renders
  const memoizedContent = useMemo(() => content, [content]);
  
  // Error boundary for MDX content rendering
  try {
    // For now, we'll use the existing CaseStudyMarkdown component
    // In a full implementation, you'd parse the MDX content and render custom components
    return <CaseStudyMarkdown contentMarkdown={memoizedContent} />;
  } catch (error) {
    console.error('Error rendering MDX content:', error);
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 my-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-red-600 dark:text-red-400">⚠️</span>
          <h4 className="font-semibold text-red-900 dark:text-red-100">Content Rendering Error</h4>
        </div>
        <div className="text-red-800 dark:text-red-200">
          There was an error rendering this content. Please try refreshing the page.
        </div>
      </div>
    );
  }
});

// Custom components that can be used in MDX
export const defaultComponents = {
  InfoCard: memo(function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <div className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-6 my-6">
        <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-3">{title}</h3>
        <div className="text-stone-700 dark:text-stone-300">{children}</div>
      </div>
    );
  }),
  
  Callout: memo(function Callout({ variant = 'info', title, children }: { 
    variant?: 'info' | 'warn' | 'success' | 'error'; 
    title?: string; 
    children: React.ReactNode 
  }) {
    const variants = {
      info: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100',
      warn: 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-900 dark:text-yellow-100',
      success: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100',
      error: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100',
    };
    
    return (
      <div className={`rounded-lg border p-4 my-4 ${variants[variant]}`}>
        {title && <h4 className="font-semibold mb-2">{title}</h4>}
        <div className="prose prose-sm max-w-none dark:prose-invert">{children}</div>
      </div>
    );
  }),
  
  StatBadge: ({ label, value }: { label: string; value: string | number }) => (
    <div className="inline-flex items-center gap-2 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-full px-4 py-2 my-2">
      <span className="text-sm font-medium text-stone-600 dark:text-stone-400">{label}:</span>
      <span className="text-sm font-bold text-stone-900 dark:text-stone-100">{String(value)}</span>
    </div>
  ),

  MetricsGrid: ({ children }: { children: React.ReactNode }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
      {children}
    </div>
  ),

  MetricCard: ({ title, value, description, trend }: { 
    title: string; 
    value: string; 
    description?: string; 
    trend?: 'up' | 'down' | 'neutral' 
  }) => {
    const trendColors = {
      up: 'text-green-600 dark:text-green-400',
      down: 'text-red-600 dark:text-red-400',
      neutral: 'text-stone-600 dark:text-stone-400'
    };

    return (
      <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-stone-600 dark:text-stone-400">{title}</h4>
          {trend && (
            <span className={`text-xs ${trendColors[trend]}`}>
              {trend === 'up' && '↗'}
              {trend === 'down' && '↘'}
              {trend === 'neutral' && '→'}
            </span>
          )}
        </div>
        <div className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-1">{value}</div>
        {description && (
          <div className="text-xs text-stone-500 dark:text-stone-400">{description}</div>
        )}
      </div>
    );
  },

  TechStack: ({ technologies }: { technologies: string[] }) => (
    <div className="flex flex-wrap gap-2 my-4">
      {technologies.map((tech) => (
        <span
          key={tech}
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700"
        >
          {tech}
        </span>
      ))}
    </div>
  ),

  Timeline: ({ children }: { children: React.ReactNode }) => (
    <div className="relative my-6">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-stone-200 dark:bg-stone-700"></div>
      <div className="space-y-6">{children}</div>
    </div>
  ),

  TimelineItem: ({ title, date, children }: { 
    title: string; 
    date?: string; 
    children: React.ReactNode 
  }) => (
    <div className="relative flex items-start">
      <div className="absolute left-3 w-2 h-2 bg-stone-400 dark:bg-stone-500 rounded-full border-2 border-white dark:border-stone-800"></div>
      <div className="ml-8">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="font-semibold text-stone-900 dark:text-stone-100">{title}</h4>
          {date && (
            <span className="text-sm text-stone-500 dark:text-stone-400">{date}</span>
          )}
        </div>
        <div className="text-stone-700 dark:text-stone-300">{children}</div>
      </div>
    </div>
  ),

  Challenge: ({ children }: { children: React.ReactNode }) => (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 my-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-red-600 dark:text-red-400">⚠️</span>
        <h4 className="font-semibold text-red-900 dark:text-red-100">Challenge</h4>
      </div>
      <div className="text-red-800 dark:text-red-200">{children}</div>
    </div>
  ),

  Solution: ({ children }: { children: React.ReactNode }) => (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 my-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-green-600 dark:text-green-400">✅</span>
        <h4 className="font-semibold text-green-900 dark:text-green-100">Solution</h4>
      </div>
      <div className="text-green-800 dark:text-green-200">{children}</div>
    </div>
  ),

  Result: ({ children }: { children: React.ReactNode }) => (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 my-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-blue-600 dark:text-blue-400">📊</span>
        <h4 className="font-semibold text-blue-900 dark:text-blue-100">Result</h4>
      </div>
      <div className="text-blue-800 dark:text-blue-200">{children}</div>
    </div>
  ),

  Quote: ({ author, children }: { author?: string; children: React.ReactNode }) => (
    <blockquote className="border-l-4 border-stone-300 dark:border-stone-600 pl-4 py-2 my-6 italic text-stone-700 dark:text-stone-300">
      <div className="text-lg">&ldquo;{children}&rdquo;</div>
      {author && (
        <footer className="text-sm text-stone-500 dark:text-stone-400 mt-2">— {author}</footer>
      )}
    </blockquote>
  ),
};
