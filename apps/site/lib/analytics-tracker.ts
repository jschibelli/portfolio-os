/**
 * Real Analytics Tracker
 * 
 * Tracks real user interactions and stores them in the database
 * instead of using mock data or localStorage
 */

import { prisma } from '@/lib/prisma'

export interface PageViewEvent {
  url: string
  title: string
  referrer?: string
  userAgent?: string
  timestamp: Date
  sessionId?: string
  userId?: string
}

export interface UserInteraction {
  type: 'click' | 'scroll' | 'time_on_page' | 'form_submit' | 'download'
  element?: string
  value?: any
  timestamp: Date
  sessionId?: string
  userId?: string
  pageUrl: string
}

export interface AnalyticsSession {
  sessionId: string
  userId?: string
  startTime: Date
  endTime?: Date
  pageViews: number
  duration?: number
  referrer?: string
  userAgent?: string
  ipAddress?: string
}

/**
 * Track a page view
 */
export async function trackPageView(event: PageViewEvent): Promise<void> {
  try {
    // Store in database
    await prisma.pageView.create({
      data: {
        url: event.url,
        title: event.title,
        referrer: event.referrer,
        userAgent: event.userAgent,
        timestamp: event.timestamp,
        sessionId: event.sessionId,
        userId: event.userId
      }
    })

    // Update article views if it's an article page
    if (event.url.includes('/blog/') || event.url.includes('/case-studies/')) {
      const slug = event.url.split('/').pop()
      if (slug) {
        await prisma.article.updateMany({
          where: { slug },
          data: {
            views: {
              increment: 1
            }
          }
        })
      }
    }
  } catch (error) {
    console.error('Failed to track page view:', error)
  }
}

/**
 * Track user interaction
 */
export async function trackUserInteraction(interaction: UserInteraction): Promise<void> {
  try {
    await prisma.userInteraction.create({
      data: {
        type: interaction.type,
        element: interaction.element,
        value: interaction.value,
        timestamp: interaction.timestamp,
        sessionId: interaction.sessionId,
        userId: interaction.userId,
        pageUrl: interaction.pageUrl
      }
    })
  } catch (error) {
    console.error('Failed to track user interaction:', error)
  }
}

/**
 * Start a new analytics session
 */
export async function startSession(session: AnalyticsSession): Promise<void> {
  try {
    await prisma.analyticsSession.create({
      data: {
        sessionId: session.sessionId,
        userId: session.userId,
        startTime: session.startTime,
        pageViews: session.pageViews,
        referrer: session.referrer,
        userAgent: session.userAgent,
        ipAddress: session.ipAddress
      }
    })
  } catch (error) {
    console.error('Failed to start session:', error)
  }
}

/**
 * End an analytics session
 */
export async function endSession(sessionId: string, endTime: Date): Promise<void> {
  try {
    const session = await prisma.analyticsSession.findUnique({
      where: { sessionId }
    })

    if (session) {
      const duration = endTime.getTime() - session.startTime.getTime()
      await prisma.analyticsSession.update({
        where: { sessionId },
        data: {
          endTime,
          duration: Math.round(duration / 1000) // Duration in seconds
        }
      })
    }
  } catch (error) {
    console.error('Failed to end session:', error)
  }
}

/**
 * Get real analytics data for the dashboard
 */
export async function getRealAnalyticsData(period: string = '7d'): Promise<{
  overview: any
  topPages: any[]
  topReferrers: any[]
  deviceData: any[]
  timeSeriesData: any[]
}> {
  try {
    const days = parseInt(period.replace('d', ''))
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get overview data
    const [totalViews, uniqueVisitorsData, totalSessions, avgDuration] = await Promise.all([
      prisma.pageView.count({
        where: { timestamp: { gte: startDate } }
      }),
      // Count unique visitors using groupBy
      prisma.analyticsSession.groupBy({
        by: ['userId'],
        where: { 
          startTime: { gte: startDate },
          userId: { not: null }
        }
      }),
      prisma.analyticsSession.count({
        where: { startTime: { gte: startDate } }
      }),
      prisma.analyticsSession.aggregate({
        where: { 
          startTime: { gte: startDate },
          duration: { not: null }
        },
        _avg: { duration: true }
      })
    ])
    
    const uniqueVisitors = uniqueVisitorsData.length

    // Get top pages
    const topPages = await prisma.pageView.groupBy({
      by: ['url'],
      where: { timestamp: { gte: startDate } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5
    })

    // Get top referrers
    const topReferrers = await prisma.pageView.groupBy({
      by: ['referrer'],
      where: { 
        timestamp: { gte: startDate },
        referrer: { not: null }
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5
    })

    // Get device data (from user agents)
    const deviceData = await prisma.pageView.groupBy({
      by: ['userAgent'],
      where: { timestamp: { gte: startDate } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } }
    })

    // Get time series data (daily views)
    const timeSeriesData = await prisma.$queryRaw`
      SELECT 
        DATE(timestamp) as date,
        COUNT(*) as value
      FROM "PageView" 
      WHERE timestamp >= ${startDate}
      GROUP BY DATE(timestamp)
      ORDER BY DATE(timestamp)
    `

    // Calculate bounce rate (sessions with only 1 page view)
    const bounceRate = await prisma.analyticsSession.count({
      where: {
        startTime: { gte: startDate },
        pageViews: 1
      }
    })

    const overview = {
      visitors: uniqueVisitors,
      pageviews: totalViews,
      sessions: totalSessions,
      bounce_rate: totalSessions > 0 ? (bounceRate / totalSessions) * 100 : 0,
      visit_duration: avgDuration._avg.duration || 0,
      newUsers: uniqueVisitors // Simplified for now
    }

    return {
      overview,
      topPages: topPages.map(page => ({
        page: page.url,
        visitors: Number(page._count.id),
        pageviews: Number(page._count.id)
      })),
      topReferrers: topReferrers.map(ref => ({
        source: ref.referrer || 'Direct',
        visitors: Number(ref._count.id),
        sessions: Number(ref._count.id)
      })),
      deviceData: deviceData.map(device => ({
        device: getDeviceType(device.userAgent || ''),
        users: Number(device._count.id),
        percentage: Math.round((Number(device._count.id) / totalViews) * 100)
      })),
      timeSeriesData: Array.isArray(timeSeriesData) ? timeSeriesData.map((item: any) => ({
        date: item.date instanceof Date ? item.date.toISOString().split('T')[0] : String(item.date),
        value: Number(item.value)
      })) : []
    }
  } catch (error) {
    console.error('Failed to get real analytics data:', error)
    // Return empty data instead of mock data
    return {
      overview: {
        visitors: 0,
        pageviews: 0,
        sessions: 0,
        bounce_rate: 0,
        visit_duration: 0,
        newUsers: 0
      },
      topPages: [],
      topReferrers: [],
      deviceData: [],
      timeSeriesData: []
    }
  }
}

/**
 * Helper function to determine device type from user agent
 */
function getDeviceType(userAgent: string): string {
  if (/mobile/i.test(userAgent)) return 'mobile'
  if (/tablet/i.test(userAgent)) return 'tablet'
  return 'desktop'
}
