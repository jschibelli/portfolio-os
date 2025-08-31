import { NextApiRequest, NextApiResponse } from 'next';

// Conditional Prisma import
let prisma: any = null;
try {
	const { PrismaClient } = require('@prisma/client');
	prisma = new PrismaClient();
} catch (error) {
	console.log('Prisma not available - using mock data for bookings');
}

// Type for booking data
interface Booking {
	id: string;
	name: string;
	email: string;
	startTime: Date;
	endTime: Date;
	duration: number;
	meetingType: string;
	notes: string;
	googleEventId: string;
	createdAt: Date;
	updatedAt: Date;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		if (!prisma) {
			// Return mock data when Prisma is not available
			const mockBookings: Booking[] = [
				{
					id: '1',
					name: 'John Doe',
					email: 'john@example.com',
					startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
					endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
					duration: 60,
					meetingType: 'consultation',
					notes: 'Mock booking for testing',
					googleEventId: 'mock-event-id-1',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: '2',
					name: 'Jane Smith',
					email: 'jane@example.com',
					startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
					endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
					duration: 30,
					meetingType: 'quick-chat',
					notes: 'Mock booking for testing',
					googleEventId: 'mock-event-id-2',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			];

			return res.status(200).json({
				bookings: mockBookings.map((booking: Booking) => ({
					...booking,
					startTime: booking.startTime.toISOString(),
					endTime: booking.endTime.toISOString(),
					createdAt: booking.createdAt.toISOString(),
					updatedAt: booking.updatedAt.toISOString(),
				})),
			});
		}

		const bookings = await prisma.booking.findMany({
			orderBy: {
				startTime: 'desc',
			},
			take: 50, // Limit to recent 50 bookings
		});

		return res.status(200).json({
			bookings: bookings.map((booking: Booking) => ({
				...booking,
				startTime: booking.startTime.toISOString(),
				endTime: booking.endTime.toISOString(),
				createdAt: booking.createdAt.toISOString(),
				updatedAt: booking.updatedAt.toISOString(),
			})),
		});
	} catch (error) {
		console.error('Error fetching bookings:', error);
		return res.status(500).json({
			error: 'Failed to fetch bookings',
			details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
		});
	}
}
