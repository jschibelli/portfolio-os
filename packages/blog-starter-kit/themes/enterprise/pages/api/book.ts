import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
// Conditional Prisma import
let prisma: any = null;
try {
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
} catch (error) {
  console.log('Prisma not available - using mock booking functionality');
}
import { Resend } from 'resend';
import path from 'path';

const calendar = google.calendar('v3');
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check feature flag
  if (process.env.FEATURE_SCHEDULING !== 'true') {
    return res.status(503).json({ error: 'Scheduling feature is disabled' });
  }

  try {
    const { name, email, timezone, startTime, endTime, meetingType, notes } = req.body;

    // Validate required fields
    if (!name || !email || !timezone || !startTime || !endTime) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, email, timezone, startTime, endTime' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate timezone
    try {
      Intl.DateTimeFormat(undefined, { timeZone: timezone });
    } catch {
      return res.status(400).json({ error: 'Invalid timezone' });
    }

    // Validate time range
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (start <= now) {
      return res.status(400).json({ error: 'Start time must be in the future' });
    }

    if (end <= start) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }

    // Prefer env-based credentials (service account JSON values)
    let auth: any;
    if (process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_CLIENT_EMAIL) {
      auth = new google.auth.GoogleAuth({
        credentials: {
          type: process.env.GOOGLE_TYPE || 'service_account',
          project_id: process.env.GOOGLE_PROJECT_ID,
          private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
          private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '').trim(),
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          client_id: process.env.GOOGLE_CLIENT_ID,

        },
        scopes: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'],
      });
    } else if (process.env.GOOGLE_SERVICE_ACCOUNT_PATH) {
      // Fallback to key file if provided
      const serviceAccountPath = path.join(process.cwd(), process.env.GOOGLE_SERVICE_ACCOUNT_PATH);
      auth = new google.auth.GoogleAuth({
        keyFile: serviceAccountPath,
        scopes: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'],
      });
    } else {
      return res.status(500).json({ error: 'Google Calendar credentials not configured' });
    }

    // Create Google Calendar event with Meet link
    const event = {
      summary: `Meeting with ${name}`,
      description: notes || `Meeting scheduled via website chatbot.\n\nContact: ${email}\nMeeting Type: ${meetingType || 'General Discussion'}`,
      start: {
        dateTime: start.toISOString(),
        timeZone: timezone,
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: timezone,
      },
      conferenceData: {
        createRequest: {
          requestId: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
      // Note: Service accounts cannot add attendees without Domain-Wide Delegation
      // The event will be created in John's calendar, and the confirmation email will be sent separately
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 15 }, // 15 minutes before
        ],
      },
    };

    const calendarResponse = await calendar.events.insert({
      auth: auth,
      calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
      requestBody: event,
      conferenceDataVersion: 1,
      sendUpdates: 'none', // Don't send invitations (service account limitation)
    });

    const googleEventId = calendarResponse.data.id;
    const meetLink = (calendarResponse.data as any)?.hangoutLink || (calendarResponse.data as any)?.conferenceData?.entryPoints?.find((e: any) => e.entryPointType === 'video')?.uri || null;
    const htmlLink = (calendarResponse.data as any)?.htmlLink || null;

    // Store booking in database (if available)
    let booking = null;
    if (prisma) {
      try {
        booking = await prisma.booking.create({
          data: {
            name,
            email,
            timezone,
            startTime: start,
            endTime: end,
            meetingType,
            notes,
            googleEventId,
            status: 'CONFIRMED'
          }
        });
      } catch (dbError) {
        console.warn('Database not available, continuing without storing booking:', dbError);
        // Continue without database storage
      }
    }

    // Send confirmation email
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'John Schibelli <john@schibelli.dev>',
          to: [email],
          subject: 'Meeting Confirmed - John Schibelli',
          html: `
            <h2>Meeting Confirmed!</h2>
            <p>Hi ${name},</p>
            <p>Your meeting with John Schibelli has been confirmed for:</p>
            <p><strong>Date:</strong> ${start.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            <p><strong>Time:</strong> ${start.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })} - ${end.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })} (${timezone})</p>
            <p><strong>Type:</strong> ${meetingType || 'General Discussion'}</p>
            ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
                         <p>The meeting has been added to John's calendar. If you need to reschedule, please contact John at jschibelli@gmail.com.</p>
            ${meetLink ? `<p><strong>Google Meet:</strong> <a href="${meetLink}">${meetLink}</a></p>` : ''}
            <p>Looking forward to our meeting!</p>
            <p>Best regards,<br>John Schibelli</p>
          `
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't fail the booking if email fails
      }
    }

    // Send Slack notification
    if (process.env.SLACK_WEBHOOK_URL) {
      try {
        await fetch(process.env.SLACK_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: `📅 New meeting booked!\n\n*${name}* (${email})\n📅 ${start.toLocaleDateString()}\n⏰ ${start.toLocaleTimeString()} - ${end.toLocaleTimeString()}\n💬 ${meetingType || 'General Discussion'}\n${notes ? `📝 ${notes}` : ''}`
          })
        });
      } catch (slackError) {
        console.error('Failed to send Slack notification:', slackError);
        // Don't fail the booking if Slack notification fails
      }
    }

    return res.status(200).json({
      success: true,
      booking: {
        id: booking?.id || 'temp-' + Date.now(),
        startTime: start,
        endTime: end,
        googleEventId,
        googleMeetLink: meetLink,
        googleEventLink: htmlLink
      },
      message: 'Meeting booked successfully! Check your email for confirmation.'
    });

  } catch (error) {
    console.error('Error booking meeting:', error);
    return res.status(500).json({ 
      error: 'Failed to book meeting',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
}
