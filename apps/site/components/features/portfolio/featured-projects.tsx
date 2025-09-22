"use client";
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { allProjects } from '../../../data/projects';
import { Button } from '../../ui/button';

/**
 * FeaturedProjects component displays a selection of featured portfolio projects
 * with proper error handling, accessibility, and responsive design
 */
export default function FeaturedProjects() {
	// Comprehensive error handling for missing or invalid portfolio data
	if (!allProjects || !Array.isArray(allProjects)) {
		console.error('FeaturedProjects: Invalid or missing portfolio data', {
			allProjects,
			isArray: Array.isArray(allProjects),
			timestamp: new Date().toISOString()
		});
		return (
			<section 
				className="bg-white py-20 dark:bg-stone-950"
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
	const featuredProjects = allProjects.filter(project => project.featured !== false).slice(0, 3);

	return (
		<section 
			className="bg-white py-16 dark:bg-stone-950"
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
						<motion.div
							key={project.id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
							viewport={{ once: true }}
							className="bg-stone-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
						>
							<div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
								<span className="text-4xl">🚀</span>
							</div>
							<div className="p-6">
								<h3 className="text-xl font-bold text-white mb-2">
									{project.title}
								</h3>
								<p className="text-stone-300 mb-4 line-clamp-3">
									{project.description}
								</p>
								<div className="flex flex-wrap gap-2 mb-4">
									{project.tags.slice(0, 3).map((tag) => (
										<span key={tag} className="px-2 py-1 bg-stone-600 text-stone-300 rounded-full text-xs">
											{tag}
										</span>
									))}
								</div>
								<Link 
									href={`/projects/${project.slug}`}
									className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium"
								>
									View Project
                                    <ArrowRight className="ml-1 h-4 w-4" />
								</Link>
							</div>
						</motion.div>
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
						className="group px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
						asChild
						aria-describedby="view-all-projects-description"
					>
						<Link 
							href="/projects"
							aria-label="View all portfolio projects"
						>
							View All Projects
                            <ArrowRight 
								className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" 
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