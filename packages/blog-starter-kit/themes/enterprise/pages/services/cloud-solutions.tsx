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

export default function CloudSolutionsPage({ publication }: Props) {
	return (
		<AppProvider publication={publication}>
			<Layout>
				<Head>
					<title>
						{publication.displayTitle || publication.title || 'John Schibelli'} - Cloud Solutions
					</title>
					<meta
						name="description"
						content="Scalable cloud infrastructure and DevOps solutions for modern applications"
					/>
					<meta
						property="og:title"
						content={`${publication.displayTitle || publication.title || 'John Schibelli'} - Cloud Solutions`}
					/>
					<meta
						property="og:description"
						content="Scalable cloud infrastructure and DevOps solutions for modern applications"
					/>
					<meta property="og:type" content="website" />
					<meta property="og:url" content={`${publication.url}/services/cloud-solutions`} />
					<meta
						name="twitter:title"
						content={`${publication.displayTitle || publication.title || 'John Schibelli'} - Cloud Solutions`}
					/>
					<meta
						name="twitter:description"
						content="Scalable cloud infrastructure and DevOps solutions for modern applications"
					/>
				</Head>
				<ModernHeader publication={publication} />

				<Container className="flex flex-col items-stretch gap-10 px-5 pb-10">
					{/* Hero Section */}
					<div className="py-16 text-center">
						<div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
							<svg
								className="h-10 w-10 text-purple-600 dark:text-purple-400"
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
						<h1 className="text-foreground mb-6 text-5xl font-bold">Cloud Solutions</h1>
						<p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-xl">
							We help you build scalable, secure, and cost-effective cloud infrastructure for your
							applications.
						</p>
						<div className="flex justify-center gap-4">
							<Button size="lg" className="bg-purple-600 hover:bg-purple-700">
								Get Started
							</Button>
							<Button size="lg" variant="outline">
								View Case Studies
							</Button>
						</div>
					</div>

					{/* Services Overview */}
					<div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
						<div className="bg-card border-border rounded-lg border p-6">
							<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
								<svg
									className="h-6 w-6 text-orange-600 dark:text-orange-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
									/>
								</svg>
							</div>
							<h3 className="text-foreground mb-3 text-xl font-semibold">AWS/Azure/GCP Setup</h3>
							<p className="text-muted-foreground">
								Cloud infrastructure setup and configuration on major cloud platforms.
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
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
							</div>
							<h3 className="text-foreground mb-3 text-xl font-semibold">CI/CD Pipelines</h3>
							<p className="text-muted-foreground">
								Automated deployment pipelines for continuous integration and delivery.
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
										d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
									/>
								</svg>
							</div>
							<h3 className="text-foreground mb-3 text-xl font-semibold">
								Container Orchestration
							</h3>
							<p className="text-muted-foreground">
								Kubernetes and Docker container management for scalable deployments.
							</p>
						</div>
					</div>

					{/* Cloud Providers */}
					<div className="bg-card border-border mb-16 rounded-lg border p-8">
						<h2 className="text-foreground mb-8 text-center text-3xl font-bold">
							Cloud Platforms We Work With
						</h2>
						<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
									<svg
										className="h-10 w-10 text-orange-600 dark:text-orange-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
										/>
									</svg>
								</div>
								<h3 className="text-foreground mb-4 text-2xl font-bold">Amazon Web Services</h3>
								<ul className="text-muted-foreground space-y-2">
									<li>• EC2 & Lambda</li>
									<li>• S3 & RDS</li>
									<li>• CloudFront CDN</li>
									<li>• Route 53 DNS</li>
								</ul>
							</div>
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
									<svg
										className="h-10 w-10 text-blue-600 dark:text-blue-400"
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
								<h3 className="text-foreground mb-4 text-2xl font-bold">Microsoft Azure</h3>
								<ul className="text-muted-foreground space-y-2">
									<li>• Virtual Machines</li>
									<li>• App Service</li>
									<li>• Azure Functions</li>
									<li>• Cosmos DB</li>
								</ul>
							</div>
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
									<svg
										className="h-10 w-10 text-green-600 dark:text-green-400"
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
								<h3 className="text-foreground mb-4 text-2xl font-bold">Google Cloud Platform</h3>
								<ul className="text-muted-foreground space-y-2">
									<li>• Compute Engine</li>
									<li>• Cloud Functions</li>
									<li>• Cloud Storage</li>
									<li>• BigQuery</li>
								</ul>
							</div>
						</div>
					</div>

					{/* DevOps Services */}
					<div className="mb-16">
						<h2 className="text-foreground mb-8 text-center text-3xl font-bold">DevOps Services</h2>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							{[
								{
									title: 'Infrastructure as Code',
									description: 'Terraform and CloudFormation templates',
								},
								{
									title: 'CI/CD Automation',
									description: 'GitHub Actions, Jenkins, and GitLab CI',
								},
								{
									title: 'Container Management',
									description: 'Docker and Kubernetes orchestration',
								},
								{
									title: 'Monitoring & Logging',
									description: 'Prometheus, Grafana, and ELK Stack',
								},
								{
									title: 'Security & Compliance',
									description: 'IAM, encryption, and compliance frameworks',
								},
								{
									title: 'Cost Optimization',
									description: 'Resource optimization and cost monitoring',
								},
							].map((service) => (
								<div
									key={service.title}
									className="bg-card border-border rounded-lg border p-6 transition-colors hover:border-purple-500/50"
								>
									<h3 className="text-foreground mb-2 font-semibold">{service.title}</h3>
									<p className="text-muted-foreground text-sm">{service.description}</p>
								</div>
							))}
						</div>
					</div>

					{/* Benefits */}
					<div className="bg-card border-border mb-16 rounded-lg border p-8">
						<h2 className="text-foreground mb-8 text-center text-3xl font-bold">
							Benefits of Cloud Solutions
						</h2>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
									<svg
										className="h-8 w-8 text-purple-600 dark:text-purple-400"
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
								<h3 className="text-foreground mb-2 font-semibold">Scalability</h3>
								<p className="text-muted-foreground text-sm">
									Auto-scaling resources based on demand
								</p>
							</div>
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
									<svg
										className="h-8 w-8 text-purple-600 dark:text-purple-400"
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
								<h3 className="text-foreground mb-2 font-semibold">Reliability</h3>
								<p className="text-muted-foreground text-sm">
									High availability and disaster recovery
								</p>
							</div>
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
									<svg
										className="h-8 w-8 text-purple-600 dark:text-purple-400"
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
								<h3 className="text-foreground mb-2 font-semibold">Cost-Effective</h3>
								<p className="text-muted-foreground text-sm">Pay-as-you-go pricing model</p>
							</div>
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
									<svg
										className="h-8 w-8 text-purple-600 dark:text-purple-400"
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
								<h3 className="text-foreground mb-2 font-semibold">Security</h3>
								<p className="text-muted-foreground text-sm">Enterprise-grade security features</p>
							</div>
						</div>
					</div>

					{/* CTA Section */}
					<div className="rounded-lg bg-gradient-to-r from-purple-500/10 to-purple-500/5 p-8 text-center">
						<h2 className="text-foreground mb-4 text-3xl font-bold">
							Ready to Scale Your Infrastructure?
						</h2>
						<p className="text-muted-foreground mb-8 text-xl">
							Let&apos;s build a robust cloud infrastructure that grows with your business.
						</p>
						<div className="flex justify-center gap-4">
							<Button size="lg" className="bg-purple-600 hover:bg-purple-700">
								Start Your Cloud Journey
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
		descriptionSEO: 'Professional cloud infrastructure and DevOps solutions',
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
