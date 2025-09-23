import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
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
    if (!userRole || !["ADMIN", "EDITOR"].includes(userRole)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const severity = searchParams.get('severity');
    const user = searchParams.get('user');
    const timeRange = searchParams.get('timeRange');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { action: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (category && category !== 'all') {
      where.category = category;
    }
    
    if (severity && severity !== 'all') {
      where.severity = severity;
    }
    
    if (user && user !== 'all') {
      where.userId = user;
    }
    
    if (timeRange && timeRange !== 'all') {
      const now = new Date();
      let startDate: Date;
      
      switch (timeRange) {
        case '24h':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0);
      }
      
      where.createdAt = {
        gte: startDate
      };
    }

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        orderBy: [
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.activity.count({ where })
    ]);

    // Transform the data to match the expected format
    const transformedActivities = activities.map(activity => ({
      id: activity.id,
      action: activity.kind,
      description: `Activity: ${activity.kind}`,
      user: 'System',
      userRole: 'SYSTEM',
      timestamp: activity.createdAt.toISOString(),
      category: activity.channel || 'general',
      severity: 'info',
      ipAddress: '',
      userAgent: '',
      affectedResource: activity.externalId || '',
      changes: []
    }));

    return NextResponse.json({
      activities: transformedActivities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching admin activity logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity logs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userRole = (session.user as any)?.role;
    if (!userRole || !["ADMIN", "EDITOR", "AUTHOR"].includes(userRole)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, description, category, severity, affectedResource, changes, ipAddress, userAgent } = body;

    // Create the activity log
    const activity = await prisma.activity.create({
      data: {
        kind: action || 'ACTIVITY',
        channel: category || null,
        externalId: affectedResource || null,
        meta: {
          description,
          severity,
          changes,
          ipAddress,
          userAgent,
          userId: (session.user as any)?.id
        }
      }
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error("Error creating activity log:", error);
    return NextResponse.json(
      { error: "Failed to create activity log" },
      { status: 500 }
    );
  }
}
