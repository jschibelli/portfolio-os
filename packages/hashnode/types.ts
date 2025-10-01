/**
 * Hashnode API Types
 * Type definitions for Hashnode GraphQL API integration
 */

export interface HashnodeConfig {
  apiToken: string;
  publicationId: string;
  apiUrl?: string;
}

export interface HashnodeArticle {
  id?: string;
  title: string;
  slug: string;
  content: string;
  subtitle?: string;
  coverImageUrl?: string;
  tags?: HashnodeTag[];
  series?: {
    id: string;
    name: string;
  };
  publishedAt?: Date;
  isPublished: boolean;
  metaTags?: {
    title?: string;
    description?: string;
    image?: string;
  };
  settings?: {
    enableTableOfContents?: boolean;
    disableComments?: boolean;
    isNewsletterActivated?: boolean;
    hideFromHashnodeFeed?: boolean;
  };
}

export interface HashnodeTag {
  id?: string;
  name: string;
  slug: string;
  hashnodeId?: string;
}

export interface HashnodeResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    extensions?: Record<string, any>;
  }>;
}

export interface CreatePostResponse {
  publishPost: {
    post: {
      id: string;
      title: string;
      slug: string;
      url: string;
      publishedAt?: string;
    };
  };
}

export interface UpdatePostResponse {
  updatePost: {
    post: {
      id: string;
      title: string;
      slug: string;
      url: string;
      updatedAt: string;
    };
  };
}

export interface DeletePostResponse {
  removePost: {
    post: {
      id: string;
    };
  };
}

export interface PublishPostResponse {
  publishPost: {
    post: {
      id: string;
      url: string;
      publishedAt: string;
    };
  };
}

export interface SchedulePostResponse {
  schedulePost: {
    scheduledPost: {
      id: string;
      scheduledDate: string;
    };
  };
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
}

export interface HashnodeError extends Error {
  statusCode?: number;
  type?: 'RATE_LIMIT' | 'AUTH_ERROR' | 'VALIDATION_ERROR' | 'NETWORK_ERROR' | 'UNKNOWN_ERROR';
  retryAfter?: number;
  details?: any;
}

export interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

export interface WebhookPayload {
  event: 'POST_PUBLISHED' | 'POST_UPDATED' | 'POST_DELETED';
  post: {
    id: string;
    title: string;
    slug: string;
    url: string;
  };
  publication: {
    id: string;
    title: string;
  };
  timestamp: string;
}

