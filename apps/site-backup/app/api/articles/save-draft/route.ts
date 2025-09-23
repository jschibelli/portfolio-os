// /app/api/articles/save-draft/route.ts
// API route for saving article drafts with autosave functionality

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SaveDraftRequest, SaveDraftResponse } from '@/lib/types/article'
import { ensureUniqueSlug } from '@/lib/slugify'

export async function POST(request: NextRequest) {
  try {
    const body: SaveDraftRequest = await request.json()
    
    // Validate required fields
    if (!body.title || !body.slug || !body.content_json || !body.content_mdx) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Ensure slug is unique
    const uniqueSlug = await ensureUniqueSlug(body.slug, body.id)

    // Get current user (you'll need to implement auth)
    // For now, we'll use a default author ID
    const authorId = 'default-author-id' // Replace with actual auth

    const articleData = {
      title: body.title,
      slug: uniqueSlug,
      contentJson: body.content_json,
      contentMdx: body.content_mdx,
      status: 'DRAFT' as const,
      authorId,
      // Handle tags - you might want to create/connect Tag records
      // For now, we'll store them as a simple array in a JSON field
      // You'll need to add a tags field to your Article model or use the existing ArticleTag relation
    }

    let article

    if (body.id) {
      // Update existing article
      article = await prisma.article.update({
        where: { id: body.id },
        data: articleData,
      })
    } else {
      // Create new article
      article = await prisma.article.create({
        data: articleData,
      })
    }

    const response: SaveDraftResponse = {
      id: article.id,
      slug: article.slug,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error saving draft:', error)
    return NextResponse.json(
      { error: 'Failed to save draft' },
      { status: 500 }
    )
  }
}

