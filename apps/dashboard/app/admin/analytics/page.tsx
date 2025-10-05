"use client";

import { useState, useEffect, useCallback } from "react";
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

// Mock data fallback
const pageViewsData = [
  { date: "Jan 1", views: 1200, visitors: 800, bounceRate: 42 },
  { date: "Jan 2", views: 1350, visitors: 920, bounceRate: 38 },
  { date: "Jan 3", views: 1100, visitors: 750, bounceRate: 45 },
  { date: "Jan 4", views: 1600, visitors: 1100, bounceRate: 35 },
  { date: "Jan 5", views: 1400, visitors: 950, bounceRate: 40 },
  { date: "Jan 6", views: 1800, visitors: 1250, bounceRate: 32 },
  { date: "Jan 7", views: 2000, visitors: 1400, bounceRate: 30 },
  { date: "Jan 8", views: 1750, visitors: 1200, bounceRate: 35 },
  { date: "Jan 9", views: 1900, visitors: 1300, bounceRate: 33 },
  { date: "Jan 10", views: 2200, visitors: 1500, bounceRate: 28 },
  { date: "Jan 11", views: 2100, visitors: 1450, bounceRate: 31 },
  { date: "Jan 12", views: 2400, visitors: 1650, bounceRate: 27 },
  { date: "Jan 13", views: 2300, visitors: 1600, bounceRate: 29 },
  { date: "Jan 14", views: 2600, visitors: 1800, bounceRate: 25 },
];

// Mock data for future analytics features - will be used when analytics are implemented
// const topArticlesData = [
//   { title: "Getting Started with Blog Management", views: 1250, engagement: 78, readTime: 8 },
//   { title: "Case Study: Hybrid Development Approach", views: 890, engagement: 82, readTime: 15 },
//   { title: "Advanced SEO Strategies for 2025", views: 650, engagement: 75, readTime: 12 },
//   { title: "Tendril Multi-Tenant Chatbot SaaS", views: 520, engagement: 88, readTime: 20 },
//   { title: "Building Scalable Web Applications", views: 480, engagement: 71, readTime: 10 },
// ];

// const trafficSourcesData = [
//   { name: "Direct", value: 45, color: "#3b82f6" },
//   { name: "Organic Search", value: 30, color: "#10b981" },
//   { name: "Social Media", value: 15, color: "#f59e0b" },
//   { name: "Referral", value: 10, color: "#8b5cf6" },
// ];

// const deviceData = [
//   { device: "Desktop", users: 65, color: "#3b82f6" },
//   { device: "Mobile", users: 30, color: "#10b981" },
//   { device: "Tablet", users: 5, color: "#f59e0b" },
// ];

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

  // Fetch dashboard stats (for future implementation)
  // const fetchDashboardStats = async () => {
  //   try {
  //     const response = await fetch('/api/admin/stats');
  //     if (response.ok) {
  //       const stats = await response.json();
  //       setDashboardStats(stats);
  //     }
  //   } catch (err) {
  //     setError('Failed to fetch dashboard stats');
  //   }
  // };

  // Fetch analytics data
  const fetchAnalyticsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch both analytics and dashboard stats in parallel
      const [analyticsResponse, statsResponse] = await Promise.allSettled([
        fetch(`/api/analytics/overview?period=${timeRange}`),
        fetch('/api/admin/stats')
      ]);
      
      // Process analytics data
      if (analyticsResponse.status === 'fulfilled' && analyticsResponse.value.ok) {
        const data = await analyticsResponse.value.json();
        setAnalyticsData(data);
        
        // Check if we're using mock data by looking for specific mock values
        setIsMockData(data.overview?.visitors === 1250 && data.overview?.pageviews === 3200);
      } else {
        throw new Error('Failed to fetch analytics data');
      }
      
      // Process dashboard stats
      if (statsResponse.status === 'fulfilled' && statsResponse.value.ok) {
        const stats = await statsResponse.value.json();
        setDashboardStats(stats);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  // Load data when component mounts or timeRange changes
  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session || !["ADMIN", "EDITOR", "AUTHOR"].includes((session.user as { role?: string })?.role || "")) {
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
  const chartData = analyticsData.timeSeriesData.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: item.value,
    // Add mock data for other metrics if needed
    views: item.value * 1.5, // Approximate pageviews
    visitors: item.value * 0.8, // Approximate visitors
    bounceRate: 35 + Math.random() * 20, // Mock bounce rate
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
      {/* Mock Data Notice */}
      {isMockData && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Demo Mode - Mock Data
              </h3>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                <p>
                  You&apos;re currently viewing mock analytics data. To see real data, configure Google Analytics by setting up the required environment variables:
                  <code className="ml-1 px-1 py-0.5 bg-blue-100 dark:bg-blue-800 rounded text-xs">
                    GOOGLE_ANALYTICS_PROPERTY_ID
                  </code>
                  <code className="ml-1 px-1 py-0.5 bg-blue-100 dark:bg-blue-800 rounded text-xs">
                    GOOGLE_ANALYTICS_CLIENT_EMAIL
                  </code>
                  <code className="ml-1 px-1 py-0.5 bg-blue-100 dark:bg-blue-800 rounded text-xs">
                    GOOGLE_ANALYTICS_PRIVATE_KEY
                  </code>
                </p>
                <p className="mt-1">
                  <Link href="/docs/analytics-seo/google-analytics-setup" className="underline hover:no-underline">
                    View setup guide →
                  </Link>
                </p>
              </div>
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
                    {dashboardStats.viewsChange > 0 ? '+' : ''}{dashboardStats.viewsChange}% from last month
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
                    {Math.round(dashboardStats.viewsChange * 0.8) > 0 ? '+' : ''}{Math.round(dashboardStats.viewsChange * 0.8)}% from last month
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
                    +18s from last month
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
                    +23% from last month
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
                    -5% from last month
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
                {isMockData ? 'Demo data' : 'Real-time data'}
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
                {isMockData ? 'Demo data' : 'Real-time data'}
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
                {isMockData ? 'Demo data' : 'Real-time data'}
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
                {isMockData ? 'Demo data' : 'Real-time data'}
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
                formatter={(value: number) => [
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
                    formatter={(value: number) => [`${value}%`, 'Traffic']}
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
