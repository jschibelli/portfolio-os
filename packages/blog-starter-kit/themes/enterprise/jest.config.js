import nextJest from 'next/jest';
import { resolve } from 'path';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: resolve(process.cwd(), './'),
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom', // Changed from 'node' to 'jsdom' for React component testing
  testPathIgnorePatterns: [
    '<rootDir>/.next/', 
    '<rootDir>/node_modules/',
    '<rootDir>/tests/.*\\.spec\\.ts$', // Exclude Playwright tests
    '<rootDir>/tests/.*\\.spec\\.js$', // Exclude Playwright tests
    '<rootDir>/playwright-report/',
    '<rootDir>/test-results/',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@components/(.*)$': '<rootDir>/components/$1',
    '^@lib/(.*)$': '<rootDir>/lib/$1',
    '^@app/(.*)$': '<rootDir>/app/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
    '^@data/(.*)$': '<rootDir>/data/$1',
    '^@types/(.*)$': '<rootDir>/types/$1',
    '^@utils/(.*)$': '<rootDir>/utils/$1',
  },
  collectCoverageFrom: [
    'lib/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/generated/**',
    '!**/coverage/**',
    '!**/__tests__/**',
    '!**/tests/**',
    '!**/*.config.js',
    '!**/*.config.ts',
    '!**/jest.setup.js',
    '!**/next.config.js',
    '!**/tailwind.config.js',
    '!**/postcss.config.js',
  ],
  testMatch: [
    '<rootDir>/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/tests/**/*.test.{js,jsx,ts,tsx}', // Only Jest test files
  ],
  // Enhanced error handling and configuration
  errorOnDeprecated: true,
  verbose: true,
  // Coverage configuration with more realistic thresholds
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
  // Transform configuration for better TypeScript support
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {
      presets: [
        ['next/babel', { 'preset-env': { targets: { node: 'current' } } }]
      ]
    }],
  },
  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  // Test timeout
  testTimeout: 10000,
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig);
