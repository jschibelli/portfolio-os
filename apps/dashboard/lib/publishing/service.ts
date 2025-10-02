/**
 * Publishing Service
 * Main service for managing unified publishing workflow
 */

import { 
  PublishingService, 
  PublishingStatus, 
  PublishingOptions, 
  PublishingPlatform,
  PublishingAnalytics,
  PublishingQueue,
  PublishingJob
} from './types';
import { PrismaClient } from '@prisma/client';
import { HashnodeAdapter } from './adapters/hashnode';
import { MediumAdapter } from './adapters/medium';
import { DevToAdapter } from './adapters/devto';
import { LinkedInAdapter } from './adapters/linkedin';
import { DashboardAdapter } from './adapters/dashboard';

const prisma = new PrismaClient();

export class UnifiedPublishingService implements PublishingService {
  private adapters: Map<string, any> = new Map();

  constructor() {
    // Initialize platform adapters
    this.adapters.set('hashnode', new HashnodeAdapter());
    this.adapters.set('medium', new MediumAdapter());
    this.adapters.set('devto', new DevToAdapter());
    this.adapters.set('linkedin', new LinkedInAdapter());
    this.adapters.set('dashboard', new DashboardAdapter());
  }

  async publish(articleId: string, options: PublishingOptions): Promise<PublishingStatus> {
    try {
      // Get article data
      const article = await prisma.article.findUnique({
        where: { id: articleId },
        include: {
          author: true,
          tags: {
            include: {
              tag: true
            }
          }
        }
      });

      if (!article) {
        throw new Error(`Article ${articleId} not found`);
      }

      // Create publishing status record
      const publishingStatus = await prisma.publishingStatus.create({
        data: {
          articleId,
          status: 'publishing',
          platforms: options.platforms,
          retryCount: 0
        }
      });

      // Process each platform
      const results: PublishingPlatform[] = [];
      
      for (const platform of options.platforms) {
        if (!platform.enabled) continue;

        try {
          const adapter = this.adapters.get(platform.name);
          if (!adapter) {
            throw new Error(`No adapter found for platform: ${platform.name}`);
          }

          // Transform article for platform
          const transformedArticle = await this.transformArticleForPlatform(article, platform);
          
          // Publish to platform
          const result = await adapter.publish(transformedArticle, platform.settings);
          
          results.push({
            ...platform,
            status: 'published',
            url: result.url,
            publishedAt: result.publishedAt
          });

        } catch (error) {
          console.error(`Failed to publish to ${platform.name}:`, error);
          results.push({
            ...platform,
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      // Update publishing status
      const finalStatus = results.every(r => r.status === 'published') ? 'published' : 'failed';
      
      await prisma.publishingStatus.update({
        where: { id: publishingStatus.id },
        data: {
          status: finalStatus,
          platforms: results,
          publishedAt: finalStatus === 'published' ? new Date().toISOString() : undefined,
          error: finalStatus === 'failed' ? 'One or more platforms failed to publish' : undefined
        }
      });

      return publishingStatus;

    } catch (error) {
      console.error('Publishing failed:', error);
      throw error;
    }
  }

  async schedule(articleId: string, options: PublishingOptions, scheduledFor: string): Promise<PublishingStatus> {
    // Create scheduled publishing job
    const publishingStatus = await prisma.publishingStatus.create({
      data: {
        articleId,
        status: 'scheduled',
        platforms: options.platforms,
        scheduledFor: new Date(scheduledFor).toISOString(),
        retryCount: 0
      }
    });

    // Add to publishing queue
    await prisma.publishingQueue.create({
      data: {
        articleId,
        status: 'pending',
        priority: 'normal',
        platforms: options.platforms,
        scheduledFor: new Date(scheduledFor).toISOString(),
        retryCount: 0,
        maxRetries: 3
      }
    });

    return publishingStatus;
  }

  async cancel(publishingId: string): Promise<void> {
    await prisma.publishingStatus.update({
      where: { id: publishingId },
      data: {
        status: 'cancelled',
        updatedAt: new Date().toISOString()
      }
    });

    // Remove from queue if scheduled
    await prisma.publishingQueue.deleteMany({
      where: {
        articleId: {
          in: await prisma.publishingStatus.findUnique({
            where: { id: publishingId },
            select: { articleId: true }
          }).then(status => status ? [status.articleId] : [])
        }
      }
    });
  }

  async retry(publishingId: string): Promise<PublishingStatus> {
    const status = await prisma.publishingStatus.findUnique({
      where: { id: publishingId }
    });

    if (!status) {
      throw new Error(`Publishing status ${publishingId} not found`);
    }

    if (status.status !== 'failed') {
      throw new Error(`Cannot retry publishing status in ${status.status} state`);
    }

    // Reset status and retry
    const updatedStatus = await prisma.publishingStatus.update({
      where: { id: publishingId },
      data: {
        status: 'publishing',
        retryCount: status.retryCount + 1,
        error: undefined,
        updatedAt: new Date().toISOString()
      }
    });

    // Re-publish
    return this.publish(status.articleId, {
      platforms: status.platforms,
      crossPost: true,
      tags: [],
      categories: [],
      seo: {},
      social: { autoShare: false, platforms: [] },
      analytics: { trackViews: true, trackEngagement: true }
    });
  }

  async getStatus(publishingId: string): Promise<PublishingStatus> {
    const status = await prisma.publishingStatus.findUnique({
      where: { id: publishingId }
    });

    if (!status) {
      throw new Error(`Publishing status ${publishingId} not found`);
    }

    return status;
  }

  async getAnalytics(articleId: string, platform: string): Promise<PublishingAnalytics> {
    const adapter = this.adapters.get(platform);
    if (!adapter) {
      throw new Error(`No adapter found for platform: ${platform}`);
    }

    return adapter.getAnalytics(articleId);
  }

  private async transformArticleForPlatform(article: any, platform: PublishingPlatform) {
    // Base transformation
    const transformed = {
      id: article.id,
      title: article.title,
      content: article.contentMdx,
      excerpt: article.excerpt,
      slug: article.slug,
      publishedAt: article.publishedAt,
      author: {
        name: article.author?.name,
        email: article.author?.email,
        bio: article.author?.bio
      },
      tags: article.tags.map((t: any) => t.tag.name),
      coverImage: article.coverImage,
      seo: {
        title: article.seoTitle,
        description: article.seoDescription,
        keywords: article.seoKeywords
      }
    };

    // Platform-specific transformations
    switch (platform.name) {
      case 'hashnode':
        return {
          ...transformed,
          publicationId: platform.settings?.publicationId,
          series: platform.settings?.series,
          canonicalUrl: platform.settings?.canonicalUrl
        };
      
      case 'medium':
        return {
          ...transformed,
          license: platform.settings?.license || 'all-rights-reserved',
          publishStatus: platform.settings?.publishStatus || 'public'
        };
      
      case 'devto':
        return {
          ...transformed,
          series: platform.settings?.series
        };
      
      case 'linkedin':
        return {
          ...transformed,
          visibility: platform.settings?.visibility || 'PUBLIC',
          categories: platform.settings?.categories || []
        };
      
      default:
        return transformed;
    }
  }
}

// Export singleton instance
export const publishingService = new UnifiedPublishingService();
