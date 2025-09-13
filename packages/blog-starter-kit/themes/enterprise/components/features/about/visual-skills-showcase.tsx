import { motion } from 'framer-motion';
import { skills } from '../../../data/skills';

interface Skill {
	name: string;
	icon: string;
	category: string;
}

interface VisualSkillsShowcaseProps {
	className?: string;
}

/**
 * Visual Skills Showcase Component
 * Displays skills in a visually appealing grid with icons, categories, and hover effects
 */
export default function VisualSkillsShowcase({ className = '' }: VisualSkillsShowcaseProps) {
	// Group skills by category
	const skillsByCategory = skills.reduce((acc: Record<string, Skill[]>, skill) => {
		if (!acc[skill.category]) {
			acc[skill.category] = [];
		}
		acc[skill.category].push(skill);
		return acc;
	}, {});

	// Define category colors and icons for visual hierarchy
	const categoryConfig = {
		'Languages': { 
			color: 'from-blue-500 to-blue-600', 
			bgColor: 'bg-blue-50 dark:bg-blue-950/20',
			borderColor: 'border-blue-200 dark:border-blue-800',
			icon: '💻'
		},
		'Front-End': { 
			color: 'from-green-500 to-green-600', 
			bgColor: 'bg-green-50 dark:bg-green-950/20',
			borderColor: 'border-green-200 dark:border-green-800',
			icon: '⚛️'
		},
		'Back-End': { 
			color: 'from-purple-500 to-purple-600', 
			bgColor: 'bg-purple-50 dark:bg-purple-950/20',
			borderColor: 'border-purple-200 dark:border-purple-800',
			icon: '🖥️'
		},
		'APIs': { 
			color: 'from-orange-500 to-orange-600', 
			bgColor: 'bg-orange-50 dark:bg-orange-950/20',
			borderColor: 'border-orange-200 dark:border-orange-800',
			icon: '🔗'
		},
		'Testing': { 
			color: 'from-red-500 to-red-600', 
			bgColor: 'bg-red-50 dark:bg-red-950/20',
			borderColor: 'border-red-200 dark:border-red-800',
			icon: '🧪'
		},
		'DevOps': { 
			color: 'from-indigo-500 to-indigo-600', 
			bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
			borderColor: 'border-indigo-200 dark:border-indigo-800',
			icon: '⚙️'
		},
		'Databases': { 
			color: 'from-teal-500 to-teal-600', 
			bgColor: 'bg-teal-50 dark:bg-teal-950/20',
			borderColor: 'border-teal-200 dark:border-teal-800',
			icon: '🗄️'
		},
		'CMS': { 
			color: 'from-pink-500 to-pink-600', 
			bgColor: 'bg-pink-50 dark:bg-pink-950/20',
			borderColor: 'border-pink-200 dark:border-pink-800',
			icon: '📝'
		},
	};

	return (
		<div className={`space-y-8 ${className}`}>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: 'easeOut' }}
				viewport={{ once: true }}
				className="text-center"
			>
				<h3 className="mb-2 text-2xl font-bold text-stone-900 dark:text-stone-100">
					Skills & Technologies
				</h3>
				<p className="text-stone-600 dark:text-stone-400">
					Technologies and tools I use to build modern, scalable applications
				</p>
			</motion.div>

			{/* Skills Grid by Category */}
			<div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
				{Object.entries(skillsByCategory).map(([category, categorySkills], categoryIndex) => {
					const config = categoryConfig[category as keyof typeof categoryConfig] || {
						color: 'from-stone-500 to-stone-600',
						bgColor: 'bg-stone-50 dark:bg-stone-950/20',
						borderColor: 'border-stone-200 dark:border-stone-800',
						icon: '🔧'
					};

					return (
						<motion.div
							key={category}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ 
								duration: 0.6, 
								ease: 'easeOut',
								delay: categoryIndex * 0.1 
							}}
							viewport={{ once: true }}
							className={`relative overflow-hidden rounded-xl border-2 ${config.borderColor} ${config.bgColor} p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 sm:p-6`}
						>
							{/* Category Header */}
							<div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
								<div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r ${config.color} text-white shadow-sm sm:h-10 sm:w-10`}>
									<span className="text-sm sm:text-lg" role="img" aria-label={category}>
										{config.icon}
									</span>
								</div>
								<div>
									<h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 sm:text-base">
										{category}
									</h4>
									<p className="text-xs text-stone-500 dark:text-stone-400">
										{categorySkills.length} {categorySkills.length === 1 ? 'skill' : 'skills'}
									</p>
								</div>
							</div>

							{/* Skills Grid */}
							<div className="grid grid-cols-2 gap-2 sm:gap-3">
								{categorySkills.map((skill, skillIndex) => (
									<motion.div
										key={skill.name}
										initial={{ opacity: 0, scale: 0.8 }}
										whileInView={{ opacity: 1, scale: 1 }}
										transition={{ 
											duration: 0.4, 
											ease: 'easeOut',
											delay: (categoryIndex * 0.1) + (skillIndex * 0.05)
										}}
										viewport={{ once: true }}
										whileHover={{ 
											scale: 1.05, 
											y: -2,
											transition: { duration: 0.2 }
										}}
										whileTap={{ scale: 0.95 }}
										className="group cursor-pointer focus-within:ring-2 focus-within:ring-stone-400 focus-within:ring-offset-2 dark:focus-within:ring-stone-500"
									>
										<div 
											className="flex flex-col items-center gap-1 rounded-lg border border-stone-200 bg-white p-2 text-center transition-all duration-200 hover:border-stone-300 hover:shadow-md focus:outline-none sm:gap-2 sm:p-3 dark:border-stone-700 dark:bg-stone-800 dark:hover:border-stone-600"
											tabIndex={0}
											role="button"
											aria-label={`${skill.name} skill in ${category} category`}
											onKeyDown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													// Could add tooltip or additional info here
												}
											}}
										>
											<span 
												className="text-xl transition-transform duration-200 group-hover:scale-110 sm:text-2xl" 
												role="img" 
												aria-hidden="true"
											>
												{skill.icon}
											</span>
											<span className="text-xs font-medium text-stone-700 dark:text-stone-300 sm:text-xs">
												{skill.name}
											</span>
										</div>
									</motion.div>
								))}
							</div>

							{/* Decorative gradient overlay */}
							<div className={`absolute -right-4 -top-4 h-16 w-16 rounded-full bg-gradient-to-r ${config.color} opacity-10 blur-xl`} />
						</motion.div>
					);
				})}
			</div>

			{/* Summary Stats */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
				viewport={{ once: true }}
				className="rounded-xl border border-stone-200 bg-gradient-to-r from-stone-50 to-stone-100 p-4 dark:border-stone-700 dark:from-stone-800 dark:to-stone-900 sm:p-6"
			>
				<div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
					<div className="text-center">
						<div className="text-xl font-bold text-stone-900 dark:text-stone-100 sm:text-2xl">
							{skills.length}
						</div>
						<div className="text-xs text-stone-600 dark:text-stone-400 sm:text-sm">
							Total Skills
						</div>
					</div>
					<div className="text-center">
						<div className="text-xl font-bold text-stone-900 dark:text-stone-100 sm:text-2xl">
							{Object.keys(skillsByCategory).length}
						</div>
						<div className="text-xs text-stone-600 dark:text-stone-400 sm:text-sm">
							Categories
						</div>
					</div>
					<div className="text-center">
						<div className="text-xl font-bold text-stone-900 dark:text-stone-100 sm:text-2xl">
							15+
						</div>
						<div className="text-xs text-stone-600 dark:text-stone-400 sm:text-sm">
							Years Experience
						</div>
					</div>
					<div className="text-center">
						<div className="text-xl font-bold text-stone-900 dark:text-stone-100 sm:text-2xl">
							100%
						</div>
						<div className="text-xs text-stone-600 dark:text-stone-400 sm:text-sm">
							Client Satisfaction
						</div>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
