import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { 
  emailService, 
  EmailConfigError, 
  EmailNetworkError, 
  EmailRateLimitError,
  EmailValidationError 
} from '../../../lib/email-service';
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
    try {
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

      console.log('📧 Email notification sent successfully:', emailResult.messageId);

      // Return success response
      return NextResponse.json({
        success: true,
        message: 'Thank you for your message! I will get back to you within 24 hours.',
        submissionId: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      });

    } catch (emailError) {
      console.error('📧 Failed to send email notification:', emailError);

      // Handle different error types with appropriate responses
      if (emailError instanceof EmailConfigError) {
        // Configuration error - return 500 with helpful message
        return NextResponse.json({
          success: false,
          error: 'email_config_error',
          message: "We're experiencing technical difficulties with our contact form. Please email john@schibelli.dev directly. We apologize for the inconvenience.",
          fallbackEmail: 'john@schibelli.dev',
          submissionId: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` // Still provide submission ID for logging
        }, { status: 500 });
      }

      if (emailError instanceof EmailRateLimitError) {
        // Rate limit error - return 429
        return NextResponse.json({
          success: false,
          error: 'rate_limit',
          message: "You've submitted multiple messages recently. Please wait a few minutes before trying again, or email john@schibelli.dev directly.",
          fallbackEmail: 'john@schibelli.dev',
          retryAfter: emailError.retryAfter || 60
        }, { 
          status: 429,
          headers: {
            'Retry-After': (emailError.retryAfter || 60).toString()
          }
        });
      }

      if (emailError instanceof EmailNetworkError) {
        // Network error - return 503 (Service Unavailable)
        return NextResponse.json({
          success: false,
          error: 'network_error',
          message: 'Unable to send message due to a network issue. Please try again in a moment or email john@schibelli.dev directly.',
          fallbackEmail: 'john@schibelli.dev',
          retryable: true
        }, { status: 503 });
      }

      // Generic email error - return 500
      return NextResponse.json({
        success: false,
        error: 'email_send_failed',
        message: 'Failed to send your message. Please try again or email john@schibelli.dev directly.',
        fallbackEmail: 'john@schibelli.dev'
      }, { status: 500 });
    }

  } catch (err: unknown) {
    console.error('📧 Contact form error:', err);

    // Handle validation errors
    if (err instanceof z.ZodError) {
      const zodError = err as z.ZodError;
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: zodError.errors.map((validationError: z.ZodIssue) => ({
            field: validationError.path.join('.'),
            message: validationError.message
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


