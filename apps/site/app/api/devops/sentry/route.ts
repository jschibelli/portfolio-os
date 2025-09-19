import { NextRequest, NextResponse } from 'next/server';
import { listIssues } from '@/lib/integrations/sentry';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const project = searchParams.get('project');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!project) {
      return NextResponse.json(
        { error: 'Missing required parameter: project' },
        { status: 400 }
      );
    }

    // Extract org from project (format: org/project)
    const [org] = project.split('/');
    if (!org) {
      return NextResponse.json(
        { error: 'Invalid project format. Must be "org/project"' },
        { status: 400 }
      );
    }

    const issues = await listIssues({ org, project, limit });

    return NextResponse.json({ issues });
  } catch (error: any) {
    console.error('Sentry DevOps error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch Sentry issues' },
      { status: 500 }
    );
  }
}
