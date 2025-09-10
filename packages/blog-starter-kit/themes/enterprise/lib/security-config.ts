/**
 * Security Configuration
 * 
 * Centralized security configuration for the application.
 * This module provides security settings, rate limiting, and validation utilities.
 */

export interface SecurityConfig {
  rateLimit: {
    cspReport: {
      maxReports: number;
      windowMs: number;
    };
    auth: {
      maxAttempts: number;
      windowMs: number;
    };
    api: {
      maxRequests: number;
      windowMs: number;
    };
  };
  password: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
  session: {
    maxAge: number;
    secure: boolean;
    httpOnly: boolean;
    sameSite: 'strict' | 'lax' | 'none';
  };
}

export const SECURITY_CONFIG: SecurityConfig = {
  rateLimit: {
    cspReport: {
      maxReports: 50,
      windowMs: 5 * 60 * 1000, // 5 minutes
    },
    auth: {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
    },
    api: {
      maxRequests: 100,
      windowMs: 15 * 60 * 1000, // 15 minutes
    },
  },
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
  session: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
  },
};

/**
 * Validate CSP report data
 */
export function validateCSPReport(report: any): boolean {
  if (!report || typeof report !== 'object') {
    return false;
  }

  const requiredFields = ['document-uri', 'violated-directive', 'blocked-uri'];
  return requiredFields.every(field => report[field] !== undefined);
}

/**
 * Rate limiter class for managing request limits
 */
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  private config: { maxAttempts: number; windowMs: number };

  constructor(config: { maxAttempts: number; windowMs: number }) {
    this.config = config;
  }

  checkLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);

    if (!attempt || now > attempt.resetTime) {
      // Reset or create new attempt record
      this.attempts.set(identifier, {
        count: 1,
        resetTime: now + this.config.windowMs,
      });
      return {
        allowed: true,
        remaining: this.config.maxAttempts - 1,
        resetTime: now + this.config.windowMs,
      };
    }

    if (attempt.count >= this.config.maxAttempts) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: attempt.resetTime,
      };
    }

    attempt.count++;
    return {
      allowed: true,
      remaining: this.config.maxAttempts - attempt.count,
      resetTime: attempt.resetTime,
    };
  }

  getRateLimitHeaders(identifier: string): Record<string, string> {
    const result = this.checkLimit(identifier);
    return {
      'X-RateLimit-Limit': this.config.maxAttempts.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString(),
    };
  }

  clearAttempts(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

/**
 * Create a rate limiter instance
 */
export function createRateLimiter(config: { maxAttempts: number; windowMs: number }): RateLimiter {
  return new RateLimiter(config);
}
