'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { TrendingUp, Users, Clock, DollarSign, Target, Lightbulb } from 'lucide-react';

interface Metric {
  title: string;
  value: string;
  description: string;
  trend: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

interface InlineMetricsProps {
  title: string;
  metrics: Metric[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case 'down':
      return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
    default:
      return <Target className="h-4 w-4 text-gray-500" />;
  }
};

const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
  switch (trend) {
    case 'up':
      return 'text-green-600';
    case 'down':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

export function InlineMetrics({ 
  title, 
  metrics, 
  columns = 3, 
  className = '' 
}: InlineMetricsProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`my-8 ${className}`}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`grid ${gridCols[columns]} gap-4`}>
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </span>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(metric.trend)}
                  </div>
                </div>
                <div className={`text-xl font-bold ${getTrendColor(metric.trend)}`}>
                  {metric.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {metric.description}
                </div>
                {metric.icon && (
                  <div className="mt-2 text-muted-foreground">
                    {metric.icon}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Enhanced metrics component for case studies
export function CaseStudyEnhancer({ 
  title, 
  metrics, 
  columns = 3, 
  className = '' 
}: InlineMetricsProps) {
  return <InlineMetrics title={title} metrics={metrics} columns={columns} className={className} />;
}