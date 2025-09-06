/**
 * Enhanced Email Service
 * 
 * This module provides a robust email service with retry mechanisms,
 * spam prevention, rate limiting, and comprehensive error handling.
 * 
 * Addresses code review feedback from PR #37 about implementing retry
 * mechanisms for email sending and preventing email spam.
 */

import { Resend } from 'resend';
import { 
  EmailConfig, 
  EmailResult, 
  RetryConfig, 
  ApiErrorType, 
  ApiError,
  LogEntry,
  AuditLogEntry 
} from './api-types';
import { sanitizeInput } from './config-validation';

// Default retry configuration
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  backoffMultiplier: 2,
  retryableErrors: [
    'network_error',
    'timeout',
    'rate_limit',
    'service_unavailable',
    'temporary_failure'
  ]
};

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxEmailsPerHour: 50,
  maxEmailsPerDay: 200,
  windowMs: 60 * 60 * 1000, // 1 hour
};

// Email tracking for spam prevention
interface EmailTracking {
  recipient: string;
  lastSent: Date;
  count: number;
  windowStart: Date;
}

class EmailService {
  private resend: Resend;
  private retryConfig: RetryConfig;
  private emailTracking: Map<string, EmailTracking> = new Map();
  private logs: LogEntry[] = [];
  private auditLogs: AuditLogEntry[] = [];

  constructor(apiKey: string, retryConfig?: Partial<RetryConfig>) {
    this.resend = new Resend(apiKey);
    this.retryConfig = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
  }

  /**
   * Sends an email with retry mechanism and spam prevention
   */
  async sendEmail(config: EmailConfig, requestId?: string): Promise<EmailResult> {
    const startTime = Date.now();
    let retryCount = 0;
    let lastError: Error | null = null;

    // Validate email configuration
    const validation = this.validateEmailConfig(config);
    if (!validation.isValid) {
      return {
        success: false,
        error: `Invalid email configuration: ${validation.errors.join(', ')}`,
        retryCount: 0
      };
    }

    // Check rate limits and spam prevention
    const rateLimitCheck = this.checkRateLimit(config.to[0]);
    if (!rateLimitCheck.allowed) {
      this.audit('email_rate_limited', false, {
        recipient: config.to[0],
        reason: rateLimitCheck.reason,
        requestId
      });
      
      return {
        success: false,
        error: `Rate limit exceeded: ${rateLimitCheck.reason}`,
        retryCount: 0
      };
    }

    // Sanitize email content
    const sanitizedConfig = this.sanitizeEmailConfig(config);

    // Retry loop with exponential backoff
    while (retryCount <= this.retryConfig.maxRetries) {
      try {
        this.log('info', `Attempting to send email (attempt ${retryCount + 1})`, {
          to: sanitizedConfig.to,
          subject: sanitizedConfig.subject,
          requestId
        });

        const result = await this.resend.emails.send(sanitizedConfig);
        
        if (result.error) {
          throw new Error(result.error.message || 'Email sending failed');
        }

        // Update tracking for spam prevention
        this.updateEmailTracking(config.to[0]);

        // Log successful send
        this.audit('email_sent', true, {
          recipient: config.to[0],
          messageId: result.data?.id,
          retryCount,
          duration: Date.now() - startTime,
          requestId
        });

        this.log('info', 'Email sent successfully', {
          messageId: result.data?.id,
          recipient: config.to[0],
          retryCount,
          duration: Date.now() - startTime,
          requestId
        });

        return {
          success: true,
          messageId: result.data?.id,
          retryCount
        };

      } catch (error) {
        lastError = error as Error;
        retryCount++;

        // Check if error is retryable
        if (!this.isRetryableError(error as Error) || retryCount > this.retryConfig.maxRetries) {
          break;
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          this.retryConfig.baseDelay * Math.pow(this.retryConfig.backoffMultiplier, retryCount - 1),
          this.retryConfig.maxDelay
        );

        this.log('warn', `Email send failed, retrying in ${delay}ms`, {
          error: lastError.message,
          retryCount,
          delay,
          requestId
        });

        // Wait before retry
        await this.sleep(delay);
      }
    }

    // All retries failed
    const finalError = lastError || new Error('Unknown error');
    
    this.audit('email_failed', false, {
      recipient: config.to[0],
      error: finalError.message,
      retryCount,
      duration: Date.now() - startTime,
      requestId
    });

    this.log('error', 'Email sending failed after all retries', {
      error: finalError.message,
      retryCount,
      duration: Date.now() - startTime,
      requestId
    });

    return {
      success: false,
      error: finalError.message,
      retryCount
    };
  }

  /**
   * Validates email configuration
   */
  private validateEmailConfig(config: EmailConfig): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.from || !config.from.trim()) {
      errors.push('From address is required');
    } else if (!this.isValidEmail(config.from)) {
      errors.push('Invalid from address format');
    }

    if (!config.to || config.to.length === 0) {
      errors.push('To address is required');
    } else {
      config.to.forEach((email, index) => {
        if (!this.isValidEmail(email)) {
          errors.push(`Invalid to address at index ${index}: ${email}`);
        }
      });
    }

    if (!config.subject || !config.subject.trim()) {
      errors.push('Subject is required');
    }

    if (!config.html && !config.text) {
      errors.push('Email content (html or text) is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Sanitizes email configuration to prevent injection attacks
   */
  private sanitizeEmailConfig(config: EmailConfig): EmailConfig {
    return {
      from: sanitizeInput(config.from, 'email'),
      to: config.to.map(email => sanitizeInput(email, 'email')),
      subject: sanitizeInput(config.subject, 'text'),
      html: config.html ? sanitizeInput(config.html, 'html') : undefined,
      text: config.text ? sanitizeInput(config.text, 'text') : undefined,
    };
  }

  /**
   * Validates email address format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Checks rate limits and spam prevention
   */
  private checkRateLimit(recipient: string): { allowed: boolean; reason?: string } {
    const now = new Date();
    const tracking = this.emailTracking.get(recipient);

    if (!tracking) {
      return { allowed: true };
    }

    // Check hourly limit
    const hourAgo = new Date(now.getTime() - RATE_LIMIT_CONFIG.windowMs);
    if (tracking.lastSent > hourAgo && tracking.count >= RATE_LIMIT_CONFIG.maxEmailsPerHour) {
      return { 
        allowed: false, 
        reason: `Hourly limit exceeded (${RATE_LIMIT_CONFIG.maxEmailsPerHour} emails per hour)` 
      };
    }

    // Check daily limit
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    if (tracking.lastSent > dayAgo && tracking.count >= RATE_LIMIT_CONFIG.maxEmailsPerDay) {
      return { 
        allowed: false, 
        reason: `Daily limit exceeded (${RATE_LIMIT_CONFIG.maxEmailsPerDay} emails per day)` 
      };
    }

    // Check for rapid successive emails (spam prevention)
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    if (tracking.lastSent > fiveMinutesAgo) {
      return { 
        allowed: false, 
        reason: 'Too many emails sent to this recipient recently (spam prevention)' 
      };
    }

    return { allowed: true };
  }

  /**
   * Updates email tracking for spam prevention
   */
  private updateEmailTracking(recipient: string): void {
    const now = new Date();
    const tracking = this.emailTracking.get(recipient);

    if (tracking) {
      // Reset count if window has passed
      const hourAgo = new Date(now.getTime() - RATE_LIMIT_CONFIG.windowMs);
      if (tracking.windowStart < hourAgo) {
        tracking.count = 1;
        tracking.windowStart = now;
      } else {
        tracking.count++;
      }
      tracking.lastSent = now;
    } else {
      this.emailTracking.set(recipient, {
        recipient,
        lastSent: now,
        count: 1,
        windowStart: now
      });
    }
  }

  /**
   * Checks if an error is retryable
   */
  private isRetryableError(error: Error): boolean {
    const errorMessage = error.message.toLowerCase();
    
    return this.retryConfig.retryableErrors.some(retryableError => 
      errorMessage.includes(retryableError.toLowerCase())
    );
  }

  /**
   * Sleep utility for delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Logs a message
   */
  private log(level: LogEntry['level'], message: string, context?: Record<string, any>): void {
    const entry: LogEntry = {
      level,
      message,
      context,
      timestamp: new Date().toISOString()
    };
    
    this.logs.push(entry);
    
    // Also log to console for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[EMAIL-SERVICE] ${level.toUpperCase()}: ${message}`, context || '');
    }
  }

  /**
   * Creates an audit log entry
   */
  private audit(action: string, success: boolean, metadata?: Record<string, any>): void {
    const entry: AuditLogEntry = {
      action,
      success,
      metadata,
      timestamp: new Date().toISOString()
    };
    
    this.auditLogs.push(entry);
  }

  /**
   * Gets rate limit status for a recipient
   */
  getRateLimitStatus(recipient: string): {
    emailsSent: number;
    limit: number;
    resetTime: Date;
    canSend: boolean;
  } {
    const tracking = this.emailTracking.get(recipient);
    const now = new Date();
    
    if (!tracking) {
      return {
        emailsSent: 0,
        limit: RATE_LIMIT_CONFIG.maxEmailsPerHour,
        resetTime: new Date(now.getTime() + RATE_LIMIT_CONFIG.windowMs),
        canSend: true
      };
    }

    const hourAgo = new Date(now.getTime() - RATE_LIMIT_CONFIG.windowMs);
    const resetTime = new Date(tracking.windowStart.getTime() + RATE_LIMIT_CONFIG.windowMs);
    
    return {
      emailsSent: tracking.count,
      limit: RATE_LIMIT_CONFIG.maxEmailsPerHour,
      resetTime,
      canSend: tracking.count < RATE_LIMIT_CONFIG.maxEmailsPerHour
    };
  }

  /**
   * Gets service logs
   */
  getLogs(filter?: Partial<LogEntry>): LogEntry[] {
    if (!filter) return [...this.logs];
    
    return this.logs.filter(entry => 
      Object.entries(filter).every(([key, value]) => 
        entry[key as keyof LogEntry] === value
      )
    );
  }

  /**
   * Gets audit logs
   */
  getAuditLogs(filter?: Partial<AuditLogEntry>): AuditLogEntry[] {
    if (!filter) return [...this.auditLogs];
    
    return this.auditLogs.filter(entry => 
      Object.entries(filter).every(([key, value]) => 
        entry[key as keyof AuditLogEntry] === value
      )
    );
  }

  /**
   * Clears logs (for testing)
   */
  clearLogs(): void {
    this.logs = [];
    this.auditLogs = [];
    this.emailTracking.clear();
  }

  /**
   * Gets service health status
   */
  getHealthStatus(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    rateLimitStatus: Record<string, any>;
    recentErrors: number;
    lastError?: string;
  } {
    const recentLogs = this.logs.filter(log => 
      new Date(log.timestamp) > new Date(Date.now() - 60 * 60 * 1000) // Last hour
    );
    
    const errorCount = recentLogs.filter(log => log.level === 'error').length;
    const lastError = recentLogs
      .filter(log => log.level === 'error')
      .pop()?.message;

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (errorCount > 10) {
      status = 'unhealthy';
    } else if (errorCount > 5) {
      status = 'degraded';
    }

    return {
      status,
      rateLimitStatus: Object.fromEntries(
        Array.from(this.emailTracking.entries()).map(([recipient, tracking]) => [
          recipient,
          this.getRateLimitStatus(recipient)
        ])
      ),
      recentErrors: errorCount,
      lastError
    };
  }
}

// Export singleton instance
export const emailService = new EmailService(
  process.env.RESEND_API_KEY || '',
  {
    maxRetries: parseInt(process.env.EMAIL_MAX_RETRIES || '3'),
    baseDelay: parseInt(process.env.EMAIL_BASE_DELAY || '1000'),
    maxDelay: parseInt(process.env.EMAIL_MAX_DELAY || '30000'),
  }
);

// Export default
export default EmailService;