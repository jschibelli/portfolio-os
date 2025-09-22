import { motion } from 'framer-motion';
import { BarChart3, TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';
import { Badge } from '../../../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';

interface ComparisonData {
	category: string;
	tendril: number | string;
	competitor: number | string;
	unit?: string;
	better?: 'tendril' | 'competitor' | 'equal';
	direction?: 'lower' | 'higher';
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
			<div className="mb-2 flex items-center justify-between">
				<span className="text-muted-foreground text-sm font-medium">{label}</span>
				<div className="flex items-center gap-2">
					<span className="text-sm font-semibold">
						{typeof value === 'number' ? value.toLocaleString() : value}
					</span>
					{isBetter && (
                                          <Badge className="text-xs">
							Better
						</Badge>
					)}
				</div>
			</div>
			<div className="bg-muted h-3 w-full overflow-hidden rounded-full">
				<motion.div
					initial={{ width: 0 }}
					whileInView={{ width: `${percentage}%` }}
					transition={{ duration: 1, ease: 'easeOut' }}
					className={`h-full ${color} rounded-full`}
				/>
			</div>
		</div>
	);
};

export const ComparisonChart: React.FC<ComparisonChartProps> = ({
	title = 'Performance Comparison',
	data,
	tendrilLabel = 'Tendril',
	competitorLabel = 'Competitors',
	description,
}) => {
	// Helper to coerce numbers
	const toNum = (v: number | string) => (typeof v === 'number' ? v : parseFloat(String(v)));

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="my-12"
		>
			<Card>
				<CardHeader>
					<div className="mb-2 flex items-center gap-3">
						<BarChart3 className="text-primary h-6 w-6" />
						<CardTitle className="text-xl">{title}</CardTitle>
					</div>
					{description && <p className="text-muted-foreground">{description}</p>}
					<div className="mt-3 flex items-center justify-between">
						<div className="text-muted-foreground flex items-center gap-4 text-xs">
							<span className="inline-flex items-center gap-2">
								<span className="h-2 w-2 rounded-full bg-green-500" />
								{tendrilLabel}
							</span>
							<span className="inline-flex items-center gap-2">
								<span className="h-2 w-2 rounded-full bg-red-500" />
								{competitorLabel}
							</span>
						</div>
					</div>
				</CardHeader>

				<CardContent className="space-y-6">
					{data.map((item, index) => {
						const tVal = toNum(item.tendril);
						const cVal = toNum(item.competitor);
						const localMax = Math.max(1, tVal, cVal);

						// Determine winner if not explicitly provided
						let winner: 'tendril' | 'competitor' | 'equal' | undefined = item.better;
						if (!winner && item.direction) {
							if (tVal === cVal) winner = 'equal';
							else if (item.direction === 'lower') winner = tVal < cVal ? 'tendril' : 'competitor';
							else winner = tVal > cVal ? 'tendril' : 'competitor';
						}

						const isTendrilBetter = winner === 'tendril';
						const isCompetitorBetter = winner === 'competitor';

						return (
							<div key={index} className="space-y-4">
								<div className="flex items-center justify-between">
									<h3 className="text-lg font-semibold">{item.category}</h3>
									{item.unit && (
										<Badge className="text-xs">
											{item.unit}
										</Badge>
									)}
									{item.direction && (
										<Badge className="ml-2 text-xs">
											{item.direction === 'lower' ? 'Lower is better' : 'Higher is better'}
										</Badge>
									)}
								</div>

								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									<ComparisonBar
										value={tVal}
										maxValue={localMax}
										label={tendrilLabel}
										isBetter={isTendrilBetter}
										color="bg-green-500"
									/>
									<ComparisonBar
										value={cVal}
										maxValue={localMax}
										label={competitorLabel}
										isBetter={isCompetitorBetter}
										color="bg-red-500"
									/>
								</div>

								{winner && (
									<div className="text-muted-foreground flex items-center gap-2 text-sm">
										{winner === 'tendril' ? (
											<>
												<TrendingUp className="h-4 w-4 text-green-600" />
												<span>Tendril performs better</span>
											</>
										) : winner === 'competitor' ? (
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
	title = 'Detailed Comparison',
	data,
	tendrilLabel = 'Tendril',
	competitorLabel = 'Competitors',
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
									<th className="p-3 text-left font-medium">Category</th>
									<th className="p-3 text-left font-medium">{tendrilLabel}</th>
									<th className="p-3 text-left font-medium">{competitorLabel}</th>
									<th className="p-3 text-left font-medium">Winner</th>
								</tr>
							</thead>
							<tbody>
								{data.map((item, index) => (
									<tr key={index} className="hover:bg-muted/50 border-b">
										<td className="p-3 font-medium">{item.category}</td>
										<td className="p-3">{item.tendril}</td>
										<td className="p-3">{item.competitor}</td>
										<td className="p-3">
											{item.better === 'tendril' && (
												<Badge className="bg-green-100 text-green-800">Tendril</Badge>
											)}
											{item.better === 'competitor' && (
												<Badge>Competitor</Badge>
											)}
											{item.better === 'equal' && <Badge>Equal</Badge>}
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
