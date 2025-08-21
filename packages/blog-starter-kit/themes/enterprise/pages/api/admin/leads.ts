import { NextApiRequest, NextApiResponse } from 'next';

// Conditional Prisma import
let prisma: any = null;
try {
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
} catch (error) {
  console.log('Prisma not available - using mock data for leads');
}

// Type for lead data
interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  source: string;
  status: string;
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
      const mockLeads: Lead[] = [
        {
          id: '1',
          name: 'Alice Johnson',
          email: 'alice@example.com',
          company: 'Tech Corp',
          message: 'Interested in web development services',
          source: 'website',
          status: 'new',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Bob Wilson',
          email: 'bob@example.com',
          company: 'Startup Inc',
          message: 'Looking for mobile app development',
          source: 'chatbot',
          status: 'contacted',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      return res.status(200).json({
        leads: mockLeads.map((lead: Lead) => ({
          ...lead,
          createdAt: lead.createdAt.toISOString(),
          updatedAt: lead.updatedAt.toISOString(),
        })),
      });
    }

    const leads = await prisma.lead.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit to recent 50 leads
    });

    return res.status(200).json({
      leads: leads.map((lead: Lead) => ({
        ...lead,
        createdAt: lead.createdAt.toISOString(),
        updatedAt: lead.updatedAt.toISOString(),
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
