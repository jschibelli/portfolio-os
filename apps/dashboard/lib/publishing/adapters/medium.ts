/**
 * Medium Publishing Adapter
 * Handles publishing to Medium platform
 */

import { PlatformAdapter, PublishingAnalytics } from '../types';

export class MediumAdapter implements PlatformAdapter {
  name = 'medium';

  async publish(article: any, config: any): Promise<{ url: string; publishedAt: string }> {
    try {
      // Medium API endpoint for creating posts
      const response = await fetch('https://api.medium.com/v1/users/me/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MEDIUM_API_TOKEN || ''}`
        },
        body: JSON.stringify({
          title: article.title,
          contentFormat: 'markdown',
          content: article.content,
          tags: article.tags,
          canonicalUrl: config.canonicalUrl,
          publishStatus: config.publishStatus || 'public',
          license: config.license || 'all-rights-reserved',
          notifyFollowers: config.notifyFollowers !== false
        })
      });

      if (!response.ok) {
        throw new Error(`Medium API error: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        url: result.data.url,
        publishedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('Medium publishing error:', error);
      throw error;
    }
  }

  async update(article: any, config: any): Promise<{ url: string; updatedAt: string }> {
    // Medium doesn't support updating posts via API
    throw new Error('Medium does not support updating posts via API');
  }

  async delete(articleId: string): Promise<void> {
    // Medium doesn't support deleting posts via API
    throw new Error('Medium does not support deleting posts via API');
  }

  async getAnalytics(articleId: string): Promise<PublishingAnalytics> {
    // Medium API doesn't provide analytics
    return {
      articleId,
      platform: 'medium',
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
  }

  async validate(config: any): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!process.env.MEDIUM_API_TOKEN) {
      errors.push('Medium API token is not configured');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

