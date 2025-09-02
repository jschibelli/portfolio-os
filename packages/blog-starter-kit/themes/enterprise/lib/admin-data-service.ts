import { recentPosts, featuredPost, Post } from '../data/posts';
import portfolioData from '../data/portfolio.json';
import { skills } from '../data/skills';
import caseStudiesData from '../data/case-studies.json';

export interface AdminStats {
  totalViews: number;
  uniqueVisitors: number;
  publishedArticles: number;
  avgTimeOnPage: string;
  socialShares: number;
  bounceRate: number;
  currentMonthViews: number;
  currentMonthArticles: number;
  viewsChange: number;
  articlesChange: number;
  caseStudiesCount: number;
  draftArticlesCount: number;
  scheduledArticlesCount: number;
}

export interface AdminArticle {
  id: string;
  title: string;
  subtitle?: string;
  status: 'PUBLISHED' | 'DRAFT' | 'SCHEDULED' | 'ARCHIVED';
  updatedAt: string;
  publishedAt?: string;
  author?: {
    name?: string;
    email: string;
  };
  views: number;
  readTime: number;
  tags: string[];
  featured: boolean;
  slug: string;
  excerpt: string;
  image?: string;
}

export interface AdminCaseStudy {
  id: string;
  title: string;
  description: string;
  status: 'PUBLISHED' | 'DRAFT' | 'SCHEDULED';
  updatedAt: string;
  publishedAt?: string;
  author?: {
    name?: string;
    email: string;
  };
  views: number;
  tags: string[];
  featured: boolean;
  slug: string;
  image: string;
  liveUrl: string;
  caseStudyUrl: string;
}

export interface AdminPortfolioItem {
  id: string;
  title: string;
  description: string;
  status: 'PUBLISHED' | 'DRAFT' | 'SCHEDULED';
  updatedAt: string;
  publishedAt?: string;
  author?: {
    name?: string;
    email: string;
  };
  views: number;
  tags: string[];
  featured: boolean;
  slug: string;
  image: string;
  liveUrl: string;
  caseStudyUrl: string;
}

export interface AdminActivity {
  id: string;
  type: 'article_published' | 'article_updated' | 'comment_received' | 'user_registered' | 'analytics_milestone' | 'case_study_published' | 'portfolio_updated';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  link?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'EDITOR' | 'AUTHOR';
  status: 'active' | 'inactive';
  lastLogin?: string;
}

export interface AdminMediaItem {
  id: string;
  name: string;
  type: 'image' | 'document' | 'video' | 'audio' | 'archive';
  url: string;
  thumbnail?: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  dimensions?: { width: number; height: number };
  tags: string[];
}

export interface AdminAnalytics {
  pageViewsData: Array<{
    date: string;
    views: number;
    visitors: number;
    bounceRate: number;
  }>;
  topArticles: Array<{
    title: string;
    views: number;
    engagement: number;
    readTime: number;
  }>;
  trafficSources: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  deviceData: Array<{
    device: string;
    users: number;
    color: string;
  }>;
}

class AdminDataService {
  private async apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`/api/admin/${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API call to ${endpoint} failed:`, error);
      throw error;
    }
  }

  // Get real articles from API
  async getArticles(): Promise<AdminArticle[]> {
    try {
      const response = await this.apiCall<{ articles: AdminArticle[] }>('articles');
      return response.articles;
    } catch (error) {
      console.error('Failed to fetch articles from API, falling back to local data:', error);
      // Fallback to local data if API fails
      const allPosts = [featuredPost, ...recentPosts];
      return allPosts.map((post, index) => ({
        id: post.id,
        title: post.title,
        subtitle: post.excerpt.length > 100 ? post.excerpt.substring(0, 100) + '...' : undefined,
        status: 'PUBLISHED' as const,
        updatedAt: new Date(Date.now() - index * 2 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: post.date,
        author: {
          name: 'John Schibelli',
          email: 'john@mindware-blog.com'
        },
        views: Math.floor(Math.random() * 5000) + 100,
        readTime: this.generateMockReadTime(post.readTime),
        tags: post.tags || [],
        featured: post.id === featuredPost.id,
        slug: post.slug,
        excerpt: post.excerpt,
        image: post.image
      }));
    }
  }

  // Get real case studies from API
  async getCaseStudies(): Promise<AdminCaseStudy[]> {
    try {
      const response = await this.apiCall<AdminCaseStudy[]>('case-studies');
      return response;
    } catch (error) {
      console.error('Failed to fetch case studies from API, falling back to local data:', error);
      // Fallback to local data if API fails
      return caseStudiesData.map((study, index) => ({
        id: study.id,
        title: study.title,
        description: study.description,
        status: 'PUBLISHED' as const,
        updatedAt: new Date(Date.now() - index * 3 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: study.publishedAt,
        author: {
          name: 'John Schibelli',
          email: 'john@mindware-blog.com'
        },
        views: Math.floor(Math.random() * 5000) + 100,
        tags: study.tags || [],
        featured: study.featured || false,
        slug: study.slug || study.id,
        image: study.image,
        liveUrl: study.liveUrl,
        caseStudyUrl: study.caseStudyUrl
      }));
    }
  }

  // Get real portfolio items
  async getPortfolioItems(): Promise<AdminPortfolioItem[]> {
    try {
      // For now, use local data as portfolio API doesn't exist yet
      return portfolioData.map((item, index) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        status: 'PUBLISHED' as const,
        updatedAt: new Date(Date.now() - index * 4 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - index * 4 * 24 * 60 * 60 * 1000).toISOString(),
        author: {
          name: 'John Schibelli',
          email: 'john@mindware-blog.com'
        },
        views: Math.floor(Math.random() * 5000) + 100,
        tags: item.tags || [],
        featured: false,
        slug: item.slug,
        image: item.image,
        liveUrl: item.liveUrl,
        caseStudyUrl: item.caseStudyUrl
      }));
    } catch (error) {
      console.error('Failed to fetch portfolio items:', error);
      return [];
    }
  }

  // Get real activity data from API
  async getRecentActivity(): Promise<AdminActivity[]> {
    try {
      const response = await this.apiCall<{ activities: AdminActivity[] }>('activity');
      return response.activities;
    } catch (error) {
      console.error('Failed to fetch activity from API, falling back to mock data:', error);
      // Fallback to mock data if API fails
      const articles = await this.getArticles();
      const caseStudies = await this.getCaseStudies();
      
      const activities: AdminActivity[] = [
        {
          id: '1',
          type: 'article_published',
          title: 'New article published',
          description: `"${articles[0]?.title}" was published and is now live`,
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          user: 'John Schibelli',
          link: `/admin/articles/${articles[0]?.id}`
        },
        {
          id: '2',
          type: 'case_study_published',
          title: 'New case study published',
          description: `"${caseStudies[0]?.title}" was added to your portfolio`,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          user: 'John Schibelli',
          link: `/admin/case-studies/${caseStudies[0]?.id}`
        },
        {
          id: '3',
          type: 'analytics_milestone',
          title: 'Traffic milestone reached',
          description: 'Your blog reached 25K monthly views for the first time!',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          link: '/admin/analytics'
        }
      ];

      return activities;
    }
  }

  // Get real users data
  async getUsers(): Promise<AdminUser[]> {
    try {
      // For now, return mock data as users API doesn't exist yet
      return [
        {
          id: "1",
          name: "John Schibelli",
          email: "john@mindware-blog.com",
          role: "ADMIN",
          status: "active",
          lastLogin: new Date().toISOString()
        },
        {
          id: "2",
          name: "Emily Chen",
          email: "emily@mindware-blog.com",
          role: "EDITOR",
          status: "active",
          lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      ];
    } catch (error) {
      console.error('Failed to fetch users:', error);
      return [];
    }
  }

  // Get real media data
  async getMediaItems(): Promise<AdminMediaItem[]> {
    try {
      // For now, return mock data as media API doesn't exist yet
      return [
        {
          id: "1",
          name: "blog-header-image.jpg",
          type: "image",
          url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
          thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&h=150&fit=crop",
          size: 245760,
          uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          uploadedBy: "John Schibelli",
          dimensions: { width: 800, height: 600 },
          tags: ["header", "blog", "design"]
        },
        {
          id: "2",
          name: "case-study-diagram.png",
          type: "image",
          url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
          thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=150&fit=crop",
          size: 512000,
          uploadedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          uploadedBy: "John Schibelli",
          dimensions: { width: 1200, height: 800 },
          tags: ["diagram", "case-study", "technical"]
        }
      ];
    } catch (error) {
      console.error('Failed to fetch media items:', error);
      return [];
    }
  }

  // Get real analytics data from API
  async getAnalytics(): Promise<AdminAnalytics> {
    try {
      const response = await this.apiCall<AdminAnalytics>('analytics');
      return response;
    } catch (error) {
      console.error('Failed to fetch analytics from API, falling back to mock data:', error);
      // Fallback to mock data if API fails
      return this.generateMockAnalyticsData();
    }
  }

  // Get dashboard stats from API
  async getDashboardStats(): Promise<AdminStats> {
    try {
      const response = await this.apiCall<AdminStats>('stats');
      return response;
    } catch (error) {
      console.error('Failed to fetch dashboard stats from API, falling back to mock data:', error);
      // Fallback to mock data if API fails
      const articles = await this.getArticles();
      const totalViews = articles.reduce((sum, article) => sum + article.views, 0);
      const uniqueVisitors = Math.floor(totalViews * 0.35);
      
      return {
        totalViews,
        uniqueVisitors,
        publishedArticles: articles.length,
        avgTimeOnPage: "4m 32s",
        socialShares: Math.floor(totalViews * 0.006),
        bounceRate: 42,
        currentMonthViews: totalViews,
        currentMonthArticles: articles.length,
        viewsChange: 12.5,
        articlesChange: 2,
        caseStudiesCount: 2,
        draftArticlesCount: 3,
        scheduledArticlesCount: 1
      };
    }
  }

  // Search and filter methods
  async searchArticles(query: string, statusFilter: string = 'all'): Promise<AdminArticle[]> {
    try {
      const articles = await this.getArticles();
      let filtered = articles;

      if (query) {
        filtered = filtered.filter(article =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          (article.subtitle && article.subtitle.toLowerCase().includes(query.toLowerCase())) ||
          article.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
      }

      if (statusFilter !== 'all') {
        filtered = filtered.filter(article => article.status === statusFilter);
      }

      return filtered;
    } catch (error) {
      console.error('Failed to search articles:', error);
      return [];
    }
  }

  async searchMedia(query: string, typeFilter: string = 'all'): Promise<AdminMediaItem[]> {
    try {
      const media = await this.getMediaItems();
      let filtered = media;

      if (query) {
        filtered = filtered.filter(item =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
      }

      if (typeFilter !== 'all') {
        filtered = filtered.filter(item => item.type === typeFilter);
      }

      return filtered;
    } catch (error) {
      console.error('Failed to search media:', error);
      return [];
    }
  }

  // Helper methods for fallback data
  private generateMockReadTime(readTimeStr: string): number {
    const match = readTimeStr.match(/(\d+)/);
    return match ? parseInt(match[1]) : 5;
  }

  private generateMockAnalyticsData(): AdminAnalytics {
    const today = new Date();
    const data = [];
    
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        views: Math.floor(Math.random() * 1000) + 800,
        visitors: Math.floor(Math.random() * 600) + 500,
        bounceRate: Math.floor(Math.random() * 20) + 30
      });
    }
    
    return {
      pageViewsData: data,
      topArticles: [],
      trafficSources: [
        { name: "Direct", value: 45, color: "#3b82f6" },
        { name: "Organic Search", value: 30, color: "#10b981" },
        { name: "Social Media", value: 15, color: "#f59e0b" },
        { name: "Referral", value: 10, color: "#8b5cf6" },
      ],
      deviceData: [
        { device: "Desktop", users: 65, color: "#3b82f6" },
        { device: "Mobile", users: 30, color: "#10b981" },
        { device: "Tablet", users: 5, color: "#f59e0b" },
      ]
    };
  }
}

export const adminDataService = new AdminDataService();
