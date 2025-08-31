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
	caseStudyUrl: string;
}

interface ProjectCardProps {
	project: Project;
	index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
			viewport={{ once: true }}
			whileHover={{ y: -8 }}
			className="h-full"
		>
			<Card className="group h-full overflow-hidden border-stone-200 transition-all duration-300 hover:shadow-xl dark:border-stone-800">
				{/* Image */}
				<div className="relative h-48 overflow-hidden">
					<Image
						src={project.image}
						alt={project.title}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-105"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
				</div>

				{/* Content */}
				<CardHeader className="pb-4">
					<h3 className="text-xl font-bold text-stone-900 transition-colors group-hover:text-stone-700 dark:text-stone-100 dark:group-hover:text-stone-300">
						{project.title}
					</h3>
				</CardHeader>

				<CardContent className="space-y-4">
					{/* Description */}
					<p className="leading-relaxed text-stone-600 dark:text-stone-400">
						{project.description}
					</p>

					{/* Tags */}
					<div className="flex flex-wrap gap-2">
						{project.tags.map((tag, tagIndex) => (
							<Badge
								key={tagIndex}
								variant="secondary"
								className="bg-stone-100 text-xs text-stone-700 dark:bg-stone-800 dark:text-stone-300"
							>
								{tag}
							</Badge>
						))}
					</div>

					{/* CTA Button */}
					<Button
						variant="outline"
						size="sm"
						className="group/btn w-full border-stone-300 text-stone-700 transition-all duration-300 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
						asChild
					>
						<Link href={project.caseStudyUrl}>
							View Case Study
							<ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
						</Link>
					</Button>
				</CardContent>
			</Card>
		</motion.div>
	);
}
