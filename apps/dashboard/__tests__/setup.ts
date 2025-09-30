import '@testing-library/jest-dom'
import React from 'react'
import { installBrowserMocks, silenceConsoleNoise, NextImageMock } from './test-mocks/browserMocks'

// Mock Next.js router/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock Next.js image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: NextImageMock,
}))

// Install shared browser API mocks
installBrowserMocks()

// Reduce console noise while preserving relevant logs
silenceConsoleNoise()
