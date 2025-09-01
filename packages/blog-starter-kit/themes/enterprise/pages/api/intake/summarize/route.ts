import { NextRequest, NextResponse } from 'next/server';
// Conditional Prisma import
let prisma: any = null;
try {
	const { PrismaClient } = require('@prisma/client');
	prisma = new PrismaClient();
} catch (error) {
	console.log('Prisma not available - using mock summarize functionality');
}

export async function POST(request: NextRequest) {
	try {
		const { leadId } = await request.json();

		if (!leadId) {
			return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
		}

		if (!prisma) {
			// Return mock summary when Prisma is not available
			const mockSummary = {
				id: `summary-${Date.now()}`,
				leadId,
				summary:
					'This is a mock summary of the lead information. Prisma is not available for database operations.',
				keyPoints: ['Mock lead data', 'No database connection', 'Testing mode active'],
				recommendations: [
					'Set up Prisma database',
					'Configure environment variables',
					'Test with real data',
				],
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			return NextResponse.json({
				success: true,
				summary: {
					...mockSummary,
					createdAt: mockSummary.createdAt.toISOString(),
					updatedAt: mockSummary.updatedAt.toISOString(),
				},
				message: 'Mock summary created (Prisma not available)',
			});
		}

		// Fetch lead and create summary from database
		const lead = await prisma.lead.findUnique({
			where: { id: leadId },
		});

		if (!lead) {
			return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
		}

		// Create summary (this would normally use AI to generate)
		const summary = await prisma.leadSummary.create({
			data: {
				leadId,
				summary: `Summary for ${lead.name} from ${lead.company || 'Unknown Company'}`,
				keyPoints: ['Lead submitted', 'Contact information provided'],
				recommendations: ['Follow up within 24 hours', 'Send project proposal'],
			},
		});

		return NextResponse.json({
			success: true,
			summary: {
				...summary,
				createdAt: summary.createdAt.toISOString(),
				updatedAt: summary.updatedAt.toISOString(),
			},
		});
	} catch (error) {
		console.error('Error creating summary:', error);
		return NextResponse.json(
			{
				error: 'Failed to create summary',
				details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
			},
			{ status: 500 },
		);
	}
}
