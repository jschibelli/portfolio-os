/**
 * Newsletter Analytics Tracking Tests
 * 
 * This test suite covers the analytics tracking functionality
 * for newsletter subscriptions with comprehensive error handling.
 */

import { trackNewsletterSubscription, AnalyticsUtils } from '../../lib/analytics-utils';

// Mock window.gtag for testing
const mockGtag = jest.fn();
const mockDispatchEvent = jest.fn();

// Mock window object
Object.defineProperty(window, 'gtag', {
  value: mockGtag,
  writable: true,
});

Object.defineProperty(window, 'dispatchEvent', {
  value: mockDispatchEvent,
  writable: true,
});

// Mock console methods
const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

describe('Newsletter Analytics Tracking', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    mockGtag.mockClear();
    mockDispatchEvent.mockClear();
    mockConsoleWarn.mockClear();
    mockConsoleError.mockClear();
    
    // Reset analytics error counts
    AnalyticsUtils.resetErrorCounts();
  });

  afterAll(() => {
    // Restore console methods
    mockConsoleWarn.mockRestore();
    mockConsoleError.mockRestore();
  });

  describe('trackNewsletterSubscription', () => {
    it('should successfully track newsletter subscription with valid data', async () => {
      const testData = {
        status: 'SUCCESS' as const,
        timestamp: '2025-09-05T10:00:00.000Z',
        publicationId: 'test-publication-id'
      };

      const result = await trackNewsletterSubscription(testData);

      expect(result).toBe(true);
      expect(mockGtag).toHaveBeenCalledWith('event', 'newsletter_subscription', {
        event_category: 'engagement',
        event_label: 'newsletter_cta',
        value: 1,
        custom_parameters: {
          status: 'SUCCESS',
          publication_id: 'test-publication-id',
          timestamp: '2025-09-05T10:00:00.000Z',
        },
      });
    });

    it('should track pending newsletter subscription', async () => {
      const testData = {
        status: 'PENDING' as const,
        timestamp: '2025-09-05T10:00:00.000Z',
        publicationId: 'test-publication-id'
      };

      const result = await trackNewsletterSubscription(testData);

      expect(result).toBe(true);
      expect(mockGtag).toHaveBeenCalledWith('event', 'newsletter_subscription', {
        event_category: 'engagement',
        event_label: 'newsletter_cta',
        value: 0,
        custom_parameters: {
          status: 'PENDING',
          publication_id: 'test-publication-id',
          timestamp: '2025-09-05T10:00:00.000Z',
        },
      });
    });

    it('should track failed newsletter subscription', async () => {
      const testData = {
        status: 'FAILED' as const,
        timestamp: '2025-09-05T10:00:00.000Z',
        publicationId: 'test-publication-id'
      };

      const result = await trackNewsletterSubscription(testData);

      expect(result).toBe(true);
      expect(mockGtag).toHaveBeenCalledWith('event', 'newsletter_subscription', {
        event_category: 'engagement',
        event_label: 'newsletter_cta',
        value: 0,
        custom_parameters: {
          status: 'FAILED',
          publication_id: 'test-publication-id',
          timestamp: '2025-09-05T10:00:00.000Z',
        },
      });
    });

    it('should handle invalid status gracefully', async () => {
      const testData = {
        status: 'INVALID_STATUS' as any,
        timestamp: '2025-09-05T10:00:00.000Z',
        publicationId: 'test-publication-id'
      };

      const result = await trackNewsletterSubscription(testData);

      expect(result).toBe(false);
      expect(mockConsoleWarn).toHaveBeenCalledWith(
        'Invalid newsletter subscription status:',
        'INVALID_STATUS'
      );
      expect(mockGtag).not.toHaveBeenCalled();
    });

    it('should handle missing status data', async () => {
      const testData = {
        status: undefined as any,
        timestamp: '2025-09-05T10:00:00.000Z',
        publicationId: 'test-publication-id'
      };

      const result = await trackNewsletterSubscription(testData);

      expect(result).toBe(false);
      expect(mockConsoleWarn).toHaveBeenCalledWith(
        'Invalid newsletter subscription status:',
        undefined
      );
      expect(mockGtag).not.toHaveBeenCalled();
    });

    it('should handle gtag errors gracefully', async () => {
      // Mock gtag to throw an error
      mockGtag.mockImplementation(() => {
        throw new Error('gtag error');
      });

      const testData = {
        status: 'SUCCESS' as const,
        timestamp: '2025-09-05T10:00:00.000Z',
        publicationId: 'test-publication-id'
      };

      const result = await trackNewsletterSubscription(testData);

      expect(result).toBe(false);
      expect(mockConsoleError).toHaveBeenCalled();
    });

    it('should handle timeout scenarios', async () => {
      // Mock gtag to be slow
      mockGtag.mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(resolve, 6000); // Longer than timeout
        });
      });

      const testData = {
        status: 'SUCCESS' as const,
        timestamp: '2025-09-05T10:00:00.000Z',
        publicationId: 'test-publication-id'
      };

      const result = await trackNewsletterSubscription(testData, { timeout: 1000 });

      expect(result).toBe(false);
      expect(mockConsoleError).toHaveBeenCalled();
    });

    it('should fallback to custom events when gtag is unavailable', async () => {
      // Remove gtag from window
      delete (window as any).gtag;

      const testData = {
        status: 'SUCCESS' as const,
        timestamp: '2025-09-05T10:00:00.000Z',
        publicationId: 'test-publication-id'
      };

      const result = await trackNewsletterSubscription(testData, { fallbackToCustomEvents: true });

      expect(result).toBe(false); // Should return false when gtag unavailable
      expect(mockDispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'analytics-event',
          detail: expect.objectContaining({
            event_name: 'newsletter_subscription',
            event_category: 'engagement',
            source: 'fallback'
          })
        })
      );
    });

    it('should not fallback to custom events when disabled', async () => {
      // Remove gtag from window
      delete (window as any).gtag;

      const testData = {
        status: 'SUCCESS' as const,
        timestamp: '2025-09-05T10:00:00.000Z',
        publicationId: 'test-publication-id'
      };

      const result = await trackNewsletterSubscription(testData, { fallbackToCustomEvents: false });

      expect(result).toBe(false);
      expect(mockDispatchEvent).not.toHaveBeenCalled();
    });
  });

  describe('AnalyticsUtils Health Check', () => {
    it('should provide accurate health status', () => {
      const healthStatus = AnalyticsUtils.getHealthStatus();

      expect(healthStatus).toHaveProperty('isAvailable');
      expect(healthStatus).toHaveProperty('performanceMetrics');
      expect(healthStatus).toHaveProperty('errorCounts');
      expect(typeof healthStatus.isAvailable).toBe('boolean');
      expect(typeof healthStatus.errorCounts).toBe('number');
    });

    it('should track performance metrics', async () => {
      const testData = {
        status: 'SUCCESS' as const,
        timestamp: '2025-09-05T10:00:00.000Z',
        publicationId: 'test-publication-id'
      };

      await trackNewsletterSubscription(testData);

      const metrics = AnalyticsUtils.getPerformanceMetrics();
      expect(metrics).toHaveProperty('newsletter_subscription');
      expect(metrics.newsletter_subscription).toHaveProperty('average');
      expect(metrics.newsletter_subscription).toHaveProperty('count');
    });
  });

  describe('Error Handling', () => {
    it('should limit error logging to prevent spam', async () => {
      // Mock gtag to always throw an error
      mockGtag.mockImplementation(() => {
        throw new Error('Persistent gtag error');
      });

      const testData = {
        status: 'SUCCESS' as const,
        timestamp: '2025-09-05T10:00:00.000Z',
        publicationId: 'test-publication-id'
      };

      // Call multiple times to test error limiting
      for (let i = 0; i < 10; i++) {
        await trackNewsletterSubscription(testData);
      }

      // Should not have logged errors more than the limit
      expect(mockConsoleError).toHaveBeenCalledTimes(5); // Max error limit
    });

    it('should reset error counts when requested', async () => {
      // Mock gtag to throw an error
      mockGtag.mockImplementation(() => {
        throw new Error('Test error');
      });

      const testData = {
        status: 'SUCCESS' as const,
        timestamp: '2025-09-05T10:00:00.000Z',
        publicationId: 'test-publication-id'
      };

      // Generate some errors
      await trackNewsletterSubscription(testData);
      await trackNewsletterSubscription(testData);

      // Reset error counts
      AnalyticsUtils.resetErrorCounts();

      // Generate more errors
      await trackNewsletterSubscription(testData);

      // Should be able to log errors again after reset
      expect(mockConsoleError).toHaveBeenCalled();
    });
  });
});
