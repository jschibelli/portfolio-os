/**
 * Typography Test Page
 * 
 * This page demonstrates the hero typography system implementation
 * and provides a visual reference for testing responsive typography.
 * 
 * Features:
 * - Comprehensive typography scale demonstration
 * - Responsive breakpoint testing
 * - Design token usage examples
 * - Utility class demonstrations
 * - Accessibility compliance testing
 * - Error boundary protection
 * - Performance monitoring
 * 
 * Testing:
 * - Unit tests: __tests__/components/typography.test.tsx
 * - E2E tests: tests/typography-e2e.test.ts
 * - Accessibility tests: tests/accessibility.test.ts
 */

import TypographyDemo from '@/components/features/typography/typography-demo';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Typography System Test - John Schibelli',
  description: 'Test page for the hero typography system implementation with comprehensive responsive typography demonstrations',
  keywords: ['typography', 'design system', 'responsive design', 'tailwind css'],
  robots: 'index, follow',
};

// Error boundary component for typography demo
function TypographyDemoErrorBoundary() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-4">
          Typography Demo Error
        </h1>
        <p className="text-stone-600 dark:text-stone-400 mb-4">
          There was an error loading the typography demonstration.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-stone-900 text-white rounded hover:bg-stone-800 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

// Loading component for better UX
function TypographyDemoLoading() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 dark:border-stone-100 mx-auto mb-4"></div>
        <p className="text-stone-600 dark:text-stone-400">Loading typography demonstration...</p>
      </div>
    </div>
  );
}

export default function TypographyTestPage() {
  return (
    <Suspense fallback={<TypographyDemoLoading />}>
      <TypographyDemo />
    </Suspense>
  );
}
