import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const leads = await prisma.lead.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit to recent 50 leads
    });

    return res.status(200).json({
      leads: leads.map(lead => ({
        ...lead,
        createdAt: lead.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch leads',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
}
