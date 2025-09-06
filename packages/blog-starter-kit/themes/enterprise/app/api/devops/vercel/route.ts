import { NextRequest, NextResponse } from 'next/server';
import { listDeployments } from '@/lib/integrations/vercel';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const limit = parseInt(searchParams.get('limit') || '10');

    const deployments = await listDeployments({ projectId, limit });

    return NextResponse.json({ deployments });
  } catch (error: any) {
    console.error('Vercel DevOps error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch Vercel deployments' },
      { status: 500 }
    );
  }
}
