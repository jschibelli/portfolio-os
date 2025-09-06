import { NextRequest, NextResponse } from 'next/server';
import { listAssignedIssues, listAssignedPRs, listRecentCommits } from '@/lib/integrations/github';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const feed = searchParams.get('feed');
    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');
    const state = searchParams.get('state') as 'open' | 'closed' | 'all' | undefined;
    const branch = searchParams.get('branch');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!feed || !['issues', 'prs', 'commits'].includes(feed)) {
      return NextResponse.json(
        { error: 'Invalid feed parameter. Must be "issues", "prs", or "commits"' },
        { status: 400 }
      );
    }

    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'Missing required parameters: owner and repo' },
        { status: 400 }
      );
    }

    let data;
    switch (feed) {
      case 'issues':
        data = await listAssignedIssues({ owner, repo, state });
        break;
      case 'prs':
        data = await listAssignedPRs({ owner, repo, state });
        break;
      case 'commits':
        data = await listRecentCommits({ owner, repo, branch, limit });
        break;
    }

    return NextResponse.json({ [feed]: data });
  } catch (error: any) {
    console.error('GitHub DevOps error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch GitHub data' },
      { status: 500 }
    );
  }
}
