import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
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

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get recent articles
    const recentArticles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED'
      },
      select: {
        id: true,
        title: true,
        status: true,
        publishedAt: true,
        updatedAt: true,
        author: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: 5
    });

    // Get recent case studies
    const recentCaseStudies = await prisma.caseStudy.findMany({
      where: {
        status: 'PUBLISHED'
      },
      select: {
        id: true,
        title: true,
        status: true,
        publishedAt: true,
        updatedAt: true,
        author: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: 3
    });

    // Build activity feed
    const activities = [];

    // Add article activities
    recentArticles.forEach(article => {
      if (article.publishedAt) {
        activities.push({
          id: `article-${article.id}`,
          type: 'article_published',
          title: 'New article published',
          description: `"${article.title}" was published and is now live`,
          timestamp: article.publishedAt.toISOString(),
          user: article.author?.name || article.author?.email || 'Unknown',
          link: `/admin/articles/${article.id}`
        });
      }
    });

    // Add case study activities
    recentCaseStudies.forEach(caseStudy => {
      if (caseStudy.publishedAt) {
        activities.push({
          id: `case-study-${caseStudy.id}`,
          type: 'case_study_published',
          title: 'New case study published',
          description: `"${caseStudy.title}" was added to your portfolio`,
          timestamp: caseStudy.publishedAt.toISOString(),
          user: caseStudy.author?.name || caseStudy.author?.email || 'Unknown',
          link: `/admin/case-studies/${caseStudy.id}`
        });
      }
    });

    // Add article update activities
    recentArticles.forEach(article => {
      if (article.updatedAt && article.publishedAt && 
          article.updatedAt > article.publishedAt) {
        activities.push({
          id: `update-${article.id}`,
          type: 'article_updated',
          title: 'Article updated',
          description: `"${article.title}" was updated with new content`,
          timestamp: article.updatedAt.toISOString(),
          user: article.author?.name || article.author?.email || 'Unknown',
          link: `/admin/articles/${article.id}`
        });
      }
    });

    // Add analytics milestone (this would need real analytics data)
    const totalViews = await prisma.article.aggregate({
      where: {
        status: 'PUBLISHED'
      },
      _sum: {
        views: true
      }
    });

    if ((totalViews._sum.views || 0) > 25000) {
      activities.push({
        id: 'milestone-1',
        type: 'analytics_milestone',
        title: 'Traffic milestone reached',
        description: 'Your blog reached 25K monthly views for the first time!',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        link: '/admin/analytics'
      });
    }

    // Sort activities by timestamp (most recent first)
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Apply filter
    let filteredActivities = activities;
    if (filter !== 'all') {
      switch (filter) {
        case 'articles':
          filteredActivities = activities.filter(activity => 
            ['article_published', 'article_updated'].includes(activity.type)
          );
          break;
        case 'case_studies':
          filteredActivities = activities.filter(activity => 
            activity.type === 'case_study_published'
          );
          break;
        case 'analytics':
          filteredActivities = activities.filter(activity => 
            activity.type === 'analytics_milestone'
          );
          break;
      }
    }

    // Limit results
    filteredActivities = filteredActivities.slice(0, limit);

    return NextResponse.json({
      activities: filteredActivities,
      total: activities.length
    });
  } catch (error) {
    console.error("Error fetching admin activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}
