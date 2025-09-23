// Google Calendar Integration Adapter
// Docs: https://developers.google.com/workspace/calendar/api/guides/create-events
// Server-only - uses OAuth user token via Auth.js session

import { getServerSession } from 'next-auth';
import { authOptions } from '@mindware-blog/lib/auth-config';

export interface CalendarEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
  hangoutLink?: string;
}

export interface CreateEventRequest {
  calendarId?: string;
  title: string;
  start: string;
  end: string;
  location?: string;
  attendees?: string[];
}

export interface CreateEventResponse {
  id: string;
  htmlLink: string;
}

// Get OAuth client for Calendar API
async function getCalendarClient() {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    throw new Error('No valid session found');
  }

  return {
    accessToken: session.accessToken,
  };
}

export async function listUpcoming({ 
  calendarId = 'primary', 
  maxResults = 10 
}: { 
  calendarId?: string; 
  maxResults?: number; 
}): Promise<CalendarEvent[]> {
  try {
    const client = await getCalendarClient();
    const now = new Date().toISOString();
    
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?` +
      `timeMin=${encodeURIComponent(now)}&` +
      `maxResults=${maxResults}&` +
      `orderBy=startTime&` +
      `singleEvents=true`,
      {
        headers: {
          Authorization: `Bearer ${client.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Calendar API error: ${response.status}`);
    }

    const data = await response.json();
    const events = data.items || [];

    return events.map((event: any) => ({
      id: event.id,
      summary: event.summary || '(No Title)',
      start: event.start?.dateTime || event.start?.date || '',
      end: event.end?.dateTime || event.end?.date || '',
      hangoutLink: event.hangoutLink,
    }));
  } catch (error) {
    console.error('Error listing upcoming events:', error);
    throw error;
  }
}

export async function createEvent(request: CreateEventRequest): Promise<CreateEventResponse> {
  try {
    const client = await getCalendarClient();
    const calendarId = request.calendarId || 'primary';
    
    const eventData = {
      summary: request.title,
      start: {
        dateTime: request.start,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: request.end,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      ...(request.location && { location: request.location }),
      ...(request.attendees && request.attendees.length > 0 && {
        attendees: request.attendees.map(email => ({ email })),
      }),
    };

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${client.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      }
    );

    if (!response.ok) {
      throw new Error(`Calendar API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      id: data.id,
      htmlLink: data.htmlLink,
    };
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}
