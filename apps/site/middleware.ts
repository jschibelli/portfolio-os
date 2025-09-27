import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const UC = process.env.NEXT_PUBLIC_UNDER_CONSTRUCTION === 'true';
const IS_PROD = process.env.VERCEL_ENV === 'production';
const LIVE = new Set([
  'yourdomain.com',
  'www.yourdomain.com',
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
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
