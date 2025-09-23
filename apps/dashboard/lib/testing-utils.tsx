/**
 * Testing Utilities for Dashboard Application
 * 
 * This module provides comprehensive testing utilities for unit tests,
 * integration tests, and end-to-end testing scenarios.
 */

import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import { vi, Mock } from 'vitest'

// Mock data generators
export const mockUser = {
  id: 'user-123',
  name: 'Test User',
  email: 'test@example.com',
  role: 'admin' as const,
  isAuthenticated: true
}

export const mockArticle = {
  id: 'article-123',
  title: 'Test Article',
  slug: 'test-article',
  content: 'Test content',
  status: 'published' as const,
  authorId: 'user-123',
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01')
}

export const mockTag = {
  id: 'tag-123',
  name: 'Test Tag',
  slug: 'test-tag'
}

// API response mocks
export const mockApiResponse = <T extends unknown>(data: T, status: number = 200) => ({
  data,
  status,
  statusText: status === 200 ? 'OK' : 'Error',
  headers: {},
  config: {}
})

// Database mock utilities
export const createMockPrisma = () => ({
  user: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  },
  article: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn()
  },
  tag: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
})

// Authentication mock utilities
export const createMockAuth = () => ({
  getCurrentUser: vi.fn(),
  hasPermission: vi.fn(),
  canEditArticle: vi.fn(),
  authenticateUser: vi.fn(),
  logoutUser: vi.fn()
})

// Validation mock utilities
export const createMockValidation = () => ({
  validateArticleId: vi.fn(),
  sanitizeInput: vi.fn(),
  validateArticleTitle: vi.fn(),
  validateArticleSlug: vi.fn(),
  validateTagName: vi.fn(),
  validateEmail: vi.fn(),
  validateUserRole: vi.fn(),
  validateArticleData: vi.fn()
})

// Test wrapper with providers
export const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div data-testid="test-wrapper">
      {children}
    </div>
  )
}

// Custom render function with providers
export const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: TestWrapper, ...options })

// Mock fetch for API testing
export const mockFetch = (response: any, status: number = 200) => {
  const mockResponse = {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: () => Promise.resolve(response),
    text: () => Promise.resolve(JSON.stringify(response))
  }
  
  return vi.fn().mockResolvedValue(mockResponse)
}

// Error testing utilities
export const createMockError = (message: string, code?: string) => {
  const error = new Error(message)
  if (code) {
    ;(error as any).code = code
  }
  return error
}

// Performance testing utilities
export const measurePerformance = async <T>(
  fn: () => Promise<T>,
  label: string
): Promise<{ result: T; duration: number }> => {
  const start = performance.now()
  const result = await fn()
  const duration = performance.now() - start
  
  console.log(`${label} took ${duration.toFixed(2)}ms`)
  return { result, duration }
}

// Accessibility testing utilities
export const getAccessibleElements = (container: HTMLElement) => {
  return {
    buttons: container.querySelectorAll('button'),
    links: container.querySelectorAll('a'),
    inputs: container.querySelectorAll('input, textarea, select'),
    headings: container.querySelectorAll('h1, h2, h3, h4, h5, h6'),
    landmarks: container.querySelectorAll('[role="main"], [role="navigation"], [role="banner"]')
  }
}

// Security testing utilities
export const testXSSProtection = (input: string) => {
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i
  ]
  
  return dangerousPatterns.some(pattern => pattern.test(input))
}

export const testSQLInjection = (input: string) => {
  const dangerousPatterns = [
    /union\s+select/i,
    /drop\s+table/i,
    /delete\s+from/i,
    /insert\s+into/i,
    /update\s+set/i,
    /--/,
    /\/\*/,
    /\*\//
  ]
  
  return dangerousPatterns.some(pattern => pattern.test(input))
}

// Database testing utilities
export const createTestDatabase = () => {
  const data: Record<string, any[]> = {
    users: [],
    articles: [],
    tags: []
  }
  
  return {
    findUnique: vi.fn(({ where }) => {
      const table = Object.keys(where)[0]
      return data[table]?.find(item => 
        Object.entries(where).every(([key, value]) => item[key] === value)
      )
    }),
    findMany: vi.fn(({ where }) => {
      const table = Object.keys(where)[0]
      return data[table]?.filter(item => 
        Object.entries(where).every(([key, value]) => item[key] === value)
      ) || []
    }),
    create: vi.fn(({ data: newData }) => {
      const table = 'users' // This would be determined by the model
      const newItem = { id: `test-${Date.now()}`, ...newData }
      data[table].push(newItem)
      return newItem
    }),
    update: vi.fn(({ where, data: updateData }) => {
      const table = 'users'
      const index = data[table].findIndex(item => 
        Object.entries(where).every(([key, value]) => item[key] === value)
      )
      if (index !== -1) {
        data[table][index] = { ...data[table][index], ...updateData }
        return data[table][index]
      }
      return null
    }),
    delete: vi.fn(({ where }) => {
      const table = 'users'
      const index = data[table].findIndex(item => 
        Object.entries(where).every(([key, value]) => item[key] === value)
      )
      if (index !== -1) {
        return data[table].splice(index, 1)[0]
      }
      return null
    })
  }
}

// Integration testing utilities
export const createTestServer = () => {
  const handlers: Array<{
    method: string
    path: string
    handler: (req: any, res: any) => void
  }> = []
  
  return {
    get: (path: string, handler: (req: any, res: any) => void) => {
      handlers.push({ method: 'GET', path, handler })
    },
    post: (path: string, handler: (req: any, res: any) => void) => {
      handlers.push({ method: 'POST', path, handler })
    },
    put: (path: string, handler: (req: any, res: any) => void) => {
      handlers.push({ method: 'PUT', path, handler })
    },
    delete: (path: string, handler: (req: any, res: any) => void) => {
      handlers.push({ method: 'DELETE', path, handler })
    },
    handleRequest: (method: string, path: string, req: any, res: any) => {
      const handler = handlers.find(h => h.method === method && h.path === path)
      if (handler) {
        handler.handler(req, res)
      } else {
        res.status(404).json({ error: 'Not found' })
      }
    }
  }
}

// Test data factories
export const createTestUser = (overrides: Partial<typeof mockUser> = {}) => ({
  ...mockUser,
  ...overrides
})

export const createTestArticle = (overrides: Partial<typeof mockArticle> = {}) => ({
  ...mockArticle,
  ...overrides
})

export const createTestTag = (overrides: Partial<typeof mockTag> = {}) => ({
  ...mockTag,
  ...overrides
})

// Cleanup utilities
export const cleanupMocks = () => {
  vi.clearAllMocks()
  vi.resetAllMocks()
}

export const cleanupDatabase = (db: any) => {
  Object.keys(db).forEach(key => {
    if (Array.isArray(db[key])) {
      db[key] = []
    }
  })
}

// Test environment setup
export const setupTestEnvironment = () => {
  // Mock environment variables
  process.env.NODE_ENV = 'test'
  process.env.DATABASE_URL = 'file:./test.db'
  process.env.NEXTAUTH_SECRET = 'test-secret'
  process.env.NEXTAUTH_URL = 'http://localhost:3000'
  
  // Mock console methods to reduce noise in tests
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
}

export const teardownTestEnvironment = () => {
  vi.restoreAllMocks()
}
