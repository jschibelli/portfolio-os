import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

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

/**
 * Validates if a URL is safe to proxy
 */
function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    
    // Check protocol
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    
    // Check if domain is allowed
    const isAllowedDomain = ALLOWED_DOMAINS.some(domain => 
      urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
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
 * Fetches and proxies an image with security checks
 */
async function proxyImage(url: string): Promise<Response> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ImageProxy/1.0)',
        'Accept': 'image/*',
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
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return new NextResponse('Failed to proxy image', { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
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
    return await proxyImage(imageUrl);
  } catch (error: any) {
    console.error('Image proxy route error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
