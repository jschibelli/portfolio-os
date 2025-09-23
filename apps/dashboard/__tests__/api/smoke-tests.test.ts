import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

describe('API Smoke Tests', () => {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3001';
  
  describe('Media Upload API', () => {
    it('should respond to GET request', async () => {
      const response = await fetch(`${baseUrl}/api/media/upload`);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.message).toBe('Media upload endpoint');
    });

    it('should reject POST without authentication', async () => {
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
      const formData = new FormData();
      const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
      formData.append('file', file);

      const response = await fetch(`${baseUrl}/api/media/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'Bearer test-token', // Mock auth for testing
        },
      });

      expect(response.status).toBe(401); // Should fail auth first
    });
  });

  describe('Booking API', () => {
    it('should validate booking request structure', async () => {
      const bookingData = {
        startISO: '2024-01-01T10:00:00Z',
        durationMinutes: 30,
        timeZone: 'America/New_York',
        attendeeEmail: 'test@example.com',
        attendeeName: 'Test User',
        summary: 'Test Meeting',
        description: 'Test meeting description',
        sendUpdates: 'all' as const,
      };

      const response = await fetch(`${baseUrl}/api/schedule/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      // Should fail due to missing Google Calendar credentials in test
      // but should not fail due to malformed request
      expect(response.status).not.toBe(400);
    });

    it('should reject invalid email format', async () => {
      const bookingData = {
        startISO: '2024-01-01T10:00:00Z',
        durationMinutes: 30,
        timeZone: 'America/New_York',
        attendeeEmail: 'invalid-email',
        attendeeName: 'Test User',
        summary: 'Test Meeting',
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
      expect(data.error).toContain('email');
    });

    it('should reject invalid duration', async () => {
      const bookingData = {
        startISO: '2024-01-01T10:00:00Z',
        durationMinutes: 5, // Too short
        timeZone: 'America/New_York',
        attendeeEmail: 'test@example.com',
        attendeeName: 'Test User',
        summary: 'Test Meeting',
      };

      const response = await fetch(`${baseUrl}/api/schedule/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      expect(response.status).toBe(400);
    });
  });

  describe('Stripe Webhook API', () => {
    it('should reject requests without signature', async () => {
      const response = await fetch(`${baseUrl}/api/webhooks/stripe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'test.event' }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Missing stripe-signature header');
    });

    it('should reject requests with invalid signature', async () => {
      const response = await fetch(`${baseUrl}/api/webhooks/stripe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': 'invalid-signature',
        },
        body: JSON.stringify({ type: 'test.event' }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid signature');
    });
  });

  describe('Health Check', () => {
    it('should respond to health check', async () => {
      const response = await fetch(`${baseUrl}/api/health`);
      expect(response.status).toBe(200);
    });
  });
});
