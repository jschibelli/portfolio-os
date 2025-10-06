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
      prisma.imageAsset.findMany({
        where,
        include: {
          usedBy: {
            select: {
              title: true,
              slug: true
            }
          }
        },
        orderBy: [
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.imageAsset.count({ where })
    ]);

    // Transform the data to match the expected format
    const transformedMedia = mediaItems.map(item => ({
      id: item.id,
      name: item.url.split('/').pop() || 'Unknown',
      type: 'image',
      url: item.url,
      thumbnail: item.url,
      size: 0,
      uploadedAt: item.createdAt.toISOString(),
      uploadedBy: 'System',
      dimensions: item.width && item.height ? { width: item.width, height: item.height } : undefined,
      tags: [],
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
    const media = await prisma.imageAsset.create({
      data: {
        url,
        width,
        height,
        alt
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

export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids');
    
    if (!ids) {
      return NextResponse.json(
        { error: "Media IDs are required" },
        { status: 400 }
      );
    }

    // Parse comma-separated IDs
    const mediaIds = ids.split(',').filter(id => id.trim());
    
    if (mediaIds.length === 0) {
      return NextResponse.json(
        { error: "No valid media IDs provided" },
        { status: 400 }
      );
    }

    // Check if any of the media items are being used by articles
    const usedMedia = await prisma.imageAsset.findMany({
      where: {
        id: { in: mediaIds },
        usedBy: {
          some: {}
        }
      },
      include: {
        usedBy: {
          select: {
            title: true,
            slug: true
          }
        }
      }
    });

    if (usedMedia.length > 0) {
      const usedInArticles = usedMedia.map(item => 
        `${item.url} (used in: ${item.usedBy.map(article => article.title).join(', ')})`
      ).join(', ');
      
      return NextResponse.json(
        { 
          error: "Cannot delete media items that are being used by articles",
          details: usedInArticles
        },
        { status: 400 }
      );
    }

    // Delete the media items
    const deleteResult = await prisma.imageAsset.deleteMany({
      where: {
        id: { in: mediaIds }
      }
    });

    return NextResponse.json({
      message: `Successfully deleted ${deleteResult.count} media item(s)`,
      deletedCount: deleteResult.count
    });
  } catch (error) {
    console.error("Error deleting media items:", error);
    return NextResponse.json(
      { error: "Failed to delete media items" },
      { status: 500 }
    );
  }
}

