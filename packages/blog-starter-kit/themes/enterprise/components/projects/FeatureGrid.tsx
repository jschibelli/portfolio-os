import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export interface Feature {
	id: string;
	title: string;
	description: string;
}

interface FeatureGridProps {
	features: Feature[];
	title?: string;
	description?: string;
	className?: string;
}

export default function FeatureGrid({ 
	features, 
	title = "Features", 
	description,
	className 
}: FeatureGridProps) {
	return (
		<section className={cn("py-16 bg-white dark:bg-stone-950", className)}>
			<div className="container mx-auto px-4">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: 'easeOut' }}
					viewport={{ once: true }}
					className="mb-12 text-center"
				>
					<h2 className="mb-4 text-3xl font-bold text-stone-900 md:text-4xl dark:text-stone-100">
						{title}
					</h2>
					{description && (
						<p className="mx-auto max-w-2xl text-lg text-stone-600 dark:text-stone-400">
							{description}
						</p>
					)}
				</motion.div>

				{/* Features Grid */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{features.map((feature, index) => (
						<motion.div
							key={feature.id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ 
								duration: 0.6, 
								delay: index * 0.1,
								ease: 'easeOut' 
							}}
							viewport={{ once: true }}
						>
							<Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-stone-200 dark:border-stone-800">
								<CardHeader className="pb-4">
									<CardTitle asChild>
										<h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
											{feature.title}
										</h3>
									</CardTitle>
								</CardHeader>
								<CardContent className="pt-0">
									<CardDescription className="text-base text-stone-600 dark:text-stone-400 leading-relaxed">
										{feature.description}
									</CardDescription>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
