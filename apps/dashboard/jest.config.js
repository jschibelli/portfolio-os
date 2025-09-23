const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest.polyfills.js'],
  testMatch: [
    '<rootDir>/__tests__/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/app/**/__tests__/**/*.test.{js,jsx,ts,tsx}',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/ui/(.*)$': '../../packages/ui/$1',
    '^@/db/(.*)$': '../../packages/db/$1',
    '^@/hashnode/(.*)$': '../../packages/hashnode/$1',
    '^@/emails/(.*)$': '../../packages/emails/$1',
    '^@/chatbot/(.*)$': '../../packages/chatbot/$1',
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
