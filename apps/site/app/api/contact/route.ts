import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { emailService } from '../../../lib/email-service';
import { prisma } from '../../../lib/prisma';

// Contact form validation schema
const ContactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  projectType: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message too long'),
});

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  projectType?: string;
  message: string;
}

// Rate limiting (simple in-memory store - in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

/**
 * POST /api/contact
 * 
 * Handles contact form submissions with validation, rate limiting, and email notification.
 * 
 * @param request - NextRequest containing contact form data
 * @returns Promise<NextResponse> - Success or error response
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
 *     message: 'I would like to discuss a new project...'
 *   })
 * });
 * ```
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

    // Get user agent for tracking
    const userAgent = request.headers.get('user-agent') || undefined;

    // Save submission to database FIRST (before attempting email)
    // This ensures we never lose submissions even if email fails
    const submission = await prisma.contactSubmission.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        company: validatedData.company,
        projectType: validatedData.projectType,
        message: validatedData.message,
        ipAddress: clientIP,
        userAgent: userAgent,
        status: 'pending',
      },
    });

    console.log('💾 Contact submission saved to database:', {
      id: submission.id,
      name: validatedData.name,
      email: validatedData.email,
      timestamp: submission.createdAt.toISOString(),
    });

    // Send email notification to site owner
    const emailResult = await emailService.sendEmail({
      to: 'john@schibelli.dev',
      from: process.env.EMAIL_FROM || 'noreply@schibelli.dev',
      subject: `New Contact Form Submission from ${validatedData.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Company:</strong> ${validatedData.company || 'Not provided'}</p>
        <p><strong>Project Type:</strong> ${validatedData.projectType || 'Not specified'}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 5px;">${validatedData.message}</p>
        <hr>
        <p><small>Submitted on: ${new Date().toLocaleString()}</small></p>
        <p><small>Client IP: ${clientIP}</small></p>
      `,
      text: `
New Contact Form Submission

Name: ${validatedData.name}
Email: ${validatedData.email}
Company: ${validatedData.company || 'Not provided'}
Project Type: ${validatedData.projectType || 'Not specified'}

Message:
${validatedData.message}

---
Submitted on: ${new Date().toLocaleString()}
Client IP: ${clientIP}
      `,
      replyTo: validatedData.email,
    });

    // Update submission status based on email result
    if (!emailResult.success) {
      console.error('📧 Failed to send email notification:', emailResult.error);
      
      // Update database with failure status
      await prisma.contactSubmission.update({
        where: { id: submission.id },
        data: {
          status: 'failed',
          emailError: emailResult.error,
          retryCount: 0,
        },
      });

      // Note: Submission is saved, but email failed
      // Admin can retry sending from the admin panel
      console.log('⚠️  Submission saved but email failed. Admin can retry from dashboard.');
    } else {
      console.log('📧 Email notification sent successfully:', emailResult.messageId);
      
      // Update database with success status
      await prisma.contactSubmission.update({
        where: { id: submission.id },
        data: {
          status: 'sent',
          emailSentAt: new Date(),
        },
      });
    }

    // Return success response with the actual submission ID
    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! I will get back to you within 24 hours.',
      submissionId: submission.id
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


