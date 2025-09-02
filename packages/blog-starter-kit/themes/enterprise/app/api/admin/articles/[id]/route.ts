import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const article = await prisma.article.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        cover: {
          select: {
            url: true,
            alt: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
        series: true,
      },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    // Transform the data to match the expected format
    const transformedArticle = {
      id: article.id,
      title: article.title,
      subtitle: article.subtitle,
      status: article.status,
      updatedAt: article.updatedAt.toISOString(),
      publishedAt: article.publishedAt?.toISOString(),
      author: article.author,
      views: article.views,
      readTime: article.readingMinutes || 5,
      tags: article.tags.map(t => t.tag.name),
      featured: article.featured,
      slug: article.slug,
      excerpt: article.excerpt,
      image: article.cover?.url,
      contentMdx: article.contentMdx,
      contentJson: article.contentJson,
      visibility: article.visibility,
      scheduledAt: article.scheduledAt?.toISOString(),
    };

    return NextResponse.json(transformedArticle);
  } catch (error) {
    console.error("Failed to fetch article:", error);
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const body = await request.json();
    const { 
      title, 
      subtitle, 
      slug, 
      excerpt, 
      status, 
      visibility, 
      contentJson, 
      contentMdx,
      publishedAt,
      scheduledAt,
      featured,
      tags
    } = body;

    const updateData: any = {};
    
    if (title !== undefined) updateData.title = title;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (slug !== undefined) updateData.slug = slug;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (status !== undefined) updateData.status = status;
    if (visibility !== undefined) updateData.visibility = visibility;
    if (contentJson !== undefined) updateData.contentJson = contentJson;
    if (contentMdx !== undefined) updateData.contentMdx = contentMdx;
    if (featured !== undefined) updateData.featured = featured;
    
    // Handle publishing dates
    if (status === "PUBLISHED" && !publishedAt) {
      updateData.publishedAt = new Date();
    } else if (status === "SCHEDULED" && scheduledAt) {
      updateData.scheduledAt = new Date(scheduledAt);
    }

    // Update the article
    const updated = await prisma.article.update({
      where: { id: params.id },
      data: updateData,
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Handle tags update if provided
    if (tags !== undefined) {
      // Remove existing tags
      await prisma.articleTag.deleteMany({
        where: { articleId: params.id }
      });

      // Add new tags
      if (tags && tags.length > 0) {
        for (const tagName of tags) {
          let tag = await prisma.tag.findUnique({
            where: { name: tagName }
          });

          if (!tag) {
            tag = await prisma.tag.create({
              data: {
                name: tagName,
                slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
              }
            });
          }

          await prisma.articleTag.create({
            data: {
              articleId: params.id,
              tagId: tag.id
            }
          });
        }
      }
    }

    // Fetch the updated article with all relations
    const finalArticle = await prisma.article.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Transform the data to match the expected format
    const transformedArticle = {
      id: finalArticle!.id,
      title: finalArticle!.title,
      subtitle: finalArticle!.subtitle,
      status: finalArticle!.status,
      updatedAt: finalArticle!.updatedAt.toISOString(),
      publishedAt: finalArticle!.publishedAt?.toISOString(),
      author: finalArticle!.author,
      views: finalArticle!.views,
      readTime: finalArticle!.readingMinutes || 5,
      tags: finalArticle!.tags.map(t => t.tag.name),
      featured: finalArticle!.featured,
      slug: finalArticle!.slug,
      excerpt: finalArticle!.excerpt,
      image: finalArticle!.cover?.url,
    };

    return NextResponse.json(transformedArticle);
  } catch (error) {
    console.error("Failed to update article:", error);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Delete related records first
    await prisma.articleTag.deleteMany({
      where: { articleId: params.id }
    });

    // Delete the article
    await prisma.article.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Failed to delete article:", error);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
}
