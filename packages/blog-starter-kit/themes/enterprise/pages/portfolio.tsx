import request from 'graphql-request';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { AppProvider } from '../components/contexts/appContext';
import Chatbot from '../components/features/chatbot/Chatbot';
import ModernHeader from '../components/features/navigation/modern-header';
import { Container } from '../components/shared/container';
import { Layout } from '../components/shared/layout';
import { PublicationByHostDocument } from '../generated/graphql';

interface Props {
	publication: any;
}

export default function PortfolioPage({ publication }: Props) {
	return (
		<AppProvider publication={publication}>
			<Layout>
				<Head>
					<title>{publication.displayTitle || publication.title} - Portfolio</title>
					<meta name="description" content="Explore our latest projects and case studies" />
					<meta
						property="og:title"
						content={`${publication.displayTitle || publication.title} - Portfolio`}
					/>
					<meta property="og:description" content="Explore our latest projects and case studies" />
					<meta property="og:type" content="website" />
					<meta property="og:url" content={`${publication.url}/portfolio`} />
					<meta
						name="twitter:title"
						content={`${publication.displayTitle || publication.title} - Portfolio`}
					/>
					<meta name="twitter:description" content="Explore our latest projects and case studies" />
				</Head>
				<ModernHeader publication={publication} />

				<Container className="flex flex-col items-stretch gap-10 px-5 pb-10">
					{/* Portfolio Hero Section */}
					<div
						id="portfolio-hero-section"
						data-animate-section
						className={`text-center transition-all duration-1000 ease-out ${
							true ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
						}`}
					>
						<h1 className="text-foreground mb-6 text-5xl font-bold">Our Portfolio</h1>
						<p className="text-muted-foreground mx-auto max-w-3xl text-xl">
							Discover our latest projects and see how we&apos;ve helped businesses achieve their
							digital transformation goals.
						</p>
					</div>

					{/* Featured Projects */}
					<div
						id="featured-projects-section"
						data-animate-section
						className={`duration-1200 transition-all ease-out ${
							true ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
						}`}
					>
						<h2 className="text-foreground mb-8 text-3xl font-bold">Featured Projects</h2>
						<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
							{/* Project 1 */}
							<div className="group">
								<div className="bg-card border-border hover:border-primary/50 overflow-hidden rounded-lg border transition-colors">
									<div className="flex h-48 items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
										<svg
											className="h-16 w-16 text-white"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
											/>
										</svg>
									</div>
									<div className="p-6">
										<h3 className="text-foreground mb-2 text-xl font-semibold">
											E-Commerce Platform
										</h3>
										<p className="text-muted-foreground mb-4">
											A modern e-commerce platform built with Next.js, featuring real-time inventory
											management and seamless payment processing.
										</p>
										<div className="mb-4 flex flex-wrap gap-2">
											<span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">
												Next.js
											</span>
											<span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-600 dark:bg-green-900/30 dark:text-green-400">
												TypeScript
											</span>
											<span className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
												Stripe
											</span>
										</div>
										<a href="#" className="text-primary hover:text-primary/80 font-medium">
											View Project →
										</a>
									</div>
								</div>
							</div>

							{/* Project 2 */}
							<div className="group">
								<div className="bg-card border-border hover:border-primary/50 overflow-hidden rounded-lg border transition-colors">
									<div className="flex h-48 items-center justify-center bg-gradient-to-br from-green-500 to-teal-600">
										<svg
											className="h-16 w-16 text-white"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
											/>
										</svg>
									</div>
									<div className="p-6">
										<h3 className="text-foreground mb-2 text-xl font-semibold">
											Mobile Banking App
										</h3>
										<p className="text-muted-foreground mb-4">
											A secure mobile banking application with biometric authentication and
											real-time transaction monitoring.
										</p>
										<div className="mb-4 flex flex-wrap gap-2">
											<span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">
												React Native
											</span>
											<span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-600 dark:bg-green-900/30 dark:text-green-400">
												Node.js
											</span>
											<span className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
												AWS
											</span>
										</div>
										<a href="#" className="text-primary hover:text-primary/80 font-medium">
											View Project →
										</a>
									</div>
								</div>
							</div>

							{/* Project 3 */}
							<div className="group">
								<div className="bg-card border-border hover:border-primary/50 overflow-hidden rounded-lg border transition-colors">
									<div className="flex h-48 items-center justify-center bg-gradient-to-br from-orange-500 to-red-600">
										<svg
											className="h-16 w-16 text-white"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
											/>
										</svg>
									</div>
									<div className="p-6">
										<h3 className="text-foreground mb-2 text-xl font-semibold">
											Cloud Analytics Dashboard
										</h3>
										<p className="text-muted-foreground mb-4">
											A comprehensive analytics dashboard for cloud infrastructure monitoring and
											performance optimization.
										</p>
										<div className="mb-4 flex flex-wrap gap-2">
											<span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">
												React
											</span>
											<span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-600 dark:bg-green-900/30 dark:text-green-400">
												D3.js
											</span>
											<span className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
												Kubernetes
											</span>
										</div>
										<a href="#" className="text-primary hover:text-primary/80 font-medium">
											View Project →
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Case Studies */}
					<div
						id="case-studies-section"
						data-animate-section
						className={`duration-1300 transition-all ease-out ${
							true ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
						}`}
					>
						<h2 className="text-foreground mb-8 text-3xl font-bold">Case Studies</h2>
						<div className="space-y-8">
							<div className="bg-card border-border rounded-lg border p-8">
								<div className="flex items-start gap-6">
									<div className="bg-primary/10 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg">
										<svg
											className="text-primary h-8 w-8"
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
									<div>
										<h3 className="text-foreground mb-2 text-2xl font-semibold">
											TechCorp Digital Transformation
										</h3>
										<p className="text-muted-foreground mb-4">
											Helped TechCorp modernize their legacy systems with a microservices
											architecture, resulting in 40% faster deployment times and 60% reduction in
											downtime.
										</p>
										<div className="text-muted-foreground flex items-center gap-4 text-sm">
											<span>Duration: 6 months</span>
											<span>Team: 8 developers</span>
											<span>Technologies: Docker, Kubernetes, Node.js</span>
										</div>
									</div>
								</div>
							</div>

							<div className="bg-card border-border rounded-lg border p-8">
								<div className="flex items-start gap-6">
									<div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
										<svg
											className="h-8 w-8 text-green-600 dark:text-green-400"
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
									<div>
										<h3 className="text-foreground mb-2 text-2xl font-semibold">
											FinTech Startup MVP
										</h3>
										<p className="text-muted-foreground mb-4">
											Developed a complete MVP for a fintech startup, including user authentication,
											payment processing, and real-time notifications, launched in just 3 months.
										</p>
										<div className="text-muted-foreground flex items-center gap-4 text-sm">
											<span>Duration: 3 months</span>
											<span>Team: 4 developers</span>
											<span>Technologies: React, Firebase, Stripe</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Contact Section */}
					<div
						id="contact-section"
						data-animate-section
						className={`duration-1400 text-center transition-all ease-out ${
							true ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
						}`}
					>
						<h2 className="text-foreground mb-6 text-3xl font-bold">
							Ready to Start Your Project?
						</h2>
						<p className="text-muted-foreground mb-8 text-xl">
							Let&apos;s discuss how we can help bring your vision to life with cutting-edge
							technology solutions.
						</p>
						<a
							href="mailto:contact@example.com"
							className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-lg px-8 py-4 font-semibold transition-colors"
						>
							Start Your Project
							<svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M14 5l7 7m0 0l-7 7m7-7H3"
								/>
							</svg>
						</a>
					</div>
				</Container>
				<Chatbot />
			</Layout>
		</AppProvider>
	);
}

export const getStaticProps: GetStaticProps<Props> = async () => {
	const GQL_ENDPOINT = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT || 'https://gql.hashnode.com/';
	const host = process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST || 'mindware.hashnode.dev';

	try {
		const data = await request(GQL_ENDPOINT, PublicationByHostDocument, { host });
		const publication = data.publication;

		if (!publication) {
			return {
				notFound: true,
			};
		}

		return {
			props: {
				publication,
			},
			revalidate: 1,
		};
	} catch (error) {
		console.error('Error fetching publication data:', error);

		// Return a fallback response to prevent the build from failing
		return {
			props: {
				publication: {
					id: 'fallback',
					title: 'John Schibelli - Senior Front-End Developer',
					displayTitle: 'John Schibelli - Senior Front-End Developer',
					descriptionSEO: 'Senior Front-End Developer with 15+ years of experience',
					url: 'https://mindware.hashnode.dev',
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
				} as any,
			},
			revalidate: 1,
		};
	}
};
