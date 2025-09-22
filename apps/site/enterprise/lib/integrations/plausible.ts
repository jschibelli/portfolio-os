// Plausible Integration Adapter
// Docs: https://plausible.io/docs/stats-api
// Server-only - uses Plausible API token

export interface PlausibleOverview {
  visitors: number;
  pageviews: number;
  bounce_rate: number;
  visit_duration: number;
}

export interface PlausibleReferrer {
  source: string;
  visitors: number;
}

export interface PlausiblePage {
  page: string;
  visitors: number;
}

export interface PlausibleParams {
  site: string;
  period: string;
  limit?: number;
}

// Get Plausible API token from environment
function getPlausibleToken() {
  const token = process.env.PLAUSIBLE_API_TOKEN;
  if (!token) {
    throw new Error('PLAUSIBLE_API_TOKEN environment variable not set');
  }
  return token;
}

export async function overview({ 
  site, 
  period 
}: PlausibleParams): Promise<PlausibleOverview> {
  try {
    const token = getPlausibleToken();
    
    const response = await fetch(
      `https://plausible.io/api/v1/stats/aggregate?site_id=${site}&period=${period}&metrics=visitors,pageviews,bounce_rate,visit_duration`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Plausible API error: ${response.status}`);
    }

    const data = await response.json();
    const results = data.results || {};

    return {
      visitors: results.visitors?.value || 0,
      pageviews: results.pageviews?.value || 0,
      bounce_rate: results.bounce_rate?.value || 0,
      visit_duration: results.visit_duration?.value || 0,
    };
  } catch (error) {
    console.error('Error getting Plausible overview:', error);
    throw error;
  }
}

export async function topReferrers({ 
  site, 
  period, 
  limit = 10 
}: PlausibleParams): Promise<PlausibleReferrer[]> {
  try {
    const token = getPlausibleToken();
    
    const response = await fetch(
      `https://plausible.io/api/v1/stats/breakdown?site_id=${site}&period=${period}&property=source&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Plausible API error: ${response.status}`);
    }

    const data = await response.json();
    const results = data.results || [];

    return results.map((result: any) => ({
      source: result.source || 'Unknown',
      visitors: result.visitors || 0,
    }));
  } catch (error) {
    console.error('Error getting top referrers:', error);
    throw error;
  }
}

export async function topPages({ 
  site, 
  period, 
  limit = 10 
}: PlausibleParams): Promise<PlausiblePage[]> {
  try {
    const token = getPlausibleToken();
    
    const response = await fetch(
      `https://plausible.io/api/v1/stats/breakdown?site_id=${site}&period=${period}&property=event:page&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Plausible API error: ${response.status}`);
    }

    const data = await response.json();
    const results = data.results || [];

    return results.map((result: any) => ({
      page: result.page || 'Unknown',
      visitors: result.visitors || 0,
    }));
  } catch (error) {
    console.error('Error getting top pages:', error);
    throw error;
  }
}
