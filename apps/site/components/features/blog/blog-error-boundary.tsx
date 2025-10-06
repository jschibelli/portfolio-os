"use client";

import React from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface BlogErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface BlogErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

/**
 * Error boundary specifically for blog-related errors
 * Provides user-friendly error messages and recovery options
 */
export class BlogErrorBoundary extends React.Component<
  BlogErrorBoundaryProps,
  BlogErrorBoundaryState
> {
  constructor(props: BlogErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): BlogErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Blog Error Boundary caught an error:", error, errorInfo);
    
    // In production, you could send this to a logging service
    // Example: logError(error, { context: 'BlogErrorBoundary', errorInfo });
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || BlogErrorFallback;
      return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

/**
 * Default error fallback component for blog errors
 * Shows a user-friendly error message with recovery options
 */
function BlogErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  const isNetworkError = error.message.includes("fetch") || error.message.includes("network");
  const isNotFoundError = error.message.includes("404") || error.message.includes("not found");

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white dark:bg-stone-800 rounded-lg shadow-lg p-8 border border-stone-200 dark:border-stone-700">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">
              {isNotFoundError
                ? "Content Not Found"
                : isNetworkError
                ? "Connection Error"
                : "Something went wrong"}
            </h2>
            <p className="text-stone-600 dark:text-stone-400 mb-6">
              {isNotFoundError
                ? "The blog post you're looking for doesn't exist or has been removed."
                : isNetworkError
                ? "We're having trouble connecting to our blog service. Please check your internet connection and try again."
                : "We encountered an error while loading the blog content. This issue has been logged and we'll look into it."}
            </p>
            
            {/* Error details - only show in development */}
            {process.env.NODE_ENV === "development" && (
              <details className="mb-6 p-4 bg-stone-100 dark:bg-stone-700 rounded text-sm">
                <summary className="cursor-pointer font-semibold mb-2 text-stone-700 dark:text-stone-300">
                  Error Details (Development Only)
                </summary>
                <code className="text-red-600 dark:text-red-400 break-all">
                  {error.message}
                </code>
              </details>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                onClick={resetError}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-stone-200 hover:bg-stone-300 dark:bg-stone-700 dark:hover:bg-stone-600 text-stone-900 dark:text-stone-100 font-semibold rounded-lg transition-colors"
              >
                <Home className="h-4 w-4" />
                Back to Blog
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-stone-300 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold rounded-lg transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Higher-order component to wrap blog pages with error boundary
 */
export function withBlogErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
) {
  return function BlogErrorBoundaryWrapper(props: P) {
    return (
      <BlogErrorBoundary fallback={fallback}>
        <Component {...props} />
      </BlogErrorBoundary>
    );
  };
}
