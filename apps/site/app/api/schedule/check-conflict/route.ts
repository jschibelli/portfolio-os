import { NextRequest, NextResponse } from 'next/server';

/**
 * Check for scheduling conflicts
 * POST /api/schedule/check-conflict
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { startISO, durationMinutes, timeZone } = body;

    if (!startISO || !durationMinutes) {
      return NextResponse.json(
        { error: 'Missing required fields: startISO, durationMinutes' },
        { status: 400 }
      );
    }

    // Calculate end time
    const startDate = new Date(startISO);
    const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

    // Import the calendar utility to check for conflicts
    const { google } = await import('googleapis');
    
    // Setup OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Check for existing events in the time slot
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: startISO,
        timeMax: endDate.toISOString(),
        timeZone: timeZone || 'America/New_York',
        items: [{ id: process.env.GOOGLE_CALENDAR_ID || 'primary' }],
      },
    });

    const busySlots = response.data.calendars?.[process.env.GOOGLE_CALENDAR_ID || 'primary']?.busy || [];

    if (busySlots.length > 0) {
      return NextResponse.json({
        hasConflict: true,
        message: 'This time slot conflicts with an existing meeting. Please select a different time.',
        conflictingSlots: busySlots,
      });
    }

    return NextResponse.json({
      hasConflict: false,
      message: 'No conflicts found',
    });
  } catch (error) {
    console.error('Error checking for conflicts:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check for conflicts',
        hasConflict: false, // Assume no conflict if check fails
      },
      { status: 500 }
    );
  }
}

