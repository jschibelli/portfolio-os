import { NextRequest, NextResponse } from 'next/server';
import {
  isGoogleAnalyticsConfigured,
  getCompleteAnalytics
} from '@/lib/analytics-fallback';

export const dynamic = 'force-dynamic';

/**
 * Analytics Overview API
 * Returns analytics data from Google Analytics if configured, otherwise uses database fallback
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d';
    
    // Parse period to days
    const periodDays = parseInt(period.replace('d', '')) || 7;

    // Check if Google Analytics is configured
    const hasGoogleAnalytics = isGoogleAnalyticsConfigured();

    if (hasGoogleAnalytics) {
      try {
        // Try to use Google Analytics from the site app
        const response = await fetch(
          `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/analytics/overview?period=${period}`,
          { 
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({
            ...data,
            isFallback: false,
            source: 'google-analytics'
          });
        }
      } catch (gaError) {
        console.warn('Google Analytics fetch failed, using database fallback:', gaError);
      }
    }

    // Use database fallback
    console.log('Using database fallback for analytics');
    const fallbackData = await getCompleteAnalytics(periodDays);

    return NextResponse.json({
      ...fallbackData,
      isFallback: true,
      source: 'database',
      message: hasGoogleAnalytics 
        ? 'Google Analytics configured but unavailable, using database metrics'
        : 'Google Analytics not configured, using database metrics'
    });

  } catch (error: any) {
    console.error('Analytics overview error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch analytics data',
        isFallback: true 
      },
      { status: 500 }
    );
  }
}






