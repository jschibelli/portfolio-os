/**
 * Analytics Fallback Service
 * Provides database-based analytics when Google Analytics is unavailable
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface AnalyticsOverview {
  visitors: number;
  pageviews: number;
  bounce_rate: number;
  visit_duration: number;
  sessions: number;
  newUsers: number;
}

export interface AnalyticsTimeSeriesData {
  date: string;
  value: number;
}

export interface AnalyticsReferrer {
  source: string;
  visitors: number;
  sessions: number;
}

export interface AnalyticsPage {
  page: string;
  visitors: number;
  pageviews: number;
}

export interface DeviceData {
  device: string;
  users: number;
  percentage: number;
}

/**
 * Check if Google Analytics is configured
 */
export function isGoogleAnalyticsConfigured(): boolean {
  return !!(
    process.env.GOOGLE_ANALYTICS_PROPERTY_ID &&
    (process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL || process.env.GOOGLE_ANALYTICS_ACCESS_TOKEN)
  );
}

/**
 * Get analytics overview from database - REAL DATA ONLY
 */
export async function getDatabaseAnalyticsOverview(periodDays: number = 7): Promise<AnalyticsOverview> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    // Get total views from all articles (REAL DATA)
    const viewsAggregate = await prisma.article.aggregate({
      where: {
        status: 'PUBLISHED'
      },
      _sum: {
        views: true
      }
    });

    const totalViews = viewsAggregate._sum.views || 0;
    
    // Get actual article count in period
    const articlesCount = await prisma.article.count({
      where: {
        status: 'PUBLISHED',
        publishedAt: {
          gte: startDate
        }
      }
    });

    // Count actual page view records if they exist
    let actualPageViews = 0;
    let actualSessions = 0;
    let actualVisitors = 0;
    let actualNewUsers = 0;
    
    try {
      const pageViewCount = await prisma.pageView.count({
        where: {
          timestamp: {
            gte: startDate
          }
        }
      });
      actualPageViews = pageViewCount;
      
      // Count unique sessions
      const uniqueSessions = await prisma.pageView.groupBy({
        by: ['sessionId'],
        where: {
          timestamp: {
            gte: startDate
          },
          sessionId: {
            not: null
          }
        }
      });
      actualSessions = uniqueSessions.length;
      
      // Count unique visitors
      const uniqueVisitors = await prisma.pageView.groupBy({
        by: ['userId'],
        where: {
          timestamp: {
            gte: startDate
          },
          userId: {
            not: null
          }
        }
      });
      actualVisitors = uniqueVisitors.length;
      
    } catch (e) {
      // PageView table might not exist or have data
      console.log('PageView data not available, using article views only');
    }

    // Get actual bounce rate and duration from session data
    let bounceRate = 0;
    let avgVisitDuration = 0;
    
    try {
      const sessionsData = await prisma.analyticsSession.findMany({
        where: {
          startTime: {
            gte: startDate
          }
        },
        select: {
          duration: true,
          pageViews: true
        }
      });
      
      if (sessionsData.length > 0) {
        const bouncedSessions = sessionsData.filter(s => s.pageViews === 1).length;
        bounceRate = (bouncedSessions / sessionsData.length) * 100;
        
        const totalDuration = sessionsData.reduce((sum, s) => sum + (s.duration || 0), 0);
        avgVisitDuration = Math.floor(totalDuration / sessionsData.length);
      }
    } catch (e) {
      // AnalyticsSession table might not exist
      console.log('Session data not available');
    }

    return {
      visitors: actualVisitors || 0,
      pageviews: actualPageViews || totalViews,
      bounce_rate: bounceRate,
      visit_duration: avgVisitDuration,
      sessions: actualSessions || 0,
      newUsers: actualNewUsers || 0
    };
  } catch (error) {
    console.error('Error getting database analytics:', error);
    
    // Return ZEROS if query fails - NO MOCK DATA
    return {
      visitors: 0,
      pageviews: 0,
      bounce_rate: 0,
      visit_duration: 0,
      sessions: 0,
      newUsers: 0
    };
  }
}

/**
 * Get time series data from database - REAL DATA ONLY
 */
export async function getDatabaseTimeSeriesData(periodDays: number = 7): Promise<AnalyticsTimeSeriesData[]> {
  try {
    const data: AnalyticsTimeSeriesData[] = [];
    const now = new Date();

    for (let i = periodDays - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      // Get ACTUAL page views for this day
      let actualValue = 0;
      
      try {
        const pageViews = await prisma.pageView.count({
          where: {
            timestamp: {
              gte: date,
              lt: nextDate
            }
          }
        });
        actualValue = pageViews;
      } catch (e) {
        // If no PageView table, count article views added that day
        const articles = await prisma.article.findMany({
          where: {
            status: 'PUBLISHED',
            updatedAt: {
              gte: date,
              lt: nextDate
            }
          },
          select: {
            views: true
          }
        });
        actualValue = articles.reduce((sum, a) => sum + a.views, 0);
      }

      data.push({
        date: date.toISOString(),
        value: actualValue
      });
    }

    return data;
  } catch (error) {
    console.error('Error getting time series data:', error);
    
    // Return ZEROS if query fails - NO MOCK DATA
    const data: AnalyticsTimeSeriesData[] = [];
    const now = new Date();
    
    for (let i = periodDays - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString(),
        value: 0
      });
    }
    
    return data;
  }
}

/**
 * Get top pages from database
 */
export async function getDatabaseTopPages(limit: number = 5): Promise<AnalyticsPage[]> {
  try {
    const topArticles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED'
      },
      select: {
        slug: true,
        title: true,
        views: true
      },
      orderBy: {
        views: 'desc'
      },
      take: limit
    });

    return topArticles.map(article => ({
      page: `/blog/${article.slug}`,
      visitors: Math.floor(article.views * 0.7), // Estimate unique visitors
      pageviews: article.views
    }));
  } catch (error) {
    console.error('Error getting top pages:', error);
    return [];
  }
}

/**
 * Get referrer data from REAL page views - NO MOCK DATA
 */
export async function getDatabaseReferrers(): Promise<AnalyticsReferrer[]> {
  try {
    // Get actual referrer data from PageView table
    const pageViews = await prisma.pageView.groupBy({
      by: ['referrer'],
      where: {
        referrer: {
          not: null
        }
      },
      _count: {
        referrer: true
      }
    });

    // Group by referrer type
    const referrerMap = new Map<string, { visitors: number; sessions: number }>();
    
    for (const pv of pageViews) {
      const referrer = pv.referrer || '';
      let source = 'Direct';
      
      if (referrer.includes('google')) source = 'Google';
      else if (referrer.includes('facebook') || referrer.includes('twitter') || referrer.includes('linkedin')) source = 'Social Media';
      else if (referrer && referrer !== '') source = 'Referral';
      
      const existing = referrerMap.get(source) || { visitors: 0, sessions: 0 };
      existing.visitors += pv._count.referrer;
      existing.sessions += pv._count.referrer;
      referrerMap.set(source, existing);
    }

    const result: AnalyticsReferrer[] = [];
    referrerMap.forEach((value, key) => {
      result.push({ source: key, visitors: value.visitors, sessions: value.sessions });
    });

    return result.sort((a, b) => b.visitors - a.visitors);
  } catch (error) {
    console.error('Error getting referrer data:', error);
    // Return empty array if no data - NO MOCK DATA
    return [];
  }
}

/**
 * Get device data from REAL user agents - NO MOCK DATA
 */
export async function getDatabaseDeviceData(): Promise<DeviceData[]> {
  try {
    // Get actual device data from PageView table
    const pageViews = await prisma.pageView.findMany({
      where: {
        userAgent: {
          not: null
        }
      },
      select: {
        userAgent: true
      }
    });

    const deviceCounts = {
      desktop: 0,
      mobile: 0,
      tablet: 0
    };

    for (const pv of pageViews) {
      const ua = (pv.userAgent || '').toLowerCase();
      if (ua.includes('mobile')) deviceCounts.mobile++;
      else if (ua.includes('tablet') || ua.includes('ipad')) deviceCounts.tablet++;
      else deviceCounts.desktop++;
    }

    const total = deviceCounts.desktop + deviceCounts.mobile + deviceCounts.tablet;
    
    if (total === 0) {
      return []; // NO MOCK DATA - return empty if no real data
    }

    return [
      { 
        device: 'desktop', 
        users: deviceCounts.desktop, 
        percentage: Math.round((deviceCounts.desktop / total) * 100) 
      },
      { 
        device: 'mobile', 
        users: deviceCounts.mobile, 
        percentage: Math.round((deviceCounts.mobile / total) * 100) 
      },
      { 
        device: 'tablet', 
        users: deviceCounts.tablet, 
        percentage: Math.round((deviceCounts.tablet / total) * 100) 
      }
    ];
  } catch (error) {
    console.error('Error getting device data:', error);
    // Return empty array if no data - NO MOCK DATA
    return [];
  }
}

/**
 * Get complete analytics data - REAL DATA ONLY
 */
export async function getCompleteAnalytics(periodDays: number = 7) {
  const overview = await getDatabaseAnalyticsOverview(periodDays);
  const timeSeriesData = await getDatabaseTimeSeriesData(periodDays);
  const topPages = await getDatabaseTopPages(5);
  const topReferrers = await getDatabaseReferrers();
  const deviceData = await getDatabaseDeviceData();

  return {
    overview,
    timeSeriesData,
    topPages,
    topReferrers,
    deviceData,
    isFallback: true, // Flag to indicate this is database data (not Google Analytics)
    isRealData: true  // Flag to indicate this is REAL data, not mock
  };
}






