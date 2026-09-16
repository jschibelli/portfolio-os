'use client';

import { motion } from 'framer-motion';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';
import { typeRole } from '../../../../lib/typography';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../ui/card';

interface Metric {
	title: string;
	value: string;
	description: string;
	trend: 'up' | 'down' | 'neutral';
	icon?: React.ReactNode;
}

interface MetricsDashboardProps {
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
			return <TrendingDown className="h-4 w-4 text-red-500" />;
		default:
			return <Minus className="h-4 w-4 text-gray-500" />;
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

export function MetricsDashboard({
	title,
	metrics,
	columns = 4,
	className = '',
}: MetricsDashboardProps) {
	const gridCols = {
		2: 'grid-cols-1 md:grid-cols-2',
		3: 'grid-cols-1 md:grid-cols-3',
		4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
	};

	return (
		<div className={`space-y-6 ${className}`}>
			<h2 className={typeRole.sectionH2}>{title}</h2>
			<div className={`grid ${gridCols[columns]} gap-6`}>
				{metrics.map((metric, index) => (
					<motion.div
						key={metric.title}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: index * 0.1 }}
					>
						<Card className="h-full">
							<CardHeader className="pb-3">
								<div className="flex items-center justify-between">
									<CardTitle className={`text-muted-foreground ${typeRole.metadata}`}>
										{metric.title}
									</CardTitle>
									<div className="flex items-center gap-1">{getTrendIcon(metric.trend)}</div>
								</div>
							</CardHeader>
							<CardContent className="pt-0">
								<div className="space-y-2">
									<div className={`text-2xl font-bold ${getTrendColor(metric.trend)}`}>
										{metric.value}
									</div>
									<CardDescription className="text-xs">{metric.description}</CardDescription>
								</div>
								{metric.icon && <div className="text-muted-foreground mt-3">{metric.icon}</div>}
							</CardContent>
						</Card>
					</motion.div>
				))}
			</div>
		</div>
	);
}
