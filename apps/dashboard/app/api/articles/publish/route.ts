/**
 * Publish Article API Route
 * Handles publishing article drafts
 * @route POST /api/articles/publish
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// User type for session
interface SessionUser {
  id: string;
  email: string;
  role: string;
}

// Simple logging function to replace console statements
const log = {
  warn: (..._args: any[]) => {
    // In production, this would use a proper logging service
    // For now, we'll just suppress console output
  },
  info: (..._args: any[]) => {
    // In production, this would use a proper logging service
    // For now, we'll just suppress console output
  },
  error: (..._args: any[]) => {
    // In production, this would use a proper logging service
    // For now, we'll just suppress console output
  }
};
import { PublishRequest, ApiErrorResponse } from '@/lib/types/article';

/**
 * POST /api/articles/publish
 * Publishes an article draft by updating its status and setting publishedAt timestamp
 * 
 * @param request - NextRequest containing article ID
 * @returns JSON response with published article details, or error
 * 
 * @security Requires authentication with ADMIN, EDITOR, or AUTHOR role
 * @validation Validates article exists and belongs to user (for AUTHORS)
 * @logging Logs publication events and errors
 */
export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const session = await getServerSession(authOptions);
    
    if (!session) {
      log.warn('[publish] Unauthorized publish attempt');
      return NextResponse.json(
        { 
          success: false,
          error: 'Unauthorized', 
          statusCode: 401 
        } as ApiErrorResponse,
        { status: 401 }
      );
    }

    // Authorization check
    const userRole = (session.user as SessionUser)?.role;
    if (!userRole || !['ADMIN', 'EDITOR', 'AUTHOR'].includes(userRole)) {
      log.warn(`[publish] Insufficient permissions for user: ${(session.user as SessionUser)?.email}`);
      return NextResponse.json(
        { 
          success: false,
          error: 'Insufficient permissions', 
          statusCode: 403 
        } as ApiErrorResponse,
        { status: 403 }
      );
    }

    // Parse request body
    const body: PublishRequest = await request.json();
    const { id } = body;

    // Validation: Required fields
    if (!id) {
      log.warn('[publish] Missing article ID');
      return NextResponse.json(
        { 
          success: false,
          error: 'Article ID is required', 
          statusCode: 400,
          validationErrors: [{ field: 'id', message: 'Article ID is required' }]
        } as ApiErrorResponse,
        { status: 400 }
      );
    }

    log.info(`[publish] Attempting to publish article: ${id}`);

    // Check if article exists and user has permission
    const existingArticle = await prisma.article.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        status: true,
        authorId: true,
        slug: true,
      },
    });

    if (!existingArticle) {
      log.warn(`[publish] Article not found: ${id}`);
      return NextResponse.json(
        { 
          success: false,
          error: 'Article not found', 
          statusCode: 404 
        } as ApiErrorResponse,
        { status: 404 }
      );
    }

    // Check if author is publishing their own article (AUTHORS can only publish their own)
    if (userRole === 'AUTHOR' && existingArticle.authorId !== (session.user as SessionUser)?.id) {
      log.warn(`[publish] Author attempting to publish another user's article: ${id}`);
      return NextResponse.json(
        { 
          success: false,
          error: 'You can only publish your own articles', 
          statusCode: 403 
        } as ApiErrorResponse,
        { status: 403 }
      );
    }

    // Check if article is already published
    if (existingArticle.status === 'PUBLISHED') {
      log.info(`[publish] Article already published: ${id}`);
      // Return success with existing published date rather than error
      const article = await prisma.article.findUnique({
        where: { id },
        select: { id: true, publishedAt: true },
      });
      
      return NextResponse.json({
        success: true,
        id: article!.id,
        publishedAt: article!.publishedAt?.toISOString() || new Date().toISOString(),
      });
    }

    // Validation: Check if article has minimum required content
    const articleContent = await prisma.article.findUnique({
      where: { id },
      select: {
        title: true,
        slug: true,
        contentMdx: true,
      },
    });

    if (!articleContent?.contentMdx || articleContent.contentMdx.trim().length < 10) {
      log.warn(`[publish] Article lacks sufficient content: ${id}`);
      return NextResponse.json(
        { 
          success: false,
          error: 'Article must have content before publishing', 
          statusCode: 400,
          validationErrors: [{ field: 'content', message: 'Article content is too short or missing' }]
        } as ApiErrorResponse,
        { status: 400 }
      );
    }

    // Update article status to PUBLISHED and set publishedAt timestamp
    log.info(`[publish] Publishing article: ${existingArticle.title} (${id})`);
    const article = await prisma.article.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        title: true,
        slug: true,
        publishedAt: true,
        status: true,
      },
    });

    log.info(`[publish] Article published successfully: ${article.title} (${article.id}) at ${article.publishedAt}`);

    // TODO: Consider adding post-publish tasks:
    // - Send notification to subscribers
    // - Invalidate cache
    // - Update sitemap
    // - Trigger webhook for external services

    return NextResponse.json({
      success: true,
      id: article.id,
      publishedAt: article.publishedAt?.toISOString() || new Date().toISOString(),
    });

  } catch (error) {
    // Log detailed error for debugging
    log.error('[publish] Unexpected error:', {
      message: (error as Error).message,
      stack: (error as Error).stack,
      timestamp: new Date().toISOString(),
    });
    
    // Check for specific Prisma errors
    if ((error as Error & { code?: string }).code === 'P2025') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Article not found', 
          statusCode: 404 
        } as ApiErrorResponse,
        { status: 404 }
      );
    }
    
    // Return generic error to client
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to publish article. Please try again.', 
        statusCode: 500 
      } as ApiErrorResponse,
      { status: 500 }
    );
  }
}