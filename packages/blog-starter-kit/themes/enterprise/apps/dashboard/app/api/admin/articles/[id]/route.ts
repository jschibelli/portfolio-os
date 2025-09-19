import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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

    const article = await prisma.article.findUnique({
      where: { id: params.id },
              include: {
          author: {
            select: {
              name: true,
              email: true,
              role: true
            }
          },
          cover: {
            select: {
              url: true
            }
          },
          categories: {
            select: {
              id: true,
              name: true,
              color: true
            }
          },
          tags: {
            select: {
              id: true,
              name: true,
              color: true
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

    // Transform the data to match the expected format
    const transformedArticle = {
      id: article.id,
      title: article.title,
      subtitle: article.excerpt && article.excerpt.length > 100 ? 
        article.excerpt.substring(0, 100) + '...' : article.excerpt,
      status: article.status,
      updatedAt: article.updatedAt.toISOString(),
      publishedAt: article.publishedAt?.toISOString(),
      author: {
        name: article.author?.name || 'Unknown',
        email: article.author?.email || ''
      },
      views: article.views || 0,
      readTime: article.readingMinutes || 5,
      tags: article.tags.map(tag => tag.name),
      featured: article.featured || false,
      slug: article.slug,
      excerpt: article.excerpt,
      image: article.cover?.url || undefined,
      contentMdx: article.contentMdx,
      contentJson: article.contentJson,
      categories: article.categories,
      allowComments: article.allowComments,
      paywalled: article.paywalled,
      noindex: article.noindex,
      visibility: article.visibility
    };

    return NextResponse.json(transformedArticle);
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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
      title, 
      excerpt, 
      contentMdx,
      contentJson,
      status,
      categories, 
      tags, 
      readingMinutes,
      wordCount,
      slug,
      coverImage,
      featured,
      allowComments,
      paywalled,
      noindex,
      visibility
    } = body;

    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id: params.id }
    });

    if (!existingArticle) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    // Check if slug is being changed and if it already exists
    if (slug && slug !== existingArticle.slug) {
      const slugExists = await prisma.article.findUnique({
        where: { slug }
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "An article with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {};
    
    if (title !== undefined) updateData.title = title;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (contentMdx !== undefined) updateData.contentMdx = contentMdx;
    if (contentJson !== undefined) updateData.contentJson = contentJson;
    if (status !== undefined) {
      updateData.status = status;
      // Set publishedAt if status is being changed to PUBLISHED
      if (status === 'PUBLISHED' && existingArticle.status !== 'PUBLISHED') {
        updateData.publishedAt = new Date();
      }
    }
    if (slug !== undefined) updateData.slug = slug;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (featured !== undefined) updateData.featured = featured;
    if (allowComments !== undefined) updateData.allowComments = allowComments;
    if (paywalled !== undefined) updateData.paywalled = paywalled;
    if (noindex !== undefined) updateData.noindex = noindex;
    if (visibility !== undefined) updateData.visibility = visibility;
    if (readingMinutes !== undefined) updateData.readingMinutes = readingMinutes;
    if (wordCount !== undefined) updateData.wordCount = wordCount;

    // Update the article
    const article = await prisma.article.update({
      where: { id: params.id },
      data: {
        ...updateData,
        categories: categories ? {
          set: categories.map((id: string) => ({ id }))
        } : undefined,
        tags: tags ? {
          set: tags.map((id: string) => ({ id }))
        } : undefined
      },
              include: {
          author: {
            select: {
              name: true,
              email: true,
              role: true
            }
          },
          cover: {
            select: {
              url: true
            }
          },
          categories: {
            select: {
              id: true,
              name: true,
              color: true
            }
          },
          tags: {
            select: {
              id: true,
              name: true,
              color: true
            }
          }
        }
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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

    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id: params.id }
    });

    if (!existingArticle) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    // Delete the article
    await prisma.article.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
}