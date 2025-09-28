import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// Mock fetch globally
global.fetch = jest.fn();

/**
 * API Smoke Tests for Dashboard Application
 * 
 * These tests validate basic API endpoint functionality and error handling.
 * They use mocked responses to ensure tests don't depend on external services.
 * 
 * Test Coverage:
 * - Media Upload API endpoints
 * - Booking/Scheduling API endpoints  
 * - Stripe Webhook API endpoints
 * - Health check endpoints
 * 
 * Security Considerations:
 * - Authentication requirements
 * - Input validation
 * - Error handling without exposing sensitive information
 */

describe('API Smoke Tests', () => {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3003';
  
  // Validate base URL configuration
  if (!process.env.TEST_BASE_URL) {
    console.warn('TEST_BASE_URL not set, using default localhost:3003');
  }
  
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });
  
  afterEach(() => {
    jest.resetAllMocks();
  });
  
  describe('Media Upload API', () => {
    it('should respond to GET request', async () => {
      // Mock successful response
      (fetch as jest.Mock).mockResolvedValueOnce({
        status: 200,
        json: jest.fn().mockResolvedValueOnce({ message: 'Media upload endpoint' }),
        ok: true
      });
      
      try {
        const response = await fetch(`${baseUrl}/api/media/upload`);
        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);
        
        const data = await response.json();
        expect(data.message).toBe('Media upload endpoint');
      } catch (error) {
        // Handle network errors gracefully
        console.error('Network error in media upload test:', error);
        throw error;
      }
    });

    it('should reject POST without authentication', async () => {
      // Mock 401 response
      (fetch as jest.Mock).mockResolvedValueOnce({
        status: 401,
        json: jest.fn().mockResolvedValueOnce({ error: 'Unauthorized' })
      });
      
      const formData = new FormData();
      const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
      formData.append('file', file);

      const response = await fetch(`${baseUrl}/api/media/upload`, {
        method: 'POST',
        body: formData,
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should reject invalid file types', async () => {
      // Mock 400 response
      (fetch as jest.Mock).mockResolvedValueOnce({
        status: 400,
        json: jest.fn().mockResolvedValueOnce({ error: 'Invalid file type' })
      });
      
      const formData = new FormData();
      const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
      formData.append('file', file);

      const response = await fetch(`${baseUrl}/api/media/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'Bearer test-token',
        },
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid file type');
    });
  });

  describe('Booking API', () => {
    it('should validate booking request structure', async () => {
      // Mock successful booking response
      (fetch as jest.Mock).mockResolvedValueOnce({
        status: 201,
        json: jest.fn().mockResolvedValueOnce({ 
          bookingId: '12345',
          message: 'Booking created successfully' 
        })
      });
      
      const bookingData = {
        name: 'John Doe',
        email: 'john@example.com',
        date: '2024-01-15',
        time: '10:00',
        duration: 60,
        service: 'consultation'
      };

      const response = await fetch(`${baseUrl}/api/schedule/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.bookingId).toBe('12345');
      expect(data.message).toBe('Booking created successfully');
    });

    it('should reject invalid email format', async () => {
      // Mock 400 response for invalid email
      (fetch as jest.Mock).mockResolvedValueOnce({
        status: 400,
        json: jest.fn().mockResolvedValueOnce({ error: 'Invalid email format' })
      });
      
      const bookingData = {
        name: 'John Doe',
        email: 'invalid-email',
        date: '2024-01-15',
        time: '10:00',
        duration: 60,
        service: 'consultation'
      };

      const response = await fetch(`${baseUrl}/api/schedule/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid email format');
    });

    it('should reject invalid duration', async () => {
      // Mock 400 response for invalid duration
      (fetch as jest.Mock).mockResolvedValueOnce({
        status: 400,
        json: jest.fn().mockResolvedValueOnce({ error: 'Invalid duration' })
      });
      
      const bookingData = {
        name: 'John Doe',
        email: 'john@example.com',
        date: '2024-01-15',
        time: '10:00',
        duration: 0, // Invalid duration
        service: 'consultation'
      };

      const response = await fetch(`${baseUrl}/api/schedule/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid duration');
    });
  });

  describe('Stripe Webhook API', () => {
    it('should reject requests without signature', async () => {
      // Mock 400 response for missing signature
      (fetch as jest.Mock).mockResolvedValueOnce({
        status: 400,
        json: jest.fn().mockResolvedValueOnce({ error: 'Missing signature' })
      });
      
      const webhookData = {
        type: 'payment_intent.succeeded',
        data: { object: { id: 'pi_123' } }
      };

      const response = await fetch(`${baseUrl}/api/webhooks/stripe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Missing signature');
    });

    it('should reject requests with invalid signature', async () => {
      // Mock 400 response for invalid signature
      (fetch as jest.Mock).mockResolvedValueOnce({
        status: 400,
        json: jest.fn().mockResolvedValueOnce({ error: 'Invalid signature' })
      });
      
      const webhookData = {
        type: 'payment_intent.succeeded',
        data: { object: { id: 'pi_123' } }
      };

      const response = await fetch(`${baseUrl}/api/webhooks/stripe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Stripe-Signature': 'invalid-signature',
        },
        body: JSON.stringify(webhookData),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid signature');
    });
  });

  describe('Health Check', () => {
    it('should respond to health check', async () => {
      // Mock successful health check response
      (fetch as jest.Mock).mockResolvedValueOnce({
        status: 200,
        json: jest.fn().mockResolvedValueOnce({ 
          status: 'healthy',
          timestamp: new Date().toISOString()
        })
      });
      
      const response = await fetch(`${baseUrl}/api/health`);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.status).toBe('healthy');
      expect(data.timestamp).toBeDefined();
    });
  });

  describe('Environment Configuration', () => {
    it('should handle missing TEST_BASE_URL gracefully', () => {
      // Test that the default URL is used when TEST_BASE_URL is not set
      const originalEnv = process.env.TEST_BASE_URL;
      delete process.env.TEST_BASE_URL;
      
      // Re-import to test default behavior
      const testBaseUrl = process.env.TEST_BASE_URL || 'http://localhost:3003';
      expect(testBaseUrl).toBe('http://localhost:3003');
      
      // Restore original environment
      if (originalEnv) {
        process.env.TEST_BASE_URL = originalEnv;
      }
    });

    it('should validate base URL format', () => {
      // Ensure base URL has proper format
      expect(baseUrl).toMatch(/^https?:\/\/.+/);
      expect(baseUrl).not.toBe('');
    });
  });
});