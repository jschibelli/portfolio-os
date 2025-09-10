// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
require('@testing-library/jest-dom');
const { setupTestEnvironment, getTestTimeout } = require('./__tests__/test-utils/test-environment');

/**
 * Jest Test Environment Setup
 * 
 * This file configures the testing environment with secure defaults
 * and proper environment variable management for tests.
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
};

// Mock fetch for API testing
global.fetch = jest.fn();

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  // Reset any global state if needed
});

// Set global test timeout
jest.setTimeout(getTestTimeout('default'));
