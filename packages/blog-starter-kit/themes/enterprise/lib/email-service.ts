/**
 * Enhanced Email Service
 * 
 * This module provides a robust email service with retry mechanisms,
 * input sanitization, and comprehensive error handling.
 * 
 * Addresses code review feedback from PR #37:
 * - Retry mechanism for email sending
 * - Input sanitization to prevent injection attacks
 * - Proper logging mechanisms for debugging and auditing
 * - Enhanced error handling for email operations
 */

import { Resend } from 'resend';
import { 
  EmailRequest, 
  EmailResponse, 
  RetryConfig, 
  LogEntry,
  ApiError 
} from './api-types';
import { sanitizeInput, getSafeConfigValue } from './config-validation';
import { SITE_CONFIG } from '../config/constants';

// Default retry configuration
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  delay: 1000, // 1 second
  backoffMultiplier: 2,
  maxDelay: 10000, // 10 seconds
};

// Email service class
export class EmailService {
  private resend: Resend;
  private retryConfig: RetryConfig;

  constructor(apiKey?: string, retryConfig?: Partial<RetryConfig>) {
    this.resend = new Resend(apiKey || process.env.RESEND_API_KEY);
    this.retryConfig = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
  }

  /**
   * Validates email address format
   */
  validateEmailAddress(email: string): boolean {
    if (!email || typeof email !== 'string') {
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Sanitizes email content to prevent injection attacks
   */
  private sanitizeEmailContent(content: string): string {
    return sanitizeInput(content)
      .replace(/javascript:/gi, '')
      .replace(/data:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/onload=/gi, '')
      .replace(/onerror=/gi, '');
  }

  /**
   * Sanitizes email request data
   */
  private sanitizeEmailRequest(request: EmailRequest): EmailRequest {
    return {
      ...request,
      to: Array.isArray(request.to) 
        ? request.to.map(email => sanitizeInput(email))
        : sanitizeInput(request.to),
      subject: this.sanitizeEmailContent(request.subject),
      html: this.sanitizeEmailContent(request.html),
      text: request.text ? this.sanitizeEmailContent(request.text) : undefined,
      from: request.from ? sanitizeInput(request.from) : undefined,
      replyTo: request.replyTo ? sanitizeInput(request.replyTo) : undefined,
      cc: request.cc ? request.cc.map(email => sanitizeInput(email)) : undefined,
      bcc: request.bcc ? request.bcc.map(email => sanitizeInput(email)) : undefined,
    };
  }

  /**
   * Logs email operations for debugging and auditing
   */
  private logOperation(entry: LogEntry): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${entry.level.toUpperCase()}] ${entry.message}`;
    
    switch (entry.level) {
      case 'error':
        console.error(logMessage, entry.context);
        break;
      case 'warn':
        console.warn(logMessage, entry.context);
        break;
      case 'debug':
        console.debug(logMessage, entry.context);
        break;
      default:
        console.log(logMessage, entry.context);
    }
  }

  /**
   * Sends email with basic error handling
   */
  async sendEmail(request: EmailRequest): Promise<EmailResponse> {
    const requestId = `email-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    
    try {
      // Validate and sanitize request
      if (!this.validateEmailAddress(Array.isArray(request.to) ? request.to[0] : request.to)) {
        throw new Error('Invalid email address');
      }

      const sanitizedRequest = this.sanitizeEmailRequest(request);
      
      // Set default from address if not provided
      const fromAddress = getSafeConfigValue(
        sanitizedRequest.from,
        `John Schibelli <${SITE_CONFIG.EMAIL.CONTACT}>`,
        'email from address'
      );

      this.logOperation({
        level: 'info',
        message: 'Sending email',
        context: {
          requestId,
          to: sanitizedRequest.to,
          subject: sanitizedRequest.subject,
          from: fromAddress,
        },
        timestamp: new Date().toISOString(),
        requestId,
      });

      const result = await this.resend.emails.send({
        from: fromAddress,
        to: sanitizedRequest.to,
        subject: sanitizedRequest.subject,
        html: sanitizedRequest.html,
        text: sanitizedRequest.text,
        replyTo: sanitizedRequest.replyTo,
        cc: sanitizedRequest.cc,
        bcc: sanitizedRequest.bcc,
        attachments: sanitizedRequest.attachments,
      });

      this.logOperation({
        level: 'info',
        message: 'Email sent successfully',
        context: {
          requestId,
          messageId: result.data?.id,
        },
        timestamp: new Date().toISOString(),
        requestId,
      });

      return {
        messageId: result.data?.id || 'unknown',
        success: true,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      this.logOperation({
        level: 'error',
        message: 'Email sending failed',
        context: {
          requestId,
          error: errorMessage,
          request: {
            to: request.to,
            subject: request.subject,
          },
        },
        timestamp: new Date().toISOString(),
        requestId,
      });

      return {
        messageId: '',
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Sends email with retry mechanism
   */
  async sendWithRetry(
    request: EmailRequest, 
    config?: Partial<RetryConfig>
  ): Promise<EmailResponse> {
    const retryConfig = { ...this.retryConfig, ...config };
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= retryConfig.maxAttempts; attempt++) {
      try {
        const result = await this.sendEmail(request);
        
        if (result.success) {
          if (attempt > 1) {
            this.logOperation({
              level: 'info',
              message: `Email sent successfully on attempt ${attempt}`,
              context: {
                attempt,
                maxAttempts: retryConfig.maxAttempts,
                messageId: result.messageId,
              },
              timestamp: new Date().toISOString(),
            });
          }
          return result;
        }

        // If not successful, treat as error for retry logic
        lastError = new Error(result.error || 'Email sending failed');
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
      }

      // Don't wait after the last attempt
      if (attempt < retryConfig.maxAttempts) {
        const delay = Math.min(
          retryConfig.delay * Math.pow(retryConfig.backoffMultiplier, attempt - 1),
          retryConfig.maxDelay
        );

        this.logOperation({
          level: 'warn',
          message: `Email sending failed, retrying in ${delay}ms (attempt ${attempt}/${retryConfig.maxAttempts})`,
          context: {
            attempt,
            maxAttempts: retryConfig.maxAttempts,
            delay,
            error: lastError.message,
          },
          timestamp: new Date().toISOString(),
        });

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // All attempts failed
    this.logOperation({
      level: 'error',
      message: `Email sending failed after ${retryConfig.maxAttempts} attempts`,
      context: {
        maxAttempts: retryConfig.maxAttempts,
        finalError: lastError?.message,
      },
      timestamp: new Date().toISOString(),
    });

    return {
      messageId: '',
      success: false,
      error: lastError?.message || 'Email sending failed after all retry attempts',
    };
  }

  /**
   * Sends confirmation email for meeting bookings
   */
  async sendConfirmationEmail(
    email: string,
    name: string,
    date: string,
    time: string,
    meetLink?: string,
    calendarLink?: string
  ): Promise<EmailResponse> {
    if (!this.validateEmailAddress(email)) {
      return {
        messageId: '',
        success: false,
        error: `Invalid email address: ${email}`,
      };
    }

    const sanitizedName = sanitizeInput(name);
    const sanitizedDate = sanitizeInput(date);
    const sanitizedTime = sanitizeInput(time);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Meeting Confirmed!</h2>
        <p>Hi ${sanitizedName},</p>
        <p>Your meeting has been scheduled for:</p>
        <ul>
          <li><strong>Date:</strong> ${sanitizedDate}</li>
          <li><strong>Time:</strong> ${sanitizedTime}</li>
        </ul>
        ${meetLink ? `<p><strong>Meeting Link:</strong> <a href="${sanitizeInput(meetLink)}">Join Meeting</a></p>` : ''}
        ${calendarLink ? `<p><strong>Calendar Link:</strong> <a href="${sanitizeInput(calendarLink)}">Add to Calendar</a></p>` : ''}
        <p>If you need to reschedule or have any questions, please don't hesitate to reach out.</p>
        <p>Best regards,<br>John Schibelli</p>
      </div>
    `;

    const text = `
      Meeting Confirmed!
      
      Hi ${sanitizedName},
      
      Your meeting has been scheduled for:
      - Date: ${sanitizedDate}
      - Time: ${sanitizedTime}
      
      ${meetLink ? `Meeting Link: ${meetLink}` : ''}
      ${calendarLink ? `Calendar Link: ${calendarLink}` : ''}
      
      If you need to reschedule or have any questions, please don't hesitate to reach out.
      
      Best regards,
      John Schibelli
    `;

    return this.sendWithRetry({
      to: email,
      subject: 'Meeting Confirmed - John Schibelli',
      html,
      text,
    });
  }

  /**
   * Sends contact form notification
   */
  async sendContactNotification(
    contactData: {
      name: string;
      email: string;
      subject: string;
      message: string;
      phone?: string;
      company?: string;
    }
  ): Promise<EmailResponse> {
    const sanitizedData = {
      name: sanitizeInput(contactData.name),
      email: sanitizeInput(contactData.email),
      subject: sanitizeInput(contactData.subject),
      message: sanitizeInput(contactData.message),
      phone: contactData.phone ? sanitizeInput(contactData.phone) : undefined,
      company: contactData.company ? sanitizeInput(contactData.company) : undefined,
    };

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${sanitizedData.name}</p>
        <p><strong>Email:</strong> ${sanitizedData.email}</p>
        <p><strong>Subject:</strong> ${sanitizedData.subject}</p>
        ${sanitizedData.phone ? `<p><strong>Phone:</strong> ${sanitizedData.phone}</p>` : ''}
        ${sanitizedData.company ? `<p><strong>Company:</strong> ${sanitizedData.company}</p>` : ''}
        <p><strong>Message:</strong></p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
          ${sanitizedData.message.replace(/\n/g, '<br>')}
        </div>
      </div>
    `;

    return this.sendWithRetry({
      to: SITE_CONFIG.EMAIL.CONTACT,
      subject: `Contact Form: ${sanitizedData.subject}`,
      html,
      replyTo: sanitizedData.email,
    });
  }
}

// Export singleton instance
export const emailService = new EmailService();

// Export default
export default EmailService;
