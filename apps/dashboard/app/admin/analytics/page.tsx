"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Area,
  AreaChart
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  Clock, 
  Share2, 
  Globe,
  Smartphone,
  Monitor,
  Download,
  FileText
} from "lucide-react";

// Interfaces for Google Analytics data
interface AnalyticsOverview {
  visitors: number;
  pageviews: number;
  bounce_rate: number;
  visit_duration: number;
  sessions: number;
  newUsers: number;
}

interface AnalyticsReferrer {
  source: string;
  visitors: number;
  sessions: number;
}

interface AnalyticsPage {
  page: string;
  visitors: number;
  pageviews: number;
}

interface DeviceData {
  device: string;
  users: number;
  percentage: number;
}

interface TimeSeriesData {
  date: string;
  value: number;
}

// Dashboard stats interface
interface DashboardStats {
  totalViews: number;
  uniqueVisitors: number;
  publishedArticles: number;
  avgTimeOnPage: string;
  socialShares: number;
  bounceRate: number;
  currentMonthViews: number;
  currentMonthArticles: number;
  viewsChange: number;
  articlesChange: number;
  caseStudiesCount: number;
  draftArticlesCount: number;
  scheduledArticlesCount: number;
}

// NO MOCK DATA - All data comes from real database queries or Google Analytics

export default function AdminAnalytics() {
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const status = sessionResult?.status;
  const router = useRouter();
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('sessions');
  
  // Analytics data state
  const [analyticsData, setAnalyticsData] = useState<{
    overview: AnalyticsOverview | null;
    topReferrers: AnalyticsReferrer[];
    topPages: AnalyticsPage[];
    deviceData: DeviceData[];
    timeSeriesData: TimeSeriesData[];
  }>({
    overview: null,
    topReferrers: [],
    topPages: [],
    deviceData: [],
    timeSeriesData: [],
  });
  
  // Dashboard stats state
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMockData, setIsMockData] = useState(false);
  const [dataSource, setDataSource] = useState<'google-analytics' | 'database' | 'unknown'>('unknown');


  // Fetch analytics data with robust error handling
  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch both analytics and dashboard stats in parallel
      const [analyticsResponse, statsResponse] = await Promise.allSettled([
        fetch(`/api/analytics/overview?period=${timeRange}`),
        fetch('/api/admin/stats')
      ]);
      
      // Process analytics data with explicit status checking
      if (analyticsResponse.status === 'fulfilled') {
        const response = analyticsResponse.value;
        
        if (!response.ok) {
          throw new Error(
            `Analytics API error: HTTP ${response.status} ${response.statusText || 'Unknown error'}`
          );
        }
        
        const data = await response.json();
        setAnalyticsData(data);
        
        // Check data source
        setDataSource(data.source || 'unknown');
        setIsMockData(data.isFallback === true);
      } else {
        // Network error or fetch rejection
        throw new Error(
          analyticsResponse.reason?.message || 'Network error: Failed to reach analytics API'
        );
      }
      
      // Process dashboard stats (optional - don't block on failure)
      if (statsResponse.status === 'fulfilled' && statsResponse.value.ok) {
        try {
          const stats = await statsResponse.value.json();
          setDashboardStats(stats);
        } catch (jsonError) {
          console.warn('Failed to parse dashboard stats JSON:', jsonError);
        }
      } else if (statsResponse.status === 'rejected') {
        console.warn('Dashboard stats fetch failed:', statsResponse.reason);
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to load analytics data. Please try again.';
      setError(errorMessage);
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts or timeRange changes
  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session || !["ADMIN", "EDITOR", "AUTHOR"].includes((session.user as any)?.role)) {
    router.push("/login");
    return null;
  }

  const getMetricData = () => {
    switch (selectedMetric) {
      case 'sessions':
        return { key: 'value', color: '#059669', label: 'Sessions' };
      case 'visitors':
        return { key: 'value', color: '#7c3aed', label: 'Unique Visitors' };
      case 'pageviews':
        return { key: 'value', color: '#dc2626', label: 'Page Views' };
      default:
        return { key: 'value', color: '#059669', label: 'Sessions' };
    }
  };

  const metricData = getMetricData();

  // Format time series data for charts
  // Use REAL data only from the time series
  const chartData = analyticsData.timeSeriesData.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: item.value,
    views: item.value, // Real pageviews
    visitors: item.value, // Real visitors (same as value in our current tracking)
  }));

  // Format device data for display
  const formattedDeviceData = analyticsData.deviceData.map(item => ({
    device: item.device,
    users: item.percentage,
    color: item.device === 'desktop' ? '#3b82f6' : 
           item.device === 'mobile' ? '#10b981' : '#f59e0b'
  }));

  // Format traffic sources data
  const trafficSourcesData = analyticsData.topReferrers.map((referrer, index) => ({
    name: referrer.source,
    value: Math.round((referrer.visitors / (analyticsData.overview?.visitors || 1)) * 100),
    color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][index % 4]
  }));

  return (
    <div className="space-y-6">
      {/* Data Source Notice */}
      {dataSource !== 'google-analytics' && (
        <div className={`border rounded-lg p-4 ${
          dataSource === 'database' 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
        }`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className={`h-5 w-5 ${dataSource === 'database' ? 'text-green-400' : 'text-blue-400'}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${
                dataSource === 'database' 
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-blue-800 dark:text-blue-200'
              }`}>
                {dataSource === 'database' 
                  ? 'Real Database Analytics' 
                  : dataSource === 'google-analytics'
                  ? 'Google Analytics (Real Data)'
                  : 'Loading...'
                }
              </h3>
              <div className={`mt-2 text-sm ${
                dataSource === 'database' 
                  ? 'text-green-700 dark:text-green-300'
                  : 'text-blue-700 dark:text-blue-300'
              }`}>
                {dataSource === 'database' ? (
                  <p>
                    You&apos;re viewing analytics based on your article views and database metrics. 
                    For more detailed insights, configure Google Analytics with:
                    <code className="ml-1 px-1 py-0.5 bg-green-100 dark:bg-green-800 rounded text-xs">
                      GOOGLE_ANALYTICS_PROPERTY_ID
                    </code>
                    <code className="ml-1 px-1 py-0.5 bg-green-100 dark:bg-green-800 rounded text-xs">
                      GOOGLE_ANALYTICS_ACCESS_TOKEN
                    </code>
                  </p>
                ) : (
                  <p>
                    You&apos;re currently viewing demo analytics data. To see real data, configure Google Analytics by setting up the required environment variables:
                    <code className="ml-1 px-1 py-0.5 bg-blue-100 dark:bg-blue-800 rounded text-xs">
                      GOOGLE_ANALYTICS_PROPERTY_ID
                    </code>
                    <code className="ml-1 px-1 py-0.5 bg-blue-100 dark:bg-blue-800 rounded text-xs">
                      GOOGLE_ANALYTICS_ACCESS_TOKEN
                    </code>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Success Notice for Real GA Data */}
      {dataSource === 'google-analytics' && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                Connected to Google Analytics
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                You&apos;re viewing real-time data from your Google Analytics account.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Performance Overview */}
      {dashboardStats && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Performance Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Views */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Views</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {dashboardStats.totalViews.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {dashboardStats.viewsChange !== 0 ? `${dashboardStats.viewsChange > 0 ? '+' : ''}${dashboardStats.viewsChange}% from last month` : 'Real-time data'}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            {/* Unique Visitors */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Unique Visitors</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {dashboardStats.uniqueVisitors.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {dashboardStats.articlesChange !== 0 ? `${dashboardStats.articlesChange > 0 ? '+' : ''}${dashboardStats.articlesChange}% from last month` : 'Real-time data'}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            {/* Published Articles */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Published Articles</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {dashboardStats.publishedArticles}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {dashboardStats.articlesChange > 0 ? '+' : ''}{dashboardStats.articlesChange} this month
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>

            {/* Average Time on Page */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg. Time on Page</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {dashboardStats.avgTimeOnPage}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Real-time data
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </div>

            {/* Social Shares */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Social Shares</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {dashboardStats.socialShares.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Real-time data
                  </p>
                </div>
                <div className="p-3 bg-pink-100 dark:bg-pink-900/20 rounded-lg">
                  <Share2 className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                </div>
              </div>
            </div>

            {/* Bounce Rate */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Bounce Rate</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {dashboardStats.bounceRate}%
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Real-time data
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Analytics</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Track your blog performance and audience insights
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            <option value="7d">Last 7 days</option>
            <option value="14d">Last 14 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Page Views</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {loading ? '...' : analyticsData.overview?.pageviews.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                {dataSource === 'google-analytics' ? 'Real-time data' : dataSource === 'database' ? 'Database metrics' : 'Demo data'}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Eye className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Unique Visitors</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {loading ? '...' : analyticsData.overview?.visitors.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                {dataSource === 'google-analytics' ? 'Real-time data' : dataSource === 'database' ? 'Database metrics' : 'Demo data'}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Sessions</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {loading ? '...' : analyticsData.overview?.sessions.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                {dataSource === 'google-analytics' ? 'Real-time data' : dataSource === 'database' ? 'Database metrics' : 'Demo data'}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Bounce Rate</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {loading ? '...' : `${analyticsData.overview?.bounce_rate.toFixed(1) || '0'}%`}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                <TrendingDown className="h-4 w-4 mr-1" />
                {dataSource === 'google-analytics' ? 'Real-time data' : dataSource === 'database' ? 'Database metrics' : 'Demo data'}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <TrendingDown className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Performance Overview
          </h2>
          <div className="flex items-center space-x-2">
            {[
              { key: 'sessions', label: 'Sessions' },
              { key: 'visitors', label: 'Unique Visitors' },
              { key: 'pageviews', label: 'Page Views' }
            ].map((metric) => (
              <button
                key={metric.key}
                onClick={() => setSelectedMetric(metric.key)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  selectedMetric === metric.key
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {metric.label}
              </button>
            ))}
          </div>
        </div>
        <div className="h-80">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-slate-500 dark:text-slate-400">Loading chart data...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-red-500">Error loading chart data: {error}</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.length > 0 ? chartData : pageViewsData}>
              <defs>
                <linearGradient id={`gradient-${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={metricData.color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={metricData.color} stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => 
                  selectedMetric === 'bounceRate' ? `${value}%` : value.toLocaleString()
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ color: '#374151' }}
                formatter={(value: any) => [
                  selectedMetric === 'bounceRate' ? `${value}%` : value.toLocaleString(),
                  metricData.label
                ]}
              />
              <Area
                type="monotone"
                dataKey={metricData.key}
                stroke={metricData.color}
                strokeWidth={3}
                fill={`url(#gradient-${selectedMetric})`}
                dot={{ fill: metricData.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: metricData.color, strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
            Top Performing Pages
          </h2>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center text-slate-500 dark:text-slate-400 py-4">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-4">Error loading data</div>
            ) : analyticsData.topPages.length > 0 ? (
              analyticsData.topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {page.page}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-slate-500 dark:text-slate-500">
                      <span>{page.pageviews.toLocaleString()} views</span>
                      <span>{page.visitors.toLocaleString()} visitors</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-slate-400 dark:text-slate-600">
                    #{index + 1}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-500 dark:text-slate-400 py-4">No data available</div>
            )}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
            Traffic Sources
          </h2>
          <div className="h-64">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-slate-500 dark:text-slate-400">Loading...</div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-red-500">Error loading data</div>
              </div>
            ) : trafficSourcesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trafficSourcesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {trafficSourcesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${value}%`, 'Traffic']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-slate-500 dark:text-slate-400">No data available</div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {trafficSourcesData.map((source, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: source.color }}
                />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {source.name}: {source.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Device Analytics */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
          Device Analytics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center text-slate-500 dark:text-slate-400 py-8">Loading...</div>
          ) : error ? (
            <div className="col-span-full text-center text-red-500 py-8">Error loading data</div>
          ) : formattedDeviceData.length > 0 ? (
            formattedDeviceData.map((device, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-4">
                  {device.device === 'desktop' && <Monitor className="h-8 w-8 text-blue-600 dark:text-blue-400" />}
                  {device.device === 'mobile' && <Smartphone className="h-8 w-8 text-green-600 dark:text-green-400" />}
                  {device.device === 'tablet' && <Globe className="h-8 w-8 text-orange-600 dark:text-orange-400" />}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 capitalize">
                  {device.device}
                </h3>
                <p className="text-3xl font-bold text-slate-600 dark:text-slate-400">
                  {device.users}%
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-slate-500 dark:text-slate-400 py-8">No data available</div>
          )}
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Engagement Metrics
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">New Users</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {loading ? '...' : analyticsData.overview?.newUsers.toLocaleString() || '0'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">Avg. Session Duration</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {loading ? '...' : analyticsData.overview?.visit_duration ? 
                  `${Math.round(analyticsData.overview.visit_duration / 60)}m ${Math.round(analyticsData.overview.visit_duration % 60)}s` : 
                  '0m 0s'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">Bounce Rate</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {loading ? '...' : `${analyticsData.overview?.bounce_rate.toFixed(1) || '0'}%`}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Traffic Overview
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">Total Sessions</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {loading ? '...' : analyticsData.overview?.sessions.toLocaleString() || '0'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">Unique Visitors</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {loading ? '...' : analyticsData.overview?.visitors.toLocaleString() || '0'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">Page Views</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {loading ? '...' : analyticsData.overview?.pageviews.toLocaleString() || '0'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
