/**
 * Security Configuration Management
 * Centralized security settings for the Mindware Blog application
 */

import { NextRequest } from 'next/server';

// Environment-specific configurations
export const SECURITY_CONFIG = {
  // CSP Configuration
  csp: {
    // Generate nonce for inline scripts/styles
    generateNonce: (): string => {
      if (process.env.NODE_ENV === 'production') {
        const crypto = require('crypto');
        return Buffer.from(crypto.randomBytes(16)).toString('base64');
      }
      return 'dev-nonce';
    },

    // Base CSP directives
    baseDirectives: {
      'default-src': "'self'",
      'object-src': "'none'",
      'base-uri': "'self'",
      'form-action': "'self'",
      'frame-ancestors': "'none'",
      'upgrade-insecure-requests': '',
    },

    // Script sources configuration
    scriptSources: {
      'self': "'self'",
      'nonce': (nonce: string) => `'nonce-${nonce}'`,
      'external': [
        'https://gql.hashnode.com',
        'https://hn-ping2.hashnode.com',
        'https://user-analytics.hashnode.com',
        'https://www.google-analytics.com',
        'https://www.googletagmanager.com',
      ],
    },

    // Style sources configuration
    styleSources: {
      'self': "'self'",
      'nonce': (nonce: string) => `'nonce-${nonce}'`,
      'external': [
        'https://fonts.googleapis.com',
      ],
    },

    // Image sources configuration
    imageSources: {
      'self': "'self'",
      'data': 'data:',
      'blob': 'blob:',
      'external': [
        'https://cdn.hashnode.com',
        'https://unsplash.com',
        'https://images.unsplash.com',
        'https://picsum.photos',
        'https://via.placeholder.com',
        'https://cdn.jsdelivr.net',
        'https://raw.githubusercontent.com',
        'https://github.com',
        'https://githubusercontent.com',
      ],
    },

    // Connect sources configuration
    connectSources: {
      'self': "'self'",
      'external': [
        'https://gql.hashnode.com',
        'https://hn-ping2.hashnode.com',
        'https://user-analytics.hashnode.com',
        'https://www.google-analytics.com',
        'https://www.googletagmanager.com',
      ],
    },

    // Frame sources configuration
    frameSources: {
      'self': "'self'",
      'external': [
        'https://www.google.com',
      ],
    },
  },

  // Security Headers Configuration
  headers: {
    // Basic security headers
    basic: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },

    // Enhanced security headers
    enhanced: {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'X-XSS-Protection': '1; mode=block',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-origin',
    },

    // Permissions Policy
    permissions: {
      'camera': '()',
      'microphone': '()',
      'geolocation': '()',
      'interest-cohort': '()',
      'payment': '()',
      'usb': '()',
      'magnetometer': '()',
      'gyroscope': '()',
      'accelerometer': '()',
    },
  },

  // Rate Limiting Configuration
  rateLimit: {
    imageProxy: {
      maxRequests: 100,
      windowMs: 15 * 60 * 1000, // 15 minutes
      blockDurationMs: 60 * 60 * 1000, // 1 hour
    },
    cspReport: {
      maxReports: 50,
      windowMs: 5 * 60 * 1000, // 5 minutes
    },
  },

  // Environment-specific settings
  environment: {
    development: {
      enableDetailedLogging: true,
      relaxedCSP: false,
      debugMode: true,
    },
    production: {
      enableDetailedLogging: false,
      relaxedCSP: false,
      debugMode: false,
    },
    test: {
      enableDetailedLogging: false,
      relaxedCSP: true,
      debugMode: false,
    },
  },
};

/**
 * Generate CSP policy string
 */
export function generateCSPPolicy(nonce: string): string {
  const { csp } = SECURITY_CONFIG;
  
  const directives = [
    // Base directives
    ...Object.entries(csp.baseDirectives).map(([key, value]) => 
      value ? `${key} ${value}` : key
    ),
    
    // Script sources
    `script-src ${csp.scriptSources.self} ${csp.scriptSources.nonce(nonce)} ${csp.scriptSources.external.join(' ')}`,
    
    // Style sources
    `style-src ${csp.styleSources.self} ${csp.styleSources.nonce(nonce)} ${csp.styleSources.external.join(' ')}`,
    
    // Font sources
    `font-src ${csp.styleSources.self} https://fonts.gstatic.com`,
    
    // Image sources
    `img-src ${csp.imageSources.self} ${csp.imageSources.data} ${csp.imageSources.blob} ${csp.imageSources.external.join(' ')}`,
    
    // Connect sources
    `connect-src ${csp.connectSources.self} ${csp.connectSources.external.join(' ')}`,
    
    // Frame sources
    `frame-src ${csp.frameSources.self} ${csp.frameSources.external.join(' ')}`,
    
    // Reporting
    'report-uri /api/csp-report',
    'report-to csp-endpoint',
  ];

  return directives.join('; ');
}

/**
 * Generate security headers
 */
export function generateSecurityHeaders(nonce: string) {
  const { headers, csp } = SECURITY_CONFIG;
  
  return [
    {
      key: 'Content-Security-Policy',
      value: generateCSPPolicy(nonce),
    },
    {
      key: 'Report-To',
      value: JSON.stringify({
        group: 'csp-endpoint',
        max_age: 10886400,
        endpoints: [{ url: '/api/csp-report' }],
      }),
    },
    // Basic security headers
    ...Object.entries(headers.basic).map(([key, value]) => ({
      key,
      value,
    })),
    // Enhanced security headers
    ...Object.entries(headers.enhanced).map(([key, value]) => ({
      key,
      value,
    })),
    // Permissions policy
    {
      key: 'Permissions-Policy',
      value: Object.entries(headers.permissions)
        .map(([key, value]) => `${key}=${value}`)
        .join(', '),
    },
  ];
}

/**
 * Get environment-specific configuration
 */
export function getEnvironmentConfig() {
  const env = process.env.NODE_ENV as keyof typeof SECURITY_CONFIG.environment;
  return SECURITY_CONFIG.environment[env] || SECURITY_CONFIG.environment.development;
}

/**
 * Validate and sanitize CSP report data
 */
export function validateCSPReport(data: any): { isValid: boolean; sanitizedData?: any; error?: string } {
  try {
    if (!data || typeof data !== 'object') {
      return { isValid: false, error: 'Invalid data format' };
    }

    const sanitizeString = (str: any): string => {
      if (typeof str !== 'string') return '';
      return str
        .replace(/[<>\"'&]/g, (match) => {
          const escapeMap: { [key: string]: string } = {
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '&': '&amp;'
          };
          return escapeMap[match] || match;
        })
        .substring(0, 1000);
    };

    const sanitizedData = {
      'blocked-uri': sanitizeString(data['blocked-uri']),
      'document-uri': sanitizeString(data['document-uri']),
      'effective-directive': sanitizeString(data['effective-directive']),
      'original-policy': sanitizeString(data['original-policy']),
      'referrer': sanitizeString(data['referrer']),
      'source-file': sanitizeString(data['source-file']),
      'violated-directive': sanitizeString(data['violated-directive']),
      'line-number': typeof data['line-number'] === 'number' ? data['line-number'] : 0,
      'column-number': typeof data['column-number'] === 'number' ? data['column-number'] : 0,
    };

    if (!sanitizedData['violated-directive'] && !sanitizedData['blocked-uri']) {
      return { isValid: false, error: 'Missing required violation data' };
    }

    return { isValid: true, sanitizedData };
  } catch (error) {
    return { isValid: false, error: 'Data validation failed' };
  }
}

/**
 * Rate limiting utilities
 */
export class RateLimiter {
  private store = new Map<string, { count: number; resetTime: number }>();

  checkLimit(
    key: string, 
    maxRequests: number, 
    windowMs: number
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const record = this.store.get(key);

    if (!record || now > record.resetTime) {
      this.store.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: now + windowMs,
      };
    }

    if (record.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime,
      };
    }

    record.count++;
    this.store.set(key, record);

    return {
      allowed: true,
      remaining: maxRequests - record.count,
      resetTime: record.resetTime,
    };
  }

  getRateLimitHeaders(rateLimit: { allowed: boolean; remaining: number; resetTime: number }, maxRequests: number) {
    return {
      'X-RateLimit-Limit': maxRequests.toString(),
      'X-RateLimit-Remaining': rateLimit.remaining.toString(),
      'X-RateLimit-Reset': rateLimit.resetTime.toString(),
    };
  }
}

/**
 * Security logging utilities
 */
export function logSecurityEvent(
  type: string, 
  severity: 'info' | 'warning' | 'error', 
  data: any, 
  metadata?: any
) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    type,
    severity,
    metadata: {
      userAgent: metadata?.userAgent || 'unknown',
      referer: metadata?.referer || 'unknown',
      ip: metadata?.ip || 'unknown',
      ...metadata,
    },
    data,
  };

  const envConfig = getEnvironmentConfig();
  
  if (envConfig.enableDetailedLogging) {
    console.log(`[${severity.toUpperCase()}] ${type}:`, JSON.stringify(logEntry, null, 2));
  } else {
    console.log(`[${severity.toUpperCase()}] ${type}:`, logEntry.timestamp);
  }

  // In production, send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    // await sendToMonitoringService(logEntry);
  }
}
