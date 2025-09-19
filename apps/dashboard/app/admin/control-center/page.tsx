'use client';

import React, { useState, useEffect } from 'react';
import ControlCenterLayout from './layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Mail, TrendingUp, DollarSign, Activity, Users, Eye, RefreshCw, Loader2 } from 'lucide-react';
// import { toast } from 'sonner';
const toast = (message: string) => console.log('Toast:', message);

interface DashboardData {
  calendar: {
    nextEvent: string;
    time: string;
    count: number;
  };
  email: {
    unread: number;
    starred: number;
  };
  social: {
    queued: number;
    published: number;
  };
  vercel: {
    latestDeploy: string;
    status: string;
  };
  stripe: {
    revenue: string;
    period: string;
  };
  plausible: {
    visitors: string;
    pageviews: string;
  };
}

const ControlCenterPage = () => {
  const [data, setData] = useState<DashboardData>({
    calendar: { nextEvent: 'Loading...', time: '...', count: 0 },
    email: { unread: 0, starred: 0 },
    social: { queued: 0, published: 0 },
    vercel: { latestDeploy: 'Loading...', status: '...' },
    stripe: { revenue: '$0', period: '7 days' },
    plausible: { visitors: '0', pageviews: '0' },
  });
  const [loading, setLoading] = useState(false);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Fetch dashboard data from various APIs
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch data from multiple endpoints in parallel
      const [
        calendarRes,
        emailRes,
        vercelRes,
        stripeRes,
        plausibleRes,
        activityRes
      ] = await Promise.allSettled([
        fetch('/api/calendar/upcoming?limit=1'),
        fetch('/api/gmail/list?type=unread&limit=1'),
        fetch('/api/devops/vercel?limit=1'),
        fetch('/api/finance/stripe/summary?days=7'),
        fetch('/api/analytics/overview?site=default&period=7d'),
        fetch('/api/admin/activity?limit=3')
      ]);

      // Process calendar data
      if (calendarRes.status === 'fulfilled' && calendarRes.value.ok) {
        const calendarData = await calendarRes.value.json();
        if (calendarData.events && calendarData.events.length > 0) {
          const nextEvent = calendarData.events[0];
          setData(prev => ({
            ...prev,
            calendar: {
              nextEvent: nextEvent.summary || 'No upcoming events',
              time: new Date(nextEvent.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              count: calendarData.events.length,
            }
          }));
        }
      } else {
        // Show demo calendar data
        setData(prev => ({
          ...prev,
          calendar: {
            nextEvent: 'Team Standup',
            time: '9:00 AM',
            count: 3,
          }
        }));
      }

      // Process email data
      if (emailRes.status === 'fulfilled' && emailRes.value.ok) {
        const emailData = await emailRes.value.json();
        setData(prev => ({
          ...prev,
          email: {
            unread: emailData.messages?.length || 0,
            starred: 0, // We'd need a separate call for starred
          }
        }));
      } else {
        // Show demo email data
        setData(prev => ({
          ...prev,
          email: {
            unread: 12,
            starred: 5,
          }
        }));
      }

      // Process Vercel data
      if (vercelRes.status === 'fulfilled' && vercelRes.value.ok) {
        const vercelData = await vercelRes.value.json();
        if (vercelData.deployments && vercelData.deployments.length > 0) {
          const latest = vercelData.deployments[0];
          setData(prev => ({
            ...prev,
            vercel: {
              latestDeploy: latest.url || 'Production',
              status: latest.state || 'Ready',
            }
          }));
        }
      } else {
        // Show demo Vercel data
        setData(prev => ({
          ...prev,
          vercel: {
            latestDeploy: 'Production',
            status: 'Ready',
          }
        }));
      }

      // Process Stripe data
      if (stripeRes.status === 'fulfilled' && stripeRes.value.ok) {
        const stripeData = await stripeRes.value.json();
        if (stripeData.revenue) {
          setData(prev => ({
            ...prev,
            stripe: {
              revenue: `$${stripeData.revenue.total?.toFixed(2) || '0'}`,
              period: '7 days',
            }
          }));
        }
      } else {
        // Show demo Stripe data
        setData(prev => ({
          ...prev,
          stripe: {
            revenue: '$2,450',
            period: '7 days',
          }
        }));
      }

      // Process Plausible data
      if (plausibleRes.status === 'fulfilled' && plausibleRes.value.ok) {
        const plausibleData = await plausibleRes.value.json();
        if (plausibleData.overview) {
          setData(prev => ({
            ...prev,
            plausible: {
              visitors: plausibleData.overview.visitors?.toLocaleString() || '0',
              pageviews: plausibleData.overview.pageviews?.toLocaleString() || '0',
            }
          }));
        }
      } else {
        // Show demo Plausible data
        setData(prev => ({
          ...prev,
          plausible: {
            visitors: '1,234',
            pageviews: '3,456',
          }
        }));
      }

      // Process activity data
      if (activityRes.status === 'fulfilled' && activityRes.value.ok) {
        const activityData = await activityRes.value.json();
        setRecentActivity(activityData.activities || []);
      } else {
        // Show demo activity data
        setRecentActivity([
          { id: '1', kind: 'Email sent to john@example.com', createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString() },
          { id: '2', kind: 'LinkedIn post published', createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
          { id: '3', kind: 'Calendar event created', createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
        ]);
      }

      // For social data, we'd need to implement a social queue endpoint
      // For now, we'll keep the mock data structure
      setData(prev => ({
        ...prev,
        social: {
          queued: 2, // Demo data
          published: 8, // Demo data
        }
      }));

      toast.info('Showing demo data - configure your integrations to see real data');

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Quick action handlers
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'email':
        window.location.href = '/admin/control-center/email';
        break;
      case 'social':
        window.location.href = '/admin/control-center/composer';
        break;
      case 'calendar':
        window.location.href = '/admin/control-center/calendar';
        break;
      default:
        toast.info(`Action: ${action}`);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <ControlCenterLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Today View Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to your personal admin control center. Here&apos;s what&apos;s happening today.
            </p>
          </div>
          <Button onClick={fetchDashboardData} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Calendar */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Event</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.calendar.nextEvent}</div>
              <p className="text-xs text-muted-foreground">
                {data.calendar.time} • {data.calendar.count} events today
              </p>
            </CardContent>
          </Card>

          {/* Email */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Email</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.email.unread}</div>
              <p className="text-xs text-muted-foreground">
                unread • {data.email.starred} starred
              </p>
            </CardContent>
          </Card>

          {/* Social */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Social Queue</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.social.queued}</div>
              <p className="text-xs text-muted-foreground">
                queued • {data.social.published} published today
              </p>
            </CardContent>
          </Card>

          {/* Vercel */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Latest Deploy</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.vercel.latestDeploy}</div>
              <Badge variant="secondary" className="mt-1">
                {data.vercel.status}
              </Badge>
            </CardContent>
          </Card>

          {/* Stripe */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stripe.revenue}</div>
              <p className="text-xs text-muted-foreground">
                Last {data.stripe.period}
              </p>
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Analytics</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.plausible.visitors}</div>
              <p className="text-xs text-muted-foreground">
                visitors • {data.plausible.pageviews} pageviews
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div 
                className="flex items-center justify-between p-2 rounded-lg border cursor-pointer hover:bg-muted/50"
                onClick={() => handleQuickAction('email')}
              >
                <span>Send Email</span>
                <Badge variant="outline">Email</Badge>
              </div>
              <div 
                className="flex items-center justify-between p-2 rounded-lg border cursor-pointer hover:bg-muted/50"
                onClick={() => handleQuickAction('social')}
              >
                <span>Schedule Post</span>
                <Badge variant="outline">Social</Badge>
              </div>
              <div 
                className="flex items-center justify-between p-2 rounded-lg border cursor-pointer hover:bg-muted/50"
                onClick={() => handleQuickAction('calendar')}
              >
                <span>Add Event</span>
                <Badge variant="outline">Calendar</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {loading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="text-center text-muted-foreground p-4">
                  No recent activity
                </div>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-2 rounded-lg border">
                    <span>{activity.kind || 'Activity'}</span>
                    <Badge variant="secondary">
                      {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ControlCenterLayout>
  );
};

export default ControlCenterPage;
