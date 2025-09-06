/**
 * Logging Service
 * 
 * Provides logging mechanisms for debugging and auditing purposes.
 */

import { LogEntry, AuditLogEntry } from './api-types';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

class LoggingService {
  private logs: LogEntry[] = [];
  private auditLogs: AuditLogEntry[] = [];

  log(level: LogLevel, message: string, context?: Record<string, any>, requestId?: string): void {
    const entry: LogEntry = {
      level: LogLevel[level].toLowerCase() as LogEntry['level'],
      message,
      context,
      timestamp: new Date().toISOString(),
      requestId
    };

    this.logs.push(entry);
    console.log(`[${entry.level.toUpperCase()}] ${message}`, context || '');
  }

  audit(action: string, success: boolean, metadata?: Record<string, any>, requestId?: string): void {
    const entry: AuditLogEntry = {
      action,
      success,
      metadata,
      timestamp: new Date().toISOString(),
      requestId
    };

    this.auditLogs.push(entry);
    this.log(success ? LogLevel.INFO : LogLevel.WARN, `Audit: ${action}`, metadata, requestId);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  getAuditLogs(): AuditLogEntry[] {
    return [...this.auditLogs];
  }

  clearLogs(): void {
    this.logs = [];
    this.auditLogs = [];
  }
}

export const loggingService = new LoggingService();
export default LoggingService;