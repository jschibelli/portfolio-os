import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    const now = new Date();
    
    // Find all scheduled articles that should be published
    const scheduledArticles = await prisma.article.findMany({
      where: {
        status: "SCHEDULED",
        scheduledAt: {
          lte: now,
        },
      },
      select: {
        id: true,
        slug: true,
      },
    });

    if (scheduledArticles.length === 0) {
      return NextResponse.json({ 
        message: "No scheduled articles to publish",
        published: 0 
      });
    }

    // Update all scheduled articles to published
    const result = await prisma.article.updateMany({
      where: {
        status: "SCHEDULED",
        scheduledAt: {
          lte: now,
        },
      },
      data: {
        status: "PUBLISHED",
        publishedAt: now,
      },
    });

    // Revalidate the blog routes to show new articles
    try {
      const revalidatePaths = [
        "/blog",
        ...scheduledArticles.map(article => `/blog/${article.slug}`)
      ];

      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/revalidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paths: revalidatePaths,
        }),
      });
    } catch (revalidateError) {
      console.error("Failed to revalidate routes:", revalidateError);
      // Don't fail the entire operation if revalidation fails
    }

    console.log(`Published ${result.count} scheduled articles`);

    return NextResponse.json({
      message: `Successfully published ${result.count} articles`,
      published: result.count,
      articles: scheduledArticles.map(article => article.slug),
    });
  } catch (error) {
    console.error("Failed to publish scheduled articles:", error);
    return NextResponse.json(
      { error: "Failed to publish scheduled articles" },
      { status: 500 }
    );
  }
}


