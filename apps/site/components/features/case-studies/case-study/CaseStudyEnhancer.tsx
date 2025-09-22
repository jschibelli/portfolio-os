import { motion } from 'framer-motion';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';
import { Badge } from '../../../ui/badge';
import { Card, CardContent } from '../../../ui/card';

// Enhanced Metrics Display for inline use
export const InlineMetrics: React.FC<{
	metrics: Array<{
		value: string;
		label: string;
		trend?: string;
		trendDirection?: 'up' | 'down' | 'neutral';
		color?: 'green' | 'blue' | 'purple' | 'orange' | 'red';
	}>;
	columns?: 2 | 3 | 4;
}> = ({ metrics, columns = 4 }) => {
	const gridCols = {
		2: 'grid-cols-1 md:grid-cols-2',
		3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
		4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
	};

	const colorClasses = {
		green: 'text-green-600 bg-green-50 dark:bg-green-950',
		blue: 'text-blue-600 bg-blue-50 dark:bg-blue-950',
		purple: 'text-purple-600 bg-purple-50 dark:bg-purple-950',
		orange: 'text-orange-600 bg-orange-50 dark:bg-orange-950',
		red: 'text-red-600 bg-red-50 dark:bg-red-950',
	};

	const trendIcons = {
		up: <TrendingUp className="h-4 w-4 text-green-600" />,
		down: <TrendingDown className="h-4 w-4 text-red-600" />,
		neutral: <Minus className="h-4 w-4 text-gray-600" />,
	};

	return (
		<div className={`grid ${gridCols[columns]} my-6 gap-4`}>
			{metrics.map((metric, index) => (
				<motion.div
					key={index}
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: index * 0.1 }}
				>
					<Card className="p-4 text-center">
						<div className="text-foreground mb-1 text-2xl font-bold">{metric.value}</div>
						<div className="text-muted-foreground mb-2 text-sm">{metric.label}</div>
						{metric.trend && (
							<div className="flex items-center justify-center gap-1 text-xs">
								{trendIcons[metric.trendDirection || 'neutral']}
								<span>{metric.trend}</span>
							</div>
						)}
					</Card>
				</motion.div>
			))}
		</div>
	);
};

// Enhanced Comparison for inline use
export const InlineComparison: React.FC<{
	title: string;
	data: Array<{
		label: string;
		tendril: string | number;
		competitor: string | number;
		better: 'tendril' | 'competitor' | 'equal';
	}>;
}> = ({ title, data }) => {
	return (
		<Card className="my-6">
			<CardContent className="p-6">
				<h3 className="mb-4 text-lg font-semibold">{title}</h3>
				<div className="space-y-3">
					{data.map((item, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, x: -10 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.3, delay: index * 0.1 }}
							className="bg-muted/30 flex items-center justify-between rounded-lg p-3"
						>
							<span className="font-medium">{item.label}</span>
							<div className="flex items-center gap-4">
								<span className="text-sm">{item.tendril}</span>
								<span className="text-muted-foreground">vs</span>
								<span className="text-sm">{item.competitor}</span>
								{item.better === 'tendril' && (
									<Badge className="bg-green-100 text-xs text-green-800">Better</Badge>
								)}
							</div>
						</motion.div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};

// Enhanced Timeline for inline use
export const InlineTimeline: React.FC<{
	items: Array<{
		phase: string;
		title: string;
		duration: string;
		description: string;
	}>;
}> = ({ items }) => {
	return (
		<div className="my-6 space-y-4">
			{items.map((item, index) => (
				<motion.div
					key={index}
					initial={{ opacity: 0, x: -20 }}
					whileInView={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: index * 0.2 }}
					className="flex gap-4"
				>
					<div className="flex flex-col items-center">
						<div className="h-3 w-3 rounded-full bg-green-500" />
						{index < items.length - 1 && <div className="bg-border mt-2 h-16 w-0.5" />}
					</div>
					<Card className="flex-1">
						<CardContent className="p-4">
							<div className="mb-2 flex items-start justify-between">
								<div>
                                                                        <Badge className="mb-1">
										{item.phase}
									</Badge>
									<h4 className="font-semibold">{item.title}</h4>
								</div>
								<span className="text-muted-foreground text-sm">{item.duration}</span>
							</div>
							<p className="text-muted-foreground text-sm">{item.description}</p>
						</CardContent>
					</Card>
				</motion.div>
			))}
		</div>
	);
};

// Enhanced Quote for inline use
export const InlineQuote: React.FC<{
	quote: string;
	author: string;
	role?: string;
	company?: string;
}> = ({ quote, author, role, company }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="my-6"
		>
			<Card className="border-l-primary border-l-4">
				<CardContent className="p-6">
					<blockquote className="text-foreground mb-4 text-lg italic">
						&quot;{quote}&quot;
					</blockquote>
					<div className="text-muted-foreground text-sm">
						<span className="font-semibold">{author}</span>
						{role && <span>, {role}</span>}
						{company && <span> at {company}</span>}
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

// Enhanced Code Block for inline use
export const InlineCodeBlock: React.FC<{
	children: string;
	language?: string;
	title?: string;
}> = ({ children, language = 'typescript', title }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="my-6"
		>
			<Card>
				<CardContent className="p-0">
					{title && (
						<div className="bg-muted border-b px-4 py-2">
							<span className="text-sm font-medium">{title}</span>
						</div>
					)}
					<pre className="overflow-x-auto p-4">
						<code className={`language-${language} text-sm`}>{children}</code>
					</pre>
				</CardContent>
			</Card>
		</motion.div>
	);
};
