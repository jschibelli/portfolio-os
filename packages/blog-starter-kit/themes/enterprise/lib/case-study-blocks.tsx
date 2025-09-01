/* eslint-disable @next/next/no-img-element */
import { motion } from 'framer-motion';
import {
	BarChart3,
	CheckCircle,
	Code,
	Database,
	DollarSign,
	Globe,
	Quote,
	Server,
	Shield,
	TrendingDown,
	TrendingUp,
	Zap,
} from 'lucide-react';
import React from 'react';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '../components/ui';

export interface ParsedBlock {
	type: string;
	headers: string[];
	rows: string[][];
}

// Enhanced Metrics Card Component
const MetricsCard: React.FC<{
	value: string;
	label: string;
	trend?: string;
	trendDirection?: 'up' | 'down' | 'neutral';
	icon?: React.ReactNode;
	color?: 'green' | 'blue' | 'purple' | 'orange' | 'red';
}> = ({ value, label, trend, trendDirection = 'neutral', icon, color = 'blue' }) => {
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
		neutral: <span className="h-4 w-4" />,
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			whileHover={{ y: -5 }}
			className="h-full"
		>
			<Card className="h-full transition-all duration-300 hover:shadow-lg">
				<CardContent className="p-6">
					<div className="mb-4 flex items-center justify-between">
						{icon && <div className={`rounded-lg p-2 ${colorClasses[color]}`}>{icon}</div>}
						{trend && (
							<div className="flex items-center gap-1 text-sm font-medium">
								{trendIcons[trendDirection]}
								<span>{trend}</span>
							</div>
						)}
					</div>

					<div className="mb-2">
						<div className="text-foreground mb-1 text-3xl font-bold">{value}</div>
						<div className="text-muted-foreground text-sm font-medium">{label}</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

// Enhanced Comparison Table Component
const ComparisonTable: React.FC<{
	data: Array<{
		category: string;
		tendril: string | number;
		competitor: string | number;
		better?: 'tendril' | 'competitor' | 'equal';
	}>;
}> = ({ data }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="my-8"
		>
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-3">
						<BarChart3 className="text-primary h-5 w-5" />
						Performance Comparison
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b">
									<th className="p-3 text-left font-medium">Category</th>
									<th className="p-3 text-left font-medium">Tendril</th>
									<th className="p-3 text-left font-medium">Competitors</th>
									<th className="p-3 text-left font-medium">Winner</th>
								</tr>
							</thead>
							<tbody>
								{data.map((item, index) => (
									<motion.tr
										key={index}
										className="hover:bg-muted/50 border-b"
										initial={{ opacity: 0, x: -20 }}
										whileInView={{ opacity: 1, x: 0 }}
										transition={{ duration: 0.3, delay: index * 0.1 }}
									>
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
											{item.better === 'equal' && <Badge variant="secondary">Equal</Badge>}
										</td>
									</motion.tr>
								))}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

// Enhanced Quote Component
const QuoteCard: React.FC<{
	quote: string;
	author: string;
	role?: string;
	company?: string;
}> = ({ quote, author, role, company }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="my-8"
		>
			<Card className="relative overflow-hidden">
				<CardContent className="p-8">
					<div className="text-muted-foreground/20 absolute right-4 top-4">
						<Quote className="h-12 w-12" />
					</div>

					<blockquote className="text-foreground mb-6 text-lg italic leading-relaxed">
						&quot;{quote}&quot;
					</blockquote>

					<div className="flex items-center gap-4">
						<div>
							<div className="text-foreground font-semibold">{author}</div>
							{(role || company) && (
								<div className="text-muted-foreground text-sm">
									{role && <span>{role}</span>}
									{role && company && <span> at </span>}
									{company && <span>{company}</span>}
								</div>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

// Enhanced Timeline Component
const TimelineCard: React.FC<{
	items: Array<{
		phase: string;
		title: string;
		duration: string;
		description: string;
	}>;
}> = ({ items }) => {
	return (
		<div className="my-8 space-y-4">
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
									<Badge variant="secondary" className="mb-1">
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

// Legacy Components (keeping for backward compatibility)
const PricingTable: React.FC<{ headers: string[]; rows: string[][] }> = ({ headers, rows }) => {
	return (
		<div className="my-8">
			<Card>
				<CardHeader>
					<CardTitle>Pricing Plans</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b">
									{headers.map((header, index) => (
										<th key={index} className="p-3 text-left font-medium">
											{header}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{rows.map((row, rowIndex) => (
									<tr key={rowIndex} className="border-b">
										{row.map((cell, cellIndex) => (
											<td key={cellIndex} className="p-3">
												{cell}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

const KPIsGrid: React.FC<{ headers: string[]; rows: string[][] }> = ({ headers, rows }) => {
	return (
		<div className="my-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
			{rows.map((row, index) => {
				const [label, value, trend] = row;
				return (
					<MetricsCard
						key={index}
						value={value}
						label={label}
						trend={trend}
						icon={<DollarSign className="h-5 w-5" />}
					/>
				);
			})}
		</div>
	);
};

const Gallery: React.FC<{ headers: string[]; rows: string[][] }> = ({ headers, rows }) => {
	return (
		<div className="my-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{rows.map((row, index) => {
				const [url, alt] = row;
				return (
					<Card key={index} className="overflow-hidden">
						<img src={url} alt={alt} className="h-48 w-full object-cover" />
						<CardContent className="p-4">
							<p className="text-muted-foreground text-sm">{alt}</p>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
};

const CTA: React.FC<{ headers: string[]; rows: string[][] }> = ({ headers, rows }) => {
	const [title, subtitle, ctaText, href] = rows[0] || [];
	return (
		<Card className="my-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
			<CardContent className="p-8 text-center">
				<h3 className="mb-2 text-2xl font-bold">{title}</h3>
				<p className="mb-6 text-blue-100">{subtitle}</p>
				<a
					href={href}
					className="inline-block rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 transition-colors hover:bg-gray-100"
				>
					{ctaText}
				</a>
			</CardContent>
		</Card>
	);
};

// Enhanced Technology Stack Component
const TechnologyStackCard: React.FC<{
	data: Array<{
		category: string;
		technology: string;
		reason: string;
	}>;
}> = ({ data }) => {
	const getIconForCategory = (category: string) => {
		switch (category.toLowerCase()) {
			case 'frontend':
				return <Code className="h-5 w-5" />;
			case 'backend':
				return <Server className="h-5 w-5" />;
			case 'database':
				return <Database className="h-5 w-5" />;
			case 'ai/ml':
				return <Zap className="h-5 w-5" />;
			case 'deployment':
				return <Globe className="h-5 w-5" />;
			case 'security':
				return <Shield className="h-5 w-5" />;
			default:
				return <Code className="h-5 w-5" />;
		}
	};

	const getColorForCategory = (category: string) => {
		switch (category.toLowerCase()) {
			case 'frontend':
				return 'blue';
			case 'backend':
				return 'green';
			case 'database':
				return 'purple';
			case 'ai/ml':
				return 'orange';
			case 'deployment':
				return 'red';
			case 'security':
				return 'green';
			default:
				return 'blue';
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="my-8"
		>
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-3">
						<Code className="text-primary h-5 w-5" />
						Technology Stack
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						{data.map((item, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, scale: 0.9 }}
								whileInView={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.3, delay: index * 0.1 }}
								whileHover={{ y: -5 }}
								className="h-full"
							>
								<Card className="h-full transition-all duration-300 hover:shadow-lg">
									<CardContent className="p-4">
										<div className="mb-3 flex items-center gap-3">
											<div
												className={`rounded-lg p-2 bg-${getColorForCategory(item.category)}-50 dark:bg-${getColorForCategory(item.category)}-950`}
											>
												{getIconForCategory(item.category)}
											</div>
											<div>
												<Badge variant="outline" className="text-xs">
													{item.category}
												</Badge>
											</div>
										</div>
										<h4 className="text-foreground mb-2 font-semibold">{item.technology}</h4>
										<p className="text-muted-foreground text-sm">{item.reason}</p>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

// Enhanced Marketing Sites Component
const MarketingSitesCard: React.FC<{
	data: Array<{
		site: string;
		url: string;
		purpose: string;
		performance: string;
	}>;
}> = ({ data }) => {
	const getPerformanceColor = (performance: string) => {
		if (performance.toLowerCase().includes('high')) return 'green';
		if (performance.toLowerCase().includes('medium')) return 'yellow';
		if (performance.toLowerCase().includes('low')) return 'red';
		return 'blue';
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="my-8"
		>
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-3">
						<Globe className="text-primary h-5 w-5" />
						Key Marketing Sites
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{data.map((item, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.3, delay: index * 0.1 }}
								className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
							>
								<div className="flex-1">
									<div className="mb-2 flex items-center gap-3">
										<h4 className="text-foreground font-semibold">{item.site}</h4>
										<Badge
											variant="outline"
											className={`text-xs border-${getPerformanceColor(item.performance)}-200 text-${getPerformanceColor(item.performance)}-700`}
										>
											{item.performance}
										</Badge>
									</div>
									<p className="text-muted-foreground mb-1 text-sm">{item.purpose}</p>
									<a
										href={item.url}
										target="_blank"
										rel="noopener noreferrer"
										className="text-primary text-sm hover:underline"
									>
										{item.url}
									</a>
								</div>
								<div className="flex items-center gap-2">
									<CheckCircle className="h-4 w-4 text-green-500" />
								</div>
							</motion.div>
						))}
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

// Enhanced Pricing Analysis Component
const PricingAnalysisCard: React.FC<{
	data: Array<{
		plan: string;
		price: string;
		features: string;
		targetMarket: string;
	}>;
}> = ({ data }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="my-8"
		>
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-3">
						<DollarSign className="text-primary h-5 w-5" />
						Pricing Model Analysis
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
						{data.map((item, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, scale: 0.9 }}
								whileInView={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.3, delay: index * 0.1 }}
								whileHover={{ y: -5 }}
								className="relative"
							>
								<Card className={`h-full ${index === 1 ? 'ring-primary ring-2' : ''}`}>
									{index === 1 && (
										<div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
											<Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
										</div>
									)}
									<CardContent className="p-6">
										<div className="mb-4 text-center">
											<h3 className="text-foreground mb-2 text-xl font-bold">{item.plan}</h3>
											<div className="text-primary mb-1 text-3xl font-bold">{item.price}</div>
											<p className="text-muted-foreground text-sm">{item.targetMarket}</p>
										</div>
										<div className="space-y-2">
											<p className="text-muted-foreground text-sm">{item.features}</p>
										</div>
										<div className="mt-6">
											<button
												className={`w-full rounded-lg px-4 py-2 font-medium transition-colors ${
													index === 1
														? 'bg-primary text-primary-foreground hover:bg-primary/90'
														: 'bg-muted text-foreground hover:bg-muted/80'
												}`}
											>
												Get Started
											</button>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

// Enhanced renderFencedBlocks function
export function renderFencedBlocks(blocks: ParsedBlock[]) {
	return blocks.map((block, index) => {
		switch (block.type) {
			case 'pricing':
				// Enhanced pricing with better parsing
				const pricingData = block.rows.map((row) => {
					const [plan, price, features, targetMarket] = row;
					return { plan, price, features, targetMarket };
				});
				return <PricingAnalysisCard key={index} data={pricingData} />;
			case 'techstack':
				// Technology stack component
				const techData = block.rows.map((row) => {
					const [category, technology, reason] = row;
					return { category, technology, reason };
				});
				return <TechnologyStackCard key={index} data={techData} />;
			case 'marketing':
				// Marketing sites component
				const marketingData = block.rows.map((row) => {
					const [site, url, purpose, performance] = row;
					return { site, url, purpose, performance };
				});
				return <MarketingSitesCard key={index} data={marketingData} />;
			case 'comparison':
				// Enhanced comparison with better parsing
				const comparisonData = block.rows.map((row) => {
					const [category, tendril, competitor, better] = row;
					return { category, tendril, competitor, better: better as any };
				});
				return <ComparisonTable key={index} data={comparisonData} />;
			case 'kpis':
				return <KPIsGrid key={index} headers={block.headers} rows={block.rows} />;
			case 'metrics':
				// Enhanced metrics with better parsing
				const metricsData = block.rows.map((row) => {
					const [label, value, trend] = row;
					return { label, value, trend };
				});
				return (
					<div key={index} className="my-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
						{metricsData.map((metric, metricIndex) => (
							<MetricsCard
								key={metricIndex}
								value={metric.value}
								label={metric.label}
								trend={metric.trend}
								icon={<DollarSign className="h-5 w-5" />}
							/>
						))}
					</div>
				);
			case 'quote':
				// Enhanced quote parsing
				const quoteData: any = {};
				block.rows.forEach((row) => {
					const [key, value] = row;
					if (key && value) {
						quoteData[key.toLowerCase()] = value;
					}
				});
				return <QuoteCard key={index} {...quoteData} />;
			case 'timeline':
				// Enhanced timeline parsing
				const timelineData = block.rows.map((row) => {
					const [phase, title, duration, description] = row;
					return { phase, title, duration, description };
				});
				return <TimelineCard key={index} items={timelineData} />;
			case 'gallery':
				return <Gallery key={index} headers={block.headers} rows={block.rows} />;
			case 'cta':
				return <CTA key={index} headers={block.headers} rows={block.rows} />;
			default:
				return (
					<pre key={index} className="bg-muted my-4 overflow-x-auto rounded-lg p-4">
						<code>Unknown block type: {block.type}</code>
					</pre>
				);
		}
	});
}

// Parse fenced blocks from markdown content
export function parseFencedBlocks(content: string): ParsedBlock[] {
	const blockRegex = /:::(\w+)\n([\s\S]*?)\n:::/g;
	const blocks: ParsedBlock[] = [];
	let match;

	while ((match = blockRegex.exec(content)) !== null) {
		const [, type, blockContent] = match;
		const lines = blockContent
			.trim()
			.split('\n')
			.filter((line) => line.trim());

		if (lines.length > 0) {
			const headers = lines[0].split(',').map((h) => h.trim());
			const rows = lines.slice(1).map((line) => line.split(',').map((cell) => cell.trim()));

			blocks.push({ type, headers, rows });
		}
	}

	return blocks;
}
