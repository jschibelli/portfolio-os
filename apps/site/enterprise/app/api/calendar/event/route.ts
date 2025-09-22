import { NextRequest, NextResponse } from 'next/server';
import { createEvent } from '@/lib/integrations/calendar';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { title, start, end, location, attendees, calendarId } = await request.json();

    if (!title || !start || !end) {
      return NextResponse.json(
        { error: 'Missing required fields: title, start, and end' },
        { status: 400 }
      );
    }

    const result = await createEvent({
      calendarId,
      title,
      start,
      end,
      location,
      attendees,
    });

    // Log activity
    await prisma.activity.create({
      data: {
        kind: 'EVENT_CREATED',
        channel: 'calendar',
        externalId: result.id,
        meta: {
          title,
          start,
          end,
          location,
          attendees,
        },
      },
    });

    return NextResponse.json({ success: true, id: result.id, htmlLink: result.htmlLink });
  } catch (error: any) {
    console.error('Calendar event creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create event' },
      { status: 500 }
    );
  }
}
