/**
 * Logging Service
 * 
 * This module provides centralized logging functionality with different log levels
 * and proper formatting. It includes security considerations for sensitive data.
 */

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: string;
  metadata?: Record<string, any>;
  error?: Error;
}

export interface LoggingConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
  filePath?: string;
  maxFileSize?: number;
  maxFiles?: number;
}

/**
 * Logging service class
 */
export class LoggingService {
  private config: LoggingConfig;
  private logs: LogEntry[] = [];

  constructor(config: LoggingConfig) {
    this.config = config;
  }

  /**
   * Log error message
   */
  error(message: string, context?: string, metadata?: Record<string, any>, error?: Error): void {
    this.log(LogLevel.ERROR, message, context, metadata, error);
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context, metadata);
  }

  /**
   * Log info message
   */
  info(message: string, context?: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context, metadata);
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context, metadata);
  }

  /**
   * Log message with specified level
   */
  private log(
    level: LogLevel,
    message: string,
    context?: string,
    metadata?: Record<string, any>,
    error?: Error
  ): void {
    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
      metadata: this.sanitizeMetadata(metadata),
      error,
    };

    // Store log entry
    this.logs.push(logEntry);

    // Output to console if enabled
    if (this.config.enableConsole && this.shouldLog(level)) {
      this.outputToConsole(logEntry);
    }

    // Output to file if enabled
    if (this.config.enableFile && this.shouldLog(level)) {
      this.outputToFile(logEntry);
    }
  }

  /**
   * Check if log level should be output
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG];
    const currentLevelIndex = levels.indexOf(this.config.level);
    const messageLevelIndex = levels.indexOf(level);
    
    return messageLevelIndex <= currentLevelIndex;
  }

  /**
   * Output log entry to console
   */
  private outputToConsole(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const context = entry.context ? `[${entry.context}]` : '';
    const metadata = entry.metadata ? ` ${JSON.stringify(entry.metadata)}` : '';
    const error = entry.error ? `\nError: ${entry.error.stack}` : '';

    const logMessage = `${timestamp} ${entry.level.toUpperCase()} ${context} ${entry.message}${metadata}${error}`;

    switch (entry.level) {
      case LogLevel.ERROR:
        console.error(logMessage);
        break;
      case LogLevel.WARN:
        console.warn(logMessage);
        break;
      case LogLevel.INFO:
        console.info(logMessage);
        break;
      case LogLevel.DEBUG:
        console.debug(logMessage);
        break;
    }
  }

  /**
   * Output log entry to file
   */
  private outputToFile(entry: LogEntry): void {
    // Mock implementation for testing
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    // Real implementation would write to file
    // This would include file rotation logic
  }

  /**
   * Sanitize metadata to remove sensitive information
   */
  private sanitizeMetadata(metadata?: Record<string, any>): Record<string, any> | undefined {
    if (!metadata) {
      return undefined;
    }

    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth', 'credential'];
    const sanitized = { ...metadata };

    Object.keys(sanitized).forEach(key => {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  /**
   * Get recent logs
   */
  getLogs(limit?: number): LogEntry[] {
    return limit ? this.logs.slice(-limit) : [...this.logs];
  }

  /**
   * Clear logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }
}

/**
 * Create logging service instance
 */
export function createLoggingService(config: LoggingConfig): LoggingService {
  return new LoggingService(config);
}

/**
 * Default logging service instance
 */
export const loggingService = createLoggingService({
  level: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  enableConsole: true,
  enableFile: false,
});
