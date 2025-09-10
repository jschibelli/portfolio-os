// Simple MDX renderer that works without external dependencies
// This provides basic MDX-like functionality using existing markdown rendering

import React from 'react';
import { CaseStudyMarkdown } from '../components/features/case-studies/case-study-markdown';

interface SimpleMDXRendererProps {
  content: string;
  components?: Record<string, React.ComponentType<any>>;
}

export function SimpleMDXRenderer({ content, components = {} }: SimpleMDXRendererProps) {
  // For now, we'll use the existing CaseStudyMarkdown component
  // In a full implementation, you'd parse the MDX content and render custom components
  return <CaseStudyMarkdown contentMarkdown={content} />;
}

// Custom components that can be used in MDX
export const defaultComponents = {
  InfoCard: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-stone-50 border border-stone-200 rounded-lg p-6 my-6">
      <h3 className="text-lg font-semibold text-stone-900 mb-3">{title}</h3>
      <div className="text-stone-700">{children}</div>
    </div>
  ),
  
  Callout: ({ variant = 'info', title, children }: { 
    variant?: 'info' | 'warn' | 'success' | 'error'; 
    title?: string; 
    children: React.ReactNode 
  }) => {
    const variants = {
      info: 'border-blue-200 bg-blue-50 text-blue-900',
      warn: 'border-yellow-200 bg-yellow-50 text-yellow-900',
      success: 'border-green-200 bg-green-50 text-green-900',
      error: 'border-red-200 bg-red-50 text-red-900',
    };
    
    return (
      <div className={`rounded-lg border p-4 ${variants[variant]}`}>
        {title && <h4 className="font-semibold mb-2">{title}</h4>}
        <div className="prose prose-sm max-w-none">{children}</div>
      </div>
    );
  },
  
  StatBadge: ({ label, value }: { label: string; value: string }) => (
    <div className="inline-flex items-center gap-2 bg-stone-100 border border-stone-200 rounded-full px-4 py-2 my-2">
      <span className="text-sm font-medium text-stone-600">{label}:</span>
      <span className="text-sm font-bold text-stone-900">{value}</span>
    </div>
  ),
};
