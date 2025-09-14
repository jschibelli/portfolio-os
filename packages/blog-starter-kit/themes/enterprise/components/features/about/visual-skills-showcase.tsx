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
			icon: '💻',
			description: 'Programming languages and core technologies'
		},
		'Frontend': { 
			color: 'from-green-500 to-green-600', 
			bgColor: 'bg-green-50 dark:bg-green-950/20',
			borderColor: 'border-green-200 dark:border-green-800',
			icon: '⚛️',
			description: 'Modern frontend frameworks and technologies'
		},
		'Front-End': { 
			color: 'from-green-500 to-green-600', 
			bgColor: 'bg-green-50 dark:bg-green-950/20',
			borderColor: 'border-green-200 dark:border-green-800',
			icon: '⚛️',
			description: 'Modern frontend frameworks and technologies'
		},
		'Backend': { 
			color: 'from-purple-500 to-purple-600', 
			bgColor: 'bg-purple-50 dark:bg-purple-950/20',
			borderColor: 'border-purple-200 dark:border-purple-800',
			icon: '🖥️',
			description: 'Server-side development and APIs'
		},
		'Back-End': { 
			color: 'from-purple-500 to-purple-600', 
			bgColor: 'bg-purple-50 dark:bg-purple-950/20',
			borderColor: 'border-purple-200 dark:border-purple-800',
			icon: '🖥️',
			description: 'Server-side development and APIs'
		},
		'APIs': { 
			color: 'from-orange-500 to-orange-600', 
			bgColor: 'bg-orange-50 dark:bg-orange-950/20',
			borderColor: 'border-orange-200 dark:border-orange-800',
			icon: '🔗',
			description: 'API development and integration'
		},
		'Testing': { 
			color: 'from-red-500 to-red-600', 
			bgColor: 'bg-red-50 dark:bg-red-950/20',
			borderColor: 'border-red-200 dark:border-red-800',
			icon: '🧪',
			description: 'Testing frameworks and quality assurance'
		},
		'DevOps': { 
			color: 'from-indigo-500 to-indigo-600', 
			bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
			borderColor: 'border-indigo-200 dark:border-indigo-800',
			icon: '⚙️',
			description: 'Development tools and cloud platforms'
		},
		'Tools & Platforms': { 
			color: 'from-orange-500 to-orange-600', 
			bgColor: 'bg-orange-50 dark:bg-orange-950/20',
			borderColor: 'border-orange-200 dark:border-orange-800',
			icon: '⚙️',
			description: 'Development tools and cloud platforms'
		},
		'Databases': { 
			color: 'from-teal-500 to-teal-600', 
			bgColor: 'bg-teal-50 dark:bg-teal-950/20',
			borderColor: 'border-teal-200 dark:border-teal-800',
			icon: '🗄️',
			description: 'Database technologies and data management'
		},
		'CMS': { 
			color: 'from-pink-500 to-pink-600', 
			bgColor: 'bg-pink-50 dark:bg-pink-950/20',
			borderColor: 'border-pink-200 dark:border-pink-800',
			icon: '📝',
			description: 'Content management systems'
		},
		'Specialties': { 
			color: 'from-emerald-500 to-emerald-600', 
			bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
			borderColor: 'border-emerald-200 dark:border-emerald-800',
			icon: '✨',
			description: 'Specialized skills and expertise areas'
		},
	};

	return (
		<div className={`space-y-12 ${className}`}>
			{/* Enhanced Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: 'easeOut' }}
				viewport={{ once: true }}
				className="text-center"
			>
				<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300">
					<span className="text-lg">🚀</span>
					<span>Technical Expertise</span>
				</div>
				<h3 className="mb-4 text-3xl font-bold text-stone-900 dark:text-stone-100 md:text-4xl">
					Skills & Technologies
				</h3>
				<p className="mx-auto max-w-2xl text-lg text-stone-600 dark:text-stone-400">
					Cutting-edge technologies and tools I use to build modern, scalable applications that drive business success
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
							{/* Enhanced Category Header */}
							<div className="mb-4 flex items-start gap-3 sm:mb-6 sm:gap-4">
								<div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${config.color} text-white shadow-lg sm:h-14 sm:w-14`}>
									<span className="text-lg sm:text-xl" role="img" aria-label={category}>
										{config.icon}
									</span>
								</div>
								<div className="flex-1">
									<h4 className="mb-1 text-lg font-bold text-stone-900 dark:text-stone-100 sm:text-xl">
										{category}
									</h4>
									<p className="mb-2 text-sm text-stone-600 dark:text-stone-400">
										{config.description}
									</p>
									<div className="flex items-center gap-2">
										<div className="h-1.5 w-16 rounded-full bg-stone-200 dark:bg-stone-700">
											<div className={`h-full rounded-full bg-gradient-to-r ${config.color}`}></div>
										</div>
										<span className="text-xs font-medium text-stone-500 dark:text-stone-400">
											{categorySkills.length} skills
										</span>
									</div>
								</div>
							</div>

							{/* Enhanced Skills Grid */}
							<div className="grid grid-cols-2 gap-3 sm:gap-4">
								{categorySkills.map((skill, skillIndex) => {
									// Generate proficiency level based on skill name (for demo purposes)
									const proficiencyLevel = skill.name.includes('React') || skill.name.includes('Next.js') || skill.name.includes('TypeScript') ? 90 :
															skill.name.includes('Node.js') || skill.name.includes('JavaScript') ? 85 :
															skill.name.includes('Tailwind') || skill.name.includes('CSS') ? 80 : 75;

									return (
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
												y: -3,
												transition: { duration: 0.2 }
											}}
											whileTap={{ scale: 0.95 }}
											className="group cursor-pointer"
										>
											<div 
												className="relative overflow-hidden rounded-xl border border-stone-200 bg-white p-3 text-center transition-all duration-300 hover:border-stone-300 hover:shadow-lg hover:shadow-stone-200/50 dark:border-stone-700 dark:bg-stone-800 dark:hover:border-stone-600 dark:hover:shadow-stone-900/50 sm:p-4"
												tabIndex={0}
												role="button"
												aria-label={`${skill.name} skill in ${category} category - ${proficiencyLevel}% proficiency`}
												onKeyDown={(e) => {
													if (e.key === 'Enter' || e.key === ' ') {
														e.preventDefault();
													}
												}}
											>
												{/* Skill Icon */}
												<div className="mb-2 flex justify-center">
													<span 
														className="text-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 sm:text-3xl" 
														role="img" 
														aria-hidden="true"
													>
														{skill.icon}
													</span>
												</div>
												
												{/* Skill Name */}
												<h5 className="mb-2 text-xs font-semibold text-stone-800 dark:text-stone-200 sm:text-sm">
													{skill.name}
												</h5>
												
												{/* Proficiency Indicator */}
												<div className="space-y-1">
													<div className="h-1.5 w-full rounded-full bg-stone-200 dark:bg-stone-700">
														<motion.div 
															initial={{ width: 0 }}
															whileInView={{ width: `${proficiencyLevel}%` }}
															transition={{ 
																duration: 0.8, 
																ease: 'easeOut',
																delay: (categoryIndex * 0.1) + (skillIndex * 0.05) + 0.3
															}}
															viewport={{ once: true }}
															className={`h-full rounded-full bg-gradient-to-r ${config.color}`}
														/>
													</div>
													<div className="text-xs font-medium text-stone-500 dark:text-stone-400">
														{proficiencyLevel}%
													</div>
												</div>

												{/* Hover Effect Overlay */}
												<div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${config.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
											</div>
										</motion.div>
									);
								})}
							</div>

							{/* Decorative gradient overlay */}
							<div className={`absolute -right-4 -top-4 h-16 w-16 rounded-full bg-gradient-to-r ${config.color} opacity-10 blur-xl`} />
						</motion.div>
					);
				})}
			</div>

			{/* Enhanced Summary Stats */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
				viewport={{ once: true }}
				className="relative overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-br from-stone-50 via-white to-stone-100 p-6 shadow-lg dark:border-stone-700 dark:from-stone-800 dark:via-stone-900 dark:to-stone-800 sm:p-8"
			>
				{/* Background decoration */}
				<div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-2xl" />
				<div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-gradient-to-br from-orange-500/20 to-emerald-500/20 blur-xl" />
				
				<div className="relative">
					<div className="mb-4 text-center">
						<h4 className="text-lg font-bold text-stone-900 dark:text-stone-100 sm:text-xl">
							Experience Summary
						</h4>
						<p className="text-sm text-stone-600 dark:text-stone-400">
							Comprehensive expertise across modern technologies
						</p>
					</div>
					
					<div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
						<motion.div 
							initial={{ opacity: 0, scale: 0.8 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.4, delay: 0.4 }}
							viewport={{ once: true }}
							className="text-center"
						>
							<div className="mb-2 text-2xl font-bold text-blue-600 dark:text-blue-400 sm:text-3xl">
								{skills.length}
							</div>
							<div className="text-xs font-medium text-stone-600 dark:text-stone-400 sm:text-sm">
								Total Skills
							</div>
						</motion.div>
						
						<motion.div 
							initial={{ opacity: 0, scale: 0.8 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.4, delay: 0.5 }}
							viewport={{ once: true }}
							className="text-center"
						>
							<div className="mb-2 text-2xl font-bold text-purple-600 dark:text-purple-400 sm:text-3xl">
								{Object.keys(skillsByCategory).length}
							</div>
							<div className="text-xs font-medium text-stone-600 dark:text-stone-400 sm:text-sm">
								Categories
							</div>
						</motion.div>
						
						<motion.div 
							initial={{ opacity: 0, scale: 0.8 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.4, delay: 0.6 }}
							viewport={{ once: true }}
							className="text-center"
						>
							<div className="mb-2 text-2xl font-bold text-orange-600 dark:text-orange-400 sm:text-3xl">
								15+
							</div>
							<div className="text-xs font-medium text-stone-600 dark:text-stone-400 sm:text-sm">
								Years Experience
							</div>
						</motion.div>
						
						<motion.div 
							initial={{ opacity: 0, scale: 0.8 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.4, delay: 0.7 }}
							viewport={{ once: true }}
							className="text-center"
						>
							<div className="mb-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400 sm:text-3xl">
								100%
							</div>
							<div className="text-xs font-medium text-stone-600 dark:text-stone-400 sm:text-sm">
								Client Satisfaction
							</div>
						</motion.div>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
