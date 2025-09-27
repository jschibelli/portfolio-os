import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const UC = process.env.NEXT_PUBLIC_UNDER_CONSTRUCTION === 'true';
const IS_PROD = process.env.VERCEL_ENV === 'production';
const LIVE = new Set([
  'johnschibelli.dev',
  'www.johnschibelli.dev',
]); // TODO: replace with real domains

export function middleware(req: NextRequest) {
  const { pathname, hostname } = req.nextUrl;

  // Allow static assets, Next internals, API, maintenance page, and common file types
  const pass =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/maintenance') ||
    pathname === '/favicon.ico' ||
    /\.(png|jpg|jpeg|gif|svg|ico|css|js|txt|webp|woff2?)$/.test(pathname);

  if (pass) return NextResponse.next();

  // Enforce only on production + live domains
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
