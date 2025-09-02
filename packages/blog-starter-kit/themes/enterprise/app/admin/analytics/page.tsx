"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
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
  Calendar,
  Download
} from "lucide-react";

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

const topArticlesData = [
  { title: "Getting Started with Blog Management", views: 1250, engagement: 78, readTime: 8 },
  { title: "Case Study: Hybrid Development Approach", views: 890, engagement: 82, readTime: 15 },
  { title: "Advanced SEO Strategies for 2025", views: 650, engagement: 75, readTime: 12 },
  { title: "Tendril Multi-Tenant Chatbot SaaS", views: 520, engagement: 88, readTime: 20 },
  { title: "Building Scalable Web Applications", views: 480, engagement: 71, readTime: 10 },
];

const trafficSourcesData = [
  { name: "Direct", value: 45, color: "#3b82f6" },
  { name: "Organic Search", value: 30, color: "#10b981" },
  { name: "Social Media", value: 15, color: "#f59e0b" },
  { name: "Referral", value: 10, color: "#8b5cf6" },
];

const deviceData = [
  { device: "Desktop", users: 65, color: "#3b82f6" },
  { device: "Mobile", users: 30, color: "#10b981" },
  { device: "Tablet", users: 5, color: "#f59e0b" },
];

export default function AdminAnalytics() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [timeRange, setTimeRange] = useState('14d');
  const [selectedMetric, setSelectedMetric] = useState('views');

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
      case 'views':
        return { key: 'views', color: '#059669', label: 'Page Views' };
      case 'visitors':
        return { key: 'visitors', color: '#7c3aed', label: 'Unique Visitors' };
      case 'bounceRate':
        return { key: 'bounceRate', color: '#dc2626', label: 'Bounce Rate (%)' };
      default:
        return { key: 'views', color: '#059669', label: 'Page Views' };
    }
  };

  const metricData = getMetricData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Analytics</h1>
          <p className="text-stone-600 dark:text-stone-400 mt-2">
            Track your blog performance and audience insights
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-stone-200 dark:border-stone-700 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
          >
            <option value="7d">Last 7 days</option>
            <option value="14d">Last 14 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button className="px-4 py-2 bg-stone-600 text-white rounded-md hover:bg-stone-700 transition-colors flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stone-600 dark:text-stone-400">Total Views</p>
              <p className="text-3xl font-bold text-stone-900 dark:text-stone-100">24.5K</p>
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12.5% from last month
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Eye className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stone-600 dark:text-stone-400">Unique Visitors</p>
              <p className="text-3xl font-bold text-stone-900 dark:text-stone-100">8.2K</p>
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                +8.1% from last month
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stone-600 dark:text-stone-400">Avg. Time on Page</p>
              <p className="text-3xl font-bold text-stone-900 dark:text-stone-100">4m 32s</p>
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                +18s from last month
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stone-600 dark:text-stone-400">Bounce Rate</p>
              <p className="text-3xl font-bold text-stone-900 dark:text-stone-100">42%</p>
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                <TrendingDown className="h-4 w-4 mr-1" />
                -5% from last month
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <TrendingDown className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
            Performance Overview
          </h2>
          <div className="flex items-center space-x-2">
            {[
              { key: 'views', label: 'Page Views' },
              { key: 'visitors', label: 'Unique Visitors' },
              { key: 'bounceRate', label: 'Bounce Rate' }
            ].map((metric) => (
              <button
                key={metric.key}
                onClick={() => setSelectedMetric(metric.key)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  selectedMetric === metric.key
                    ? 'bg-stone-100 dark:bg-stone-700 text-stone-900 dark:text-stone-100'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                {metric.label}
              </button>
            ))}
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={pageViewsData}>
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
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Articles */}
        <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6">
          <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-6">
            Top Performing Articles
          </h2>
          <div className="space-y-4">
            {topArticlesData.map((article, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-stone-50 dark:bg-stone-700/50">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
                    {article.title}
                  </h3>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-stone-500 dark:text-stone-500">
                    <span>{article.views.toLocaleString()} views</span>
                    <span>{article.engagement}% engagement</span>
                    <span>{article.readTime}m read</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-stone-400 dark:text-stone-600">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6">
          <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-6">
            Traffic Sources
          </h2>
          <div className="h-64">
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
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {trafficSourcesData.map((source, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: source.color }}
                />
                <span className="text-sm text-stone-600 dark:text-stone-400">
                  {source.name}: {source.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Device Analytics */}
      <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6">
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-6">
          Device Analytics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deviceData.map((device, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center mb-4">
                {device.device === 'Desktop' && <Monitor className="h-8 w-8 text-blue-600 dark:text-blue-400" />}
                {device.device === 'Mobile' && <Smartphone className="h-8 w-8 text-green-600 dark:text-green-400" />}
                {device.device === 'Tablet' && <Globe className="h-8 w-8 text-orange-600 dark:text-orange-400" />}
              </div>
              <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
                {device.device}
              </h3>
              <p className="text-3xl font-bold text-stone-600 dark:text-stone-400">
                {device.users}%
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6">
          <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
            Engagement Metrics
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-stone-600 dark:text-stone-400">Social Shares</span>
              <span className="font-semibold text-stone-900 dark:text-stone-100">156</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-600 dark:text-stone-400">Comments</span>
              <span className="font-semibold text-stone-900 dark:text-stone-100">89</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-600 dark:text-stone-400">Newsletter Signups</span>
              <span className="font-semibold text-stone-900 dark:text-stone-100">234</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6">
          <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
            Growth Trends
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-stone-600 dark:text-stone-400">Monthly Growth</span>
              <span className="font-semibold text-green-600 dark:text-green-400">+15.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-600 dark:text-stone-400">Return Visitors</span>
              <span className="font-semibold text-stone-900 dark:text-stone-100">32%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-600 dark:text-stone-400">Avg. Session Duration</span>
              <span className="font-semibold text-stone-900 dark:text-stone-100">3m 45s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
