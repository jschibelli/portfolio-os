import React from 'react';
import { motion } from 'framer-motion';

interface TimelineItemProps {
	title: string;
	company: string;
	period: string;
	location: string;
	description: string;
	achievements: string[];
	index: number;
	isLast: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
	title,
	company,
	period,
	location,
	description,
	achievements,
	index,
	isLast,
}) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, delay: index * 0.1 }}
			viewport={{ once: true }}
			className="relative flex items-start gap-6"
		>
			{/* Timeline line and dot */}
			<div className="flex flex-col items-center">
				<div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary shadow-lg">
					<div className="h-2 w-2 rounded-full bg-white"></div>
				</div>
				{!isLast && (
					<div className="mt-4 h-16 w-0.5 bg-gradient-to-b from-primary to-primary/30"></div>
				)}
			</div>

			{/* Content */}
			<div className="flex-1 pb-8">
				<div className="rounded-lg border border-border bg-card p-6 shadow-sm">
					<div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
						<div>
							<h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
								{title}
							</h3>
							<div className="mt-1 text-sm text-stone-500 sm:mt-0 dark:text-stone-400">
								{period}
							</div>
						</div>
					</div>
					<div className="mb-3 flex items-center gap-2 text-stone-600 dark:text-stone-400">
						<span className="font-medium">{company}</span>
						<span>•</span>
						<span>{location}</span>
					</div>
					<p className="mb-4 text-stone-600 dark:text-stone-400">
						{description}
					</p>
					<ul className="space-y-2">
						{achievements.map((achievement, idx) => (
							<li
								key={idx}
								className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-400"
							>
								<span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>
								{achievement}
							</li>
						))}
					</ul>
				</div>
			</div>
		</motion.div>
	);
};

interface TimelineProps {
	children: React.ReactNode;
}

export const Timeline: React.FC<TimelineProps> = ({ children }) => {
	return (
		<div className="relative">
			{children}
		</div>
	);
};
