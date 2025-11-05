import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

// Conditional Prisma import to handle build-time issues
let prisma: any;
try {
  const { PrismaClient } = require("@prisma/client");
  prisma = new PrismaClient();
} catch (error) {
  console.warn("Prisma client not available during build:", error);
  prisma = null;
}

export async function GET(request: NextRequest) {
  try {
    // If Prisma is not available, return a placeholder response
    if (!prisma) {
      return NextResponse.json({
        totalViews: 0,
        uniqueVisitors: 0,
        publishedArticles: 0,
        avgTimeOnPage: "0m 0s",
        socialShares: 0,
        bounceRate: 0,
        currentMonthViews: 0,
        currentMonthArticles: 0,
        viewsChange: 0,
        articlesChange: 0,
        caseStudiesCount: 0,
        draftArticlesCount: 0,
        scheduledArticlesCount: 0
      });
    }

    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user has admin role
    const userRole = (session.user as any)?.role;
    if (!userRole || !["ADMIN", "EDITOR", "AUTHOR"].includes(userRole)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Calculate date ranges for comparison
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get current month stats (with fallback if table doesn't exist)
    let currentMonthStats, lastMonthStats, totalStats;
    
    try {
      [currentMonthStats, lastMonthStats, totalStats] = await Promise.all([
        // Current month
        prisma.article.aggregate({
          where: {
            status: 'PUBLISHED',
            publishedAt: {
              gte: currentMonthStart
            }
          },
          _sum: {
            views: true
          },
          _count: {
            id: true
          }
        }),
        
        // Last month
        prisma.article.aggregate({
          where: {
            status: 'PUBLISHED',
            publishedAt: {
              gte: lastMonthStart,
              lte: lastMonthEnd
            }
          },
          _sum: {
            views: true
          },
          _count: {
            id: true
          }
        }),
        
        // Total stats
        prisma.article.aggregate({
          where: {
            status: 'PUBLISHED'
          },
          _sum: {
            views: true
          },
          _count: {
            id: true
          }
        })
      ]);
    } catch (error) {
      console.warn('Article table not found, using fallback stats:', error);
      // Fallback to default values
      currentMonthStats = { _sum: { views: 0 }, _count: { id: 0 } };
      lastMonthStats = { _sum: { views: 0 }, _count: { id: 0 } };
      totalStats = { _sum: { views: 0 }, _count: { id: 0 } };
    }

    // Calculate changes
    const currentViews = currentMonthStats._sum.views || 0;
    const lastMonthViews = lastMonthStats._sum.views || 0;
    const viewsChange = lastMonthViews > 0 
      ? ((currentViews - lastMonthViews) / lastMonthViews) * 100 
      : 0;

    const currentArticles = currentMonthStats._count.id || 0;
    const lastMonthArticles = lastMonthStats._count.id || 0;
    const articlesChange = lastMonthArticles > 0 
      ? ((currentArticles - lastMonthArticles) / lastMonthArticles) * 100 
      : 0;

    // Get case studies count (with fallback if table doesn't exist)
    let caseStudiesCount = 0;
    try {
      caseStudiesCount = await prisma.caseStudy.count({
        where: {
          status: 'PUBLISHED'
        }
      });
    } catch (error) {
      console.warn('CaseStudy table not found, using fallback count:', error);
      caseStudiesCount = 0;
    }

    // Get draft articles count (with fallback if table doesn't exist)
    let draftArticlesCount = 0;
    try {
      draftArticlesCount = await prisma.article.count({
        where: {
          status: 'DRAFT'
        }
      });
    } catch (error) {
      console.warn('Article table not found, using fallback count:', error);
      draftArticlesCount = 0;
    }

    // Get scheduled articles count (with fallback if table doesn't exist)
    let scheduledArticlesCount = 0;
    try {
      scheduledArticlesCount = await prisma.article.count({
        where: {
          status: 'SCHEDULED'
        }
      });
    } catch (error) {
      console.warn('Article table not found, using fallback count:', error);
      scheduledArticlesCount = 0;
    }

    // Get REAL average time on page from analytics session data
    let avgTimeOnPage = "0m 0s";
    try {
      const sessionsData = await prisma.analyticsSession.findMany({
        where: {
          startTime: {
            gte: currentMonthStart
          },
          duration: {
            not: null
          }
        },
        select: {
          duration: true
        }
      });
      
      if (sessionsData.length > 0) {
        const totalDuration = sessionsData.reduce((sum, s) => sum + (s.duration || 0), 0);
        const avgSeconds = Math.floor(totalDuration / sessionsData.length);
        const minutes = Math.floor(avgSeconds / 60);
        const seconds = avgSeconds % 60;
        avgTimeOnPage = `${minutes}m ${seconds}s`;
      }
    } catch (error) {
      console.log('AnalyticsSession table not available');
    }

    // Get REAL social shares count - NO ESTIMATION
    const socialShares = 0; // Set to 0 until you have real social share tracking

    // Get REAL bounce rate from analytics session data
    let bounceRate = 0;
    try {
      const sessionsData = await prisma.analyticsSession.findMany({
        where: {
          startTime: {
            gte: currentMonthStart
          }
        },
        select: {
          pageViews: true
        }
      });
      
      if (sessionsData.length > 0) {
        const bouncedSessions = sessionsData.filter(s => s.pageViews === 1).length;
        bounceRate = Math.round((bouncedSessions / sessionsData.length) * 100);
      }
    } catch (error) {
      console.log('AnalyticsSession table not available');
    }

    // Get REAL unique visitors from PageView data
    let uniqueVisitors = 0;
    try {
      const uniqueUserIds = await prisma.pageView.groupBy({
        by: ['userId'],
        where: {
          userId: {
            not: null
          }
        }
      });
      uniqueVisitors = uniqueUserIds.length;
    } catch (error) {
      console.log('PageView table not available');
    }

    const stats = {
      totalViews: totalStats._sum.views || 0,
      uniqueVisitors: uniqueVisitors, // REAL unique visitors, not estimated
      publishedArticles: totalStats._count.id || 0,
      avgTimeOnPage,
      socialShares,
      bounceRate,
      currentMonthViews: currentViews,
      currentMonthArticles: currentArticles,
      viewsChange: Math.round(viewsChange * 10) / 10,
      articlesChange: Math.round(articlesChange * 10) / 10,
      caseStudiesCount,
      draftArticlesCount,
      scheduledArticlesCount
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
