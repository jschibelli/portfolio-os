import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { emailService } from '../../../lib/email-service';
import { features } from '../../../lib/env-validation';

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
    // Check if email service is configured
    if (!features.email) {
      console.error('📧 Email service not configured. Missing environment variables: RESEND_API_KEY or EMAIL_FROM');
      return NextResponse.json(
        { 
          error: 'Email service is not configured. Please contact the site administrator.',
          code: 'EMAIL_SERVICE_NOT_CONFIGURED',
          details: 'The contact form requires email service configuration. Please ensure RESEND_API_KEY and EMAIL_FROM environment variables are set.'
        },
        { status: 503 }
      );
    }

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
      messageLength: validatedData.message.length,
      timestamp: new Date().toISOString(),
      clientIP
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

    if (!emailResult.success) {
      console.error('📧 Failed to send email notification:', emailResult.error);
      
      // Return error response if email fails
      // Note: In Issue #280, we'll implement database persistence so submissions
      // are saved even if email fails. For now, we return an error to the user.
      return NextResponse.json(
        { 
          error: 'Failed to send your message. Please try again later or contact us directly.',
          code: 'EMAIL_SEND_FAILED',
          details: emailResult.error,
          // Include submission data for logging/debugging
          submission: {
            name: validatedData.name,
            email: validatedData.email,
            timestamp: new Date().toISOString()
          }
        },
        { status: 500 }
      );
    }

    console.log('📧 Email notification sent successfully:', emailResult.messageId);

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! I will get back to you within 24 hours.',
      submissionId: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      messageId: emailResult.messageId
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


