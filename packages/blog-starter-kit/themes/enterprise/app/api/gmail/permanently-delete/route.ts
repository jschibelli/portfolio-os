import { NextRequest, NextResponse } from 'next/server';
import { permanentlyDelete } from '@/lib/integrations/gmail';

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Email ID is required' },
        { status: 400 }
      );
    }

    await permanentlyDelete(id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Gmail permanently delete error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to permanently delete email' },
      { status: 500 }
    );
  }
}
