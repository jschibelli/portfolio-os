// /app/api/articles/publish/route.ts
// API route for publishing articles

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PublishRequest, PublishResponse } from '@/lib/types/article'

export async function POST(request: NextRequest) {
  try {
    const body: PublishRequest = await request.json()
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      )
    }

    const updateData: any = {
      status: 'PUBLISHED',
      publishedAt: new Date(),
    }

    // Handle scheduled publishing
    if (body.publishAt && body.publishAt > new Date()) {
      updateData.status = 'SCHEDULED'
      updateData.scheduledAt = body.publishAt
      updateData.publishedAt = null
    }

    const article = await prisma.article.update({
      where: { id: body.id },
      data: updateData,
    })

    const response: PublishResponse = {
      id: article.id,
      slug: article.slug,
      url: `/blog/${article.slug}`, // Adjust based on your routing
      publishedAt: article.publishedAt || new Date(),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error publishing article:', error)
    return NextResponse.json(
      { error: 'Failed to publish article' },
      { status: 500 }
    )
  }
}

