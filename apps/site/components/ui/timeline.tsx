import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import * as React from 'react';
import { typeRole } from '../../lib/typography';
import { Badge } from './badge';
import { Card, CardContent } from './card';

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
	(
		{ title, company, period, location, description, achievements, logo, index, isLast = false },
		ref,
	) => {
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
				{/* Desktop Timeline Line - Hidden on mobile */}
				<div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-stone-300 via-stone-400 to-stone-300 md:block dark:from-stone-600 dark:via-stone-500 dark:to-stone-600">
					{!isLast && (
						<motion.div
							initial={{ scaleY: 0 }}
							whileInView={{ scaleY: 1 }}
							transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
							viewport={{ once: true }}
							className="from-primary/60 via-primary to-primary/60 h-full w-full origin-top bg-gradient-to-b"
						/>
					)}
				</div>

				{/* Desktop Timeline Dot - Hidden on mobile */}
				<div className="border-background bg-primary absolute left-1/2 top-8 z-10 hidden h-4 w-4 -translate-x-1/2 rounded-full border-4 shadow-lg md:block">
					<motion.div
						initial={{ scale: 0 }}
						whileInView={{ scale: 1 }}
						transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
						viewport={{ once: true }}
						className="bg-primary h-full w-full rounded-full"
					/>
				</div>

				{/* Content Card - Different layouts for mobile vs desktop */}
				<div
					className={cn(
						'w-full',
						// Mobile: full width, no timeline elements
						'md:max-w-md',
						// Desktop: alternating layout
						isEven ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8',
					)}
				>
					<Card className="bg-card/50 hover:border-primary/50 hover:shadow-primary/10 group relative overflow-hidden border-stone-200 backdrop-blur-sm transition-all duration-300 hover:shadow-lg dark:border-stone-700">
						{/* Company Logo */}
						{logo && (
							<div className="border-background bg-background absolute -right-2 -top-2 h-12 w-12 overflow-hidden rounded-full border-2 shadow-md">
								<img src={logo} alt={`${company} logo`} className="h-full w-full object-cover" />
							</div>
						)}

						<CardContent className="p-4 md:p-6">
							{/* Period Badge */}
							<div className="mb-3 flex justify-start">
								<Badge variant="secondary" className={typeRole.metadata}>
									{period}
								</Badge>
							</div>

							{/* Title and Company */}
							<div className="mb-3">
								<h3 className={`text-stone-900 dark:text-stone-100 ${typeRole.subsectionH3}`}>
									{title}
								</h3>
								<div className="flex flex-col gap-1 text-stone-600 sm:flex-row sm:items-center sm:gap-2 dark:text-stone-400">
									<span className={typeRole.body}>{company}</span>
									<span className="hidden sm:inline">•</span>
									<span className={typeRole.metadata}>{location}</span>
								</div>
							</div>

							{/* Description */}
							<p className={`mb-4 text-stone-600 dark:text-stone-400 ${typeRole.body}`}>
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
										className={`flex items-start gap-3 text-stone-600 dark:text-stone-400 ${typeRole.body}`}
									>
										<div className="bg-primary/60 mt-1.5 h-2 w-2 flex-shrink-0 rounded-full" />
										<span className="leading-relaxed">{achievement}</span>
									</motion.div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</motion.div>
		);
	},
);

TimelineItem.displayName = 'TimelineItem';

export interface TimelineProps {
	children: React.ReactNode;
	className?: string;
}

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(({ children, className }, ref) => {
	return (
		<div ref={ref} className={cn('relative mx-auto w-full max-w-4xl', className)}>
			{children}
		</div>
	);
});

Timeline.displayName = 'Timeline';

export { Timeline, TimelineItem };
