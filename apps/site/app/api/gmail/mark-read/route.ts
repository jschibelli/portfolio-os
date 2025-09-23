import { NextRequest, NextResponse } from 'next/server';
import { markAsRead } from '@/lib/integrations/gmail';

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Email ID is required' },
        { status: 400 }
      );
    }

    await markAsRead(id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Gmail mark as read error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to mark email as read' },
      { status: 500 }
    );
  }
}
