import { ArrowRight, Calendar, Tag, User } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { AppProvider } from '../../components/contexts/appContext';
import { Container } from '../../components/shared/container';
import { Layout } from '../../components/shared/layout';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../../components/ui/card';
import { getSiteUrl } from '../../config/site';
import { typeRole } from '../../lib/typography';

// Mock case studies data - in a real app, this would come from your CMS or database
const caseStudies = [
	{
		id: 'intraweb',
		title: 'IntraWeb Nexus: Business Operations and Workflow Automation Platform',
		slug: 'intraweb',
		description:
			'Production client portal, staff operations console, and curated n8n automation—connecting HubSpot, Stripe, Clerk, and Supabase with honest maturity labels.',
		image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
		tags: ['Next.js', 'TypeScript', 'Supabase', 'Clerk', 'n8n', 'Stripe', 'HubSpot'],
		publishedAt: '2026-07-30',
		author: 'John Schibelli',
		featured: true,
		metrics: {
			portalSurfaces: '~30 page surfaces',
			curatedWorkflows: '~28 curated workflows',
			migrations: '19 schema migrations',
		},
		liveUrl: 'https://intrawebtech.com',
		caseStudyUrl: '/case-studies/intraweb',
	},
	{
		id: 'portfolio-os',
		title: 'Portfolio OS: Building a Self-Documenting Development Platform',
		slug: 'portfolio-os',
		description:
			'How I built a production-grade monorepo with enterprise automation, multi-agent workflows, and intelligent CI/CD—turning a portfolio into a comprehensive development platform.',
		image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
		tags: [
			'NextJS',
			'TypeScript',
			'Turborepo',
			'Automation',
			'DevOps',
			'Multi-Agent',
			'Monorepo',
			'CICD',
		],
		publishedAt: '2025-01-15',
		author: 'John Schibelli',
		featured: true,
		metrics: {
			automation: '100+ PowerShell scripts',
			testCoverage: '90%+ coverage',
			agents: '5-agent coordination',
		},
		liveUrl: getSiteUrl('/'),
		caseStudyUrl: '/case-studies/portfolio-os',
	},
	{
		id: 'tendrilo-case-study',
		title: 'Tendril Multi-Tenant Chatbot SaaS: Strategic Analysis and Implementation Plan',
		slug: 'tendrilo-case-study',
		description:
			'Comprehensive strategic analysis and implementation plan for Tendril Multi-Tenant Chatbot SaaS platform targeting SMB market gaps.',
		image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
		tags: ['SaaS', 'AI', 'Multi-tenant', 'Chatbot'],
		publishedAt: '2025-01-10',
		author: 'John Schibelli',
		featured: true,
		metrics: {
			revenueIncrease: '150%',
			userRetention: '91%',
			setupTime: '18 minutes',
		},
		liveUrl: 'https://tendril.intrawebtech.com',
		caseStudyUrl: '/case-studies/tendrilo-case-study',
	},
];

export const metadata: Metadata = {
	title: 'Case Studies | John Schibelli Portfolio',
	description:
		'Explore detailed case studies showcasing successful projects, strategic analysis, and implementation results.',
	keywords: ['case studies', 'portfolio', 'projects', 'strategic analysis', 'implementation'],
	openGraph: {
		title: 'Case Studies | John Schibelli Portfolio',
		description:
			'Explore detailed case studies showcasing successful projects, strategic analysis, and implementation results.',
		type: 'website',
		url: getSiteUrl('/case-studies'),
	},
	alternates: {
		canonical: getSiteUrl('/case-studies'),
	},
};

export default function CaseStudiesPage() {
	return (
		<AppProvider
			publication={{
				title: 'John Schibelli',
				displayTitle: 'John Schibelli',
				descriptionSEO: 'Senior Software Engineer',
				url: getSiteUrl('/'),
				author: { name: 'John Schibelli' },
				preferences: { logo: null as any },
			}}
		>
			<Layout>
				<main className="bg-background min-h-screen">
					{/* Hero Section */}
					<section className="bg-stone-50 py-12 md:py-16 dark:bg-stone-900">
						<Container className="px-4 sm:px-6">
							<div className="mx-auto max-w-4xl text-center">
								<h1 className={`text-stone-900 dark:text-stone-100 ${typeRole.pageH1}`}>
									Case Studies
								</h1>
								<p className={`mt-6 text-stone-600 dark:text-stone-400 ${typeRole.heroSupport}`}>
									Deep dives into successful projects, strategic analysis, and implementation
									results that drive business growth.
								</p>
							</div>
						</Container>
					</section>

					{/* Case Studies Grid */}
					<section className="py-12 md:py-16">
						<Container className="px-4 sm:px-6">
							<div className="grid gap-8 lg:grid-cols-2">
								{caseStudies.map((caseStudy) => (
									<Card
										key={caseStudy.id}
										className="group overflow-hidden border border-stone-200 bg-white shadow-lg transition-all duration-300 hover:border-stone-300 hover:shadow-xl dark:border-stone-700 dark:bg-stone-800 dark:hover:border-stone-600"
									>
										<div className="relative aspect-video overflow-hidden">
											<Image
												src={caseStudy.image}
												alt={caseStudy.title}
												width={800}
												height={600}
												className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
												loading="lazy"
												quality={85}
												sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

											{/* Featured Badge */}
											{caseStudy.featured && (
												<div className="absolute left-4 top-4">
													<Badge className="bg-amber-500 text-white">Featured</Badge>
												</div>
											)}
										</div>

										<CardHeader>
											<div
												className={`flex items-center gap-2 text-stone-500 dark:text-stone-400 ${typeRole.metadata}`}
											>
												<Calendar className="h-4 w-4" />
												<span>{new Date(caseStudy.publishedAt).toLocaleDateString()}</span>
												<User className="ml-4 h-4 w-4" />
												<span>{caseStudy.author}</span>
											</div>
											<CardTitle
												as="h2"
												className={`text-stone-900 dark:text-stone-100 ${typeRole.cardTitle}`}
											>
												{caseStudy.title}
											</CardTitle>
											<CardDescription
												className={`text-stone-600 dark:text-stone-400 ${typeRole.body}`}
											>
												{caseStudy.description}
											</CardDescription>
										</CardHeader>

										<CardContent className="space-y-4">
											{/* Tags */}
											<div className="flex flex-wrap gap-2">
												{caseStudy.tags.map((tag) => (
													<Badge key={tag} variant="secondary" className="text-xs">
														<Tag className="mr-1 h-3 w-3" />
														{tag}
													</Badge>
												))}
											</div>

											{/* Metrics */}
											{caseStudy.metrics && (
												<div className="grid grid-cols-3 gap-4 rounded-lg bg-stone-50 p-4 dark:bg-stone-900">
													{Object.entries(caseStudy.metrics).map(([key, value]) => (
														<div key={key} className="text-center">
															<div className="text-lg font-bold text-stone-900 dark:text-stone-100">
																{value}
															</div>
															<div className="text-xs capitalize text-stone-600 dark:text-stone-400">
																{key.replace(/([A-Z])/g, ' $1').trim()}
															</div>
														</div>
													))}
												</div>
											)}

											{/* Actions */}
											<div className="flex gap-3">
												<Button asChild className="flex-1">
													<Link href={caseStudy.caseStudyUrl}>
														Read Case Study
														<ArrowRight className="ml-2 h-4 w-4" />
													</Link>
												</Button>
												{caseStudy.liveUrl && (
													<Button variant="outline" asChild>
														<Link
															href={caseStudy.liveUrl}
															target="_blank"
															rel="noopener noreferrer"
														>
															View Live Site
														</Link>
													</Button>
												)}
											</div>
										</CardContent>
									</Card>
								))}
							</div>

							{/* Empty State */}
							{caseStudies.length === 0 && (
								<div className="py-16 text-center">
									<h3 className="mb-4 text-lg font-semibold text-stone-900 dark:text-stone-100">
										No case studies yet
									</h3>
									<p className="text-stone-600 dark:text-stone-400">
										Check back soon for detailed case studies of our projects.
									</p>
								</div>
							)}
						</Container>
					</section>

					{/* CTA Section */}
					<section className="bg-stone-50 py-12 md:py-16 dark:bg-stone-900">
						<Container className="px-4 sm:px-6">
							<div className="mx-auto max-w-2xl text-center">
								<h2 className={`text-stone-900 dark:text-stone-100 ${typeRole.sectionH2}`}>
									Ready to work together?
								</h2>
								<p className={`mt-6 text-stone-600 dark:text-stone-400 ${typeRole.heroSupport}`}>
									Let's discuss your project and create something amazing together.
								</p>
								<div className="mt-10 flex items-center justify-center gap-x-6">
									<Button asChild size="lg">
										<Link href="/contact">
											Get in touch
											<ArrowRight className="ml-2 h-4 w-4" />
										</Link>
									</Button>
									<Button variant="outline" asChild size="lg">
										<Link href="/projects">View Projects</Link>
									</Button>
								</div>
							</div>
						</Container>
					</section>
				</main>
			</Layout>
		</AppProvider>
	);
}
