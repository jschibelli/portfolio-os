// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock environment variables for testing
process.env.NODE_ENV = 'test'
process.env.NEXTAUTH_SECRET = 'test-secret-key-for-testing-only'
process.env.AUTH_SECRET = 'test-auth-secret-key-for-testing-only'
