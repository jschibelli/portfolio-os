import { NextRequest, NextResponse } from 'next/server';
import { 
  SECURITY_CONFIG, 
  validateCSPReport, 
  RateLimiter, 
  logSecurityEvent 
} from '@/lib/security-config';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Initialize rate limiter
const rateLimiter = new RateLimiter();


/**
 * CSP Violation Reporting Endpoint
 * Receives and logs Content Security Policy violations with enhanced security
 */
export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.ip || 
      request.headers.get('x-forwarded-for')?.split(',')[0] || 
      request.headers.get('x-real-ip') || 
      'unknown';

    // Check rate limit using centralized configuration
    const rateLimitConfig = SECURITY_CONFIG.rateLimit.cspReport;
    const rateLimit = rateLimiter.checkLimit(clientIP, rateLimitConfig.maxReports, rateLimitConfig.windowMs);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded for CSP reports' },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
            ...rateLimiter.getRateLimitHeaders(rateLimit, rateLimitConfig.maxReports),
          }
        }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Validate and sanitize CSP report data
    const validation = validateCSPReport(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error || 'Invalid CSP report data' },
        { status: 400 }
      );
    }

    // Extract metadata
    const metadata = {
      userAgent: request.headers.get('user-agent') || 'unknown',
      referer: request.headers.get('referer') || 'unknown',
      ip: clientIP,
    };

    // Log the violation with centralized logging
    logSecurityEvent('csp_violation', 'warning', validation.sanitizedData, metadata);

    // Return success response with rate limit headers
    const response = NextResponse.json({ status: 'received' }, { status: 200 });
    const rateLimitHeaders = rateLimiter.getRateLimitHeaders(rateLimit, rateLimitConfig.maxReports);
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  } catch (error) {
    console.error('Error processing CSP report:', error);
    return NextResponse.json(
      { error: 'Internal server error processing CSP report' },
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
