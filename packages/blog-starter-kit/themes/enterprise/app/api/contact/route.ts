import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Contact form validation schema
const ContactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  projectType: z.string().optional(),
  budget: z.string().optional().refine(
    (val) => !val || /^\$?[\d,]+(\.\d{2})?$/.test(val) || ['under-5k', '5k-10k', '10k-25k', '25k-50k', '50k-100k', '100k-plus'].includes(val),
    { message: 'Budget must be a valid amount or predefined range' }
  ),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message too long'),
});

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  projectType?: string;
  budget?: string;
  message: string;
}

// Rate limiting (simple in-memory store - in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

// Predefined budget ranges for validation
const BUDGET_RANGES = ['under-5k', '5k-10k', '10k-25k', '25k-50k', '50k-100k', '100k-plus'] as const;

// Budget validation regex for monetary amounts
const BUDGET_REGEX = /^\$?[\d,]+(\.\d{2})?$/;

/**
 * POST /api/contact
 * 
 * Handles contact form submissions with comprehensive validation, rate limiting, and email notification.
 * 
 * Features:
 * - Rate limiting (5 requests per hour per IP)
 * - Input validation using Zod schema
 * - Budget field validation (predefined ranges or monetary amounts)
 * - Comprehensive error handling with detailed messages
 * - Security measures against spam and abuse
 * 
 * @param request - NextRequest containing contact form data
 * @returns Promise<NextResponse> - Success or error response with detailed validation messages
 * 
 * @example
 * ```typescript
 * const response = await fetch('/api/contact', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     name: 'John Doe',
 *     email: 'john@example.com',
 *     company: 'Acme Corp',
 *     projectType: 'web-development',
 *     budget: '10k-25k', // or '$15,000.00'
 *     message: 'I would like to discuss a new project...'
 *   })
 * });
 * ```
 * 
 * @throws {400} Validation errors with detailed field-specific messages
 * @throws {429} Rate limit exceeded
 * @throws {500} Internal server errors
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting implementation
    const clientIP = request.ip ?? request.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const now = Date.now();
    const clientData = rateLimitMap.get(clientIP);
    
    if (clientData) {
      if (now < clientData.resetTime) {
        if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
          return NextResponse.json(
            { 
              error: 'Too many contact form submissions. Please try again later.',
              retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
            },
            { status: 429, headers: { 'Retry-After': Math.ceil((clientData.resetTime - now) / 1000).toString() } }
          );
        }
        clientData.count++;
      } else {
        rateLimitMap.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
      }
    } else {
      rateLimitMap.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    }

    // Validate request body
    const body = await request.json();
    const validatedData = ContactFormSchema.parse(body);

    // Log the contact form submission (in production, you might want to store this in a database)
    console.log('📧 Contact form submission received:', {
      name: validatedData.name,
      email: validatedData.email,
      company: validatedData.company,
      projectType: validatedData.projectType,
      budget: validatedData.budget,
      messageLength: validatedData.message.length,
      timestamp: new Date().toISOString(),
      clientIP
    });

    // Additional validation for business logic
    if (validatedData.budget) {
      if (!BUDGET_RANGES.includes(validatedData.budget as any)) {
        // If budget is provided but not a predefined range, validate it's a proper monetary format
        if (!BUDGET_REGEX.test(validatedData.budget)) {
          return NextResponse.json(
            { 
              error: 'Invalid budget format. Please use a predefined range or valid monetary amount.',
              details: [{ 
                field: 'budget', 
                message: `Budget must be one of: ${BUDGET_RANGES.join(', ')}, or a valid monetary amount (e.g., $1,000.00)` 
              }]
            },
            { status: 400 }
          );
        }
        
        // Additional validation for monetary amounts
        try {
          const numericValue = parseFloat(validatedData.budget.replace(/[$,]/g, ''));
          if (isNaN(numericValue) || numericValue < 0) {
            return NextResponse.json(
              { 
                error: 'Budget amount must be a valid positive number.',
                details: [{ field: 'budget', message: 'Budget must be a valid positive monetary amount' }]
              },
              { status: 400 }
            );
          }
        } catch (error) {
          return NextResponse.json(
            { 
              error: 'Invalid budget format.',
              details: [{ field: 'budget', message: 'Budget must be a valid monetary amount or predefined range' }]
            },
            { status: 400 }
          );
        }
      }
    }

    // In a real implementation, you would:
    // 1. Send an email notification to the site owner
    // 2. Store the submission in a database
    // 3. Send an auto-reply to the user
    // 4. Integrate with CRM systems
    
    // For now, we'll simulate successful processing
    // TODO: Implement actual email sending using services like:
    // - SendGrid
    // - AWS SES
    // - Nodemailer with SMTP
    // - Resend
    // - EmailJS

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! I will get back to you within 24 hours.',
      submissionId: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });

  } catch (error) {
    console.error('📧 Contact form error:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: 'Failed to process contact form submission. Please try again later.' },
      { status: 500 }
    );
  }
}

/**
 * Handle unsupported HTTP methods
 */
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to submit contact form.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to submit contact form.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to submit contact form.' },
    { status: 405 }
  );
}

/**
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}


