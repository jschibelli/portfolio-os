import { ArrowLeft, Calendar, Tag, User } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppProvider } from '../../../components/contexts/appContext';
import { CaseStudyMarkdown } from '../../../components/features/case-studies/case-study-markdown';
import { TableOfContents } from '../../../components/features/case-studies/table-of-contents';
import { Container } from '../../../components/shared/container';
import { Layout } from '../../../components/shared/layout';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../../../components/ui/card';
import { getMetadataBase, getSiteUrl } from '../../../config/site';
import { getAllCaseStudySlugs, getCaseStudyBySlug } from '../../../lib/mdx-case-study-loader';
import { typeRole } from '../../../lib/typography';

interface CaseStudyPageProps {
	params: Promise<{
		slug: string;
	}>;
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
	const { slug } = await params;
	const caseStudyData = await getCaseStudyBySlug(slug);

	if (!caseStudyData) {
		return {
			title: 'Case Study Not Found',
		};
	}

	const { meta } = caseStudyData;
	const title = `${meta.title} | John Schibelli Portfolio`;
	const description =
		meta.excerpt || meta.seoDescription || 'Case study showcasing development work';
	const canonical = getSiteUrl(`/case-studies/${slug}`);

	return {
		metadataBase: getMetadataBase(),
		title,
		description,
		keywords: meta.tags || [],
		authors: [{ name: meta.author?.name || 'John Schibelli' }],
		creator: 'John Schibelli',
		publisher: 'John Schibelli',
		robots: {
			index: true,
			follow: true,
			nocache: false,
			googleBot: {
				index: true,
				follow: true,
				noimageindex: false,
				'max-video-preview': -1,
				'max-image-preview': 'large',
				'max-snippet': -1,
			},
		},
		openGraph: {
			type: 'article',
			locale: 'en_US',
			url: canonical,
			title: meta.seoTitle || title,
			description,
			siteName: 'John Schibelli Portfolio',
			images: meta.coverImage
				? [
						{
							url: meta.coverImage,
							width: 1200,
							height: 630,
							alt: `${meta.title} - Case Study`,
						},
					]
				: [],
		},
		twitter: {
			card: 'summary_large_image',
			title: meta.seoTitle || title,
			description,
			creator: '@johnschibelli',
			site: '@johnschibelli',
			images: meta.coverImage ? [meta.coverImage] : [],
		},
		alternates: {
			canonical,
		},
		other: {
			'article:author': meta.author?.name || 'John Schibelli',
			'article:section': 'Case Studies',
			'article:tag': (meta.tags || []).join(', '),
		},
	};
}

export async function generateStaticParams() {
	const slugs = getAllCaseStudySlugs();
	return slugs.map((slug) => ({
		slug,
	}));
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
	const { slug } = await params;
	const caseStudyData = await getCaseStudyBySlug(slug);

	if (!caseStudyData) {
		notFound();
	}

	const { meta, content } = caseStudyData;

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
					<Container className="mx-auto max-w-7xl py-8">
						<div className="flex gap-8 lg:gap-12">
							{/* Main Content */}
							<article className="min-w-0 flex-1">
								{/* Back Button */}
								<div className="mb-8">
									<Button variant="ghost" asChild>
										<Link href="/case-studies" className="flex items-center gap-2">
											<ArrowLeft className="h-4 w-4" />
											Back to Case Studies
										</Link>
									</Button>
								</div>

								{/* Case Study Header */}
								<div className="mb-12">
									<div
										className={`mb-4 flex items-center gap-2 text-stone-500 dark:text-stone-400 ${typeRole.metadata}`}
									>
										<Calendar className="h-4 w-4" />
										<span>
											{meta.publishedAt
												? new Date(meta.publishedAt).toLocaleDateString()
												: 'Not published'}
										</span>
										<User className="ml-4 h-4 w-4" />
										<span>{meta.author?.name || 'John Schibelli'}</span>
									</div>

									<h1 className={`mb-6 text-stone-900 dark:text-stone-100 ${typeRole.caseStudyH1}`}>
										{meta.title}
									</h1>

									<p className={`mb-8 text-stone-600 dark:text-stone-400 ${typeRole.heroSupport}`}>
										{meta.excerpt || meta.seoDescription}
									</p>

									{/* Tags */}
									{meta.tags && meta.tags.length > 0 && (
										<div className="mb-8 flex flex-wrap gap-2">
											{meta.tags.map((tag) => (
												<Badge key={tag} variant="secondary" className="text-sm">
													<Tag className="mr-1 h-3 w-3" />
													{tag}
												</Badge>
											))}
										</div>
									)}

									{/* Metrics */}
									{meta.metrics && Object.keys(meta.metrics).length > 0 && (
										<Card className="mb-8">
											<CardHeader>
												<CardTitle as="h2" className={typeRole.sectionH2}>
													Key Results
												</CardTitle>
												<CardDescription>Measurable outcomes from this project</CardDescription>
											</CardHeader>
											<CardContent>
												<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
													{Object.entries(meta.metrics).map(([key, value]) => (
														<div key={key} className="text-center">
															<div className="text-2xl font-bold text-stone-900 dark:text-stone-100">
																{value}
															</div>
															<div className="text-sm capitalize text-stone-600 dark:text-stone-400">
																{key.replace(/([A-Z])/g, ' $1').trim()}
															</div>
														</div>
													))}
												</div>
											</CardContent>
										</Card>
									)}
								</div>

								{/* Case Study Content */}
								<div className={`prose dark:prose-invert ${typeRole.articleBody}`}>
									<CaseStudyMarkdown contentMarkdown={content} />
								</div>

								{/* CTA Section */}
								<Card className="mt-12">
									<CardContent className="pt-6">
										<div className="text-center">
											<h2
												className={`mb-2 text-stone-900 dark:text-stone-100 ${typeRole.sectionH2}`}
											>
												Interested in working together?
											</h2>
											<p className={`mb-4 text-stone-600 dark:text-stone-400 ${typeRole.body}`}>
												Let's discuss how we can create something amazing for your business.
											</p>
											<div className="flex flex-wrap justify-center gap-4">
												<Button asChild>
													<Link href="/contact">Get in Touch</Link>
												</Button>
												<Button variant="outline" asChild>
													<Link href="/projects">View More Projects</Link>
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							</article>

							{/* Table of Contents - Sticky Sidebar */}
							<aside className="hidden w-64 flex-shrink-0 lg:block xl:w-72">
								<TableOfContents content={content} />
							</aside>
						</div>
					</Container>
				</main>
			</Layout>
		</AppProvider>
	);
}
