import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// Conditional Prisma import
let prisma: any = null;
try {
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
} catch (error) {
  console.log('Prisma not available - database operations will be mocked');
}

// Conditional imports for optional dependencies
let google: any = null;
let calendar: any = null;
let resend: any = null;

try {
  const { google: googleModule } = require('googleapis');
  google = googleModule;
  calendar = google?.calendar('v3');
} catch (error) {
  console.log('Google APIs not available - scheduling will use mock data');
}

try {
  const { Resend } = require('resend');
  resend = new Resend(process.env.RESEND_API_KEY);
} catch (error) {
  console.log('Resend not available - email notifications disabled');
}

// Business hours configuration
const BUSINESS_HOURS = {
  start: 9, // 9 AM
  end: 17,  // 5 PM
  timezone: 'America/New_York'
};

// Meeting duration options (in minutes)
const MEETING_DURATIONS = [30, 60];

// Tool definitions for the chatbot
export const CHAT_TOOLS = [
  {
    type: "function" as const,
    function: {
      name: 'get_availability',
      description: 'Get available meeting time slots for scheduling',
      parameters: {
        type: 'object',
        properties: {
          timezone: {
            type: 'string',
            description: 'User\'s timezone (e.g., America/New_York). Defaults to Eastern time.',
            default: 'America/New_York'
          },
          days: {
            type: 'number',
            description: 'Number of days to look ahead (1-30). Always cap to 7 days.',
            default: 7
          },
          requestedTime: {
            type: 'string',
            description: 'Specific time the user wants (e.g., "2:00 PM", "3:00 PM", "10:00 AM" or ISO 8601 format). The system will look ahead 14 days to find the first available occurrence of this time. If the user asks for "2:00 PM", set this to "2:00 PM".'
          }
        },
        required: ['timezone']
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: 'book_meeting',
      description: 'Book a meeting slot with the user',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'User\'s full name'
          },
          email: {
            type: 'string',
            description: 'User\'s email address'
          },
          timezone: {
            type: 'string',
            description: 'User\'s timezone'
          },
          startTime: {
            type: 'string',
            description: 'Meeting start time (ISO string)'
          },
          endTime: {
            type: 'string',
            description: 'Meeting end time (ISO string)'
          },
          meetingType: {
            type: 'string',
            description: 'Type of meeting (e.g., consultation, project-discussion)',
            default: 'consultation'
          },
          notes: {
            type: 'string',
            description: 'Additional notes about the meeting'
          }
        },
        required: ['name', 'email', 'timezone', 'startTime', 'endTime']
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: 'get_case_study_chapter',
      description: 'Get a specific chapter from a case study',
      parameters: {
        type: 'object',
        properties: {
          caseStudyId: {
            type: 'string',
            description: 'ID of the case study (e.g., shopify-demo)',
            default: 'shopify-demo'
          },
          chapterId: {
            type: 'string',
            description: 'ID of the chapter to retrieve',
            default: 'overview'
          },
          visitorId: {
            type: 'string',
            description: 'Optional visitor ID for tracking'
          }
        },
        required: ['caseStudyId']
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: 'submit_client_intake',
      description: 'Submit a new client lead for project inquiry',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Client\'s full name'
          },
          email: {
            type: 'string',
            description: 'Client\'s email address'
          },
          company: {
            type: 'string',
            description: 'Client\'s company name'
          },
          role: {
            type: 'string',
            description: 'Client\'s role/title'
          },
          project: {
            type: 'string',
            description: 'Description of the project they need help with'
          },
          budget: {
            type: 'string',
            description: 'Project budget range (e.g., $10k-50k, TBD)'
          },
          timeline: {
            type: 'string',
            description: 'Project timeline (e.g., 3-6 months, ASAP)'
          },
          links: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Array of relevant links (portfolio, current site, etc.)'
          },
          notes: {
            type: 'string',
            description: 'Additional notes about the project'
          }
        },
        required: ['name', 'email', 'project']
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: 'show_calendar_modal',
      description: 'Display a calendar modal with available time slots for scheduling',
      parameters: {
        type: 'object',
        properties: {
          timezone: {
            type: 'string',
            description: 'User\'s timezone (e.g., America/New_York)',
            default: 'America/New_York'
          },
          days: {
            type: 'number',
            description: 'Number of days to look ahead (1-7)',
            default: 7
          },
          message: {
            type: 'string',
            description: 'Message to display with the calendar modal'
          }
        },
        required: ['timezone']
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: 'collect_contact_info',
      description: 'Collect user contact information before booking a meeting',
      parameters: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Message to display to the user requesting contact information'
          }
        },
        required: []
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: 'check_existing_booking',
      description: 'Check if the user already has a confirmed booking to prevent double booking',
      parameters: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            description: 'User\'s email address to check for existing bookings'
          },
          name: {
            type: 'string',
            description: 'User\'s name to check for existing bookings'
          }
        },
        required: ['email']
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: 'process_booking_request',
      description: 'Process a booking request - check for existing bookings first, then show booking modal if needed',
      parameters: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            description: 'User\'s email address'
          },
          name: {
            type: 'string',
            description: 'User\'s name'
          },
          timezone: {
            type: 'string',
            description: 'User\'s timezone',
            default: 'America/New_York'
          },
          message: {
            type: 'string',
            description: 'Message to display with the booking modal'
          }
        },
        required: ['email']
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: 'show_booking_modal',
      description: 'Show a unified booking modal that combines contact information collection and calendar selection',
      parameters: {
        type: 'object',
        properties: {
          timezone: {
            type: 'string',
            description: 'User\'s timezone (e.g., America/New_York)',
            default: 'America/New_York'
          },
          days: {
            type: 'number',
            description: 'Number of days to look ahead (1-7)',
            default: 7
          },
          message: {
            type: 'string',
            description: 'Message to display with the booking modal'
          },
          preferredTime: {
            type: 'string',
            description: 'Preferred time to highlight in the modal (e.g., "3:00 PM")'
          }
        },
        required: ['timezone']
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: 'show_booking_confirmation',
      description: 'Show a confirmation modal with booking details before creating the calendar event',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'User\'s full name'
          },
          email: {
            type: 'string',
            description: 'User\'s email address'
          },
          timezone: {
            type: 'string',
            description: 'User\'s timezone',
            default: 'America/New_York'
          },
          startTime: {
            type: 'string',
            description: 'Meeting start time (ISO string)'
          },
          endTime: {
            type: 'string',
            description: 'Meeting end time (ISO string)'
          },
          meetingType: {
            type: 'string',
            description: 'Type of meeting (e.g., consultation, project-discussion)',
            default: 'consultation'
          },
          message: {
            type: 'string',
            description: 'Message to display with the confirmation modal'
          }
        },
        required: ['name', 'email', 'startTime', 'endTime']
      }
    }
  }
];

// Tool execution functions
export async function executeTool(toolName: string, parameters: any) {
  switch (toolName) {
    case 'get_availability':
      return await getAvailability(parameters);
    
    case 'book_meeting':
      return await bookMeeting(parameters);
    
    case 'get_case_study_chapter':
      return await getCaseStudyChapter(parameters);
    
    case 'submit_client_intake':
      return await submitClientIntake(parameters);
    
    case 'show_calendar_modal':
      return await showCalendarModal(parameters);
    
    case 'collect_contact_info':
      return await collectContactInfo(parameters);
    
    case 'check_existing_booking':
      return await checkExistingBooking(parameters);
    
    case 'process_booking_request':
      return await processBookingRequest(parameters);
    
    case 'show_booking_modal':
      return await showBookingModal(parameters);
    
    case 'show_booking_confirmation':
      return await showBookingConfirmation(parameters);
    
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}



async function getAvailability(parameters: any) {
  const { timezone = 'America/New_York', days = 7, requestedTime } = parameters;

  // Debug environment variables
  console.log('🔍 Debug - Environment Variables:');
  console.log('  GOOGLE_CALENDAR_ID:', process.env.GOOGLE_CALENDAR_ID || 'NOT SET');
  console.log('  GOOGLE_SERVICE_ACCOUNT_PATH:', process.env.GOOGLE_SERVICE_ACCOUNT_PATH || 'NOT SET');
  console.log('  FEATURE_SCHEDULING:', process.env.FEATURE_SCHEDULING || 'NOT SET');

  // Check feature flag - enable by default if not set
  if (process.env.FEATURE_SCHEDULING === 'false') {
    throw new Error('Scheduling feature is disabled');
  }

  try {
    // Check if Google APIs are available
    if (!google) {
      throw new Error('Google APIs not available');
    }

    // Force service account path to be set correctly
    const serviceAccountPathEnv = process.env.GOOGLE_SERVICE_ACCOUNT_PATH || './google-service-account.json';
    console.log('🔍 Debug - Using service account path:', serviceAccountPathEnv);

    // Force calendar ID to be set correctly
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'jschibelli@gmail.com';
    console.log('🔍 Debug - Using calendar ID:', calendarId);

    // Check if calendar ID is properly set
    if (!calendarId || calendarId === 'primary') {
      throw new Error('Google Calendar ID is not properly configured. Please set GOOGLE_CALENDAR_ID to your personal calendar email.');
    }

    // Create service account client
    const serviceAccountPath = path.join(process.cwd(), serviceAccountPathEnv);
    const auth = new google.auth.GoogleAuth({
      keyFile: serviceAccountPath,
      scopes: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'],
    });

    // Calculate time range - when specific time is requested, look ahead 2 weeks
    const now = new Date();
    let lookaheadDays = Math.max(1, Math.min(7, Number.isFinite(days) ? days : 7));
    
    // Determine start date for availability search
    let startDate = now;
    let endDate = new Date(now.getTime() + lookaheadDays * 24 * 60 * 60 * 1000);
    
    // If a specific time is requested, look ahead 2 weeks to find that time
    if (requestedTime) {
      const requestedDate = new Date(requestedTime);
      if (!isNaN(requestedDate.getTime())) {
        // Check if the requested date is in the future (more than 30 days from now)
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        
        if (requestedDate > thirtyDaysFromNow) {
          // AI passed a future date - interpret as "3:00 PM this week" instead
          console.log('🔍 Debug: AI passed future date, interpreting as current week');
          startDate = now;
          endDate = new Date(now.getTime() + lookaheadDays * 24 * 60 * 60 * 1000);
        } else {
          // For specific time requests, look ahead 2 weeks to find that time
          lookaheadDays = 14; // Look ahead 2 weeks
          startDate = now;
          endDate = new Date(now.getTime() + lookaheadDays * 24 * 60 * 60 * 1000);
          console.log('🔍 Debug: Specific time requested, looking ahead 2 weeks from now:', startDate.toISOString(), 'to', endDate.toISOString());
        }
      } else {
        // Invalid date - fall back to current week
        console.log('🔍 Debug: Invalid date provided, using current week');
        startDate = now;
        endDate = new Date(now.getTime() + lookaheadDays * 24 * 60 * 60 * 1000);
      }
    } else {
      // For general availability requests, also look ahead 14 days to ensure we find the requested time
      lookaheadDays = 14;
      endDate = new Date(now.getTime() + lookaheadDays * 24 * 60 * 60 * 1000);
      console.log('🔍 Debug: General availability request, looking ahead 14 days from now:', startDate.toISOString(), 'to', endDate.toISOString());
    }

    // Get busy times from Google Calendar
    console.log('🔍 Debug: Fetching busy times from Google Calendar...');
    console.log('🔍 Debug: Calendar ID:', calendarId);
    console.log('🔍 Debug: Time range:', startDate.toISOString(), 'to', endDate.toISOString());
    
    const busyResponse = await calendar.freebusy.query({
      auth: auth,
      requestBody: {
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        items: [{ id: calendarId }],
        timeZone: timezone,
      },
    });

    console.log('🔍 Debug: Google Calendar API response:', JSON.stringify(busyResponse.data, null, 2));
    
    const busyTimes = busyResponse.data.calendars?.[calendarId]?.busy || [];
    console.log('🔍 Debug: Extracted busy times:', busyTimes);

    // Generate available time slots
    let availableSlots = generateAvailableSlots(startDate, endDate, busyTimes, timezone);

    console.log('🔍 Debug - Final availability response:', {
      availableSlots: availableSlots.length,
      timezone,
      businessHours: BUSINESS_HOURS,
      meetingDurations: MEETING_DURATIONS
    });
    
    // Determine the single next available slot to return
    let availabilityMessage = '';
    const timezoneNote = 'All meetings are scheduled in Eastern Time (ET).';

    if (requestedTime) {
      console.log('🔍 Debug: Processing requestedTime:', requestedTime);
      
      // Parse time string like "3:00 PM" into hour and minute
      let requestedHour = 0;
      let requestedMinute = 0;
      
      // Handle time formats like "3:00 PM", "3:00PM", "15:00", etc.
      const timePattern = /(\d{1,2}):(\d{2})\s*(AM|PM)?/i;
      const timeMatch = requestedTime.match(timePattern);
      
      if (timeMatch) {
        let hour = parseInt(timeMatch[1]);
        const minute = parseInt(timeMatch[2]);
        const period = timeMatch[3] ? timeMatch[3].toUpperCase() : null;
        
        // Convert 12-hour format to 24-hour format
        if (period === 'PM' && hour !== 12) {
          hour += 12;
        } else if (period === 'AM' && hour === 12) {
          hour = 0;
        }
        
        requestedHour = hour;
        requestedMinute = minute;
        
        console.log('🔍 Debug: Parsed time:', requestedHour + ':' + requestedMinute);
      } else {
        // Try to parse as ISO date string
        const requestedDate = new Date(requestedTime);
        if (!isNaN(requestedDate.getTime())) {
          requestedHour = requestedDate.getHours();
          requestedMinute = requestedDate.getMinutes();
          console.log('🔍 Debug: Parsed ISO date:', requestedHour + ':' + requestedMinute);
        } else {
          console.log('🔍 Debug: Failed to parse requestedTime:', requestedTime);
          // If parsing fails, still fall back to earliest slot
          const earliest = availableSlots[0];
          availableSlots = earliest ? [earliest] : [];
          availabilityMessage = earliest
            ? `The next available time is ${new Date(earliest.start).toLocaleString('en-US', { timeZone: timezone })} (ET). ${timezoneNote}`
            : `No available times in the next ${lookaheadDays} days. ${timezoneNote}`;
        }
      }
      
      if (requestedHour !== 0 || requestedMinute !== 0) {
        // Find the first available slot at or after the requested time
        console.log('🔍 Debug: Looking for slots at or after:', requestedHour + ':' + requestedMinute);
        console.log('🔍 Debug: Available slots:', availableSlots.length);
        
        // Find the slot that matches the requested time (3:00 PM)
        console.log('🔍 Debug: Looking for slot at:', requestedHour + ':' + requestedMinute);
        
        // Find the slot that starts at the requested time
        console.log('🔍 Debug: All available slots:');
        availableSlots.forEach((slot, index) => {
          const slotTime = new Date(slot.start);
          console.log(`🔍 Debug: Slot ${index}: ${slot.start} -> ${slotTime.toLocaleString('en-US', { timeZone: timezone })}`);
        });
        
        const matchingSlot = availableSlots.find(slot => {
          const slotTime = new Date(slot.start);
          const slotHour = slotTime.getHours();
          const slotMinute = slotTime.getMinutes();
          console.log('🔍 Debug: Checking slot:', slotHour + ':' + slotMinute, 'vs requested:', requestedHour + ':' + requestedMinute);
          
          // Additional debug for 2:00 PM slots specifically
          if (requestedHour === 14 && requestedMinute === 0) {
            console.log(`🔍 Debug: 2:00 PM MATCH CHECK - Slot: ${slot.start} (${slotHour}:${slotMinute}) vs Requested: ${requestedHour}:${requestedMinute}`);
          }
          
          return slotHour === requestedHour && slotMinute === requestedMinute;
        });
        
        const next = matchingSlot || availableSlots[0];
        availableSlots = next ? [next] : [];

        if (next) {
          const slotTime = new Date(next.start);
          availabilityMessage = `The next available time is ${slotTime.toLocaleString('en-US', { timeZone: timezone })} (ET). ${timezoneNote}`;
        } else {
          availabilityMessage = `No available times in the next ${lookaheadDays} days. ${timezoneNote}`;
          
          // Additional debug when no matching slot is found
          if (requestedHour === 14 && requestedMinute === 0) {
            console.log(`❌ Debug: NO 2:00 PM SLOT FOUND! Total available slots: ${availableSlots.length}`);
            console.log(`❌ Debug: Available slots that were generated:`);
            availableSlots.forEach((slot, index) => {
              const slotTime = new Date(slot.start);
              console.log(`  ${index + 1}. ${slot.start} -> ${slotTime.toLocaleString('en-US', { timeZone: timezone })}`);
            });
          }
        }
      }
    } else {
      // No specific time requested — return only the earliest slot
      const earliest = availableSlots[0];
      availableSlots = earliest ? [earliest] : [];
      availabilityMessage = earliest
        ? `The next available time is ${new Date(earliest.start).toLocaleString('en-US', { timeZone: timezone })} (ET). ${timezoneNote}`
        : `No available times in the next ${lookaheadDays} days. ${timezoneNote}`;
    }

    return {
      availableSlots,
      timezone,
      businessHours: BUSINESS_HOURS,
      meetingDurations: MEETING_DURATIONS,
      message: availabilityMessage || `The next available time in the next ${lookaheadDays} days is shown above. ${timezoneNote}`
    };
  } catch (error: any) {
    console.error('Error fetching availability:', error);
    throw new Error(`Failed to fetch availability: ${error.message}`);
  }
}

async function bookMeeting(parameters: any) {
  const { name, email, timezone, startTime, endTime, meetingType, notes } = parameters;

  // Check feature flag - enable by default if not set
  if (process.env.FEATURE_SCHEDULING === 'false') {
    throw new Error('Scheduling feature is disabled');
  }

  // Validate required fields
  if (!name || !email || !timezone || !startTime || !endTime) {
    throw new Error('Missing required fields: name, email, timezone, startTime, endTime');
  }

  try {
    // Check if Google APIs and service account are available
    if (!google || !process.env.GOOGLE_SERVICE_ACCOUNT_PATH) {
      throw new Error('Google Calendar API is not configured. Please set up GOOGLE_SERVICE_ACCOUNT_PATH environment variable.');
    }

    // Create service account client
    const serviceAccountPath = path.join(process.cwd(), process.env.GOOGLE_SERVICE_ACCOUNT_PATH);
    const auth = new google.auth.GoogleAuth({
      keyFile: serviceAccountPath,
      scopes: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // Create calendar event with Google Meet
    const event = {
      summary: `${meetingType || 'Meeting'} with ${name}`,
      description: `${notes || 'Meeting scheduled through chatbot'}\n\nGoogle Meet link will be available in the calendar event.`,
      start: {
        dateTime: startTime,
        timeZone: 'America/New_York', // Use fixed timezone format
      },
      end: {
        dateTime: endTime,
        timeZone: 'America/New_York', // Use fixed timezone format
      },
      // Note: Google Meet integration requires additional setup
      // For now, we'll create the calendar event without conference data
      // Users can manually add Google Meet to the event
      // Don't add attendees for now - service account can't send invitations
      // We'll handle notifications separately
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 30 }, // 30 minutes before
        ],
      },
    };

    // Insert event into Google Calendar
    const calendarResponse = await calendar.events.insert({
      auth: auth,
      calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
      resource: event,
      sendUpdates: 'none', // Don't send invitations (service account limitation)
    });

    // Store booking in database if available
    let bookingId = null;
    if (prisma) {
      try {
        const booking = await prisma.booking.create({
          data: {
            name,
            email,
            timezone,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            meetingType,
            notes,
            status: 'CONFIRMED',
            googleEventId: calendarResponse.data.id // Store Google Calendar event ID
          }
        });
        bookingId = booking.id;
      } catch (dbError) {
        console.error('Failed to store booking in database:', dbError);
        // Don't fail the request if database storage fails
      }
    }

    // Send email notifications if Resend is configured
    let emailSent = false;
    if (resend && process.env.RESEND_API_KEY) {
      try {
        // Send confirmation to the user
        await resend.emails.send({
          from: 'John Schibelli <john@mindware.dev>',
          to: [email],
          subject: `Meeting Confirmed: ${meetingType || 'Consultation'} with John Schibelli`,
          html: `
            <h2>Meeting Confirmed!</h2>
            <p>Hi ${name},</p>
            <p>Your meeting with John Schibelli has been scheduled successfully.</p>
            <h3>Meeting Details:</h3>
            <ul>
              <li><strong>Date:</strong> ${new Date(startTime).toLocaleDateString()}</li>
              <li><strong>Time:</strong> ${new Date(startTime).toLocaleTimeString()} - ${new Date(endTime).toLocaleTimeString()}</li>
              <li><strong>Type:</strong> ${meetingType || 'Consultation'}</li>
              ${notes ? `<li><strong>Notes:</strong> ${notes}</li>` : ''}
            </ul>
            <h3>Video Conference:</h3>
            <p>You'll receive a calendar invitation shortly. To add Google Meet video conferencing, you can:</p>
            <ul>
              <li>Open the calendar event in Google Calendar</li>
              <li>Click "Add Google Meet video conferencing"</li>
              <li>Or John will add it before the meeting</li>
            </ul>
            <p>If you need to reschedule, please contact John directly.</p>
            <p>Best regards,<br>John Schibelli</p>
          `
        });

        // Send notification to John
        await resend.emails.send({
          from: 'Chatbot <noreply@mindware.dev>',
          to: [process.env.GOOGLE_CALENDAR_EMAIL || 'jschibelli@gmail.com'],
          subject: `New Meeting Scheduled: ${name}`,
          html: `
            <h2>New Meeting Scheduled</h2>
            <p>A new meeting has been scheduled through your chatbot.</p>
            <h3>Meeting Details:</h3>
            <ul>
              <li><strong>Name:</strong> ${name}</li>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Date:</strong> ${new Date(startTime).toLocaleDateString()}</li>
              <li><strong>Time:</strong> ${new Date(startTime).toLocaleTimeString()} - ${new Date(endTime).toLocaleTimeString()}</li>
              <li><strong>Type:</strong> ${meetingType || 'Consultation'}</li>
              ${notes ? `<li><strong>Notes:</strong> ${notes}</li>` : ''}
            </ul>
            <p>Event ID: ${calendarResponse.data.id}</p>
          `
        });

        emailSent = true;
      } catch (emailError) {
        console.error('Failed to send email notifications:', emailError);
      }
    }

    return {
      success: true,
      booking: {
        id: bookingId || 'google-calendar-event',
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        googleEventId: calendarResponse.data.id
      },
      message: `Meeting successfully scheduled in Google Calendar!${emailSent ? ' You should receive a confirmation email shortly.' : ''} Event ID: ${calendarResponse.data.id}`
    };
  } catch (error: any) {
    console.error('Error booking meeting:', error);
    throw new Error(`Failed to book meeting: ${error.message}`);
  }
}

async function getCaseStudyChapter(parameters: any) {
  const { caseStudyId, chapterId = 'overview', visitorId } = parameters;

  // Check feature flag - enable by default if not set
  if (process.env.FEATURE_CASE_STUDY === 'false') {
    throw new Error('Case study feature is disabled');
  }

  try {
    // Load case study from JSON file
    const caseStudyPath = path.join(process.cwd(), 'content', 'case-studies', `${caseStudyId}.json`);
    
    if (!fs.existsSync(caseStudyPath)) {
      throw new Error('Case study not found');
    }

    const caseStudyContent = JSON.parse(fs.readFileSync(caseStudyPath, 'utf8'));
    
    // Validate chapter exists
    if (!caseStudyContent.chapters || !caseStudyContent.chapters[chapterId]) {
      throw new Error('Chapter not found');
    }

    const chapter = caseStudyContent.chapters[chapterId];

    // Track view in database
    if (prisma) {
      try {
        await prisma.caseStudyView.create({
          data: {
            caseStudyId,
            chapterId,
            visitorId: visitorId || null,
            viewedAt: new Date()
          }
        });
      } catch (dbError) {
        console.error('Failed to track case study view:', dbError);
        // Don't fail the request if tracking fails
      }
    }

    // Return chapter data
    return {
      caseStudy: {
        id: caseStudyContent.id,
        title: caseStudyContent.title,
        description: caseStudyContent.description,
        client: caseStudyContent.client,
        duration: caseStudyContent.duration,
        team: caseStudyContent.team
      },
      chapter: {
        id: chapterId,
        title: chapter.title,
        blocks: chapter.blocks
      },
      availableChapters: Object.keys(caseStudyContent.chapters).map(chapterKey => ({
        id: chapterKey,
        title: caseStudyContent.chapters[chapterKey].title
      }))
    };
  } catch (error) {
    console.error('Error fetching case study:', error);
    throw new Error('Failed to fetch case study');
  }
}

async function submitClientIntake(parameters: any) {
  const { name, email, company, role, project, budget, timeline, links = [], notes } = parameters;

  // Check feature flag - enable by default if not set
  if (process.env.FEATURE_CLIENT_INTAKE === 'false') {
    throw new Error('Client intake feature is disabled');
  }

  // Validate required fields
  if (!name || !email || !project) {
    throw new Error('Missing required fields: name, email, project');
  }

  try {
    // Sanitize inputs
    const sanitizedName = name.trim().substring(0, 100);
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedCompany = company?.trim().substring(0, 100) || null;
    const sanitizedRole = role?.trim().substring(0, 100) || null;
    const sanitizedProject = project.trim().substring(0, 500);
    const sanitizedBudget = budget?.trim().substring(0, 50) || null;
    const sanitizedTimeline = timeline?.trim().substring(0, 50) || null;
    const sanitizedNotes = notes?.trim().substring(0, 1000) || null;

    // Validate and sanitize links
    const sanitizedLinks = Array.isArray(links) 
      ? links
          .filter(link => typeof link === 'string' && link.trim().length > 0)
          .map(link => link.trim().substring(0, 500))
          .slice(0, 10) // Limit to 10 links
      : [];

    if (!prisma) {
      throw new Error('Database is not configured. Please set up Prisma and run database migrations.');
    }

    // Store lead in database
    const lead = await prisma.lead.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        company: sanitizedCompany,
        role: sanitizedRole,
        project: sanitizedProject,
        budget: sanitizedBudget,
        timeline: sanitizedTimeline,
        links: JSON.stringify(sanitizedLinks), // Convert array to JSON string for SQLite
        notes: sanitizedNotes,
        status: 'NEW'
      }
    });

    return {
      success: true,
      lead: {
        id: lead.id,
        name: lead.name,
        email: lead.email,
        project: lead.project
      },
      message: 'Thank you for your interest! We\'ll be in touch soon.'
    };
  } catch (error) {
    console.error('Error submitting lead:', error);
    throw new Error('Failed to submit lead');
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
  const now = new Date();

  console.log('🔍 Debug: Checking availability from', startDate.toISOString(), 'to', endDate.toISOString());
  console.log('🔍 Debug: Found', busyTimes.length, 'busy time periods');
  console.log('🔍 Debug: Using timezone:', timezone);
  console.log('🔍 Debug: Current time (UTC):', now.toISOString());
  
  // Log busy times for debugging
  busyTimes.forEach((busy, index) => {
    console.log(`🔍 Debug: Busy ${index + 1}:`, busy.start, 'to', busy.end);
  });

  while (currentDate < endDate) {
    console.log(`🔍 Debug: Processing date: ${currentDate.toISOString().split('T')[0]} (day ${currentDate.getDay()})`);
    
    // Skip weekends
    if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
      console.log(`🔍 Debug: Skipping weekend: ${currentDate.toISOString().split('T')[0]}`);
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }

    // Generate slots for each meeting duration
    for (const duration of MEETING_DURATIONS) {
      // Create day start and end in the specified timezone
      const dayStart = new Date(currentDate);
      dayStart.setHours(BUSINESS_HOURS.start, 0, 0, 0);

      const dayEnd = new Date(currentDate);
      dayEnd.setHours(BUSINESS_HOURS.end, 0, 0, 0);

      console.log(`🔍 Debug: Generating slots for ${currentDate.toISOString().split('T')[0]} - ${dayStart.toISOString()} to ${dayEnd.toISOString()}`);

      let slotStart = new Date(dayStart);

      while (slotStart < dayEnd) {
        const slotEnd = new Date(slotStart.getTime() + duration * 60 * 1000);

        // Skip slots that are in the past (within the next 30 minutes to allow for booking)
        const minimumBookingTime = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes from now
        if (slotStart < minimumBookingTime) {
          console.log(`🔍 Debug: Skipping past slot: ${slotStart.toISOString()} (current time: ${now.toISOString()})`);
          slotStart.setMinutes(slotStart.getMinutes() + 30);
          continue;
        }

        // Check if slot conflicts with busy times
        const isAvailable = !busyTimes.some(busy => {
          const busyStart = new Date(busy.start);
          const busyEnd = new Date(busy.end);
          
          // Convert slot times to UTC for proper comparison
          const slotStartUTC = slotStart.toISOString();
          const slotEndUTC = slotEnd.toISOString();
          
          // Check for overlap: slot overlaps with busy time if:
          // slot starts before busy ends AND slot ends after busy starts
          const hasOverlap = slotStartUTC < busyEnd.toISOString() && slotEndUTC > busyStart.toISOString();
          
          if (hasOverlap) {
            console.log(`🔍 Debug: Slot ${slotStart.toISOString()}-${slotEnd.toISOString()} conflicts with busy ${busyStart.toISOString()}-${busyEnd.toISOString()}`);
          }
          
          // Additional debug for 2:00 PM slots specifically
          if (slotStart.getHours() === 14 && slotStart.getMinutes() === 0) {
            console.log(`🔍 Debug: 2:00 PM slot check - Slot: ${slotStart.toISOString()}, Busy: ${busyStart.toISOString()}-${busyEnd.toISOString()}, Overlap: ${hasOverlap}`);
          }
          
          return hasOverlap;
        });

        if (isAvailable && slotEnd <= dayEnd) {
          console.log(`✅ Debug: Available slot found: ${slotStart.toISOString()} - ${slotEnd.toISOString()}`);
          
          // Additional debug for 2:00 PM slots specifically
          if (slotStart.getHours() === 14 && slotStart.getMinutes() === 0) {
            console.log(`✅ Debug: 2:00 PM slot marked as AVAILABLE: ${slotStart.toISOString()} - ${slotEnd.toISOString()}`);
          }
          
          // Store the slot as-is (it's already in the correct timezone)
          slots.push({
            start: slotStart.toISOString(),
            end: slotEnd.toISOString(),
            duration
          });
        } else {
          // Debug for slots that are filtered out
          if (slotStart.getHours() === 14 && slotStart.getMinutes() === 0) {
            console.log(`❌ Debug: 2:00 PM slot filtered out - Available: ${isAvailable}, Within day: ${slotEnd <= dayEnd}`);
          }
        }

        // Move to next slot (30-minute intervals)
        slotStart.setMinutes(slotStart.getMinutes() + 30);
      }
    }

    console.log(`🔍 Debug: Moving to next day: ${currentDate.toISOString().split('T')[0]} -> ${new Date(currentDate.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  console.log(`🔍 Debug: Generated ${slots.length} available slots`);
  
  // Return all available slots - the filtering logic will handle selecting the right one
  return slots;
}

async function showCalendarModal(parameters: any) {
  const { timezone = 'America/New_York', days = 7, message } = parameters;

  try {
    // First, get the availability data
    const availabilityResult = await getAvailability({ timezone, days });
    
    // Return a UI action that the frontend can handle
    return {
      type: 'ui_action',
      action: 'show_calendar_modal',
      data: {
        availableSlots: availabilityResult.availableSlots,
        timezone: availabilityResult.timezone,
        businessHours: availabilityResult.businessHours,
        meetingDurations: availabilityResult.meetingDurations,
        message: message || 'Here are the available time slots for scheduling:'
      }
    };
  } catch (error) {
    console.error('Error showing calendar modal:', error);
    throw new Error('Failed to show calendar modal');
  }
}

async function collectContactInfo(parameters: any) {
  const { message } = parameters;

  try {
    // Return a UI action to show a contact form
    return {
      type: 'ui_action',
      action: 'show_contact_form',
      data: {
        message: message || 'To book a meeting, I need your contact information. Please provide your name and email address.',
        fields: ['name', 'email', 'timezone'],
        required: ['name', 'email']
      }
    };
  } catch (error) {
    console.error('Error collecting contact info:', error);
    throw new Error('Failed to collect contact information');
  }
}

async function checkExistingBooking(parameters: any) {
  const { email, name } = parameters;

  try {
    console.log('🔍 Debug - checkExistingBooking called with parameters:', parameters);
    
    // Check if we have Prisma available
    if (!prisma) {
      console.log('🔍 Debug - Prisma not available, returning no existing booking');
      return {
        hasExistingBooking: false,
        message: 'Unable to check existing bookings'
      };
    }

    // Look for existing bookings in the database
    const existingBookings = await prisma.booking.findMany({
      where: {
        OR: [
          { email: email },
          { name: name }
        ],
        startTime: {
          gte: new Date() // Only future bookings
        }
      },
      orderBy: {
        startTime: 'asc'
      },
      take: 1 // Get the next upcoming booking
    });

    console.log('🔍 Debug - Found existing bookings:', existingBookings.length);

    if (existingBookings.length > 0) {
      const booking = existingBookings[0];
      const startTime = new Date(booking.startTime);
      const endTime = new Date(booking.endTime);
      
      return {
        type: 'ui_action',
        action: 'show_existing_booking',
        data: {
          booking: {
            id: booking.id,
            name: booking.name,
            email: booking.email,
            startTime: booking.startTime,
            endTime: booking.endTime,
            duration: Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60)), // Duration in minutes
            googleEventId: booking.googleEventId
          },
          message: `You already have a confirmed ${Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))}-minute meeting scheduled for ${startTime.toLocaleDateString()} at ${startTime.toLocaleTimeString()}.`
        }
      };
    }

    return {
      hasExistingBooking: false,
      message: 'No existing bookings found. Proceeding with booking modal.'
    };
  } catch (error) {
    console.error('Error checking existing booking:', error);
    return {
      hasExistingBooking: false,
      message: 'Unable to check existing bookings'
    };
  }
}

async function processBookingRequest(parameters: any) {
  const { email, name, timezone = 'America/New_York', message } = parameters;

  try {
    console.log('🔍 Debug - processBookingRequest called with parameters:', parameters);
    
    // First, check for existing bookings
    const existingBookingResult = await checkExistingBooking({ email, name });
    
    // If there's an existing booking, return it
    if (existingBookingResult.type === 'ui_action' && existingBookingResult.action === 'show_existing_booking') {
      return existingBookingResult;
    }
    
    // If no existing booking, show the booking modal
    console.log('🔍 Debug - No existing booking found, showing booking modal');
    return await showBookingModal({ timezone, days: 7, message });
    
  } catch (error) {
    console.error('Error processing booking request:', error);
    throw new Error('Failed to process booking request');
  }
}

function filterSlotsForModal(slots: Array<{ start: string; end: string; duration: number }>): Array<{ start: string; end: string; duration: number }> {
  const filteredSlots: Array<{ start: string; end: string; duration: number }> = [];
  const slotsByDay: { [key: string]: Array<{ start: string; end: string; duration: number }> } = {};

  // Group slots by day
  slots.forEach(slot => {
    const slotDate = new Date(slot.start);
    const dayKey = slotDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    if (!slotsByDay[dayKey]) {
      slotsByDay[dayKey] = [];
    }
    slotsByDay[dayKey].push(slot);
  });

  // For each day, select 1-2 slots (preferring morning and afternoon)
  Object.keys(slotsByDay).sort().forEach(dayKey => {
    const daySlots = slotsByDay[dayKey];
    
    // Sort slots by time (earliest first)
    daySlots.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    
    // Select up to 2 slots per day
    const selectedSlots = daySlots.slice(0, 2);
    filteredSlots.push(...selectedSlots);
  });

  console.log(`🔍 Debug: Filtered ${slots.length} slots down to ${filteredSlots.length} slots for modal`);
  return filteredSlots;
}

async function showBookingModal(parameters: any) {
  const { timezone = 'America/New_York', days = 7, message, preferredTime } = parameters;

  try {
    console.log('🔍 Debug - showBookingModal called with parameters:', parameters);
    console.log('🔍 Debug - showBookingModal - timezone:', timezone);
    console.log('🔍 Debug - showBookingModal - days:', days);
    console.log('🔍 Debug - showBookingModal - message:', message);
    console.log('🔍 Debug - showBookingModal - preferredTime:', preferredTime);
    
    // Get business hours and meeting durations configuration
    const businessHours = BUSINESS_HOURS;
    const meetingDurations = MEETING_DURATIONS;
    const tz = timezone;
    
    // Get the raw availability data with all slots
    const now = new Date();
    const lookaheadDays = Math.min(days, 14); // Cap at 14 days for booking modal
    let startDate = now;
    let endDate = new Date(now.getTime() + lookaheadDays * 24 * 60 * 60 * 1000);

    // Check if Google APIs and service account are available
    if (!google || !process.env.GOOGLE_SERVICE_ACCOUNT_PATH) {
      throw new Error('Google Calendar API is not configured');
    }

    // Create service account client
    const serviceAccountPath = path.join(process.cwd(), process.env.GOOGLE_SERVICE_ACCOUNT_PATH);
    const auth = new google.auth.GoogleAuth({
      keyFile: serviceAccountPath,
      scopes: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'],
    });

    const calendar = google.calendar({ version: 'v3', auth });
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

    // Get busy times from Google Calendar
    console.log('🔍 Debug: Fetching busy times for booking modal...');
    const busyResponse = await calendar.freebusy.query({
      auth: auth,
      requestBody: {
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        items: [{ id: calendarId }],
        timeZone: timezone,
      },
    });

    const busyTimes = busyResponse.data.calendars?.[calendarId]?.busy || [];
    console.log('🔍 Debug: Found busy times for booking modal:', busyTimes.length);

    // Generate ALL available time slots
    const allAvailableSlots = generateAvailableSlots(startDate, endDate, busyTimes, timezone);
    
    // Filter slots based on preferred time if provided
    let filteredSlots;
    if (preferredTime) {
      console.log('🔍 Debug: Filtering for preferred time:', preferredTime);
      
      // Parse preferred time (e.g., "4:00 PM")
      const timePattern = /(\d{1,2}):(\d{2})\s*(AM|PM)?/i;
      const timeMatch = preferredTime.match(timePattern);
      
      if (timeMatch) {
        let hour = parseInt(timeMatch[1]);
        const minute = parseInt(timeMatch[2]);
        const period = timeMatch[3] ? timeMatch[3].toUpperCase() : null;
        
        // Convert 12-hour format to 24-hour format
        if (period === 'PM' && hour !== 12) {
          hour += 12;
        } else if (period === 'AM' && hour === 12) {
          hour = 0;
        }
        
        console.log('🔍 Debug: Looking for slots at:', hour + ':' + minute);
        
        // Filter slots to show only the preferred time across different days
        const preferredSlots = allAvailableSlots.filter(slot => {
          const slotTime = new Date(slot.start);
          const slotHour = slotTime.getHours();
          const slotMinute = slotTime.getMinutes();
          return slotHour === hour && slotMinute === minute;
        });
        
        console.log('🔍 Debug: Found preferred time slots:', preferredSlots.length);
        filteredSlots = preferredSlots;
      } else {
        // Fall back to normal filtering if preferred time parsing fails
        filteredSlots = filterSlotsForModal(allAvailableSlots);
      }
    } else {
      // Filter to show only 1-2 slots per day for better UX
      filteredSlots = filterSlotsForModal(allAvailableSlots);
    }
    
    console.log('🔍 Debug - Booking modal availability:', {
      totalSlots: allAvailableSlots.length,
      filteredSlots: filteredSlots.length,
      preferredTime: preferredTime || 'none',
      timezone: tz,
      businessHours,
      meetingDurations
    });
    
    // Debug: Log the first few filtered slots to see what's being shown
    if (filteredSlots.length > 0) {
      console.log('🔍 Debug - First 3 filtered slots:');
      filteredSlots.slice(0, 3).forEach((slot, index) => {
        const slotTime = new Date(slot.start);
        console.log(`  ${index + 1}. ${slot.start} -> ${slotTime.toLocaleString('en-US', { timeZone: timezone })}`);
      });
    }
    
    console.log('🔍 Debug - showBookingModal - About to return UI action');
    console.log('🔍 Debug - showBookingModal - filteredSlots count:', filteredSlots.length);
    
    // Return a UI action that the frontend can handle with filtered slots
    const result = {
      type: 'ui_action',
      action: 'show_booking_modal',
      data: {
        availableSlots: filteredSlots,
        timezone: tz,
        businessHours,
        meetingDurations,
        message: message || 'Schedule a meeting with John'
      }
    };
    
    console.log('🔍 Debug - showBookingModal - Returning result:', result);
    return result;
  } catch (error) {
    console.error('Error showing booking modal:', error);
    throw new Error('Failed to show booking modal');
  }
}

async function showBookingConfirmation(parameters: any) {
  const { name, email, timezone = 'America/New_York', startTime, endTime, meetingType = 'consultation', message } = parameters;

  try {
    console.log('🔍 Debug - showBookingConfirmation called with parameters:', parameters);
    
    // Calculate duration in minutes
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    
    // Return a UI action that the frontend can handle
    return {
      type: 'ui_action',
      action: 'show_booking_confirmation',
      data: {
        bookingDetails: {
          name,
          email,
          timezone,
          startTime,
          endTime,
          duration,
          meetingType
        },
        message: message || 'Please review your booking details before confirming'
      }
    };
  } catch (error) {
    console.error('Error showing booking confirmation:', error);
    throw new Error('Failed to show booking confirmation');
  }
}
