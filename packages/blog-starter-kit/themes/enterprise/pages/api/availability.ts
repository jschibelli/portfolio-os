import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

// Initialize Google Calendar API
const calendar = google.calendar('v3');

// Business hours configuration
const BUSINESS_HOURS = {
  start: 9, // 9 AM
  end: 17,  // 5 PM
  timezone: 'America/New_York'
};

// Meeting duration options (in minutes)
const MEETING_DURATIONS = [30, 60];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check feature flag
  if (process.env.FEATURE_SCHEDULING !== 'true') {
    return res.status(503).json({ error: 'Scheduling feature is disabled' });
  }

  try {
    const { timezone = 'America/New_York', days = 14 } = req.body;

    // Validate inputs
    if (!timezone || typeof timezone !== 'string') {
      return res.status(400).json({ error: 'Valid timezone is required' });
    }

    if (days < 1 || days > 30) {
      return res.status(400).json({ error: 'Days must be between 1 and 30' });
    }

    // Check if Google Calendar credentials are configured
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REFRESH_TOKEN) {
      return res.status(500).json({ error: 'Google Calendar not configured' });
    }

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    // Calculate time range
    const now = new Date();
    const endDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    // Get busy times from Google Calendar
    const busyResponse = await calendar.freebusy.query({
      auth: oauth2Client,
      requestBody: {
        timeMin: now.toISOString(),
        timeMax: endDate.toISOString(),
        items: [{ id: process.env.GOOGLE_CALENDAR_ID || 'primary' }],
        timeZone: timezone,
      },
    });

    const busyTimes = busyResponse.data.calendars?.[process.env.GOOGLE_CALENDAR_ID || 'primary']?.busy || [];

    // Generate available time slots
    const availableSlots = generateAvailableSlots(now, endDate, busyTimes, timezone);

    return res.status(200).json({
      availableSlots,
      timezone,
      businessHours: BUSINESS_HOURS,
      meetingDurations: MEETING_DURATIONS
    });

  } catch (error) {
    console.error('Error fetching availability:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch availability',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
}

function generateAvailableSlots(
  startDate: Date,
  endDate: Date,
  busyTimes: any[],
  timezone: string
): Array<{ start: string; end: string; duration: number }> {
  const slots: Array<{ start: string; end: string; duration: number }> = [];
  const currentDate = new Date(startDate);

  while (currentDate < endDate) {
    // Skip weekends
    if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }

    // Generate slots for each meeting duration
    for (const duration of MEETING_DURATIONS) {
      const dayStart = new Date(currentDate);
      dayStart.setHours(BUSINESS_HOURS.start, 0, 0, 0);

      const dayEnd = new Date(currentDate);
      dayEnd.setHours(BUSINESS_HOURS.end, 0, 0, 0);

      let slotStart = new Date(dayStart);

      while (slotStart < dayEnd) {
        const slotEnd = new Date(slotStart.getTime() + duration * 60 * 1000);

        // Check if slot conflicts with busy times
        const isAvailable = !busyTimes.some(busy => {
          const busyStart = new Date(busy.start);
          const busyEnd = new Date(busy.end);
          return slotStart < busyEnd && slotEnd > busyStart;
        });

        if (isAvailable && slotEnd <= dayEnd) {
          slots.push({
            start: slotStart.toISOString(),
            end: slotEnd.toISOString(),
            duration
          });
        }

        // Move to next slot (30-minute intervals)
        slotStart.setMinutes(slotStart.getMinutes() + 30);
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Return only the first 10 available slots to avoid overwhelming the user
  return slots.slice(0, 10);
}
