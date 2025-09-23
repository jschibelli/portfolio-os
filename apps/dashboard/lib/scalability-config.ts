/**
 * Scalability and Internationalization Configuration
 * 
 * This module provides configuration for scalable architecture,
 * internationalization, and cross-browser compatibility as
 * recommended by the CR-GPT bot feedback.
 */

// Scalability Configuration
export interface ScalabilityConfig {
  database: {
    connectionPool: {
      min: number
      max: number
      idleTimeout: number
    }
    caching: {
      enabled: boolean
      ttl: number
      maxSize: number
    }
  }
  api: {
    rateLimiting: {
      enabled: boolean
      requestsPerMinute: number
      burstLimit: number
    }
    pagination: {
      defaultPageSize: number
      maxPageSize: number
    }
  }
  performance: {
    compression: boolean
    minification: boolean
    imageOptimization: boolean
    cdnEnabled: boolean
  }
}

export const defaultScalabilityConfig: ScalabilityConfig = {
  database: {
    connectionPool: {
      min: 2,
      max: 10,
      idleTimeout: 30000
    },
    caching: {
      enabled: true,
      ttl: 300, // 5 minutes
      maxSize: 1000
    }
  },
  api: {
    rateLimiting: {
      enabled: true,
      requestsPerMinute: 100,
      burstLimit: 200
    },
    pagination: {
      defaultPageSize: 20,
      maxPageSize: 100
    }
  },
  performance: {
    compression: true,
    minification: true,
    imageOptimization: true,
    cdnEnabled: true
  }
}

// Internationalization Configuration
export interface InternationalizationConfig {
  defaultLocale: string
  supportedLocales: string[]
  fallbackLocale: string
  currency: {
    default: string
    supported: string[]
  }
  dateFormat: {
    default: string
    localeSpecific: Record<string, string>
  }
  numberFormat: {
    default: string
    localeSpecific: Record<string, string>
  }
}

export const defaultI18nConfig: InternationalizationConfig = {
  defaultLocale: 'en',
  supportedLocales: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh'],
  fallbackLocale: 'en',
  currency: {
    default: 'USD',
    supported: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD']
  },
  dateFormat: {
    default: 'MM/DD/YYYY',
    localeSpecific: {
      'en': 'MM/DD/YYYY',
      'es': 'DD/MM/YYYY',
      'fr': 'DD/MM/YYYY',
      'de': 'DD.MM.YYYY',
      'ja': 'YYYY/MM/DD',
      'ko': 'YYYY.MM.DD',
      'zh': 'YYYY年MM月DD日'
    }
  },
  numberFormat: {
    default: 'en-US',
    localeSpecific: {
      'en': 'en-US',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'zh': 'zh-CN'
    }
  }
}

// Cross-Browser Compatibility Configuration
export interface CrossBrowserConfig {
  supportedBrowsers: {
    chrome: string
    firefox: string
    safari: string
    edge: string
    opera?: string
  }
  polyfills: {
    fetch: boolean
    promises: boolean
    intersectionObserver: boolean
    resizeObserver: boolean
    webComponents: boolean
  }
  gracefulDegradation: {
    cssGrid: boolean
    flexbox: boolean
    customProperties: boolean
    webp: boolean
    avif: boolean
  }
}

export const defaultCrossBrowserConfig: CrossBrowserConfig = {
  supportedBrowsers: {
    chrome: '>=88',
    firefox: '>=85',
    safari: '>=14',
    edge: '>=88',
    opera: '>=74'
  },
  polyfills: {
    fetch: true,
    promises: true,
    intersectionObserver: true,
    resizeObserver: true,
    webComponents: false
  },
  gracefulDegradation: {
    cssGrid: true,
    flexbox: true,
    customProperties: true,
    webp: true,
    avif: false
  }
}

// Performance Monitoring Configuration
export interface PerformanceConfig {
  metrics: {
    enabled: boolean
    sampleRate: number
    thresholds: {
      renderTime: number
      apiResponseTime: number
      databaseQueryTime: number
    }
  }
  monitoring: {
    enabled: boolean
    endpoint: string
    apiKey?: string
  }
  alerts: {
    enabled: boolean
    thresholds: {
      errorRate: number
      responseTime: number
      memoryUsage: number
    }
  }
}

export const defaultPerformanceConfig: PerformanceConfig = {
  metrics: {
    enabled: true,
    sampleRate: 0.1, // 10% sampling
    thresholds: {
      renderTime: 100, // 100ms
      apiResponseTime: 500, // 500ms
      databaseQueryTime: 200 // 200ms
    }
  },
  monitoring: {
    enabled: true,
    endpoint: '/api/metrics',
    apiKey: process.env.MONITORING_API_KEY
  },
  alerts: {
    enabled: true,
    thresholds: {
      errorRate: 0.05, // 5%
      responseTime: 2000, // 2 seconds
      memoryUsage: 0.8 // 80%
    }
  }
}

// Utility Functions for Configuration Management
export class ConfigManager {
  private static instance: ConfigManager
  private config: {
    scalability: ScalabilityConfig
    i18n: InternationalizationConfig
    crossBrowser: CrossBrowserConfig
    performance: PerformanceConfig
  }

  private constructor() {
    this.config = {
      scalability: defaultScalabilityConfig,
      i18n: defaultI18nConfig,
      crossBrowser: defaultCrossBrowserConfig,
      performance: defaultPerformanceConfig
    }
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager()
    }
    return ConfigManager.instance
  }

  public getScalabilityConfig(): ScalabilityConfig {
    return this.config.scalability
  }

  public getI18nConfig(): InternationalizationConfig {
    return this.config.i18n
  }

  public getCrossBrowserConfig(): CrossBrowserConfig {
    return this.config.crossBrowser
  }

  public getPerformanceConfig(): PerformanceConfig {
    return this.config.performance
  }

  public updateConfig(
    section: keyof typeof this.config,
    updates: Partial<typeof this.config[typeof section]>
  ): void {
    this.config[section] = { ...this.config[section], ...updates }
  }

  public validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Validate scalability config
    if (this.config.scalability.database.connectionPool.min > this.config.scalability.database.connectionPool.max) {
      errors.push('Database connection pool min cannot be greater than max')
    }

    // Validate i18n config
    if (!this.config.i18n.supportedLocales.includes(this.config.i18n.defaultLocale)) {
      errors.push('Default locale must be in supported locales list')
    }

    // Validate performance config
    if (this.config.performance.metrics.sampleRate < 0 || this.config.performance.metrics.sampleRate > 1) {
      errors.push('Performance metrics sample rate must be between 0 and 1')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

// Environment-specific configuration overrides
export const getEnvironmentConfig = (env: string) => {
  const baseConfig = ConfigManager.getInstance()

  switch (env) {
    case 'development':
      return {
        ...baseConfig,
        scalability: {
          ...baseConfig.getScalabilityConfig(),
          database: {
            ...baseConfig.getScalabilityConfig().database,
            connectionPool: { min: 1, max: 3, idleTimeout: 10000 }
          }
        }
      }
    
    case 'production':
      return {
        ...baseConfig,
        scalability: {
          ...baseConfig.getScalabilityConfig(),
          database: {
            ...baseConfig.getScalabilityConfig().database,
            connectionPool: { min: 5, max: 20, idleTimeout: 60000 }
          }
        }
      }
    
    default:
      return baseConfig
  }
}

// Browser capability detection
export const detectBrowserCapabilities = () => {
  const capabilities = {
    cssGrid: 'grid' in document.documentElement.style,
    flexbox: 'flex' in document.documentElement.style,
    customProperties: '--test' in document.documentElement.style,
    webp: false,
    avif: false,
    intersectionObserver: 'IntersectionObserver' in window,
    resizeObserver: 'ResizeObserver' in window,
    promises: 'Promise' in window,
    fetch: 'fetch' in window
  }

  // Test WebP support
  const webpTest = new Image()
  webpTest.onload = webpTest.onerror = () => {
    capabilities.webp = webpTest.height === 2
  }
  webpTest.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'

  // Test AVIF support
  const avifTest = new Image()
  avifTest.onload = avifTest.onerror = () => {
    capabilities.avif = avifTest.height === 2
  }
  avifTest.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABgAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEAwgMgkAAABAAABAAAAAAAAAAAAAA'

  return capabilities
}
