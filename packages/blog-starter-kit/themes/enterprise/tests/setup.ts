/**
 * Jest Test Setup
 * 
 * This file sets up the testing environment for all tests.
 */

// Mock window.gtag globally
Object.defineProperty(window, 'gtag', {
  value: jest.fn(),
  writable: true,
});

// Mock window.dispatchEvent globally
Object.defineProperty(window, 'dispatchEvent', {
  value: jest.fn(),
  writable: true,
});

// Mock performance.now for timing tests
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
  },
  writable: true,
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
});

// Mock navigator.sendBeacon
Object.defineProperty(navigator, 'sendBeacon', {
  value: jest.fn(() => true),
  writable: true,
});

// Mock fetch globally
global.fetch = jest.fn();

// Mock console methods to avoid noise in tests
const originalConsole = { ...console };
beforeEach(() => {
  // Reset all mocks before each test
  jest.clearAllMocks();
  
  // Reset localStorage and sessionStorage
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
  
  sessionStorageMock.getItem.mockClear();
  sessionStorageMock.setItem.mockClear();
  sessionStorageMock.removeItem.mockClear();
  sessionStorageMock.clear.mockClear();
  
  // Reset fetch mock
  (global.fetch as jest.Mock).mockClear();
  
  // Reset gtag mock
  (window.gtag as jest.Mock).mockClear();
  
  // Reset dispatchEvent mock
  (window.dispatchEvent as jest.Mock).mockClear();
  
  // Reset performance.now mock
  (window.performance.now as jest.Mock).mockClear();
  
  // Reset navigator.sendBeacon mock
  (navigator.sendBeacon as jest.Mock).mockClear();
});

afterAll(() => {
  // Restore original console
  Object.assign(console, originalConsole);
});

// Suppress console warnings in tests unless explicitly testing them
const originalWarn = console.warn;
const originalError = console.error;

beforeAll(() => {
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});
