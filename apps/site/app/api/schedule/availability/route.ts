import { NextRequest, NextResponse } from 'next/server';
import { getFreeSlots } from '@/lib/google/calendar';

/**
 * Get available time slots for scheduling
 * GET /api/schedule/availability
 * Query params: days (optional, default: 7), duration (optional, default: 30)
 * 
 * This endpoint uses the same getFreeSlots function as the chatbot
 * to ensure consistency in availability calculations.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '7', 10);
    const durationMinutes = parseInt(searchParams.get('duration') || '30', 10);

    console.log('📅 [Availability API] Request params:', { days, durationMinutes });

    // Calculate time range - same as chatbot
    const now = new Date();
    const end = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    console.log('📅 [Availability API] Time range:', {
      timeMin: now.toISOString(),
      timeMax: end.toISOString(),
    });

    // Try to get real slots from Google Calendar, fallback to mock data if not configured
    let slots;
    try {
      slots = await getFreeSlots({
        timeMinISO: now.toISOString(),
        timeMaxISO: end.toISOString(),
        timeZone: 'America/New_York',
        durationMinutes,
        dayStartHour: 9,
        dayEndHour: 18,
        maxCandidates: 120, // Increased from 50 to 120 for more slots
      });
      console.log('📅 [Availability API] Retrieved real slots:', slots?.length || 0);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn('⚠️ [Availability API] Google Calendar not configured, using mock data:', errorMessage);
      
      // Check if this is a credentials error
      if (errorMessage.includes('OAuth2 credentials not configured') || 
          errorMessage.includes('Calendar client creation failed')) {
        console.log('📅 [Availability API] Using mock data due to missing Google Calendar credentials');
      }
      
      // Generate mock available slots for the next 14 days
      const mockSlots = [];
      const startDate = new Date();
      startDate.setHours(9, 0, 0, 0); // Start at 9 AM
      
      for (let day = 0; day < 14; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + day);
        
        // Skip weekends
        if (currentDate.getDay() === 0 || currentDate.getDay() === 6) continue;
        
        // Generate slots from 9 AM to 5 PM (last slot at 4:30 PM for 30-min meetings)
        for (let hour = 9; hour < 17; hour++) {
          const slotTime = new Date(currentDate);
          slotTime.setHours(hour, 0, 0, 0);
          
          // Skip if slot is in the past
          if (slotTime <= now) continue;
          
          const endTime = new Date(slotTime);
          endTime.setMinutes(slotTime.getMinutes() + durationMinutes);
          
          mockSlots.push({
            start: slotTime.toISOString(),
            end: endTime.toISOString(),
            startISO: slotTime.toISOString(),
            endISO: endTime.toISOString(),
            startTime: slotTime.toISOString(),
            endTime: endTime.toISOString(),
            time: slotTime.toISOString(),
            duration: durationMinutes,
            available: true,
            formatted: {
              date: slotTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }),
              time: slotTime.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
              }),
              datetime: slotTime.toISOString()
            }
          });
        }
      }
      
      slots = mockSlots;
      console.log('📅 [Availability API] Generated mock slots:', slots.length);
    }

    if (!slots || slots.length === 0) {
      console.log('⚠️ [Availability API] No slots available in the requested time range');
    }

    return NextResponse.json({
      availableSlots: slots || [],
      slots: slots || [], // Include both for compatibility
      timezone: 'America/New_York',
      businessHours: { start: 9, end: 18, timezone: 'America/New_York' },
      meetingDurations: [30, 60],
      count: slots?.length || 0,
    });
  } catch (error) {
    console.error('❌ [Availability API] Error:', error);
    console.error('❌ [Availability API] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch availability',
        message: error instanceof Error ? error.message : 'Unknown error',
        slots: [],
        availableSlots: [],
      },
      { status: 500 }
    );
  }
}

