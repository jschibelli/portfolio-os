/**
 * Enhanced Caching Strategy for Performance Optimization
 * 
 * This module provides comprehensive caching strategies for static assets,
 * API responses, and computed data to improve application performance.
 */

interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum cache size
  strategy: 'memory' | 'localStorage' | 'sessionStorage';
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CacheManager<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private config: CacheConfig;

  constructor(config: CacheConfig) {
    this.config = config;
    this.startCleanup();
  }

  set(key: string, data: T, customTTL?: number): void {
    const ttl = customTTL || this.config.ttl;
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });

    // Enforce max size
    if (this.cache.size > this.config.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private startCleanup(): void {
    // Clean up expired entries every 5 minutes
    setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.cache.entries()) {
        if (now - entry.timestamp > entry.ttl) {
          this.cache.delete(key);
        }
      }
    }, 5 * 60 * 1000);
  }
}

// Specialized cache instances
export const blogPostCache = new CacheManager<any>({
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 100,
  strategy: 'memory'
});

export const analyticsCache = new CacheManager<any>({
  ttl: 10 * 60 * 1000, // 10 minutes
  maxSize: 50,
  strategy: 'memory'
});

export const imageCache = new CacheManager<string>({
  ttl: 60 * 60 * 1000, // 1 hour
  maxSize: 200,
  strategy: 'memory'
});

/**
 * HTTP Cache Headers Helper
 */
export function getCacheHeaders(type: 'static' | 'dynamic' | 'api' = 'static') {
  const headers: Record<string, string> = {};

  switch (type) {
    case 'static':
      headers['Cache-Control'] = 'public, max-age=31536000, immutable'; // 1 year
      headers['Expires'] = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
      break;
    case 'dynamic':
      headers['Cache-Control'] = 'public, max-age=300, s-maxage=600'; // 5 min browser, 10 min CDN
      break;
    case 'api':
      headers['Cache-Control'] = 'private, max-age=60'; // 1 minute
      break;
  }

  return headers;
}

/**
 * Service Worker Cache Strategy
 */
export const SW_CACHE_STRATEGY = {
  static: {
    strategy: 'CacheFirst',
    cacheName: 'static-v1',
    plugins: [
      {
        cacheKeyWillBeUsed: async ({ request }: any) => {
          return `${request.url}?v=1`;
        }
      }
    ]
  },
  api: {
    strategy: 'NetworkFirst',
    cacheName: 'api-v1',
    networkTimeoutSeconds: 3,
    plugins: [
      {
        cacheKeyWillBeUsed: async ({ request }: any) => {
          const url = new URL(request.url);
          return `${url.pathname}${url.search}`;
        }
      }
    ]
  },
  images: {
    strategy: 'CacheFirst',
    cacheName: 'images-v1',
    plugins: [
      {
        cacheWillUpdate: async ({ response }: any) => {
          return response.status === 200 ? response : null;
        }
      }
    ]
  }
};

/**
 * Next.js Image Optimization Cache
 */
export function getImageCacheConfig() {
  return {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  };
}

/**
 * API Response Caching
 */
export async function cachedFetch<T>(
  url: string,
  options: RequestInit = {},
  cacheKey?: string,
  ttl: number = 5 * 60 * 1000
): Promise<T> {
  const key = cacheKey || url;
  
  // Check cache first
  const cached = blogPostCache.get(key);
  if (cached) {
    return cached;
  }

  // Fetch from network
  const response = await fetch(url, {
    ...options,
    headers: {
      'Cache-Control': 'no-cache',
      ...options.headers
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  
  // Cache the result
  blogPostCache.set(key, data, ttl);
  
  return data;
}

/**
 * Preload Critical Resources
 */
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return;

  const criticalResources = [
    { href: '/assets/hero/profile.png', as: 'image' },
    { href: '/assets/circuit-pattern.png', as: 'image' },
    { href: '/fonts/PlusJakartaSans-Regular.woff2', as: 'font', type: 'font/woff2' },
    { href: '/fonts/PlusJakartaSans-Medium.woff2', as: 'font', type: 'font/woff2' }
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    if (resource.type) {
      link.type = resource.type;
    }
    if (resource.as === 'font') {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  });
}

/**
 * Lazy Loading Helper
 */
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  });
}
