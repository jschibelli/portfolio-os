/**
 * API Types and Interfaces
 * 
 * This module defines TypeScript interfaces for API request and response objects
 * to enhance type safety and improve code maintainability.
 * 
 * Addresses code review feedback from PR #37 about defining interfaces for
 * request body objects to enhance type safety.
 */

// Base API response interface
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

// Booking API request interface
export interface BookingRequest {
  name: string;
  email: string;
  timezone: string;
  startTime: string;
  endTime: string;
  meetingType?: string;
  notes?: string;
}

// Booking API response interface
export interface BookingResponse {
  bookingId: string;
  eventId: string;
  meetingLink?: string;
  confirmationEmail: boolean;
  scheduledTime: {
    start: string;
    end: string;
    timezone: string;
  };
}

// Email service interfaces
export interface EmailConfig {
  from: string;
  to: string[];
  subject: string;
  html: string;
  text?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  retryCount: number;
}

// Calendar service interfaces
export interface CalendarEvent {
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees: Array<{
    email: string;
    displayName?: string;
  }>;
  conferenceData?: {
    createRequest: {
      requestId: string;
      conferenceSolutionKey: {
        type: string;
      };
    };
  };
}

export interface CalendarResult {
  success: boolean;
  eventId?: string;
  meetingLink?: string;
  error?: string;
}

// Validation interfaces
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface FieldValidation {
  field: string;
  value: any;
  isValid: boolean;
  error?: string;
}

// Retry configuration interface
export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableErrors: string[];
}

// Logging interfaces
export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  context?: Record<string, any>;
  timestamp: string;
  userId?: string;
  requestId?: string;
}

export interface AuditLogEntry {
  action: string;
  userId?: string;
  email?: string;
  success: boolean;
  error?: string;
  metadata?: Record<string, any>;
  timestamp: string;
  requestId: string;
}

// Error types
export enum ApiErrorType {
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NOT_FOUND = 'not_found',
  CONFLICT = 'conflict',
  RATE_LIMIT = 'rate_limit',
  EXTERNAL_SERVICE = 'external_service',
  INTERNAL = 'internal',
  NETWORK = 'network',
  TIMEOUT = 'timeout'
}

export interface ApiError {
  type: ApiErrorType;
  message: string;
  code: string;
  details?: Record<string, any>;
  retryable: boolean;
  timestamp: string;
}

// Configuration interfaces
export interface BookingConfig {
  featureEnabled: boolean;
  maxBookingsPerDay: number;
  allowedMeetingTypes: string[];
  defaultMeetingDuration: number;
  timezoneValidation: boolean;
  emailNotifications: boolean;
  calendarIntegration: boolean;
}

export interface EmailServiceConfig {
  provider: 'resend' | 'sendgrid' | 'nodemailer';
  apiKey: string;
  fromEmail: string;
  fromName: string;
  retryConfig: RetryConfig;
  rateLimitConfig: {
    maxEmailsPerHour: number;
    maxEmailsPerDay: number;
  };
}

export interface CalendarServiceConfig {
  provider: 'google' | 'outlook' | 'calendly';
  credentials: {
    type: string;
    project_id?: string;
    private_key_id?: string;
    private_key?: string;
    client_email?: string;
    client_id?: string;
  };
  scopes: string[];
  calendarId: string;
}

// Database interfaces (for future use)
export interface BookingRecord {
  id: string;
  name: string;
  email: string;
  timezone: string;
  startTime: Date;
  endTime: Date;
  meetingType: string;
  notes?: string;
  eventId?: string;
  meetingLink?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

// Service interfaces
export interface EmailService {
  sendEmail(config: EmailConfig): Promise<EmailResult>;
  validateEmail(email: string): boolean;
  getRateLimitStatus(): Promise<{
    emailsSent: number;
    limit: number;
    resetTime: Date;
  }>;
}

export interface CalendarService {
  createEvent(event: CalendarEvent): Promise<CalendarResult>;
  updateEvent(eventId: string, event: Partial<CalendarEvent>): Promise<CalendarResult>;
  deleteEvent(eventId: string): Promise<CalendarResult>;
  getEvent(eventId: string): Promise<CalendarEvent | null>;
}

export interface ValidationService {
  validateBookingRequest(request: BookingRequest): ValidationResult;
  validateEmail(email: string): FieldValidation;
  validateTimezone(timezone: string): FieldValidation;
  validateTimeRange(startTime: string, endTime: string): FieldValidation;
  sanitizeInput(input: string, type: 'name' | 'email' | 'notes' | 'meetingType'): string;
}

export interface LoggingService {
  log(entry: LogEntry): void;
  audit(action: string, success: boolean, metadata?: Record<string, any>): void;
  getLogs(filter?: Partial<LogEntry>): LogEntry[];
  getAuditLogs(filter?: Partial<AuditLogEntry>): AuditLogEntry[];
}

// Request context interface
export interface RequestContext {
  requestId: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  method: string;
  url: string;
  headers: Record<string, string>;
}

// Rate limiting interfaces
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: any) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export interface RateLimitStatus {
  limit: number;
  remaining: number;
  resetTime: Date;
  retryAfter?: number;
}

// Health check interfaces
export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: {
    email: ServiceHealth;
    calendar: ServiceHealth;
    database: ServiceHealth;
  };
  timestamp: string;
  version: string;
}

export interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime?: number;
  error?: string;
  lastChecked: string;
}

// Export default
export default {
  ApiResponse,
  BookingRequest,
  BookingResponse,
  EmailConfig,
  EmailResult,
  CalendarEvent,
  CalendarResult,
  ValidationResult,
  FieldValidation,
  RetryConfig,
  LogEntry,
  AuditLogEntry,
  ApiErrorType,
  ApiError,
  BookingConfig,
  EmailServiceConfig,
  CalendarServiceConfig,
  BookingRecord,
  EmailService,
  CalendarService,
  ValidationService,
  LoggingService,
  RequestContext,
  RateLimitConfig,
  RateLimitStatus,
  HealthCheckResult,
  ServiceHealth,
};