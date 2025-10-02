/**
 * Medium Publishing Adapter
 * Handles publishing to Medium platform
 */

import { PlatformAdapter, PublishingAnalytics } from '../types';

export class MediumAdapter implements PlatformAdapter {
  name = 'medium';

  async publish(article: any, config: any): Promise<{ url: string; publishedAt: string }> {
    try {
      // Medium API endpoint
      const userId = process.env.MEDIUM_USER_ID;
      const accessToken = process.env.MEDIUM_ACCESS_TOKEN;

      if (!userId || !accessToken) {
        throw new Error('Medium credentials not configured');
      }

      const response = await fetch(`https://api.medium.com/v1/users/${userId}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          title: article.title,
          contentFormat: 'markdown',
          content: article.content,
          tags: article.tags.slice(0, 5), // Medium allows max 5 tags
          publishStatus: config.publishStatus || 'public',
          license: config.license || 'all-rights-reserved',
          canonicalUrl: config.canonicalUrl
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Medium publishing failed: ${error}`);
      }

      const result = await response.json();
      const post = result.data;

      return {
        url: post.url,
        publishedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('Medium publishing error:', error);
      throw error;
    }
  }

  async update(article: any, config: any): Promise<{ url: string; updatedAt: string }> {
    // Medium doesn't support updating posts via API
    // We need to delete and recreate, or return an error
    throw new Error('Medium does not support updating published posts via API');
  }

  async delete(articleId: string): Promise<void> {
    // Medium doesn't provide API for deleting posts
    throw new Error('Medium does not support deleting posts via API');
  }

  async getAnalytics(articleId: string): Promise<PublishingAnalytics> {
    // Medium doesn't provide analytics via API for individual posts
    // Return basic structure with zeros
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

    if (!process.env.MEDIUM_USER_ID) {
      errors.push('Medium User ID is not configured');
    }

    if (!process.env.MEDIUM_ACCESS_TOKEN) {
      errors.push('Medium Access Token is not configured');
    }

    if (config.publishStatus && !['public', 'draft', 'unlisted'].includes(config.publishStatus)) {
      errors.push('Invalid publish status. Must be public, draft, or unlisted');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
