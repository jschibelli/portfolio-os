import { NextRequest, NextResponse } from 'next/server';
import { fetchPosts as fetchHashnodePosts } from '@/lib/hashnode-api';

/**
 * Debug endpoint to verify which Hashnode publication the deployment is querying.
 *
 * Usage:
 *   GET /api/debug/hashnode?secret=CRON_SECRET
 *
 * This is intentionally protected by CRON_SECRET so we can safely inspect prod.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get('secret');

  const expectedSecret = process.env.CRON_SECRET;
  if (!expectedSecret) {
    return NextResponse.json(
      { error: 'CRON_SECRET not configured on this deployment' },
      { status: 500 }
    );
  }

  if (secret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const envHost = process.env.HASHNODE_PUBLICATION_HOST || null;
  const envPublicHost = process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST || null;
  const useDashboardForBlog = process.env.USE_DASHBOARD_FOR_BLOG || null;

  try {
    const posts = await fetchHashnodePosts(10);
    const slim = posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      publishedAt: p.publishedAt,
    }));

    return NextResponse.json({
      ok: true,
      env: {
        HASHNODE_PUBLICATION_HOST: envHost,
        NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST: envPublicHost,
        USE_DASHBOARD_FOR_BLOG: useDashboardForBlog,
      },
      fetched: {
        count: posts.length,
        newestPublishedAt: posts[0]?.publishedAt ?? null,
        oldestPublishedAt: posts[posts.length - 1]?.publishedAt ?? null,
        posts: slim,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        env: {
          HASHNODE_PUBLICATION_HOST: envHost,
          NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST: envPublicHost,
          USE_DASHBOARD_FOR_BLOG: useDashboardForBlog,
        },
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}


