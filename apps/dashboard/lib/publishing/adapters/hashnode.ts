/**
 * Hashnode Publishing Adapter
 * Handles publishing to Hashnode platform
 */

import { PlatformAdapter, PublishingAnalytics } from '../types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class HashnodeAdapter implements PlatformAdapter {
  name = 'hashnode';

  async publish(article: any, config: any): Promise<{ url: string; publishedAt: string }> {
    try {
      // Hashnode GraphQL mutation for publishing
      const mutation = `
        mutation PublishPost($input: PublishPostInput!) {
          publishPost(input: $input) {
            post {
              id
              url
              publishedAt
            }
          }
        }
      `;

      const variables = {
        input: {
          title: article.title,
          contentMarkdown: article.content,
          tags: article.tags.map((tag: string) => ({ name: tag })),
          publicationId: config.publicationId,
          seriesId: config.series,
          canonicalUrl: config.canonicalUrl,
          coverImageURL: article.coverImage,
          seo: {
            title: article.seo?.title,
            description: article.seo?.description
          }
        }
      };

      const response = await fetch('https://gql.hashnode.com/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': process.env.HASHNODE_API_TOKEN || ''
        },
        body: JSON.stringify({
          query: mutation,
          variables
        })
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(`Hashnode publishing failed: ${result.errors[0].message}`);
      }

      const post = result.data.publishPost.post;
      
      return {
        url: post.url,
        publishedAt: post.publishedAt
      };

    } catch (error) {
      console.error('Hashnode publishing error:', error);
      throw error;
    }
  }

  async update(article: any, config: any): Promise<{ url: string; updatedAt: string }> {
    try {
      // Hashnode GraphQL mutation for updating
      const mutation = `
        mutation UpdatePost($input: UpdatePostInput!) {
          updatePost(input: $input) {
            post {
              id
              url
              updatedAt
            }
          }
        }
      `;

      const variables = {
        input: {
          id: article.hashnodeId,
          title: article.title,
          contentMarkdown: article.content,
          tags: article.tags.map((tag: string) => ({ name: tag })),
          canonicalUrl: config.canonicalUrl,
          coverImageURL: article.coverImage,
          seo: {
            title: article.seo?.title,
            description: article.seo?.description
          }
        }
      };

      const response = await fetch('https://gql.hashnode.com/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': process.env.HASHNODE_API_TOKEN || ''
        },
        body: JSON.stringify({
          query: mutation,
          variables
        })
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(`Hashnode update failed: ${result.errors[0].message}`);
      }

      const post = result.data.updatePost.post;
      
      return {
        url: post.url,
        updatedAt: post.updatedAt
      };

    } catch (error) {
      console.error('Hashnode update error:', error);
      throw error;
    }
  }

  async delete(articleId: string): Promise<void> {
    try {
      // Get Hashnode post ID from database
      const article = await prisma.article.findUnique({
        where: { id: articleId },
        select: { hashnodeId: true }
      });

      if (!article?.hashnodeId) {
        throw new Error('Article not published to Hashnode');
      }

      // Hashnode GraphQL mutation for deletion
      const mutation = `
        mutation DeletePost($id: String!) {
          deletePost(id: $id) {
            success
          }
        }
      `;

      const response = await fetch('https://gql.hashnode.com/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': process.env.HASHNODE_API_TOKEN || ''
        },
        body: JSON.stringify({
          query: mutation,
          variables: { id: article.hashnodeId }
        })
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(`Hashnode deletion failed: ${result.errors[0].message}`);
      }

    } catch (error) {
      console.error('Hashnode deletion error:', error);
      throw error;
    }
  }

  async getAnalytics(articleId: string): Promise<PublishingAnalytics> {
    try {
      // Get Hashnode post ID
      const article = await prisma.article.findUnique({
        where: { id: articleId },
        select: { hashnodeId: true }
      });

      if (!article?.hashnodeId) {
        throw new Error('Article not published to Hashnode');
      }

      // Hashnode GraphQL query for analytics
      const query = `
        query GetPostAnalytics($id: String!) {
          post(id: $id) {
            id
            views
            reactions
            comments
            readTimeInMinutes
            publishedAt
          }
        }
      `;

      const response = await fetch('https://gql.hashnode.com/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': process.env.HASHNODE_API_TOKEN || ''
        },
        body: JSON.stringify({
          query,
          variables: { id: article.hashnodeId }
        })
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(`Hashnode analytics failed: ${result.errors[0].message}`);
      }

      const post = result.data.post;
      
      return {
        articleId,
        platform: 'hashnode',
        views: post.views || 0,
        likes: post.reactions || 0,
        shares: 0, // Hashnode doesn't provide shares data
        comments: post.comments || 0,
        engagement: (post.reactions || 0) + (post.comments || 0),
        lastUpdated: new Date().toISOString(),
        metrics: {
          clickThroughRate: 0,
          bounceRate: 0,
          timeOnPage: post.readTimeInMinutes * 60,
          conversionRate: 0
        }
      };

    } catch (error) {
      console.error('Hashnode analytics error:', error);
      throw error;
    }
  }

  async validate(config: any): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!config.publicationId) {
      errors.push('Publication ID is required');
    }

    if (!process.env.HASHNODE_API_TOKEN) {
      errors.push('Hashnode API token is not configured');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
