import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { AppProvider } from '../../components/contexts/appContext';
import ModernHeader from '../../components/features/navigation/modern-header';
import { Container } from '../../components/shared/container';
import { Layout } from '../../components/shared/layout';
import { Button } from '../../components/ui/button';

interface Props {
	publication: any;
}

export default function UIUXDesignPage({ publication }: Props) {
	return (
		<AppProvider publication={publication}>
			<Layout>
				<Head>
					<title>
						{publication.displayTitle || publication.title || 'John Schibelli'} - UI/UX Design
					</title>
					<meta
						name="description"
						content="User-centered design solutions for engaging digital experiences"
					/>
					<meta
						property="og:title"
						content={`${publication.displayTitle || publication.title || 'John Schibelli'} - UI/UX Design`}
					/>
					<meta
						property="og:description"
						content="User-centered design solutions for engaging digital experiences"
					/>
					<meta property="og:type" content="website" />
					<meta property="og:url" content={`${publication.url}/services/ui-ux-design`} />
					<meta
						name="twitter:title"
						content={`${publication.displayTitle || publication.title || 'John Schibelli'} - UI/UX Design`}
					/>
					<meta
						name="twitter:description"
						content="User-centered design solutions for engaging digital experiences"
					/>
				</Head>
				<ModernHeader publication={publication} />

				<Container className="flex flex-col items-stretch gap-10 px-5 pb-10">
					{/* Hero Section */}
					<div className="py-16 text-center">
						<div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30">
							<svg
								className="h-10 w-10 text-pink-600 dark:text-pink-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
								/>
							</svg>
						</div>
						<h1 className="text-foreground mb-6 text-5xl font-bold">UI/UX Design</h1>
						<p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-xl">
							We create intuitive, beautiful, and user-centered designs that drive engagement and
							conversion.
						</p>
						<div className="flex justify-center gap-4">
							<Button size="lg" className="bg-pink-600 hover:bg-pink-700">
								Start Your Project
							</Button>
							<Button size="lg" variant="outline">
								View Portfolio
							</Button>
						</div>
					</div>

					{/* Services Overview */}
					<div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
						<div className="bg-card border-border rounded-lg border p-6">
							<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
								<svg
									className="h-6 w-6 text-blue-600 dark:text-blue-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
									/>
								</svg>
							</div>
							<h3 className="text-foreground mb-3 text-xl font-semibold">User Interface Design</h3>
							<p className="text-muted-foreground">
								Beautiful, functional interfaces that align with your brand and user expectations.
							</p>
						</div>

						<div className="bg-card border-border rounded-lg border p-6">
							<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
								<svg
									className="h-6 w-6 text-green-600 dark:text-green-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
									/>
								</svg>
							</div>
							<h3 className="text-foreground mb-3 text-xl font-semibold">
								User Experience Research
							</h3>
							<p className="text-muted-foreground">
								In-depth user research and usability testing to optimize user journeys.
							</p>
						</div>

						<div className="bg-card border-border rounded-lg border p-6">
							<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
								<svg
									className="h-6 w-6 text-purple-600 dark:text-purple-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
									/>
								</svg>
							</div>
							<h3 className="text-foreground mb-3 text-xl font-semibold">
								Prototyping & Wireframing
							</h3>
							<p className="text-muted-foreground">
								Interactive prototypes and wireframes to validate design concepts early.
							</p>
						</div>
					</div>

					{/* Design Process */}
					<div className="bg-card border-border mb-16 rounded-lg border p-8">
						<h2 className="text-foreground mb-8 text-center text-3xl font-bold">
							Our Design Process
						</h2>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-5">
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30">
									<span className="text-2xl font-bold text-pink-600">1</span>
								</div>
								<h3 className="text-foreground mb-2 font-semibold">Research</h3>
								<p className="text-muted-foreground text-sm">
									Understanding users, competitors, and business goals
								</p>
							</div>
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30">
									<span className="text-2xl font-bold text-pink-600">2</span>
								</div>
								<h3 className="text-foreground mb-2 font-semibold">Strategy</h3>
								<p className="text-muted-foreground text-sm">
									Defining user personas and information architecture
								</p>
							</div>
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30">
									<span className="text-2xl font-bold text-pink-600">3</span>
								</div>
								<h3 className="text-foreground mb-2 font-semibold">Wireframes</h3>
								<p className="text-muted-foreground text-sm">
									Creating low-fidelity layouts and user flows
								</p>
							</div>
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30">
									<span className="text-2xl font-bold text-pink-600">4</span>
								</div>
								<h3 className="text-foreground mb-2 font-semibold">Design</h3>
								<p className="text-muted-foreground text-sm">
									High-fidelity designs with visual elements
								</p>
							</div>
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30">
									<span className="text-2xl font-bold text-pink-600">5</span>
								</div>
								<h3 className="text-foreground mb-2 font-semibold">Testing</h3>
								<p className="text-muted-foreground text-sm">
									User testing and iterative improvements
								</p>
							</div>
						</div>
					</div>

					{/* Design Services */}
					<div className="mb-16">
						<h2 className="text-foreground mb-8 text-center text-3xl font-bold">Design Services</h2>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							{[
								{ title: 'Web Design', description: 'Responsive websites and web applications' },
								{ title: 'Mobile App Design', description: 'iOS and Android app interfaces' },
								{ title: 'Dashboard Design', description: 'Data visualization and admin panels' },
								{
									title: 'E-commerce Design',
									description: 'Online stores and shopping experiences',
								},
								{ title: 'Brand Identity', description: 'Logos, color schemes, and style guides' },
								{ title: 'Design Systems', description: 'Component libraries and design tokens' },
							].map((service) => (
								<div
									key={service.title}
									className="bg-card border-border rounded-lg border p-6 transition-colors hover:border-pink-500/50"
								>
									<h3 className="text-foreground mb-2 font-semibold">{service.title}</h3>
									<p className="text-muted-foreground text-sm">{service.description}</p>
								</div>
							))}
						</div>
					</div>

					{/* Tools & Technologies */}
					<div className="bg-card border-border mb-16 rounded-lg border p-8">
						<h2 className="text-foreground mb-8 text-center text-3xl font-bold">
							Tools & Technologies
						</h2>
						<div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
							{[
								'Figma',
								'Sketch',
								'Adobe XD',
								'InVision',
								'Principle',
								'Framer',
								'Protopie',
								'Zeplin',
								'Abstract',
								'Notion',
								'Miro',
								'UserTesting',
							].map((tool) => (
								<div
									key={tool}
									className="bg-background border-border rounded-lg border p-4 text-center transition-colors hover:border-pink-500/50"
								>
									<span className="text-foreground text-sm font-medium">{tool}</span>
								</div>
							))}
						</div>
					</div>

					{/* Benefits */}
					<div className="mb-16">
						<h2 className="text-foreground mb-8 text-center text-3xl font-bold">
							Why Great Design Matters
						</h2>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30">
									<svg
										className="h-8 w-8 text-pink-600 dark:text-pink-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M13 10V3L4 14h7v7l9-11h-7z"
										/>
									</svg>
								</div>
								<h3 className="text-foreground mb-2 font-semibold">Increased Engagement</h3>
								<p className="text-muted-foreground text-sm">
									Better user experience leads to higher engagement rates
								</p>
							</div>
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30">
									<svg
										className="h-8 w-8 text-pink-600 dark:text-pink-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<h3 className="text-foreground mb-2 font-semibold">Higher Conversion</h3>
								<p className="text-muted-foreground text-sm">
									Optimized user flows improve conversion rates
								</p>
							</div>
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30">
									<svg
										className="h-8 w-8 text-pink-600 dark:text-pink-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
										/>
									</svg>
								</div>
								<h3 className="text-foreground mb-2 font-semibold">Brand Trust</h3>
								<p className="text-muted-foreground text-sm">
									Professional design builds trust and credibility
								</p>
							</div>
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30">
									<svg
										className="h-8 w-8 text-pink-600 dark:text-pink-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<h3 className="text-foreground mb-2 font-semibold">Reduced Support</h3>
								<p className="text-muted-foreground text-sm">
									Intuitive design reduces user confusion and support tickets
								</p>
							</div>
						</div>
					</div>

					{/* CTA Section */}
					<div className="rounded-lg bg-gradient-to-r from-pink-500/10 to-pink-500/5 p-8 text-center">
						<h2 className="text-foreground mb-4 text-3xl font-bold">
							Ready to Transform Your User Experience?
						</h2>
						<p className="text-muted-foreground mb-8 text-xl">
							Let&apos;s create designs that delight your users and drive business results.
						</p>
						<div className="flex justify-center gap-4">
							<Button size="lg" className="bg-pink-600 hover:bg-pink-700">
								Start Your Design Project
							</Button>
							<Link href="/services">
								<Button size="lg" variant="outline">
									View All Services
								</Button>
							</Link>
						</div>
					</div>
				</Container>
			</Layout>
		</AppProvider>
	);
}

export const getStaticProps: GetStaticProps<Props> = async () => {
	const publication: any = {
		title: 'John Schibelli',
		displayTitle: 'John Schibelli',
		url: 'https://mindware.hashnode.dev',
		logo: null,
		author: { name: 'John Schibelli' },
		descriptionSEO: 'Professional UI/UX design services for engaging digital experiences',
		ogMetaData: {
			image: 'https://via.placeholder.com/1200x630',
		},
		preferences: {
			disableFooterBranding: false,
			logo: null,
			darkMode: false,
		},
		isTeam: false,
		imprint: null,
		features: {
			tableOfContents: { isEnabled: true },
			newsletter: { isEnabled: true },
			readMore: { isEnabled: true },
		},
	};

	return {
		props: {
			publication,
		},
		revalidate: 1,
	};
};
