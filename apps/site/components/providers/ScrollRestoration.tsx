"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ScrollRestoration component ensures that when users navigate to a new page,
 * the page automatically scrolls to the top instead of maintaining the previous scroll position.
 * This is especially important for single-page applications and Next.js App Router.
 */
export function ScrollRestoration() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top when pathname changes (new page navigation)
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // This component doesn't render anything
}
