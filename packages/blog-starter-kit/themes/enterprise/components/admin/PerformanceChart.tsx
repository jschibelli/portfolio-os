"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

// Google Analytics data interfaces
interface TimeSeriesData {
  date: string;
  value: number;
}

interface AnalyticsData {
  timeSeriesData: TimeSeriesData[];
  overview: {
    visitors: number;
    pageviews: number;
    bounce_rate: number;
    visit_duration: number;
    sessions: number;
    newUsers: number;
  };
}

export function PerformanceChart() {
  const [metric, setMetric] = useState<'sessions' | 'visitors' | 'pageviews'>('sessions');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMockData, setIsMockData] = useState(false);

  const loadAnalytics = async (selectedMetric: string = 'sessions') => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/analytics/overview?period=7d&metric=${selectedMetric}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics({
          timeSeriesData: data.timeSeriesData || [],
          overview: data.overview
        });
        
        // Check if we're using mock data
        setIsMockData(data.overview?.visitors === 1250 && data.overview?.pageviews === 3200);
      }
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics(metric);
  }, [metric]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          {['Page Views', 'Unique Visitors', 'Engagement Rate'].map((label) => (
            <div key={label} className="h-8 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="h-80 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500 dark:text-slate-400">Failed to load analytics data</p>
      </div>
    );
  }

  const getMetricData = () => {
    switch (metric) {
      case 'sessions':
        return { key: 'value', color: '#059669', label: 'Sessions' };
      case 'visitors':
        return { key: 'value', color: '#7c3aed', label: 'Unique Visitors' };
      case 'pageviews':
        return { key: 'value', color: '#3b82f6', label: 'Page Views' };
      default:
        return { key: 'value', color: '#059669', label: 'Sessions' };
    }
  };

  const metricData = getMetricData();

  return (
    <div className="space-y-4">
      {/* Metric Selector */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => {
            setMetric('sessions');
            loadAnalytics('sessions');
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            metric === 'sessions'
              ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Sessions
        </button>
        <button
          onClick={() => {
            setMetric('visitors');
            loadAnalytics('visitors');
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            metric === 'visitors'
              ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Unique Visitors
        </button>
        <button
          onClick={() => {
            setMetric('pageviews');
            loadAnalytics('pageviews');
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            metric === 'pageviews'
              ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Page Views
        </button>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={analytics.timeSeriesData}>
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
              tickFormatter={(value) => value.toLocaleString()}
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
                value.toLocaleString(),
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
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {metricData.label} this period
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {analytics.timeSeriesData.length > 0 
              ? analytics.timeSeriesData[analytics.timeSeriesData.length - 1].value.toLocaleString()
              : '0'
            }
          </p>
          {isMockData && (
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Demo data
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-600 dark:text-slate-400">Total this period</p>
          <p className="text-lg font-semibold text-green-600 dark:text-green-400">
            {analytics.timeSeriesData.length > 0 
              ? analytics.timeSeriesData.reduce((sum, item) => sum + item.value, 0).toLocaleString()
              : '0'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
