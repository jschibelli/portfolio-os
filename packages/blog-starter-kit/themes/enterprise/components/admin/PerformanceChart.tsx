"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { adminDataService, AdminAnalytics } from "../../lib/admin-data-service";

export function PerformanceChart() {
  const [metric, setMetric] = useState<'views' | 'visitors' | 'bounceRate'>('views');
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const analyticsData = await adminDataService.getAnalytics();
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Failed to load analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          {['Page Views', 'Unique Visitors', 'Engagement Rate'].map((label) => (
            <div key={label} className="h-8 w-24 bg-stone-200 dark:bg-stone-700 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="h-80 bg-stone-200 dark:bg-stone-700 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-8">
        <p className="text-stone-500 dark:text-stone-400">Failed to load analytics data</p>
      </div>
    );
  }

  const getMetricData = () => {
    switch (metric) {
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
    <div className="space-y-4">
      {/* Metric Selector */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setMetric('views')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            metric === 'views'
              ? 'bg-stone-100 dark:bg-stone-700 text-stone-900 dark:text-stone-100'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
        >
          Page Views
        </button>
        <button
          onClick={() => setMetric('visitors')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            metric === 'visitors'
              ? 'bg-stone-100 dark:bg-stone-700 text-stone-900 dark:text-stone-100'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
        >
          Unique Visitors
        </button>
        <button
          onClick={() => setMetric('bounceRate')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            metric === 'bounceRate'
              ? 'bg-stone-100 dark:bg-stone-700 text-stone-900 dark:text-stone-100'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
        >
          Bounce Rate
        </button>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={analytics.pageViewsData}>
            <defs>
              <linearGradient id={`gradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
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
                metric === 'bounceRate' ? `${value}%` : value.toLocaleString()
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
                metric === 'bounceRate' ? `${value}%` : value.toLocaleString(),
                metricData.label
              ]}
            />
            <Area
              type="monotone"
              dataKey={metricData.key}
              stroke={metricData.color}
              strokeWidth={3}
              fill={`url(#gradient-${metric})`}
              dot={{ fill: metricData.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: metricData.color, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-700">
        <div>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            {metricData.label} this period
          </p>
          <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            {metric === 'bounceRate' 
              ? `${analytics.pageViewsData[analytics.pageViewsData.length - 1][metric]}%`
              : analytics.pageViewsData[analytics.pageViewsData.length - 1][metric].toLocaleString()
            }
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-stone-600 dark:text-stone-400">Change from start</p>
          <p className="text-lg font-semibold text-green-600 dark:text-green-400">
            +{metric === 'bounceRate' 
              ? `${((analytics.pageViewsData[analytics.pageViewsData.length - 1][metric] - analytics.pageViewsData[0][metric]) / analytics.pageViewsData[0][metric] * 100).toFixed(1)}%`
              : `${((analytics.pageViewsData[analytics.pageViewsData.length - 1][metric] - analytics.pageViewsData[0][metric]) / analytics.pageViewsData[0][metric] * 100).toFixed(1)}%`
            }
          </p>
        </div>
      </div>
    </div>
  );
}
