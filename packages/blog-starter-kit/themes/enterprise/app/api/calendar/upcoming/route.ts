import { NextRequest, NextResponse } from 'next/server';
import { listUpcoming } from '@/lib/integrations/calendar';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const calendarId = searchParams.get('calendarId') || process.env.GOOGLE_CALENDAR_ID || 'primary';

    const events = await listUpcoming({ 
      calendarId, 
      maxResults: limit 
    });

    return NextResponse.json({ events });
  } catch (error: any) {
    console.error('Calendar upcoming error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch upcoming events' },
      { status: 500 }
    );
  }
}
