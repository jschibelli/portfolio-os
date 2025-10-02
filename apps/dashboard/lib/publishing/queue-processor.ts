/**
 * Publishing Queue Processor
 * Processes scheduled publishing jobs from the queue
 */

import { PrismaClient } from '@prisma/client';
import { publishingService } from './service';
import { PublishingOptions } from './types';

const prisma = new PrismaClient();

export class QueueProcessor {
  private isProcessing = false;
  private processingInterval: NodeJS.Timeout | null = null;

  /**
   * Start the queue processor
   * @param intervalMs - Processing interval in milliseconds (default: 60000 = 1 minute)
   */
  start(intervalMs: number = 60000) {
    if (this.processingInterval) {
      console.log('Queue processor is already running');
      return;
    }

    console.log(`Starting queue processor with ${intervalMs}ms interval`);
    this.processingInterval = setInterval(() => {
      this.processQueue();
    }, intervalMs);

    // Process immediately on start
    this.processQueue();
  }

  /**
   * Stop the queue processor
   */
  stop() {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
      console.log('Queue processor stopped');
    }
  }

  /**
   * Process the publishing queue
   */
  async processQueue() {
    if (this.isProcessing) {
      console.log('Queue processor is already processing, skipping...');
      return;
    }

    this.isProcessing = true;
    console.log('Processing queue...');

    try {
      // Get pending items that are due for processing
      const now = new Date();
      const pendingItems = await prisma.publishingQueue.findMany({
        where: {
          status: 'pending',
          OR: [
            { scheduledFor: null }, // Items with no schedule
            { scheduledFor: { lte: now } } // Items scheduled for now or earlier
          ]
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'asc' }
        ],
        take: 10 // Process 10 items at a time
      });

      console.log(`Found ${pendingItems.length} pending items to process`);

      for (const item of pendingItems) {
        await this.processQueueItem(item);
      }

      // Clean up completed items older than 7 days
      await this.cleanupOldItems();

    } catch (error) {
      console.error('Queue processing error:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Process a single queue item
   */
  private async processQueueItem(item: any) {
    try {
      console.log(`Processing queue item ${item.id} for article ${item.articleId}`);

      // Update status to processing
      await prisma.publishingQueue.update({
        where: { id: item.id },
        data: {
          status: 'processing',
          startedAt: new Date()
        }
      });

      // Build publishing options from queue item
      const options: PublishingOptions = {
        platforms: item.platforms,
        crossPost: true,
        tags: [],
        categories: [],
        seo: {},
        social: { autoShare: false, platforms: [] },
        analytics: { trackViews: true, trackEngagement: true }
      };

      // Publish the article
      const result = await publishingService.publish(item.articleId, options);

      // Update queue status to completed
      await prisma.publishingQueue.update({
        where: { id: item.id },
        data: {
          status: 'completed',
          completedAt: new Date()
        }
      });

      console.log(`Successfully published article ${item.articleId} from queue`);

    } catch (error) {
      console.error(`Error processing queue item ${item.id}:`, error);

      // Check if we should retry
      const shouldRetry = item.retryCount < item.maxRetries;

      await prisma.publishingQueue.update({
        where: { id: item.id },
        data: {
          status: shouldRetry ? 'pending' : 'failed',
          retryCount: item.retryCount + 1,
          error: error instanceof Error ? error.message : 'Unknown error',
          ...(shouldRetry && {
            // Schedule retry with exponential backoff
            scheduledFor: new Date(Date.now() + Math.pow(2, item.retryCount) * 60000)
          })
        }
      });
    }
  }

  /**
   * Clean up old completed items
   */
  private async cleanupOldItems() {
    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      const result = await prisma.publishingQueue.deleteMany({
        where: {
          status: 'completed',
          completedAt: {
            lt: sevenDaysAgo
          }
        }
      });

      if (result.count > 0) {
        console.log(`Cleaned up ${result.count} old queue items`);
      }
    } catch (error) {
      console.error('Error cleaning up old items:', error);
    }
  }

  /**
   * Get queue statistics
   */
  async getStats() {
    const [pending, processing, completed, failed] = await Promise.all([
      prisma.publishingQueue.count({ where: { status: 'pending' } }),
      prisma.publishingQueue.count({ where: { status: 'processing' } }),
      prisma.publishingQueue.count({ where: { status: 'completed' } }),
      prisma.publishingQueue.count({ where: { status: 'failed' } })
    ]);

    return {
      pending,
      processing,
      completed,
      failed,
      total: pending + processing + completed + failed
    };
  }
}

// Export singleton instance
export const queueProcessor = new QueueProcessor();

// Auto-start in production if environment variable is set
if (process.env.ENABLE_QUEUE_PROCESSOR === 'true') {
  console.log('Auto-starting queue processor...');
  queueProcessor.start();
}
