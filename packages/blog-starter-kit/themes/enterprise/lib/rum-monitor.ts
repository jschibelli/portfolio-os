/**
 * Real User Monitoring (RUM) for Production Performance Tracking
 * 
 * This module provides client-side performance monitoring for production environments
 * to track Core Web Vitals and other performance metrics from real users.
 */

interface RUMConfig {
  enabled: boolean;
  endpoint: string;
  sampleRate: number;
  debug: boolean;
}

interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
  navigation?: PerformanceNavigationTiming;
  userAgent: string;
  timestamp: number;
  url: string;
  viewport: {
    width: number;
    height: number;
  };
  accessibility?: {
    score?: number;
    violations?: number;
    warnings?: number;
    assistiveTechnology?: string;
  };
}

class RUMMonitor {
  private config: RUMConfig;
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  constructor(config: Partial<RUMConfig> = {}) {
    this.config = {
      enabled: process.env.NODE_ENV === 'production',
      endpoint: '/api/analytics/rum',
      sampleRate: 0.1, // 10% sampling
      debug: false,
      ...config
    };

    if (this.config.enabled && typeof window !== 'undefined') {
      this.initialize();
    }
  }

  private initialize() {
    // Only track for a percentage of users
    if (Math.random() > this.config.sampleRate) {
      return;
    }

    this.setupBasicMetrics();
    this.setupCoreWebVitals();
    this.setupNavigationTiming();
    this.setupErrorTracking();
    this.setupAccessibilityTracking();
  }

  private setupBasicMetrics() {
    this.metrics = {
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      url: window.location.href,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }

  private setupCoreWebVitals() {
    // LCP Observer
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry;
          this.metrics.lcp = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        this.log('LCP observer setup failed:', e);
      }

      // FID Observer
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.metrics.fid = entry.processingStart - entry.startTime;
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        this.log('FID observer setup failed:', e);
      }

      // CLS Observer
      try {
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              this.metrics.cls = (this.metrics.cls || 0) + entry.value;
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        this.log('CLS observer setup failed:', e);
      }

      // FCP Observer
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.fcp = entry.startTime;
            }
          });
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(fcpObserver);
      } catch (e) {
        this.log('FCP observer setup failed:', e);
      }
    }
  }

  private setupNavigationTiming() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      try {
        const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        if (navigationEntries.length > 0) {
          this.metrics.navigation = navigationEntries[0];
          this.metrics.ttfb = navigationEntries[0].responseStart - navigationEntries[0].requestStart;
        }
      } catch (e) {
        this.log('Navigation timing setup failed:', e);
      }
    }
  }

  private setupErrorTracking() {
    window.addEventListener('error', (event) => {
      this.sendMetrics({
        ...this.metrics,
        error: {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.sendMetrics({
        ...this.metrics,
        error: {
          message: 'Unhandled Promise Rejection',
          reason: event.reason?.toString()
        }
      });
    });
  }

  private setupAccessibilityTracking() {
    // Detect assistive technology usage
    this.detectAssistiveTechnology();
    
    // Monitor accessibility-related events
    this.monitorAccessibilityEvents();
  }

  private detectAssistiveTechnology() {
    const assistiveTech = [];
    
    // Check for screen readers
    if (window.speechSynthesis) {
      assistiveTech.push('speech-synthesis');
    }
    
    // Check for high contrast mode
    if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
      assistiveTech.push('high-contrast');
    }
    
    // Check for reduced motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      assistiveTech.push('reduced-motion');
    }
    
    // Check for keyboard navigation
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        assistiveTech.push('keyboard-navigation');
      }
    }, { once: true });
    
    this.metrics.accessibility = {
      assistiveTechnology: assistiveTech.join(',')
    };
  }

  private monitorAccessibilityEvents() {
    // Monitor focus events
    let focusEvents = 0;
    document.addEventListener('focusin', () => {
      focusEvents++;
    });
    
    // Monitor keyboard events
    let keyboardEvents = 0;
    document.addEventListener('keydown', () => {
      keyboardEvents++;
    });
    
    // Send accessibility metrics periodically
    setInterval(() => {
      if (this.metrics.accessibility) {
        this.metrics.accessibility = {
          ...this.metrics.accessibility,
          focusEvents,
          keyboardEvents
        };
      }
    }, 30000); // Every 30 seconds
  }

  private async sendMetrics(data: any) {
    if (!this.config.enabled) return;

    try {
      await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        keepalive: true // Ensure request completes even if page unloads
      });
    } catch (error) {
      this.log('Failed to send RUM data:', error);
    }
  }

  private log(message: string, ...args: any[]) {
    if (this.config.debug) {
      console.log(`[RUM Monitor] ${message}`, ...args);
    }
  }

  public collectMetrics() {
    // Send metrics after a delay to ensure all observers have collected data
    setTimeout(() => {
      this.sendMetrics(this.metrics);
    }, 5000);
  }

  public destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Global instance
let rumMonitor: RUMMonitor | null = null;

export function initializeRUM(config?: Partial<RUMConfig>) {
  if (typeof window !== 'undefined' && !rumMonitor) {
    rumMonitor = new RUMMonitor(config);
    
    // Collect metrics when page is about to unload
    window.addEventListener('beforeunload', () => {
      rumMonitor?.collectMetrics();
    });

    // Also collect metrics after page load
    if (document.readyState === 'complete') {
      rumMonitor.collectMetrics();
    } else {
      window.addEventListener('load', () => {
        rumMonitor?.collectMetrics();
      });
    }
  }
  return rumMonitor;
}

export function getRUMMonitor() {
  return rumMonitor;
}

// Auto-initialize in production
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  initializeRUM();
}
