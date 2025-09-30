import React from 'react'

export function installBrowserMocks() {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })

  Object.defineProperty(window, 'getComputedStyle', {
    value: () => ({ getPropertyValue: () => '' }),
  })

  // @ts-ignore
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }))

  // @ts-ignore
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    root: null,
    rootMargin: '0px',
    thresholds: [],
    takeRecords: jest.fn(),
  }))
}

export function silenceConsoleNoise() {
  const originalWarn = console.warn
  const originalError = console.error

  beforeAll(() => {
    console.warn = (...args: any[]) => {
      if (typeof args[0] === 'string' && args[0].includes('Warning: ReactDOM.render is no longer supported')) {
        return
      }
      originalWarn.call(console, ...args)
    }

    console.error = (...args: any[]) => {
      if (
        typeof args[0] === 'string' &&
        (args[0].includes('Warning: ReactDOM.render is no longer supported') || args[0].includes('act()'))
      ) {
        return
      }
      originalError.call(console, ...args)
    }
  })

  afterAll(() => {
    console.warn = originalWarn
    console.error = originalError
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const NextImageMock = (props: any) => React.createElement('img', props)


