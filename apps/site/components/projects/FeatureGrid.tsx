import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export interface Feature {
	id: string;
	title: string;
	description: string;
	icon?: React.ReactNode;
	image?: string;
	link?: string;
}

interface FeatureGridProps {
	features: Feature[];
	title?: string;
	description?: string;
	className?: string;
	maxColumns?: 2 | 3 | 4;
	showIcons?: boolean;
	onFeatureClick?: (feature: Feature) => void;
}

export default function FeatureGrid({ 
	features, 
	title = "Features", 
	description,
	className,
	maxColumns = 4,
	showIcons = false,
	onFeatureClick
}: FeatureGridProps) {
	// Input validation and error handling
	if (!features || !Array.isArray(features)) {
		console.error('FeatureGrid: features prop must be an array');
		return (
			<section className={cn("py-16 bg-white dark:bg-stone-950", className)}>
				<div className="container mx-auto px-4">
					<div className="text-center text-red-600 dark:text-red-400">
						<p>Error: Invalid features data provided</p>
					</div>
				</div>
			</section>
		);
	}

	if (features.length === 0) {
		return (
			<section className={cn("py-16 bg-white dark:bg-stone-950", className)}>
				<div className="container mx-auto px-4">
					<div className="text-center text-stone-600 dark:text-stone-400">
						<p>No features to display</p>
					</div>
				</div>
			</section>
		);
	}

	// Validate feature objects
	const validFeatures = features.filter(feature => {
		if (!feature || typeof feature !== 'object') {
			console.warn('FeatureGrid: Invalid feature object:', feature);
			return false;
		}
		if (!feature.id || !feature.title || !feature.description) {
			console.warn('FeatureGrid: Feature missing required properties:', feature);
			return false;
		}
		return true;
	});

	// Grid column classes based on maxColumns
	const getGridClasses = () => {
		switch (maxColumns) {
			case 2:
				return "grid-cols-1 md:grid-cols-2";
			case 3:
				return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
			case 4:
			default:
				return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
		}
	};
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
				<div className={cn("grid gap-6", getGridClasses())}>
					{validFeatures.map((feature, index) => (
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
							<Card 
								className={cn(
									"h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-stone-200 dark:border-stone-800",
									onFeatureClick && "cursor-pointer"
								)}
								onClick={() => onFeatureClick?.(feature)}
							>
								<CardHeader className="pb-4">
									{showIcons && feature.icon && (
										<div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-800">
											{feature.icon}
										</div>
									)}
									{feature.image && (
										<div className="mb-3 h-12 w-12 overflow-hidden rounded-lg">
											<img 
												src={feature.image} 
												alt={feature.title}
												className="h-full w-full object-cover"
												loading="lazy"
											/>
										</div>
									)}
									<CardTitle>
										<h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
											{feature.title}
										</h3>
									</CardTitle>
								</CardHeader>
								<CardContent className="pt-0">
									<CardDescription className="text-base text-stone-600 dark:text-stone-400 leading-relaxed">
										{feature.description}
									</CardDescription>
									{feature.link && (
										<div className="mt-4">
											<a 
												href={feature.link}
												className="text-sm font-medium text-stone-900 hover:text-stone-700 dark:text-stone-100 dark:hover:text-stone-300"
												target="_blank"
												rel="noopener noreferrer"
											>
												Learn more →
											</a>
										</div>
									)}
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
