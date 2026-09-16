import { Metadata } from 'next';
import { Container } from '../../components/shared/container';
import { Layout } from '../../components/shared/layout';

import { AnimatedProjectCard } from '../../components/features/projects/animated-project-card';
import { allProjects as projectMetaList } from '../../data/projects';
import { siteUrl } from '../../lib/site-url';
import { typeRole } from '../../lib/typography';

export const metadata: Metadata = {
	title: 'Projects and Case Studies | John Schibelli',
	description: 'Selected software systems and the engineering decisions behind them.',
	keywords: ['projects', 'portfolio', 'case studies', 'software engineering', 'John Schibelli'],
	authors: [{ name: 'John Schibelli' }],
	creator: 'John Schibelli',
	publisher: 'John Schibelli',
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
	openGraph: {
		title: 'Projects and Case Studies | John Schibelli',
		description: 'Selected software systems and the engineering decisions behind them.',
		url: siteUrl('/projects'),
		siteName: 'John Schibelli Portfolio',
		locale: 'en_US',
		type: 'website',
		images: [
			{
				url: '/assets/og.png',
				width: 1200,
				height: 630,
				alt: 'John Schibelli - Projects and Case Studies',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Projects and Case Studies | John Schibelli',
		description: 'Selected software systems and the engineering decisions behind them.',
		creator: '@johnschibelli',
		images: ['/assets/og.png'],
	},
	alternates: {
		canonical: siteUrl('/projects'),
	},
};

function toProjectCard(projectMeta: any) {
	return {
		id: projectMeta.id,
		title: projectMeta.title,
		description: projectMeta.description,
		image: projectMeta.image || '/assets/hero/hero-image.webp',
		tags: projectMeta.tags || [],
		caseStudyUrl: projectMeta.caseStudyUrl,
		slug: projectMeta.slug,
		liveUrl: projectMeta.liveUrl,
		category: projectMeta.category,
		status: projectMeta.status,
		technologies: projectMeta.technologies,
		client: projectMeta.client,
		industry: projectMeta.industry,
		startDate: projectMeta.startDate,
		endDate: projectMeta.endDate,
	};
}

function getProjectsData() {
	const publishedProjects = projectMetaList
		.filter((project) => project.published !== false)
		.map(toProjectCard);

	return {
		projects: publishedProjects,
	};
}

export default function ProjectsPage() {
	const { projects } = getProjectsData();

	return (
		<Layout>
			<section
				className="relative overflow-hidden bg-stone-50 py-12 md:py-16 dark:bg-stone-900"
				style={{
					backgroundImage: 'url(/assets/hero/hero-bg2.png)',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
				}}
			>
				<div className="absolute inset-0 z-0 bg-stone-50/80 dark:bg-stone-900/80"></div>
				<div className="relative z-10">
					<Container className="px-4 sm:px-6">
						<div className="mx-auto max-w-5xl space-y-4 text-center sm:space-y-5">
							<h1
								className={`bg-gradient-to-r from-stone-900 via-stone-700 to-stone-900 bg-clip-text text-transparent dark:from-stone-100 dark:via-stone-300 dark:to-stone-100 ${typeRole.pageH1}`}
							>
								Projects & Case Studies
							</h1>
							<p className={`text-stone-700 dark:text-stone-300 ${typeRole.heroSupport}`}>
								Selected software systems and the engineering decisions behind them.
							</p>
						</div>
					</Container>
				</div>
			</section>

			<section className="bg-stone-50 py-12 md:py-16 dark:bg-stone-900">
				<Container className="px-4 sm:px-6">
					<div
						className={
							projects.length === 1
								? 'mx-auto max-w-5xl'
								: projects.length === 2
									? 'mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2'
									: 'grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3'
						}
					>
						{projects.map((project, index) => (
							<AnimatedProjectCard
								key={project.id}
								project={project}
								index={index}
								featured={projects.length === 1}
								headingLevel="h2"
							/>
						))}
					</div>
				</Container>
			</section>
		</Layout>
	);
}
