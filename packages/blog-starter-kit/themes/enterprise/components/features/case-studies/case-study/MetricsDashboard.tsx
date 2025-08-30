import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { TrendingUp, TrendingDown, Minus, DollarSign, Users, Clock, Target, Zap } from 'lucide-react';

interface MetricCardProps {
  value: string;
  label: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  color?: 'green' | 'blue' | 'purple' | 'orange' | 'red';
  description?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  value, 
  label, 
  trend, 
  trendDirection = 'neutral',
  icon,
  color = 'blue',
  description 
}) => {
  const colorClasses = {
    green: 'text-green-600 bg-green-50 dark:bg-green-950',
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-950',
    purple: 'text-purple-600 bg-purple-50 dark:bg-purple-950',
    orange: 'text-orange-600 bg-orange-50 dark:bg-orange-950',
    red: 'text-red-600 bg-red-50 dark:bg-red-950'
  };

  const trendIcons = {
    up: <TrendingUp className="h-4 w-4 text-green-600" />,
    down: <TrendingDown className="h-4 w-4 text-red-600" />,
    neutral: <Minus className="h-4 w-4 text-gray-600" />
  };

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            {icon && (
              <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                {icon}
              </div>
            )}
            {trend && (
              <div className={`flex items-center gap-1 text-sm font-medium ${trendColors[trendDirection]}`}>
                {trendIcons[trendDirection]}
                {trend}
              </div>
            )}
          </div>
          
          <div className="mb-2">
            <div className="text-3xl font-bold text-foreground mb-1">
              {value}
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              {label}
            </div>
          </div>
          
          {description && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface MetricsDashboardProps {
  title?: string;
  metrics: MetricCardProps[];
  columns?: 2 | 3 | 4;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({ 
  title = "Key Metrics", 
  metrics, 
  columns = 4 
}) => {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className="my-12">
      {title && (
        <h2 className="text-2xl font-bold mb-8 text-center">{title}</h2>
      )}
      <div className={`grid ${gridCols[columns]} gap-6`}>
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
    </div>
  );
};
