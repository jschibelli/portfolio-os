'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ProjectMeta } from '../../../data/projects/types';
import { typeRole } from '../../../lib/typography';

interface AnimatedProjectCardProps {
	project: ProjectMeta;
	index: number;
	featured?: boolean;
	headingLevel?: 'h2' | 'h3';
}

export function AnimatedProjectCard({
	project,
	index,
	featured = false,
	headingLevel = 'h3',
}: AnimatedProjectCardProps) {
	const MotionTitle = headingLevel === 'h2' ? motion.h2 : motion.h3;
	// Featured layout for single projects (horizontal, side-by-side)
	if (featured) {
		return (
			<motion.article
				key={project.id}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{
					duration: 0.5,
					ease: 'easeOut',
				}}
				className="overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-stone-800"
			>
				<div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
					{/* Image Section */}
					<motion.div
						className="relative h-64 overflow-hidden bg-stone-200 md:h-96 lg:h-full dark:bg-stone-700"
						whileHover={{ scale: 1.02 }}
						transition={{ duration: 0.3, ease: 'easeOut' }}
					>
						<img
							src={project.image}
							alt={`${project.title} project screenshot`}
							className="h-full w-full object-cover"
							loading="eager"
						/>
					</motion.div>

					{/* Content Section */}
					<div className="flex flex-col justify-center p-8 md:p-12">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.2 }}
							className="mb-4"
						>
							<span
								className={`inline-block rounded-full bg-stone-100 px-3 py-1 text-stone-600 dark:bg-stone-700 dark:text-stone-400 ${typeRole.eyebrow}`}
							>
								Featured Project
							</span>
						</motion.div>

						<MotionTitle
							className={`mb-4 text-stone-900 dark:text-stone-100 ${typeRole.cardTitle}`}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.3 }}
						>
							{project.title}
						</MotionTitle>

						<motion.p
							className={`mb-6 text-stone-600 dark:text-stone-400 ${typeRole.body}`}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.4 }}
						>
							{project.description}
						</motion.p>

						<motion.div
							className="mb-6 flex flex-wrap gap-1.5"
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.5 }}
						>
							{project.tags.slice(0, 6).map((tag, tagIndex) => (
								<motion.span
									key={tag}
									className={`inline-block rounded bg-stone-100 px-2 py-1 text-stone-700 dark:bg-stone-700 dark:text-stone-300 ${typeRole.small}`}
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{
										delay: 0.6 + tagIndex * 0.05,
										duration: 0.2,
									}}
									whileHover={{ scale: 1.05, y: -1 }}
								>
									{tag}
								</motion.span>
							))}
							{project.tags.length > 6 && (
								<motion.span
									className={`inline-block rounded bg-stone-100 px-2 py-1 text-stone-700 dark:bg-stone-700 dark:text-stone-300 ${typeRole.small}`}
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{
										delay: 0.6 + 6 * 0.05,
										duration: 0.2,
									}}
									whileHover={{ scale: 1.05, y: -1 }}
								>
									+{project.tags.length - 6} more
								</motion.span>
							)}
						</motion.div>

						<motion.div
							className="flex flex-wrap gap-2"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.7 }}
						>
							{project.caseStudyUrl && (
								<motion.a
									href={project.caseStudyUrl}
									className={`inline-flex items-center gap-1.5 rounded-lg bg-stone-900 px-4 py-2 text-white transition-colors hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 ${typeRole.smallControl}`}
									whileHover={{ scale: 1.03, y: -1 }}
									whileTap={{ scale: 0.97 }}
								>
									Case Study <ArrowRight className="h-3.5 w-3.5" />
								</motion.a>
							)}
							<motion.a
								href={`/projects/${project.slug}`}
								className={`inline-flex items-center gap-1.5 rounded-lg border border-stone-300 px-4 py-2 text-stone-700 transition-colors hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-700 ${typeRole.smallControl}`}
								whileHover={{ scale: 1.03, y: -1 }}
								whileTap={{ scale: 0.97 }}
							>
								View Details <ArrowRight className="h-3.5 w-3.5" />
							</motion.a>
						</motion.div>
					</div>
				</div>
			</motion.article>
		);
	}

	// Standard grid layout for multiple projects
	return (
		<motion.article
			key={project.id}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				duration: 0.5,
				delay: index * 0.1,
				ease: 'easeOut',
			}}
			whileHover={{
				y: -8,
				transition: { duration: 0.2, ease: 'easeOut' },
			}}
			className="cursor-pointer overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-2xl dark:bg-stone-800"
		>
			<motion.div
				className="aspect-video overflow-hidden bg-stone-200 dark:bg-stone-700"
				whileHover={{ scale: 1.05 }}
				transition={{ duration: 0.3, ease: 'easeOut' }}
			>
				<img
					src={project.image}
					alt={`${project.title} project screenshot`}
					className="h-full w-full object-cover"
					loading={index < 6 ? 'eager' : 'lazy'}
				/>
			</motion.div>
			<div className="p-6">
				<MotionTitle
					className={`mb-2 text-stone-900 dark:text-stone-100 ${typeRole.cardTitle}`}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: index * 0.1 + 0.2 }}
				>
					{project.title}
				</MotionTitle>
				<motion.p
					className={`mb-4 line-clamp-3 text-stone-600 dark:text-stone-400 ${typeRole.body}`}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: index * 0.1 + 0.3 }}
				>
					{project.description}
				</motion.p>
				<motion.div
					className="mb-4 flex flex-wrap gap-2"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: index * 0.1 + 0.4 }}
				>
					{project.tags.slice(0, 3).map((tag, tagIndex) => (
						<motion.span
							key={tag}
							className={`inline-block bg-stone-100 text-stone-700 dark:bg-stone-700 dark:text-stone-300 ${typeRole.small} rounded px-2 py-1`}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{
								delay: index * 0.1 + 0.5 + tagIndex * 0.1,
								duration: 0.2,
							}}
							whileHover={{ scale: 1.05 }}
						>
							{tag}
						</motion.span>
					))}
					{project.tags.length > 3 && (
						<motion.span
							className={`inline-block bg-stone-100 text-stone-700 dark:bg-stone-700 dark:text-stone-300 ${typeRole.small} rounded px-2 py-1`}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{
								delay: index * 0.1 + 0.5 + 3 * 0.1,
								duration: 0.2,
							}}
							whileHover={{ scale: 1.05 }}
						>
							+{project.tags.length - 3} more
						</motion.span>
					)}
				</motion.div>
				<motion.div
					className="flex gap-2"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: index * 0.1 + 0.6 }}
				>
					{project.liveUrl && (
						<motion.a
							href={project.liveUrl}
							className={`inline-flex items-center rounded bg-stone-900 px-4 py-2 text-white transition-colors hover:bg-stone-800 ${typeRole.smallControl}`}
							target="_blank"
							rel="noopener noreferrer"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							View Live
						</motion.a>
					)}
					{project.caseStudyUrl && (
						<motion.a
							href={project.caseStudyUrl}
							className={`inline-flex items-center rounded border border-stone-300 px-4 py-2 text-stone-700 transition-colors hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-700 ${typeRole.smallControl}`}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							Case Study
						</motion.a>
					)}
					<motion.a
						href={`/projects/${project.slug}`}
						className={`inline-flex items-center rounded border border-stone-300 px-4 py-2 text-stone-700 transition-colors hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-700 ${typeRole.smallControl}`}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						Details
					</motion.a>
				</motion.div>
			</div>
		</motion.article>
	);
}
