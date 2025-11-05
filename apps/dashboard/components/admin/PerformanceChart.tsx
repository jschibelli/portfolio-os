"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Loader2 } from "lucide-react";

interface ChartData {
  date: string;
  views: number;
  visitors: number;
}

export function PerformanceChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        
        // Fetch REAL data only from analytics API
        const response = await fetch('/api/analytics/overview?period=7d');
        
        if (response.ok) {
          const analyticsData = await response.json();
          
          console.log('📊 Analytics Data Received:', analyticsData);
          console.log('📊 Time Series Data:', analyticsData.timeSeriesData);
          
          // Use real time series data if available
          if (analyticsData.timeSeriesData && analyticsData.timeSeriesData.length > 0) {
            const chartData = analyticsData.timeSeriesData.map((item: any, index: number) => {
              const itemDate = new Date(item.date);
              const formattedDate = itemDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              });
              
              console.log(`📅 Day ${index + 1}:`, {
                rawDate: item.date,
                formattedDate,
                value: item.value
              });
              
              return {
                date: formattedDate,
                views: item.value || 0,
                visitors: item.value || 0, // Use same value for visitors (real data)
              };
            });
            
            console.log('📊 Chart Data Array Length:', chartData.length);
            console.log('📊 Chart Data:', chartData);
            setData(chartData);
          } else {
            // NO MOCK DATA - Show empty chart with zeros
            console.warn('⚠️ No time series data available, generating empty data');
            setData(generateEmptyData());
          }
        } else {
          // Show empty data if API fails - NO MOCK DATA
          console.error('❌ API Response not OK:', response.status);
          setData(generateEmptyData());
          setError('Unable to load analytics data');
        }
      } catch (err) {
        console.error('❌ Error fetching chart data:', err);
        // Show empty data on error - NO MOCK DATA
        setData(generateEmptyData());
        setError('Failed to fetch analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  // Generate empty data structure with zeros - NO MOCK DATA
  const generateEmptyData = (): ChartData[] => {
    const data: ChartData[] = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        views: 0,
        visitors: 0,
      });
    }
    
    return data;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  // Show chart even if there's an error, but with zero data
  // This makes it clear there's no data rather than hiding the chart
  const hasData = data.some(d => d.views > 0 || d.visitors > 0);
  
  console.log('📊 Chart Rendering - Data Points:', data.length);
  console.log('📊 Has Data:', hasData);
  
  return (
    <div className="h-64">
      {error && (
        <div className="mb-2 text-xs text-amber-600 dark:text-amber-400">
          {error} - Showing empty chart
        </div>
      )}
      {!hasData && !loading && (
        <div className="mb-2 text-xs text-slate-500 dark:text-slate-400">
          No analytics data available yet - Showing {data.length} days with 0 values
        </div>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-slate-700" />
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
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            labelStyle={{ color: '#374151' }}
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
          />
          <Area
            type="monotone"
            dataKey="views"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#colorViews)"
            name="Views"
          />
          <Area
            type="monotone"
            dataKey="visitors"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#colorVisitors)"
            name="Visitors"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}






