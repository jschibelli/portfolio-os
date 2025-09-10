// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock environment variables for testing
// These are test-only values and should never be used in production
process.env.NODE_ENV = 'test'

// Use environment variables for test secrets if available, otherwise use test defaults
// This prevents hardcoding sensitive values in the repository
process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || 'test-secret-key-for-testing-only'
process.env.AUTH_SECRET = process.env.AUTH_SECRET || 'test-auth-secret-key-for-testing-only'

// Additional test environment setup
process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:./test.db'
