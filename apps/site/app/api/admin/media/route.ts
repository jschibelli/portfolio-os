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
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { alt: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (type && type !== 'all') {
      where.type = type;
    }

    const [mediaItems, total] = await Promise.all([
      prisma.media.findMany({
        where,
        include: {
          uploadedBy: {
            select: {
              name: true
            }
          }
        },
        orderBy: [
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.media.count({ where })
    ]);

    // Transform the data to match the expected format
    const transformedMedia = mediaItems.map(item => ({
      id: item.id,
      name: item.name,
      type: item.type,
      url: item.url,
      thumbnail: item.thumbnail || item.url,
      size: item.size,
      uploadedAt: item.createdAt.toISOString(),
      uploadedBy: item.uploadedBy?.name || 'Unknown User',
      dimensions: item.width && item.height ? { width: item.width, height: item.height } : undefined,
      tags: item.tags || [],
      alt: item.alt || ''
    }));

    return NextResponse.json({
      media: transformedMedia,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching admin media:", error);
    return NextResponse.json(
      { error: "Failed to fetch media" },
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
    const { name, type, url, thumbnail, size, width, height, tags, alt } = body;

    // Create the media item
    const media = await prisma.media.create({
      data: {
        name,
        type,
        url,
        thumbnail,
        size,
        width,
        height,
        tags,
        alt,
        uploadedById: (session.user as any)?.id
      }
    });

    return NextResponse.json(media, { status: 201 });
  } catch (error) {
    console.error("Error creating media item:", error);
    return NextResponse.json(
      { error: "Failed to create media item" },
      { status: 500 }
    );
  }
}

