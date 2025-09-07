'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Image, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Download,
  RefreshCw
} from 'lucide-react';
import { performanceMonitor } from '@/lib/performance-monitor';

interface PerformanceDashboardProps {
  className?: string;
}

export function PerformanceDashboard({ className = '' }: PerformanceDashboardProps) {
  const [performanceData, setPerformanceData] = useState(performanceMonitor.getPerformanceSummary());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPerformanceData(performanceMonitor.getPerformanceSummary());
    setIsRefreshing(false);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(performanceData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `performance-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 70) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Dashboard</h2>
          <p className="text-muted-foreground">Monitor image loading and Core Web Vitals</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportData}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Core Web Vitals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Core Web Vitals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {performanceData.coreWebVitals.lcp ? `${Math.round(performanceData.coreWebVitals.lcp)}ms` : 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">LCP</div>
              <div className="text-xs text-muted-foreground">Largest Contentful Paint</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {performanceData.coreWebVitals.fid ? `${Math.round(performanceData.coreWebVitals.fid)}ms` : 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">FID</div>
              <div className="text-xs text-muted-foreground">First Input Delay</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {performanceData.coreWebVitals.cls ? performanceData.coreWebVitals.cls.toFixed(3) : 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">CLS</div>
              <div className="text-xs text-muted-foreground">Cumulative Layout Shift</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {performanceData.coreWebVitals.fcp ? `${Math.round(performanceData.coreWebVitals.fcp)}ms` : 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">FCP</div>
              <div className="text-xs text-muted-foreground">First Contentful Paint</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {performanceData.coreWebVitals.ttfb ? `${Math.round(performanceData.coreWebVitals.ttfb)}ms` : 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">TTFB</div>
              <div className="text-xs text-muted-foreground">Time to First Byte</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            Image Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {performanceData.imageMetrics.averageLoadTime}ms
              </div>
              <div className="text-sm text-muted-foreground">Average Load Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {performanceData.totalImages}
              </div>
              <div className="text-sm text-muted-foreground">Total Images</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {performanceData.imageMetrics.errorRate}%
              </div>
              <div className="text-sm text-muted-foreground">Error Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {Math.round(performanceData.imageMetrics.totalSize / 1024)}KB
              </div>
              <div className="text-sm text-muted-foreground">Total Size</div>
            </div>
          </div>

          {/* Format Distribution */}
          {Object.keys(performanceData.imageMetrics.formatDistribution).length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">Image Format Distribution</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(performanceData.imageMetrics.formatDistribution).map(([format, count]) => (
                  <Badge key={format} variant="outline">
                    {format.toUpperCase()}: {count}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Slowest Image */}
          {performanceData.imageMetrics.slowestImage && performanceData.imageMetrics.slowestImage.loadTime > 0 && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Slowest Image</span>
              </div>
              <div className="text-sm text-yellow-700">
                <div className="font-mono text-xs break-all mb-1">
                  {performanceData.imageMetrics.slowestImage.url}
                </div>
                <div>Load time: {performanceData.imageMetrics.slowestImage.loadTime}ms</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Overall Performance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold mb-2">
                {Math.round((100 - performanceData.imageMetrics.errorRate) * 0.8 + 20)}
              </div>
              <div className="text-muted-foreground">Based on error rate and load times</div>
            </div>
            <div className="text-right">
              {getScoreBadge(Math.round((100 - performanceData.imageMetrics.errorRate) * 0.8 + 20))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {performanceData.imageMetrics.averageLoadTime > 1000 && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-800">Optimize Image Loading</div>
                  <div className="text-sm text-blue-700">
                    Average load time is {performanceData.imageMetrics.averageLoadTime}ms. Consider using WebP format or reducing image sizes.
                  </div>
                </div>
              </div>
            )}
            
            {performanceData.imageMetrics.errorRate > 5 && (
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <div className="font-medium text-red-800">High Error Rate</div>
                  <div className="text-sm text-red-700">
                    {performanceData.imageMetrics.errorRate}% of images failed to load. Check image URLs and network connectivity.
                  </div>
                </div>
              </div>
            )}

            {performanceData.imageMetrics.totalSize > 5 * 1024 * 1024 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Image className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <div className="font-medium text-yellow-800">Large Total Size</div>
                  <div className="text-sm text-yellow-700">
                    Total image size is {Math.round(performanceData.imageMetrics.totalSize / 1024 / 1024)}MB. Consider lazy loading and image optimization.
                  </div>
                </div>
              </div>
            )}

            {performanceData.imageMetrics.averageLoadTime <= 500 && performanceData.imageMetrics.errorRate <= 2 && (
              <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-medium text-green-800">Excellent Performance</div>
                  <div className="text-sm text-green-700">
                    Your images are loading quickly with minimal errors. Keep up the good work!
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
