const nextJest = require('next/jest')
const { resolve } = require('path')

// Create Jest configuration with Next.js integration
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: resolve(process.cwd(), './'),
})

// Custom Jest configuration for React component testing
const customJestConfig = {
  // Setup files to run before each test file
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Use jsdom environment for React component testing (supports DOM APIs)
  testEnvironment: 'jsdom',
  
  // Patterns to ignore when looking for test files
  testPathIgnorePatterns: [
    '<rootDir>/.next/',           // Next.js build output
    '<rootDir>/node_modules/',    // Dependencies
    '<rootDir>/tests/.*\\.spec\\.ts$', // Exclude Playwright E2E tests
    '<rootDir>/tests/.*\\.spec\\.js$', // Exclude Playwright E2E tests
    '<rootDir>/playwright-report/',    // Playwright reports
    '<rootDir>/test-results/',         // Test results directory
  ],
  
  // Module name mapping for path aliases (supports @ imports)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@components/(.*)$': '<rootDir>/components/$1',
    '^@lib/(.*)$': '<rootDir>/lib/$1',
    '^@app/(.*)$': '<rootDir>/app/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
    '^@data/(.*)$': '<rootDir>/data/$1',
    '^@types/(.*)$': '<rootDir>/types/$1',
    '^@utils/(.*)$': '<rootDir>/utils/$1',
    // Handle CSS modules
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  
  // Files to include in coverage collection
  collectCoverageFrom: [
    'lib/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',                 // Exclude TypeScript declaration files
    '!**/node_modules/**',        // Exclude dependencies
    '!**/generated/**',           // Exclude generated files
    '!**/coverage/**',            // Exclude coverage reports
    '!**/__tests__/**',           // Exclude test files themselves
    '!**/tests/**',               // Exclude test directories
    '!**/*.config.js',            // Exclude configuration files
    '!**/*.config.ts',            // Exclude TypeScript config files
    '!**/jest.setup.js',          // Exclude Jest setup file
    '!**/next.config.js',         // Exclude Next.js config
    '!**/tailwind.config.js',     // Exclude Tailwind config
    '!**/postcss.config.js',      // Exclude PostCSS config
  ],
  
  // Patterns to match test files (more comprehensive than before)
  testMatch: [
    '<rootDir>/__tests__/**/*.{js,jsx,ts,tsx}',           // Standard __tests__ directory
    '<rootDir>/**/__tests__/**/*.{js,jsx,ts,tsx}',        // Nested __tests__ directories
    '<rootDir>/components/**/*.test.{js,jsx,ts,tsx}',     // Component tests
    '<rootDir>/lib/**/*.test.{js,jsx,ts,tsx}',            // Library tests
    '<rootDir>/app/**/*.test.{js,jsx,ts,tsx}',            // App tests
    '<rootDir>/tests/**/*.test.{js,jsx,ts,tsx}',          // General test files
  ],
  
  // Transform configuration for better TypeScript support
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { 
      presets: [
        ['next/babel', { 'preset-env': { targets: { node: 'current' } } }]
      ]
    }],
  },
  
  // Patterns to ignore when transforming files
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  
  // Module file extensions in order of preference
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // Enhanced error handling and configuration
  errorOnDeprecated: true,
  verbose: true,
  
  // Coverage configuration with realistic thresholds
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
    // Specific thresholds for critical areas
    './lib/': {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
    './app/api/': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  
  // Performance optimizations
  maxWorkers: '50%',
  cache: true,
  
  // Clear mocks between tests for better isolation
  clearMocks: true,
  restoreMocks: true,
  
  // Test timeout (10 seconds)
  testTimeout: 10000,
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
