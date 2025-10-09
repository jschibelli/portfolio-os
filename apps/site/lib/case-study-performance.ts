/**
 * Performance monitoring utilities for case study operations
 */

interface PerformanceMetrics {
  operation: string;
  duration: number;
  timestamp: number;
  cacheHit?: boolean;
  cacheSize?: number;
}

interface CacheStats {
  caseStudyCacheSize: number;
  caseStudyListCacheSize: number;
}

class CaseStudyPerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private readonly maxMetrics = 100; // Keep only last 100 metrics
  private cacheStats: CacheStats = { caseStudyCacheSize: 0, caseStudyListCacheSize: 0 };

  /**
   * Update cache stats (called from the loader)
   */
  updateCacheStats(stats: CacheStats): void {
    this.cacheStats = stats;
  }

  /**
   * Record a performance metric
   */
  recordMetric(operation: string, duration: number, cacheHit?: boolean): void {
    const metric: PerformanceMetrics = {
      operation,
      duration,
      timestamp: Date.now(),
      cacheHit,
      cacheSize: this.cacheStats.caseStudyCacheSize,
    };

    this.metrics.push(metric);

    // Keep only the most recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log slow operations in development
    if (process.env.NODE_ENV === 'development' && duration > 100) {
      console.warn(`Slow case study operation: ${operation} took ${duration}ms`);
    }
  }

  /**
   * Get performance statistics
   */
  getStats(): {
    averageLoadTime: number;
    cacheHitRate: number;
    totalOperations: number;
    slowOperations: number;
    recentMetrics: PerformanceMetrics[];
  } {
    const recentMetrics = this.metrics.slice(-20); // Last 20 operations
    const totalOperations = this.metrics.length;
    
    if (totalOperations === 0) {
      return {
        averageLoadTime: 0,
        cacheHitRate: 0,
        totalOperations: 0,
        slowOperations: 0,
        recentMetrics: [],
      };
    }

    const totalDuration = this.metrics.reduce((sum, metric) => sum + metric.duration, 0);
    const averageLoadTime = totalDuration / totalOperations;
    
    const cacheHits = this.metrics.filter(metric => metric.cacheHit).length;
    const cacheHitRate = (cacheHits / totalOperations) * 100;
    
    const slowOperations = this.metrics.filter(metric => metric.duration > 100).length;

    return {
      averageLoadTime: Math.round(averageLoadTime * 100) / 100,
      cacheHitRate: Math.round(cacheHitRate * 100) / 100,
      totalOperations,
      slowOperations,
      recentMetrics,
    };
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return this.cacheStats;
  }
}

// Singleton instance
export const performanceMonitor = new CaseStudyPerformanceMonitor();

/**
 * Performance decorator for case study operations
 */
export function withPerformanceTracking<T extends any[], R>(
  operation: string,
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    const startTime = performance.now();
    let cacheHit = false;
    
    try {
      const result = await fn(...args);
      const duration = performance.now() - startTime;
      
      // Check if this was a cache hit (duration < 10ms usually indicates cache hit)
      cacheHit = duration < 10;
      
      performanceMonitor.recordMetric(operation, duration, cacheHit);
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      performanceMonitor.recordMetric(`${operation}_error`, duration, cacheHit);
      throw error;
    }
  };
}

/**
 * Get performance report for debugging
 */
export function getPerformanceReport(): string {
  const stats = performanceMonitor.getStats();
  const cacheStats = performanceMonitor.getCacheStats();
  
  return `
Case Study Performance Report:
==============================
Total Operations: ${stats.totalOperations}
Average Load Time: ${stats.averageLoadTime}ms
Cache Hit Rate: ${stats.cacheHitRate}%
Slow Operations (>100ms): ${stats.slowOperations}
Cache Size: ${cacheStats.caseStudyCacheSize} case studies

Recent Operations:
${stats.recentMetrics.map(metric => 
  `  ${metric.operation}: ${metric.duration}ms ${metric.cacheHit ? '(cached)' : ''}`
).join('\n')}
  `.trim();
}
