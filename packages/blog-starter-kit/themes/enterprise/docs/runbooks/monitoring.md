# Monitoring and Observability Guide

**Last Updated**: January 2025  
**Version**: 2.0.0

## Overview

This guide covers monitoring, logging, and observability for the Mindware Blog platform. It includes setup instructions, key metrics to monitor, and alerting strategies.

## Monitoring Stack

### Core Components

- **Vercel Analytics**: Application performance and usage metrics
- **Sentry**: Error tracking and performance monitoring
- **Google Analytics**: User behavior and traffic analysis
- **Plausible**: Privacy-focused analytics
- **Custom Metrics**: Application-specific monitoring

### Infrastructure Monitoring

- **Vercel Dashboard**: Deployment and function metrics
- **Database Monitoring**: PostgreSQL performance and health
- **External Services**: API health and response times

## Key Metrics

### Application Performance

#### Core Web Vitals

- **Largest Contentful Paint (LCP)**: < 2.5 seconds
- **First Input Delay (FID)**: < 100 milliseconds
- **Cumulative Layout Shift (CLS)**: < 0.1

#### Performance Metrics

- **Time to First Byte (TTFB)**: < 600ms
- **First Contentful Paint (FCP)**: < 1.8s
- **Speed Index**: < 3.4s
- **Total Blocking Time (TBT)**: < 200ms

### Business Metrics

#### Content Metrics

- **Page Views**: Daily, weekly, monthly
- **Unique Visitors**: Traffic growth
- **Bounce Rate**: Content engagement
- **Average Session Duration**: User engagement
- **Pages per Session**: Content consumption

#### User Engagement

- **Article Views**: Popular content tracking
- **Case Study Views**: Portfolio performance
- **Newsletter Signups**: Lead generation
- **Contact Form Submissions**: Business inquiries
- **Social Media Shares**: Content virality

### Technical Metrics

#### System Health

- **Uptime**: 99.9% target
- **Response Time**: < 200ms average
- **Error Rate**: < 0.1%
- **Database Query Time**: < 100ms average
- **API Response Time**: < 500ms average

#### Resource Usage

- **Memory Usage**: Function memory consumption
- **CPU Usage**: Processing load
- **Database Connections**: Connection pool health
- **Bandwidth**: Data transfer metrics

## Monitoring Setup

### Vercel Analytics

#### Configuration

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

#### Custom Events

```typescript
// lib/analytics.ts
import { track } from '@vercel/analytics';

export function trackEvent(event: string, properties?: Record<string, any>) {
  track(event, properties);
}

// Usage
trackEvent('article_viewed', {
  article_id: article.id,
  article_title: article.title,
  author: article.author.name,
});
```

### Sentry Integration

#### Setup

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  beforeSend(event) {
    // Filter out non-critical errors
    if (event.exception) {
      const error = event.exception.values?.[0];
      if (error?.type === 'ChunkLoadError') {
        return null;
      }
    }
    return event;
  },
});
```

#### Error Tracking

```typescript
// lib/error-tracking.ts
import * as Sentry from '@sentry/nextjs';

export function captureException(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    tags: {
      section: 'api',
    },
    extra: context,
  });
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  Sentry.captureMessage(message, level);
}
```

### Google Analytics 4

#### Configuration

```typescript
// lib/gtag.ts
export const GA_TRACKING_ID = process.env.GOOGLE_ANALYTICS_ID;

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
```

#### Custom Events

```typescript
// Track article views
export function trackArticleView(article: Article) {
  event({
    action: 'view_article',
    category: 'engagement',
    label: article.title,
  });
}

// Track newsletter signup
export function trackNewsletterSignup(email: string) {
  event({
    action: 'newsletter_signup',
    category: 'conversion',
    label: 'homepage',
  });
}
```

## Logging Strategy

### Application Logging

#### Structured Logging

```typescript
// lib/logger.ts
interface LogEntry {
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  userId?: string;
  requestId?: string;
}

export function log(entry: LogEntry) {
  const logData = {
    ...entry,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  };
  
  console.log(JSON.stringify(logData));
  
  // Send to external logging service if needed
  if (entry.level === 'error') {
    captureException(new Error(entry.message), entry.context);
  }
}
```

#### Request Logging

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const start = Date.now();
  const requestId = crypto.randomUUID();
  
  // Log request
  log({
    level: 'info',
    message: 'Request started',
    requestId,
    context: {
      method: request.method,
      url: request.url,
      userAgent: request.headers.get('user-agent'),
    },
  });
  
  const response = NextResponse.next();
  
  // Log response
  const duration = Date.now() - start;
  log({
    level: 'info',
    message: 'Request completed',
    requestId,
    context: {
      status: response.status,
      duration,
    },
  });
  
  return response;
}
```

### Database Logging

#### Prisma Logging

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
});

prisma.$on('query', (e) => {
  log({
    level: 'info',
    message: 'Database query executed',
    context: {
      query: e.query,
      params: e.params,
      duration: e.duration,
    },
  });
});

prisma.$on('error', (e) => {
  log({
    level: 'error',
    message: 'Database error',
    context: {
      error: e.message,
    },
  });
});
```

### API Logging

#### Request/Response Logging

```typescript
// lib/api-logger.ts
export function logApiRequest(req: NextRequest, res: NextResponse, duration: number) {
  const logData = {
    method: req.method,
    url: req.url,
    status: res.status,
    duration,
    userAgent: req.headers.get('user-agent'),
    ip: req.ip,
  };
  
  log({
    level: res.status >= 400 ? 'error' : 'info',
    message: 'API request',
    context: logData,
  });
}
```

## Alerting Strategy

### Critical Alerts

#### System Health

- **Uptime < 99%**: Immediate notification
- **Error Rate > 1%**: Alert within 5 minutes
- **Response Time > 1s**: Alert within 10 minutes
- **Database Connection Failures**: Immediate alert

#### Performance

- **Core Web Vitals Degradation**: Alert within 15 minutes
- **Page Load Time > 3s**: Alert within 10 minutes
- **API Response Time > 2s**: Alert within 5 minutes

### Business Alerts

#### Traffic Anomalies

- **Traffic Drop > 50%**: Alert within 30 minutes
- **Traffic Spike > 300%**: Alert within 15 minutes
- **Zero Traffic**: Alert within 1 hour

#### Content Performance

- **Article Views Drop**: Weekly report
- **Newsletter Signup Drop**: Daily report
- **Contact Form Failures**: Immediate alert

### Alert Channels

#### Slack Integration

```typescript
// lib/slack-alerts.ts
export async function sendSlackAlert(message: string, severity: 'low' | 'medium' | 'high' | 'critical') {
  const color = {
    low: '#36a64f',
    medium: '#ffaa00',
    high: '#ff6600',
    critical: '#ff0000',
  }[severity];
  
  const payload = {
    text: message,
    attachments: [
      {
        color,
        fields: [
          {
            title: 'Severity',
            value: severity.toUpperCase(),
            short: true,
          },
          {
            title: 'Time',
            value: new Date().toISOString(),
            short: true,
          },
        ],
      },
    ],
  };
  
  await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}
```

#### Email Alerts

```typescript
// lib/email-alerts.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailAlert(
  to: string,
  subject: string,
  message: string,
  severity: 'low' | 'medium' | 'high' | 'critical'
) {
  const priority = {
    low: 'normal',
    medium: 'normal',
    high: 'high',
    critical: 'urgent',
  }[severity];
  
  await resend.emails.send({
    from: 'alerts@mindware.dev',
    to,
    subject: `[${severity.toUpperCase()}] ${subject}`,
    html: `
      <h2>Alert: ${subject}</h2>
      <p><strong>Severity:</strong> ${severity.toUpperCase()}</p>
      <p><strong>Time:</strong> ${new Date().toISOString()}</p>
      <p><strong>Message:</strong></p>
      <pre>${message}</pre>
    `,
    headers: {
      'X-Priority': priority,
    },
  });
}
```

## Health Checks

### Application Health

```typescript
// app/api/health/route.ts
export async function GET() {
  const checks = {
    database: await checkDatabase(),
    openai: await checkOpenAI(),
    stripe: await checkStripe(),
    google: await checkGoogle(),
  };
  
  const isHealthy = Object.values(checks).every(check => check.status === 'healthy');
  
  return NextResponse.json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV,
    checks,
  }, {
    status: isHealthy ? 200 : 503,
  });
}

async function checkDatabase() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'healthy', responseTime: Date.now() };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}
```

### Readiness Check

```typescript
// app/api/ready/route.ts
export async function GET() {
  const checks = {
    database: await checkDatabase(),
    migrations: await checkMigrations(),
  };
  
  const isReady = Object.values(checks).every(check => check.status === 'ready');
  
  return NextResponse.json({
    status: isReady ? 'ready' : 'not_ready',
    checks,
  }, {
    status: isReady ? 200 : 503,
  });
}
```

## Performance Monitoring

### Custom Metrics

```typescript
// lib/metrics.ts
interface Metric {
  name: string;
  value: number;
  timestamp: string;
  tags?: Record<string, string>;
}

export function recordMetric(metric: Metric) {
  // Send to monitoring service
  console.log(JSON.stringify({
    type: 'metric',
    ...metric,
  }));
}

// Usage
recordMetric({
  name: 'article.view.duration',
  value: 120, // seconds
  tags: {
    article_id: article.id,
    category: article.category,
  },
});
```

### Performance Tracking

```typescript
// lib/performance.ts
export function trackPerformance(name: string, fn: () => Promise<any>) {
  return async (...args: any[]) => {
    const start = performance.now();
    try {
      const result = await fn(...args);
      const duration = performance.now() - start;
      
      recordMetric({
        name: `performance.${name}`,
        value: duration,
        tags: { status: 'success' },
      });
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      
      recordMetric({
        name: `performance.${name}`,
        value: duration,
        tags: { status: 'error' },
      });
      
      throw error;
    }
  };
}
```

## Dashboard and Reporting

### Vercel Dashboard

Monitor key metrics in Vercel dashboard:
- Function execution times
- Memory usage
- Error rates
- Traffic patterns

### Custom Dashboard

```typescript
// app/api/metrics/route.ts
export async function GET() {
  const metrics = {
    articles: await getArticleMetrics(),
    users: await getUserMetrics(),
    performance: await getPerformanceMetrics(),
  };
  
  return NextResponse.json(metrics);
}

async function getArticleMetrics() {
  const [total, published, views] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { status: 'PUBLISHED' } }),
    prisma.article.aggregate({
      _sum: { views: true },
    }),
  ]);
  
  return {
    total,
    published,
    totalViews: views._sum.views || 0,
  };
}
```

### Weekly Reports

```typescript
// scripts/weekly-report.ts
export async function generateWeeklyReport() {
  const report = {
    period: 'last_7_days',
    metrics: {
      pageViews: await getPageViews('7d'),
      uniqueVisitors: await getUniqueVisitors('7d'),
      topArticles: await getTopArticles('7d'),
      newsletterSignups: await getNewsletterSignups('7d'),
    },
  };
  
  // Send report via email
  await sendEmailReport(report);
  
  return report;
}
```

## Troubleshooting Monitoring

### Common Issues

#### Missing Metrics

**Problem**: Metrics not appearing in dashboards

**Solutions**:
1. Check metric collection code
2. Verify monitoring service configuration
3. Check network connectivity
4. Review data retention policies

#### High Alert Volume

**Problem**: Too many alerts causing alert fatigue

**Solutions**:
1. Adjust alert thresholds
2. Implement alert grouping
3. Add alert suppression rules
4. Review alert relevance

#### Performance Impact

**Problem**: Monitoring affecting application performance

**Solutions**:
1. Use async logging
2. Implement sampling
3. Optimize metric collection
4. Use background processing

## Best Practices

### Monitoring Guidelines

1. **Start Simple**: Begin with basic metrics and expand
2. **Focus on Business Value**: Monitor metrics that matter
3. **Set Realistic Thresholds**: Avoid false positives
4. **Regular Review**: Update monitoring as needs change
5. **Document Everything**: Keep monitoring documentation current

### Alert Management

1. **Clear Escalation**: Define who gets notified when
2. **Actionable Alerts**: Include context and suggested actions
3. **Regular Testing**: Test alerting systems regularly
4. **Feedback Loop**: Learn from incidents to improve monitoring

### Data Retention

1. **Log Retention**: Keep logs for appropriate duration
2. **Metric Retention**: Balance detail vs. storage costs
3. **Compliance**: Follow data protection regulations
4. **Archival**: Archive old data for historical analysis

## Tools and Resources

### Monitoring Tools

- **Vercel Analytics**: Built-in performance monitoring
- **Sentry**: Error tracking and performance
- **Google Analytics**: User behavior analysis
- **Plausible**: Privacy-focused analytics
- **Grafana**: Custom dashboards (if needed)

### External Services

- **Uptime Robot**: External uptime monitoring
- **Pingdom**: Performance monitoring
- **New Relic**: Application performance monitoring
- **DataDog**: Infrastructure monitoring

### Documentation

- **Vercel Analytics**: [vercel.com/docs/analytics](https://vercel.com/docs/analytics)
- **Sentry**: [docs.sentry.io](https://docs.sentry.io)
- **Google Analytics**: [developers.google.com/analytics](https://developers.google.com/analytics)

## Support

For monitoring and observability support:

- **Email**: [monitoring@mindware.dev](mailto:monitoring@mindware.dev)
- **Slack**: #monitoring channel
- **Documentation**: Check this guide and inline code comments
