/**
 * Hashnode Delete API Route
 * DELETE /api/hashnode/delete
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { deleteFromHashnode } from '@/lib/hashnode-publishing-api';

const prisma = new PrismaClient();

export async function DELETE(request: NextRequest) {
  try {
    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any)?.role;
    if (!userRole || !['ADMIN', 'EDITOR'].includes(userRole)) {
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
      select: {
        id: true,
        hashnodeId: true,
      },
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    if (!article.hashnodeId) {
      return NextResponse.json(
        { error: 'Article is not published on Hashnode' },
        { status: 400 }
      );
    }

    // Delete from Hashnode
    await deleteFromHashnode(article.hashnodeId);

    // Remove Hashnode ID from article
    await prisma.article.update({
      where: { id: articleId },
      data: {
        hashnodeId: null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Article deleted from Hashnode successfully',
    });
  } catch (error: any) {
    console.error('[Hashnode Delete] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete from Hashnode',
        details: error.message,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

