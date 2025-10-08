"use client";

import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Clock, Users, Target, CheckCircle, BarChart3 } from 'lucide-react';
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
	/** Optional case study URL for legacy projects */
	caseStudyUrl?: string;
	/** Optional slug for SEO-friendly project URLs */
	slug?: string;
	/** Optional live URL for deployed projects */
	liveUrl?: string;
	/** Project category */
	category?: string;
	/** Project status */
	status?: string;
	/** Technologies used */
	technologies?: string[];
	/** Client name */
	client?: string;
	/** Industry */
	industry?: string;
	/** Start date */
	startDate?: string;
	/** End date */
	endDate?: string;
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

/**
 * Helper function to determine the project link URL
 * Priority: slug-based URL > case study URL > fallback
 */
const getProjectLink = (project: Project): string => {
	if (project?.slug) {
		return `/projects/${project.slug}`;
	}
	if (project?.caseStudyUrl) {
		return project.caseStudyUrl;
	}
	// Fallback to projects page if no specific link is available
	return '/projects';
};

export default function ProjectCard({ project, index }: ProjectCardProps) {
	// Validate required project data
	if (!project || !project.id || !project.title) {
		console.warn('ProjectCard: Invalid project data provided');
		return null;
	}

	const projectLink = getProjectLink(project);
	const hasCaseStudy = project.caseStudyUrl || project.caseStudyPreview;
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
			viewport={{ once: true }}
			whileHover={{ y: -8 }}
			className="h-full flex touch-manipulation"
		>
			<Card className="group h-full w-full overflow-hidden border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-xl flex flex-col touch-manipulation">
				{/* Enhanced Image Section with Mobile Optimization */}
				<div className="relative h-40 sm:h-48 md:h-52 overflow-hidden">
					<Image
						src={project.image}
						alt={`Screenshot of ${project.title} project - ${project.description}`}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-105"
						sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
						quality={85}
						loading="lazy"
						placeholder="blur"
						blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100" />

					{/* Enhanced Technology Tags - Mobile Optimized */}
					{project.tags?.length ? (
						<div className="absolute right-2 sm:right-3 md:right-4 top-2 sm:top-3 md:top-4 flex flex-wrap gap-1 sm:gap-1.5 transition-all duration-300 group-hover:scale-105">
							{project.tags.slice(0, 3).map((tag, tagIndex) => (
								<Badge 
									key={tagIndex} 
									variant="secondary" 
									className="bg-white/95 border border-white/60 shadow-lg backdrop-blur-sm text-xs text-stone-900 px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 font-medium touch-manipulation"
								>
									{tag}
								</Badge>
							))}
						</div>
					) : null}

					{/* Case Study Badge - Mobile Optimized */}
					{hasCaseStudy && (
						<div className="absolute left-2 sm:left-3 top-2 sm:top-3">
							<Badge className="bg-primary/90 text-primary-foreground border-0 shadow-lg text-xs px-2 py-1">
								<BarChart3 className="w-3 h-3 mr-1" />
								Case Study
							</Badge>
						</div>
					)}
				</div>

				{/* Enhanced Content Section - Mobile Optimized */}
				<CardHeader className="pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
					<h3 className="text-lg sm:text-xl font-bold text-foreground transition-colors group-hover:text-primary leading-tight">
						{project.title}
					</h3>
				</CardHeader>

				<CardContent className="flex flex-col flex-1 p-4 sm:p-6 pt-2">
					{/* Description - Mobile Optimized */}
					<div className="flex-1 mb-4">
						<p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
							{project.description}
						</p>
					</div>

					{/* Enhanced Case Study Preview Section - Mobile Optimized */}
					{project.caseStudyPreview && (
						<div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-stone-50 dark:bg-stone-900/50 rounded-lg border border-stone-200 dark:border-stone-800">
							<div className="space-y-2 sm:space-y-3">
								<div className="flex items-start gap-2">
									<Target className="w-3 h-3 sm:w-4 sm:h-4 text-primary mt-0.5 flex-shrink-0" />
									<div>
										<div className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide mb-1">
											Problem
										</div>
										<p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
											{project.caseStudyPreview.problem}
										</p>
									</div>
								</div>
								
								<div className="flex items-start gap-2">
									<CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 mt-0.5 flex-shrink-0" />
									<div>
										<div className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide mb-1">
											Solution
										</div>
										<p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
											{project.caseStudyPreview.solution}
										</p>
									</div>
								</div>
								
								<div className="flex items-start gap-2">
									<TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 mt-0.5 flex-shrink-0" />
									<div>
										<div className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide mb-1">
											Results
										</div>
										<p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
											{project.caseStudyPreview.results}
										</p>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Enhanced Metrics Display - Mobile Optimized */}
					{project.metrics && (
						<div className="mb-4 sm:mb-6 border-t border-stone-200 dark:border-stone-800 pt-3 sm:pt-4">
							<div className="grid grid-cols-2 gap-2 sm:gap-4">
								{/* Performance Metric */}
								{project.metrics.performance?.loadTimeImprovement && (
									<div className="text-center p-2 sm:p-3 bg-stone-50 dark:bg-stone-900/30 rounded-lg">
										<div className="text-lg sm:text-2xl font-bold text-primary">
											{project.metrics.performance.loadTimeImprovement}
										</div>
										<div className="text-xs text-stone-600 dark:text-stone-400 uppercase tracking-wide font-medium">
											Faster Load Time
										</div>
									</div>
								)}
								
								{/* Business Metric */}
								{project.metrics.business && Object.entries(project.metrics.business).slice(0, 1).map(([key, value]) => (
									<div key={key} className="text-center p-2 sm:p-3 bg-stone-50 dark:bg-stone-900/30 rounded-lg">
										<div className="text-lg sm:text-2xl font-bold text-primary">
											{value}
										</div>
										<div className="text-xs text-stone-600 dark:text-stone-400 uppercase tracking-wide font-medium">
											{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Enhanced CTA Buttons - Mobile Optimized */}
					<div className="space-y-2">
						{hasCaseStudy ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
								<Button
									variant="default"
									size="sm"
									className="group/btn transition-all duration-300 h-10 sm:h-9 text-xs sm:text-sm touch-manipulation"
									asChild
								>
									<Link 
										href={projectLink}
										aria-label={`View case study for ${project.title}`}
									>
										<BarChart3 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
										Case Study
									</Link>
								</Button>
								{project.liveUrl && (
									<Button
										variant="outline"
										size="sm"
										className="group/btn transition-all duration-300 h-10 sm:h-9 text-xs sm:text-sm touch-manipulation"
										asChild
									>
										<Link 
											href={project.liveUrl}
											target="_blank"
											rel="noopener noreferrer"
											aria-label={`View details for ${project.title} project`}
										>
											<ArrowRight className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
											View Details
										</Link>
									</Button>
								)}
							</div>
						) : (
							<Button
								variant="outline"
								size="sm"
								className="group/btn w-full transition-all duration-300 h-10 sm:h-9 text-xs sm:text-sm touch-manipulation"
								asChild
							>
								<Link 
									href={projectLink}
									aria-label={`View details for ${project.title} project`}
								>
									View Project
									<ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover/btn:translate-x-1" />
								</Link>
							</Button>
						)}
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}

