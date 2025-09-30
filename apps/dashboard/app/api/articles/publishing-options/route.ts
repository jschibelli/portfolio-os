import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface PublishingOptionsRequest {
  articleId: string;
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED';
  visibility: 'PUBLIC' | 'UNLISTED' | 'PRIVATE' | 'MEMBERS';
  scheduledAt?: Date;
  featured: boolean;
  allowComments: boolean;
  allowReactions: boolean;
  paywalled: boolean;
  readingMinutes?: number;
  seriesId?: string;
  seriesPosition?: number;
  crossPlatformPublishing: {
    hashnode: boolean;
    dev: boolean;
    medium: boolean;
  };
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

    const body: PublishingOptionsRequest = await request.json();
    const {
      articleId,
      status,
      visibility,
      scheduledAt,
      featured,
      allowComments,
      allowReactions,
      paywalled,
      readingMinutes,
      seriesId,
      seriesPosition,
      crossPlatformPublishing
    } = body;

    // Validate required fields
    if (!articleId) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    // Check if article exists and user has permission
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: { author: true }
    });

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    // Check if user can edit this article
    const canEdit = userRole === "ADMIN" || 
                   userRole === "EDITOR" || 
                   article.authorId === (session.user as any)?.id;

    if (!canEdit) {
      return NextResponse.json(
        { error: "You don't have permission to edit this article" },
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData: any = {
      status,
      visibility,
      featured,
      allowComments,
      allowReactions,
      paywalled,
      readingMinutes,
      seriesPosition
    };

    // Handle series assignment
    if (seriesId) {
      updateData.seriesId = seriesId;
    } else {
      updateData.seriesId = null;
    }

    // Handle scheduling
    if (status === 'SCHEDULED' && scheduledAt) {
      updateData.scheduledAt = new Date(scheduledAt);
    } else if (status === 'PUBLISHED') {
      updateData.publishedAt = new Date();
      updateData.scheduledAt = null;
    } else if (status === 'DRAFT') {
      updateData.scheduledAt = null;
      updateData.publishedAt = null;
    }

    // Update the article
    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        series: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        },
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    // Handle cross-platform publishing (this would integrate with external APIs)
    if (crossPlatformPublishing) {
      // TODO: Implement cross-platform publishing logic
      console.log('Cross-platform publishing options:', crossPlatformPublishing);
    }

    return NextResponse.json({
      success: true,
      article: updatedArticle,
      message: "Publishing options updated successfully"
    });

  } catch (error) {
    console.error("Error updating publishing options:", error);
    return NextResponse.json(
      { error: "Failed to update publishing options" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
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
    const articleId = searchParams.get('articleId');

    if (!articleId) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    // Get article with publishing options
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: {
        id: true,
        status: true,
        visibility: true,
        scheduledAt: true,
        featured: true,
        allowComments: true,
        allowReactions: true,
        paywalled: true,
        readingMinutes: true,
        seriesId: true,
        seriesPosition: true,
        publishedAt: true,
        series: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      }
    });

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      publishingOptions: {
        status: article.status,
        visibility: article.visibility,
        scheduledAt: article.scheduledAt,
        featured: article.featured,
        allowComments: article.allowComments,
        allowReactions: article.allowReactions,
        paywalled: article.paywalled,
        readingMinutes: article.readingMinutes,
        seriesId: article.seriesId,
        seriesPosition: article.seriesPosition,
        series: article.series,
        publishedAt: article.publishedAt
      }
    });

  } catch (error) {
    console.error("Error fetching publishing options:", error);
    return NextResponse.json(
      { error: "Failed to fetch publishing options" },
      { status: 500 }
    );
  }
}
