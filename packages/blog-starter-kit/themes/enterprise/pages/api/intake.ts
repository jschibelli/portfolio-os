import { NextApiRequest, NextApiResponse } from 'next';
// Conditional Prisma import
let prisma: any = null;
try {
	const { PrismaClient } = require('@prisma/client');
	prisma = new PrismaClient();
} catch (error) {
	console.log('Prisma not available - using mock intake functionality');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const { name, email, company, message, source = 'website' } = req.body;

		// Validate required fields
		if (!name || !email || !message) {
			return res.status(400).json({ error: 'Missing required fields' });
		}

		if (!prisma) {
			// Mock lead creation when Prisma is not available
			const mockLead = {
				id: `mock-${Date.now()}`,
				name,
				email,
				company: company || null,
				message,
				source,
				status: 'new',
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			console.log('Mock lead created:', mockLead);

			return res.status(200).json({
				success: true,
				lead: {
					...mockLead,
					createdAt: mockLead.createdAt.toISOString(),
					updatedAt: mockLead.updatedAt.toISOString(),
				},
				message: 'Mock lead created successfully (Prisma not available)',
			});
		}

		// Create lead in database
		const lead = await prisma.lead.create({
			data: {
				name,
				email,
				company: company || null,
				message,
				source,
				status: 'new',
			},
		});

		return res.status(200).json({
			success: true,
			lead: {
				...lead,
				createdAt: lead.createdAt.toISOString(),
				updatedAt: lead.updatedAt.toISOString(),
			},
		});
	} catch (error) {
		console.error('Error creating lead:', error);
		return res.status(500).json({
			error: 'Failed to create lead',
			details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
		});
	}
}
