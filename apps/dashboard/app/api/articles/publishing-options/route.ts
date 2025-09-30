import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
      crossPlatformPublishing, // Not directly stored in Article model, but can be handled here
    } = body;

    if (!articleId) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    const updateData: any = {
      status,
      visibility,
      featured,
      allowComments,
      allowReactions,
      paywalled,
      readingMinutes: readingMinutes || null,
      seriesId: seriesId || null,
      seriesPosition: seriesPosition || null,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    };

    // Set publishedAt if status is PUBLISHED and it's not already set
    if (status === 'PUBLISHED') {
        const existingArticle = await prisma.article.findUnique({ where: { id: articleId } });
        if (existingArticle && existingArticle.status !== 'PUBLISHED') {
            updateData.publishedAt = new Date();
        }
    } else {
        updateData.publishedAt = null; // Clear publishedAt if not published
    }

    const article = await prisma.article.update({
      where: { id: articleId },
      data: updateData,
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error updating publishing options:", error);
    return NextResponse.json(
      { error: "Failed to update publishing options" },
      { status: 500 }
    );
  }
}