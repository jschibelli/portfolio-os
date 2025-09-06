/**
 * Comprehensive Logging Service
 * 
 * This module provides a robust logging system for debugging and auditing
 * with different log levels, structured logging, and performance monitoring.
 * 
 * Addresses code review feedback from PR #37:
 * - Proper logging mechanisms for debugging and auditing
 * - Structured logging with context information
 * - Performance monitoring and error tracking
 * - Security-aware logging (no sensitive data exposure)
 */

import { LogEntry } from './api-types';
import { sanitizeInput } from './config-validation';

// Log levels with numeric priorities
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

// Log entry interface with additional metadata
export interface EnhancedLogEntry extends LogEntry {
  level: keyof typeof LogLevel;
  priority: number;
  service?: string;
  operation?: string;
  duration?: number;
  memoryUsage?: NodeJS.MemoryUsage;
  userAgent?: string;
  ip?: string;
  sessionId?: string;
}

// Logging configuration
export interface LoggingConfig {
  minLevel: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
  enableRemote: boolean;
  maxFileSize: number;
  maxFiles: number;
  remoteEndpoint?: string;
  remoteApiKey?: string;
  sanitizeData: boolean;
  includeStackTrace: boolean;
  performanceMonitoring: boolean;
}

// Default configuration
const DEFAULT_CONFIG: LoggingConfig = {
  minLevel: LogLevel.INFO,
  enableConsole: true,
  enableFile: false,
  enableRemote: false,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 5,
  sanitizeData: true,
  includeStackTrace: true,
  performanceMonitoring: true,
};

// Performance monitoring
interface PerformanceMetric {
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  memoryBefore?: NodeJS.MemoryUsage;
  memoryAfter?: NodeJS.MemoryUsage;
  success?: boolean;
  error?: string;
}

// Logging service class
export class LoggingService {
  private config: LoggingConfig;
  private performanceMetrics: Map<string, PerformanceMetric> = new Map();
  private requestCounters: Map<string, number> = new Map();

  constructor(config?: Partial<LoggingConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Sanitizes log data to prevent sensitive information exposure
   */
  private sanitizeLogData(data: any): any {
    if (!this.config.sanitizeData) {
      return data;
    }

    if (typeof data === 'string') {
      return sanitizeInput(data);
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeLogData(item));
    }

    if (data && typeof data === 'object') {
      const sanitized: any = {};
      const sensitiveKeys = ['password', 'token', 'key', 'secret', 'auth', 'credential'];
      
      for (const [key, value] of Object.entries(data)) {
        const lowerKey = key.toLowerCase();
        if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = this.sanitizeLogData(value);
        }
      }
      
      return sanitized;
    }

    return data;
  }

  /**
   * Creates a structured log entry
   */
  private createLogEntry(
    level: keyof typeof LogLevel,
    message: string,
    context?: Record<string, any>,
    additionalData?: Partial<EnhancedLogEntry>
  ): EnhancedLogEntry {
    const timestamp = new Date().toISOString();
    const sanitizedContext = context ? this.sanitizeLogData(context) : undefined;

    return {
      level,
      priority: LogLevel[level],
      message: this.config.sanitizeData ? sanitizeInput(message) : message,
      context: sanitizedContext,
      timestamp,
      memoryUsage: this.config.performanceMonitoring ? process.memoryUsage() : undefined,
      ...additionalData,
    };
  }

  /**
   * Writes log entry to console
   */
  private writeToConsole(entry: EnhancedLogEntry): void {
    if (!this.config.enableConsole) {
      return;
    }

    const timestamp = entry.timestamp;
    const level = entry.level.toUpperCase().padEnd(5);
    const service = entry.service ? `[${entry.service}]` : '';
    const operation = entry.operation ? `[${entry.operation}]` : '';
    const duration = entry.duration ? `(${entry.duration}ms)` : '';
    
    const logMessage = `${timestamp} ${level} ${service} ${operation} ${entry.message} ${duration}`;
    
    switch (entry.level) {
      case 'ERROR':
        console.error(logMessage, entry.context);
        if (this.config.includeStackTrace && entry.context?.error) {
          console.error('Stack trace:', entry.context.error.stack);
        }
        break;
      case 'WARN':
        console.warn(logMessage, entry.context);
        break;
      case 'DEBUG':
        console.debug(logMessage, entry.context);
        break;
      default:
        console.log(logMessage, entry.context);
    }
  }

  /**
   * Writes log entry to file (placeholder for file logging implementation)
   */
  private async writeToFile(entry: EnhancedLogEntry): Promise<void> {
    if (!this.config.enableFile) {
      return;
    }

    // TODO: Implement file logging with rotation
    // This would typically use a library like winston or pino
    console.log('File logging not implemented yet');
  }

  /**
   * Sends log entry to remote service (placeholder for remote logging)
   */
  private async writeToRemote(entry: EnhancedLogEntry): Promise<void> {
    if (!this.config.enableRemote || !this.config.remoteEndpoint) {
      return;
    }

    try {
      // TODO: Implement remote logging
      // This would typically send logs to services like DataDog, LogRocket, etc.
      console.log('Remote logging not implemented yet');
    } catch (error) {
      console.error('Failed to send log to remote service:', error);
    }
  }

  /**
   * Writes log entry to all configured outputs
   */
  private async writeLog(entry: EnhancedLogEntry): Promise<void> {
    // Check if log level meets minimum threshold
    if (entry.priority < this.config.minLevel) {
      return;
    }

    // Write to all configured outputs
    this.writeToConsole(entry);
    await this.writeToFile(entry);
    await this.writeToRemote(entry);
  }

  /**
   * Logs debug information
   */
  debug(message: string, context?: Record<string, any>, additionalData?: Partial<EnhancedLogEntry>): void {
    const entry = this.createLogEntry('DEBUG', message, context, additionalData);
    this.writeLog(entry);
  }

  /**
   * Logs informational messages
   */
  info(message: string, context?: Record<string, any>, additionalData?: Partial<EnhancedLogEntry>): void {
    const entry = this.createLogEntry('INFO', message, context, additionalData);
    this.writeLog(entry);
  }

  /**
   * Logs warning messages
   */
  warn(message: string, context?: Record<string, any>, additionalData?: Partial<EnhancedLogEntry>): void {
    const entry = this.createLogEntry('WARN', message, context, additionalData);
    this.writeLog(entry);
  }

  /**
   * Logs error messages
   */
  error(message: string, context?: Record<string, any>, additionalData?: Partial<EnhancedLogEntry>): void {
    const entry = this.createLogEntry('ERROR', message, context, additionalData);
    this.writeLog(entry);
  }

  /**
   * Starts performance monitoring for an operation
   */
  startPerformanceMonitoring(operation: string): string {
    if (!this.config.performanceMonitoring) {
      return '';
    }

    const operationId = `${operation}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const metric: PerformanceMetric = {
      operation,
      startTime: Date.now(),
      memoryBefore: process.memoryUsage(),
    };

    this.performanceMetrics.set(operationId, metric);
    return operationId;
  }

  /**
   * Ends performance monitoring and logs the results
   */
  endPerformanceMonitoring(operationId: string, success: boolean = true, error?: string): void {
    if (!this.config.performanceMonitoring || !operationId) {
      return;
    }

    const metric = this.performanceMetrics.get(operationId);
    if (!metric) {
      this.warn('Performance monitoring ended for unknown operation', { operationId });
      return;
    }

    const endTime = Date.now();
    const duration = endTime - metric.startTime;
    const memoryAfter = process.memoryUsage();

    metric.endTime = endTime;
    metric.duration = duration;
    metric.memoryAfter = memoryAfter;
    metric.success = success;
    metric.error = error;

    // Log performance metrics
    const context = {
      operation: metric.operation,
      duration,
      memoryBefore: metric.memoryBefore,
      memoryAfter,
      memoryDelta: {
        rss: memoryAfter.rss - (metric.memoryBefore?.rss || 0),
        heapUsed: memoryAfter.heapUsed - (metric.memoryBefore?.heapUsed || 0),
        heapTotal: memoryAfter.heapTotal - (metric.memoryBefore?.heapTotal || 0),
        external: memoryAfter.external - (metric.memoryBefore?.external || 0),
      },
      success,
    };

    if (success) {
      this.info(`Performance monitoring completed: ${metric.operation}`, context, {
        service: 'performance',
        operation: metric.operation,
        duration,
      });
    } else {
      this.error(`Performance monitoring failed: ${metric.operation}`, { ...context, error }, {
        service: 'performance',
        operation: metric.operation,
        duration,
      });
    }

    // Clean up
    this.performanceMetrics.delete(operationId);
  }

  /**
   * Increments a request counter
   */
  incrementCounter(counterName: string, increment: number = 1): void {
    const current = this.requestCounters.get(counterName) || 0;
    this.requestCounters.set(counterName, current + increment);
  }

  /**
   * Gets current counter value
   */
  getCounter(counterName: string): number {
    return this.requestCounters.get(counterName) || 0;
  }

  /**
   * Resets a counter
   */
  resetCounter(counterName: string): void {
    this.requestCounters.delete(counterName);
  }

  /**
   * Logs API request
   */
  logApiRequest(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    context?: Record<string, any>
  ): void {
    const level = statusCode >= 400 ? 'ERROR' : statusCode >= 300 ? 'WARN' : 'INFO';
    const message = `API ${method} ${path} - ${statusCode}`;
    
    this[level.toLowerCase() as keyof this](message, {
      method,
      path,
      statusCode,
      duration,
      ...context,
    }, {
      service: 'api',
      operation: `${method} ${path}`,
      duration,
    });
  }

  /**
   * Logs database operation
   */
  logDatabaseOperation(
    operation: string,
    table: string,
    duration: number,
    success: boolean,
    context?: Record<string, any>
  ): void {
    const level = success ? 'INFO' : 'ERROR';
    const message = `Database ${operation} on ${table}`;
    
    this[level.toLowerCase() as keyof this](message, {
      operation,
      table,
      duration,
      success,
      ...context,
    }, {
      service: 'database',
      operation: `${operation} ${table}`,
      duration,
    });
  }

  /**
   * Logs email operation
   */
  logEmailOperation(
    operation: string,
    to: string,
    success: boolean,
    duration?: number,
    context?: Record<string, any>
  ): void {
    const level = success ? 'INFO' : 'ERROR';
    const message = `Email ${operation} to ${to}`;
    
    this[level.toLowerCase() as keyof this](message, {
      operation,
      to,
      success,
      duration,
      ...context,
    }, {
      service: 'email',
      operation,
      duration,
    });
  }

  /**
   * Gets current configuration
   */
  getConfig(): LoggingConfig {
    return { ...this.config };
  }

  /**
   * Updates configuration
   */
  updateConfig(newConfig: Partial<LoggingConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Export singleton instance
export const logger = new LoggingService();

// Export default
export default LoggingService;
