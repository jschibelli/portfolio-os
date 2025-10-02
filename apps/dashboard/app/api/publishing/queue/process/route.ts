/**
 * Queue Processing API
 * Manual trigger for queue processing and stats
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { queueProcessor } from '@/lib/publishing/queue-processor';

/**
 * POST /api/publishing/queue/process
 * Manually trigger queue processing
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

    // Check if user has admin role
    const userRole = (session.user as any)?.role;
    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Trigger queue processing
    await queueProcessor.processQueue();

    // Get stats after processing
    const stats = await queueProcessor.getStats();

    return NextResponse.json({
      success: true,
      message: 'Queue processing completed',
      stats
    });

  } catch (error) {
    console.error('Queue processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process queue' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/publishing/queue/process
 * Get queue statistics
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

    const stats = await queueProcessor.getStats();

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Queue stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch queue stats' },
      { status: 500 }
    );
  }
}
