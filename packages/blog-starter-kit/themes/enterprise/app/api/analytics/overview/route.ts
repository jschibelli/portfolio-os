import { NextRequest, NextResponse } from 'next/server';
import { 
  getPersonalOverview, 
  getPersonalTopReferrers, 
  getPersonalTopPages, 
  getPersonalDeviceData, 
  getPersonalTimeSeriesData 
} from '@/lib/integrations/google-analytics-personal';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

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

    if (!hasGAConfig) {
      console.log('Google Analytics not configured, returning mock data');
      return NextResponse.json(mockAnalyticsData);
    }

    try {
      // Use personal Google Analytics integration
      const [overviewData, referrersData, pagesData, deviceData, timeSeriesData] = await Promise.all([
        getPersonalOverview({ propertyId, period }),
        getPersonalTopReferrers({ propertyId, period, limit: 5 }),
        getPersonalTopPages({ propertyId, period, limit: 5 }),
        getPersonalDeviceData({ propertyId, period }),
        getPersonalTimeSeriesData({ propertyId, period, metric }),
      ]);

      return NextResponse.json({
        overview: overviewData,
        topReferrers: referrersData,
        topPages: pagesData,
        deviceData,
        timeSeriesData,
      });
    } catch (gaError) {
      console.error('Google Analytics error, falling back to mock data:', gaError);
      return NextResponse.json(mockAnalyticsData);
    }
  } catch (error: any) {
    console.error('Analytics overview error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
