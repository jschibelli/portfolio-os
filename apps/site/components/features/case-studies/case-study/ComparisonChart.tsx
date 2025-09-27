'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

interface ComparisonData {
  category: string;
  tendril: number;
  competitor: number;
  unit: string;
  better: 'tendril' | 'competitor';
  direction: 'higher' | 'lower';
}

interface ComparisonChartProps {
  title: string;
  data: ComparisonData[];
  tendrilLabel: string;
  competitorLabel: string;
  description?: string;
  className?: string;
}

export function ComparisonChart({ 
  title, 
  data, 
  tendrilLabel, 
  competitorLabel, 
  description,
  className = '' 
}: ComparisonChartProps) {
  const getBarColor = (better: 'tendril' | 'competitor') => {
    return better === 'tendril' ? 'bg-green-500' : 'bg-red-500';
  };

  const getBarColorMuted = (better: 'tendril' | 'competitor') => {
    return better === 'tendril' ? 'bg-green-200' : 'bg-red-200';
  };

  const getMaxValue = () => {
    return Math.max(...data.map(item => Math.max(item.tendril, item.competitor)));
  };

  const maxValue = getMaxValue();

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
            <CheckCircle className="h-5 w-5 text-blue-500" />
            {title}
          </CardTitle>
          {description && (
            <CardDescription>{description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {data.map((item, index) => {
              const tendrilPercentage = (item.tendril / maxValue) * 100;
              const competitorPercentage = (item.competitor / maxValue) * 100;
              const tendrilIsBetter = item.better === 'tendril';
              
              return (
                <motion.div
                  key={item.category}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.category}</span>
                    <div className="flex items-center gap-2">
                      {tendrilIsBetter ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Better
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          <XCircle className="h-3 w-3 mr-1" />
                          Needs Improvement
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {/* Tendril Bar */}
                    <div className="flex items-center gap-3">
                      <div className="w-20 text-sm font-medium text-green-700">
                        {tendrilLabel}
                      </div>
                      <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
                        <motion.div
                          className={`h-full ${getBarColor('tendril')} rounded-full flex items-center justify-end pr-2`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${tendrilPercentage}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                        >
                          <span className="text-xs font-medium text-white">
                            {item.tendril}{item.unit}
                          </span>
                        </motion.div>
                      </div>
                    </div>
                    
                    {/* Competitor Bar */}
                    <div className="flex items-center gap-3">
                      <div className="w-20 text-sm font-medium text-red-700">
                        {competitorLabel}
                      </div>
                      <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
                        <motion.div
                          className={`h-full ${getBarColor('competitor')} rounded-full flex items-center justify-end pr-2`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${competitorPercentage}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                        >
                          <span className="text-xs font-medium text-white">
                            {item.competitor}{item.unit}
                          </span>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Improvement indicator */}
                  <div className="text-xs text-muted-foreground">
                    {tendrilIsBetter ? (
                      <span className="text-green-600">
                        {item.direction === 'higher' ? '↑' : '↓'} {Math.abs(item.tendril - item.competitor)}{item.unit} better
                      </span>
                    ) : (
                      <span className="text-red-600">
                        {item.direction === 'higher' ? '↑' : '↓'} {Math.abs(item.competitor - item.tendril)}{item.unit} behind
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}