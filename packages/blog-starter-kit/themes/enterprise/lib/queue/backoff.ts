// Exponential backoff with jitter utility for retry logic

export interface BackoffOptions {
  baseDelay: number; // Base delay in milliseconds
  maxDelay: number;  // Maximum delay in milliseconds
  maxAttempts: number; // Maximum number of attempts
  jitter: boolean;   // Whether to add jitter
}

const DEFAULT_OPTIONS: BackoffOptions = {
  baseDelay: 1000,    // 1 second
  maxDelay: 30000,    // 30 seconds
  maxAttempts: 5,
  jitter: true,
};

export function calculateBackoffDelay(
  attempt: number, 
  options: Partial<BackoffOptions> = {}
): number {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  if (attempt >= opts.maxAttempts) {
    return opts.maxDelay;
  }
  
  // Exponential backoff: baseDelay * 2^attempt
  let delay = opts.baseDelay * Math.pow(2, attempt);
  
  // Cap at maxDelay
  delay = Math.min(delay, opts.maxDelay);
  
  // Add jitter if enabled (random factor between 0.5 and 1.5)
  if (opts.jitter) {
    const jitterFactor = 0.5 + Math.random();
    delay = delay * jitterFactor;
  }
  
  return Math.floor(delay);
}

export function shouldRetry(
  attempt: number, 
  error: any, 
  options: Partial<BackoffOptions> = {}
): boolean {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // Don't retry if we've exceeded max attempts
  if (attempt >= opts.maxAttempts) {
    return false;
  }
  
  // Don't retry on certain error types
  if (error?.code === 'INVALID_REQUEST' || error?.code === 'AUTHENTICATION_FAILED') {
    return false;
  }
  
  // Retry on network errors, rate limits, and server errors
  return true;
}

export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
