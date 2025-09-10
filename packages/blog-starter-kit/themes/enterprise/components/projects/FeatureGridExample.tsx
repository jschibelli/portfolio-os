import FeatureGrid, { Feature } from './FeatureGrid';

// Example usage of FeatureGrid component
const exampleFeatures: Feature[] = [
	{
		id: 'feature-1',
		title: 'Modern Design',
		description: 'Clean, contemporary interface that adapts to your brand and provides an exceptional user experience across all devices.'
	},
	{
		id: 'feature-2',
		title: 'Fast Performance',
		description: 'Optimized for speed with lazy loading, code splitting, and efficient rendering to ensure lightning-fast page loads.'
	},
	{
		id: 'feature-3',
		title: 'SEO Optimized',
		description: 'Built with search engine optimization in mind, featuring structured data, meta tags, and semantic HTML.'
	},
	{
		id: 'feature-4',
		title: 'Accessibility First',
		description: 'WCAG 2.1 AA compliant with keyboard navigation, screen reader support, and high contrast modes.'
	}
];

export default function FeatureGridExample() {
	return (
		<FeatureGrid
			features={exampleFeatures}
			title="Why Choose Our Platform"
			description="Discover the key features that make our solution stand out from the competition"
		/>
	);
}
