import { NextRequest, NextResponse } from 'next/server';

/**
 * Real User Monitoring (RUM) API Endpoint
 * 
 * This endpoint receives performance metrics from client-side monitoring
 * and stores them for analysis and alerting.
 */

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate the incoming data structure
    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }

    // Extract and validate performance metrics
    const metrics = {
      lcp: data.lcp,
      fid: data.fid,
      cls: data.cls,
      fcp: data.fcp,
      ttfb: data.ttfb,
      userAgent: data.userAgent,
      timestamp: data.timestamp || Date.now(),
      url: data.url,
      viewport: data.viewport,
      error: data.error
    };

    // Log performance metrics (in production, you'd store these in a database)
    console.log('RUM Metrics received:', {
      ...metrics,
      userAgent: metrics.userAgent?.substring(0, 100) // Truncate for logging
    });

    // Check for performance violations
    const violations = [];
    
    if (metrics.lcp && metrics.lcp > 2500) {
      violations.push({ metric: 'LCP', value: metrics.lcp, threshold: 2500 });
    }
    
    if (metrics.fid && metrics.fid > 100) {
      violations.push({ metric: 'FID', value: metrics.fid, threshold: 100 });
    }
    
    if (metrics.cls && metrics.cls > 0.1) {
      violations.push({ metric: 'CLS', value: metrics.cls, threshold: 0.1 });
    }
    
    if (metrics.fcp && metrics.fcp > 1800) {
      violations.push({ metric: 'FCP', value: metrics.fcp, threshold: 1800 });
    }

    // Log violations for monitoring
    if (violations.length > 0) {
      console.warn('Performance violations detected:', violations);
      
      // In production, you might want to:
      // - Send alerts to monitoring services
      // - Store violations in a database
      // - Trigger automated performance investigations
    }

    // In production, you would typically:
    // 1. Store metrics in a time-series database (e.g., InfluxDB, TimescaleDB)
    // 2. Send to analytics services (e.g., Google Analytics, Mixpanel)
    // 3. Forward to monitoring tools (e.g., DataDog, New Relic)
    
    return NextResponse.json(
      { 
        success: true, 
        violations: violations.length,
        message: 'Metrics received successfully' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('RUM endpoint error:', error);
    
    return NextResponse.json(
      { error: 'Failed to process metrics' },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
