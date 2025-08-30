import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { CheckCircle, Clock, Code, Users } from 'lucide-react';

interface TimelineItemProps {
  phase: string;
  title: string;
  duration: string;
  description: string;
  icon?: React.ReactNode;
  status: 'completed' | 'in-progress' | 'planned';
}

const TimelineItem: React.FC<TimelineItemProps> = ({ 
  phase, 
  title, 
  duration, 
  description, 
  icon, 
  status 
}) => {
  const statusColors = {
    completed: 'bg-green-500',
    'in-progress': 'bg-blue-500',
    planned: 'bg-gray-400'
  };

  const statusIcons = {
    completed: <CheckCircle className="h-4 w-4 text-green-600" />,
    'in-progress': <Clock className="h-4 w-4 text-blue-600" />,
    planned: <Clock className="h-4 w-4 text-gray-600" />
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="relative flex gap-4"
    >
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full ${statusColors[status]} z-10`} />
        <div className="w-0.5 h-full bg-border mt-2" />
      </div>

      {/* Content */}
      <Card className="flex-1 mb-8">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              {icon && <div className="text-muted-foreground">{icon}</div>}
              <div>
                <Badge variant="secondary" className="mb-1">
                  {phase}
                </Badge>
                <h3 className="text-lg font-semibold">{title}</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {statusIcons[status]}
              <span className="text-sm text-muted-foreground">{duration}</span>
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface TimelineProps {
  items: TimelineItemProps[];
}

export const Timeline: React.FC<TimelineProps> = ({ items }) => {
  return (
    <div className="my-12">
      <h2 className="text-2xl font-bold mb-8 text-center">Development Timeline</h2>
      <div className="relative">
        {items.map((item, index) => (
          <TimelineItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
};
