import { GetStaticProps } from 'next';
import Link from 'next/link';
import { AppProvider } from '../../components/contexts/appContext';
import ModernHeader from '../../components/features/navigation/modern-header';
import { Container } from '../../components/shared/container';
import { Layout } from '../../components/shared/layout';
import { SEOHead } from '../../components/shared/seo-head';
import { Button } from '../../components/ui';
import { generateServiceStructuredData } from '../../lib/structured-data';

interface Props {
	publication: any;
}

export default function WebDevelopmentPage({ publication }: Props) {
	return (
		<AppProvider publication={publication}>
			<Layout>
				<SEOHead
					title={`Web Development Services - ${publication.displayTitle || publication.title || 'John Schibelli'}`}
					description="Custom web development services using modern technologies like React, Next.js, TypeScript, and full-stack solutions. Build scalable, high-performance web applications."
					keywords={[
						'Web Development',
						'React Development',
						'Next.js Development',
						'TypeScript Development',
						'Full-Stack Development',
						'Custom Web Applications',
						'Progressive Web Apps',
						'Web Performance',
						'SEO Optimization',
						'Responsive Design',
					]}
					canonical="/services/web-development"
					ogType="website"
					structuredData={generateServiceStructuredData({
						name: 'Web Development Services',
						description: 'Custom web development services using modern technologies like React, Next.js, TypeScript, and full-stack solutions.',
						provider: {
							name: 'John Schibelli',
							description: 'Senior Front-End Developer with 15+ years of experience',
							url: 'https://johnschibelli.dev',
							jobTitle: 'Senior Front-End Developer',
						},
						url: 'https://johnschibelli.dev/services/web-development',
						serviceType: 'Web Development',
						areaServed: ['United States', 'Remote'],
					})}
				/>
				<ModernHeader publication={publication} />

				<Container className="flex flex-col items-stretch gap-10 px-5 pb-10">
					{/* Hero Section */}
					<div className="py-16 text-center">
						<div className="bg-primary/10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
							<svg
								className="text-primary h-10 w-10"
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
						<h1 className="text-foreground mb-6 text-5xl font-bold">Web Development</h1>
						<p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-xl">
							We build modern, scalable web applications using cutting-edge technologies and best
							practices.
						</p>
						<div className="flex justify-center gap-4">
							<Button size="lg" className="bg-primary hover:bg-primary/90">
								Get Started
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
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
							</div>
							<h3 className="text-foreground mb-3 text-xl font-semibold">React & Next.js</h3>
							<p className="text-muted-foreground">
								Modern frontend development with React ecosystem and Next.js for optimal performance
								and SEO.
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
								Full-Stack Applications
							</h3>
							<p className="text-muted-foreground">
								Complete web applications with frontend, backend, and database integration.
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
										d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<h3 className="text-foreground mb-3 text-xl font-semibold">API Development</h3>
							<p className="text-muted-foreground">
								RESTful and GraphQL APIs built with Node.js, Python, or your preferred backend
								technology.
							</p>
						</div>
					</div>

					{/* Process Section */}
					<div className="bg-card border-border mb-16 rounded-lg border p-8">
						<h2 className="text-foreground mb-8 text-center text-3xl font-bold">
							Our Development Process
						</h2>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-4">
							<div className="text-center">
								<div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
									<span className="text-primary text-2xl font-bold">1</span>
								</div>
								<h3 className="text-foreground mb-2 font-semibold">Discovery</h3>
								<p className="text-muted-foreground text-sm">
									Understanding your requirements and planning the architecture
								</p>
							</div>
							<div className="text-center">
								<div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
									<span className="text-primary text-2xl font-bold">2</span>
								</div>
								<h3 className="text-foreground mb-2 font-semibold">Design</h3>
								<p className="text-muted-foreground text-sm">
									Creating wireframes and UI/UX designs for your approval
								</p>
							</div>
							<div className="text-center">
								<div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
									<span className="text-primary text-2xl font-bold">3</span>
								</div>
								<h3 className="text-foreground mb-2 font-semibold">Development</h3>
								<p className="text-muted-foreground text-sm">
									Building your application with regular updates and feedback
								</p>
							</div>
							<div className="text-center">
								<div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
									<span className="text-primary text-2xl font-bold">4</span>
								</div>
								<h3 className="text-foreground mb-2 font-semibold">Launch</h3>
								<p className="text-muted-foreground text-sm">
									Deploying and maintaining your application for success
								</p>
							</div>
						</div>
					</div>

					{/* Technologies */}
					<div className="mb-16">
						<h2 className="text-foreground mb-8 text-center text-3xl font-bold">
							Technologies We Use
						</h2>
						<div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
							{[
								'React',
								'Next.js',
								'TypeScript',
								'Node.js',
								'Python',
								'PostgreSQL',
								'MongoDB',
								'AWS',
								'Docker',
								'GraphQL',
								'Tailwind CSS',
								'Figma',
							].map((tech) => (
								<div
									key={tech}
									className="bg-card border-border hover:border-primary/50 rounded-lg border p-4 text-center transition-colors"
								>
									<span className="text-foreground text-sm font-medium">{tech}</span>
								</div>
							))}
						</div>
					</div>

					{/* CTA Section */}
					<div className="from-primary/10 to-primary/5 rounded-lg bg-gradient-to-r p-8 text-center">
						<h2 className="text-foreground mb-4 text-3xl font-bold">
							Ready to Build Your Web Application?
						</h2>
						<p className="text-muted-foreground mb-8 text-xl">
							Let&apos;s discuss your project and create something amazing together.
						</p>
						<div className="flex justify-center gap-4">
							<Button size="lg" className="bg-primary hover:bg-primary/90">
								Start Your Project
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
		descriptionSEO: 'Professional web development services using modern technologies',
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
