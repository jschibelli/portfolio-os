// External libraries
import { NextRequest, NextResponse } from 'next/server';

// Internal modules
import { 
  SECURITY_CONFIG, 
  validateCSPReport, 
  RateLimiter, 
  logSecurityEvent 
} from '@/lib/security-config';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Initialize rate limiter with configuration validation
const rateLimiter = new RateLimiter();

// Validate rate limiting configuration
const rateLimitConfig = SECURITY_CONFIG.rateLimit.cspReport;
if (!rateLimitConfig || rateLimitConfig.maxReports <= 0 || rateLimitConfig.windowMs <= 0) {
  console.error('Invalid CSP report rate limiting configuration');
  throw new Error('CSP report rate limiting configuration is invalid');
}


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

    // Check rate limit using validated configuration
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

    // Parse and validate request body with enhanced error handling
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      // Log parse error for monitoring without exposing sensitive information
      logSecurityEvent('csp_report_parse_error', 'warning', {
        error: 'Invalid JSON format',
        clientIP,
        userAgent: request.headers.get('user-agent') || 'unknown'
      });
      
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    // Validate and sanitize CSP report data with enhanced verification
    const validation = validateCSPReport(body);
    if (!validation.isValid) {
      // Log validation error for monitoring
      logSecurityEvent('csp_report_validation_error', 'warning', {
        error: validation.error,
        clientIP,
        userAgent: request.headers.get('user-agent') || 'unknown'
      });
      
      return NextResponse.json(
        { error: 'Invalid report data' },
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
    // Log error for monitoring without exposing sensitive information
    logSecurityEvent('csp_report_processing_error', 'error', {
      error: 'Internal processing error',
      clientIP: request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    });
    
    return NextResponse.json(
      { error: 'Internal server error' },
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
