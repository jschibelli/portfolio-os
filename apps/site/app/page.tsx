import { AppProvider } from '../components/contexts/appContext';
import LatestPosts from '../components/features/blog/latest-posts';
import Hero from '../components/features/homepage/hero';
import CTABanner from '../components/features/marketing/cta-banner';
import ModernHeader from '../components/features/navigation/modern-header';
import FeaturedProjects from '../components/features/portfolio/featured-projects';
import { Footer } from '../components/shared/footer';

// Force dynamic rendering for this page to ensure blog posts are fetched at runtime
export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

// Default publication object for fallback
const defaultPublication = {
	id: 'fallback-home',
	title: 'John Schibelli',
	displayTitle: 'John Schibelli',
	descriptionSEO:
		'Senior Software Engineer. Front-end and full-stack systems, APIs, integrations, automation, and modernization.',
	url: 'https://johnschibelli.dev',
	posts: {
		totalDocuments: 0,
	},
	preferences: {
		logo: null,
	},
	author: {
		name: 'John Schibelli',
		profilePicture: null,
	},
	followersCount: 0,
	isTeam: false,
	favicon: null,
	ogMetaData: {
		image: null,
	},
};

export default function HomePage() {
	return (
		<AppProvider publication={defaultPublication as any}>
			{/* Navigation */}
			<ModernHeader publication={defaultPublication} />

			<main id="main-content" role="main">
				<Hero />
				<FeaturedProjects />
				<LatestPosts />
				<CTABanner />
			</main>

			{/* Footer */}
			<Footer publication={defaultPublication} />
		</AppProvider>
	);
}
