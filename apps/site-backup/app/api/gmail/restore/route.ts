import { NextRequest, NextResponse } from 'next/server';
import { restoreFromTrash } from '@/lib/integrations/gmail';

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Email ID is required' },
        { status: 400 }
      );
    }

    await restoreFromTrash(id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Gmail restore error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to restore email' },
      { status: 500 }
    );
  }
}
