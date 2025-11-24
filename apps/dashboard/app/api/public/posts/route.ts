import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
              image: true
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
      excerpt: post.excerpt || '',
      content: post.contentMdx || '',
      publishedAt: post.publishedAt?.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      readingMinutes: post.readingMinutes || 5,
      views: post.views || 0,
      featured: post.featured || false,
      author: {
        name: post.author?.name || 'Unknown',
        email: post.author?.email || '',
        image: post.author?.image || ''
      },
      cover: post.cover ? {
        url: post.cover.url,
        alt: post.cover.alt || post.title
      } : null,
      tags: post.tags.map(articleTag => ({
        id: articleTag.tag.id,
        name: articleTag.tag.name,
        slug: articleTag.tag.slug
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
