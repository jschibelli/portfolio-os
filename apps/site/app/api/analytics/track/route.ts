import { NextRequest, NextResponse } from 'next/server';
import { 
  trackPageView, 
  trackUserInteraction, 
  startSession, 
  endSession 
} from '@/lib/analytics-tracker';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data, timestamp } = body;

    switch (type) {
      case 'page_view':
        await trackPageView({
          url: data.url,
          title: data.title,
          referrer: data.referrer,
          userAgent: data.userAgent,
          timestamp: new Date(timestamp),
          sessionId: data.sessionId,
          userId: data.userId
        });
        break;

      case 'user_interaction':
        await trackUserInteraction({
          type: data.type,
          element: data.element,
          value: data.value,
          timestamp: new Date(timestamp),
          sessionId: data.sessionId,
          userId: data.userId,
          pageUrl: data.pageUrl
        });
        break;

      case 'session_start':
        await startSession({
          sessionId: data.sessionId,
          userId: data.userId,
          startTime: new Date(data.startTime),
          pageViews: data.pageViews,
          referrer: data.referrer,
          userAgent: data.userAgent
        });
        break;

      case 'session_end':
        await endSession(data.sessionId, new Date(data.endTime));
        break;

      default:
        console.warn('Unknown analytics event type:', type);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track analytics event' },
      { status: 500 }
    );
  }
}
