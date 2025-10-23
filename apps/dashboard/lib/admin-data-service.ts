/**
 * Admin Data Service
 * Centralized service for all admin dashboard data operations
 * Uses Prisma client for database queries with proper error handling
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// TypeScript interfaces for return types
export interface AdminArticle {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  status: string;
  publishedAt: string | null;
  updatedAt: string;
  featured: boolean;
  views: number;
  readTime: number | null;
  tags: string[];
  author: {
    id: string;
    name: string | null;
    email: string;
  };
}

export interface AdminCaseStudy {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  status: string;
  publishedAt: string | null;
  updatedAt: string;
  featured: boolean;
  views: number;
  tags: string[];
  author: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

export interface AdminComment {
  id: string;
  articleId: string;
  article: {
    id: string;
    title: string;
    slug: string;
  };
  author: string;
  email: string;
  content: string;
  status: string;
  parentId: string | null;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminTag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  articleCount: number;
}

export interface AdminMedia {
  id: string;
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  blurData: string | null;
  createdAt: string;
  updatedAt: string;
  usedByCount: number;
}

export interface AdminActivity {
  id: string;
  kind: string;
  channel: string | null;
  externalId: string | null;
  meta: any;
  createdAt: string;
}

export interface ActivityOptions {
  limit?: number;
  offset?: number;
}

/**
 * Admin Data Service Class
 */
class AdminDataService {
  /**
   * Get all articles with author and tag information
   */
  async getArticles(options?: {
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<AdminArticle[]> {
    try {
      const where: any = {};
      
      if (options?.status && options.status !== 'all') {
        where.status = options.status;
      }
      
      if (options?.search) {
        where.OR = [
          { title: { contains: options.search, mode: 'insensitive' } },
          { subtitle: { contains: options.search, mode: 'insensitive' } },
        ];
      }

      const articles = await prisma.article.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          tags: {
            include: {
              tag: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
        take: options?.limit,
        skip: options?.offset,
      });

      return articles.map((article) => ({
        id: article.id,
        title: article.title,
        subtitle: article.subtitle,
        slug: article.slug,
        status: article.status,
        publishedAt: article.publishedAt?.toISOString() || null,
        updatedAt: article.updatedAt.toISOString(),
        featured: article.featured,
        views: article.views,
        readTime: article.readingMinutes,
        tags: article.tags.map((t) => t.tag.name),
        author: {
          id: article.author.id,
          name: article.author.name,
          email: article.author.email,
        },
      }));
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw new Error('Failed to fetch articles');
    }
  }

  /**
   * Get all case studies
   */
  async getCaseStudies(options?: {
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<AdminCaseStudy[]> {
    try {
      const where: any = {};
      
      if (options?.status && options.status !== 'all') {
        where.status = options.status;
      }
      
      if (options?.search) {
        where.OR = [
          { title: { contains: options.search, mode: 'insensitive' } },
          { excerpt: { contains: options.search, mode: 'insensitive' } },
        ];
      }

      const caseStudies = await prisma.caseStudy.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
        take: options?.limit,
        skip: options?.offset,
      });

      return caseStudies.map((cs) => ({
        id: cs.id,
        title: cs.title,
        slug: cs.slug,
        excerpt: cs.excerpt,
        status: cs.status,
        publishedAt: cs.publishedAt?.toISOString() || null,
        updatedAt: cs.updatedAt.toISOString(),
        featured: cs.featured,
        views: cs.views,
        tags: cs.tags || [],
        author: cs.author ? {
          id: cs.author.id,
          name: cs.author.name,
          email: cs.author.email,
        } : null,
      }));
    } catch (error) {
      console.error('Error fetching case studies:', error);
      throw new Error('Failed to fetch case studies');
    }
  }

  /**
   * Get all comments with article information
   */
  async getComments(options?: {
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<AdminComment[]> {
    try {
      const where: any = {};
      
      if (options?.status && options.status !== 'all') {
        where.status = options.status;
      }
      
      if (options?.search) {
        where.OR = [
          { author: { contains: options.search, mode: 'insensitive' } },
          { content: { contains: options.search, mode: 'insensitive' } },
          { email: { contains: options.search, mode: 'insensitive' } },
        ];
      }

      // @ts-ignore - Comment model might not be generated yet
      const comments = await prisma.comment.findMany({
        where,
        include: {
          article: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: options?.limit,
        skip: options?.offset,
      });

      return comments.map((comment: any) => ({
        id: comment.id,
        articleId: comment.articleId,
        article: {
          id: comment.article.id,
          title: comment.article.title,
          slug: comment.article.slug,
        },
        author: comment.author,
        email: comment.email,
        content: comment.content,
        status: comment.status,
        parentId: comment.parentId,
        likes: comment.likes,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString(),
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
      // Return empty array if Comment table doesn't exist yet
      if ((error as any)?.code === 'P2021') {
        return [];
      }
      throw new Error('Failed to fetch comments');
    }
  }

  /**
   * Get all tags with article count
   */
  async getTags(options?: {
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<AdminTag[]> {
    try {
      const where: any = {};
      
      if (options?.search) {
        where.OR = [
          { name: { contains: options.search, mode: 'insensitive' } },
          { slug: { contains: options.search, mode: 'insensitive' } },
        ];
      }

      const tags = await prisma.tag.findMany({
        where,
        include: {
          _count: {
            select: {
              articles: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
        take: options?.limit,
        skip: options?.offset,
      });

      return tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        createdAt: tag.createdAt.toISOString(),
        updatedAt: tag.updatedAt.toISOString(),
        articleCount: tag._count.articles,
      }));
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw new Error('Failed to fetch tags');
    }
  }

  /**
   * Get all media assets
   */
  async getMedia(options?: {
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<AdminMedia[]> {
    try {
      const where: any = {};
      
      if (options?.search) {
        where.OR = [
          { url: { contains: options.search, mode: 'insensitive' } },
          { alt: { contains: options.search, mode: 'insensitive' } },
        ];
      }

      const media = await prisma.imageAsset.findMany({
        where,
        include: {
          _count: {
            select: {
              usedBy: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: options?.limit,
        skip: options?.offset,
      });

      return media.map((asset) => ({
        id: asset.id,
        url: asset.url,
        alt: asset.alt,
        width: asset.width,
        height: asset.height,
        blurData: asset.blurData,
        createdAt: asset.createdAt.toISOString(),
        updatedAt: asset.updatedAt.toISOString(),
        usedByCount: asset._count.usedBy,
      }));
    } catch (error) {
      console.error('Error fetching media:', error);
      throw new Error('Failed to fetch media');
    }
  }

  /**
   * Get recent activity
   */
  async getActivity(options?: ActivityOptions): Promise<AdminActivity[]> {
    try {
      const activities = await prisma.activity.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        take: options?.limit || 10,
        skip: options?.offset,
      });

      return activities.map((activity) => ({
        id: activity.id,
        kind: activity.kind,
        channel: activity.channel,
        externalId: activity.externalId,
        meta: activity.meta,
        createdAt: activity.createdAt.toISOString(),
      }));
    } catch (error) {
      console.error('Error fetching activity:', error);
      throw new Error('Failed to fetch activity');
    }
  }

  /**
   * Import articles from Hashnode
   */
  async importHashnodeArticles(): Promise<{ importedCount: number }> {
    try {
      // This would call the existing Hashnode import API
      const response = await fetch('/api/admin/articles/import-hashnode', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to import from Hashnode');
      }
      
      const data = await response.json();
      return { importedCount: data.imported || 0 };
    } catch (error) {
      console.error('Error importing Hashnode articles:', error);
      throw new Error('Failed to import articles from Hashnode');
    }
  }
}

// Export singleton instance
export const adminDataService = new AdminDataService();

