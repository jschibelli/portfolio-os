/**
 * Publishing Queue API
 * Manages the publishing queue for scheduled content
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/publishing/queue
 * Get all items in the publishing queue
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    const where: any = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const queueItems = await prisma.publishingQueue.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { scheduledFor: 'asc' },
        { createdAt: 'asc' }
      ],
      take: 100
    });

    return NextResponse.json({
      success: true,
      queue: queueItems,
      total: queueItems.length
    });

  } catch (error) {
    console.error('Queue fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch queue' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * POST /api/publishing/queue
 * Add an item to the publishing queue
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { articleId, platforms, scheduledFor, priority = 'normal' } = body;

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    if (!platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'At least one platform is required' },
        { status: 400 }
      );
    }

    // Create queue item
    const queueItem = await prisma.publishingQueue.create({
      data: {
        articleId,
        status: 'pending',
        priority,
        platforms,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        retryCount: 0,
        maxRetries: 3
      }
    });

    return NextResponse.json({
      success: true,
      queueItem
    });

  } catch (error) {
    console.error('Queue add error:', error);
    return NextResponse.json(
      { error: 'Failed to add to queue' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * DELETE /api/publishing/queue?id=xxx
 * Remove an item from the queue
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Queue item ID is required' },
        { status: 400 }
      );
    }

    await prisma.publishingQueue.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Queue item removed'
    });

  } catch (error) {
    console.error('Queue delete error:', error);
    return NextResponse.json(
      { error: 'Failed to remove from queue' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
