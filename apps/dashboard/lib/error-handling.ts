/**
 * Error Handling Utilities for Dashboard Application
 * 
 * This module provides comprehensive error handling utilities including
 * error boundaries, retry mechanisms, and user-friendly error messages.
 */

import React from 'react'

export interface ErrorContext {
  component?: string
  action?: string
  userId?: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: any
}

export class DashboardError extends Error {
  public readonly code: string
  public readonly context: ErrorContext
  public readonly isRetryable: boolean

  constructor(
    message: string,
    code: string,
    context: ErrorContext,
    isRetryable: boolean = false
  ) {
    super(message)
    this.name = 'DashboardError'
    this.code = code
    this.context = context
    this.isRetryable = isRetryable
  }
}

/**
 * Error codes for consistent error handling
 */
export const ERROR_CODES = {
  // Authentication errors
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  AUTH_INVALID: 'AUTH_INVALID',
  AUTH_EXPIRED: 'AUTH_EXPIRED',
  AUTH_INSUFFICIENT_PERMISSIONS: 'AUTH_INSUFFICIENT_PERMISSIONS',
  
  // Validation errors
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // Database errors
  DATABASE_CONNECTION_FAILED: 'DATABASE_CONNECTION_FAILED',
  DATABASE_QUERY_FAILED: 'DATABASE_QUERY_FAILED',
  RECORD_NOT_FOUND: 'RECORD_NOT_FOUND',
  DUPLICATE_RECORD: 'DUPLICATE_RECORD',
  
  // API errors
  API_RATE_LIMITED: 'API_RATE_LIMITED',
  API_TIMEOUT: 'API_TIMEOUT',
  API_UNAVAILABLE: 'API_UNAVAILABLE',
  
  // File system errors
  FILE_NOT_FOUND: 'FILE_NOT_FOUND',
  FILE_UPLOAD_FAILED: 'FILE_UPLOAD_FAILED',
  FILE_SIZE_EXCEEDED: 'FILE_SIZE_EXCEEDED',
  
  // System errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  CONFIGURATION_ERROR: 'CONFIGURATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR'
} as const

/**
 * User-friendly error messages
 */
export const ERROR_MESSAGES = {
  [ERROR_CODES.AUTH_REQUIRED]: 'Please log in to access this feature.',
  [ERROR_CODES.AUTH_INVALID]: 'Your session has expired. Please log in again.',
  [ERROR_CODES.AUTH_INSUFFICIENT_PERMISSIONS]: 'You do not have permission to perform this action.',
  [ERROR_CODES.VALIDATION_FAILED]: 'Please check your input and try again.',
  [ERROR_CODES.INVALID_INPUT]: 'The provided information is invalid.',
  [ERROR_CODES.MISSING_REQUIRED_FIELD]: 'Please fill in all required fields.',
  [ERROR_CODES.RECORD_NOT_FOUND]: 'The requested item could not be found.',
  [ERROR_CODES.DUPLICATE_RECORD]: 'This item already exists.',
  [ERROR_CODES.API_RATE_LIMITED]: 'Too many requests. Please try again later.',
  [ERROR_CODES.API_TIMEOUT]: 'The request timed out. Please try again.',
  [ERROR_CODES.API_UNAVAILABLE]: 'The service is temporarily unavailable.',
  [ERROR_CODES.FILE_UPLOAD_FAILED]: 'Failed to upload file. Please try again.',
  [ERROR_CODES.FILE_SIZE_EXCEEDED]: 'File size is too large. Please choose a smaller file.',
  [ERROR_CODES.INTERNAL_ERROR]: 'An unexpected error occurred. Please try again.',
  [ERROR_CODES.NETWORK_ERROR]: 'Network connection failed. Please check your internet connection.'
} as const

/**
 * Retry configuration for different error types
 */
export const RETRY_CONFIG = {
  [ERROR_CODES.API_TIMEOUT]: { maxRetries: 3, delay: 1000, backoff: 2 },
  [ERROR_CODES.API_UNAVAILABLE]: { maxRetries: 5, delay: 2000, backoff: 1.5 },
  [ERROR_CODES.NETWORK_ERROR]: { maxRetries: 3, delay: 1000, backoff: 2 },
  [ERROR_CODES.DATABASE_CONNECTION_FAILED]: { maxRetries: 2, delay: 5000, backoff: 1 }
} as const

/**
 * Creates a user-friendly error message
 */
export function createUserFriendlyError(error: Error | DashboardError): string {
  if (error instanceof DashboardError) {
    return ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES] || ERROR_MESSAGES[ERROR_CODES.INTERNAL_ERROR]
  }
  
  // Handle common error patterns
  if (error.message.includes('fetch')) {
    return ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR]
  }
  
  if (error.message.includes('timeout')) {
    return ERROR_MESSAGES[ERROR_CODES.API_TIMEOUT]
  }
  
  return ERROR_MESSAGES[ERROR_CODES.INTERNAL_ERROR]
}

/**
 * Determines if an error should trigger a retry
 */
export function shouldRetry(error: Error | DashboardError): boolean {
  if (error instanceof DashboardError) {
    return error.isRetryable && RETRY_CONFIG[error.code as keyof typeof RETRY_CONFIG] !== undefined
  }
  
  // Check for retryable error patterns
  const retryablePatterns = [
    'timeout',
    'network',
    'connection',
    'temporary',
    'unavailable'
  ]
  
  return retryablePatterns.some(pattern => 
    error.message.toLowerCase().includes(pattern)
  )
}

/**
 * Gets retry configuration for an error
 */
export function getRetryConfig(error: Error | DashboardError) {
  if (error instanceof DashboardError && RETRY_CONFIG[error.code as keyof typeof RETRY_CONFIG]) {
    return RETRY_CONFIG[error.code as keyof typeof RETRY_CONFIG]
  }
  
  // Default retry configuration
  return { maxRetries: 2, delay: 1000, backoff: 1.5 }
}

/**
 * Executes a function with retry logic
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  error: Error | DashboardError,
  context: ErrorContext
): Promise<T> {
  const config = getRetryConfig(error)
  let lastError: Error = error
  
  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err as Error
      
      if (attempt === config.maxRetries || !shouldRetry(err as Error)) {
        throw lastError
      }
      
      // Wait before retry with exponential backoff
      const delay = config.delay * Math.pow(config.backoff, attempt)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError
}

/**
 * Logs error with context for debugging
 */
export function logError(error: Error | DashboardError, context: ErrorContext) {
  const errorData = {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    ...(error instanceof DashboardError && {
      code: error.code,
      isRetryable: error.isRetryable
    })
  }
  
  // In production, this would send to a logging service
  console.error('Dashboard Error:', errorData)
  
  // TODO: Integrate with logging service (e.g., Sentry, LogRocket)
  // loggingService.captureException(error, context)
}

/**
 * Creates an error boundary component for React
 */
export function createErrorBoundary() {
  return class ErrorBoundary extends React.Component<
    { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> },
    ErrorBoundaryState
  > {
    constructor(props: any) {
      super(props)
      this.state = { hasError: false }
    }
    
    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
      return { hasError: true, error }
    }
    
    componentDidCatch(error: Error, errorInfo: any) {
      logError(error, {
        component: 'ErrorBoundary',
        action: 'componentDidCatch',
        timestamp: new Date(),
        metadata: { errorInfo }
      })
    }
    
    render() {
      if (this.state.hasError && this.state.error) {
        const FallbackComponent = this.props.fallback || DefaultErrorFallback
        return React.createElement(FallbackComponent, { error: this.state.error })
      }
      
      return this.props.children
    }
  }
}

/**
 * Default error fallback component
 */
function DefaultErrorFallback({ error }: { error: Error }) {
  return React.createElement('div', { className: 'error-boundary' },
    React.createElement('h2', null, 'Something went wrong'),
    React.createElement('p', null, createUserFriendlyError(error)),
    React.createElement('button', { onClick: () => window.location.reload() }, 'Reload Page')
  )
}
