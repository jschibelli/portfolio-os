/**
 * Hashnode API Client
 * Main client for interacting with Hashnode's GraphQL API
 */

import { GraphQLClient } from 'graphql-request';
import {
  HashnodeConfig,
  HashnodeArticle,
  CreatePostResponse,
  UpdatePostResponse,
  DeletePostResponse,
  SchedulePostResponse,
  RateLimitInfo,
  RetryConfig,
} from './types';
import {
  CREATE_POST_MUTATION,
  UPDATE_POST_MUTATION,
  DELETE_POST_MUTATION,
  SCHEDULE_POST_MUTATION,
  GET_POST_QUERY,
  GET_PUBLICATION_QUERY,
} from './graphql-queries';
import {
  withRetry,
  validateApiToken,
  parseHashnodeError,
  logError,
  defaultRetryConfig,
} from './error-handler';

export class HashnodeClient {
  private client: GraphQLClient;
  private config: HashnodeConfig;
  private rateLimitInfo?: RateLimitInfo;
  private retryConfig: RetryConfig;

  constructor(config: HashnodeConfig, retryConfig: RetryConfig = defaultRetryConfig) {
    if (!validateApiToken(config.apiToken)) {
      throw new Error('Invalid Hashnode API token format');
    }

    if (!config.publicationId) {
      throw new Error('Publication ID is required');
    }

    this.config = {
      ...config,
      apiUrl: config.apiUrl || 'https://gql.hashnode.com',
    };

    this.client = new GraphQLClient(this.config.apiUrl!, {
      headers: {
        'Authorization': config.apiToken,
        'Content-Type': 'application/json',
      },
    });

    this.retryConfig = retryConfig;
  }

  /**
   * Updates rate limit information from response headers
   */
  private updateRateLimitInfo(headers: Headers): void {
    const limit = headers.get('X-RateLimit-Limit');
    const remaining = headers.get('X-RateLimit-Remaining');
    const reset = headers.get('X-RateLimit-Reset');

    if (limit && remaining && reset) {
      this.rateLimitInfo = {
        limit: parseInt(limit),
        remaining: parseInt(remaining),
        reset: new Date(parseInt(reset) * 1000),
      };
    }
  }

  /**
   * Gets current rate limit information
   */
  public getRateLimitInfo(): RateLimitInfo | undefined {
    return this.rateLimitInfo;
  }

  /**
   * Creates and publishes a new post on Hashnode
   */
  public async createPost(article: HashnodeArticle): Promise<CreatePostResponse> {
    try {
      const input = {
        publicationId: this.config.publicationId,
        title: article.title,
        slug: article.slug,
        contentMarkdown: article.content,
        subtitle: article.subtitle,
        coverImageOptions: article.coverImageUrl
          ? { coverImageURL: article.coverImageUrl }
          : undefined,
        tags: article.tags?.map(tag => ({
          id: tag.id,
          name: tag.name,
          slug: tag.slug,
        })),
        seriesId: article.series?.id,
        publishedAt: article.publishedAt?.toISOString(),
        metaTags: article.metaTags,
        settings: article.settings,
      };

      const response = await withRetry(
        () => this.client.request<CreatePostResponse>(CREATE_POST_MUTATION, { input }),
        this.retryConfig
      );

      console.log('[Hashnode] Post created successfully:', response.publishPost.post.id);
      return response;
    } catch (error) {
      const hashnodeError = parseHashnodeError(error);
      logError(hashnodeError, { operation: 'createPost', article: article.title });
      throw hashnodeError;
    }
  }

  /**
   * Updates an existing post on Hashnode
   */
  public async updatePost(postId: string, article: Partial<HashnodeArticle>): Promise<UpdatePostResponse> {
    try {
      const input = {
        id: postId,
        title: article.title,
        slug: article.slug,
        contentMarkdown: article.content,
        subtitle: article.subtitle,
        coverImageOptions: article.coverImageUrl
          ? { coverImageURL: article.coverImageUrl }
          : undefined,
        tags: article.tags?.map(tag => ({
          id: tag.id,
          name: tag.name,
          slug: tag.slug,
        })),
        seriesId: article.series?.id,
        metaTags: article.metaTags,
        settings: article.settings,
      };

      const response = await withRetry(
        () => this.client.request<UpdatePostResponse>(UPDATE_POST_MUTATION, { input }),
        this.retryConfig
      );

      console.log('[Hashnode] Post updated successfully:', postId);
      return response;
    } catch (error) {
      const hashnodeError = parseHashnodeError(error);
      logError(hashnodeError, { operation: 'updatePost', postId });
      throw hashnodeError;
    }
  }

  /**
   * Deletes a post from Hashnode
   */
  public async deletePost(postId: string): Promise<DeletePostResponse> {
    try {
      const input = { id: postId };

      const response = await withRetry(
        () => this.client.request<DeletePostResponse>(DELETE_POST_MUTATION, { input }),
        this.retryConfig
      );

      console.log('[Hashnode] Post deleted successfully:', postId);
      return response;
    } catch (error) {
      const hashnodeError = parseHashnodeError(error);
      logError(hashnodeError, { operation: 'deletePost', postId });
      throw hashnodeError;
    }
  }

  /**
   * Schedules a post for future publication
   */
  public async schedulePost(postId: string, scheduledDate: Date): Promise<SchedulePostResponse> {
    try {
      const input = {
        id: postId,
        scheduledDate: scheduledDate.toISOString(),
      };

      const response = await withRetry(
        () => this.client.request<SchedulePostResponse>(SCHEDULE_POST_MUTATION, { input }),
        this.retryConfig
      );

      console.log('[Hashnode] Post scheduled successfully:', postId, 'for', scheduledDate);
      return response;
    } catch (error) {
      const hashnodeError = parseHashnodeError(error);
      logError(hashnodeError, { operation: 'schedulePost', postId, scheduledDate });
      throw hashnodeError;
    }
  }

  /**
   * Gets a post from Hashnode by ID
   */
  public async getPost(postId: string): Promise<any> {
    try {
      const response = await withRetry(
        () => this.client.request(GET_POST_QUERY, { id: postId }),
        this.retryConfig
      );

      return response;
    } catch (error) {
      const hashnodeError = parseHashnodeError(error);
      logError(hashnodeError, { operation: 'getPost', postId });
      throw hashnodeError;
    }
  }

  /**
   * Gets publication details
   */
  public async getPublication(host: string): Promise<any> {
    try {
      const response = await withRetry(
        () => this.client.request(GET_PUBLICATION_QUERY, { host }),
        this.retryConfig
      );

      return response;
    } catch (error) {
      const hashnodeError = parseHashnodeError(error);
      logError(hashnodeError, { operation: 'getPublication', host });
      throw hashnodeError;
    }
  }

  /**
   * Publishes a draft post
   */
  public async publishPost(article: HashnodeArticle): Promise<CreatePostResponse> {
    return this.createPost({ ...article, isPublished: true });
  }

  /**
   * Unpublishes a post (converts to draft)
   */
  public async unpublishPost(postId: string): Promise<UpdatePostResponse> {
    return this.updatePost(postId, { isPublished: false });
  }

  /**
   * Syncs article metadata (tags, series, SEO)
   */
  public async syncMetadata(postId: string, article: Partial<HashnodeArticle>): Promise<UpdatePostResponse> {
    return this.updatePost(postId, {
      tags: article.tags,
      series: article.series,
      metaTags: article.metaTags,
    });
  }

  /**
   * Checks if client is properly authenticated
   */
  public async testConnection(): Promise<boolean> {
    try {
      await this.client.request(GET_PUBLICATION_QUERY, { host: 'hashnode.com' });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Updates the API token
   */
  public updateToken(newToken: string): void {
    if (!validateApiToken(newToken)) {
      throw new Error('Invalid Hashnode API token format');
    }

    this.config.apiToken = newToken;
    this.client = new GraphQLClient(this.config.apiUrl!, {
      headers: {
        'Authorization': newToken,
        'Content-Type': 'application/json',
      },
    });
  }
}

/**
 * Factory function to create a Hashnode client
 */
export function createHashnodeClient(config: HashnodeConfig): HashnodeClient {
  return new HashnodeClient(config);
}

