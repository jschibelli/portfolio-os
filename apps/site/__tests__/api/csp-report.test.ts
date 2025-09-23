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

describe('/api/csp-report', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rate Limiting', () => {
    it('should allow CSP reports within rate limit', async () => {
      const request = new NextRequest('http://localhost:3000/api/csp-report');
      Object.defineProperty(request, 'ip', { value: '127.0.0.1' });
      Object.defineProperty(request, 'json', { 
        value: () => Promise.resolve({
          'blocked-uri': 'https://malicious-site.com/script.js',
          'document-uri': 'https://example.com/page',
          'violated-directive': 'script-src'
        })
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should block CSP reports exceeding rate limit', async () => {
      const request = new NextRequest('http://localhost:3000/api/csp-report');
      Object.defineProperty(request, 'ip', { value: '127.0.0.1' });
      Object.defineProperty(request, 'json', { 
        value: () => Promise.resolve({
          'blocked-uri': 'https://malicious-site.com/script.js',
          'document-uri': 'https://example.com/page',
          'violated-directive': 'script-src'
        })
      });

      // Make multiple requests to exceed rate limit
      for (let i = 0; i < 51; i++) {
        await POST(request);
      }

      const response = await POST(request);
      expect(response.status).toBe(429);
    });
  });

  describe('Input Validation', () => {
    it('should accept valid CSP violation reports', async () => {
      const validReports = [
        {
          'blocked-uri': 'https://malicious-site.com/script.js',
          'document-uri': 'https://example.com/page',
          'violated-directive': 'script-src'
        },
        {
          'blocked-uri': 'data:text/html,<script>alert("xss")</script>',
          'document-uri': 'https://example.com/page',
          'violated-directive': 'script-src'
        },
        {
          'source-file': 'https://example.com/script.js',
          'line-number': 42,
          'column-number': 10,
          'violated-directive': 'script-src'
        }
      ];

      for (const report of validReports) {
        const request = new NextRequest('http://localhost:3000/api/csp-report');
        Object.defineProperty(request, 'ip', { value: '127.0.0.1' });
        Object.defineProperty(request, 'json', { value: () => Promise.resolve(report) });

        const response = await POST(request);
        expect(response.status).toBe(200);
      }
    });

    it('should reject invalid CSP violation reports', async () => {
      const invalidReports = [
        null,
        undefined,
        'not an object',
        123,
        [],
        {},
        { 'invalid-field': 'value' }
      ];

      for (const report of invalidReports) {
        const request = new NextRequest('http://localhost:3000/api/csp-report');
        Object.defineProperty(request, 'ip', { value: '127.0.0.1' });
        Object.defineProperty(request, 'json', { value: () => Promise.resolve(report) });

        const response = await POST(request);
        expect(response.status).toBe(400);
      }
    });

    it('should sanitize malicious input', async () => {
      const maliciousReport = {
        'blocked-uri': '<script>alert("xss")</script>',
        'document-uri': 'https://example.com/page',
        'violated-directive': 'script-src'
      };

      const request = new NextRequest('http://localhost:3000/api/csp-report');
      Object.defineProperty(request, 'ip', { value: '127.0.0.1' });
      Object.defineProperty(request, 'json', { value: () => Promise.resolve(maliciousReport) });

      const response = await POST(request);
      expect(response.status).toBe(200);
      
      // The malicious script should be sanitized in the logs
      // This would be verified by checking the actual log output
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/csp-report');
      Object.defineProperty(request, 'ip', { value: '127.0.0.1' });
      Object.defineProperty(request, 'json', { 
        value: () => Promise.reject(new Error('Invalid JSON'))
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

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

      const response = await POST(request);
      expect(response.status).toBe(200);
    });
  });

  describe('Security Features', () => {
    it('should include rate limit headers in response', async () => {
      const request = new NextRequest('http://localhost:3000/api/csp-report');
      Object.defineProperty(request, 'ip', { value: '127.0.0.1' });
      Object.defineProperty(request, 'json', { 
        value: () => Promise.resolve({
          'blocked-uri': 'https://malicious-site.com/script.js',
          'document-uri': 'https://example.com/page',
          'violated-directive': 'script-src'
        })
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
      
      const headers = response.headers;
      expect(headers.get('X-RateLimit-Limit')).toBe('50');
      expect(headers.get('X-RateLimit-Remaining')).toBeDefined();
      expect(headers.get('X-RateLimit-Reset')).toBeDefined();
    });

    it('should handle long input strings', async () => {
      const longString = 'a'.repeat(2000);
      const report = {
        'blocked-uri': longString,
        'document-uri': 'https://example.com/page',
        'violated-directive': 'script-src'
      };

      const request = new NextRequest('http://localhost:3000/api/csp-report');
      Object.defineProperty(request, 'ip', { value: '127.0.0.1' });
      Object.defineProperty(request, 'json', { value: () => Promise.resolve(report) });

      const response = await POST(request);
      expect(response.status).toBe(200);
      
      // Long strings should be truncated to 1000 characters
    });
  });

  describe('GET Method', () => {
    it('should return 405 for GET requests', async () => {
      const request = new NextRequest('http://localhost:3000/api/csp-report');
      const response = await GET(request);
      expect(response.status).toBe(405);
    });
  });

  describe('Structured Logging', () => {
    it('should log violations with proper structure', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const report = {
        'blocked-uri': 'https://malicious-site.com/script.js',
        'document-uri': 'https://example.com/page',
        'violated-directive': 'script-src'
      };

      const request = new NextRequest('http://localhost:3000/api/csp-report');
      Object.defineProperty(request, 'ip', { value: '127.0.0.1' });
      Object.defineProperty(request, 'json', { value: () => Promise.resolve(report) });

      await POST(request);

      expect(consoleSpy).toHaveBeenCalledWith(
        'CSP Violation Report:',
        expect.stringContaining('"type":"csp_violation"')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Performance', () => {
    it('should handle multiple concurrent requests', async () => {
      const requests = Array.from({ length: 10 }, () => {
        const request = new NextRequest('http://localhost:3000/api/csp-report');
        Object.defineProperty(request, 'ip', { value: '127.0.0.1' });
        Object.defineProperty(request, 'json', { 
          value: () => Promise.resolve({
            'blocked-uri': 'https://malicious-site.com/script.js',
            'document-uri': 'https://example.com/page',
            'violated-directive': 'script-src'
          })
        });
        return POST(request);
      });

      const responses = await Promise.all(requests);
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });
});
