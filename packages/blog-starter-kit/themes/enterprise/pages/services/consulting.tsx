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

export default function ConsultingPage({ publication }: Props) {
	return (
		<AppProvider publication={publication}>
			<Layout>
				<Head>
					<title>
						{publication.displayTitle || publication.title || 'John Schibelli'} - Technical
						Consulting
					</title>
					<meta
						name="description"
						content="Expert technical consulting and guidance for technology strategy and implementation"
					/>
					<meta
						property="og:title"
						content={`${publication.displayTitle || publication.title || 'John Schibelli'} - Technical Consulting`}
					/>
					<meta
						property="og:description"
						content="Expert technical consulting and guidance for technology strategy and implementation"
					/>
					<meta property="og:type" content="website" />
					<meta property="og:url" content={`${publication.url}/services/consulting`} />
					<meta
						name="twitter:title"
						content={`${publication.displayTitle || publication.title || 'John Schibelli'} - Technical Consulting`}
					/>
					<meta
						name="twitter:description"
						content="Expert technical consulting and guidance for technology strategy and implementation"
					/>
				</Head>
				<ModernHeader publication={publication} />

				<Container className="flex flex-col items-stretch gap-10 px-5 pb-10">
					{/* Hero Section */}
					<div className="py-16 text-center">
						<div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
							<svg
								className="h-10 w-10 text-yellow-600 dark:text-yellow-400"
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
						<h1 className="text-foreground mb-6 text-5xl font-bold">Technical Consulting</h1>
						<p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-xl">
							Expert guidance to help you make informed technology decisions and implement solutions
							that drive business growth.
						</p>
						<div className="flex justify-center gap-4">
							<Button size="lg" className="bg-yellow-600 hover:bg-yellow-700">
								Schedule Consultation
							</Button>
							<Button size="lg" variant="outline">
								View Case Studies
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
										d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
									/>
								</svg>
							</div>
							<h3 className="text-foreground mb-3 text-xl font-semibold">Technology Strategy</h3>
							<p className="text-muted-foreground">
								Strategic planning and roadmap development for your technology initiatives.
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
										d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
									/>
								</svg>
							</div>
							<h3 className="text-foreground mb-3 text-xl font-semibold">Architecture Review</h3>
							<p className="text-muted-foreground">
								Comprehensive review of your system architecture and recommendations for
								improvement.
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
										d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
									/>
								</svg>
							</div>
							<h3 className="text-foreground mb-3 text-xl font-semibold">Code Audits</h3>
							<p className="text-muted-foreground">
								In-depth code reviews to identify issues, improve quality, and optimize performance.
							</p>
						</div>
					</div>

					{/* Consulting Areas */}
					<div className="bg-card border-border mb-16 rounded-lg border p-8">
						<h2 className="text-foreground mb-8 text-center text-3xl font-bold">
							Consulting Areas
						</h2>
						<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
							<div>
								<h3 className="text-foreground mb-4 text-xl font-semibold">Technology Strategy</h3>
								<ul className="text-muted-foreground space-y-2">
									<li>• Technology stack selection and evaluation</li>
									<li>• Digital transformation roadmaps</li>
									<li>• Scalability and performance planning</li>
									<li>• Security and compliance strategies</li>
									<li>• Cost optimization and ROI analysis</li>
								</ul>
							</div>
							<div>
								<h3 className="text-foreground mb-4 text-xl font-semibold">
									Architecture & Development
								</h3>
								<ul className="text-muted-foreground space-y-2">
									<li>• System architecture design and review</li>
									<li>• Microservices and cloud-native strategies</li>
									<li>• API design and integration patterns</li>
									<li>• Database design and optimization</li>
									<li>• DevOps and CI/CD implementation</li>
								</ul>
							</div>
							<div>
								<h3 className="text-foreground mb-4 text-xl font-semibold">Team & Process</h3>
								<ul className="text-muted-foreground space-y-2">
									<li>• Development methodology selection</li>
									<li>• Team structure and skill assessment</li>
									<li>• Code quality and testing strategies</li>
									<li>• Project management and delivery</li>
									<li>• Technical training and mentoring</li>
								</ul>
							</div>
							<div>
								<h3 className="text-foreground mb-4 text-xl font-semibold">
									Performance & Security
								</h3>
								<ul className="text-muted-foreground space-y-2">
									<li>• Performance optimization and monitoring</li>
									<li>• Security audits and vulnerability assessment</li>
									<li>• Data protection and privacy compliance</li>
									<li>• Disaster recovery planning</li>
									<li>• Infrastructure scaling strategies</li>
								</ul>
							</div>
						</div>
					</div>

					{/* Process */}
					<div className="mb-16">
						<h2 className="text-foreground mb-8 text-center text-3xl font-bold">
							Our Consulting Process
						</h2>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-4">
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
									<span className="text-2xl font-bold text-yellow-600">1</span>
								</div>
								<h3 className="text-foreground mb-2 font-semibold">Assessment</h3>
								<p className="text-muted-foreground text-sm">
									Understanding your current state and challenges
								</p>
							</div>
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
									<span className="text-2xl font-bold text-yellow-600">2</span>
								</div>
								<h3 className="text-foreground mb-2 font-semibold">Analysis</h3>
								<p className="text-muted-foreground text-sm">
									Deep dive into technical and business requirements
								</p>
							</div>
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
									<span className="text-2xl font-bold text-yellow-600">3</span>
								</div>
								<h3 className="text-foreground mb-2 font-semibold">Recommendations</h3>
								<p className="text-muted-foreground text-sm">
									Providing actionable solutions and roadmaps
								</p>
							</div>
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
									<span className="text-2xl font-bold text-yellow-600">4</span>
								</div>
								<h3 className="text-foreground mb-2 font-semibold">Implementation</h3>
								<p className="text-muted-foreground text-sm">
									Supporting execution and ongoing guidance
								</p>
							</div>
						</div>
					</div>

					{/* Benefits */}
					<div className="bg-card border-border mb-16 rounded-lg border p-8">
						<h2 className="text-foreground mb-8 text-center text-3xl font-bold">
							Benefits of Technical Consulting
						</h2>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
									<svg
										className="h-8 w-8 text-yellow-600 dark:text-yellow-400"
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
								<h3 className="text-foreground mb-2 font-semibold">Expert Guidance</h3>
								<p className="text-muted-foreground text-sm">
									Access to experienced professionals with deep technical knowledge
								</p>
							</div>
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
									<svg
										className="h-8 w-8 text-yellow-600 dark:text-yellow-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
										/>
									</svg>
								</div>
								<h3 className="text-foreground mb-2 font-semibold">Cost Savings</h3>
								<p className="text-muted-foreground text-sm">
									Avoid costly mistakes and optimize technology investments
								</p>
							</div>
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
									<svg
										className="h-8 w-8 text-yellow-600 dark:text-yellow-400"
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
								<h3 className="text-foreground mb-2 font-semibold">Faster Delivery</h3>
								<p className="text-muted-foreground text-sm">
									Accelerate development with proven strategies and best practices
								</p>
							</div>
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
									<svg
										className="h-8 w-8 text-yellow-600 dark:text-yellow-400"
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
								<h3 className="text-foreground mb-2 font-semibold">Risk Mitigation</h3>
								<p className="text-muted-foreground text-sm">
									Identify and address potential issues before they become problems
								</p>
							</div>
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
									<svg
										className="h-8 w-8 text-yellow-600 dark:text-yellow-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
										/>
									</svg>
								</div>
								<h3 className="text-foreground mb-2 font-semibold">Team Development</h3>
								<p className="text-muted-foreground text-sm">
									Build internal capabilities through knowledge transfer
								</p>
							</div>
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
									<svg
										className="h-8 w-8 text-yellow-600 dark:text-yellow-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
										/>
									</svg>
								</div>
								<h3 className="text-foreground mb-2 font-semibold">Business Growth</h3>
								<p className="text-muted-foreground text-sm">
									Align technology with business objectives for sustainable growth
								</p>
							</div>
						</div>
					</div>

					{/* CTA Section */}
					<div className="rounded-lg bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 p-8 text-center">
						<h2 className="text-foreground mb-4 text-3xl font-bold">
							Ready to Get Expert Technical Guidance?
						</h2>
						<p className="text-muted-foreground mb-8 text-xl">
							Let&apos;s discuss your technology challenges and find the right solutions for your
							business.
						</p>
						<div className="flex justify-center gap-4">
							<Button size="lg" className="bg-yellow-600 hover:bg-yellow-700">
								Schedule Free Consultation
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
		descriptionSEO:
			'Expert technical consulting services for technology strategy and implementation',
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
