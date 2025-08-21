import { NextRequest, NextResponse } from 'next/server';
// Conditional Prisma import
let prisma: any = null;
try {
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
} catch (error) {
  console.log('Prisma not available - using mock intake functionality');
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, company, message, source = 'website' } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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

      return NextResponse.json({
        success: true,
        lead: {
          ...mockLead,
          createdAt: mockLead.createdAt.toISOString(),
          updatedAt: mockLead.updatedAt.toISOString(),
        },
        message: 'Mock lead created successfully (Prisma not available)'
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

    return NextResponse.json({
      success: true,
      lead: {
        ...lead,
        createdAt: lead.createdAt.toISOString(),
        updatedAt: lead.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ 
      error: 'Failed to create lead',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    }, { status: 500 });
  }
}
