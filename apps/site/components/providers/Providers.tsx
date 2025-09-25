"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import React from "react";

// Custom Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

// Default error fallback component for provider errors
function DefaultErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="rounded-lg bg-card p-6 shadow-lg">
        <h2 className="mb-2 text-lg font-semibold text-foreground">
          Something went wrong
        </h2>
        <p className="text-muted-foreground">
          {error.message || "An unexpected error occurred"}
        </p>
        <div className="mt-4 flex gap-2">
          <button
            onClick={resetError}
            className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-destructive px-4 py-2 text-destructive-foreground hover:bg-destructive/90"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
}

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Root providers component that wraps the application with necessary context providers
 * - SessionProvider: Handles authentication state
 * - ThemeProvider: Manages theme switching (light/dark mode)
 * - ErrorBoundary: Catches and handles provider-related errors
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <SessionProvider>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          {children}
        </ThemeProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
}
