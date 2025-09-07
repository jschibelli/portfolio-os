/**
 * Performance monitoring utilities for image loading and Core Web Vitals
 */

export interface ImageLoadMetrics {
  url: string;
  loadTime: number;
  size: number;
  format: string;
  timestamp: number;
  error?: string;
}

export interface CoreWebVitalsMetrics {
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
}

class PerformanceMonitor {
  private imageMetrics: ImageLoadMetrics[] = [];
  private coreWebVitals: CoreWebVitalsMetrics = {};
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  private initialize() {
    if (this.isInitialized) return;
    
    this.isInitialized = true;
    this.observeCoreWebVitals();
    this.observeImageLoads();
  }

  /**
   * Observe Core Web Vitals using the web-vitals library
   */
  private observeCoreWebVitals() {
    // Use fallback monitoring since web-vitals is not available
    console.warn('web-vitals not available, using fallback monitoring');
    this.observeBasicPerformance();
  }

  /**
   * Fallback performance monitoring using basic Performance API
   */
  private observeBasicPerformance() {
    if (!('performance' in window)) return;

    // Basic navigation timing
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      this.coreWebVitals.ttfb = navigation.responseStart - navigation.requestStart;
      this.coreWebVitals.fcp = navigation.domContentLoadedEventEnd - navigation.navigationStart;
    }

    // Basic LCP using Performance Observer
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            this.coreWebVitals.lcp = lastEntry.startTime;
            this.reportMetric('LCP', lastEntry.startTime);
          }
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (error) {
        console.warn('LCP monitoring not supported:', error);
      }
    }
  }

  /**
   * Observe image loads using Performance Observer
   */
  private observeImageLoads() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource' && entry.name.includes('image')) {
          this.trackImageLoad(entry as PerformanceResourceTiming);
        }
      }
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  /**
   * Track individual image load performance
   */
  trackImageLoad(entry: PerformanceResourceTiming) {
    const url = entry.name;
    const loadTime = entry.responseEnd - entry.startTime;
    const size = entry.transferSize || 0;
    
    // Extract format from URL or content type
    const format = this.extractImageFormat(url);
    
    const metric: ImageLoadMetrics = {
      url,
      loadTime,
      size,
      format,
      timestamp: Date.now(),
    };

    this.imageMetrics.push(metric);
    this.reportImageMetric(metric);
  }

  /**
   * Track image load with custom timing
   */
  trackCustomImageLoad(url: string, startTime: number, endTime: number, size: number = 0) {
    const loadTime = endTime - startTime;
    const format = this.extractImageFormat(url);
    
    const metric: ImageLoadMetrics = {
      url,
      loadTime,
      size,
      format,
      timestamp: Date.now(),
    };

    this.imageMetrics.push(metric);
    this.reportImageMetric(metric);
  }

  /**
   * Track image load error
   */
  trackImageError(url: string, error: string, startTime: number) {
    const loadTime = Date.now() - startTime;
    const format = this.extractImageFormat(url);
    
    const metric: ImageLoadMetrics = {
      url,
      loadTime,
      size: 0,
      format,
      timestamp: Date.now(),
      error,
    };

    this.imageMetrics.push(metric);
    this.reportImageMetric(metric);
  }

  /**
   * Extract image format from URL
   */
  private extractImageFormat(url: string): string {
    const match = url.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)(\?|$)/i);
    return match ? match[1].toLowerCase() : 'unknown';
  }

  /**
   * Report metric to analytics service
   */
  private reportMetric(name: string, value: number) {
    // Send to analytics service (Google Analytics, etc.)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'web_vitals', {
        name,
        value: Math.round(name === 'CLS' ? value * 1000 : value),
        event_category: 'Web Vitals',
        event_label: name,
        non_interaction: true,
      });
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${name}: ${value}`);
    }
  }

  /**
   * Report image metric to analytics service
   */
  private reportImageMetric(metric: ImageLoadMetrics) {
    // Send to analytics service
    if (typeof gtag !== 'undefined') {
      gtag('event', 'image_load', {
        event_category: 'Performance',
        event_label: metric.format,
        value: Math.round(metric.loadTime),
        custom_map: {
          dimension1: metric.size.toString(),
          dimension2: metric.error || 'success',
        },
      });
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Image Performance] ${metric.url}: ${metric.loadTime}ms (${metric.size} bytes)`);
    }
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary() {
    const imageStats = this.calculateImageStats();
    return {
      coreWebVitals: this.coreWebVitals,
      imageMetrics: imageStats,
      totalImages: this.imageMetrics.length,
      timestamp: Date.now(),
    };
  }

  /**
   * Calculate image loading statistics
   */
  private calculateImageStats() {
    if (this.imageMetrics.length === 0) {
      return {
        averageLoadTime: 0,
        totalSize: 0,
        errorRate: 0,
        formatDistribution: {},
      };
    }

    const successfulLoads = this.imageMetrics.filter(m => !m.error);
    const errors = this.imageMetrics.filter(m => m.error);
    
    const averageLoadTime = successfulLoads.reduce((sum, m) => sum + m.loadTime, 0) / successfulLoads.length;
    const totalSize = this.imageMetrics.reduce((sum, m) => sum + m.size, 0);
    const errorRate = (errors.length / this.imageMetrics.length) * 100;

    const formatDistribution = this.imageMetrics.reduce((acc, m) => {
      acc[m.format] = (acc[m.format] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      averageLoadTime: Math.round(averageLoadTime),
      totalSize,
      errorRate: Math.round(errorRate * 100) / 100,
      formatDistribution,
      slowestImage: successfulLoads.reduce((slowest, current) => 
        current.loadTime > slowest.loadTime ? current : slowest, 
        successfulLoads[0] || { loadTime: 0, url: '' }
      ),
    };
  }

  /**
   * Clear metrics (useful for testing)
   */
  clearMetrics() {
    this.imageMetrics = [];
    this.coreWebVitals = {};
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Hook for tracking image loads in React components
 */
export function useImagePerformanceTracking() {
  const trackImageLoad = (url: string, startTime: number, endTime: number, size?: number) => {
    performanceMonitor.trackCustomImageLoad(url, startTime, endTime, size);
  };

  const trackImageError = (url: string, error: string, startTime: number) => {
    performanceMonitor.trackImageError(url, error, startTime);
  };

  return { trackImageLoad, trackImageError };
}

/**
 * Utility function to measure image load time
 */
export function measureImageLoad(url: string): Promise<{ loadTime: number; size: number }> {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    const img = new Image();
    
    img.onload = () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      // Try to get size from headers or estimate
      const size = (img as any).naturalWidth * (img as any).naturalHeight * 3; // Rough estimate
      
      resolve({ loadTime, size });
    };
    
    img.onerror = () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      reject(new Error(`Failed to load image: ${url} (${loadTime}ms)`));
    };
    
    img.src = url;
  });
}
