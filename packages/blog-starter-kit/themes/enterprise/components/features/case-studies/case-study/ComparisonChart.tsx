import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';

interface ComparisonData {
  category: string;
  tendril: number | string;
  competitor: number | string;
  unit?: string;
  better?: 'tendril' | 'competitor' | 'equal';
}

interface ComparisonChartProps {
  title?: string;
  data: ComparisonData[];
  tendrilLabel?: string;
  competitorLabel?: string;
  description?: string;
}

const ComparisonBar: React.FC<{
  value: number | string;
  maxValue: number;
  label: string;
  isBetter: boolean;
  color: string;
}> = ({ value, maxValue, label, isBetter, color }) => {
  const percentage = typeof value === 'number' ? (value / maxValue) * 100 : 0;
  
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          {isBetter && (
            <Badge variant="secondary" className="text-xs">
              Better
            </Badge>
          )}
        </div>
      </div>
      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color} rounded-full`}
        />
      </div>
    </div>
  );
};

export const ComparisonChart: React.FC<ComparisonChartProps> = ({
  title = "Performance Comparison",
  data,
  tendrilLabel = "Tendril",
  competitorLabel = "Competitors",
  description
}) => {
  // Calculate max value for scaling
  const maxValue = Math.max(
    ...data
      .map(d => typeof d.tendril === 'number' ? d.tendril : 0)
      .concat(data.map(d => typeof d.competitor === 'number' ? d.competitor : 0))
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="my-12"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6">
          {data.map((item, index) => {
            const isTendrilBetter = item.better === 'tendril';
            const isCompetitorBetter = item.better === 'competitor';
            
            return (
              <div key={index} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{item.category}</h3>
                  {item.unit && (
                    <Badge variant="outline" className="text-xs">
                      {item.unit}
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ComparisonBar
                    value={item.tendril}
                    maxValue={maxValue}
                    label={tendrilLabel}
                    isBetter={isTendrilBetter}
                    color="bg-green-500"
                  />
                  <ComparisonBar
                    value={item.competitor}
                    maxValue={maxValue}
                    label={competitorLabel}
                    isBetter={isCompetitorBetter}
                    color="bg-red-500"
                  />
                </div>
                
                {item.better && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {item.better === 'tendril' ? (
                      <>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span>Tendril performs better</span>
                      </>
                    ) : item.better === 'competitor' ? (
                      <>
                        <TrendingDown className="h-4 w-4 text-red-600" />
                        <span>Competitor performs better</span>
                      </>
                    ) : (
                      <span>Equal performance</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface ComparisonTableProps {
  title?: string;
  data: ComparisonData[];
  tendrilLabel?: string;
  competitorLabel?: string;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  title = "Detailed Comparison",
  data,
  tendrilLabel = "Tendril",
  competitorLabel = "Competitors"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="my-12"
    >
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Category</th>
                  <th className="text-left p-3 font-medium">{tendrilLabel}</th>
                  <th className="text-left p-3 font-medium">{competitorLabel}</th>
                  <th className="text-left p-3 font-medium">Winner</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{item.category}</td>
                    <td className="p-3">{item.tendril}</td>
                    <td className="p-3">{item.competitor}</td>
                    <td className="p-3">
                      {item.better === 'tendril' && (
                        <Badge className="bg-green-100 text-green-800">Tendril</Badge>
                      )}
                      {item.better === 'competitor' && (
                        <Badge variant="destructive">Competitor</Badge>
                      )}
                      {item.better === 'equal' && (
                        <Badge variant="secondary">Equal</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
