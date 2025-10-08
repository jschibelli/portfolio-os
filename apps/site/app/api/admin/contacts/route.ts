import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { z } from 'zod';

// Valid status values
const VALID_STATUSES = ['pending', 'sent', 'failed'] as const;

// Input validation schema
const QueryParamsSchema = z.object({
  status: z.enum(['pending', 'sent', 'failed']).optional(),
  limit: z.number().int().min(1).max(100).default(50),
  offset: z.number().int().min(0).default(0),
  search: z.string().max(100).optional(),
});

// Simple in-memory rate limiting (use Redis in production)
// TODO: Implement Redis-based rate limiting for production deployments
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX_REQUESTS = 100; // Max requests per window
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute window

/**
 * Check rate limit for a given IP address
 * @param ip - Client IP address
 * @returns {allowed: boolean, retryAfter?: number}
 */
function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const clientData = rateLimitMap.get(ip);
  
  if (clientData) {
    if (now < clientData.resetTime) {
      if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
        return {
          allowed: false,
          retryAfter: Math.ceil((clientData.resetTime - now) / 1000),
        };
      }
      clientData.count++;
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    }
  } else {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
  }
  
  return { allowed: true };
}

/**
 * GET /api/admin/contacts
 * 
 * Retrieves all contact form submissions with filtering and pagination
 * 
 * Query parameters:
 * - status: Filter by status (pending, sent, failed)
 * - limit: Number of results to return (default: 50, max: 100)
 * - offset: Number of results to skip (default: 0, min: 0)
 * - search: Search by name, email, or company (max: 100 chars)
 * 
 * Security:
 * - Input validation and sanitization
 * - SQL injection protection via Prisma
 * - Rate limiting recommended for production
 * 
 * @param request - NextRequest with query parameters
 * @returns Promise<NextResponse> - List of contact submissions
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown';
    const rateLimitResult = checkRateLimit(clientIP);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please try again later.',
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter?.toString() || '60',
            'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(Date.now() + (rateLimitResult.retryAfter || 60) * 1000).toISOString(),
          },
        }
      );
    }
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    
    // Validate and sanitize inputs
    const rawParams = {
      status: searchParams.get('status') || undefined,
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0'),
      search: searchParams.get('search') || undefined,
    };

    // Validate with Zod schema
    const validatedParams = QueryParamsSchema.safeParse(rawParams);
    
    if (!validatedParams.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid query parameters',
          details: validatedParams.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const { status, limit, offset, search } = validatedParams.data;

    // Build where clause with sanitized inputs
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    // Sanitize search input: Remove special characters that could be used for injection
    // Prisma handles SQL injection protection, but we still sanitize for safety
    if (search) {
      const sanitizedSearch = search
        .replace(/[<>{}[\]]/g, '') // Remove potentially dangerous characters
        .trim();
      
      if (sanitizedSearch.length > 0) {
        where.OR = [
          { name: { contains: sanitizedSearch, mode: 'insensitive' } },
          { email: { contains: sanitizedSearch, mode: 'insensitive' } },
          { company: { contains: sanitizedSearch, mode: 'insensitive' } },
        ];
      }
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
    
    // Provide more detailed error information for debugging
    const errorDetails = error instanceof Error ? {
      message: error.message,
      name: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    } : { message: 'Unknown error' };
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch contact submissions',
        details: errorDetails,
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

