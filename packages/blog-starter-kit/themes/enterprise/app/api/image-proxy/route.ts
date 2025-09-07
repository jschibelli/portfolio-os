import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT = {
  maxRequests: 100, // requests per window
  windowMs: 15 * 60 * 1000, // 15 minutes
  blockDurationMs: 60 * 60 * 1000, // 1 hour block
};

// Allowed domains for image proxying
const ALLOWED_DOMAINS = [
  'unsplash.com',
  'images.unsplash.com',
  'picsum.photos',
  'via.placeholder.com',
  'cdn.jsdelivr.net',
  'raw.githubusercontent.com',
  'github.com',
  'githubusercontent.com'
];

// Allowed image extensions
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

// Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Cache duration (1 hour)
const CACHE_DURATION = 3600;

// Enhanced User-Agent string
const USER_AGENT = 'MindwareBlog-ImageProxy/1.0 (+https://mindware-blog.com/robots.txt)';

/**
 * Rate limiting function
 */
function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = ip;
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT.windowMs,
    });
    return {
      allowed: true,
      remaining: RATE_LIMIT.maxRequests - 1,
      resetTime: now + RATE_LIMIT.windowMs,
    };
  }

  if (record.count >= RATE_LIMIT.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  // Increment count
  record.count++;
  rateLimitStore.set(key, record);

  return {
    allowed: true,
    remaining: RATE_LIMIT.maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Enhanced URL validation with SSRF protection
 */
function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    
    // Check protocol
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    
    // SSRF protection - block private IP ranges
    const hostname = urlObj.hostname;
    if (isPrivateIP(hostname)) {
      return false;
    }
    
    // Check if domain is allowed
    const isAllowedDomain = ALLOWED_DOMAINS.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    );
    
    // Check if URL has valid image extension
    const pathname = urlObj.pathname.toLowerCase();
    const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => pathname.endsWith(ext));
    
    return isAllowedDomain || hasValidExtension;
  } catch {
    return false;
  }
}

/**
 * Check if hostname resolves to private IP
 */
function isPrivateIP(hostname: string): boolean {
  // Block common private IP patterns
  const privatePatterns = [
    /^127\./, // localhost
    /^10\./, // private class A
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // private class B
    /^192\.168\./, // private class C
    /^169\.254\./, // link-local
    /^::1$/, // IPv6 localhost
    /^fc00:/, // IPv6 private
    /^fe80:/, // IPv6 link-local
  ];
  
  return privatePatterns.some(pattern => pattern.test(hostname));
}


/**
 * Fetches and proxies an image with security checks
 */
async function proxyImage(url: string): Promise<Response> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'image/*',
        'Accept-Encoding': 'gzip, deflate',
      },
      // Add timeout
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      throw new Error('Invalid content type');
    }

    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE) {
      throw new Error('File too large');
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    
    if (imageBuffer.byteLength > MAX_FILE_SIZE) {
      throw new Error('File too large');
    }

    // Log successful proxy
    console.log(`Successfully proxied image: ${url} (${imageBuffer.byteLength} bytes)`);

    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': imageBuffer.byteLength.toString(),
        'Cache-Control': `public, max-age=${CACHE_DURATION}`,
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'X-Proxy-Source': 'MindwareBlog-ImageProxy',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return new NextResponse('Failed to proxy image', { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.ip || 
      request.headers.get('x-forwarded-for')?.split(',')[0] || 
      request.headers.get('x-real-ip') || 
      'unknown';

    // Check rate limit
    const rateLimit = checkRateLimit(clientIP);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': RATE_LIMIT.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          }
        }
      );
    }

    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Missing required parameter: url' },
        { status: 400 }
      );
    }

    // Validate the URL
    if (!isValidImageUrl(imageUrl)) {
      return NextResponse.json(
        { error: 'Invalid or unsafe image URL' },
        { status: 400 }
      );
    }

    // Proxy the image
    const response = await proxyImage(imageUrl);
    
    // Add rate limit headers to successful response
    response.headers.set('X-RateLimit-Limit', RATE_LIMIT.maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString());
    
    return response;
  } catch (error: any) {
    console.error('Image proxy route error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
