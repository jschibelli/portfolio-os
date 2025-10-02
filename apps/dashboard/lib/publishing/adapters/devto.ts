/**
 * Dev.to Publishing Adapter
 * Handles publishing to Dev.to platform
 */

import { PlatformAdapter, PublishingAnalytics } from '../types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DevToAdapter implements PlatformAdapter {
  name = 'devto';

  async publish(article: any, config: any): Promise<{ url: string; publishedAt: string }> {
    try {
      const apiKey = process.env.DEVTO_API_KEY;

      if (!apiKey) {
        throw new Error('Dev.to API key not configured');
      }

      const response = await fetch('https://dev.to/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey
        },
        body: JSON.stringify({
          article: {
            title: article.title,
            body_markdown: article.content,
            published: true,
            tags: article.tags.slice(0, 4), // Dev.to allows max 4 tags
            series: config.series,
            canonical_url: config.canonicalUrl,
            main_image: article.coverImage,
            description: article.excerpt
          }
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Dev.to publishing failed: ${error}`);
      }

      const result = await response.json();

      // Store Dev.to article ID for future updates
      await prisma.article.update({
        where: { id: article.id },
        data: {
          metadata: {
            devtoId: result.id
          }
        }
      });

      return {
        url: result.url,
        publishedAt: result.published_at || new Date().toISOString()
      };

    } catch (error) {
      console.error('Dev.to publishing error:', error);
      throw error;
    }
  }

  async update(article: any, config: any): Promise<{ url: string; updatedAt: string }> {
    try {
      const apiKey = process.env.DEVTO_API_KEY;

      if (!apiKey) {
        throw new Error('Dev.to API key not configured');
      }

      // Get stored Dev.to article ID
      const storedArticle = await prisma.article.findUnique({
        where: { id: article.id },
        select: { metadata: true }
      });

      const devtoId = (storedArticle?.metadata as any)?.devtoId;
      if (!devtoId) {
        throw new Error('Article not published to Dev.to');
      }

      const response = await fetch(`https://dev.to/api/articles/${devtoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey
        },
        body: JSON.stringify({
          article: {
            title: article.title,
            body_markdown: article.content,
            tags: article.tags.slice(0, 4),
            series: config.series,
            canonical_url: config.canonicalUrl,
            main_image: article.coverImage,
            description: article.excerpt
          }
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Dev.to update failed: ${error}`);
      }

      const result = await response.json();

      return {
        url: result.url,
        updatedAt: result.edited_at || new Date().toISOString()
      };

    } catch (error) {
      console.error('Dev.to update error:', error);
      throw error;
    }
  }

  async delete(articleId: string): Promise<void> {
    try {
      const apiKey = process.env.DEVTO_API_KEY;

      if (!apiKey) {
        throw new Error('Dev.to API key not configured');
      }

      // Get stored Dev.to article ID
      const storedArticle = await prisma.article.findUnique({
        where: { id: articleId },
        select: { metadata: true }
      });

      const devtoId = (storedArticle?.metadata as any)?.devtoId;
      if (!devtoId) {
        throw new Error('Article not published to Dev.to');
      }

      // Dev.to doesn't have a delete endpoint, we unpublish instead
      await fetch(`https://dev.to/api/articles/${devtoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey
        },
        body: JSON.stringify({
          article: {
            published: false
          }
        })
      });

    } catch (error) {
      console.error('Dev.to deletion error:', error);
      throw error;
    }
  }

  async getAnalytics(articleId: string): Promise<PublishingAnalytics> {
    try {
      const apiKey = process.env.DEVTO_API_KEY;

      if (!apiKey) {
        throw new Error('Dev.to API key not configured');
      }

      // Get stored Dev.to article ID
      const storedArticle = await prisma.article.findUnique({
        where: { id: articleId },
        select: { metadata: true }
      });

      const devtoId = (storedArticle?.metadata as any)?.devtoId;
      if (!devtoId) {
        throw new Error('Article not published to Dev.to');
      }

      // Fetch article details
      const response = await fetch(`https://dev.to/api/articles/${devtoId}`, {
        headers: {
          'api-key': apiKey
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Dev.to analytics');
      }

      const article = await response.json();

      return {
        articleId,
        platform: 'devto',
        views: article.page_views_count || 0,
        likes: article.public_reactions_count || 0,
        shares: 0, // Dev.to doesn't provide share count
        comments: article.comments_count || 0,
        engagement: (article.public_reactions_count || 0) + (article.comments_count || 0),
        lastUpdated: new Date().toISOString(),
        metrics: {
          clickThroughRate: 0,
          bounceRate: 0,
          timeOnPage: article.reading_time_minutes * 60,
          conversionRate: 0
        }
      };

    } catch (error) {
      console.error('Dev.to analytics error:', error);
      throw error;
    }
  }

  async validate(config: any): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!process.env.DEVTO_API_KEY) {
      errors.push('Dev.to API key is not configured');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
