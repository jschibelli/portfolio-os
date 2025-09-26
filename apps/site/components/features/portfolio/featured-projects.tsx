"use client";
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import portfolioData from '../../../data/portfolio.json';
import { ICON_SPACING, OUTLINE_BUTTON_STYLES } from '../../../lib/button-styles';
import { Button } from '../../ui/button';
import ProjectCard, { Project } from './project-card';

/**
 * FeaturedProjects component displays a selection of featured portfolio projects
 * with proper error handling, accessibility, and responsive design
 */
export default function FeaturedProjects() {
	// Comprehensive error handling for missing or invalid portfolio data
	if (!portfolioData || !Array.isArray(portfolioData)) {
		console.error('FeaturedProjects: Invalid or missing portfolio data', {
			portfolioData,
			isArray: Array.isArray(portfolioData),
			timestamp: new Date().toISOString()
		});
		return (
		<section 
			className="bg-background py-20"
				aria-label="Featured projects section"
				role="region"
			>
				<div className="container mx-auto px-4 text-center">
					<p className="text-stone-600 dark:text-stone-400" role="alert">
						Unable to load featured projects. Please try again later.
					</p>
				</div>
			</section>
		);
	}

	// Convert portfolio data to Project interface with error handling
	const featuredProjects: Project[] = portfolioData.slice(0, 3).map((item: any) => {
		// Validate required fields
		if (!item.id || !item.title || !item.description) {
			console.warn('FeaturedProjects: Invalid project data for item:', {
				item,
				missingFields: {
					id: !item.id,
					title: !item.title,
					description: !item.description
				},
				timestamp: new Date().toISOString()
			});
			return null;
		}

		return {
			id: item.id,
			title: item.title,
			description: item.description,
			image: item.image || '/placeholder-image.jpg', // Fallback image
			tags: item.tags || [],
			caseStudyUrl: item.caseStudyUrl,
			slug: item.slug,
			metrics: item.metrics,
			caseStudyPreview: item.caseStudyPreview,
		};
	}).filter(Boolean); // Remove null entries

	return (
		<section 
			className="bg-background py-16"
			aria-label="Featured portfolio projects"
			role="region"
		>
			<div className="container mx-auto px-4">
				{/* Section header with smooth animations */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: 'easeOut' }}
					viewport={{ once: true }}
					className="mb-12 text-center"
				>
					<h2 className="mb-3 text-3xl font-bold text-stone-900 md:text-4xl dark:text-stone-100">
						Featured Projects
					</h2>
					<p className="mx-auto max-w-2xl text-lg text-stone-600 dark:text-stone-400">
						A selection of recent projects showcasing modern web development solutions with concrete results and case study insights
					</p>
				</motion.div>

				{/* Projects Grid */}
				<div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:items-stretch">
					{featuredProjects.map((project, index) => (
						<ProjectCard key={project.id} project={project} index={index} />
					))}
				</div>

				{/* View All Projects CTA with enhanced accessibility */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
					viewport={{ once: true }}
					className="text-center"
				>
                    <Button
                        size="lg"
                        variant="outline"
                        className={OUTLINE_BUTTON_STYLES}
                        asChild
                        aria-describedby="view-all-projects-description"
                    >
						<Link 
							href="/projects"
							aria-label="View all portfolio projects"
						>
							View All Projects
							<ArrowRight 
								className={`${ICON_SPACING.right} transition-transform group-hover:translate-x-1`} 
								aria-hidden="true"
							/>
						</Link>
					</Button>
					<div id="view-all-projects-description" className="sr-only">
						Navigate to the projects page to view all portfolio projects and case studies
					</div>
				</motion.div>
			</div>
		</section>
	);
}
