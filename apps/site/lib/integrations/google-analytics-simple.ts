// Simplified Google Analytics 4 Integration
// Uses Google Analytics Reporting API with API key (easier setup)

export interface SimpleGAOverview {
  visitors: number;
  pageviews: number;
  bounce_rate: number;
  visit_duration: number;
  sessions: number;
  newUsers: number;
}

export interface SimpleGAReferrer {
  source: string;
  visitors: number;
  sessions: number;
}

export interface SimpleGAPage {
  page: string;
  visitors: number;
  pageviews: number;
}

export interface SimpleGADevice {
  device: string;
  users: number;
  percentage: number;
}

export interface SimpleGATimeSeries {
  date: string;
  value: number;
}

// Get Google Analytics configuration
function getGAConfig() {
  const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;
  const apiKey = process.env.GOOGLE_ANALYTICS_API_KEY;

  if (!propertyId) {
    throw new Error('GOOGLE_ANALYTICS_PROPERTY_ID environment variable not set');
  }

  return { propertyId, apiKey };
}

// Convert period string to date range
function getDateRange(period: string): { startDate: string; endDate: string } {
  const endDate = new Date();
  const startDate = new Date();

  switch (period) {
    case '7d':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case '14d':
      startDate.setDate(endDate.getDate() - 14);
      break;
    case '30d':
      startDate.setDate(endDate.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(endDate.getDate() - 90);
      break;
    default:
      startDate.setDate(endDate.getDate() - 7);
  }

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}

// Make request to Google Analytics Reporting API
async function makeGARequest(dimensions: string[], metrics: string[], orderBys?: any[], limit?: number) {
  const { propertyId, apiKey } = getGAConfig();
  const { startDate, endDate } = getDateRange('7d'); // Default to 7 days

  const requestBody = {
    reportRequests: [{
      viewId: propertyId,
      dateRanges: [{ startDate, endDate }],
      dimensions: dimensions.map(d => ({ name: d })),
      metrics: metrics.map(m => ({ expression: m })),
      ...(orderBys && { orderBys }),
      ...(limit && { pageSize: limit })
    }]
  };

  const url = `https://analyticsreporting.googleapis.com/v4/reports:batchGet?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Google Analytics API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.reports?.[0]?.data || { rows: [] };
}

export async function getSimpleOverview({ 
  propertyId, 
  period = '7d' 
}: { propertyId: string; period?: string }): Promise<SimpleGAOverview> {
  try {
    // For now, return mock data since we need proper API setup
    // This will be replaced with real API calls once the service account is set up
    return {
      visitors: 1250,
      pageviews: 3200,
      bounce_rate: 42.5,
      visit_duration: 180,
      sessions: 1450,
      newUsers: 890,
    };
  } catch (error) {
    console.error('Error getting Google Analytics overview:', error);
    throw error;
  }
}

export async function getSimpleTopReferrers({ 
  propertyId, 
  period = '7d', 
  limit = 10 
}: { propertyId: string; period?: string; limit?: number }): Promise<SimpleGAReferrer[]> {
  try {
    // Mock data for now
    return [
      { source: 'google', visitors: 450, sessions: 520 },
      { source: 'direct', visitors: 320, sessions: 380 },
      { source: 'facebook', visitors: 180, sessions: 220 },
      { source: 'twitter', visitors: 120, sessions: 150 },
      { source: 'linkedin', visitors: 80, sessions: 95 },
    ];
  } catch (error) {
    console.error('Error getting top referrers:', error);
    throw error;
  }
}

export async function getSimpleTopPages({ 
  propertyId, 
  period = '7d', 
  limit = 10 
}: { propertyId: string; period?: string; limit?: number }): Promise<SimpleGAPage[]> {
  try {
    // Mock data for now
    return [
      { page: '/blog/getting-started', visitors: 280, pageviews: 450 },
      { page: '/blog/case-study-hybrid', visitors: 220, pageviews: 380 },
      { page: '/blog/seo-strategies', visitors: 180, pageviews: 320 },
      { page: '/blog/tendril-chatbot', visitors: 150, pageviews: 280 },
      { page: '/blog/scalable-apps', visitors: 120, pageviews: 220 },
    ];
  } catch (error) {
    console.error('Error getting top pages:', error);
    throw error;
  }
}

export async function getSimpleDeviceData({ 
  propertyId, 
  period = '7d' 
}: { propertyId: string; period?: string }): Promise<SimpleGADevice[]> {
  try {
    // Mock data for now
    return [
      { device: 'desktop', users: 65, percentage: 65 },
      { device: 'mobile', users: 30, percentage: 30 },
      { device: 'tablet', users: 5, percentage: 5 },
    ];
  } catch (error) {
    console.error('Error getting device data:', error);
    throw error;
  }
}

export async function getSimpleTimeSeriesData({ 
  propertyId, 
  period = '7d',
  metric = 'sessions'
}: { propertyId: string; period?: string; metric?: string }): Promise<SimpleGATimeSeries[]> {
  try {
    // Mock data for now
    return [
      { date: '2024-01-01', value: 120 },
      { date: '2024-01-02', value: 135 },
      { date: '2024-01-03', value: 110 },
      { date: '2024-01-04', value: 160 },
      { date: '2024-01-05', value: 140 },
      { date: '2024-01-06', value: 180 },
      { date: '2024-01-07', value: 200 },
    ];
  } catch (error) {
    console.error('Error getting time series data:', error);
    throw error;
  }
}
