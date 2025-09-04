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
    if (!userRole || !["ADMIN", "EDITOR"].includes(userRole)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'subscribers' or 'campaigns'
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    if (type === 'subscribers') {
      // Build where clause for subscribers
      const where: any = {};
      
      if (search) {
        where.OR = [
          { email: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      if (status && status !== 'all') {
        where.status = status;
      }

      const [subscribers, total] = await Promise.all([
        prisma.newsletterSubscriber.findMany({
          where,
          orderBy: [
            { createdAt: 'desc' }
          ],
          skip,
          take: limit
        }),
        prisma.newsletterSubscriber.count({ where })
      ]);

      // Transform the data to match the expected format
      const transformedSubscribers = subscribers.map(subscriber => ({
        id: subscriber.id,
        email: subscriber.email,
        name: subscriber.name || '',
        status: subscriber.status,
        subscribedAt: subscriber.createdAt.toISOString(),
        lastEmailSent: subscriber.lastEmailSent?.toISOString(),
        tags: subscriber.tags || []
      }));

      return NextResponse.json({
        subscribers: transformedSubscribers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } else if (type === 'campaigns') {
      // Build where clause for campaigns
      const where: any = {};
      
      if (search) {
        where.OR = [
          { subject: { contains: search, mode: 'insensitive' } },
          { title: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      if (status && status !== 'all') {
        where.status = status;
      }

      const [campaigns, total] = await Promise.all([
        prisma.newsletterCampaign.findMany({
          where,
          orderBy: [
            { createdAt: 'desc' }
          ],
          skip,
          take: limit
        }),
        prisma.newsletterCampaign.count({ where })
      ]);

      // Transform the data to match the expected format
      const transformedCampaigns = campaigns.map(campaign => ({
        id: campaign.id,
        title: campaign.title,
        subject: campaign.subject,
        content: campaign.content,
        status: campaign.status,
        scheduledAt: campaign.scheduledAt?.toISOString(),
        sentAt: campaign.sentAt?.toISOString(),
        createdAt: campaign.createdAt.toISOString(),
        recipientCount: campaign.recipientCount || 0,
        openRate: campaign.openRate || 0,
        clickRate: campaign.clickRate || 0
      }));

      return NextResponse.json({
        campaigns: transformedCampaigns,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } else {
      return NextResponse.json(
        { error: "Invalid type parameter" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error fetching admin newsletter data:", error);
    return NextResponse.json(
      { error: "Failed to fetch newsletter data" },
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
    if (!userRole || !["ADMIN", "EDITOR"].includes(userRole)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { type, ...data } = body;

    if (type === 'subscriber') {
      // Create newsletter subscriber
      const subscriber = await prisma.newsletterSubscriber.create({
        data: {
          email: data.email,
          name: data.name,
          status: data.status || 'ACTIVE',
          tags: data.tags || []
        }
      });

      return NextResponse.json(subscriber, { status: 201 });
    } else if (type === 'campaign') {
      // Create newsletter campaign
      const campaign = await prisma.newsletterCampaign.create({
        data: {
          title: data.title,
          subject: data.subject,
          content: data.content,
          status: data.status || 'DRAFT',
          scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
          recipientCount: data.recipientCount || 0
        }
      });

      return NextResponse.json(campaign, { status: 201 });
    } else {
      return NextResponse.json(
        { error: "Invalid type parameter" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error creating newsletter item:", error);
    return NextResponse.json(
      { error: "Failed to create newsletter item" },
      { status: 500 }
    );
  }
}

