/**
 * Dashboard Publishing Adapter
 * Handles publishing to our own Dashboard platform
 */

import { PlatformAdapter, PublishingAnalytics } from '../types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DashboardAdapter implements PlatformAdapter {
  name = 'dashboard';

  async publish(article: any, config: any): Promise<{ url: string; publishedAt: string }> {
    try {
      // Update article status to published
      const updatedArticle = await prisma.article.update({
        where: { id: article.id },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date(),
          visibility: 'PUBLIC'
        }
      });

      // Generate public URL
      const url = `${process.env.SITE_URL || 'http://localhost:3000'}/blog/${article.slug}`;

      return {
        url,
        publishedAt: updatedArticle.publishedAt?.toISOString() || new Date().toISOString()
      };

    } catch (error) {
      console.error('Dashboard publishing error:', error);
      throw error;
    }
  }

  async update(article: any, config: any): Promise<{ url: string; updatedAt: string }> {
    try {
      // Update article content
      const updatedArticle = await prisma.article.update({
        where: { id: article.id },
        data: {
          title: article.title,
          contentMdx: article.content,
          excerpt: article.excerpt,
          updatedAt: new Date()
        }
      });

      // Generate public URL
      const url = `${process.env.SITE_URL || 'http://localhost:3000'}/blog/${article.slug}`;

      return {
        url,
        updatedAt: updatedArticle.updatedAt.toISOString()
      };

    } catch (error) {
      console.error('Dashboard update error:', error);
      throw error;
    }
  }

  async delete(articleId: string): Promise<void> {
    try {
      // Update article status to draft or delete
      await prisma.article.update({
        where: { id: articleId },
        data: {
          status: 'DRAFT',
          visibility: 'PRIVATE'
        }
      });

    } catch (error) {
      console.error('Dashboard deletion error:', error);
      throw error;
    }
  }

  async getAnalytics(articleId: string): Promise<PublishingAnalytics> {
    try {
      // Get article analytics from database
      const article = await prisma.article.findUnique({
        where: { id: articleId },
        select: {
          views: true,
          publishedAt: true,
          updatedAt: true
        }
      });

      if (!article) {
        throw new Error('Article not found');
      }

      // Calculate engagement metrics (simplified)
      const views = article.views || 0;
      const engagement = Math.floor(views * 0.1); // Estimate 10% engagement

      return {
        articleId,
        platform: 'dashboard',
        views,
        likes: 0, // Not tracked in current system
        shares: 0, // Not tracked in current system
        comments: 0, // Not tracked in current system
        engagement,
        lastUpdated: article.updatedAt.toISOString(),
        metrics: {
          clickThroughRate: 0,
          bounceRate: 0,
          timeOnPage: 180, // 3 minutes average
          conversionRate: 0
        }
      };

    } catch (error) {
      console.error('Dashboard analytics error:', error);
      throw error;
    }
  }

  async validate(config: any): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Dashboard adapter doesn't require external configuration
    // All validation passes by default

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
