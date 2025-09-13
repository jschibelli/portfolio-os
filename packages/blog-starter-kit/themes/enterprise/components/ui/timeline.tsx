import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent } from './card';
import { Badge } from './badge';

export interface TimelineItemProps {
	title: string;
	company: string;
	period: string;
	location: string;
	description: string;
	achievements: string[];
	logo?: string;
	index: number;
	isLast?: boolean;
}

const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(
	({ title, company, period, location, description, achievements, logo, index, isLast = false }, ref) => {
		const isEven = index % 2 === 0;
		
		return (
			<motion.div
				ref={ref}
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: index * 0.1 }}
				viewport={{ once: true }}
				className="relative flex w-full items-center"
			>
				{/* Timeline Line - Hidden on mobile, visible on desktop */}
				<div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-stone-300 via-stone-400 to-stone-300 dark:from-stone-600 dark:via-stone-500 dark:to-stone-600 hidden md:block">
					{!isLast && (
						<motion.div
							initial={{ scaleY: 0 }}
							whileInView={{ scaleY: 1 }}
							transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
							viewport={{ once: true }}
							className="h-full w-full bg-gradient-to-b from-primary/60 via-primary to-primary/60 origin-top"
						/>
					)}
				</div>

				{/* Timeline Dot - Positioned differently for mobile vs desktop */}
				<div className="absolute left-4 top-8 z-10 h-4 w-4 rounded-full border-4 border-background bg-primary shadow-lg md:left-1/2 md:-translate-x-1/2">
					<motion.div
						initial={{ scale: 0 }}
						whileInView={{ scale: 1 }}
						transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
						viewport={{ once: true }}
						className="h-full w-full rounded-full bg-primary"
					/>
				</div>

				{/* Content Card - Full width on mobile, alternating on desktop */}
				<div className={cn(
					"w-full",
					// Mobile: full width with left padding
					"ml-12 pl-4 md:ml-0 md:pl-0",
					// Desktop: alternating layout
					"md:max-w-md",
					isEven ? "md:mr-auto md:pr-8 md:text-right" : "md:ml-auto md:pl-8 md:text-left"
				)}>
					<Card className="group relative overflow-hidden border-stone-200 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 dark:border-stone-700">
						{/* Company Logo */}
						{logo && (
							<div className="absolute -top-2 -right-2 h-12 w-12 overflow-hidden rounded-full border-2 border-background bg-background shadow-md">
								<img
									src={logo}
									alt={`${company} logo`}
									className="h-full w-full object-cover"
								/>
							</div>
						)}

						<CardContent className="p-4 md:p-6">
							{/* Period Badge */}
							<div className={cn("mb-3", isEven ? "md:flex md:justify-end" : "flex justify-start")}>
								<Badge variant="secondary" className="text-xs font-medium">
									{period}
								</Badge>
							</div>

							{/* Title and Company */}
							<div className="mb-3">
								<h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
									{title}
								</h3>
								<div className="flex flex-col gap-1 text-stone-600 dark:text-stone-400 sm:flex-row sm:items-center sm:gap-2">
									<span className="font-medium">{company}</span>
									<span className="hidden sm:inline">•</span>
									<span className="text-sm">{location}</span>
								</div>
							</div>

							{/* Description */}
							<p className="mb-4 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
								{description}
							</p>

							{/* Achievements */}
							<div className="space-y-2">
								{achievements.map((achievement, idx) => (
									<motion.div
										key={idx}
										initial={{ opacity: 0, x: isEven ? 20 : -20 }}
										whileInView={{ opacity: 1, x: 0 }}
										transition={{ duration: 0.4, delay: index * 0.1 + 0.4 + idx * 0.1 }}
										viewport={{ once: true }}
										className="flex items-start gap-2 text-xs text-stone-600 dark:text-stone-400"
									>
										<div className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/60" />
										<span className="leading-relaxed">{achievement}</span>
									</motion.div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</motion.div>
		);
	}
);

TimelineItem.displayName = 'TimelineItem';

export interface TimelineProps {
	children: React.ReactNode;
	className?: string;
}

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
	({ children, className }, ref) => {
		return (
			<div
				ref={ref}
				className={cn("relative w-full max-w-4xl mx-auto", className)}
			>
				{children}
			</div>
		);
	}
);

Timeline.displayName = 'Timeline';

export { Timeline, TimelineItem };
