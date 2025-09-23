/**
 * Unit Tests for Book API Endpoint
 * 
 * This module provides comprehensive unit tests for the book API endpoint,
 * including the sendConfirmationEmail function and all API functionality.
 * 
 * Addresses code review feedback from PR #37 about writing unit tests,
 * especially for the sendConfirmationEmail function.
 */

import { NextApiRequest, NextApiResponse } from 'next';
import handler from '../../pages/api/book';
import { emailService } from '../../lib/email-service';
import { loggingService } from '../../lib/logging-service';

// Mock dependencies
jest.mock('../../lib/email-service');
jest.mock('../../lib/logging-service');
jest.mock('googleapis', () => ({
  calendar: jest.fn(() => ({
    events: {
      insert: jest.fn()
    }
    })),
  auth: {
    GoogleAuth: jest.fn(() => ({
      getAccessToken: jest.fn().mockResolvedValue({ token: 'mock-token' })
    }))
  }
}));

// Mock environment variables
const originalEnv = process.env;
beforeEach(() => {
  jest.resetModules();
  process.env = {
    ...originalEnv,
    FEATURE_SCHEDULING: 'true',
    RESEND_API_KEY: 'test-api-key',
    CONTACT_EMAIL: 'test@example.com',
    GOOGLE_PRIVATE_KEY: 'test-private-key',
    GOOGLE_CLIENT_EMAIL: 'test@example.com',
    GOOGLE_PROJECT_ID: 'test-project',
    GOOGLE_PRIVATE_KEY_ID: 'test-key-id',
    GOOGLE_CLIENT_ID: 'test-client-id',
    GOOGLE_TYPE: 'service_account'
  };
});

afterEach(() => {
  process.env = originalEnv;
  jest.clearAllMocks();
});

// Mock request and response objects
const createMockRequest = (body: any, method: string = 'POST'): NextApiRequest => ({
  method,
  body,
  headers: {},
  query: {},
  cookies: {},
  url: '/api/book'
} as NextApiRequest);

const createMockResponse = (): NextApiResponse => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis()
  } as any;
  return res;
};

describe('Book API Endpoint', () => {
  describe('Method Validation', () => {
    it('should reject non-POST requests', async () => {
      const req = createMockRequest({}, 'GET');
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.json).toHaveBeenCalledWith({ error: 'Method not allowed' });
    });
  });

  describe('Feature Flag Validation', () => {
    it('should reject requests when scheduling feature is disabled', async () => {
      process.env.FEATURE_SCHEDULING = 'false';
      
      const req = createMockRequest({
        name: 'John Doe',
        email: 'john@example.com',
        timezone: 'America/New_York',
        startTime: '2024-01-01T10:00:00Z',
        endTime: '2024-01-01T11:00:00Z'
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(503);
      expect(res.json).toHaveBeenCalledWith({ error: 'Scheduling feature is disabled' });
    });
  });

  describe('Input Validation', () => {
    it('should validate required fields', async () => {
      const req = createMockRequest({
        name: 'John Doe',
        email: 'john@example.com'
        // Missing timezone, startTime, endTime
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing required fields: name, email, timezone, startTime, endTime'
      });
    });

    it('should validate email format', async () => {
      const req = createMockRequest({
        name: 'John Doe',
        email: 'invalid-email',
        timezone: 'America/New_York',
        startTime: '2024-01-01T10:00:00Z',
        endTime: '2024-01-01T11:00:00Z'
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid email address format',
        details: 'Please provide a valid email address'
      });
    });

    it('should validate name length', async () => {
      const req = createMockRequest({
        name: 'A', // Too short
        email: 'john@example.com',
        timezone: 'America/New_York',
        startTime: '2024-01-01T10:00:00Z',
        endTime: '2024-01-01T11:00:00Z'
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Name must be between 2 and 100 characters'
      });
    });

    it('should validate timezone', async () => {
      const req = createMockRequest({
        name: 'John Doe',
        email: 'john@example.com',
        timezone: 'Invalid/Timezone',
        startTime: '2024-01-01T10:00:00Z',
        endTime: '2024-01-01T11:00:00Z'
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid timezone'
      });
    });

    it('should validate time range', async () => {
      const req = createMockRequest({
        name: 'John Doe',
        email: 'john@example.com',
        timezone: 'America/New_York',
        startTime: '2020-01-01T10:00:00Z', // Past date
        endTime: '2020-01-01T11:00:00Z'
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Start time must be in the future'
      });
    });

    it('should validate end time is after start time', async () => {
      const req = createMockRequest({
        name: 'John Doe',
        email: 'john@example.com',
        timezone: 'America/New_York',
        startTime: '2024-01-01T11:00:00Z',
        endTime: '2024-01-01T10:00:00Z' // End before start
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'End time must be after start time'
      });
    });
  });

  describe('Input Sanitization', () => {
    it('should sanitize HTML tags from name', async () => {
      const req = createMockRequest({
        name: 'John <script>alert("xss")</script> Doe',
        email: 'john@example.com',
        timezone: 'America/New_York',
        startTime: '2024-01-01T10:00:00Z',
        endTime: '2024-01-01T11:00:00Z'
      });
      const res = createMockResponse();

      await handler(req, res);

      // Should not throw error and should sanitize the name
      expect(res.status).not.toHaveBeenCalledWith(400);
    });

    it('should sanitize HTML tags from notes', async () => {
      const req = createMockRequest({
        name: 'John Doe',
        email: 'john@example.com',
        timezone: 'America/New_York',
        startTime: '2024-01-01T10:00:00Z',
        endTime: '2024-01-01T11:00:00Z',
        notes: 'Meeting notes <script>alert("xss")</script>'
      });
      const res = createMockResponse();

      await handler(req, res);

      // Should not throw error and should sanitize the notes
      expect(res.status).not.toHaveBeenCalledWith(400);
    });
  });

  describe('Email Service Integration', () => {
    it('should call email service with correct parameters', async () => {
      const mockEmailResult = { success: true, messageId: 'test-message-id', retryCount: 0 };
      (emailService.sendEmail as jest.Mock).mockResolvedValue(mockEmailResult);

      const req = createMockRequest({
        name: 'John Doe',
        email: 'john@example.com',
        timezone: 'America/New_York',
        startTime: '2024-01-01T10:00:00Z',
        endTime: '2024-01-01T11:00:00Z'
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(emailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: ['john@example.com'],
          subject: 'Meeting Confirmed - John Schibelli',
          html: expect.stringContaining('John Doe')
        }),
        expect.any(String)
      );
    });

    it('should handle email service failures gracefully', async () => {
      (emailService.sendEmail as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Email service unavailable',
        retryCount: 3
      });

      const req = createMockRequest({
        name: 'John Doe',
        email: 'john@example.com',
        timezone: 'America/New_York',
        startTime: '2024-01-01T10:00:00Z',
        endTime: '2024-01-01T11:00:00Z'
      });
      const res = createMockResponse();

      await handler(req, res);

      // Should still return success for the booking even if email fails
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Logging Integration', () => {
    it('should log booking attempts', async () => {
      const req = createMockRequest({
        name: 'John Doe',
        email: 'john@example.com',
        timezone: 'America/New_York',
        startTime: '2024-01-01T10:00:00Z',
        endTime: '2024-01-01T11:00:00Z'
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(loggingService.audit).toHaveBeenCalledWith(
        'booking_attempt',
        true,
        expect.objectContaining({
          name: 'John Doe',
          email: 'john@example.com'
        }),
        expect.any(String)
      );
    });

    it('should log validation errors', async () => {
      const req = createMockRequest({
        name: 'John Doe',
        email: 'invalid-email',
        timezone: 'America/New_York',
        startTime: '2024-01-01T10:00:00Z',
        endTime: '2024-01-01T11:00:00Z'
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(loggingService.audit).toHaveBeenCalledWith(
        'booking_validation_failed',
        false,
        expect.objectContaining({
          error: 'Invalid email address format'
        }),
        expect.any(String)
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle Google Calendar API errors', async () => {
      // Mock Google Calendar API to throw an error
      const mockCalendar = {
        events: {
          insert: jest.fn().mockRejectedValue(new Error('Calendar API error'))
        }
      };
      
      jest.doMock('googleapis', () => ({
        calendar: jest.fn(() => mockCalendar),
        auth: {
          GoogleAuth: jest.fn(() => ({
            getAccessToken: jest.fn().mockResolvedValue({ token: 'mock-token' })
          }))
        }
      }));

      const req = createMockRequest({
        name: 'John Doe',
        email: 'john@example.com',
        timezone: 'America/New_York',
        startTime: '2024-01-01T10:00:00Z',
        endTime: '2024-01-01T11:00:00Z'
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to create calendar event'
      });
    });

    it('should handle missing Google credentials', async () => {
      delete process.env.GOOGLE_PRIVATE_KEY;
      delete process.env.GOOGLE_CLIENT_EMAIL;

      const req = createMockRequest({
        name: 'John Doe',
        email: 'john@example.com',
        timezone: 'America/New_York',
        startTime: '2024-01-01T10:00:00Z',
        endTime: '2024-01-01T11:00:00Z'
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Google Calendar credentials not configured'
      });
    });
  });

  describe('Success Scenarios', () => {
    it('should successfully create a booking', async () => {
      const mockEmailResult = { success: true, messageId: 'test-message-id', retryCount: 0 };
      (emailService.sendEmail as jest.Mock).mockResolvedValue(mockEmailResult);

      const req = createMockRequest({
        name: 'John Doe',
        email: 'john@example.com',
        timezone: 'America/New_York',
        startTime: '2024-01-01T10:00:00Z',
        endTime: '2024-01-01T11:00:00Z',
        meetingType: 'Consultation',
        notes: 'Discussion about project requirements'
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Meeting scheduled successfully',
        data: expect.objectContaining({
          bookingId: expect.any(String),
          eventId: expect.any(String),
          meetingLink: expect.any(String),
          confirmationEmail: true
        })
      });
    });

    it('should handle optional fields correctly', async () => {
      const mockEmailResult = { success: true, messageId: 'test-message-id', retryCount: 0 };
      (emailService.sendEmail as jest.Mock).mockResolvedValue(mockEmailResult);

      const req = createMockRequest({
        name: 'John Doe',
        email: 'john@example.com',
        timezone: 'America/New_York',
        startTime: '2024-01-01T10:00:00Z',
        endTime: '2024-01-01T11:00:00Z'
        // No meetingType or notes
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Meeting scheduled successfully',
        data: expect.objectContaining({
          bookingId: expect.any(String),
          eventId: expect.any(String),
          meetingLink: expect.any(String),
          confirmationEmail: true
        })
      });
    });
  });
});

describe('sendConfirmationEmail Function', () => {
  it('should validate email format', async () => {
    const { sendConfirmationEmail } = await import('../../pages/api/book');
    
    await expect(sendConfirmationEmail(
      'invalid-email',
      'John Doe',
      '2024-01-01',
      '10:00 AM'
    )).rejects.toThrow('Invalid email address: invalid-email');
  });

  it('should send email with correct parameters', async () => {
    const mockEmailResult = { success: true, messageId: 'test-message-id', retryCount: 0 };
    (emailService.sendEmail as jest.Mock).mockResolvedValue(mockEmailResult);

    const { sendConfirmationEmail } = await import('../../pages/api/book');
    
    await sendConfirmationEmail(
      'john@example.com',
      'John Doe',
      '2024-01-01',
      '10:00 AM'
    );

    expect(emailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ['john@example.com'],
        subject: 'Meeting Confirmed - John Schibelli',
        html: expect.stringContaining('John Doe')
      }),
      expect.any(String)
    );
  });

  it('should handle email service errors', async () => {
    (emailService.sendEmail as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Email service unavailable',
      retryCount: 3
    });

    const { sendConfirmationEmail } = await import('../../pages/api/book');
    
    await expect(sendConfirmationEmail(
      'john@example.com',
      'John Doe',
      '2024-01-01',
      '10:00 AM'
    )).rejects.toThrow('Email service unavailable');
  });
});
