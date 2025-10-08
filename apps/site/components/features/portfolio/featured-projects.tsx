"use client";
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import caseStudiesData from '../../../data/case-studies.json';
import { ICON_SPACING, OUTLINE_BUTTON_STYLES } from '../../../lib/button-styles';
import { Button } from '../../ui/button';
import ProjectCard, { Project } from './project-card';

/**
 * FeaturedProjects component displays featured case studies on the home page
 * with proper error handling, accessibility, and responsive design
 */
export default function FeaturedProjects() {
	// Comprehensive error handling for missing or invalid case studies data
	if (!caseStudiesData || !Array.isArray(caseStudiesData)) {
		console.error('FeaturedProjects: Invalid or missing case studies data', {
			caseStudiesData,
			isArray: Array.isArray(caseStudiesData),
			timestamp: new Date().toISOString()
		});
		return (
		<section 
			className="bg-background py-20"
				aria-label="Featured case studies section"
				role="region"
			>
				<div className="container mx-auto px-4 text-center">
					<p className="text-stone-600 dark:text-stone-400" role="alert">
						Unable to load featured case studies. Please try again later.
					</p>
				</div>
			</section>
		);
	}

	// Convert case studies data to Project interface with error handling
	// Only show case studies marked as featured: true
	const featuredProjects = caseStudiesData
		.filter((item: any) => item.featured === true)
		.map((item: any) => {
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
			projectUrl: item.projectUrl, // Add the projectUrl field
			liveUrl: item.liveUrl,
			slug: item.slug,
			metrics: item.metrics,
			caseStudyPreview: item.caseStudyPreview,
		} as Project;
	}).filter(Boolean) as Project[]; // Remove null entries

	// Dynamic grid layout based on number of projects
	// 1 item: Single large centered card (max-w-2xl)
	// 2 items: Two cards side-by-side (max-w-4xl)
	// 3+ items: Full 3-column grid
	const getGridClasses = () => {
		const count = featuredProjects.length;
		if (count === 1) {
			return "max-w-2xl mx-auto";
		} else if (count === 2) {
			return "grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto";
		} else {
			return "grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:items-stretch";
		}
	};

	return (
		<section 
			className="bg-background py-16"
			aria-label="Featured case studies"
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
						Featured Case {featuredProjects.length === 1 ? 'Study' : 'Studies'}
					</h2>
					<p className="mx-auto max-w-2xl text-lg text-stone-600 dark:text-stone-400">
						{featuredProjects.length === 1 
							? "An in-depth look at a comprehensive development project showcasing real-world engineering expertise"
							: "In-depth case studies demonstrating comprehensive development projects and engineering approaches"
						}
					</p>
				</motion.div>

				{/* Dynamic Projects Grid - adapts to 1, 2, or 3+ items */}
				<div className={`mb-12 ${getGridClasses()}`}>
					{featuredProjects.map((project, index) => (
						<ProjectCard key={project.id} project={project} index={index} />
					))}
				</div>

				{/* View All Case Studies CTA with enhanced accessibility */}
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
                        aria-describedby="view-all-case-studies-description"
                    >
						<Link 
							href="/case-studies"
							aria-label="View all case studies"
						>
							View All Case Studies
							<ArrowRight 
								className={`${ICON_SPACING.right} transition-transform group-hover:translate-x-1`} 
								aria-hidden="true"
							/>
						</Link>
					</Button>
					<div id="view-all-case-studies-description" className="sr-only">
						Navigate to the case studies page to view all in-depth project case studies
					</div>
				</motion.div>
			</div>
		</section>
	);
}
