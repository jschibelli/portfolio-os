import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

/**
 * On-demand revalidation API endpoint
 * Allows manual cache clearing for specific paths
 * 
 * Usage:
 *   POST /api/revalidate?path=/blog&secret=YOUR_SECRET
 *   POST /api/revalidate?path=/blog/my-post-slug&secret=YOUR_SECRET
 * 
 * Required environment variables:
 *   CRON_SECRET - Secret key for authentication
 */
export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const secret = searchParams.get('secret');
    const path = searchParams.get('path');

    // Validate secret
    const expectedSecret = process.env.CRON_SECRET;
    if (!expectedSecret) {
      return NextResponse.json(
        { message: 'CRON_SECRET not configured' },
        { status: 500 }
      );
    }

    if (secret !== expectedSecret) {
      return NextResponse.json(
        { message: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Validate path
    if (!path) {
      return NextResponse.json(
        { message: 'Missing path parameter' },
        { status: 400 }
      );
    }

    // Revalidate the path
    revalidatePath(path);

    console.log(`[Revalidate API] Successfully revalidated: ${path}`);

    return NextResponse.json({
      revalidated: true,
      path,
      now: Date.now(),
    });
  } catch (error) {
    console.error('[Revalidate API] Error:', error);
    return NextResponse.json(
      {
        message: 'Error revalidating',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Also support GET for easier testing
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get('path') || '/blog';
  
  return NextResponse.json({
    message: 'Revalidation API is working!',
    usage: `POST /api/revalidate?path=${path}&secret=YOUR_SECRET`,
    note: 'Use POST method with correct secret to revalidate',
  });
}

