import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';
import { emailService } from '../../../../../../lib/email-service';

/**
 * POST /api/admin/contacts/[id]/retry
 * 
 * Retries sending email for a failed contact submission
 * 
 * @param request - NextRequest
 * @param params - Route parameters containing submission id
 * @returns Promise<NextResponse> - Retry result
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get the submission from database
    const submission = await prisma.contactSubmission.findUnique({
      where: { id },
    });

    if (!submission) {
      return NextResponse.json(
        {
          success: false,
          error: 'Contact submission not found',
        },
        { status: 404 }
      );
    }

    // Check if submission is in failed status
    if (submission.status !== 'failed') {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot retry submission with status: ${submission.status}. Only failed submissions can be retried.`,
        },
        { status: 400 }
      );
    }

    // Attempt to send email
    const emailResult = await emailService.sendEmail({
      to: 'john@schibelli.dev',
      from: process.env.EMAIL_FROM || 'noreply@schibelli.dev',
      subject: `[RETRY] New Contact Form Submission from ${submission.name}`,
      html: `
        <h2>Contact Form Submission (Retry #${submission.retryCount + 1})</h2>
        <p><strong>Name:</strong> ${submission.name}</p>
        <p><strong>Email:</strong> ${submission.email}</p>
        <p><strong>Company:</strong> ${submission.company || 'Not provided'}</p>
        <p><strong>Project Type:</strong> ${submission.projectType || 'Not specified'}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 5px;">${submission.message}</p>
        <hr>
        <p><small>Originally submitted on: ${submission.createdAt.toLocaleString()}</small></p>
        <p><small>Retry attempt: ${submission.retryCount + 1}</small></p>
        <p><small>Previous error: ${submission.emailError || 'Unknown'}</small></p>
      `,
      text: `
Contact Form Submission (Retry #${submission.retryCount + 1})

Name: ${submission.name}
Email: ${submission.email}
Company: ${submission.company || 'Not provided'}
Project Type: ${submission.projectType || 'Not specified'}

Message:
${submission.message}

---
Originally submitted on: ${submission.createdAt.toLocaleString()}
Retry attempt: ${submission.retryCount + 1}
Previous error: ${submission.emailError || 'Unknown'}
      `,
      replyTo: submission.email,
    });

    // Update submission based on result
    if (emailResult.success) {
      await prisma.contactSubmission.update({
        where: { id },
        data: {
          status: 'sent',
          emailSentAt: new Date(),
          emailError: null,
          retryCount: submission.retryCount + 1,
          lastRetryAt: new Date(),
        },
      });

      console.log(`✅ Email retry successful for submission ${id}`);

      return NextResponse.json({
        success: true,
        message: 'Email sent successfully',
        data: {
          submissionId: id,
          retryCount: submission.retryCount + 1,
          emailSentAt: new Date().toISOString(),
        },
      });
    } else {
      // Email failed again, update retry count and error
      await prisma.contactSubmission.update({
        where: { id },
        data: {
          emailError: emailResult.error,
          retryCount: submission.retryCount + 1,
          lastRetryAt: new Date(),
        },
      });

      console.error(`❌ Email retry failed for submission ${id}:`, emailResult.error);

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send email',
          details: emailResult.error,
          retryCount: submission.retryCount + 1,
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Error retrying email:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retry email',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Handle unsupported HTTP methods
 */
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to retry email.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to retry email.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to retry email.' },
    { status: 405 }
  );
}

