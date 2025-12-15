import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public API endpoint for posts - no authentication required
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Input validation and sanitization
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    const search = searchParams.get('search')?.trim();
    const tag = searchParams.get('tag')?.trim();
    const featured = searchParams.get('featured');
    
    // Validate and parse page number (must be positive integer, default: 1)
    let page = 1;
    if (pageParam) {
      const parsedPage = parseInt(pageParam, 10);
      if (!isNaN(parsedPage) && parsedPage > 0) {
        page = parsedPage;
      } else {
        console.warn(`[Posts API] Invalid page parameter: ${pageParam}, using default: 1`);
      }
    }
    
    // Validate and parse limit (must be positive integer between 1-100, default: 10)
    let limit = 10;
    if (limitParam) {
      const parsedLimit = parseInt(limitParam, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0 && parsedLimit <= 100) {
        limit = parsedLimit;
      } else {
        console.warn(`[Posts API] Invalid limit parameter: ${limitParam}, using default: 10 (max: 100)`);
      }
    }
    
    const skip = (page - 1) * limit;
    
    // Log request parameters for debugging
    console.log(`[Posts API] Request - page: ${page}, limit: ${limit}, search: ${search || 'none'}, tag: ${tag || 'none'}, featured: ${featured || 'none'}`);

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
    
    // Log query results for debugging
    console.log(`[Posts API] Query results - found ${posts.length} posts out of ${total} total`);
    
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
      tags: (post.tags || []).map(articleTag => ({
        id: articleTag.tag.id,
        name: articleTag.tag.name,
        slug: articleTag.tag.slug
      }))
    }));

    const response = {
      posts: transformedPosts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
    
    console.log(`[Posts API] Success - returning ${transformedPosts.length} posts`);
    return NextResponse.json(response);
  } catch (error) {
    console.error("[Posts API] Error fetching public posts:", error);
    if (error instanceof Error) {
      console.error("[Posts API] Error details:", {
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
