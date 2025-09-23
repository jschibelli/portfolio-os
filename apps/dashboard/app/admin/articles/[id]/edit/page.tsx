/**
 * Edit Article Page
 * 
 * This page handles editing existing articles in the admin dashboard.
 * It includes comprehensive error handling, security validation, and
 * performance optimizations.
 * 
 * Security Features:
 * - Input validation and sanitization
 * - Role-based access control
 * - SQL injection prevention via Prisma
 * - XSS protection through proper data handling
 * 
 * Performance Features:
 * - Database query optimization
 * - Error boundary implementation
 * - Graceful fallback handling
 */

import { notFound, redirect } from 'next/navigation'
import { cache } from 'react'
import { prisma } from '@/lib/prisma'
import { ArticleEditor } from '../../_components/ArticleEditor'
import { validateArticleId, sanitizeInput } from '@/lib/validation'
import { getCurrentUser } from '@/lib/auth'

interface EditArticlePageProps {
  params: Promise<{
    id: string
  }>
}

// Cache the article data to prevent duplicate queries
const getArticleData = cache(async (articleId: string) => {
  try {
    // Validate and sanitize the article ID
    const validatedId = validateArticleId(articleId)
    if (!validatedId) {
      throw new Error('Invalid article ID format')
    }

    // Fetch article with optimized query
    const article = await prisma.article.findUnique({
      where: { id: validatedId },
      include: {
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            }
          }
        },
        cover: {
          select: {
            id: true,
            url: true,
            alt: true,
            width: true,
            height: true
          }
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            tags: true
          }
        }
      }
    })

    return article
  } catch (error) {
    console.error('Error fetching article:', error)
    throw new Error('Failed to fetch article data')
  }
})

// Validate user permissions for article editing
const validateEditPermissions = async (articleId: string, userId: string) => {
  try {
    // Check if user has admin role or is the article author
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    // Admin users can edit any article
    if (user.role === 'admin') {
      return true
    }

    // Regular users can only edit their own articles
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { authorId: true }
    })

    if (!article) {
      throw new Error('Article not found')
    }

    if (article.authorId !== userId) {
      throw new Error('Insufficient permissions to edit this article')
    }

    return true
  } catch (error) {
    console.error('Permission validation error:', error)
    throw new Error('Permission validation failed')
  }
}

export default async function EditArticlePage(props: EditArticlePageProps) {
  try {
    // Await params with proper error handling
    const params = await props.params
    const articleId = sanitizeInput(params.id)

    // Validate article ID format
    if (!validateArticleId(articleId)) {
      console.error('Invalid article ID:', articleId)
      notFound()
    }

    // Get current user for permission validation
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      redirect('/login?redirect=/admin/articles')
    }

    // Validate edit permissions
    await validateEditPermissions(articleId, currentUser.id)

    // Fetch article data with error handling
    const article = await getArticleData(articleId)

    if (!article) {
      console.error('Article not found:', articleId)
      notFound()
    }

    // Transform the article data for the editor with proper validation
    const editorData = {
      id: article.id,
      title: sanitizeInput(article.title) || '',
      slug: sanitizeInput(article.slug) || '',
      tags: article.tags.map(t => sanitizeInput(t.tag.name)).filter(Boolean),
      coverUrl: article.cover?.url || '',
      coverAlt: article.cover?.alt || '',
      content: article.contentJson || {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: '' }],
          },
        ],
      },
      author: {
        id: article.author.id,
        name: sanitizeInput(article.author.name) || '',
        email: article.author.email
      },
      meta: {
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        publishedAt: article.publishedAt,
        status: article.status,
        tagCount: article._count.tags
      }
    }

    return <ArticleEditor initialData={editorData} />

  } catch (error) {
    console.error('Edit article page error:', error)
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('Permission')) {
        redirect('/admin?error=insufficient_permissions')
      }
      if (error.message.includes('Authentication')) {
        redirect('/login?redirect=/admin/articles')
      }
    }
    
    // Fallback to 404 for unknown errors
    notFound()
  }
}
