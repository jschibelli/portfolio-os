import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const bookings = await prisma.booking.findMany({
      orderBy: {
        startTime: 'desc',
      },
      take: 50, // Limit to recent 50 bookings
    });

    return res.status(200).json({
      bookings: bookings.map(booking => ({
        ...booking,
        startTime: booking.startTime.toISOString(),
        endTime: booking.endTime.toISOString(),
        createdAt: booking.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch bookings',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
}
