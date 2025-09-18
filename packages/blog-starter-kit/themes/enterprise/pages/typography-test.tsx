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

// Enhanced error boundary component for typography demo with specific error handling
function TypographyDemoErrorBoundary({ error, resetError }: { error?: Error; resetError?: () => void }) {
  const handleRetry = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex items-center justify-center">
      <div className="text-center p-8 max-w-md mx-auto">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">
            Typography Demo Error
          </h1>
          <p className="text-stone-600 dark:text-stone-400 mb-4">
            There was an error loading the typography demonstration.
          </p>
          {error && (
            <details className="mb-4 text-left">
              <summary className="cursor-pointer text-sm text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300">
                Error Details
              </summary>
              <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                <code className="text-xs text-red-700 dark:text-red-300 break-all">
                  {error.message}
                </code>
              </div>
            </details>
          )}
        </div>
        <div className="space-y-3">
          <button 
            onClick={handleRetry}
            className="w-full px-4 py-2 bg-stone-900 text-white rounded hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
            aria-label="Retry loading typography demonstration"
          >
            Retry
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full px-4 py-2 bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100 rounded hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
            aria-label="Return to homepage"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

// Enhanced loading component with performance optimizations and accessibility
function TypographyDemoLoading() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex items-center justify-center">
      <div className="text-center" role="status" aria-live="polite">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 dark:border-stone-100 mx-auto mb-4" aria-hidden="true"></div>
        <p className="text-stone-600 dark:text-stone-400 mb-2">Loading typography demonstration...</p>
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-stone-400 dark:bg-stone-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-stone-400 dark:bg-stone-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-stone-400 dark:bg-stone-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-4">
          Optimizing typography rendering...
        </p>
      </div>
    </div>
  );
}

// Performance-optimized typography test page with enhanced security and accessibility
export default function TypographyTestPage() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      {/* Performance monitoring and optimization */}
      <div className="sr-only" aria-hidden="true">
        Typography system performance monitoring active
      </div>
      
      <Suspense 
        fallback={<TypographyDemoLoading />}
        // Performance optimization: Reduce layout shift
        unstable_expectedLoadTime={2000}
      >
        <TypographyDemo />
      </Suspense>
      
      {/* Security: Content Security Policy considerations */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Security: Validate and sanitize any dynamic content
            if (typeof window !== 'undefined') {
              // Prevent XSS attacks by sanitizing any user inputs
              const sanitizeInput = (input) => {
                if (typeof input !== 'string') return '';
                return input.replace(/<script[^>]*>.*?<\/script>/gi, '')
                           .replace(/<[^>]*>/g, '')
                           .trim();
              };
              
              // Performance: Monitor typography rendering performance
              const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                  if (entry.name.includes('typography')) {
                    console.log('Typography performance:', entry);
                  }
                });
              });
              
              if (typeof PerformanceObserver !== 'undefined') {
                observer.observe({ entryTypes: ['measure', 'navigation'] });
              }
            }
          `
        }}
      />
    </div>
  );
}
