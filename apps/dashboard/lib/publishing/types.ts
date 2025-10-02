/**
 * Publishing System Types
 * Defines the structure for unified publishing workflow
 */

export interface PublishingStatus {
  id: string;
  articleId: string;
  status: 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed' | 'cancelled';
  platforms: PublishingPlatform[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  scheduledFor?: string;
  error?: string;
  retryCount: number;
  metadata?: Record<string, any>;
}

export interface PublishingPlatform {
  id: string;
  name: 'dashboard' | 'hashnode' | 'medium' | 'devto' | 'linkedin';
  enabled: boolean;
  status: 'pending' | 'publishing' | 'published' | 'failed';
  url?: string;
  publishedAt?: string;
  error?: string;
  settings?: Record<string, any>;
}

export interface PublishingOptions {
  platforms: PublishingPlatform[];
  scheduleFor?: string;
  crossPost: boolean;
  tags: string[];
  categories: string[];
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  social: {
    autoShare: boolean;
    platforms: string[];
  };
  analytics: {
    trackViews: boolean;
    trackEngagement: boolean;
  };
}

export interface PublishingTemplate {
  id: string;
  name: string;
  description: string;
  options: PublishingOptions;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PublishingQueue {
  id: string;
  articleId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  platforms: PublishingPlatform[];
  scheduledFor?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  retryCount: number;
  maxRetries: number;
}

export interface PublishingAnalytics {
  articleId: string;
  platform: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  engagement: number;
  lastUpdated: string;
  metrics: {
    clickThroughRate: number;
    bounceRate: number;
    timeOnPage: number;
    conversionRate: number;
  };
}

export interface PublishingWorkflow {
  id: string;
  name: string;
  description: string;
  steps: PublishingStep[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PublishingStep {
  id: string;
  name: string;
  type: 'validation' | 'transformation' | 'publishing' | 'notification';
  platform?: string;
  order: number;
  config: Record<string, any>;
  conditions?: Record<string, any>;
  onSuccess?: string;
  onFailure?: string;
}

export interface PublishingJob {
  id: string;
  articleId: string;
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  currentStep?: string;
  progress: number;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  logs: PublishingLog[];
}

export interface PublishingLog {
  id: string;
  jobId: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Platform-specific configurations
export interface HashnodePublishingConfig {
  publicationId: string;
  tags: string[];
  series?: string;
  canonicalUrl?: string;
  coverImage?: string;
  seo: {
    title?: string;
    description?: string;
  };
}

export interface MediumPublishingConfig {
  tags: string[];
  canonicalUrl?: string;
  license: 'all-rights-reserved' | 'cc-40-by' | 'cc-40-by-sa' | 'cc-40-by-nd' | 'cc-40-by-nc' | 'cc-40-by-nc-sa' | 'cc-40-by-nc-nd' | 'cc-40-zero' | 'public-domain';
  publishStatus: 'public' | 'draft' | 'unlisted';
}

export interface DevToPublishingConfig {
  tags: string[];
  canonicalUrl?: string;
  coverImage?: string;
  series?: string;
}

export interface LinkedInPublishingConfig {
  visibility: 'PUBLIC' | 'CONNECTIONS' | 'LOGGED_IN_MEMBERS';
  categories: string[];
}

// Publishing service interface
export interface PublishingService {
  publish(articleId: string, options: PublishingOptions): Promise<PublishingStatus>;
  schedule(articleId: string, options: PublishingOptions, scheduledFor: string): Promise<PublishingStatus>;
  cancel(publishingId: string): Promise<void>;
  retry(publishingId: string): Promise<PublishingStatus>;
  getStatus(publishingId: string): Promise<PublishingStatus>;
  getAnalytics(articleId: string, platform: string): Promise<PublishingAnalytics>;
}

// Platform adapter interface
export interface PlatformAdapter {
  name: string;
  publish(article: any, config: any): Promise<{ url: string; publishedAt: string }>;
  update(article: any, config: any): Promise<{ url: string; updatedAt: string }>;
  delete(articleId: string): Promise<void>;
  getAnalytics(articleId: string): Promise<PublishingAnalytics>;
  validate(config: any): Promise<{ isValid: boolean; errors: string[] }>;
}
