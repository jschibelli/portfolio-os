import { motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
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
	if (project.slug) {
		return `/projects/${project.slug}`;
	}
	if (project.caseStudyUrl) {
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

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
			viewport={{ once: true }}
			whileHover={{ y: -8 }}
			className="h-full"
		>
			<Card className="group h-full overflow-hidden border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-xl">
				{/* Image */}
				<div className="relative h-48 overflow-hidden">
					<Image
						src={project.image}
						alt={project.title}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-105"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100" />

					{project.tags?.length ? (
						<div className="absolute left-4 top-4 transition-all duration-300 group-hover:scale-110">
							<Badge variant="secondary" className="bg-background/90 border border-border/50 shadow-lg backdrop-blur-sm">
								{project.tags[0]}
							</Badge>
						</div>
					) : null}

					<div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
						<div className="bg-primary/90 text-primary-foreground rounded-full px-4 py-2 text-sm font-medium backdrop-blur-sm">
							View Project
						</div>
					</div>
				</div>

				{/* Content */}
				<CardHeader className="pb-4">
					<h3 className="text-xl font-bold text-foreground transition-colors group-hover:text-foreground">
						{project.title}
					</h3>
				</CardHeader>

				<CardContent className="space-y-4">
					{/* Description */}
					<p className="leading-relaxed text-muted-foreground">
						{project.description}
					</p>

					{/* Tags */}
					<div className="flex flex-wrap gap-2">
						{project.tags?.slice(1, 3).map((tag, tagIndex) => (
							<Badge key={tagIndex} variant="outline" className="text-xs">
								{tag}
							</Badge>
						))}
					</div>

					{/* CTA Button */}
					<Button
						variant="outline"
						size="sm"
						className="group/btn w-full transition-all duration-300"
						asChild
					>
						<Link 
							href={projectLink}
							aria-label={`View details for ${project.title} project`}
						>
							View Project
							<ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
						</Link>
					</Button>
				</CardContent>
			</Card>
		</motion.div>
	);
}
