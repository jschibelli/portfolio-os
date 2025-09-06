/**
 * Chat Security and Performance Monitoring
 * 
 * This module provides security measures, content security policies,
 * and performance monitoring for the chat API endpoint.
 * 
 * Addresses code review feedback from PR #37 about implementing
 * content security policies and performance monitoring.
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { CHAT_CONFIG } from './chat-config';

// Security headers configuration
export const SECURITY_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://api.openai.com https://api.github.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),
  
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
};

// Rate limiting store (in production, use Redis or similar)
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Performance metrics
interface PerformanceMetrics {
  endpoint: string;
  method: string;
  duration: number;
  timestamp: string;
  statusCode: number;
  userAgent?: string;
  ipAddress?: string;
}

const performanceMetrics: PerformanceMetrics[] = [];

/**
 * Applies security headers to the response
 */
export function applySecurityHeaders(res: NextApiResponse): void {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
}

/**
 * Validates request origin
 */
export function validateRequestOrigin(req: NextApiRequest): boolean {
  const origin = req.headers.origin || req.headers.referer;
  
  if (!origin) {
    return false;
  }
  
  try {
    const url = new URL(origin);
    const originHost = url.origin;
    
    return CHAT_CONFIG.SECURITY.ALLOWED_ORIGINS.includes(originHost);
  } catch {
    return false;
  }
}

/**
 * Rate limiting middleware
 */
export function checkRateLimit(req: NextApiRequest): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
} {
  const ip = getClientIP(req);
  const now = Date.now();
  const windowMs = CHAT_CONFIG.SECURITY.RATE_LIMIT.WINDOW_MS;
  const maxRequests = CHAT_CONFIG.SECURITY.RATE_LIMIT.MAX_REQUESTS;
  
  const entry = rateLimitStore.get(ip);
  
  if (!entry || now > entry.resetTime) {
    // New window or expired entry
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + windowMs
    });
    
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs
    };
  }
  
  if (entry.count >= maxRequests) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter: Math.ceil((entry.resetTime - now) / 1000)
    };
  }
  
  // Increment count
  entry.count++;
  rateLimitStore.set(ip, entry);
  
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetTime: entry.resetTime
  };
}

/**
 * Gets client IP address
 */
function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const realIP = req.headers['x-real-ip'];
  const remoteAddress = req.connection?.remoteAddress || req.socket?.remoteAddress;
  
  if (forwarded) {
    return Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return Array.isArray(realIP) ? realIP[0] : realIP;
  }
  
  return remoteAddress || 'unknown';
}

/**
 * Sanitizes user input to prevent XSS and injection attacks
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/script/gi, '') // Remove script tags
    .trim()
    .substring(0, 1000); // Limit length
}

/**
 * Validates request body structure
 */
export function validateRequestBody(body: any): {
  isValid: boolean;
  errors: string[];
  sanitizedBody?: any;
} {
  const errors: string[] = [];
  
  if (!body || typeof body !== 'object') {
    errors.push('Request body must be a valid object');
    return { isValid: false, errors };
  }
  
  const sanitizedBody: any = {};
  
  // Validate message
  if (body.message) {
    if (typeof body.message !== 'string') {
      errors.push('Message must be a string');
    } else if (body.message.length === 0) {
      errors.push('Message cannot be empty');
    } else if (body.message.length > 1000) {
      errors.push('Message too long (max 1000 characters)');
    } else {
      sanitizedBody.message = sanitizeInput(body.message);
    }
  } else {
    errors.push('Message is required');
  }
  
  // Validate conversation history
  if (body.conversationHistory) {
    if (!Array.isArray(body.conversationHistory)) {
      errors.push('Conversation history must be an array');
    } else if (body.conversationHistory.length > CHAT_CONFIG.SYSTEM.MAX_CONVERSATION_HISTORY) {
      errors.push(`Conversation history too long (max ${CHAT_CONFIG.SYSTEM.MAX_CONVERSATION_HISTORY} entries)`);
    } else {
      sanitizedBody.conversationHistory = body.conversationHistory.map((entry: any) => ({
        role: sanitizeInput(entry.role || ''),
        content: sanitizeInput(entry.content || '')
      }));
    }
  }
  
  // Validate page context
  if (body.pageContext) {
    if (typeof body.pageContext !== 'object') {
      errors.push('Page context must be an object');
    } else {
      sanitizedBody.pageContext = {
        type: sanitizeInput(body.pageContext.type || ''),
        content: sanitizeInput(body.pageContext.content || '')
      };
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedBody: errors.length === 0 ? sanitizedBody : undefined
  };
}

/**
 * Records performance metrics
 */
export function recordPerformanceMetrics(
  endpoint: string,
  method: string,
  duration: number,
  statusCode: number,
  req: NextApiRequest
): void {
  const metrics: PerformanceMetrics = {
    endpoint,
    method,
    duration,
    timestamp: new Date().toISOString(),
    statusCode,
    userAgent: req.headers['user-agent'],
    ipAddress: getClientIP(req)
  };
  
  performanceMetrics.push(metrics);
  
  // Keep only last 1000 entries
  if (performanceMetrics.length > 1000) {
    performanceMetrics.splice(0, performanceMetrics.length - 1000);
  }
  
  // Log slow requests
  if (duration > 5000) { // 5 seconds
    console.warn(`Slow request detected: ${endpoint} took ${duration}ms`);
  }
}

/**
 * Gets performance metrics
 */
export function getPerformanceMetrics(filter?: {
  endpoint?: string;
  since?: Date;
  limit?: number;
}): PerformanceMetrics[] {
  let filtered = [...performanceMetrics];
  
  if (filter?.endpoint) {
    filtered = filtered.filter(m => m.endpoint === filter.endpoint);
  }
  
  if (filter?.since) {
    filtered = filtered.filter(m => new Date(m.timestamp) >= filter.since!);
  }
  
  if (filter?.limit) {
    filtered = filtered.slice(-filter.limit);
  }
  
  return filtered;
}

/**
 * Gets performance statistics
 */
export function getPerformanceStats(): {
  totalRequests: number;
  averageResponseTime: number;
  slowestRequest: PerformanceMetrics | null;
  errorRate: number;
  requestsByEndpoint: Record<string, number>;
} {
  if (performanceMetrics.length === 0) {
    return {
      totalRequests: 0,
      averageResponseTime: 0,
      slowestRequest: null,
      errorRate: 0,
      requestsByEndpoint: {}
    };
  }
  
  const totalRequests = performanceMetrics.length;
  const averageResponseTime = performanceMetrics.reduce((sum, m) => sum + m.duration, 0) / totalRequests;
  const slowestRequest = performanceMetrics.reduce((slowest, current) => 
    current.duration > slowest.duration ? current : slowest
  );
  const errorCount = performanceMetrics.filter(m => m.statusCode >= 400).length;
  const errorRate = (errorCount / totalRequests) * 100;
  
  const requestsByEndpoint = performanceMetrics.reduce((acc, m) => {
    acc[m.endpoint] = (acc[m.endpoint] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    totalRequests,
    averageResponseTime,
    slowestRequest,
    errorRate,
    requestsByEndpoint
  };
}

/**
 * Clears performance metrics (for testing)
 */
export function clearPerformanceMetrics(): void {
  performanceMetrics.length = 0;
  rateLimitStore.clear();
}

/**
 * Security middleware for chat API
 */
export function chatSecurityMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
): void {
  const startTime = Date.now();
  
  // Apply security headers
  applySecurityHeaders(res);
  
  // Validate origin
  if (!validateRequestOrigin(req)) {
    res.status(403).json({ error: 'Forbidden: Invalid origin' });
    return;
  }
  
  // Check rate limit
  const rateLimit = checkRateLimit(req);
  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', rateLimit.retryAfter!.toString());
    res.status(429).json({ 
      error: 'Too many requests',
      retryAfter: rateLimit.retryAfter
    });
    return;
  }
  
  // Add rate limit headers
  res.setHeader('X-RateLimit-Limit', CHAT_CONFIG.SECURITY.RATE_LIMIT.MAX_REQUESTS.toString());
  res.setHeader('X-RateLimit-Remaining', rateLimit.remaining.toString());
  res.setHeader('X-RateLimit-Reset', new Date(rateLimit.resetTime).toISOString());
  
  // Validate request body
  const validation = validateRequestBody(req.body);
  if (!validation.isValid) {
    res.status(400).json({ 
      error: 'Invalid request body',
      details: validation.errors
    });
    return;
  }
  
  // Replace request body with sanitized version
  req.body = validation.sanitizedBody;
  
  // Record performance metrics on response
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any) {
    const duration = Date.now() - startTime;
    recordPerformanceMetrics('/api/chat', req.method!, duration, res.statusCode, req);
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
}

// Export default
export default {
  applySecurityHeaders,
  validateRequestOrigin,
  checkRateLimit,
  sanitizeInput,
  validateRequestBody,
  recordPerformanceMetrics,
  getPerformanceMetrics,
  getPerformanceStats,
  clearPerformanceMetrics,
  chatSecurityMiddleware
};
