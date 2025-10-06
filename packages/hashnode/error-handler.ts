/**
 * Hashnode API Error Handling
 * Provides robust error handling with retry logic
 */

import { HashnodeError, RetryConfig } from './types';

export class HashnodeAPIError extends Error implements HashnodeError {
  statusCode?: number;
  type?: 'RATE_LIMIT' | 'AUTH_ERROR' | 'VALIDATION_ERROR' | 'NETWORK_ERROR' | 'UNKNOWN_ERROR';
  retryAfter?: number;
  details?: any;

  constructor(message: string, options: Partial<HashnodeError> = {}) {
    super(message);
    this.name = 'HashnodeAPIError';
    this.statusCode = options.statusCode;
    this.type = options.type || 'UNKNOWN_ERROR';
    this.retryAfter = options.retryAfter;
    this.details = options.details;
  }
}

export const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
};

/**
 * Calculates exponential backoff delay
 */
export function calculateBackoff(attempt: number, config: RetryConfig): number {
  const delay = config.initialDelayMs * Math.pow(config.backoffMultiplier, attempt);
  return Math.min(delay, config.maxDelayMs);
}

/**
 * Determines if an error is retryable
 */
export function isRetryableError(error: HashnodeError): boolean {
  if (error.type === 'RATE_LIMIT') return true;
  if (error.type === 'NETWORK_ERROR') return true;
  if (error.statusCode && error.statusCode >= 500) return true;
  return false;
}

/**
 * Parses GraphQL errors from Hashnode API response
 */
export function parseHashnodeError(error: any): HashnodeError {
  // Network errors
  if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
    return new HashnodeAPIError('Network connection failed', {
      type: 'NETWORK_ERROR',
      details: error,
    });
  }

  // GraphQL errors
  if (error.response?.errors) {
    const firstError = error.response.errors[0];
    const message = firstError.message || 'Unknown GraphQL error';
    
    // Check for rate limiting
    if (message.toLowerCase().includes('rate limit')) {
      return new HashnodeAPIError('Rate limit exceeded', {
        type: 'RATE_LIMIT',
        retryAfter: 60, // Default to 60 seconds
        details: firstError,
      });
    }

    // Check for authentication errors
    if (message.toLowerCase().includes('unauthorized') || message.toLowerCase().includes('authentication')) {
      return new HashnodeAPIError('Authentication failed', {
        type: 'AUTH_ERROR',
        statusCode: 401,
        details: firstError,
      });
    }

    // Validation errors
    if (firstError.extensions?.code === 'BAD_USER_INPUT') {
      return new HashnodeAPIError('Validation failed', {
        type: 'VALIDATION_ERROR',
        statusCode: 400,
        details: firstError,
      });
    }

    return new HashnodeAPIError(message, {
      type: 'UNKNOWN_ERROR',
      details: firstError,
    });
  }

  // HTTP errors
  if (error.response?.status) {
    const status = error.response.status;
    
    if (status === 401 || status === 403) {
      return new HashnodeAPIError('Authentication failed', {
        type: 'AUTH_ERROR',
        statusCode: status,
        details: error.response,
      });
    }

    if (status === 429) {
      const retryAfter = error.response.headers?.['retry-after'];
      return new HashnodeAPIError('Rate limit exceeded', {
        type: 'RATE_LIMIT',
        statusCode: status,
        retryAfter: retryAfter ? parseInt(retryAfter) : 60,
        details: error.response,
      });
    }

    if (status >= 500) {
      return new HashnodeAPIError('Server error', {
        type: 'NETWORK_ERROR',
        statusCode: status,
        details: error.response,
      });
    }
  }

  // Default error
  return new HashnodeAPIError(error.message || 'Unknown error occurred', {
    type: 'UNKNOWN_ERROR',
    details: error,
  });
}

/**
 * Retry wrapper with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = defaultRetryConfig
): Promise<T> {
  let lastError: HashnodeError;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = parseHashnodeError(error);

      // Don't retry if error is not retryable
      if (!isRetryableError(lastError)) {
        throw lastError;
      }

      // Don't retry if we've exhausted retries
      if (attempt === config.maxRetries) {
        throw lastError;
      }

      // Calculate and wait for backoff delay
      const delay = lastError.retryAfter 
        ? lastError.retryAfter * 1000 
        : calculateBackoff(attempt, config);

      console.warn(
        `Hashnode API request failed (attempt ${attempt + 1}/${config.maxRetries + 1}). ` +
        `Retrying in ${delay}ms. Error: ${lastError.message}`
      );

      await sleep(delay);
    }
  }

  throw lastError!;
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Validates Hashnode API token format
 */
export function validateApiToken(token: string): boolean {
  if (!token || typeof token !== 'string') {
    return false;
  }
  // Hashnode tokens are typically 64 character hex strings
  return token.length >= 32 && /^[a-f0-9]+$/i.test(token);
}

/**
 * Logs error with context
 */
export function logError(error: HashnodeError, context?: Record<string, any>): void {
  console.error('[Hashnode API Error]', {
    message: error.message,
    type: error.type,
    statusCode: error.statusCode,
    retryAfter: error.retryAfter,
    context,
    details: error.details,
  });
}

