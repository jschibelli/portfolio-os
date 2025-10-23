import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Public API endpoint for individual post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const post = await prisma.article.findFirst({
      where: {
        slug,
        status: 'PUBLISHED',
        visibility: 'PUBLIC'
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
            bio: true,
            avatar: true
          }
        },
        cover: {
          select: {
            url: true,
            alt: true
          }
        },
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            }
          }
        }
      }
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.article.update({
      where: { id: post.id },
      data: { views: { increment: 1 } }
    });

    // Transform the data for public consumption
    const transformedPost = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.contentMdx || '',
      publishedAt: post.publishedAt?.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      readingMinutes: post.readingMinutes || 5,
      views: (post.views || 0) + 1, // Include the increment
      featured: post.featured || false,
      author: {
        name: post.author?.name || 'Unknown',
        email: post.author?.email || '',
        bio: '', // User model doesn't have bio field
        avatar: post.author?.image || '' // Use 'image' field from User model
      },
      cover: post.cover ? {
        url: post.cover.url,
        alt: post.cover.alt || post.title
      } : null,
      tags: post.tags.map(tag => ({
        id: tag.tag.id,
        name: tag.tag.name,
        slug: tag.tag.slug
      }))
    };

    return NextResponse.json(transformedPost);
  } catch (error) {
    console.error("Error fetching public post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}
