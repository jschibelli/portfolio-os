// Fetch wrapper with retry logic, rate limiting, and structured error handling

import { calculateBackoffDelay, shouldRetry, sleep } from '../queue/backoff';

export interface FetchJsonOptions extends RequestInit {
  retry?: number;
  baseDelay?: number;
  maxDelay?: number;
  maxAttempts?: number;
}

export interface ApiError {
  status: number;
  statusText: string;
  message: string;
  code?: string;
  details?: any;
}

export class FetchError extends Error {
  public status: number;
  public statusText: string;
  public code?: string;
  public details?: any;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'FetchError';
    this.status = error.status;
    this.statusText = error.statusText;
    this.code = error.code;
    this.details = error.details;
  }
}

export async function fetchJson<T = any>(
  url: string, 
  init?: FetchJsonOptions
): Promise<T> {
  const options = {
    retry: 0,
    baseDelay: 1000,
    maxDelay: 30000,
    maxAttempts: 3,
    ...init,
  };

  let lastError: any;
  
  for (let attempt = 0; attempt <= options.maxAttempts; attempt++) {
    try {
      const response = await fetch(url, {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...init?.headers,
        },
      });

      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        if (retryAfter) {
          const delay = parseInt(retryAfter) * 1000;
          await sleep(delay);
          continue;
        }
      }

      // Handle successful responses
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await response.json();
        } else {
          return await response.text() as T;
        }
      }

      // Handle error responses
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch {
        // If we can't parse JSON, use text
        errorData = { message: await response.text() };
      }

      const apiError: ApiError = {
        status: response.status,
        statusText: response.statusText,
        message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        code: errorData.code,
        details: errorData,
      };

      lastError = new FetchError(apiError);

      // Don't retry on client errors (4xx) except rate limiting
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        break;
      }

    } catch (error: any) {
      lastError = error;
      
      // Don't retry on network errors if we've exceeded attempts
      if (attempt >= options.maxAttempts) {
        break;
      }
    }

    // Check if we should retry
    if (attempt < options.maxAttempts && shouldRetry(attempt, lastError, options)) {
      const delay = calculateBackoffDelay(attempt, options);
      await sleep(delay);
      continue;
    }

    break;
  }

  throw lastError;
}

// Convenience methods for common HTTP methods
export const fetchGet = <T = any>(url: string, init?: FetchJsonOptions) => 
  fetchJson<T>(url, { ...init, method: 'GET' });

export const fetchPost = <T = any>(url: string, data?: any, init?: FetchJsonOptions) => 
  fetchJson<T>(url, { 
    ...init, 
    method: 'POST', 
    body: data ? JSON.stringify(data) : undefined 
  });

export const fetchPut = <T = any>(url: string, data?: any, init?: FetchJsonOptions) => 
  fetchJson<T>(url, { 
    ...init, 
    method: 'PUT', 
    body: data ? JSON.stringify(data) : undefined 
  });

export const fetchDelete = <T = any>(url: string, init?: FetchJsonOptions) => 
  fetchJson<T>(url, { ...init, method: 'DELETE' });
