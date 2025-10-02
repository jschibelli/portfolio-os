/**
 * Queue Processor Tests
 */

import { QueueProcessor } from '@/lib/publishing/queue-processor';

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    publishingQueue: {
      findMany: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
      count: jest.fn()
    },
    $disconnect: jest.fn()
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma)
  };
});

// Mock publishing service
jest.mock('@/lib/publishing/service', () => ({
  publishingService: {
    publish: jest.fn().mockResolvedValue({
      id: 'test-id',
      status: 'published'
    })
  }
}));

describe('QueueProcessor', () => {
  let processor: QueueProcessor;

  beforeEach(() => {
    processor = new QueueProcessor();
    jest.clearAllMocks();
  });

  afterEach(() => {
    processor.stop();
  });

  describe('start and stop', () => {
    it('should start the processor', () => {
      processor.start(1000);
      expect(processor['processingInterval']).not.toBeNull();
    });

    it('should stop the processor', () => {
      processor.start(1000);
      processor.stop();
      expect(processor['processingInterval']).toBeNull();
    });

    it('should not start if already running', () => {
      processor.start(1000);
      const interval = processor['processingInterval'];
      processor.start(1000);
      expect(processor['processingInterval']).toBe(interval);
    });
  });

  describe('getStats', () => {
    it('should return queue statistics', async () => {
      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();
      
      mockPrisma.publishingQueue.count
        .mockResolvedValueOnce(5)  // pending
        .mockResolvedValueOnce(2)  // processing
        .mockResolvedValueOnce(10) // completed
        .mockResolvedValueOnce(1); // failed

      const stats = await processor.getStats();
      
      expect(stats).toEqual({
        pending: 5,
        processing: 2,
        completed: 10,
        failed: 1,
        total: 18
      });
    });
  });

  describe('processQueue', () => {
    it('should not process if already processing', async () => {
      processor['isProcessing'] = true;
      await processor.processQueue();
      
      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();
      expect(mockPrisma.publishingQueue.findMany).not.toHaveBeenCalled();
    });

    it('should process pending items', async () => {
      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();
      
      const mockItems = [
        {
          id: 'item-1',
          articleId: 'article-1',
          platforms: [{ id: 'dashboard', name: 'dashboard', enabled: true }],
          retryCount: 0,
          maxRetries: 3
        }
      ];

      mockPrisma.publishingQueue.findMany.mockResolvedValue(mockItems);
      mockPrisma.publishingQueue.update.mockResolvedValue({});
      mockPrisma.publishingQueue.deleteMany.mockResolvedValue({ count: 0 });

      await processor.processQueue();

      expect(mockPrisma.publishingQueue.findMany).toHaveBeenCalled();
      expect(mockPrisma.publishingQueue.update).toHaveBeenCalled();
    });
  });
});
