/**
 * Bidirectional Sync System
 * Webhook-based synchronization between Dashboard and Hashnode
 */

import { PrismaClient } from '@prisma/client';
import { createHashnodeClient, HashnodeClient } from '@mindware-blog/hashnode';
import { WebhookPayload } from '@mindware-blog/hashnode/types';
import { EventEmitter } from 'events';

interface SyncConfig {
  enabled: boolean;
  webhookSecret: string;
  retryAttempts: number;
  retryDelay: number;
  conflictResolution: 'dashboard' | 'hashnode' | 'newest' | 'manual';
}

interface SyncEvent {
  type: 'article_created' | 'article_updated' | 'article_deleted' | 'sync_started' | 'sync_completed' | 'sync_failed';
  articleId?: string;
  hashnodeId?: string;
  timestamp: Date;
  data?: any;
  error?: string;
}

interface SyncStatus {
  isRunning: boolean;
  lastSync: Date | null;
  pendingOperations: number;
  failedOperations: number;
  totalOperations: number;
}

export class BidirectionalSync extends EventEmitter {
  private prisma: PrismaClient;
  private hashnodeClient: HashnodeClient;
  private config: SyncConfig;
  private status: SyncStatus;
  private syncQueue: Array<{ operation: string; data: any; retries: number }>;

  constructor(config: Partial<SyncConfig> = {}) {
    super();
    this.prisma = new PrismaClient();
    this.hashnodeClient = createHashnodeClient({
      apiToken: process.env.HASHNODE_API_TOKEN!,
      publicationId: process.env.HASHNODE_PUBLICATION_ID!,
    });
    this.config = {
      enabled: true,
      webhookSecret: process.env.HASHNODE_WEBHOOK_SECRET || '',
      retryAttempts: 3,
      retryDelay: 1000,
      conflictResolution: 'newest',
      ...config,
    };
    this.status = {
      isRunning: false,
      lastSync: null,
      pendingOperations: 0,
      failedOperations: 0,
      totalOperations: 0,
    };
    this.syncQueue = [];
  }

  /**
   * Initialize sync system
   */
  async initialize(): Promise<void> {
    if (!this.config.enabled) {
      console.log('🔄 Sync system disabled');
      return;
    }

    console.log('🔄 Initializing bidirectional sync system...');
    
    // Test connections
    await this.testConnections();
    
    // Start sync queue processor
    this.startQueueProcessor();
    
    console.log('✅ Sync system initialized');
  }

  /**
   * Handle incoming webhook from Hashnode
   */
  async handleWebhook(payload: WebhookPayload, signature: string): Promise<void> {
    try {
      // Verify webhook signature
      if (!this.verifyWebhookSignature(payload, signature)) {
        throw new Error('Invalid webhook signature');
      }

      console.log(`📨 Received webhook: ${payload.event} for article ${payload.post.id}`);

      // Process webhook based on event type
      switch (payload.event) {
        case 'POST_PUBLISHED':
          await this.handleArticlePublished(payload);
          break;
        case 'POST_UPDATED':
          await this.handleArticleUpdated(payload);
          break;
        case 'POST_DELETED':
          await this.handleArticleDeleted(payload);
          break;
        default:
          console.log(`⚠️  Unknown webhook event: ${payload.event}`);
      }

      this.emit('sync_event', {
        type: `article_${payload.event.toLowerCase().replace('post_', '')}`,
        hashnodeId: payload.post.id,
        timestamp: new Date(),
        data: payload,
      });

    } catch (error) {
      console.error('❌ Webhook processing failed:', error);
      this.emit('sync_event', {
        type: 'sync_failed',
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Sync article from Dashboard to Hashnode
   */
  async syncToHashnode(articleId: string): Promise<void> {
    try {
      const article = await this.prisma.article.findUnique({
        where: { id: articleId },
        include: { tags: true, series: true, author: true },
      });

      if (!article) {
        throw new Error(`Article ${articleId} not found`);
      }

      console.log(`🔄 Syncing article to Hashnode: ${article.title}`);

      // Convert to Hashnode format
      const hashnodeArticle = this.convertDashboardToHashnode(article);

      if (article.hashnodeId) {
        // Update existing article
        await this.hashnodeClient.updatePost(article.hashnodeId, hashnodeArticle);
        console.log(`✅ Updated Hashnode article: ${article.title}`);
      } else {
        // Create new article
        const response = await this.hashnodeClient.createPost(hashnodeArticle);
        
        // Update article with Hashnode ID
        await this.prisma.article.update({
          where: { id: articleId },
          data: { hashnodeId: response.publishPost.post.id },
        });
        
        console.log(`✅ Created Hashnode article: ${article.title}`);
      }

    } catch (error) {
      console.error(`❌ Failed to sync article ${articleId} to Hashnode:`, error);
      throw error;
    }
  }

  /**
   * Sync article from Hashnode to Dashboard
   */
  async syncFromHashnode(hashnodeId: string): Promise<void> {
    try {
      console.log(`🔄 Syncing article from Hashnode: ${hashnodeId}`);

      // Fetch article from Hashnode
      const hashnodeArticle = await this.hashnodeClient.getPost(hashnodeId);
      
      // Check if article exists in Dashboard
      const existingArticle = await this.prisma.article.findFirst({
        where: { hashnodeId },
      });

      if (existingArticle) {
        // Update existing article
        await this.updateDashboardArticle(existingArticle.id, hashnodeArticle);
        console.log(`✅ Updated Dashboard article: ${hashnodeArticle.title}`);
      } else {
        // Create new article
        await this.createDashboardArticle(hashnodeArticle);
        console.log(`✅ Created Dashboard article: ${hashnodeArticle.title}`);
      }

    } catch (error) {
      console.error(`❌ Failed to sync article ${hashnodeId} from Hashnode:`, error);
      throw error;
    }
  }

  /**
   * Handle article published webhook
   */
  private async handleArticlePublished(payload: WebhookPayload): Promise<void> {
    const { post } = payload;
    
    // Check if article exists in Dashboard
    const existingArticle = await this.prisma.article.findFirst({
      where: { hashnodeId: post.id },
    });

    if (!existingArticle) {
      // Create new article in Dashboard
      await this.createDashboardArticleFromHashnode(post.id);
    } else {
      // Update existing article status
      await this.prisma.article.update({
        where: { id: existingArticle.id },
        data: { 
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
      });
    }
  }

  /**
   * Handle article updated webhook
   */
  private async handleArticleUpdated(payload: WebhookPayload): Promise<void> {
    const { post } = payload;
    
    const existingArticle = await this.prisma.article.findFirst({
      where: { hashnodeId: post.id },
    });

    if (existingArticle) {
      // Update article content and metadata
      await this.updateDashboardArticleFromHashnode(existingArticle.id, post.id);
    }
  }

  /**
   * Handle article deleted webhook
   */
  private async handleArticleDeleted(payload: WebhookPayload): Promise<void> {
    const { post } = payload;
    
    const existingArticle = await this.prisma.article.findFirst({
      where: { hashnodeId: post.id },
    });

    if (existingArticle) {
      // Archive or delete article in Dashboard
      await this.prisma.article.update({
        where: { id: existingArticle.id },
        data: { 
          status: 'ARCHIVED',
          hashnodeId: null, // Remove Hashnode reference
        },
      });
    }
  }

  /**
   * Convert Dashboard article to Hashnode format
   */
  private convertDashboardToHashnode(article: any): any {
    return {
      title: article.title,
      slug: article.slug,
      content: article.contentMdx || this.convertJsonToMarkdown(article.contentJson),
      subtitle: article.subtitle,
      coverImageUrl: article.cover?.url,
      tags: article.tags.map((tag: any) => ({
        id: tag.hashnodeId,
        name: tag.name,
        slug: tag.slug,
      })),
      series: article.series ? {
        id: article.series.hashnodeId,
        name: article.series.title,
      } : undefined,
      publishedAt: article.publishedAt,
      isPublished: article.status === 'PUBLISHED',
      metaTags: {
        title: article.metaTitle,
        description: article.metaDescription,
        image: article.ogImageUrl,
      },
      settings: {
        enableTableOfContents: true,
        disableComments: !article.allowComments,
        isNewsletterActivated: false,
        hideFromHashnodeFeed: article.visibility !== 'PUBLIC',
      },
    };
  }

  /**
   * Create Dashboard article from Hashnode data
   */
  private async createDashboardArticle(hashnodeArticle: any): Promise<void> {
    // Implementation for creating Dashboard article from Hashnode data
    // Similar to migration logic but for real-time sync
  }

  /**
   * Update Dashboard article from Hashnode data
   */
  private async updateDashboardArticle(articleId: string, hashnodeArticle: any): Promise<void> {
    // Implementation for updating Dashboard article from Hashnode data
  }

  /**
   * Create Dashboard article from Hashnode ID
   */
  private async createDashboardArticleFromHashnode(hashnodeId: string): Promise<void> {
    // Implementation for creating Dashboard article from Hashnode ID
  }

  /**
   * Update Dashboard article from Hashnode ID
   */
  private async updateDashboardArticleFromHashnode(articleId: string, hashnodeId: string): Promise<void> {
    // Implementation for updating Dashboard article from Hashnode ID
  }

  /**
   * Start sync queue processor
   */
  private startQueueProcessor(): void {
    setInterval(async () => {
      if (this.syncQueue.length > 0 && !this.status.isRunning) {
        await this.processSyncQueue();
      }
    }, 1000);
  }

  /**
   * Process sync queue
   */
  private async processSyncQueue(): Promise<void> {
    this.status.isRunning = true;
    
    while (this.syncQueue.length > 0) {
      const { operation, data, retries } = this.syncQueue.shift()!;
      
      try {
        await this.executeSyncOperation(operation, data);
        this.status.pendingOperations--;
        this.status.totalOperations++;
      } catch (error) {
        if (retries < this.config.retryAttempts) {
          this.syncQueue.push({ operation, data, retries: retries + 1 });
        } else {
          this.status.failedOperations++;
          console.error(`❌ Sync operation failed after ${retries} retries:`, error);
        }
      }
    }
    
    this.status.isRunning = false;
    this.status.lastSync = new Date();
  }

  /**
   * Execute sync operation
   */
  private async executeSyncOperation(operation: string, data: any): Promise<void> {
    // Implementation for executing specific sync operations
  }

  /**
   * Verify webhook signature
   */
  private verifyWebhookSignature(payload: any, signature: string): boolean {
    // Implementation for webhook signature verification
    return true; // Placeholder
  }

  /**
   * Test connections
   */
  private async testConnections(): Promise<void> {
    try {
      await this.prisma.$connect();
      console.log('✅ Database connection successful');
    } catch (error) {
      throw new Error(`Database connection failed: ${error}`);
    }

    try {
      await this.hashnodeClient.testConnection();
      console.log('✅ Hashnode connection successful');
    } catch (error) {
      throw new Error(`Hashnode connection failed: ${error}`);
    }
  }

  /**
   * Convert JSON content to Markdown
   */
  private convertJsonToMarkdown(contentJson: any): string {
    // Implementation for converting JSON content to Markdown
    return '';
  }

  /**
   * Get sync status
   */
  getStatus(): SyncStatus {
    return { ...this.status };
  }

  /**
   * Get sync queue length
   */
  getQueueLength(): number {
    return this.syncQueue.length;
  }

  /**
   * Clear sync queue
   */
  clearQueue(): void {
    this.syncQueue = [];
  }

  /**
   * Stop sync system
   */
  async stop(): Promise<void> {
    this.status.isRunning = false;
    await this.prisma.$disconnect();
    console.log('🛑 Sync system stopped');
  }
}

// Export for use in other modules
export { BidirectionalSync, SyncConfig, SyncEvent, SyncStatus };
