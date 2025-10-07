/**
 * Dev.to Publishing Adapter
 * Handles publishing to Dev.to platform
 */

import { PlatformAdapter, PublishingAnalytics } from '../types';

export class DevToAdapter implements PlatformAdapter {
  name = 'devto';

  async publish(article: any, config: any): Promise<{ url: string; publishedAt: string }> {
    try {
      // Dev.to API endpoint for creating articles
      const response = await fetch('https://dev.to/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.DEVTO_API_KEY || ''
        },
        body: JSON.stringify({
          article: {
            title: article.title,
            body_markdown: article.content,
            published: true,
            tags: article.tags.slice(0, 4), // Dev.to allows max 4 tags
            series: config.series,
            canonical_url: config.canonicalUrl,
            description: article.excerpt,
            main_image: article.coverImage
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Dev.to API error: ${errorData.error || response.statusText}`);
      }

      const result = await response.json();
      
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
      if (!article.devtoId) {
        throw new Error('Article ID for Dev.to is required for updates');
      }

      const response = await fetch(`https://dev.to/api/articles/${article.devtoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.DEVTO_API_KEY || ''
        },
        body: JSON.stringify({
          article: {
            title: article.title,
            body_markdown: article.content,
            tags: article.tags.slice(0, 4),
            series: config.series,
            canonical_url: config.canonicalUrl,
            description: article.excerpt,
            main_image: article.coverImage
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Dev.to API error: ${errorData.error || response.statusText}`);
      }

      const result = await response.json();
      
      return {
        url: result.url,
        updatedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('Dev.to update error:', error);
      throw error;
    }
  }

  async delete(articleId: string): Promise<void> {
    // Dev.to doesn't provide a delete endpoint in their API
    throw new Error('Dev.to does not support deleting articles via API');
  }

  async getAnalytics(articleId: string): Promise<PublishingAnalytics> {
    try {
      // Dev.to provides basic analytics through the article endpoint
      // Note: This would require storing the Dev.to article ID
      return {
        articleId,
        platform: 'devto',
        views: 0,
        likes: 0,
        shares: 0,
        comments: 0,
        engagement: 0,
        lastUpdated: new Date().toISOString(),
        metrics: {
          clickThroughRate: 0,
          bounceRate: 0,
          timeOnPage: 0,
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

