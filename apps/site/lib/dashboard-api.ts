/**
 * Dashboard API Client
 * Fetches content from Dashboard public API endpoints
 */

export interface DashboardPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  wordCount: number;
  views: number;
  featured: boolean;
  author: {
    name: string;
    email: string;
    bio: string;
    avatar: string;
  };
  cover: {
    url: string;
    alt: string;
  } | null;
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

export interface DashboardPublication {
  name: string;
  description: string;
  url: string;
  logo: string | null;
  favicon: string | null;
  socialLinks: Record<string, string>;
  seoSettings: Record<string, any>;
  stats: {
    totalPosts: number;
    lastUpdated: string;
  };
}

export interface DashboardPostsResponse {
  posts: DashboardPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class DashboardAPIClient {
  private baseUrl: string;
  private apiSecret: string;

  constructor() {
    this.baseUrl = process.env.DASHBOARD_API_URL || 'http://localhost:3001';
    this.apiSecret = process.env.DASHBOARD_API_SECRET || '';
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}/api/public${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...(this.apiSecret && { 'Authorization': `Bearer ${this.apiSecret}` }),
      ...options.headers,
    };

    try {
      // Add 2 second timeout to prevent hanging during build
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);
      
      const response = await fetch(url, {
        ...options,
        headers,
        next: { revalidate: 60 }, // Cache for 1 minute
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Dashboard API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error(`Dashboard API request to ${endpoint} timed out after 2 seconds`);
        throw new Error('Dashboard API timeout');
      }
      console.error(`Dashboard API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Get all posts with pagination and filtering
   */
  async getPosts(params: {
    page?: number;
    limit?: number;
    search?: string;
    tag?: string;
    featured?: boolean;
  } = {}): Promise<DashboardPostsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.search) searchParams.set('search', params.search);
    if (params.tag) searchParams.set('tag', params.tag);
    if (params.featured !== undefined) searchParams.set('featured', params.featured.toString());

    const queryString = searchParams.toString();
    const endpoint = `/posts${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest<DashboardPostsResponse>(endpoint);
  }

  /**
   * Get a single post by slug
   */
  async getPost(slug: string): Promise<DashboardPost> {
    return this.makeRequest<DashboardPost>(`/posts/${slug}`);
  }

  /**
   * Get publication information
   */
  async getPublication(): Promise<DashboardPublication> {
    return this.makeRequest<DashboardPublication>('/publication');
  }

  /**
   * Get featured posts
   */
  async getFeaturedPosts(limit: number = 5): Promise<DashboardPost[]> {
    const response = await this.getPosts({ featured: true, limit });
    return response.posts;
  }

  /**
   * Get recent posts
   */
  async getRecentPosts(limit: number = 10): Promise<DashboardPost[]> {
    const response = await this.getPosts({ limit });
    return response.posts;
  }

  /**
   * Search posts
   */
  async searchPosts(query: string, limit: number = 10): Promise<DashboardPost[]> {
    const response = await this.getPosts({ search: query, limit });
    return response.posts;
  }

  /**
   * Get posts by tag
   */
  async getPostsByTag(tag: string, limit: number = 10): Promise<DashboardPost[]> {
    const response = await this.getPosts({ tag, limit });
    return response.posts;
  }
}

// Export singleton instance
export const dashboardAPI = new DashboardAPIClient();

// Export types for use in components
export type { DashboardPost, DashboardPublication, DashboardPostsResponse };
