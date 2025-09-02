import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

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
    const period = searchParams.get('period') || '30d';
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    // Get analytics data
    const [articles, caseStudies, totalViews, uniqueVisitors] = await Promise.all([
      // Get articles with views
      prisma.article.findMany({
        where: {
          status: 'PUBLISHED',
          publishedAt: {
            gte: startDate
          }
        },
        select: {
          id: true,
          title: true,
          views: true,
          readingMinutes: true,
          publishedAt: true
        },
        orderBy: {
          views: 'desc'
        },
        take: 10
      }),
      
      // Get case studies with views
      prisma.caseStudy.findMany({
        where: {
          status: 'PUBLISHED',
          publishedAt: {
            gte: startDate
          }
        },
        select: {
          id: true,
          title: true,
          views: true,
          publishedAt: true
        },
        orderBy: {
          views: 'desc'
        },
        take: 5
      }),
      
      // Get total views for the period
      prisma.article.aggregate({
        where: {
          status: 'PUBLISHED',
          publishedAt: {
            gte: startDate
          }
        },
        _sum: {
          views: true
        }
      }),
      
      // Get unique visitors (estimated from views)
      prisma.article.aggregate({
        where: {
          status: 'PUBLISHED',
          publishedAt: {
            gte: startDate
          }
        },
        _sum: {
          views: true
        }
      })
    ]);

    // Generate daily analytics data for the chart
    const dailyData = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      // Get views for this specific date
      const dayStart = new Date(currentDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);
      
      const dayViews = await prisma.article.aggregate({
        where: {
          status: 'PUBLISHED',
          publishedAt: {
            gte: dayStart,
            lte: dayEnd
          }
        },
        _sum: {
          views: true
        }
      });
      
      dailyData.push({
        date: dateStr,
        views: dayViews._sum.views || 0,
        visitors: Math.floor((dayViews._sum.views || 0) * 0.35), // Estimate unique visitors
        bounceRate: Math.floor(Math.random() * 20) + 30 // This would need real analytics data
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculate engagement rates
    const topArticles = articles.map(article => ({
      title: article.title,
      views: article.views,
      engagement: Math.floor(Math.random() * 30) + 60, // This would need real analytics data
      readTime: article.readingMinutes || 5
    }));

    // Traffic sources (this would need real analytics integration)
    const trafficSources = [
      { name: "Direct", value: 45, color: "#3b82f6" },
      { name: "Organic Search", value: 30, color: "#10b981" },
      { name: "Social Media", value: 15, color: "#f59e0b" },
      { name: "Referral", value: 10, color: "#8b5cf6" },
    ];

    // Device data (this would need real analytics integration)
    const deviceData = [
      { device: "Desktop", users: 65, color: "#3b82f6" },
      { device: "Mobile", users: 30, color: "#10b981" },
      { device: "Tablet", users: 5, color: "#f59e0b" },
    ];

    const analyticsData = {
      pageViewsData: dailyData,
      topArticles,
      trafficSources,
      deviceData
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error("Error fetching admin analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
