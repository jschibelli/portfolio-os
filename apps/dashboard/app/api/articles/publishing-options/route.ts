import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * POST /api/articles/publishing-options
 * Save publishing options for an article
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

    // Check if user has appropriate role
    const userRole = (session.user as any)?.role
    if (!userRole || !['ADMIN', 'EDITOR', 'AUTHOR'].includes(userRole)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      articleId,
      status,
      visibility,
      scheduledAt,
      featured,
      allowComments,
      allowReactions,
      paywalled,
      readingMinutes,
      seriesId,
      seriesPosition,
      crossPlatformPublishing
    } = body

    // Validate required fields
    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      )
    }

    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id: articleId }
    })

    if (!existingArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    // Update article with publishing options
    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: {
        status: status || existingArticle.status,
        visibility: visibility || existingArticle.visibility,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : existingArticle.scheduledAt,
        featured: featured !== undefined ? featured : existingArticle.featured,
        allowComments: allowComments !== undefined ? allowComments : existingArticle.allowComments,
        allowReactions: allowReactions !== undefined ? allowReactions : existingArticle.allowReactions,
        paywalled: paywalled !== undefined ? paywalled : existingArticle.paywalled,
        readingMinutes: readingMinutes !== undefined ? readingMinutes : existingArticle.readingMinutes,
        seriesId: seriesId || existingArticle.seriesId,
        seriesPosition: seriesPosition !== undefined ? seriesPosition : existingArticle.seriesPosition,
        updatedAt: new Date()
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        series: true
      }
    })

    // TODO: Handle cross-platform publishing
    // This would integrate with external APIs (Hashnode, Dev.to, Medium)
    if (crossPlatformPublishing) {
      // Store cross-platform publishing preferences
      // Implementation would depend on your cross-platform sync strategy
    }

    return NextResponse.json({
      success: true,
      article: {
        id: updatedArticle.id,
        title: updatedArticle.title,
        status: updatedArticle.status,
        visibility: updatedArticle.visibility,
        scheduledAt: updatedArticle.scheduledAt,
        featured: updatedArticle.featured,
        allowComments: updatedArticle.allowComments,
        allowReactions: updatedArticle.allowReactions,
        paywalled: updatedArticle.paywalled,
        readingMinutes: updatedArticle.readingMinutes,
        seriesId: updatedArticle.seriesId,
        seriesPosition: updatedArticle.seriesPosition,
        updatedAt: updatedArticle.updatedAt
      }
    })

  } catch (error) {
    console.error('Publishing options save error:', error)
    return NextResponse.json(
      { error: 'Failed to save publishing options' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

/**
 * GET /api/articles/publishing-options?articleId=xxx
 * Get publishing options for an article
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

    const { searchParams } = new URL(request.url)
    const articleId = searchParams.get('articleId')

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      )
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        visibility: true,
        scheduledAt: true,
        featured: true,
        allowComments: true,
        allowReactions: true,
        paywalled: true,
        readingMinutes: true,
        seriesId: true,
        seriesPosition: true,
        series: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      }
    })

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      publishingOptions: {
        status: article.status,
        visibility: article.visibility,
        scheduledAt: article.scheduledAt,
        featured: article.featured,
        allowComments: article.allowComments,
        allowReactions: article.allowReactions,
        paywalled: article.paywalled,
        readingMinutes: article.readingMinutes,
        seriesId: article.seriesId,
        seriesPosition: article.seriesPosition,
        series: article.series
      }
    })

  } catch (error) {
    console.error('Publishing options fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch publishing options' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
