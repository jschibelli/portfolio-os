import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Generate a URL-safe slug from a title
 * Handles special characters, ensures uniqueness, and prevents conflicts
 * 
 * @param title - The title to convert to a slug
 * @returns A URL-safe slug string
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    // Replace spaces and underscores with hyphens
    .replace(/[\s_]+/g, '-')
    // Remove all non-alphanumeric characters except hyphens
    .replace(/[^a-z0-9-]/g, '')
    // Remove multiple consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Limit length to 100 characters
    .slice(0, 100) || 'untitled-series'
}

/**
 * Validate series title input
 * @param title - The title to validate
 * @returns Error message if invalid, null if valid
 */
function validateTitle(title: string): string | null {
  if (!title || typeof title !== 'string') {
    return 'Title is required and must be a string'
  }
  
  const trimmed = title.trim()
  if (trimmed.length === 0) {
    return 'Title cannot be empty'
  }
  
  if (trimmed.length > 200) {
    return 'Title must be 200 characters or less'
  }
  
  return null
}

/**
 * GET /api/series
 * Get all series with their article counts
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user has appropriate role
    const userRole = (session.user as any)?.role
    if (!userRole || !['ADMIN', 'EDITOR', 'AUTHOR'].includes(userRole)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Log the request for monitoring
    console.log(`[Series API] GET request by ${userRole} user: ${session.user?.email}`)

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
    // Log detailed error server-side
    console.error('[Series API] GET error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    })
    
    // Return generic error to client (don't expose internals)
    return NextResponse.json(
      { success: false, error: 'An error occurred while fetching series' },
      { status: 500 }
    )
  } finally {
    // Always disconnect Prisma client to prevent resource leakage
    await prisma.$disconnect().catch(err => {
      console.error('[Series API] Failed to disconnect Prisma:', err)
    })
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
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userRole = (session.user as any)?.role
    if (!userRole || !['ADMIN', 'EDITOR'].includes(userRole)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, coverUrl } = body

    // Validate title with comprehensive checks
    const titleError = validateTitle(title)
    if (titleError) {
      return NextResponse.json(
        { success: false, error: titleError },
        { status: 400 }
      )
    }

    // Validate description length if provided
    if (description && description.length > 1000) {
      return NextResponse.json(
        { success: false, error: 'Description must be 1000 characters or less' },
        { status: 400 }
      )
    }

    // Validate coverUrl format if provided
    if (coverUrl && typeof coverUrl === 'string' && coverUrl.length > 0) {
      try {
        new URL(coverUrl)
      } catch {
        return NextResponse.json(
          { success: false, error: 'Invalid cover URL format' },
          { status: 400 }
        )
      }
    }

    // Generate robust slug from title
    const slug = generateSlug(title)

    // Check if slug already exists
    const existingSeries = await prisma.series.findUnique({
      where: { slug }
    })

    if (existingSeries) {
      return NextResponse.json(
        { success: false, error: 'A series with a similar title already exists' },
        { status: 409 } // Conflict status code
      )
    }

    // Log series creation
    console.log(`[Series API] Creating series "${title}" by ${userRole} user: ${session.user?.email}`)

    const series = await prisma.series.create({
      data: {
        title: title.trim(),
        slug,
        description: description?.trim() || null,
        coverUrl: coverUrl?.trim() || null
      },
      include: {
        articles: true
      }
    })

    console.log(`[Series API] Successfully created series: ${series.id}`)

    return NextResponse.json({
      success: true,
      series: {
        id: series.id,
        title: series.title,
        slug: series.slug,
        description: series.description,
        articleCount: series.articles.length
      }
    }, { status: 201 }) // Created status code

  } catch (error) {
    // Log detailed error server-side
    console.error('[Series API] POST error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    })
    
    // Return generic error to client (don't expose internals)
    return NextResponse.json(
      { success: false, error: 'An error occurred while creating the series' },
      { status: 500 }
    )
  } finally {
    // Always disconnect Prisma client to prevent resource leakage
    await prisma.$disconnect().catch(err => {
      console.error('[Series API] Failed to disconnect Prisma:', err)
    })
  }
}

