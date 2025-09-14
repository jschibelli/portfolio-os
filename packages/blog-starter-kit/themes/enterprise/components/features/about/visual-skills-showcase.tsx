import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
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
 * Rotating Skills Sphere Component
 * Creates a 3D-like rotating sphere of interconnected skills with dynamic focus
 */
export default function VisualSkillsShowcase({ className = '' }: VisualSkillsShowcaseProps) {
	const [focusedSkill, setFocusedSkill] = useState<Skill | null>(null);
	const [isHovered, setIsHovered] = useState(false);
	const controls = useAnimation();

	// Generate 3D sphere positions for skills with proper connections
	const generateSpherePositions = (skills: Skill[]) => {
		const positions: Array<{ skill: Skill; x: number; y: number; z: number; connections: number[] }> = [];
		const radius = 180;
		
		// Create a more structured sphere with proper connections
		skills.forEach((skill, index) => {
			// Use Fibonacci spiral for better distribution
			const goldenRatio = (1 + Math.sqrt(5)) / 2;
			const theta = index * 2 * Math.PI / goldenRatio;
			const phi = Math.acos(1 - 2 * index / skills.length);
			
			const x = radius * Math.sin(phi) * Math.cos(theta);
			const y = radius * Math.sin(phi) * Math.sin(theta);
			const z = radius * Math.cos(phi);
			
			// Find nearby skills to connect to
			const connections: number[] = [];
			positions.forEach((pos, i) => {
				const distance = Math.sqrt(
					Math.pow(x - pos.x, 2) + 
					Math.pow(y - pos.y, 2) + 
					Math.pow(z - pos.z, 2)
				);
				// Connect to nearby skills (within 120 units)
				if (distance < 120) {
					connections.push(i);
					pos.connections.push(positions.length);
				}
			});
			
			positions.push({ skill, x, y, z, connections });
		});
		
		return positions;
	};

	const spherePositions = generateSpherePositions(skills);

	// Auto-rotate and focus on skills
	useEffect(() => {
		if (!isHovered) {
			const interval = setInterval(() => {
				const randomIndex = Math.floor(Math.random() * skills.length);
				setFocusedSkill(skills[randomIndex]);
			}, 3000);

			return () => clearInterval(interval);
		}
	}, [isHovered]);

	// Category color mapping
	const getCategoryColor = (category: string) => {
		const colors = {
			'Frontend': '#10b981', // emerald-500
			'Backend': '#8b5cf6', // violet-500
			'Tools & Platforms': '#f59e0b', // amber-500
			'Specialties': '#ec4899' // pink-500
		};
		return colors[category as keyof typeof colors] || '#6b7280';
	};

	return (
		<div className={`relative overflow-hidden ${className}`}>
			{/* Subtle Background */}
			<div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-white to-stone-100 dark:from-stone-900 dark:via-stone-800 dark:to-stone-900" />
			
			<div className="relative py-20">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="mb-16 text-center"
				>
					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						whileInView={{ scale: 1, opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						viewport={{ once: true }}
						className="mb-6 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 px-6 py-3 backdrop-blur-sm"
					>
						<span className="text-2xl">🚀</span>
						<span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Technical Expertise</span>
					</motion.div>
					
					<motion.h3
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.3 }}
						viewport={{ once: true }}
						className="mb-6 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 bg-clip-text text-4xl font-bold text-transparent dark:from-stone-100 dark:via-stone-200 dark:to-stone-100 md:text-5xl"
					>
						Skills & Technologies
					</motion.h3>
					
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						viewport={{ once: true }}
						className="mx-auto max-w-3xl text-lg text-stone-600 dark:text-stone-400"
					>
						Building modern, scalable applications with cutting-edge technologies that drive business success
					</motion.p>
				</motion.div>

				{/* Rotating Skills Globe */}
				<div className="relative flex items-center justify-center">
					<div 
						className="relative h-[600px] w-[600px] md:h-[700px] md:w-[700px]"
						onMouseEnter={() => setIsHovered(true)}
						onMouseLeave={() => setIsHovered(false)}
					>
						{/* Globe Container with 3D perspective */}
						<motion.div
							className="absolute inset-0"
							animate={{ 
								rotateY: isHovered ? 0 : 360,
								rotateX: isHovered ? 0 : 15
							}}
							transition={{ 
								duration: 30, 
								repeat: Infinity, 
								ease: "linear" 
							}}
							style={{ 
								transformStyle: 'preserve-3d',
								perspective: '1000px'
							}}
						>
							{/* Connection Lines - Globe Network */}
							<svg className="absolute inset-0 h-full w-full" style={{ zIndex: 1 }}>
								{spherePositions.map((pos, i) => 
									pos.connections.map((connectionIndex) => {
										const connectedPos = spherePositions[connectionIndex];
										if (!connectedPos) return null;
										
										const isFocused = focusedSkill && 
											(focusedSkill.name === pos.skill.name || focusedSkill.name === connectedPos.skill.name);
										
										// Convert 3D to 2D screen coordinates
										const x1 = 50 + (pos.x / 3.5);
										const y1 = 50 + (pos.y / 3.5);
										const x2 = 50 + (connectedPos.x / 3.5);
										const y2 = 50 + (connectedPos.y / 3.5);
										
										return (
											<motion.line
												key={`${i}-${connectionIndex}`}
												x1={`${x1}%`}
												y1={`${y1}%`}
												x2={`${x2}%`}
												y2={`${y2}%`}
												stroke={isFocused ? getCategoryColor(pos.skill.category) : '#d1d5db'}
												strokeWidth={isFocused ? 3 : 1.5}
												opacity={isFocused ? 0.9 : 0.4}
												initial={{ pathLength: 0 }}
												animate={{ pathLength: 1 }}
												transition={{ duration: 3, delay: i * 0.02 }}
											/>
										);
									})
								)}
							</svg>

							{/* Skills Nodes */}
							{spherePositions.map((pos, index) => {
								const isFocused = focusedSkill?.name === pos.skill.name;
								const categoryColor = getCategoryColor(pos.skill.category);
								
								// Convert 3D coordinates to 2D screen coordinates
								const screenX = 50 + (pos.x / 3.5);
								const screenY = 50 + (pos.y / 3.5);
								const scale = isFocused ? 1.8 : 1;
								const zIndex = isFocused ? 10 : 2;
								
								return (
									<motion.div
										key={pos.skill.name}
										className="absolute cursor-pointer"
										style={{
											left: `${screenX}%`,
											top: `${screenY}%`,
											transform: 'translate(-50%, -50%)',
											zIndex
										}}
										initial={{ opacity: 0, scale: 0 }}
										animate={{ 
											opacity: isFocused ? 1 : 0.8,
											scale
										}}
										transition={{ 
											duration: 0.6,
											delay: index * 0.03
										}}
										whileHover={{ 
											scale: 1.4,
											transition: { duration: 0.2 }
										}}
										onClick={() => setFocusedSkill(isFocused ? null : pos.skill)}
									>
										{/* Skill Node with Glow */}
										<div 
											className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 bg-white/95 shadow-xl backdrop-blur-sm transition-all duration-300 dark:bg-stone-800/95"
											style={{
												borderColor: categoryColor,
												boxShadow: isFocused 
													? `0 0 30px ${categoryColor}60, 0 0 60px ${categoryColor}30` 
													: `0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 1px ${categoryColor}20`
											}}
										>
											{/* Inner glow */}
											<div 
												className="absolute inset-1 rounded-full opacity-20"
												style={{ backgroundColor: categoryColor }}
											/>
											
											<span className="relative text-xl" role="img" aria-label={pos.skill.name}>
												{pos.skill.icon}
											</span>
										</div>
										
										{/* Skill Label */}
										{isFocused && (
											<motion.div
												initial={{ opacity: 0, y: 15, scale: 0.8 }}
												animate={{ opacity: 1, y: 0, scale: 1 }}
												className="absolute top-16 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white shadow-2xl dark:bg-stone-100 dark:text-stone-900"
											>
												{pos.skill.name}
												<div className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-stone-900 dark:bg-stone-100" />
											</motion.div>
										)}
									</motion.div>
								);
							})}
						</motion.div>
					</div>
				</div>

				{/* Focused Skill Details */}
				{focusedSkill && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="mt-12 text-center"
					>
						<div className="mx-auto max-w-md rounded-2xl border border-stone-200 bg-white/50 p-6 backdrop-blur-sm dark:border-stone-700 dark:bg-stone-800/50">
							<div 
								className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 bg-white shadow-lg dark:bg-stone-800"
								style={{ borderColor: getCategoryColor(focusedSkill.category) }}
							>
								<span className="text-2xl" role="img" aria-label={focusedSkill.name}>
									{focusedSkill.icon}
								</span>
							</div>
							<h4 className="mb-2 text-xl font-bold text-stone-900 dark:text-stone-100">
								{focusedSkill.name}
							</h4>
							<p className="text-sm text-stone-600 dark:text-stone-400">
								{focusedSkill.category}
							</p>
						</div>
					</motion.div>
				)}

				{/* Experience Summary */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.3 }}
					viewport={{ once: true }}
					className="mt-20"
				>
					<div className="mx-auto max-w-4xl rounded-3xl border border-stone-200/50 bg-white/30 p-8 backdrop-blur-sm dark:border-stone-700/50 dark:bg-stone-800/30">
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6, delay: 0.5 }}
							viewport={{ once: true }}
							className="text-center"
						>
							<h4 className="mb-2 text-2xl font-bold text-stone-900 dark:text-stone-100">
								Experience Summary
							</h4>
							<p className="mb-8 text-stone-600 dark:text-stone-400">
								Comprehensive expertise across modern technologies
							</p>
						</motion.div>
						
						<div className="grid grid-cols-2 gap-6 md:grid-cols-4">
							{[
								{ value: skills.length, label: 'Total Skills', color: 'from-emerald-500 to-teal-500' },
								{ value: 4, label: 'Categories', color: 'from-purple-500 to-violet-500' },
								{ value: '15+', label: 'Years Experience', color: 'from-orange-500 to-amber-500' },
								{ value: '100%', label: 'Client Satisfaction', color: 'from-rose-500 to-pink-500' }
							].map((stat, index) => (
								<motion.div
									key={stat.label}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
									viewport={{ once: true }}
									className="text-center"
								>
									<motion.div
										whileHover={{ scale: 1.1 }}
										transition={{ duration: 0.2 }}
										className={`mb-2 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${stat.color} text-white shadow-lg`}
									>
										<span className="text-xl font-bold">{stat.value}</span>
									</motion.div>
									<div className="text-sm font-medium text-stone-600 dark:text-stone-400">
										{stat.label}
									</div>
								</motion.div>
							))}
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
