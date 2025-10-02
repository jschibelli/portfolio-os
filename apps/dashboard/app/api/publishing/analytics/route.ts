/**
 * Publishing Analytics API
 * Manages publishing analytics across platforms
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { publishingService } from '@/lib/publishing/service';

const prisma = new PrismaClient();

/**
 * GET /api/publishing/analytics?articleId=xxx&platform=xxx
 * Get analytics for an article on a specific platform or all platforms
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('articleId');
    const platform = searchParams.get('platform');

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    // If platform specified, get analytics for that platform
    if (platform) {
      try {
        const analytics = await publishingService.getAnalytics(articleId, platform);
        
        // Store/update analytics in database
        await prisma.publishingAnalytics.upsert({
          where: {
            articleId_platform: {
              articleId,
              platform
            }
          },
          update: {
            views: analytics.views,
            likes: analytics.likes,
            shares: analytics.shares,
            comments: analytics.comments,
            engagement: analytics.engagement,
            metrics: analytics.metrics,
            lastUpdated: new Date()
          },
          create: {
            articleId,
            platform,
            views: analytics.views,
            likes: analytics.likes,
            shares: analytics.shares,
            comments: analytics.comments,
            engagement: analytics.engagement,
            metrics: analytics.metrics
          }
        });

        return NextResponse.json({
          success: true,
          analytics
        });
      } catch (error) {
        console.error(`Analytics fetch error for ${platform}:`, error);
        return NextResponse.json(
          { error: `Failed to fetch analytics from ${platform}` },
          { status: 500 }
        );
      }
    }

    // Otherwise, get analytics for all platforms from database
    const allAnalytics = await prisma.publishingAnalytics.findMany({
      where: { articleId }
    });

    // Calculate totals
    const totals = allAnalytics.reduce(
      (acc, curr) => ({
        views: acc.views + curr.views,
        likes: acc.likes + curr.likes,
        shares: acc.shares + curr.shares,
        comments: acc.comments + curr.comments,
        engagement: acc.engagement + curr.engagement
      }),
      { views: 0, likes: 0, shares: 0, comments: 0, engagement: 0 }
    );

    return NextResponse.json({
      success: true,
      analytics: allAnalytics,
      totals
    });

  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * POST /api/publishing/analytics/refresh
 * Refresh analytics for an article from all platforms
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { articleId } = body;

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    // Get publishing status to know which platforms the article is on
    const publishingStatuses = await prisma.publishingStatus.findMany({
      where: {
        articleId,
        status: 'published'
      }
    });

    const results = [];
    const errors = [];

    // Fetch analytics from each platform
    for (const status of publishingStatuses) {
      const platforms = status.platforms as any[];
      
      for (const platform of platforms) {
        if (platform.status === 'published') {
          try {
            const analytics = await publishingService.getAnalytics(articleId, platform.name);
            
            // Store/update in database
            await prisma.publishingAnalytics.upsert({
              where: {
                articleId_platform: {
                  articleId,
                  platform: platform.name
                }
              },
              update: {
                views: analytics.views,
                likes: analytics.likes,
                shares: analytics.shares,
                comments: analytics.comments,
                engagement: analytics.engagement,
                metrics: analytics.metrics,
                lastUpdated: new Date()
              },
              create: {
                articleId,
                platform: platform.name,
                views: analytics.views,
                likes: analytics.likes,
                shares: analytics.shares,
                comments: analytics.comments,
                engagement: analytics.engagement,
                metrics: analytics.metrics
              }
            });

            results.push({
              platform: platform.name,
              success: true,
              analytics
            });
          } catch (error) {
            console.error(`Failed to refresh analytics for ${platform.name}:`, error);
            errors.push({
              platform: platform.name,
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      results,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Analytics refresh error:', error);
    return NextResponse.json(
      { error: 'Failed to refresh analytics' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
