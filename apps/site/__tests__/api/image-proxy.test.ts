import { NextRequest } from 'next/server';
import { GET } from '@/app/api/image-proxy/route';

// Mock fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

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

describe('/api/image-proxy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rate Limiting', () => {
    it('should allow requests within rate limit', async () => {
      const request = new NextRequest('http://localhost:3000/api/image-proxy?url=https://example.com/image.jpg');
      Object.defineProperty(request, 'ip', { value: '127.0.0.1' });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'image/jpeg' }),
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(1024)),
      } as any);

      const response = await GET(request);
      expect(response.status).toBe(200);
    });

    it('should block requests exceeding rate limit', async () => {
      const request = new NextRequest('http://localhost:3000/api/image-proxy?url=https://example.com/image.jpg');
      Object.defineProperty(request, 'ip', { value: '127.0.0.1' });

      // Make multiple requests to exceed rate limit
      for (let i = 0; i < 101; i++) {
        await GET(request);
      }

      const response = await GET(request);
      expect(response.status).toBe(429);
    });
  });

  describe('URL Validation', () => {
    it('should accept valid image URLs', async () => {
      const validUrls = [
        'https://unsplash.com/image.jpg',
        'https://images.unsplash.com/photo.jpg',
        'https://picsum.photos/800/600',
        'https://via.placeholder.com/300x200',
        'https://cdn.jsdelivr.net/image.png',
        'https://raw.githubusercontent.com/user/repo/image.gif',
        'https://github.com/user/repo/blob/main/image.webp',
        'https://githubusercontent.com/user/repo/image.svg',
      ];

      for (const url of validUrls) {
        const request = new NextRequest(`http://localhost:3000/api/image-proxy?url=${encodeURIComponent(url)}`);
        Object.defineProperty(request, 'ip', { value: '127.0.0.1' });

        mockFetch.mockResolvedValueOnce({
          ok: true,
          headers: new Headers({ 'content-type': 'image/jpeg' }),
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(1024)),
        } as any);

        const response = await GET(request);
        expect(response.status).toBe(200);
      }
    });

    it('should reject invalid URLs', async () => {
      const invalidUrls = [
        'ftp://example.com/image.jpg',
        'javascript:alert("xss")',
        'data:text/html,<script>alert("xss")</script>',
        'http://localhost:3000/admin',
        'http://127.0.0.1:8080/secret',
        'http://192.168.1.1/admin',
        'http://10.0.0.1/config',
        'http://172.16.0.1/settings',
        'http://169.254.169.254/metadata',
        'https://malicious-site.com/image.jpg',
        'https://phishing-site.com/fake-image.jpg',
      ];

      for (const url of invalidUrls) {
        const request = new NextRequest(`http://localhost:3000/api/image-proxy?url=${encodeURIComponent(url)}`);
        Object.defineProperty(request, 'ip', { value: '127.0.0.1' });

        const response = await GET(request);
        expect(response.status).toBe(400);
      }
    });

    it('should reject URLs without image extensions', async () => {
      const nonImageUrls = [
        'https://example.com/document.pdf',
        'https://example.com/video.mp4',
        'https://example.com/script.js',
        'https://example.com/style.css',
        'https://example.com/data.json',
      ];

      for (const url of nonImageUrls) {
        const request = new NextRequest(`http://localhost:3000/api/image-proxy?url=${encodeURIComponent(url)}`);
        Object.defineProperty(request, 'ip', { value: '127.0.0.1' });

        const response = await GET(request);
        expect(response.status).toBe(400);
      }
    });
  });

  describe('Security Headers', () => {
    it('should include security headers in response', async () => {
      const request = new NextRequest('http://localhost:3000/api/image-proxy?url=https://unsplash.com/image.jpg');
      Object.defineProperty(request, 'ip', { value: '127.0.0.1' });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'image/jpeg' }),
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(1024)),
      } as any);

      const response = await GET(request);
      expect(response.status).toBe(200);
      
      // Check that security headers are present
      const headers = response.headers;
      expect(headers.get('X-Content-Type-Options')).toBe('nosniff');
      expect(headers.get('X-Frame-Options')).toBe('DENY');
      expect(headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
      expect(headers.get('X-Proxy-Source')).toBe('MindwareBlog-ImageProxy');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing URL parameter', async () => {
      const request = new NextRequest('http://localhost:3000/api/image-proxy');
      Object.defineProperty(request, 'ip', { value: '127.0.0.1' });

      const response = await GET(request);
      expect(response.status).toBe(400);
    });

    it('should handle fetch errors', async () => {
      const request = new NextRequest('http://localhost:3000/api/image-proxy?url=https://unsplash.com/image.jpg');
      Object.defineProperty(request, 'ip', { value: '127.0.0.1' });

      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const response = await GET(request);
      expect(response.status).toBe(500);
    });

    it('should handle non-image content types', async () => {
      const request = new NextRequest('http://localhost:3000/api/image-proxy?url=https://unsplash.com/image.jpg');
      Object.defineProperty(request, 'ip', { value: '127.0.0.1' });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'text/html' }),
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(1024)),
      } as any);

      const response = await GET(request);
      expect(response.status).toBe(500);
    });

    it('should handle oversized files', async () => {
      const request = new NextRequest('http://localhost:3000/api/image-proxy?url=https://unsplash.com/image.jpg');
      Object.defineProperty(request, 'ip', { value: '127.0.0.1' });

      // Create a large buffer (11MB)
      const largeBuffer = new ArrayBuffer(11 * 1024 * 1024);
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'image/jpeg' }),
        arrayBuffer: () => Promise.resolve(largeBuffer),
      } as any);

      const response = await GET(request);
      expect(response.status).toBe(500);
    });
  });

  describe('Caching', () => {
    it('should include cache headers', async () => {
      const request = new NextRequest('http://localhost:3000/api/image-proxy?url=https://unsplash.com/image.jpg');
      Object.defineProperty(request, 'ip', { value: '127.0.0.1' });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'image/jpeg' }),
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(1024)),
      } as any);

      const response = await GET(request);
      expect(response.status).toBe(200);
      
      const headers = response.headers;
      expect(headers.get('Cache-Control')).toBe('public, max-age=3600');
    });
  });

  describe('Rate Limit Headers', () => {
    it('should include rate limit headers in response', async () => {
      const request = new NextRequest('http://localhost:3000/api/image-proxy?url=https://unsplash.com/image.jpg');
      Object.defineProperty(request, 'ip', { value: '127.0.0.1' });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'image/jpeg' }),
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(1024)),
      } as any);

      const response = await GET(request);
      expect(response.status).toBe(200);
      
      const headers = response.headers;
      expect(headers.get('X-RateLimit-Limit')).toBe('100');
      expect(headers.get('X-RateLimit-Remaining')).toBeDefined();
      expect(headers.get('X-RateLimit-Reset')).toBeDefined();
    });
  });
});
