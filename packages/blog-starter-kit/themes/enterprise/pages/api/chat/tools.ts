import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// SSL/TLS configuration for Node.js - only for development
if (process.env.NODE_ENV === 'development') {
  // Only disable SSL verification if explicitly set
  if (process.env.DISABLE_SSL_VERIFICATION === 'true') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    console.log('⚠️ SSL verification disabled for development');
  }
  
  // Fix for Node.js 20+ SSL issues with Google Auth
  if (process.env.FIX_SSL_ISSUES === 'true') {
    console.log('🔧 Applying SSL fix for Node.js 20+ compatibility');
    
    // Set Node.js to use legacy OpenSSL provider
    process.env.NODE_OPTIONS = '--openssl-legacy-provider';
    
    // Alternative: Monkey patch the crypto module
    try {
      const crypto = require('crypto');
      const originalSign = crypto.Sign.prototype.sign;
      crypto.Sign.prototype.sign = function(key: any, encoding: any) {
        try {
          return originalSign.call(this, key, encoding);
        } catch (error: any) {
          if (error.code === 'ERR_OSSL_UNSUPPORTED') {
            console.log('🔍 Debug: SSL issue detected, using alternative signing method');
            // Try with different encoding
            return originalSign.call(this, key, 'base64');
          }
          throw error;
        }
      };
    } catch (error) {
      console.log('🔍 Debug: Could not apply crypto patch:', error);
    }
  }
}

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
    morning: {
      start: 9, // 9 AM
      end: 13,  // 1 PM
    },
    afternoon: {
      start: 13, // 1 PM
      end: 18,   // 6 PM
    },
    timezone: 'America/New_York'
  };

// Meeting duration options (in minutes)
const MEETING_DURATIONS = [30, 60];

// Function to create Google Auth client from environment variables (OAuth)
async function createGoogleAuthClient() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_OAUTH_REFRESH_TOKEN) {
    console.log('🔍 Debug: OAuth credentials not found in environment variables');
    console.log('🔍 Debug: Need GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_OAUTH_REFRESH_TOKEN');
    return null;
  }

  try {
    console.log('🔍 Debug: Creating OAuth client from environment variables');
    
    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Set credentials with refresh token
    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN
    });

    // Test the auth client to make sure it works
    const auth = new google.auth.GoogleAuth({
      authClient: oauth2Client,
      scopes: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'],
    });
    
    await auth.getClient();
    console.log('🔍 Debug: OAuth client created successfully');
    return auth;
  } catch (error) {
    console.error('🔍 Debug: Error creating OAuth client:', error instanceof Error ? error.message : String(error));
    console.log('🔍 Debug: OAuth error detected, using mock data');
    return null;
  }
}

// Mock availability function for when Google APIs are not available
function getMockAvailability(parameters: any) {
  const { timezone = 'America/New_York', requestedTime, preference = 'any' } = parameters;
  
  // Generate mock available slots for the next 7 days
  const now = new Date();
  const availableSlots = [];
  
  for (let day = 0; day < 7; day++) {
    const date = new Date(now.getTime() + day * 24 * 60 * 60 * 1000);
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    // Generate slots for business hours (9 AM - 6 PM)
    for (let hour = 9; hour < 18; hour++) {
      const slotStart = new Date(date);
      slotStart.setHours(hour, 0, 0, 0);
      
      const slotEnd = new Date(slotStart);
      slotEnd.setHours(hour + 1, 0, 0, 0);
      
      availableSlots.push({
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
        duration: 60
      });
    }
  }
  
  const timezoneNote = 'All meetings are scheduled in Eastern Time (ET).';
  const availabilityMessage = `The next available time is ${new Date(availableSlots[0]?.start).toLocaleString('en-US', { timeZone: timezone })} (ET). ${timezoneNote}`;
  
  return {
    availableSlots: availableSlots.slice(0, 1), // Return only the first slot
    timezone,
    businessHours: BUSINESS_HOURS,
    meetingDurations: MEETING_DURATIONS,
    message: availabilityMessage
  };
}

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
          },
          preference: {
            type: 'string',
            description: 'Time preference: "morning" (9 AM - 1 PM), "afternoon" (1 PM - 6 PM), or "any" (full day). Use this when user specifies a preference.',
            enum: ['morning', 'afternoon', 'any'],
            default: 'any'
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
          },
          preference: {
            type: 'string',
            description: 'Time preference: "morning" (9 AM - 1 PM), "afternoon" (1 PM - 6 PM), or "any" (full day)',
            enum: ['morning', 'afternoon', 'any'],
            default: 'any'
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
  const { timezone = 'America/New_York', days = 7, requestedTime, preference = 'any' } = parameters;

  // Debug environment variables
  console.log('🔍 Debug - Environment Variables:');
  console.log('  GOOGLE_CALENDAR_ID:', process.env.GOOGLE_CALENDAR_ID || 'NOT SET');
  console.log('  GOOGLE_CLIENT_EMAIL:', process.env.GOOGLE_CLIENT_EMAIL ? 'SET' : 'NOT SET');
  console.log('  GOOGLE_PRIVATE_KEY:', process.env.GOOGLE_PRIVATE_KEY ? 'SET' : 'NOT SET');
  console.log('  FEATURE_SCHEDULING:', process.env.FEATURE_SCHEDULING || 'NOT SET');

  // Check feature flag - enable by default if not set
  if (process.env.FEATURE_SCHEDULING === 'false') {
    throw new Error('Scheduling feature is disabled');
  }

  try {
    // Check if Google APIs are available
    if (!google) {
      console.log('🔍 Debug: Google APIs not available, using mock data');
      // Return mock availability data instead of throwing error
      return getMockAvailability(parameters);
    }

    // Create Google Auth client from environment variables
    const auth = await createGoogleAuthClient();
    if (!auth) {
      console.log('🔍 Debug: Could not create Google Auth client, using mock data');
      return getMockAvailability(parameters);
    }

    // Get calendar ID from environment variables
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'jschibelli@gmail.com';
    console.log('🔍 Debug - Using calendar ID:', calendarId);

    // Check if calendar ID is properly set
    if (!calendarId || calendarId === 'primary') {
      console.log('🔍 Debug: Calendar ID not properly configured, using mock data');
      return getMockAvailability(parameters);
    }

    // Calculate time range - when specific time is requested, look ahead 2 weeks
    const now = new Date();
    let lookaheadDays = Math.max(1, Math.min(7, Number.isFinite(days) ? days : 7));
    
    // Determine start date for availability search
    let startDate = now;
    let endDate = new Date(now.getTime() + lookaheadDays * 24 * 60 * 60 * 1000);
    
    // Check if this is a "next week" request
    const isNextWeekRequest = requestedTime && (
      requestedTime.toLowerCase().includes('next week') ||
      requestedTime.toLowerCase().includes('next week') ||
      requestedTime.toLowerCase().includes('following week')
    );
    
    if (isNextWeekRequest) {
      // For "next week" requests, look specifically at next week (7-14 days from now)
      const nextWeekStart = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
      const nextWeekEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days from now
      
      startDate = nextWeekStart;
      endDate = nextWeekEnd;
      lookaheadDays = 7; // Only look at next week
      
      console.log('🔍 Debug: Next week request detected, looking from:', startDate.toISOString(), 'to', endDate.toISOString());
    }
    
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
    console.log('🔍 Debug: Timezone:', timezone);
    
    let busyResponse;
    try {
      busyResponse = await calendar.freebusy.query({
        auth: auth,
        requestBody: {
          timeMin: startDate.toISOString(),
          timeMax: endDate.toISOString(),
          items: [{ id: calendarId }],
          timeZone: timezone,
        },
      });
    } catch (error) {
      console.log('🔍 Debug: Failed to fetch busy times with calendar ID:', calendarId, 'Error:', error);
      
      // Check if it's an SSL/TLS error
      if (error && typeof error === 'object' && 'message' in error && 
          typeof error.message === 'string' && error.message.includes('DECODER routines::unsupported')) {
        console.log('🔍 Debug: SSL/TLS error detected, using mock data');
        return getMockAvailability(parameters);
      }
      
      // Try with 'primary' as fallback
      try {
        console.log('🔍 Debug: Trying with primary calendar...');
        busyResponse = await calendar.freebusy.query({
          auth: auth,
          requestBody: {
            timeMin: startDate.toISOString(),
            timeMax: endDate.toISOString(),
            items: [{ id: 'primary' }],
            timeZone: timezone,
          },
        });
      } catch (fallbackError) {
        console.log('🔍 Debug: Fallback also failed, using mock data:', fallbackError);
        return getMockAvailability(parameters);
      }
    }

    console.log('🔍 Debug: Google Calendar API response:', JSON.stringify(busyResponse.data, null, 2));
    
    const busyTimes = busyResponse.data.calendars?.[calendarId]?.busy || [];
    console.log('🔍 Debug: Extracted busy times count:', busyTimes.length);
    
    // Also try to fetch actual events to see what's in the calendar
    try {
      const eventsResponse = await calendar.events.list({
        auth: auth,
        calendarId: calendarId,
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      });
      
      console.log('🔍 Debug: Calendar events found:', eventsResponse.data.items?.length || 0);
      eventsResponse.data.items?.forEach((event: any, index: number) => {
        console.log(`🔍 Debug: Event ${index + 1}:`, {
          summary: event.summary,
          start: event.start?.dateTime || event.start?.date,
          end: event.end?.dateTime || event.end?.date,
          isAllDay: !event.start?.dateTime && event.start?.date
        });
      });
    } catch (eventsError) {
      console.log('🔍 Debug: Could not fetch calendar events:', eventsError);
    }
    
    // Log each busy time with more detail
    busyTimes.forEach((busy: any, index: number) => {
      const start = new Date(busy.start);
      const end = new Date(busy.end);
      console.log(`🔍 Debug: Busy time ${index + 1}:`, {
        start: busy.start,
        end: busy.end,
        startLocal: start.toLocaleString(),
        endLocal: end.toLocaleString(),
        duration: `${(end.getTime() - start.getTime()) / (1000 * 60 * 60)} hours`
      });
    });

    // Generate available time slots
    let availableSlots = generateAvailableSlots(startDate, endDate, busyTimes, timezone, preference);

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
          const slotTimeInBusinessTZ = new Date(slotTime.toLocaleString('en-US', { timeZone: timezone }));
          console.log(`🔍 Debug: Slot ${index}: ${slot.start} -> ${slotTimeInBusinessTZ.toLocaleString('en-US', { timeZone: timezone })} (${slotTimeInBusinessTZ.getHours()}:${slotTimeInBusinessTZ.getMinutes().toString().padStart(2, '0')})`);
        });
        
        const matchingSlot = availableSlots.find(slot => {
          const slotTime = new Date(slot.start);
          // Convert slot time to business timezone for comparison
          const slotTimeInBusinessTZ = new Date(slotTime.toLocaleString('en-US', { timeZone: timezone }));
          const slotHour = slotTimeInBusinessTZ.getHours();
          const slotMinute = slotTimeInBusinessTZ.getMinutes();
          console.log('🔍 Debug: Checking slot:', slotHour + ':' + slotMinute, 'vs requested:', requestedHour + ':' + requestedMinute);
          
          // Additional debug for 3:00 PM slots specifically
          if (requestedHour === 15 && requestedMinute === 0) {
            console.log(`🔍 Debug: 3:00 PM MATCH CHECK - Slot: ${slot.start} (${slotHour}:${slotMinute}) vs Requested: ${requestedHour}:${requestedMinute}`);
          }
          
          return slotHour === requestedHour && slotMinute === requestedMinute;
        });
        
        const next = matchingSlot || availableSlots[0];
        availableSlots = next ? [next] : [];

        if (next) {
          const slotTime = new Date(next.start);
          const slotTimeInBusinessTZ = new Date(slotTime.toLocaleString('en-US', { timeZone: timezone }));
          availabilityMessage = `The next available time is ${slotTimeInBusinessTZ.toLocaleString('en-US', { timeZone: timezone })} (${timezone}). ${timezoneNote}`;
        } else {
          availabilityMessage = `No available times in the next ${lookaheadDays} days. ${timezoneNote}`;
          
          // Additional debug when no matching slot is found
          if (requestedHour === 15 && requestedMinute === 0) {
            console.log(`❌ Debug: NO 3:00 PM SLOT FOUND! Total available slots: ${availableSlots.length}`);
            console.log(`❌ Debug: Available slots that were generated:`);
            availableSlots.forEach((slot, index) => {
              const slotTime = new Date(slot.start);
              const slotTimeInBusinessTZ = new Date(slotTime.toLocaleString('en-US', { timeZone: timezone }));
              console.log(`  ${index + 1}. ${slot.start} -> ${slotTimeInBusinessTZ.toLocaleString('en-US', { timeZone: timezone })}`);
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
    // Check if Google APIs are available
    if (!google) {
      throw new Error('Google Calendar API is not configured.');
    }

    // Create Google Auth client from environment variables
    const auth = await createGoogleAuthClient();
    if (!auth) {
      throw new Error('Google Calendar API is not configured. Please set up Google service account environment variables.');
    }

    const calendar = google.calendar({ version: 'v3', auth });

    // Create calendar event and request Google Meet link
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
      conferenceData: {
        createRequest: {
          requestId: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
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
      conferenceDataVersion: 1,
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

    // Extract Meet link if available
    const meetLink =
      (calendarResponse.data as any)?.hangoutLink ||
      (calendarResponse.data as any)?.conferenceData?.entryPoints?.find((e: any) => e.entryPointType === 'video')?.uri ||
      null;

    return {
      success: true,
      booking: {
        id: bookingId || 'google-calendar-event',
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        googleEventId: calendarResponse.data.id,
        googleMeetLink: meetLink,
        googleEventLink: (calendarResponse.data as any)?.htmlLink || null
      },
      message: `Meeting successfully scheduled in Google Calendar!${emailSent ? ' You should receive a confirmation email shortly.' : ''} ${meetLink ? `Meet link: ${meetLink}` : ''} Event ID: ${calendarResponse.data.id}`
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
  timezone: string,
  preference: 'morning' | 'afternoon' | 'any' = 'any'
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
      const busyStart = new Date(busy.start);
      const busyEnd = new Date(busy.end);
      const isAllDay = busyStart.getHours() === 0 && busyStart.getMinutes() === 0 && 
                      busyEnd.getHours() === 0 && busyEnd.getMinutes() === 0;
      
      console.log(`🔍 Debug: Busy ${index + 1}:`, busy.start, 'to', busy.end, 
                  isAllDay ? '(ALL DAY EVENT)' : '', 
                  `Duration: ${(busyEnd.getTime() - busyStart.getTime()) / (1000 * 60 * 60)} hours`);
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
      // Use a proper timezone-aware approach
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // Create business hours based on preference
      let businessHours;
      if (preference === 'morning') {
        businessHours = BUSINESS_HOURS.morning;
      } else if (preference === 'afternoon') {
        businessHours = BUSINESS_HOURS.afternoon;
      } else {
        // For 'any' preference, use both morning and afternoon
        businessHours = { start: BUSINESS_HOURS.morning.start, end: BUSINESS_HOURS.afternoon.end };
      }
      
      const dayStart = new Date(`${dateStr}T${businessHours.start.toString().padStart(2, '0')}:00:00.000`);
      const dayEnd = new Date(`${dateStr}T${businessHours.end.toString().padStart(2, '0')}:00:00.000`);
      
      // Adjust for timezone difference between server and business timezone
      // Since business hours are in America/New_York, we need to convert
      const businessTimezone = 'America/New_York';
      const serverTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // Get the offset difference between server timezone and business timezone
      const businessOffset = new Date(dayStart.toLocaleString('en-US', { timeZone: businessTimezone })).getTimezoneOffset();
      const serverOffset = new Date(dayStart.toLocaleString('en-US', { timeZone: serverTimezone })).getTimezoneOffset();
      const offsetDiff = (businessOffset - serverOffset) * 60 * 1000; // Convert to milliseconds
      
      // Adjust the times
      const adjustedDayStart = new Date(dayStart.getTime() + offsetDiff);
      const adjustedDayEnd = new Date(dayEnd.getTime() + offsetDiff);

      console.log(`🔍 Debug: Generating slots for ${dateStr} - ${adjustedDayStart.toISOString()} to ${adjustedDayEnd.toISOString()}`);

      let slotStart = new Date(adjustedDayStart);

      while (slotStart < adjustedDayEnd) {
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
          
          // Check if this is an all-day event
          const isAllDay = busyStart.getHours() === 0 && busyStart.getMinutes() === 0 && 
                          busyEnd.getHours() === 0 && busyEnd.getMinutes() === 0;
          
          // Convert slot times to UTC for proper comparison
          const slotStartUTC = slotStart.toISOString();
          const slotEndUTC = slotEnd.toISOString();
          
          let hasOverlap = false;
          
          if (isAllDay) {
            // For all-day events, check if the slot date falls within the all-day event date range
            const slotDate = slotStart.toISOString().split('T')[0];
            const busyStartDate = busyStart.toISOString().split('T')[0];
            const busyEndDate = new Date(busyEnd.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Subtract 1 day since end is next day midnight
            
            hasOverlap = slotDate >= busyStartDate && slotDate <= busyEndDate;
            
            if (hasOverlap) {
              console.log(`🔍 Debug: Slot ${slotStart.toISOString()} conflicts with ALL-DAY event ${busyStartDate} to ${busyEndDate}`);
            }
          } else {
            // For regular events, check for time overlap
            hasOverlap = slotStartUTC < busyEnd.toISOString() && slotEndUTC > busyStart.toISOString();
            
            if (hasOverlap) {
              console.log(`🔍 Debug: Slot ${slotStart.toISOString()}-${slotEnd.toISOString()} conflicts with busy ${busyStart.toISOString()}-${busyEnd.toISOString()}`);
            }
          }
          
          // Additional debug for 3:00 PM slots specifically
          if (slotStart.getHours() === 15 && slotStart.getMinutes() === 0) {
            console.log(`🔍 Debug: 3:00 PM slot check - Slot: ${slotStart.toISOString()}, Busy: ${busyStart.toISOString()}-${busyEnd.toISOString()}, AllDay: ${isAllDay}, Overlap: ${hasOverlap}`);
          }
          
          return hasOverlap;
        });

        if (isAvailable && slotEnd <= adjustedDayEnd) {
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

    // Check if Google APIs are available
    if (!google) {
      throw new Error('Google Calendar API is not configured');
    }

    // Create Google Auth client from environment variables
    const auth = await createGoogleAuthClient();
    if (!auth) {
      console.log('🔍 Debug: Could not create Google Auth client, using mock data');
      return {
        type: 'ui_action',
        action: 'show_booking_modal',
        data: {
          availableSlots: getMockAvailability({ timezone, days }).availableSlots,
          timezone: tz,
          businessHours,
          meetingDurations,
          message: 'Schedule a meeting with John (Demo Mode - Google Calendar not configured)',
          initialStep: preferredTime ? 'calendar' : 'contact'
        }
      };
    }

    const calendar = google.calendar({ version: 'v3', auth });
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

    // Get busy times from Google Calendar with graceful fallback
    console.log('🔍 Debug: Fetching busy times for booking modal...');
    let busyTimes: any[] = [];
    try {
      const busyResponse = await calendar.freebusy.query({
        auth: auth,
        requestBody: {
          timeMin: startDate.toISOString(),
          timeMax: endDate.toISOString(),
          items: [{ id: calendarId }],
          timeZone: timezone,
        },
      });
      busyTimes = busyResponse.data.calendars?.[calendarId]?.busy || [];
      console.log('🔍 Debug: Found busy times for booking modal:', busyTimes.length);
    } catch (err: any) {
      console.log('🔍 Debug: freeBusy query failed in showBookingModal:', err?.message || err);
      // SSL/TLS error or any auth error → fall back to mock slots but KEEP the flow interactive
      return {
        type: 'ui_action',
        action: 'show_booking_modal',
        data: {
          availableSlots: getMockAvailability({ timezone, days }).availableSlots,
          timezone: tz,
          businessHours,
          meetingDurations,
          message: 'Schedule a meeting with John (Demo Mode - Calendar connection failed)',
          initialStep: preferredTime ? 'calendar' : 'contact'
        }
      };
    }

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
        message: message || 'Schedule a meeting with John',
        initialStep: preferredTime ? 'calendar' : 'contact' // Start at calendar step if specific time requested
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
