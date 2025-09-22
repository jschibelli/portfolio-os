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
    if (!userRole || !["ADMIN", "EDITOR"].includes(userRole)) {
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
    const scheduledDate = searchParams.get('scheduledDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build where clause for scheduled articles
    const where: any = {
      scheduledAt: {
        not: null
      }
    };
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
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
    
    if (scheduledDate && scheduledDate !== 'all') {
      const now = new Date();
      let startDate: Date;
      let endDate: Date;
      
      switch (scheduledDate) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
          break;
        case 'tomorrow':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2);
          break;
        case 'this-week':
          const dayOfWeek = now.getDay();
          const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysToMonday);
          endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
          break;
        case 'next-week':
          const nextMonday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (7 - now.getDay() + 1) % 7);
          startDate = nextMonday;
          endDate = new Date(nextMonday.getTime() + 7 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0);
          endDate = new Date(8640000000000000); // Max date
      }
      
      where.scheduledAt = {
        gte: startDate,
        lt: endDate
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
          { scheduledAt: 'asc' }
        ],
        skip,
        take: limit
      }),
      prisma.article.count({ where })
    ]);

    // Transform the data to match the expected format
    const transformedArticles = articles.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      status: article.status,
      scheduledAt: article.scheduledAt?.toISOString(),
      author: article.author?.name || 'Unknown',
      authorEmail: article.author?.email || '',
      authorRole: article.author?.role || 'AUTHOR',
      categories: [],
      tags: article.tags.map(tag => tag.tag.name),
      estimatedReadTime: article.readingMinutes || 5,
      lastModified: article.updatedAt.toISOString(),
      slug: article.slug
    }));

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
    console.error("Error fetching scheduled articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch scheduled articles" },
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
      content, 
      scheduledAt, 
      categories, 
      tags, 
      estimatedReadTime,
      wordCount,
      slug 
    } = body;

    // Create the scheduled article
    const article = await prisma.article.create({
      data: {
        title,
        excerpt,
        scheduledAt: new Date(scheduledAt),
        status: 'DRAFT',
        readingMinutes: estimatedReadTime,
        slug,
        authorId: (session.user as any)?.id
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
    console.error("Error creating scheduled article:", error);
    return NextResponse.json(
      { error: "Failed to create scheduled article" },
      { status: 500 }
    );
  }
}
