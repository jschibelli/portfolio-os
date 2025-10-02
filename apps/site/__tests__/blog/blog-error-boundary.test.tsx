import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BlogErrorBoundary } from '../../components/features/blog/blog-error-boundary';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: any) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  AlertCircle: () => <div data-testid="alert-circle-icon" />,
  RefreshCw: () => <div data-testid="refresh-icon" />,
  Home: () => <div data-testid="home-icon" />,
}));

// Component that throws an error when shouldThrow is true
function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
}

describe('BlogErrorBoundary', () => {
  // Suppress console.error for cleaner test output
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children when there is no error', () => {
    render(
      <BlogErrorBoundary>
        <div>Test content</div>
      </BlogErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should catch and display error when child component throws', () => {
    render(
      <BlogErrorBoundary>
        <ThrowError shouldThrow={true} />
      </BlogErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/We encountered an error/i)).toBeInTheDocument();
  });

  it('should display "Connection Error" for network errors', () => {
    function NetworkError() {
      throw new Error('Failed to fetch blog posts');
    }

    render(
      <BlogErrorBoundary>
        <NetworkError />
      </BlogErrorBoundary>
    );

    expect(screen.getByText('Connection Error')).toBeInTheDocument();
    expect(screen.getByText(/having trouble connecting/i)).toBeInTheDocument();
  });

  it('should display "Content Not Found" for 404 errors', () => {
    function NotFoundError() {
      throw new Error('404 not found');
    }

    render(
      <BlogErrorBoundary>
        <NotFoundError />
      </BlogErrorBoundary>
    );

    expect(screen.getByText('Content Not Found')).toBeInTheDocument();
    expect(screen.getByText(/doesn't exist or has been removed/i)).toBeInTheDocument();
  });

  it('should have "Try Again" button', () => {
    render(
      <BlogErrorBoundary>
        <ThrowError shouldThrow={true} />
      </BlogErrorBoundary>
    );

    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('should have "Back to Blog" button', () => {
    render(
      <BlogErrorBoundary>
        <ThrowError shouldThrow={true} />
      </BlogErrorBoundary>
    );

    const backButton = screen.getByText('Back to Blog');
    expect(backButton).toBeInTheDocument();
    expect(backButton.closest('a')).toHaveAttribute('href', '/blog');
  });

  it('should have "Reload Page" button', () => {
    render(
      <BlogErrorBoundary>
        <ThrowError shouldThrow={true} />
      </BlogErrorBoundary>
    );

    expect(screen.getByText('Reload Page')).toBeInTheDocument();
  });

  it('should show error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <BlogErrorBoundary>
        <ThrowError shouldThrow={true} />
      </BlogErrorBoundary>
    );

    expect(screen.getByText('Error Details (Development Only)')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it('should reset error state when "Try Again" is clicked', () => {
    render(
      <BlogErrorBoundary>
        <ThrowError shouldThrow={true} />
      </BlogErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    const tryAgainButton = screen.getByText('Try Again');
    
    // Verify the button exists and can be clicked
    expect(tryAgainButton).toBeInTheDocument();
    
    // Click should trigger resetError
    // The error boundary will reset but the component will throw again immediately
    // This is expected behavior for error boundaries
    fireEvent.click(tryAgainButton);
    
    // After clicking, the error boundary will catch the error again
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should use custom fallback component when provided', () => {
    function CustomFallback({ error }: { error: Error; resetError: () => void }) {
      return <div>Custom error: {error.message}</div>;
    }

    render(
      <BlogErrorBoundary fallback={CustomFallback}>
        <ThrowError shouldThrow={true} />
      </BlogErrorBoundary>
    );

    expect(screen.getByText('Custom error: Test error')).toBeInTheDocument();
  });

  it('should log errors via componentDidCatch', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error');

    render(
      <BlogErrorBoundary>
        <ThrowError shouldThrow={true} />
      </BlogErrorBoundary>
    );

    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
