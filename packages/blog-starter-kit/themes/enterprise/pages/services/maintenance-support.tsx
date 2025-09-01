import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { AppProvider } from '../../components/contexts/appContext';
import ModernHeader from '../../components/features/navigation/modern-header';
import { Container } from '../../components/shared/container';
import { Layout } from '../../components/shared/layout';
import { Button } from '../../components/ui';

interface Props {
	publication: any;
}

export default function MaintenanceSupportPage({ publication }: Props) {
	return (
		<AppProvider publication={publication}>
			<Layout>
				<Head>
					<title>
						{publication.displayTitle || publication.title || 'John Schibelli'} - Maintenance &
						Support
					</title>
					<meta
						name="description"
						content="Ongoing maintenance and technical support services for applications and systems"
					/>
					<meta
						property="og:title"
						content={`${publication.displayTitle || publication.title || 'John Schibelli'} - Maintenance & Support`}
					/>
					<meta
						property="og:description"
						content="Ongoing maintenance and technical support services for applications and systems"
					/>
					<meta property="og:type" content="website" />
					<meta property="og:url" content={`${publication.url}/services/maintenance-support`} />
					<meta
						name="twitter:title"
						content={`${publication.displayTitle || publication.title || 'John Schibelli'} - Maintenance & Support`}
					/>
					<meta
						name="twitter:description"
						content="Ongoing maintenance and technical support services for applications and systems"
					/>
				</Head>
				<ModernHeader publication={publication} />

				<Container className="flex flex-col items-stretch gap-10 px-5 pb-10">
					{/* Hero Section */}
					<div className="py-16 text-center">
						<div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
							<svg
								className="h-10 w-10 text-red-600 dark:text-red-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
						</div>
						<h1 className="text-foreground mb-6 text-5xl font-bold">Maintenance & Support</h1>
						<p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-xl">
							Keep your applications running smoothly with our comprehensive maintenance and support
							services.
						</p>
						<div className="flex justify-center gap-4">
							<Button size="lg" className="bg-red-600 hover:bg-red-700">
								Get Support
							</Button>
							<Button size="lg" variant="outline">
								View Plans
							</Button>
						</div>
					</div>

					{/* Services Overview */}
					<div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<h3 className="text-foreground mb-3 text-xl font-semibold">Bug Fixes & Updates</h3>
							<p className="text-muted-foreground">
								Quick resolution of issues and regular updates to keep your applications current.
							</p>
						</div>

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
										d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
									/>
								</svg>
							</div>
							<h3 className="text-foreground mb-3 text-xl font-semibold">Security Patches</h3>
							<p className="text-muted-foreground">
								Proactive security updates and vulnerability management to protect your
								applications.
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
										d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
									/>
								</svg>
							</div>
							<h3 className="text-foreground mb-3 text-xl font-semibold">Performance Monitoring</h3>
							<p className="text-muted-foreground">
								Continuous monitoring and optimization to ensure optimal application performance.
							</p>
						</div>
					</div>

					{/* Support Plans */}
					<div className="bg-card border-border mb-16 rounded-lg border p-8">
						<h2 className="text-foreground mb-8 text-center text-3xl font-bold">Support Plans</h2>
						<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
							<div className="border-border rounded-lg border p-6">
								<h3 className="text-foreground mb-4 text-xl font-bold">Basic Support</h3>
								<div className="text-foreground mb-6 text-3xl font-bold">
									$299<span className="text-muted-foreground text-lg">/month</span>
								</div>
								<ul className="text-muted-foreground mb-6 space-y-3">
									<li>• Email support (24h response)</li>
									<li>• Bug fixes and minor updates</li>
									<li>• Security patches</li>
									<li>• Monthly performance reports</li>
									<li>• 2 hours of development time</li>
								</ul>
								<Button className="w-full bg-red-600 hover:bg-red-700">Choose Plan</Button>
							</div>

							<div className="rounded-lg border border-red-500 bg-red-50 p-6 dark:bg-red-900/10">
								<div className="mb-2 text-sm font-semibold text-red-600">MOST POPULAR</div>
								<h3 className="text-foreground mb-4 text-xl font-bold">Professional Support</h3>
								<div className="text-foreground mb-6 text-3xl font-bold">
									$599<span className="text-muted-foreground text-lg">/month</span>
								</div>
								<ul className="text-muted-foreground mb-6 space-y-3">
									<li>• Priority email & phone support</li>
									<li>• Bug fixes and feature updates</li>
									<li>• Security patches & monitoring</li>
									<li>• Weekly performance reports</li>
									<li>• 8 hours of development time</li>
									<li>• Emergency response (4h)</li>
								</ul>
								<Button className="w-full bg-red-600 hover:bg-red-700">Choose Plan</Button>
							</div>

							<div className="border-border rounded-lg border p-6">
								<h3 className="text-foreground mb-4 text-xl font-bold">Enterprise Support</h3>
								<div className="text-foreground mb-6 text-3xl font-bold">
									$1,299<span className="text-muted-foreground text-lg">/month</span>
								</div>
								<ul className="text-muted-foreground mb-6 space-y-3">
									<li>• 24/7 phone & email support</li>
									<li>• Unlimited bug fixes & updates</li>
									<li>• Advanced security monitoring</li>
									<li>• Daily performance reports</li>
									<li>• 20 hours of development time</li>
									<li>• Emergency response (1h)</li>
									<li>• Dedicated support manager</li>
								</ul>
								<Button className="w-full bg-red-600 hover:bg-red-700">Choose Plan</Button>
							</div>
						</div>
					</div>

					{/* Services Details */}
					<div className="mb-16">
						<h2 className="text-foreground mb-8 text-center text-3xl font-bold">
							What We Maintain
						</h2>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							{[
								{
									title: 'Web Applications',
									description: 'React, Next.js, and full-stack applications',
								},
								{ title: 'Mobile Apps', description: 'iOS and Android application maintenance' },
								{
									title: 'APIs & Backends',
									description: 'REST APIs, GraphQL, and server maintenance',
								},
								{ title: 'Databases', description: 'Database optimization and backup management' },
								{
									title: 'Cloud Infrastructure',
									description: 'AWS, Azure, and GCP resource management',
								},
								{
									title: 'Third-party Integrations',
									description: 'Payment systems, APIs, and external services',
								},
							].map((service) => (
								<div
									key={service.title}
									className="bg-card border-border rounded-lg border p-6 transition-colors hover:border-red-500/50"
								>
									<h3 className="text-foreground mb-2 font-semibold">{service.title}</h3>
									<p className="text-muted-foreground text-sm">{service.description}</p>
								</div>
							))}
						</div>
					</div>

					{/* Monitoring & Alerts */}
					<div className="bg-card border-border mb-16 rounded-lg border p-8">
						<h2 className="text-foreground mb-8 text-center text-3xl font-bold">
							Monitoring & Alerts
						</h2>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
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
											d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
										/>
									</svg>
								</div>
								<h3 className="text-foreground mb-2 font-semibold">Uptime Monitoring</h3>
								<p className="text-muted-foreground text-sm">
									Real-time monitoring of application availability
								</p>
							</div>
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
									<svg
										className="h-8 w-8 text-blue-600 dark:text-blue-400"
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
								<h3 className="text-foreground mb-2 font-semibold">Performance Tracking</h3>
								<p className="text-muted-foreground text-sm">
									Response time and resource usage monitoring
								</p>
							</div>
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
									<svg
										className="h-8 w-8 text-red-600 dark:text-red-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
										/>
									</svg>
								</div>
								<h3 className="text-foreground mb-2 font-semibold">Error Tracking</h3>
								<p className="text-muted-foreground text-sm">
									Automatic error detection and alerting
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
											d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h10v-2H4v2zM4 11h14v-2H4v2zM4 7h18v-2H4v2z"
										/>
									</svg>
								</div>
								<h3 className="text-foreground mb-2 font-semibold">Security Alerts</h3>
								<p className="text-muted-foreground text-sm">
									Security vulnerability and threat detection
								</p>
							</div>
						</div>
					</div>

					{/* CTA Section */}
					<div className="rounded-lg bg-gradient-to-r from-red-500/10 to-red-500/5 p-8 text-center">
						<h2 className="text-foreground mb-4 text-3xl font-bold">Ready for Reliable Support?</h2>
						<p className="text-muted-foreground mb-8 text-xl">
							Let&apos;s ensure your applications stay secure, fast, and up-to-date.
						</p>
						<div className="flex justify-center gap-4">
							<Button size="lg" className="bg-red-600 hover:bg-red-700">
								Get Support Now
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
		descriptionSEO: 'Professional maintenance and support services for applications and systems',
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
