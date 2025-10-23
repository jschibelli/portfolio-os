import { NextRequest, NextResponse } from 'next/server';
import { getRealAnalyticsData } from '@/lib/analytics-tracker';
import { 
  getPersonalOverview, 
  getPersonalTopReferrers, 
  getPersonalTopPages, 
  getPersonalDeviceData, 
  getPersonalTimeSeriesData 
} from '@/lib/integrations/google-analytics-personal';

// Mock data for development and fallback
const mockAnalyticsData = {
  overview: {
    visitors: 1250,
    pageviews: 3200,
    bounce_rate: 42.5,
    visit_duration: 180,
    sessions: 1450,
    newUsers: 890,
  },
  topReferrers: [
    { source: 'google', visitors: 450, sessions: 520 },
    { source: 'direct', visitors: 320, sessions: 380 },
    { source: 'facebook', visitors: 180, sessions: 220 },
    { source: 'twitter', visitors: 120, sessions: 150 },
    { source: 'linkedin', visitors: 80, sessions: 95 },
  ],
  topPages: [
    { page: '/blog/getting-started', visitors: 280, pageviews: 450 },
    { page: '/blog/case-study-hybrid', visitors: 220, pageviews: 380 },
    { page: '/blog/seo-strategies', visitors: 180, pageviews: 320 },
    { page: '/blog/tendril-chatbot', visitors: 150, pageviews: 280 },
    { page: '/blog/scalable-apps', visitors: 120, pageviews: 220 },
  ],
  deviceData: [
    { device: 'desktop', users: 65, percentage: 65 },
    { device: 'mobile', users: 30, percentage: 30 },
    { device: 'tablet', users: 5, percentage: 5 },
  ],
  timeSeriesData: [
    { date: '2024-01-01', value: 120 },
    { date: '2024-01-02', value: 135 },
    { date: '2024-01-03', value: 110 },
    { date: '2024-01-04', value: 160 },
    { date: '2024-01-05', value: 140 },
    { date: '2024-01-06', value: 180 },
    { date: '2024-01-07', value: 200 },
  ],
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId') || process.env.GOOGLE_ANALYTICS_PROPERTY_ID;
    const period = searchParams.get('period') || '7d';
    const metric = searchParams.get('metric') || 'sessions';

    // Check if Google Analytics is configured (Property ID and Access Token required for personal account)
    const hasGAConfig = propertyId && process.env.GOOGLE_ANALYTICS_ACCESS_TOKEN;

    // Primary: Try Google Analytics API first (this is the main data source)
    if (hasGAConfig) {
      try {
        console.log('[ANALYTICS] Fetching data from Google Analytics API...');
        const [overviewData, referrersData, pagesData, deviceData, timeSeriesData] = await Promise.all([
          getPersonalOverview({ propertyId, period }),
          getPersonalTopReferrers({ propertyId, period, limit: 5 }),
          getPersonalTopPages({ propertyId, period, limit: 5 }),
          getPersonalDeviceData({ propertyId, period }),
          getPersonalTimeSeriesData({ propertyId, period, metric }),
        ]);

        console.log('[ANALYTICS] Successfully fetched from Google Analytics');
        return NextResponse.json({
          overview: overviewData,
          topReferrers: referrersData,
          topPages: pagesData,
          deviceData,
          timeSeriesData,
        });
      } catch (gaError) {
        console.error('Google Analytics API error:', gaError);
        console.warn('Google Analytics unavailable, trying database fallback...');
      }
    } else {
      console.warn('[ANALYTICS] Google Analytics not configured (missing GOOGLE_ANALYTICS_PROPERTY_ID or GOOGLE_ANALYTICS_ACCESS_TOKEN)');
    }

    // Fallback: Try database if Google Analytics fails or isn't configured
    try {
      console.log('[ANALYTICS] Fetching fallback data from database...');
      const realData = await getRealAnalyticsData(period);
      
      console.log('[ANALYTICS] Returning database data - Pageviews:', realData.overview.pageviews, 'Visitors:', realData.overview.visitors);
      return NextResponse.json(realData);
    } catch (dbError) {
      console.error('Database analytics error:', dbError);
      console.warn('Database also unavailable, using mock data');
    }

    // Final fallback: Mock data
    console.log('[ANALYTICS] Using mock analytics data');
    return NextResponse.json(mockAnalyticsData);
  } catch (error: any) {
    console.error('Analytics overview error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
