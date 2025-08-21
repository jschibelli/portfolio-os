import { NextRequest, NextResponse } from 'next/server';
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

export async function POST(request: NextRequest) {
  try {
    const { name, email, timezone, startTime, endTime, meetingType = 'consultation', notes } = await request.json();

    // Validate required fields
    if (!name || !email || !timezone || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!prisma) {
      // Mock booking creation when Prisma is not available
      const mockBooking = {
        id: `mock-${Date.now()}`,
        name,
        email,
        timezone,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        duration: Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60)),
        meetingType,
        notes: notes || 'Mock booking - Prisma not available',
        googleEventId: `mock-event-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log('Mock booking created:', mockBooking);

      return NextResponse.json({
        success: true,
        booking: {
          ...mockBooking,
          startTime: mockBooking.startTime.toISOString(),
          endTime: mockBooking.endTime.toISOString(),
          createdAt: mockBooking.createdAt.toISOString(),
          updatedAt: mockBooking.updatedAt.toISOString(),
        },
        message: 'Mock booking created successfully (Prisma not available)'
      });
    }

    // Create booking in database
    const booking = await prisma.booking.create({
      data: {
        name,
        email,
        timezone,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        duration: Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60)),
        meetingType,
        notes: notes || '',
        googleEventId: `event-${Date.now()}`,
      },
    });

    return NextResponse.json({
      success: true,
      booking: {
        ...booking,
        startTime: booking.startTime.toISOString(),
        endTime: booking.endTime.toISOString(),
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ 
      error: 'Failed to create booking',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    }, { status: 500 });
  }
}
