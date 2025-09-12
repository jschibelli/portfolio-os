import { motion } from 'framer-motion';
import { ArrowRightIcon, TrendingUpIcon, ClockIcon, UsersIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader } from '../../ui/card';

export interface Project {
	id: string;
	title: string;
	description: string;
	image: string;
	tags: string[];
	caseStudyUrl?: string;
	slug?: string;
	metrics?: {
		performance: {
			loadTimeImprovement: string;
			responseTime: string;
			uptime: string;
		};
		business: {
			[key: string]: string;
		};
	};
	caseStudyPreview?: {
		problem: string;
		solution: string;
		results: string;
	};
}

interface ProjectCardProps {
	project: Project;
	index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
	// Error handling for missing project data
	if (!project) {
		console.warn('ProjectCard: Missing project data');
		return null;
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
			viewport={{ once: true }}
			whileHover={{ y: -8 }}
			className="h-full flex"
		>
			<Card className="group h-full w-full overflow-hidden border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-xl flex flex-col">
				{/* Image */}
				<div className="relative h-48 overflow-hidden">
					<Image
						src={project.image}
						alt={project.title}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-105"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100" />

					{/* Technology Tags - Positioned in top-right corner */}
					{project.tags?.length ? (
						<div className="absolute right-4 top-4 flex gap-1.5 transition-all duration-300 group-hover:scale-105">
							{project.tags.slice(0, 2).map((tag, tagIndex) => (
								<Badge 
									key={tagIndex} 
									variant="secondary" 
									className="bg-white/90 border border-white/50 shadow-lg backdrop-blur-sm text-xs text-stone-900 px-2 py-1"
								>
									{tag}
								</Badge>
							))}
						</div>
					) : null}

					<div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
						<div className="bg-primary/90 text-primary-foreground rounded-full px-4 py-2 text-sm font-medium backdrop-blur-sm">
							View Project
						</div>
					</div>
				</div>

				{/* Content */}
				<CardHeader className="pb-2">
					<h3 className="text-xl font-bold text-foreground transition-colors group-hover:text-foreground">
						{project.title}
					</h3>
				</CardHeader>

				<CardContent className="flex flex-col flex-1 p-6 pt-2">
					{/* Description - Flexible content area */}
					<div className="flex-1">
						<p className="leading-relaxed text-muted-foreground">
							{project.description}
						</p>
					</div>

					{/* Fixed bottom section for stats and button */}
					<div className="mt-6 space-y-4">
						{/* Key Results - Clean, professional metrics display */}
						{project.metrics && (
							<div className="border-t border-stone-200 pt-4 dark:border-stone-800">
								<div className="grid grid-cols-2 gap-4">
									{/* Performance Metric */}
									{project.metrics.performance?.loadTimeImprovement && (
										<div className="text-center">
											<div className="text-2xl font-bold text-stone-900 dark:text-stone-100">
												{project.metrics.performance.loadTimeImprovement}
											</div>
											<div className="text-xs text-stone-600 dark:text-stone-400 uppercase tracking-wide">
												Faster Load Time
											</div>
										</div>
									)}
									
									{/* Business Metric */}
									{project.metrics.business && Object.entries(project.metrics.business).slice(0, 1).map(([key, value]) => (
										<div key={key} className="text-center">
											<div className="text-2xl font-bold text-stone-900 dark:text-stone-100">
												{value}
											</div>
											<div className="text-xs text-stone-600 dark:text-stone-400 uppercase tracking-wide">
												{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{/* CTA Button - Always at bottom */}
						<Button
							variant="outline"
							size="sm"
							className="group/btn w-full transition-all duration-300"
							asChild
						>
							<Link href={project.caseStudyUrl || (project.slug ? `/projects/${project.slug}` : '#')}>
								{project.caseStudyUrl ? 'View Case Study' : 'View Project'}
								<ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
