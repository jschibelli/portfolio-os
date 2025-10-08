import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

/**
 * GET /api/admin/contacts
 * 
 * Retrieves all contact form submissions with filtering and pagination
 * 
 * Query parameters:
 * - status: Filter by status (pending, sent, failed)
 * - limit: Number of results to return (default: 50)
 * - offset: Number of results to skip (default: 0)
 * - search: Search by name or email
 * 
 * @param request - NextRequest with query parameters
 * @returns Promise<NextResponse> - List of contact submissions
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');

    // Build where clause
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count for pagination
    const total = await prisma.contactSubmission.count({ where });

    // Get submissions with pagination
    const submissions = await prisma.contactSubmission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        projectType: true,
        message: true,
        status: true,
        emailSentAt: true,
        emailError: true,
        retryCount: true,
        lastRetryAt: true,
        ipAddress: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Get status counts for summary
    const statusCounts = await prisma.contactSubmission.groupBy({
      by: ['status'],
      _count: true,
    });

    const summary = {
      total,
      pending: statusCounts.find((s) => s.status === 'pending')?._count || 0,
      sent: statusCounts.find((s) => s.status === 'sent')?._count || 0,
      failed: statusCounts.find((s) => s.status === 'failed')?._count || 0,
    };

    return NextResponse.json({
      success: true,
      data: submissions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
      summary,
    });

  } catch (error) {
    console.error('❌ Error fetching contact submissions:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch contact submissions',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Handle unsupported HTTP methods
 */
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET to retrieve submissions.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET to retrieve submissions.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET to retrieve submissions.' },
    { status: 405 }
  );
}

