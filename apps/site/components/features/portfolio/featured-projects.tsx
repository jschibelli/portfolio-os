"use client";
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { allProjects } from '../../../data/projects';
import { ICON_SPACING, OUTLINE_BUTTON_STYLES } from '../../../lib/button-styles';
import { Button } from '../../ui/button';
import { AnimatedProjectCard } from '../projects/animated-project-card';

/**
 * FeaturedProjects component displays featured projects on the home page
 * with proper error handling, accessibility, and responsive design
 */
export default function FeaturedProjects() {
	// Get featured projects from projects data
	const featuredProjects = allProjects.filter(project => project.featured && project.published !== false);

	// Error handling for no featured projects
	if (!featuredProjects || featuredProjects.length === 0) {
		console.warn('FeaturedProjects: No featured projects found', {
			timestamp: new Date().toISOString()
		});
		return null; // Don't show section if no featured projects
	}

	// Dynamic grid layout based on number of projects
	// 1 item: Large featured card (max-w-5xl)
	// 2 items: Two cards side-by-side (max-w-4xl)
	// 3+ items: Full 3-column grid
	const getGridClasses = () => {
		const count = featuredProjects.length;
		if (count === 1) {
			return "max-w-5xl mx-auto";
		} else if (count === 2) {
			return "grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto";
		} else {
			return "grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:items-stretch";
		}
	};

	return (
		<section 
			className="bg-background py-16"
			aria-label="Featured projects"
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
						Featured {featuredProjects.length === 1 ? 'Project' : 'Projects'}
					</h2>
					<p className="mx-auto max-w-2xl text-lg text-stone-600 dark:text-stone-400">
						{featuredProjects.length === 1 
							? "An in-depth look at a comprehensive development project showcasing real-world engineering expertise"
							: "Comprehensive development projects demonstrating real-world engineering approaches"
						}
					</p>
				</motion.div>

				{/* Dynamic Projects Grid - adapts to 1, 2, or 3+ items */}
				<div className={`mb-12 ${getGridClasses()}`}>
					{featuredProjects.map((project, index) => (
						<AnimatedProjectCard 
							key={project.id} 
							project={project} 
							index={index}
							featured={featuredProjects.length === 1}
						/>
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
							aria-label="View all projects"
						>
							View All Projects
							<ArrowRight 
								className={`${ICON_SPACING.right} transition-transform group-hover:translate-x-1`} 
								aria-hidden="true"
							/>
						</Link>
					</Button>
					<div id="view-all-projects-description" className="sr-only">
						Navigate to the projects page to view all projects and case studies
					</div>
				</motion.div>
			</div>
		</section>
	);
}
