import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

/**
 * On-demand revalidation API endpoint
 * Allows manual cache clearing for specific paths
 * 
 * Usage:
 *   POST /api/revalidate?path=/blog&secret=YOUR_SECRET
 *   POST /api/revalidate?path=/blog/my-post-slug&secret=YOUR_SECRET
 *   POST /api/revalidate?path=/blog&path=/blog/my-post-slug&secret=YOUR_SECRET (multiple paths)
 * 
 * Required environment variables:
 *   CRON_SECRET - Secret key for authentication
 */
export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const secret = searchParams.get('secret');
    const paths = searchParams.getAll('path'); // Support multiple paths

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

    // Validate paths
    if (paths.length === 0) {
      return NextResponse.json(
        { message: 'Missing path parameter. Provide at least one path to revalidate.' },
        { status: 400 }
      );
    }

    // Revalidate all provided paths
    const revalidatedPaths: string[] = [];
    const errors: Array<{ path: string; error: string }> = [];

    for (const path of paths) {
      try {
        revalidatePath(path);
        revalidatedPaths.push(path);
        console.log(`[Revalidate API] Successfully revalidated: ${path}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push({ path, error: errorMessage });
        console.error(`[Revalidate API] Error revalidating ${path}:`, errorMessage);
      }
    }

    // If all paths failed, return error
    if (revalidatedPaths.length === 0) {
      return NextResponse.json(
        {
          message: 'Failed to revalidate all paths',
          errors,
        },
        { status: 500 }
      );
    }

    // Return success with any errors noted
    return NextResponse.json({
      revalidated: true,
      paths: revalidatedPaths,
      errors: errors.length > 0 ? errors : undefined,
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

