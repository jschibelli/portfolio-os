import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

/**
 * CSP Violation Reporting Endpoint
 * Receives and logs Content Security Policy violations
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log CSP violation for monitoring
    console.warn('CSP Violation Report:', {
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
      violation: {
        blockedURI: body['blocked-uri'],
        documentURI: body['document-uri'],
        effectiveDirective: body['effective-directive'],
        originalPolicy: body['original-policy'],
        referrer: body.referrer,
        sourceFile: body['source-file'],
        violatedDirective: body['violated-directive'],
        lineNumber: body['line-number'],
        columnNumber: body['column-number'],
      }
    });

    // In production, you might want to:
    // 1. Send to monitoring service (Sentry, DataDog, etc.)
    // 2. Store in database for analysis
    // 3. Send alerts for critical violations
    
    return NextResponse.json({ status: 'received' }, { status: 200 });
  } catch (error) {
    console.error('Error processing CSP report:', error);
    return NextResponse.json(
      { error: 'Failed to process CSP report' },
      { status: 500 }
    );
  }
}

// Handle GET requests (some browsers might send GET)
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { message: 'CSP reporting endpoint - use POST method' },
    { status: 405 }
  );
}
