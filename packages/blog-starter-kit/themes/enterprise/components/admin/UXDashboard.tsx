'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Accessibility,
  Gauge,
  Users,
  Monitor
} from 'lucide-react';

interface UXMetrics {
  accessibility: {
    score: number;
    violations: number;
    warnings: number;
    passes: number;
  };
  performance: {
    lcp: number;
    fid: number;
    cls: number;
    fcp: number;
    loadTime: number;
  };
  combined: {
    uxScore: number;
    userSatisfaction: number;
  };
  trends: {
    accessibility: 'up' | 'down' | 'stable';
    performance: 'up' | 'down' | 'stable';
    ux: 'up' | 'down' | 'stable';
  };
}

interface UXDashboardProps {
  className?: string;
}

export function UXDashboard({ className }: UXDashboardProps) {
  const [metrics, setMetrics] = useState<UXMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    loadUXMetrics();
    const interval = setInterval(loadUXMetrics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadUXMetrics = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/analytics/ux-metrics');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Failed to load UX metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (score: number, threshold: number) => {
    if (score >= threshold) return 'text-green-600';
    if (score >= threshold * 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (score: number, threshold: number) => {
    if (score >= threshold) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (score >= threshold * 0.8) return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Monitor className="h-4 w-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load UX metrics. Please check your connection and try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accessibility Score</CardTitle>
            <Accessibility className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getStatusIcon(metrics.accessibility.score, 90)}
              <span className={`text-2xl font-bold ${getStatusColor(metrics.accessibility.score, 90)}`}>
                {metrics.accessibility.score}%
              </span>
              {getTrendIcon(metrics.trends.accessibility)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.accessibility.violations} violations, {metrics.accessibility.warnings} warnings
            </p>
            <Progress 
              value={metrics.accessibility.score} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getStatusIcon(metrics.performance.lcp, 2500)}
              <span className={`text-2xl font-bold ${getStatusColor(metrics.performance.lcp, 2500)}`}>
                {Math.round(metrics.performance.lcp)}ms
              </span>
              {getTrendIcon(metrics.trends.performance)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              LCP: {Math.round(metrics.performance.lcp)}ms, CLS: {metrics.performance.cls.toFixed(3)}
            </p>
            <Progress 
              value={Math.max(0, 100 - (metrics.performance.lcp / 25))} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Combined UX Score</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getStatusIcon(metrics.combined.uxScore, 85)}
              <span className={`text-2xl font-bold ${getStatusColor(metrics.combined.uxScore, 85)}`}>
                {metrics.combined.uxScore}%
              </span>
              {getTrendIcon(metrics.trends.ux)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              User satisfaction: {metrics.combined.userSatisfaction}%
            </p>
            <Progress 
              value={metrics.combined.uxScore} 
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <Tabs defaultValue="accessibility" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="accessibility" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Accessibility Breakdown</CardTitle>
                <CardDescription>Detailed accessibility metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Passes</span>
                  <Badge variant="secondary">{metrics.accessibility.passes}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Violations</span>
                  <Badge variant={metrics.accessibility.violations > 0 ? "destructive" : "secondary"}>
                    {metrics.accessibility.violations}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Warnings</span>
                  <Badge variant={metrics.accessibility.warnings > 5 ? "destructive" : "secondary"}>
                    {metrics.accessibility.warnings}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accessibility Trends</CardTitle>
                <CardDescription>Recent accessibility performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Score Trend</span>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(metrics.trends.accessibility)}
                      <span className="text-sm capitalize">{metrics.trends.accessibility}</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {metrics.trends.accessibility === 'up' && 'Accessibility is improving'}
                    {metrics.trends.accessibility === 'down' && 'Accessibility needs attention'}
                    {metrics.trends.accessibility === 'stable' && 'Accessibility is stable'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Core Web Vitals</CardTitle>
                <CardDescription>Performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>LCP</span>
                  <Badge variant={metrics.performance.lcp > 2500 ? "destructive" : "secondary"}>
                    {Math.round(metrics.performance.lcp)}ms
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>FID</span>
                  <Badge variant={metrics.performance.fid > 100 ? "destructive" : "secondary"}>
                    {Math.round(metrics.performance.fid)}ms
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>CLS</span>
                  <Badge variant={metrics.performance.cls > 0.1 ? "destructive" : "secondary"}>
                    {metrics.performance.cls.toFixed(3)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>FCP</span>
                  <Badge variant={metrics.performance.fcp > 1800 ? "destructive" : "secondary"}>
                    {Math.round(metrics.performance.fcp)}ms
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Recent performance changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Performance Trend</span>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(metrics.trends.performance)}
                      <span className="text-sm capitalize">{metrics.trends.performance}</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {metrics.trends.performance === 'up' && 'Performance is improving'}
                    {metrics.trends.performance === 'down' && 'Performance needs optimization'}
                    {metrics.trends.performance === 'stable' && 'Performance is stable'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>UX Trends Overview</CardTitle>
              <CardDescription>Combined user experience metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <Accessibility className="h-4 w-4" />
                    <span className="text-sm font-medium">Accessibility</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    {getTrendIcon(metrics.trends.accessibility)}
                    <span className="text-sm capitalize">{metrics.trends.accessibility}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <Gauge className="h-4 w-4" />
                    <span className="text-sm font-medium">Performance</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    {getTrendIcon(metrics.trends.performance)}
                    <span className="text-sm capitalize">{metrics.trends.performance}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">Overall UX</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    {getTrendIcon(metrics.trends.ux)}
                    <span className="text-sm capitalize">{metrics.trends.ux}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Last Updated */}
      {lastUpdated && (
        <div className="text-sm text-muted-foreground text-center">
          Last updated: {lastUpdated.toLocaleString()}
        </div>
      )}
    </div>
  );
}
