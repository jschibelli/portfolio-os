import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CANONICAL_HOST } from './config/site';

// Environment variables for maintenance mode control
const UC = process.env.NEXT_PUBLIC_UNDER_CONSTRUCTION === 'true';
const IS_PROD = process.env.VERCEL_ENV === 'production';

// Live production domains where maintenance mode should be enforced
// Only these domains will trigger maintenance mode in production
const LIVE = new Set([
  'schibelli.com',
  CANONICAL_HOST,
]);

export function middleware(req: NextRequest) {
  const { pathname, hostname } = req.nextUrl;

  // Debug logging
  console.log(`[middleware] Processing request: ${hostname}${pathname}`);

  // Canonical host redirect — enforce https://www.schibelli.com
  // TEMPORARILY DISABLED - investigating redirect loop issue
  const canonicalHost = CANONICAL_HOST;
  if (hostname === 'schibelli.com' && canonicalHost === 'www.schibelli.com') {
    console.log(`[middleware] Would redirect ${hostname} to ${canonicalHost} but disabled for debugging`);
    // const url = req.nextUrl.clone();
    // url.hostname = canonicalHost;
    // url.protocol = 'https:';
    // return NextResponse.redirect(url, 301);
  }

  // Allow static assets, Next internals, API, maintenance page, and common file types
  // These paths should always be accessible even during maintenance
  const pass =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/maintenance') ||
    pathname === '/favicon.ico' ||
    /\.(png|jpg|jpeg|gif|svg|ico|css|js|txt|webp|woff2?)$/.test(pathname);

  if (pass) return NextResponse.next();

  // Enforce maintenance mode only on production + live domains
  // This ensures maintenance mode only affects real users, not development/preview environments
  if (UC && IS_PROD && LIVE.has(hostname)) {
    const url = req.nextUrl.clone();
    url.pathname = '/maintenance';
    const response = NextResponse.rewrite(url);
    
    // Add comprehensive cache control headers for maintenance page
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=600');
    response.headers.set('X-Maintenance-Mode', 'true');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
