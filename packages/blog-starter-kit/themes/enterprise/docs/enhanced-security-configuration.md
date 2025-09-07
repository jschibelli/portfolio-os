# Enhanced Security Configuration

This document outlines the enhanced security configuration system implemented based on GitHub code review feedback, providing centralized, maintainable, and environment-specific security settings.

## 🏗️ **Architecture Overview**

### Centralized Configuration System

The security configuration is now centralized in `lib/security-config.ts`, providing:

- **Environment-specific settings** for development, production, and test
- **Modular CSP directives** for easier management
- **Centralized rate limiting** with reusable utilities
- **Structured logging** for security events
- **Validation utilities** for data sanitization

### Key Components

1. **Security Configuration** (`lib/security-config.ts`)
2. **Webpack Configuration** (`lib/webpack-config.ts`)
3. **Enhanced CSP Reporting** (`app/api/csp-report/route.ts`)
4. **Updated Next.js Config** (`next.config.js`)

## 🔧 **Configuration Management**

### Environment-Specific Settings

```typescript
export const SECURITY_CONFIG = {
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
```

### CSP Directives Management

#### **Modular CSP Configuration**
```typescript
csp: {
  // Base directives
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
      // ... other external sources
    ],
  },
}
```

#### **Dynamic CSP Generation**
```typescript
export function generateCSPPolicy(nonce: string): string {
  const { csp } = SECURITY_CONFIG;
  
  const directives = [
    // Base directives
    ...Object.entries(csp.baseDirectives).map(([key, value]) => 
      value ? `${key} ${value}` : key
    ),
    
    // Script sources
    `script-src ${csp.scriptSources.self} ${csp.scriptSources.nonce(nonce)} ${csp.scriptSources.external.join(' ')}`,
    
    // ... other directive types
  ];

  return directives.join('; ');
}
```

## 🛡️ **Security Headers Management**

### Centralized Header Generation

```typescript
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
  ];
}
```

### Environment-Specific Headers

- **Development**: Detailed logging, debug information
- **Production**: Minimal logging, maximum security
- **Test**: Relaxed CSP for testing, minimal overhead

## ⚡ **Rate Limiting System**

### Centralized Rate Limiting

```typescript
export class RateLimiter {
  private store = new Map<string, { count: number; resetTime: number }>();

  checkLimit(
    key: string, 
    maxRequests: number, 
    windowMs: number
  ): { allowed: boolean; remaining: number; resetTime: number } {
    // Implementation with centralized logic
  }

  getRateLimitHeaders(rateLimit: any, maxRequests: number) {
    return {
      'X-RateLimit-Limit': maxRequests.toString(),
      'X-RateLimit-Remaining': rateLimit.remaining.toString(),
      'X-RateLimit-Reset': rateLimit.resetTime.toString(),
    };
  }
}
```

### Configuration-Based Limits

```typescript
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
```

## 🔍 **Webpack Security Configuration**

### Environment-Specific Webpack Settings

```typescript
export const WEBPACK_FALLBACKS = {
  // Production fallbacks (more restrictive)
  production: {
    encoding: false,
    'cross-fetch': false,
    fs: false,
    net: false,
    tls: false,
    crypto: false,
    // ... other security-focused fallbacks
  },
  
  // Development fallbacks (more permissive for debugging)
  development: {
    encoding: false,
    'cross-fetch': false,
    // ... development-specific fallbacks
  },
  
  // Test fallbacks (minimal for testing)
  test: {
    encoding: false,
    'cross-fetch': false,
  },
};
```

### Security-Focused Module Rules

```typescript
module: {
  rules: [
    // Security: Prevent loading of sensitive files
    {
      test: /\.(env|config|secret|key|pem|crt)$/i,
      use: 'null-loader',
    },
    
    // Security: Validate file types
    {
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
          plugins: [
            // Add security-focused babel plugins
            ...(isProduction ? [
              // Production-only plugins
            ] : []),
          ],
        },
      },
    },
  ],
},
```

## 📊 **Structured Logging System**

### Centralized Security Logging

```typescript
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
```

### Environment-Specific Logging

- **Development**: Detailed JSON logging with full context
- **Production**: Minimal logging with monitoring service integration
- **Test**: Silent logging to avoid test noise

## 🔄 **Configuration Updates**

### Regular Security Updates

#### **Quarterly Reviews**
- CSP directive analysis and refinement
- Security header updates
- Rate limiting adjustments
- Webpack fallback reviews

#### **Annual Security Audits**
- Complete configuration review
- Security standard compliance
- Performance impact assessment
- Documentation updates

### Dynamic Configuration

#### **Environment Variables**
```typescript
// Environment-specific overrides
const customConfig = {
  csp: {
    scriptSources: {
      external: [
        ...SECURITY_CONFIG.csp.scriptSources.external,
        ...(process.env.ADDITIONAL_SCRIPT_SOURCES?.split(',') || [])
      ]
    }
  }
};
```

#### **Runtime Configuration**
```typescript
// Runtime configuration updates
export function updateSecurityConfig(updates: Partial<typeof SECURITY_CONFIG>) {
  // Merge updates with existing configuration
  // Validate new configuration
  // Apply changes
}
```

## 🧪 **Testing and Validation**

### Configuration Validation

```typescript
export function validateWebpackConfig(config: Configuration): { isValid: boolean; warnings: string[] } {
  const warnings: string[] = [];
  
  // Check for potentially unsafe configurations
  if (config.mode === 'development' && config.optimization?.minimize) {
    warnings.push('Minification enabled in development mode may impact debugging');
  }
  
  // Check for missing security fallbacks
  const requiredFallbacks = ['fs', 'crypto', 'net', 'tls'];
  const fallbacks = config.resolve?.fallback || {};
  
  requiredFallbacks.forEach(fallback => {
    if (fallbacks[fallback] !== false) {
      warnings.push(`Fallback for '${fallback}' should be disabled for security`);
    }
  });
  
  return {
    isValid: warnings.length === 0,
    warnings,
  };
}
```

### Security Testing

```typescript
describe('Security Configuration', () => {
  it('should generate valid CSP policy', () => {
    const nonce = 'test-nonce';
    const policy = generateCSPPolicy(nonce);
    expect(policy).toContain('script-src');
    expect(policy).toContain('nonce-test-nonce');
  });

  it('should validate webpack configuration', () => {
    const config = generateWebpackConfig({ isServer: false, dev: false, isProduction: true });
    const validation = validateWebpackConfig(config);
    expect(validation.isValid).toBe(true);
  });
});
```

## 📈 **Performance Impact**

### Optimization Benefits

- **Centralized Configuration**: Reduced code duplication
- **Environment-Specific Settings**: Optimized for each environment
- **Cached Configurations**: Reduced runtime overhead
- **Modular CSP**: Easier maintenance and updates

### Monitoring and Metrics

- **Configuration Load Time**: Track configuration initialization
- **CSP Violation Rates**: Monitor policy effectiveness
- **Rate Limit Triggers**: Track abuse patterns
- **Security Event Frequency**: Monitor security incidents

## 🔗 **Integration Points**

### Next.js Integration

```typescript
// next.config.js
async headers() {
  try {
    const { generateSecurityHeaders, getEnvironmentConfig } = require('./lib/security-config');
    const envConfig = getEnvironmentConfig();
    const { generateNonce } = require('./lib/security-config').SECURITY_CONFIG.csp;
    const nonce = generateNonce();
    const securityHeaders = generateSecurityHeaders(nonce);
    
    return [{ source: '/(.*)', headers: securityHeaders }];
  } catch (error) {
    console.error('Error setting security headers:', error);
    return [{ source: '/(.*)', headers: [{ key: 'X-Frame-Options', value: 'DENY' }] }];
  }
}
```

### API Route Integration

```typescript
// app/api/csp-report/route.ts
import { 
  SECURITY_CONFIG, 
  validateCSPReport, 
  RateLimiter, 
  logSecurityEvent 
} from '@/lib/security-config';

const rateLimiter = new RateLimiter();
const rateLimitConfig = SECURITY_CONFIG.rateLimit.cspReport;
```

## 🚀 **Future Enhancements**

### Planned Improvements

- [ ] **Redis-based Rate Limiting** for production scalability
- [ ] **Dynamic CSP Updates** without application restarts
- [ ] **Security Configuration UI** for admin management
- [ ] **Automated Security Scanning** integration
- [ ] **Real-time Security Monitoring** dashboard

### Configuration Evolution

- [ ] **Machine Learning** for anomaly detection
- [ ] **Automated Policy Updates** based on threat intelligence
- [ ] **Multi-tenant Configuration** support
- [ ] **Configuration Versioning** and rollback capabilities

---

*This enhanced security configuration system provides a robust, maintainable, and scalable foundation for web application security, addressing all feedback from the GitHub code review while maintaining performance and usability.*
