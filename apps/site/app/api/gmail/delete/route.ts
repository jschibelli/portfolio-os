import { NextRequest, NextResponse } from 'next/server';
import { moveToTrash } from '@/lib/integrations/gmail';

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Email ID is required' },
        { status: 400 }
      );
    }

    await moveToTrash(id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Gmail delete error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete email' },
      { status: 500 }
    );
  }
}
