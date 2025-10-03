/**
 * Hashnode Publish API Route
 * POST /api/hashnode/publish
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { publishToHashnode, testHashnodeConnection } from '@/lib/hashnode-publishing-api';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any)?.role;
    if (!userRole || !['ADMIN', 'EDITOR', 'AUTHOR'].includes(userRole)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { articleId } = body;

    if (!articleId) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
    }

    // Get article from database
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: {
        tags: true,
        series: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Test connection first
    const isConnected = await testHashnodeConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Failed to connect to Hashnode API. Please check your credentials.' },
        { status: 500 }
      );
    }

    // Publish to Hashnode
    const hashnodeId = await publishToHashnode(article);

    // Update article with Hashnode ID
    await prisma.article.update({
      where: { id: articleId },
      data: {
        hashnodeId,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      hashnodeId,
      message: 'Article published to Hashnode successfully',
    });
  } catch (error: any) {
    console.error('[Hashnode Publish] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to publish to Hashnode',
        details: error.message,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

