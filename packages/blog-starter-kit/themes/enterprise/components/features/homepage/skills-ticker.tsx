import { motion } from 'framer-motion';
import { skills } from '../../../data/skills';

export default function SkillsTicker() {
	// Duplicate skills for seamless infinite scroll
	const duplicatedSkills = [...skills, ...skills];

	return (
		<section className="overflow-hidden bg-stone-100 py-16 dark:bg-stone-800">
			<div className="container mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: 'easeOut' }}
					viewport={{ once: true }}
					className="mb-12 text-center"
				>
					<h2 className="mb-4 text-3xl font-bold text-stone-900 dark:text-stone-100">
						Skills & Tools
					</h2>
					<p className="mx-auto max-w-2xl text-stone-600 dark:text-stone-400">
						Technologies and tools I use to build modern, scalable applications
					</p>
				</motion.div>

				{/* Skills Ticker */}
				<div className="relative">
					<div className="group flex overflow-hidden">
						<div
							className="animate-scroll flex items-center gap-8"
							style={{
								animationPlayState: 'running',
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.animationPlayState = 'paused';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.animationPlayState = 'running';
							}}
						>
							{duplicatedSkills.map((skill, index) => (
								<motion.div
									key={`${skill.name}-${index}`}
									className="flex flex-shrink-0 items-center gap-3 rounded-full border border-stone-200 bg-white px-6 py-3 shadow-sm dark:border-stone-700 dark:bg-stone-900"
									whileHover={{ scale: 1.05, y: -2 }}
									transition={{ duration: 0.2 }}
								>
									<span className="text-2xl" role="img" aria-label={skill.name}>
										{skill.icon}
									</span>
									<span className="whitespace-nowrap font-medium text-stone-700 dark:text-stone-300">
										{skill.name}
									</span>
								</motion.div>
							))}
						</div>
					</div>

					{/* Gradient overlays for smooth edges */}
					<div className="pointer-events-none absolute bottom-0 left-0 top-0 w-16 bg-gradient-to-r from-stone-100 to-transparent dark:from-stone-800" />
					<div className="pointer-events-none absolute bottom-0 right-0 top-0 w-16 bg-gradient-to-l from-stone-100 to-transparent dark:from-stone-800" />
				</div>

				{/* Category indicators */}
				<div className="mt-8 flex flex-wrap justify-center gap-4">
					{Array.from(new Set(skills.map((skill) => skill.category))).map((category) => (
						<span
							key={category}
							className="rounded-full bg-stone-200 px-3 py-1 text-xs font-medium text-stone-500 dark:bg-stone-700 dark:text-stone-400"
						>
							{category}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}
