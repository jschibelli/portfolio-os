// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
require('@testing-library/jest-dom');
const { setupTestEnvironment, getTestTimeout, cleanupTestEnvironment } = require('./__tests__/test-utils/test-environment.ts');

/**
 * Jest Test Environment Setup
 * 
 * This file configures the testing environment with secure defaults
 * and proper environment variable management for tests.
 * 
 * Security considerations:
 * - Uses secure test secrets with minimum length requirements
 * - Prevents accidental exposure of production secrets
 * - Implements proper cleanup after tests
 */

// Ensure we're in test environment
process.env.NODE_ENV = 'test';

// Set up test environment with secure defaults
setupTestEnvironment();

// Global test utilities and mocks
global.console = {
  ...console,
  // Suppress console.log in tests unless explicitly enabled
  log: process.env.VERBOSE_TESTS ? console.log : jest.fn(),
  warn: process.env.VERBOSE_TESTS ? console.warn : jest.fn(),
  error: console.error, // Always show errors
  info: process.env.VERBOSE_TESTS ? console.info : jest.fn(),
  debug: process.env.VERBOSE_TESTS ? console.debug : jest.fn(),
};

// Mock fetch for API testing with proper error handling
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    headers: new Headers(),
  })
);

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };
  },
}));

// Mock Next.js navigation (App Router)
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock environment variables for security
const originalEnv = process.env;

beforeEach(() => {
  // Reset environment variables to test defaults
  process.env = { ...originalEnv };
  setupTestEnvironment();
  
  // Clear all mocks
  jest.clearAllMocks();
});

afterEach(() => {
  // Clean up test environment
  cleanupTestEnvironment();
  
  // Reset environment variables
  process.env = originalEnv;
});

// Set global test timeout
jest.setTimeout(getTestTimeout('default'));

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Suppress specific warnings in tests
const originalWarn = console.warn;
console.warn = (...args) => {
  // Suppress known test warnings
  if (
    args[0]?.includes?.('Warning: ReactDOM.render is deprecated') ||
    args[0]?.includes?.('Warning: componentWillReceiveProps') ||
    args[0]?.includes?.('act() is not supported')
  ) {
    return;
  }
  originalWarn(...args);
};
