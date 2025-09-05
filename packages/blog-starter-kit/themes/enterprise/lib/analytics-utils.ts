/**
 * Analytics Utilities
 * 
 * This module provides reusable analytics functions to reduce code duplication
 * and ensure consistent error handling across the application.
 * 
 * Features:
 * - Centralized analytics configuration
 * - Comprehensive error handling
 * - Performance monitoring
 * - Type-safe event tracking
 * - Graceful degradation when analytics services are unavailable
 */

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

/**
 * Analytics configuration
 */
export const ANALYTICS_CONFIG = {
  GA_TRACKING_ID: 'G-72XG3F8LNJ',
  HASHNODE_TRACKING_ID: 'G-72XG3F8LNJ',
  TRANSPORT_URL: 'https://ping.hashnode.com',
  TIMEOUT_MS: 5000, // 5 second timeout for analytics calls
  RETRY_ATTEMPTS: 2,
} as const;

/**
 * Analytics event types
 */
export interface AnalyticsEvent {
  event_name: string;
  event_category: string;
  event_label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

/**
 * Newsletter subscription event data
 */
export interface NewsletterEventData {
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  timestamp?: string;
  publicationId?: string;
}

/**
 * Post click event data
 */
export interface PostClickEventData {
  slug: string;
  title: string;
  timestamp?: string;
}

/**
 * Social media click event data
 */
export interface SocialClickEventData {
  platform: string;
  url: string;
  timestamp?: string;
}

/**
 * Performance monitoring for analytics
 */
class AnalyticsPerformanceMonitor {
  private static instance: AnalyticsPerformanceMonitor;
  private performanceMetrics: Map<string, number[]> = new Map();

  static getInstance(): AnalyticsPerformanceMonitor {
    if (!AnalyticsPerformanceMonitor.instance) {
      AnalyticsPerformanceMonitor.instance = new AnalyticsPerformanceMonitor();
    }
    return AnalyticsPerformanceMonitor.instance;
  }

  startTiming(eventName: string): () => void {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (!this.performanceMetrics.has(eventName)) {
        this.performanceMetrics.set(eventName, []);
      }
      
      const metrics = this.performanceMetrics.get(eventName)!;
      metrics.push(duration);
      
      // Keep only last 100 measurements
      if (metrics.length > 100) {
        metrics.shift();
      }
      
      // Log performance warnings
      if (duration > 1000) { // More than 1 second
        console.warn(`Analytics event "${eventName}" took ${duration.toFixed(2)}ms`);
      }
    };
  }

  getAverageTime(eventName: string): number {
    const metrics = this.performanceMetrics.get(eventName);
    if (!metrics || metrics.length === 0) return 0;
    
    return metrics.reduce((sum, time) => sum + time, 0) / metrics.length;
  }

  getMetrics(): Record<string, { average: number; count: number }> {
    const result: Record<string, { average: number; count: number }> = {};
    
    for (const [eventName, metrics] of this.performanceMetrics.entries()) {
      result[eventName] = {
        average: this.getAverageTime(eventName),
        count: metrics.length,
      };
    }
    
    return result;
  }
}

/**
 * Analytics error handler
 */
class AnalyticsErrorHandler {
  private static instance: AnalyticsErrorHandler;
  private errorCounts: Map<string, number> = new Map();
  private maxErrorsPerEvent = 5;

  static getInstance(): AnalyticsErrorHandler {
    if (!AnalyticsErrorHandler.instance) {
      AnalyticsErrorHandler.instance = new AnalyticsErrorHandler();
    }
    return AnalyticsErrorHandler.instance;
  }

  handleError(error: Error, eventName: string, context?: any): void {
    const errorKey = `${eventName}_${error.message}`;
    const currentCount = this.errorCounts.get(errorKey) || 0;
    
    if (currentCount < this.maxErrorsPerEvent) {
      console.error(`Analytics error in ${eventName}:`, {
        error: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
      });
      
      this.errorCounts.set(errorKey, currentCount + 1);
    } else if (currentCount === this.maxErrorsPerEvent) {
      console.error(`Analytics error limit reached for ${eventName}. Suppressing further errors.`);
      this.errorCounts.set(errorKey, currentCount + 1);
    }
  }

  resetErrorCounts(): void {
    this.errorCounts.clear();
  }
}

/**
 * Core analytics utility class
 */
export class AnalyticsUtils {
  private static performanceMonitor = AnalyticsPerformanceMonitor.getInstance();
  private static errorHandler = AnalyticsErrorHandler.getInstance();

  /**
   * Check if analytics is available and ready
   */
  static isAnalyticsAvailable(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof window.gtag === 'function' &&
      process.env.NODE_ENV === 'production'
    );
  }

  /**
   * Safe analytics call with error handling and performance monitoring
   */
  static async trackEvent(
    event: AnalyticsEvent,
    options: {
      timeout?: number;
      retryAttempts?: number;
      fallbackToCustomEvents?: boolean;
    } = {}
  ): Promise<boolean> {
    const {
      timeout = ANALYTICS_CONFIG.TIMEOUT_MS,
      retryAttempts = ANALYTICS_CONFIG.RETRY_ATTEMPTS,
      fallbackToCustomEvents = true,
    } = options;

    const endTiming = this.performanceMonitor.startTiming(event.event_name);

    try {
      // Check if analytics is available
      if (!this.isAnalyticsAvailable()) {
        if (fallbackToCustomEvents) {
          this.trackCustomEvent(event);
        }
        return false;
      }

      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Analytics timeout')), timeout);
      });

      // Create analytics promise
      const analyticsPromise = new Promise<boolean>((resolve) => {
        try {
          window.gtag('event', event.event_name, {
            event_category: event.event_category,
            event_label: event.event_label,
            value: event.value,
            ...event.custom_parameters,
          });
          resolve(true);
        } catch (error) {
          this.errorHandler.handleError(error as Error, event.event_name, event);
          resolve(false);
        }
      });

      // Race between analytics and timeout
      const result = await Promise.race([analyticsPromise, timeoutPromise]);
      endTiming();
      return result;

    } catch (error) {
      endTiming();
      this.errorHandler.handleError(error as Error, event.event_name, event);
      
      // Fallback to custom events if enabled
      if (fallbackToCustomEvents) {
        this.trackCustomEvent(event);
      }
      
      return false;
    }
  }

  /**
   * Track custom event as fallback
   */
  private static trackCustomEvent(event: AnalyticsEvent): void {
    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('analytics-event', {
          detail: {
            ...event,
            timestamp: new Date().toISOString(),
            source: 'fallback',
          },
        }));
      }
    } catch (error) {
      this.errorHandler.handleError(error as Error, 'custom-event-fallback', event);
    }
  }

  /**
   * Track page view with enhanced error handling
   */
  static async trackPageView(
    pageTitle: string,
    pageLocation: string,
    options: { timeout?: number } = {}
  ): Promise<boolean> {
    const endTiming = this.performanceMonitor.startTiming('page_view');

    try {
      if (!this.isAnalyticsAvailable()) {
        return false;
      }

      const timeout = options.timeout || ANALYTICS_CONFIG.TIMEOUT_MS;
      
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Page view tracking timeout')), timeout);
      });

      const pageViewPromise = new Promise<boolean>((resolve) => {
        try {
          window.gtag('config', ANALYTICS_CONFIG.GA_TRACKING_ID, {
            page_title: pageTitle,
            page_location: pageLocation,
            transport_url: ANALYTICS_CONFIG.TRANSPORT_URL,
            first_party_collection: true,
          });
          resolve(true);
        } catch (error) {
          this.errorHandler.handleError(error as Error, 'page_view', { pageTitle, pageLocation });
          resolve(false);
        }
      });

      const result = await Promise.race([pageViewPromise, timeoutPromise]);
      endTiming();
      return result;

    } catch (error) {
      endTiming();
      this.errorHandler.handleError(error as Error, 'page_view', { pageTitle, pageLocation });
      return false;
    }
  }

  /**
   * Track newsletter subscription with validation
   */
  static async trackNewsletterSubscription(
    data: NewsletterEventData,
    options: { timeout?: number } = {}
  ): Promise<boolean> {
    const validStatuses = ['PENDING', 'SUCCESS', 'FAILED'];
    
    if (!validStatuses.includes(data.status)) {
      console.warn('Invalid newsletter subscription status:', data.status);
      return false;
    }

    return this.trackEvent({
      event_name: 'newsletter_subscription',
      event_category: 'engagement',
      event_label: 'newsletter_cta',
      value: data.status === 'SUCCESS' ? 1 : 0,
      custom_parameters: {
        status: data.status,
        publication_id: data.publicationId,
        timestamp: data.timestamp || new Date().toISOString(),
      },
    }, options);
  }

  /**
   * Track post click with validation
   */
  static async trackPostClick(
    data: PostClickEventData,
    options: { timeout?: number } = {}
  ): Promise<boolean> {
    if (!data.slug || !data.title) {
      console.warn('Post click tracking failed: missing slug or title', data);
      return false;
    }

    return this.trackEvent({
      event_name: 'post_click',
      event_category: 'engagement',
      event_label: data.slug,
      value: 1,
      custom_parameters: {
        post_title: data.title,
        timestamp: data.timestamp || new Date().toISOString(),
      },
    }, options);
  }

  /**
   * Track social media click
   */
  static async trackSocialClick(
    data: SocialClickEventData,
    options: { timeout?: number } = {}
  ): Promise<boolean> {
    if (!data.platform || !data.url) {
      console.warn('Social click tracking failed: missing platform or url', data);
      return false;
    }

    return this.trackEvent({
      event_name: 'social_click',
      event_category: 'engagement',
      event_label: data.platform,
      value: 1,
      custom_parameters: {
        platform: data.platform,
        url: data.url,
        timestamp: data.timestamp || new Date().toISOString(),
      },
    }, options);
  }

  /**
   * Get performance metrics
   */
  static getPerformanceMetrics(): Record<string, { average: number; count: number }> {
    return this.performanceMonitor.getMetrics();
  }

  /**
   * Reset error counts (useful for testing)
   */
  static resetErrorCounts(): void {
    this.errorHandler.resetErrorCounts();
  }

  /**
   * Health check for analytics system
   */
  static getHealthStatus(): {
    isAvailable: boolean;
    performanceMetrics: Record<string, { average: number; count: number }>;
    errorCounts: number;
  } {
    return {
      isAvailable: this.isAnalyticsAvailable(),
      performanceMetrics: this.getPerformanceMetrics(),
      errorCounts: this.errorHandler['errorCounts'].size,
    };
  }
}

/**
 * Convenience functions for common analytics operations
 */
export const trackPageView = AnalyticsUtils.trackPageView;
export const trackNewsletterSubscription = AnalyticsUtils.trackNewsletterSubscription;
export const trackPostClick = AnalyticsUtils.trackPostClick;
export const trackSocialClick = AnalyticsUtils.trackSocialClick;
export const trackEvent = AnalyticsUtils.trackEvent;

/**
 * React hook for analytics with error handling
 */
export function useAnalytics() {
  const trackEventWithErrorHandling = async (
    event: AnalyticsEvent,
    options?: { timeout?: number; retryAttempts?: number; fallbackToCustomEvents?: boolean }
  ) => {
    try {
      return await AnalyticsUtils.trackEvent(event, options);
    } catch (error) {
      console.error('Analytics hook error:', error);
      return false;
    }
  };

  return {
    trackEvent: trackEventWithErrorHandling,
    trackPageView: AnalyticsUtils.trackPageView,
    trackNewsletterSubscription: AnalyticsUtils.trackNewsletterSubscription,
    trackPostClick: AnalyticsUtils.trackPostClick,
    trackSocialClick: AnalyticsUtils.trackSocialClick,
    isAvailable: AnalyticsUtils.isAnalyticsAvailable(),
    getHealthStatus: AnalyticsUtils.getHealthStatus,
  };
}
