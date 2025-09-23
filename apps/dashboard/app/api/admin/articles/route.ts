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
    const status = searchParams.get('status');
    const author = searchParams.get('author');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { contentMdx: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (status && status !== 'all') {
      where.status = status;
    }
    
    if (author && author !== 'all') {
      where.authorId = author;
    }
    
    if (category && category !== 'all') {
      where.categories = {
        some: {
          id: category
        }
      };
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
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
        },
        orderBy: [
          { updatedAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.article.count({ where })
    ]);
    
    // Transform the data to match the expected format
    const transformedArticles = articles.map(article => {
      return {
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
      tags: article.tags.map(tag => tag.tag.name),
      featured: article.featured || false,
      slug: article.slug,
      excerpt: article.excerpt,
      image: article.cover?.url || undefined
      };
    });

    return NextResponse.json({
      articles: transformedArticles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
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
    const { 
      title, 
      excerpt, 
      contentMdx,
      contentJson,
      status = 'DRAFT',
      categories, 
      tags, 
      readingMinutes,
      wordCount,
                    slug,
      // coverImageUrl,
      featured = false,
      allowComments = true,
      paywalled = false,
      noindex = false,
      visibility = 'PUBLIC'
    } = body;

    // Validate required fields
    if (!title || !slug) {
      return NextResponse.json(
        { error: "Title and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingArticle = await prisma.article.findUnique({
      where: { slug }
    });

    if (existingArticle) {
      return NextResponse.json(
        { error: "An article with this slug already exists" },
        { status: 400 }
      );
    }

    // Create the article
    const article = await prisma.article.create({
      data: {
        title,
        excerpt,
        contentMdx,
        contentJson,
        status,
        slug,
        // coverImageUrl,
        featured,
        allowComments,
        paywalled,
        noindex,
        visibility,
        readingMinutes: readingMinutes || 5,
        authorId: (session.user as any)?.id,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        tags: tags ? {
          connect: tags.map((id: string) => ({ id }))
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

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}
