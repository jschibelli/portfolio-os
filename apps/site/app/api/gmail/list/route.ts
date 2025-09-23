import { NextRequest, NextResponse } from 'next/server';
import { listEmailsByFolder } from '@/lib/integrations/gmail';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || 'inbox';
    const limit = parseInt(searchParams.get('limit') || '20');
    const pageToken = searchParams.get('pageToken') || undefined;
    const type = searchParams.get('type'); // For backward compatibility

    // Handle backward compatibility for 'starred' and 'unread' types
    if (type === 'starred' || type === 'unread') {
      // For now, redirect to inbox with the type as a query parameter
      // You can implement separate starred/unread logic here if needed
      const response = await listEmailsByFolder('inbox', limit, pageToken);
      return NextResponse.json(response);
    }

    // Get emails for the specified folder with pagination
    const response = await listEmailsByFolder(folder, limit, pageToken);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Gmail list error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch emails',
        messages: [] 
      },
      { status: 500 }
    );
  }
}
