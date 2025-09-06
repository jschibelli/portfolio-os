/**
 * API Type Definitions
 * 
 * This module provides TypeScript interfaces for API request and response objects
 * to ensure type safety and better error handling across the application.
 * 
 * Addresses code review feedback from PR #37:
 * - TypeScript interfaces for request body objects
 * - Enhanced type safety for API endpoints
 * - Consistent error response structures
 */

// Base API response structure
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

// Booking API types
export interface BookingRequest {
  name: string;
  email: string;
  meetingType: string;
  date: string;
  time: string;
  timezone: string;
  notes?: string;
  phone?: string;
  company?: string;
}

export interface BookingResponse {
  bookingId: string;
  googleEventId?: string;
  meetLink?: string;
  calendarLink?: string;
  confirmationEmail: boolean;
  message: string;
}

// Email API types
export interface EmailRequest {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  content: string | Buffer;
  contentType?: string;
}

export interface EmailResponse {
  messageId: string;
  success: boolean;
  error?: string;
}

// Contact form types
export interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  company?: string;
  service?: string;
}

export interface ContactResponse {
  messageId: string;
  success: boolean;
  message: string;
}

// Analytics API types
export interface AnalyticsRequest {
  period: string;
  metric: string;
  startDate?: string;
  endDate?: string;
  filters?: Record<string, any>;
}

export interface AnalyticsResponse {
  timeSeriesData: Array<{
    date: string;
    value: number;
    label?: string;
  }>;
  overview: {
    total: number;
    change: number;
    changeType: 'increase' | 'decrease' | 'neutral';
  };
  metadata: {
    period: string;
    lastUpdated: string;
    dataSource: string;
  };
}

// Error types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  requestId?: string;
}

// Validation error types
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationResponse {
  isValid: boolean;
  errors: ValidationError[];
  warnings: string[];
}

// Retry configuration
export interface RetryConfig {
  maxAttempts: number;
  delay: number;
  backoffMultiplier: number;
  maxDelay: number;
}

// Logging types
export interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  context?: Record<string, any>;
  timestamp: string;
  requestId?: string;
  userId?: string;
}

// Configuration validation types
export interface ConfigValidationRequest {
  configType: 'site' | 'email' | 'social' | 'personal' | 'seo';
  config: Record<string, any>;
}

export interface ConfigValidationResponse {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missingFields: string[];
  recommendations: string[];
}

// Utility types for API responses
export type ApiSuccessResponse<T> = ApiResponse<T> & {
  success: true;
  data: T;
};

export type ApiErrorResponse = ApiResponse<never> & {
  success: false;
  error: string;
};

// Request validation helpers
export interface RequestValidator<T> {
  validate(data: unknown): ValidationResponse & { data?: T };
}

// Email service types
export interface EmailService {
  sendEmail(request: EmailRequest): Promise<EmailResponse>;
  sendWithRetry(request: EmailRequest, config?: RetryConfig): Promise<EmailResponse>;
  validateEmailAddress(email: string): boolean;
}

// Calendar service types
export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: string;
  }>;
  conferenceData?: {
    createRequest: {
      requestId: string;
      conferenceSolutionKey: { type: string };
    };
  };
  reminders?: {
    useDefault: boolean;
    overrides: Array<{
      method: string;
      minutes: number;
    }>;
  };
}

export interface CalendarService {
  createEvent(event: CalendarEvent): Promise<CalendarEvent>;
  updateEvent(eventId: string, event: Partial<CalendarEvent>): Promise<CalendarEvent>;
  deleteEvent(eventId: string): Promise<boolean>;
  getEvent(eventId: string): Promise<CalendarEvent>;
}

// Database types
export interface BookingRecord {
  id: string;
  name: string;
  email: string;
  meetingType: string;
  scheduledDate: Date;
  timezone: string;
  notes?: string;
  phone?: string;
  company?: string;
  googleEventId?: string;
  meetLink?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactRecord {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  company?: string;
  service?: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

// Export all types for use in other modules
export default {
  ApiResponse,
  BookingRequest,
  BookingResponse,
  EmailRequest,
  EmailResponse,
  ContactRequest,
  ContactResponse,
  AnalyticsRequest,
  AnalyticsResponse,
  ApiError,
  ValidationError,
  ValidationResponse,
  RetryConfig,
  LogEntry,
  ConfigValidationRequest,
  ConfigValidationResponse,
  ApiSuccessResponse,
  ApiErrorResponse,
  RequestValidator,
  EmailService,
  CalendarEvent,
  CalendarService,
  BookingRecord,
  ContactRecord,
};
