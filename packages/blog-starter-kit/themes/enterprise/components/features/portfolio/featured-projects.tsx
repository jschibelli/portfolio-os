import { motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import portfolioData from '../../../data/portfolio.json';
import { Button } from '../../ui/button';
import ProjectCard, { Project } from './project-card';

export default function FeaturedProjects() {
	// Convert portfolio data to Project interface
	const featuredProjects: Project[] = portfolioData.slice(0, 3).map((item: any) => ({
		id: item.id,
		title: item.title,
		description: item.description,
		image: item.image,
		tags: item.tags,
		caseStudyUrl: item.caseStudyUrl,
		slug: item.slug,
		metrics: item.metrics,
		caseStudyPreview: item.caseStudyPreview,
	}));

	return (
		<section className="bg-white py-20 dark:bg-stone-950">
			<div className="container mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: 'easeOut' }}
					viewport={{ once: true }}
					className="mb-16 text-center"
				>
					<h2 className="mb-4 text-3xl font-bold text-stone-900 md:text-4xl dark:text-stone-100">
						Featured Projects
					</h2>
					<p className="mx-auto max-w-2xl text-xl text-stone-600 dark:text-stone-400">
						A selection of recent projects showcasing modern web development solutions with concrete results and case study insights
					</p>
				</motion.div>

				{/* Projects Grid */}
				<div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					{featuredProjects.map((project, index) => (
						<ProjectCard key={project.id} project={project} index={index} />
					))}
				</div>

				{/* View All Projects CTA */}
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
					>
						<Link href="/projects">
							View All Projects
							<ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
						</Link>
					</Button>
				</motion.div>
			</div>
		</section>
	);
}
