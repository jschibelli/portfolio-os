/**
 * LinkedIn Publishing Adapter
 * Handles publishing articles to LinkedIn
 */

import { PlatformAdapter, PublishingAnalytics } from '../types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class LinkedInAdapter implements PlatformAdapter {
  name = 'linkedin';

  async publish(article: any, config: any): Promise<{ url: string; publishedAt: string }> {
    try {
      const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
      const authorId = process.env.LINKEDIN_AUTHOR_ID;

      if (!accessToken || !authorId) {
        throw new Error('LinkedIn credentials not configured');
      }

      // LinkedIn requires articles to be created via the Articles API
      // Note: This is a simplified version - actual implementation may vary
      const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0'
        },
        body: JSON.stringify({
          author: `urn:li:person:${authorId}`,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: {
                text: article.excerpt || article.title
              },
              shareMediaCategory: 'ARTICLE',
              media: [
                {
                  status: 'READY',
                  description: {
                    text: article.excerpt
                  },
                  originalUrl: config.articleUrl || article.url,
                  title: {
                    text: article.title
                  }
                }
              ]
            }
          },
          visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': config.visibility || 'PUBLIC'
          }
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`LinkedIn publishing failed: ${error}`);
      }

      const result = await response.json();
      const postId = result.id;

      // Store LinkedIn post ID for future reference
      await prisma.article.update({
        where: { id: article.id },
        data: {
          metadata: {
            linkedinId: postId
          }
        }
      });

      // LinkedIn doesn't return a direct URL, construct one
      const url = `https://www.linkedin.com/feed/update/${postId}`;

      return {
        url,
        publishedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('LinkedIn publishing error:', error);
      throw error;
    }
  }

  async update(article: any, config: any): Promise<{ url: string; updatedAt: string }> {
    // LinkedIn doesn't support updating posts via API
    // Posts are immutable once published
    throw new Error('LinkedIn does not support updating published posts via API');
  }

  async delete(articleId: string): Promise<void> {
    try {
      const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;

      if (!accessToken) {
        throw new Error('LinkedIn access token not configured');
      }

      // Get stored LinkedIn post ID
      const storedArticle = await prisma.article.findUnique({
        where: { id: articleId },
        select: { metadata: true }
      });

      const linkedinId = (storedArticle?.metadata as any)?.linkedinId;
      if (!linkedinId) {
        throw new Error('Article not published to LinkedIn');
      }

      // Delete the post
      const response = await fetch(`https://api.linkedin.com/v2/ugcPosts/${linkedinId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`LinkedIn deletion failed: ${error}`);
      }

    } catch (error) {
      console.error('LinkedIn deletion error:', error);
      throw error;
    }
  }

  async getAnalytics(articleId: string): Promise<PublishingAnalytics> {
    try {
      const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;

      if (!accessToken) {
        throw new Error('LinkedIn access token not configured');
      }

      // Get stored LinkedIn post ID
      const storedArticle = await prisma.article.findUnique({
        where: { id: articleId },
        select: { metadata: true }
      });

      const linkedinId = (storedArticle?.metadata as any)?.linkedinId;
      if (!linkedinId) {
        throw new Error('Article not published to LinkedIn');
      }

      // Fetch post analytics
      // Note: LinkedIn analytics requires additional permissions and may have rate limits
      const response = await fetch(
        `https://api.linkedin.com/v2/socialActions/${linkedinId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0'
          }
        }
      );

      if (!response.ok) {
        // If analytics fetch fails, return zeros
        return {
          articleId,
          platform: 'linkedin',
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

      const stats = await response.json();

      return {
        articleId,
        platform: 'linkedin',
        views: stats.impressionCount || 0,
        likes: stats.likeCount || 0,
        shares: stats.shareCount || 0,
        comments: stats.commentCount || 0,
        engagement: (stats.likeCount || 0) + (stats.shareCount || 0) + (stats.commentCount || 0),
        lastUpdated: new Date().toISOString(),
        metrics: {
          clickThroughRate: stats.clickCount / (stats.impressionCount || 1),
          bounceRate: 0,
          timeOnPage: 0,
          conversionRate: 0
        }
      };

    } catch (error) {
      console.error('LinkedIn analytics error:', error);
      throw error;
    }
  }

  async validate(config: any): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!process.env.LINKEDIN_ACCESS_TOKEN) {
      errors.push('LinkedIn access token is not configured');
    }

    if (!process.env.LINKEDIN_AUTHOR_ID) {
      errors.push('LinkedIn author ID is not configured');
    }

    if (config.visibility && !['PUBLIC', 'CONNECTIONS', 'LOGGED_IN_MEMBERS'].includes(config.visibility)) {
      errors.push('Invalid visibility. Must be PUBLIC, CONNECTIONS, or LOGGED_IN_MEMBERS');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
