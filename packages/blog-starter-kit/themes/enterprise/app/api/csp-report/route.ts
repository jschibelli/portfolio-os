import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Rate limiting for CSP reports
const cspReportRateLimit = new Map<string, { count: number; resetTime: number }>();
const CSP_RATE_LIMIT = {
  maxReports: 50, // reports per window
  windowMs: 5 * 60 * 1000, // 5 minutes
};

/**
 * Validate and sanitize CSP violation data
 */
function validateCSPReport(data: any): { isValid: boolean; sanitizedData?: any; error?: string } {
  try {
    // Check if data is an object
    if (!data || typeof data !== 'object') {
      return { isValid: false, error: 'Invalid data format' };
    }

    // Sanitize string fields to prevent injection attacks
    const sanitizeString = (str: any): string => {
      if (typeof str !== 'string') return '';
      return str
        .replace(/[<>\"'&]/g, (match) => {
          const escapeMap: { [key: string]: string } = {
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '&': '&amp;'
          };
          return escapeMap[match] || match;
        })
        .substring(0, 1000); // Limit length
    };

    // Validate and sanitize required fields
    const sanitizedData = {
      'blocked-uri': sanitizeString(data['blocked-uri']),
      'document-uri': sanitizeString(data['document-uri']),
      'effective-directive': sanitizeString(data['effective-directive']),
      'original-policy': sanitizeString(data['original-policy']),
      'referrer': sanitizeString(data['referrer']),
      'source-file': sanitizeString(data['source-file']),
      'violated-directive': sanitizeString(data['violated-directive']),
      'line-number': typeof data['line-number'] === 'number' ? data['line-number'] : 0,
      'column-number': typeof data['column-number'] === 'number' ? data['column-number'] : 0,
    };

    // Validate that we have at least some violation data
    if (!sanitizedData['violated-directive'] && !sanitizedData['blocked-uri']) {
      return { isValid: false, error: 'Missing required violation data' };
    }

    return { isValid: true, sanitizedData };
  } catch (error) {
    return { isValid: false, error: 'Data validation failed' };
  }
}

/**
 * Check rate limit for CSP reports
 */
function checkCSPRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = ip;
  const record = cspReportRateLimit.get(key);

  if (!record || now > record.resetTime) {
    cspReportRateLimit.set(key, {
      count: 1,
      resetTime: now + CSP_RATE_LIMIT.windowMs,
    });
    return {
      allowed: true,
      remaining: CSP_RATE_LIMIT.maxReports - 1,
      resetTime: now + CSP_RATE_LIMIT.windowMs,
    };
  }

  if (record.count >= CSP_RATE_LIMIT.maxReports) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count++;
  cspReportRateLimit.set(key, record);

  return {
    allowed: true,
    remaining: CSP_RATE_LIMIT.maxReports - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Structured logging for CSP violations
 */
function logCSPViolation(violationData: any, metadata: any) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    type: 'csp_violation',
    severity: 'warning',
    metadata: {
      userAgent: metadata.userAgent,
      referer: metadata.referer,
      ip: metadata.ip,
    },
    violation: violationData,
  };

  // Log to console with structured format
  console.warn('CSP Violation Report:', JSON.stringify(logEntry, null, 2));

  // In production, you would send this to your monitoring service
  // Example: Sentry, DataDog, CloudWatch, etc.
  if (process.env.NODE_ENV === 'production') {
    // Send to monitoring service
    // await sendToMonitoringService(logEntry);
  }
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

    // Check rate limit
    const rateLimit = checkCSPRateLimit(clientIP);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded for CSP reports' },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': CSP_RATE_LIMIT.maxReports.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetTime.toString(),
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

    // Log the violation with structured logging
    logCSPViolation(validation.sanitizedData, metadata);

    // Return success response with rate limit headers
    const response = NextResponse.json({ status: 'received' }, { status: 200 });
    response.headers.set('X-RateLimit-Limit', CSP_RATE_LIMIT.maxReports.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString());
    
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
