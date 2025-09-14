import { NextRequest } from 'next/server';
import { POST, GET } from '@/app/api/csp-report/route';

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: () => Promise.resolve(data),
      status: init?.status || 200,
      headers: new Headers(init?.headers || {}),
    })),
    next: jest.fn(),
  },
  NextRequest: jest.fn(),
}));

// Mock security configuration
jest.mock('@/lib/security-config', () => ({
  SECURITY_CONFIG: {
    rateLimit: {
      cspReport: {
        maxReports: 50,
        windowMs: 5 * 60 * 1000, // 5 minutes
      },
    },
  },
  validateCSPReport: jest.fn(),
  RateLimiter: jest.fn().mockImplementation(() => ({
    checkLimit: jest.fn(),
    getRateLimitHeaders: jest.fn(),
  })),
  logSecurityEvent: jest.fn(),
}));

describe('/api/csp-report Enhanced', () => {
  let mockRateLimiter: any;
  let mockValidateCSPReport: any;
  let mockLogSecurityEvent: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mocks
    mockRateLimiter = {
      checkLimit: jest.fn(),
      getRateLimitHeaders: jest.fn(),
    };
    
    mockValidateCSPReport = require('@/lib/security-config').validateCSPReport;
    mockLogSecurityEvent = require('@/lib/security-config').logSecurityEvent;
    
    // Mock RateLimiter constructor
    const { RateLimiter } = require('@/lib/security-config');
    RateLimiter.mockImplementation(() => mockRateLimiter);
  });

  describe('Import Organization and Error Handling', () => {
    it('should handle import organization correctly', async () => {
      const request = new NextRequest('http://localhost:3000/api/csp-report');
      Object.defineProperty(request, 'ip', { value: '127.0.0.1' });
      Object.defineProperty(request, 'json', { 
        value: () => Promise.resolve({
          'blocked-uri': 'https://malicious-site.com/script.js',
          'document-uri': 'https://example.com/page',
          'violated-directive': 'script-src'
        })
      });

      mockRateLimiter.checkLimit.mockReturnValue({
        allowed: true,
        remaining: 49,
        resetTime: Date.now() + 300000,
      });

      mockValidateCSPReport.mockReturnValue({
        isValid: true,
        sanitizedData: {
          'blocked-uri': 'https://malicious-site.com/script.js',
          'document-uri': 'https://example.com/page',
          'violated-directive': 'script-src'
        }
      });

      mockRateLimiter.getRateLimitHeaders.mockReturnValue({
        'X-RateLimit-Limit': '50',
        'X-RateLimit-Remaining': '49',
        'X-RateLimit-Reset': '1234567890',
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });
  });

  describe('Enhanced Error Handling', () => {
    it('should handle JSON parse errors with generic messages', async () => {
      const request = new NextRequest('http://localhost:3000/api/csp-report');
      Object.defineProperty(request, 'ip', { value: '127.0.0.1' });
      Object.defineProperty(request, 'json', { 
        value: () => Promise.reject(new Error('Invalid JSON'))
      });

      mockRateLimiter.checkLimit.mockReturnValue({
        allowed: true,
        remaining: 49,
        resetTime: Date.now() + 300000,
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
      
      // Verify that generic error message is returned
      const responseData = await response.json();
      expect(responseData.error).toBe('Invalid request format');
      
      // Verify that security event is logged
      expect(mockLogSecurityEvent).toHaveBeenCalledWith(
        'csp_report_parse_error',
        'warning',
        expect.objectContaining({
          error: 'Invalid JSON format',
          clientIP: '127.0.0.1',
          userAgent: 'unknown'
        })
      );
    });

    it('should handle validation errors with generic messages', async () => {
      const request = new NextRequest('http://localhost:3000/api/csp-report');
      Object.defineProperty(request, 'ip', { value: '127.0.0.1' });
      Object.defineProperty(request, 'json', { 
        value: () => Promise.resolve({ invalid: 'data' })
      });

      mockRateLimiter.checkLimit.mockReturnValue({
        allowed: true,
        remaining: 49,
        resetTime: Date.now() + 300000,
      });

      mockValidateCSPReport.mockReturnValue({
        isValid: false,
        error: 'Missing required violation data'
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
      
      // Verify that generic error message is returned
      const responseData = await response.json();
      expect(responseData.error).toBe('Invalid report data');
      
      // Verify that security event is logged
      expect(mockLogSecurityEvent).toHaveBeenCalledWith(
        'csp_report_validation_error',
        'warning',
        expect.objectContaining({
          error: 'Missing required violation data',
          clientIP: '127.0.0.1',
          userAgent: 'unknown'
        })
      );
    });

    it('should handle internal errors with generic messages', async () => {
      const request = new NextRequest('http://localhost:3000/api/csp-report');
      Object.defineProperty(request, 'ip', { value: '127.0.0.1' });
      Object.defineProperty(request, 'json', { 
        value: () => Promise.resolve({
          'blocked-uri': 'https://malicious-site.com/script.js',
          'document-uri': 'https://example.com/page',
          'violated-directive': 'script-src'
        })
      });

      mockRateLimiter.checkLimit.mockReturnValue({
        allowed: true,
        remaining: 49,
        resetTime: Date.now() + 300000,
      });

      mockValidateCSPReport.mockReturnValue({
        isValid: true,
        sanitizedData: {
          'blocked-uri': 'https://malicious-site.com/script.js',
          'document-uri': 'https://example.com/page',
          'violated-directive': 'script-src'
        }
      });

      // Mock an error in the processing
      mockLogSecurityEvent.mockImplementation(() => {
        throw new Error('Logging error');
      });

      const response = await POST(request);
      expect(response.status).toBe(500);
      
      // Verify that generic error message is returned
      const responseData = await response.json();
      expect(responseData.error).toBe('Internal server error');
    });
  });

  describe('Rate Limiting Configuration Validation', () => {
    it('should validate rate limiting configuration', async () => {
      // Test with invalid configuration
      const { SECURITY_CONFIG } = require('@/lib/security-config');
      SECURITY_CONFIG.rateLimit.cspReport.maxReports = 0;

      const request = new NextRequest('http://localhost:3000/api/csp-report');
      Object.defineProperty(request, 'ip', { value: '127.0.0.1' });

      // Should throw error during module initialization
      expect(() => {
        require('@/app/api/csp-report/route');
      }).toThrow('CSP report rate limiting configuration is invalid');
    });

    it('should handle rate limit exceeded scenarios', async () => {
      const request = new NextRequest('http://localhost:3000/api/csp-report');
      Object.defineProperty(request, 'ip', { value: '127.0.0.1' });

      mockRateLimiter.checkLimit.mockReturnValue({
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + 300000,
      });

      mockRateLimiter.getRateLimitHeaders.mockReturnValue({
        'X-RateLimit-Limit': '50',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': '1234567890',
      });

      const response = await POST(request);
      expect(response.status).toBe(429);
      
      const headers = response.headers;
      expect(headers.get('X-RateLimit-Limit')).toBe('50');
      expect(headers.get('X-RateLimit-Remaining')).toBe('0');
      expect(headers.get('Retry-After')).toBeDefined();
    });
  });

  describe('Data Sanitization Verification', () => {
    it('should verify data sanitization in validation', async () => {
      const maliciousData = {
        'blocked-uri': '<script>alert("xss")</script>',
        'document-uri': 'https://example.com/page',
        'violated-directive': 'script-src'
      };

      const request = new NextRequest('http://localhost:3000/api/csp-report');
      Object.defineProperty(request, 'ip', { value: '127.0.0.1' });
      Object.defineProperty(request, 'json', { 
        value: () => Promise.resolve(maliciousData)
      });

      mockRateLimiter.checkLimit.mockReturnValue({
        allowed: true,
        remaining: 49,
        resetTime: Date.now() + 300000,
      });

      // Mock sanitized data
      mockValidateCSPReport.mockReturnValue({
        isValid: true,
        sanitizedData: {
          'blocked-uri': '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
          'document-uri': 'https://example.com/page',
          'violated-directive': 'script-src'
        }
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
      
      // Verify that validateCSPReport was called with the malicious data
      expect(mockValidateCSPReport).toHaveBeenCalledWith(maliciousData);
    });
  });

  describe('Performance Monitoring', () => {
    it('should handle high traffic scenarios', async () => {
      const requests = Array.from({ length: 100 }, (_, i) => {
        const request = new NextRequest('http://localhost:3000/api/csp-report');
        Object.defineProperty(request, 'ip', { value: `127.0.0.${i % 10}` });
        Object.defineProperty(request, 'json', { 
          value: () => Promise.resolve({
            'blocked-uri': `https://malicious-site-${i}.com/script.js`,
            'document-uri': 'https://example.com/page',
            'violated-directive': 'script-src'
          })
        });
        return POST(request);
      });

      mockRateLimiter.checkLimit.mockReturnValue({
        allowed: true,
        remaining: 49,
        resetTime: Date.now() + 300000,
      });

      mockValidateCSPReport.mockReturnValue({
        isValid: true,
        sanitizedData: {
          'blocked-uri': 'https://malicious-site.com/script.js',
          'document-uri': 'https://example.com/page',
          'violated-directive': 'script-src'
        }
      });

      mockRateLimiter.getRateLimitHeaders.mockReturnValue({
        'X-RateLimit-Limit': '50',
        'X-RateLimit-Remaining': '49',
        'X-RateLimit-Reset': '1234567890',
      });

      const responses = await Promise.all(requests);
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });

  describe('HTTP Method Handling', () => {
    it('should handle GET requests appropriately', async () => {
      const request = new NextRequest('http://localhost:3000/api/csp-report');
      const response = await GET(request);
      
      expect(response.status).toBe(405);
      const responseData = await response.json();
      expect(responseData.message).toBe('CSP reporting endpoint - use POST method');
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing IP address', async () => {
      const request = new NextRequest('http://localhost:3000/api/csp-report');
      Object.defineProperty(request, 'ip', { value: undefined });
      Object.defineProperty(request, 'json', { 
        value: () => Promise.resolve({
          'blocked-uri': 'https://malicious-site.com/script.js',
          'document-uri': 'https://example.com/page',
          'violated-directive': 'script-src'
        })
      });

      mockRateLimiter.checkLimit.mockReturnValue({
        allowed: true,
        remaining: 49,
        resetTime: Date.now() + 300000,
      });

      mockValidateCSPReport.mockReturnValue({
        isValid: true,
        sanitizedData: {
          'blocked-uri': 'https://malicious-site.com/script.js',
          'document-uri': 'https://example.com/page',
          'violated-directive': 'script-src'
        }
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should handle missing user agent', async () => {
      const request = new NextRequest('http://localhost:3000/api/csp-report');
      Object.defineProperty(request, 'ip', { value: '127.0.0.1' });
      Object.defineProperty(request, 'headers', { 
        value: {
          get: jest.fn((header) => {
            if (header === 'user-agent') return null;
            if (header === 'referer') return null;
            return null;
          })
        }
      });
      Object.defineProperty(request, 'json', { 
        value: () => Promise.resolve({
          'blocked-uri': 'https://malicious-site.com/script.js',
          'document-uri': 'https://example.com/page',
          'violated-directive': 'script-src'
        })
      });

      mockRateLimiter.checkLimit.mockReturnValue({
        allowed: true,
        remaining: 49,
        resetTime: Date.now() + 300000,
      });

      mockValidateCSPReport.mockReturnValue({
        isValid: true,
        sanitizedData: {
          'blocked-uri': 'https://malicious-site.com/script.js',
          'document-uri': 'https://example.com/page',
          'violated-directive': 'script-src'
        }
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });
  });
});
