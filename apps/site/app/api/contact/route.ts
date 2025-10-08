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

      // Email sent successfully - update database
      console.log('📧 Email notification sent successfully:', emailResult.messageId);
      
      await prisma.contactSubmission.update({
        where: { id: submission.id },
        data: {
          status: 'sent',
          emailSentAt: new Date(),
        },
      });

      // Return success response with actual submission ID
      return NextResponse.json({
        success: true,
        message: 'Thank you for your message! I will get back to you within 24 hours.',
        submissionId: submission.id
      });

    } catch (emailError) {
      console.error('📧 Failed to send email notification:', emailError);

      // Determine error message and update database
      let errorMessage = 'Unknown error';
      let errorCode = 'email_send_failed';
      let statusCode = 500;
      let retryAfter: number | undefined;

      if (emailError instanceof EmailConfigError) {
        errorMessage = emailError.message;
        errorCode = 'email_config_error';
        statusCode = 500;
      } else if (emailError instanceof EmailRateLimitError) {
        errorMessage = emailError.message;
        errorCode = 'rate_limit';
        statusCode = 429;
        retryAfter = emailError.retryAfter || 60;
      } else if (emailError instanceof EmailNetworkError) {
        errorMessage = emailError.message;
        errorCode = 'network_error';
        statusCode = 503;
      } else if (emailError instanceof Error) {
        errorMessage = emailError.message;
      }

      // Update database with failure status
      await prisma.contactSubmission.update({
        where: { id: submission.id },
        data: {
          status: 'failed',
          emailError: errorMessage,
          retryCount: 0,
        },
      });

      console.log('⚠️  Submission saved but email failed. Admin can retry from dashboard.');

      // Return appropriate error response
      const response: any = {
        success: false,
        error: errorCode,
        message: "We've received your message but couldn't send the email notification. We'll follow up with you shortly. Alternatively, you can email john@schibelli.dev directly.",
        fallbackEmail: 'john@schibelli.dev',
        submissionId: submission.id,
      };

      if (retryAfter) {
        response.retryAfter = retryAfter;
      }

      if (statusCode === 503 || emailError instanceof EmailNetworkError) {
        response.retryable = true;
      }

      const headers: any = {};
      if (retryAfter) {
        headers['Retry-After'] = retryAfter.toString();
      }

      return NextResponse.json(response, { status: statusCode, headers });
    }

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


