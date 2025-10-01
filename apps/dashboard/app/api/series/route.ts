import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * GET /api/series
 * Get all series with their article counts
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user has appropriate role
    const userRole = (session.user as any)?.role
    if (!userRole || !['ADMIN', 'EDITOR', 'AUTHOR'].includes(userRole)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const series = await prisma.series.findMany({
      include: {
        articles: {
          select: {
            id: true,
            title: true,
            slug: true,
            seriesPosition: true,
            status: true
          },
          orderBy: {
            seriesPosition: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      series: series.map(s => ({
        id: s.id,
        title: s.title,
        slug: s.slug,
        description: s.description,
        articleCount: s.articles.length,
        articles: s.articles
      }))
    })

  } catch (error) {
    console.error('Series fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch series' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

/**
 * POST /api/series
 * Create a new series
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userRole = (session.user as any)?.role
    if (!userRole || !['ADMIN', 'EDITOR'].includes(userRole)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, coverUrl } = body

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Check if slug already exists
    const existingSeries = await prisma.series.findUnique({
      where: { slug }
    })

    if (existingSeries) {
      return NextResponse.json(
        { error: 'A series with this title already exists' },
        { status: 400 }
      )
    }

    const series = await prisma.series.create({
      data: {
        title,
        slug,
        description: description || null,
        coverUrl: coverUrl || null
      },
      include: {
        articles: true
      }
    })

    return NextResponse.json({
      success: true,
      series: {
        id: series.id,
        title: series.title,
        slug: series.slug,
        description: series.description,
        articleCount: series.articles.length
      }
    })

  } catch (error) {
    console.error('Series creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create series' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

