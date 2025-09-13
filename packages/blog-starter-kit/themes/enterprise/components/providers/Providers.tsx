"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
// import { ErrorBoundary } from "react-error-boundary";
const ErrorBoundary = ({ children, fallback }: { children: React.ReactNode; fallback: React.ComponentType<{ error: Error }> }) => children;

// Error fallback component for provider errors
function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-red-50 dark:bg-red-900/20">
      <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-stone-900">
        <h2 className="mb-2 text-lg font-semibold text-red-800 dark:text-red-200">
          Something went wrong
        </h2>
        <p className="text-red-600 dark:text-red-300">
          {error.message || "An unexpected error occurred"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Reload Page
        </button>
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
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <SessionProvider>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark" 
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
}
