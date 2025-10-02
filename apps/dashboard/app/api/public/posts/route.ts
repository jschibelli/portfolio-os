import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Public API endpoint for posts - no authentication required
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');
    const tag = searchParams.get('tag');
    const featured = searchParams.get('featured');
    const skip = (page - 1) * limit;

    // Build where clause for published posts only
    const where: any = {
      status: 'PUBLISHED',
      visibility: 'PUBLIC'
    };
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { contentMdx: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (tag) {
      where.tags = {
        some: {
          tag: {
            name: { contains: tag, mode: 'insensitive' }
          }
        }
      };
    }
    
    if (featured === 'true') {
      where.featured = true;
    }

    const [posts, total] = await Promise.all([
      prisma.article.findMany({
        where,
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
        },
        orderBy: [
          { featured: 'desc' },
          { publishedAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.article.count({ where })
    ]);
    
    // Transform the data for public consumption
    const transformedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.contentMdx,
      publishedAt: post.publishedAt?.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      readingMinutes: post.readingMinutes || 5,
      wordCount: post.wordCount || 0,
      views: post.views || 0,
      featured: post.featured || false,
      author: {
        name: post.author?.name || 'Unknown',
        email: post.author?.email || '',
        bio: post.author?.bio || '',
        avatar: post.author?.avatar || ''
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
    }));

    return NextResponse.json({
      posts: transformedPosts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching public posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
