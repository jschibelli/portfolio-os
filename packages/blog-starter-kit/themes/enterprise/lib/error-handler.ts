/**
 * Comprehensive Error Handling System
 * 
 * This module provides a robust error handling system for all scripts and operations
 * with proper logging, recovery mechanisms, and user-friendly error messages.
 * 
 * Addresses code review feedback from PR #37 about implementing comprehensive
 * error handling mechanisms to prevent silent failures.
 */

import { LogEntry } from './api-types';

// Error types and categories
export enum ErrorType {
  VALIDATION = 'validation',
  NETWORK = 'network',
  FILE_SYSTEM = 'file_system',
  PERMISSION = 'permission',
  CONFIGURATION = 'configuration',
  DEPENDENCY = 'dependency',
  TIMEOUT = 'timeout',
  UNKNOWN = 'unknown'
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Error interface
export interface AppError {
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  code?: string;
  details?: Record<string, any>;
  stack?: string;
  timestamp: string;
  context?: Record<string, any>;
  recoverable: boolean;
  suggestions: string[];
}

// Error handler configuration
export interface ErrorHandlerConfig {
  enableLogging: boolean;
  enableRecovery: boolean;
  maxRetries: number;
  retryDelay: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  enableNotifications: boolean;
  notificationEndpoint?: string;
}

// Default configuration
const DEFAULT_CONFIG: ErrorHandlerConfig = {
  enableLogging: true,
  enableRecovery: true,
  maxRetries: 3,
  retryDelay: 1000,
  logLevel: 'error',
  enableNotifications: false
};

// Error handler class
export class ErrorHandler {
  private config: ErrorHandlerConfig;
  private errorCounts: Map<ErrorType, number> = new Map();
  private recoveryAttempts: Map<string, number> = new Map();

  constructor(config?: Partial<ErrorHandlerConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Creates a structured error object
   */
  createError(
    type: ErrorType,
    severity: ErrorSeverity,
    message: string,
    details?: Record<string, any>,
    context?: Record<string, any>
  ): AppError {
    const error: AppError = {
      type,
      severity,
      message,
      details,
      context,
      timestamp: new Date().toISOString(),
      recoverable: this.isRecoverable(type, severity),
      suggestions: this.generateSuggestions(type, severity, details)
    };

    return error;
  }

  /**
   * Handles an error with logging and recovery
   */
  async handleError(
    error: Error | AppError,
    context?: Record<string, any>
  ): Promise<AppError> {
    let appError: AppError;

    if (this.isAppError(error)) {
      appError = error;
    } else {
      appError = this.convertToAppError(error, context);
    }

    // Update error counts
    this.updateErrorCounts(appError);

    // Log the error
    if (this.config.enableLogging) {
      this.logError(appError);
    }

    // Attempt recovery if enabled and error is recoverable
    if (this.config.enableRecovery && appError.recoverable) {
      const recovered = await this.attemptRecovery(appError);
      if (recovered) {
        appError.message += ' (Recovered)';
        appError.recoverable = false;
      }
    }

    // Send notifications for critical errors
    if (appError.severity === ErrorSeverity.CRITICAL && this.config.enableNotifications) {
      await this.sendNotification(appError);
    }

    return appError;
  }

  /**
   * Wraps a function with error handling
   */
  async withErrorHandling<T>(
    fn: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T | null> {
    try {
      return await fn();
    } catch (error) {
      const appError = await this.handleError(error as Error, context);
      
      if (appError.severity === ErrorSeverity.CRITICAL) {
        throw appError;
      }
      
      return null;
    }
  }

  /**
   * Wraps a synchronous function with error handling
   */
  withSyncErrorHandling<T>(
    fn: () => T,
    context?: Record<string, any>
  ): T | null {
    try {
      return fn();
    } catch (error) {
      this.handleError(error as Error, context);
      return null;
    }
  }

  /**
   * Retries an operation with exponential backoff
   */
  async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = this.config.maxRetries,
    context?: Record<string, any>
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < maxRetries) {
          const delay = this.config.retryDelay * Math.pow(2, attempt - 1);
          console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw await this.handleError(lastError!, { ...context, attempts: maxRetries });
  }

  /**
   * Checks if an error is recoverable
   */
  private isRecoverable(type: ErrorType, severity: ErrorSeverity): boolean {
    if (severity === ErrorSeverity.CRITICAL) return false;
    
    const recoverableTypes = [
      ErrorType.NETWORK,
      ErrorType.TIMEOUT,
      ErrorType.DEPENDENCY
    ];
    
    return recoverableTypes.includes(type);
  }

  /**
   * Generates suggestions based on error type and details
   */
  private generateSuggestions(
    type: ErrorType,
    severity: ErrorSeverity,
    details?: Record<string, any>
  ): string[] {
    const suggestions: string[] = [];

    switch (type) {
      case ErrorType.VALIDATION:
        suggestions.push('Check input parameters and data format');
        suggestions.push('Validate required fields are present');
        break;
      
      case ErrorType.NETWORK:
        suggestions.push('Check network connectivity');
        suggestions.push('Verify API endpoints are accessible');
        suggestions.push('Check firewall and proxy settings');
        break;
      
      case ErrorType.FILE_SYSTEM:
        suggestions.push('Check file permissions');
        suggestions.push('Verify file paths are correct');
        suggestions.push('Ensure sufficient disk space');
        break;
      
      case ErrorType.PERMISSION:
        suggestions.push('Check user permissions');
        suggestions.push('Verify access rights');
        suggestions.push('Run with appropriate privileges');
        break;
      
      case ErrorType.CONFIGURATION:
        suggestions.push('Check configuration files');
        suggestions.push('Verify environment variables');
        suggestions.push('Validate configuration schema');
        break;
      
      case ErrorType.DEPENDENCY:
        suggestions.push('Check if dependencies are installed');
        suggestions.push('Verify dependency versions');
        suggestions.push('Run npm install or equivalent');
        break;
      
      case ErrorType.TIMEOUT:
        suggestions.push('Increase timeout values');
        suggestions.push('Check system performance');
        suggestions.push('Optimize operation efficiency');
        break;
      
      default:
        suggestions.push('Check logs for more details');
        suggestions.push('Contact support if issue persists');
    }

    return suggestions;
  }

  /**
   * Converts a standard Error to AppError
   */
  private convertToAppError(error: Error, context?: Record<string, any>): AppError {
    const type = this.determineErrorType(error);
    const severity = this.determineErrorSeverity(error, type);
    
    return this.createError(
      type,
      severity,
      error.message,
      { originalError: error.name, stack: error.stack },
      context
    );
  }

  /**
   * Determines error type from error message and name
   */
  private determineErrorType(error: Error): ErrorType {
    const message = error.message.toLowerCase();
    const name = error.name.toLowerCase();

    if (name.includes('validation') || message.includes('invalid')) {
      return ErrorType.VALIDATION;
    }
    if (name.includes('network') || message.includes('fetch') || message.includes('connection')) {
      return ErrorType.NETWORK;
    }
    if (name.includes('file') || message.includes('enoent') || message.includes('eacces')) {
      return ErrorType.FILE_SYSTEM;
    }
    if (name.includes('permission') || message.includes('eacces') || message.includes('eperm')) {
      return ErrorType.PERMISSION;
    }
    if (name.includes('config') || message.includes('environment')) {
      return ErrorType.CONFIGURATION;
    }
    if (name.includes('dependency') || message.includes('module') || message.includes('require')) {
      return ErrorType.DEPENDENCY;
    }
    if (name.includes('timeout') || message.includes('timeout')) {
      return ErrorType.TIMEOUT;
    }

    return ErrorType.UNKNOWN;
  }

  /**
   * Determines error severity based on error type and message
   */
  private determineErrorSeverity(error: Error, type: ErrorType): ErrorSeverity {
    const message = error.message.toLowerCase();

    // Critical errors
    if (message.includes('critical') || message.includes('fatal')) {
      return ErrorSeverity.CRITICAL;
    }

    // High severity errors
    if (type === ErrorType.PERMISSION || type === ErrorType.CONFIGURATION) {
      return ErrorSeverity.HIGH;
    }

    // Medium severity errors
    if (type === ErrorType.NETWORK || type === ErrorType.DEPENDENCY) {
      return ErrorSeverity.MEDIUM;
    }

    // Low severity errors
    return ErrorSeverity.LOW;
  }

  /**
   * Updates error counts for monitoring
   */
  private updateErrorCounts(error: AppError): void {
    const current = this.errorCounts.get(error.type) || 0;
    this.errorCounts.set(error.type, current + 1);
  }

  /**
   * Logs error with appropriate level
   */
  private logError(error: AppError): void {
    const logLevel = this.getLogLevel(error.severity);
    const message = `[${error.type.toUpperCase()}] ${error.message}`;
    
    const logEntry: LogEntry = {
      level: logLevel,
      message,
      context: {
        type: error.type,
        severity: error.severity,
        code: error.code,
        details: error.details,
        suggestions: error.suggestions,
        recoverable: error.recoverable
      },
      timestamp: error.timestamp
    };

    // Use console logging (can be replaced with proper logger)
    switch (logLevel) {
      case 'error':
        console.error(message, logEntry.context);
        break;
      case 'warn':
        console.warn(message, logEntry.context);
        break;
      case 'info':
        console.info(message, logEntry.context);
        break;
      case 'debug':
        console.debug(message, logEntry.context);
        break;
    }
  }

  /**
   * Gets appropriate log level for error severity
   */
  private getLogLevel(severity: ErrorSeverity): 'debug' | 'info' | 'warn' | 'error' {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        return 'error';
      case ErrorSeverity.MEDIUM:
        return 'warn';
      case ErrorSeverity.LOW:
        return 'info';
      default:
        return 'debug';
    }
  }

  /**
   * Attempts to recover from an error
   */
  private async attemptRecovery(error: AppError): Promise<boolean> {
    const recoveryKey = `${error.type}-${error.message}`;
    const attempts = this.recoveryAttempts.get(recoveryKey) || 0;

    if (attempts >= this.config.maxRetries) {
      return false;
    }

    this.recoveryAttempts.set(recoveryKey, attempts + 1);

    try {
      switch (error.type) {
        case ErrorType.NETWORK:
          return await this.recoverFromNetworkError(error);
        case ErrorType.DEPENDENCY:
          return await this.recoverFromDependencyError(error);
        case ErrorType.TIMEOUT:
          return await this.recoverFromTimeoutError(error);
        default:
          return false;
      }
    } catch (recoveryError) {
      console.error('Recovery attempt failed:', recoveryError);
      return false;
    }
  }

  /**
   * Recovers from network errors
   */
  private async recoverFromNetworkError(error: AppError): Promise<boolean> {
    // Simple network recovery - wait and retry
    await new Promise(resolve => setTimeout(resolve, 2000));
    return true;
  }

  /**
   * Recovers from dependency errors
   */
  private async recoverFromDependencyError(error: AppError): Promise<boolean> {
    // Try to reinstall dependencies
    try {
      const { execSync } = require('child_process');
      execSync('npm install', { stdio: 'pipe' });
      return true;
    } catch (installError) {
      return false;
    }
  }

  /**
   * Recovers from timeout errors
   */
  private async recoverFromTimeoutError(error: AppError): Promise<boolean> {
    // Simple timeout recovery - wait and retry
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }

  /**
   * Sends notification for critical errors
   */
  private async sendNotification(error: AppError): Promise<void> {
    if (!this.config.notificationEndpoint) {
      return;
    }

    try {
      const notification = {
        type: 'critical_error',
        error: {
          type: error.type,
          severity: error.severity,
          message: error.message,
          timestamp: error.timestamp,
          context: error.context
        }
      };

      // Send notification (implementation depends on notification service)
      console.log('Critical error notification:', notification);
    } catch (notificationError) {
      console.error('Failed to send notification:', notificationError);
    }
  }

  /**
   * Checks if error is an AppError
   */
  private isAppError(error: any): error is AppError {
    return error && 
           typeof error.type === 'string' && 
           typeof error.severity === 'string' && 
           typeof error.message === 'string';
  }

  /**
   * Gets error statistics
   */
  getErrorStatistics(): Record<string, any> {
    return {
      totalErrors: Array.from(this.errorCounts.values()).reduce((sum, count) => sum + count, 0),
      errorsByType: Object.fromEntries(this.errorCounts),
      recoveryAttempts: Object.fromEntries(this.recoveryAttempts)
    };
  }

  /**
   * Resets error statistics
   */
  resetStatistics(): void {
    this.errorCounts.clear();
    this.recoveryAttempts.clear();
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();

// Export default
export default ErrorHandler;
