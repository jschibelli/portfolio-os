import FeatureGrid, { Feature } from './FeatureGrid';
import { Zap, Shield, Search, Heart } from 'lucide-react';

// Example usage of FeatureGrid component with enhanced features
const exampleFeatures: Feature[] = [
	{
		id: 'feature-1',
		title: 'Modern Design',
		description: 'Clean, contemporary interface that adapts to your brand and provides an exceptional user experience across all devices.',
		icon: <Heart className="h-6 w-6 text-stone-600 dark:text-stone-400" />,
		link: '/design'
	},
	{
		id: 'feature-2',
		title: 'Fast Performance',
		description: 'Optimized for speed with lazy loading, code splitting, and efficient rendering to ensure lightning-fast page loads.',
		icon: <Zap className="h-6 w-6 text-stone-600 dark:text-stone-400" />,
		link: '/performance'
	},
	{
		id: 'feature-3',
		title: 'SEO Optimized',
		description: 'Built with search engine optimization in mind, featuring structured data, meta tags, and semantic HTML.',
		icon: <Search className="h-6 w-6 text-stone-600 dark:text-stone-400" />,
		link: '/seo'
	},
	{
		id: 'feature-4',
		title: 'Security First',
		description: 'Enterprise-grade security with comprehensive protection, data encryption, and compliance standards.',
		icon: <Shield className="h-6 w-6 text-stone-600 dark:text-stone-400" />,
		link: '/security'
	}
];

export default function FeatureGridExample() {
	const handleFeatureClick = (feature: Feature) => {
		console.log('Feature clicked:', feature);
		// You can add navigation logic here
		if (feature.link) {
			// Example: router.push(feature.link);
		}
	};

	return (
		<FeatureGrid
			features={exampleFeatures}
			title="Why Choose Our Platform"
			description="Discover the key features that make our solution stand out from the competition"
			showIcons={true}
			maxColumns={4}
			onFeatureClick={handleFeatureClick}
		/>
	);
}
