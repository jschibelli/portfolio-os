import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if maintenance mode is enabled
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';
  const isUnderConstructionMode = process.env.UNDER_CONSTRUCTION_MODE === 'true';
  
  // Debug logging (remove in production)
  console.log('Middleware triggered for:', request.nextUrl.pathname);
  console.log('MAINTENANCE_MODE env var:', process.env.MAINTENANCE_MODE);
  console.log('UNDER_CONSTRUCTION_MODE env var:', process.env.UNDER_CONSTRUCTION_MODE);
  console.log('isMaintenanceMode:', isMaintenanceMode);
  console.log('isUnderConstructionMode:', isUnderConstructionMode);
  
  // If maintenance mode is enabled, redirect all requests to maintenance page
  if (isMaintenanceMode) {
    // Allow access to the maintenance page itself and static assets
    if (
      request.nextUrl.pathname === '/maintenance' ||
      request.nextUrl.pathname.startsWith('/_next/') ||
      request.nextUrl.pathname.startsWith('/api/') ||
      request.nextUrl.pathname.startsWith('/favicon') ||
      request.nextUrl.pathname.startsWith('/assets/') ||
      request.nextUrl.pathname.startsWith('/public/')
    ) {
      return NextResponse.next();
    }
    
    // Redirect all other requests to maintenance page
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }
  
  // If under construction mode is enabled, redirect all requests to under construction page
  if (isUnderConstructionMode) {
    // Allow access to the under construction page itself and static assets
    if (
      request.nextUrl.pathname === '/under-construction' ||
      request.nextUrl.pathname.startsWith('/_next/') ||
      request.nextUrl.pathname.startsWith('/api/') ||
      request.nextUrl.pathname.startsWith('/favicon') ||
      request.nextUrl.pathname.startsWith('/assets/') ||
      request.nextUrl.pathname.startsWith('/public/')
    ) {
      return NextResponse.next();
    }
    
    // Redirect all other requests to under construction page
    return NextResponse.redirect(new URL('/under-construction', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
