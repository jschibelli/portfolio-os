/* eslint-disable @next/next/no-img-element */
import { resizeImage } from '@starter-kit/utils/image';
import fs from 'fs';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import path from 'path';
import { useEffect, useState } from 'react';
import { AppProvider } from '../../components/contexts/appContext';
import { CaseStudyMarkdown } from '../../components/features/case-studies/case-study-markdown';
import Chatbot from '../../components/features/chatbot/Chatbot';
import ModernHeader from '../../components/features/navigation/modern-header';
import { Container } from '../../components/shared/container';
import { Layout } from '../../components/shared/layout';
import { Badge, Card, CardContent, ScrollArea } from '../../components/ui';
import { siteConfig } from '../../config/site';
import caseStudiesData from '../../data/case-studies.json';
import { generateStandardizedTOC } from '../../lib/case-study-template';

type CaseStudyMeta = (typeof caseStudiesData)[number];

interface Props {
	caseStudy: CaseStudyMeta & { content: string };
	publication: any;
}

export default function CaseStudyPage({ caseStudy, publication }: Props) {
	const [activeSection, setActiveSection] = useState<string>('');
	const tocItems = generateStandardizedTOC();

	useEffect(() => {
		const handleScroll = () => {
			const sections = tocItems.map((item) => document.getElementById(item.id));
			const scrollPosition = window.scrollY + 100;
			for (let i = sections.length - 1; i >= 0; i--) {
				const section = sections[i];
				if (section && section.offsetTop <= scrollPosition) {
					setActiveSection(tocItems[i].id);
					break;
				}
			}
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [tocItems]);

	const scrollToSection = (id: string) => {
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	};

	return (
		<AppProvider publication={publication}>
			<Layout>
				<Head>
					<title>{caseStudy.title} – Case Study</title>
					<meta name="description" content={caseStudy.description} />
					<meta property="og:title" content={caseStudy.title} />
					<meta property="og:description" content={caseStudy.description} />
					{caseStudy.image && <meta property="og:image" content={caseStudy.image} />}
				</Head>

				<ModernHeader publication={publication} />

				<main className="min-h-screen">
					<Container>
						<div className="py-8 lg:py-12">
							<div className="flex gap-6 lg:gap-8">
								{/* Main content */}
								<div className="min-w-0 flex-1">
									{/* Header Section - Consistent with ModernPostHeader */}
									<div className="mb-8 lg:mb-12">
										<div className="space-y-6 text-center">
											<div className="prose md:prose-xl dark:prose-invert prose-h1:text-center mx-auto max-w-screen-lg px-5">
												<div className="text-muted-foreground mb-3 flex items-center justify-center gap-2 text-sm">
													<span>Case Study</span>
													<span>•</span>
													<span>
														{new Date(caseStudy.publishedAt + 'T00:00:00').toLocaleDateString(
															'en-US',
															{
																year: 'numeric',
																month: 'long',
																day: 'numeric',
															},
														)}
													</span>
												</div>
												<h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
													{caseStudy.title}
												</h1>
												<p className="text-muted-foreground mx-auto max-w-3xl text-lg md:text-xl">
													{caseStudy.description}
												</p>
											</div>
										</div>
									</div>

									{/* Featured Image Section */}
									{caseStudy.image && (
										<div className="mb-8 lg:mb-12">
											<div className="relative h-64 w-full overflow-hidden rounded-xl md:h-80 lg:h-96">
												<img
													src={caseStudy.image}
													alt={caseStudy.title}
													className="h-full w-full object-cover"
												/>
												<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
											</div>
										</div>
									)}

									{/* Content Section - Consistent with other pages */}
									<div className="mx-auto w-full px-5 text-slate-600 md:max-w-screen-md dark:text-neutral-300">
										<div className="prose prose-base lg:prose-lg dark:prose-invert max-w-none">
											<CaseStudyMarkdown contentMarkdown={caseStudy.content} />
										</div>
									</div>

									{/* Author Section */}
									<div className="mx-auto mb-5 mt-10 w-full px-5 md:max-w-screen-md">
										<div className="flex-1">
											<div className="flex flex-col items-start">
												<h3 className="text-foreground border-border mb-6 w-full border-b pb-2 text-lg font-semibold">
													Written by
												</h3>
												<div className="flex w-full flex-col gap-8">
													<div className="flex items-start gap-6">
														<a
															href="https://hashnode.com/@mindware"
															className="border-primary/20 block h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-2 dark:border-slate-700"
															target="_blank"
															rel="noopener noreferrer"
														>
															<img
																src={resizeImage(
																	'https://cdn.hashnode.com/res/hashnode/image/upload/v1659089761812/fsOct5gl6.png',
																	{ w: 256, h: 256, c: 'face' },
																)}
																alt={caseStudy.author}
																className="block h-full w-full object-cover"
															/>
														</a>
														<div className="flex flex-1 flex-col">
															<h4 className="text-foreground mb-2 text-xl font-semibold">
																<a
																	href="https://hashnode.com/@mindware"
																	className="hover:text-primary transition-colors"
																	target="_blank"
																	rel="noopener noreferrer"
																>
																	{caseStudy.author}
																</a>
															</h4>
															<p className="text-muted-foreground mb-4 text-base leading-relaxed">
																Full-stack developer and technical consultant with expertise in SaaS
																platforms, AI integration, and scalable architectures. Passionate
																about building innovative solutions that drive business growth and
																user engagement.
															</p>
															<div className="flex flex-wrap gap-2">
																{caseStudy.tags.map((tag) => (
																	<Badge key={tag} variant="outline" className="text-sm">
																		{tag}
																	</Badge>
																))}
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								{/* Sticky TOC */}
								<aside className="hidden w-72 flex-shrink-0 lg:block xl:w-80">
									<div className="sticky top-20">
										<Card className="border-border/50">
											<CardContent className="p-4 lg:p-6">
												<h3 className="mb-3 text-base font-semibold lg:mb-4 lg:text-lg">
													Table of Contents
												</h3>
												<ScrollArea className="h-[calc(100vh-180px)]">
													<nav className="space-y-1 lg:space-y-2">
														{tocItems.map((item) => (
															<button
																key={item.id}
																onClick={() => scrollToSection(item.id)}
																className={`w-full rounded-lg px-2 py-1.5 text-left text-sm transition-colors duration-200 lg:px-3 lg:py-2 lg:text-base ${
																	activeSection === item.id
																		? 'bg-primary/10 text-primary border-primary/20 border'
																		: 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
																}`}
															>
																{item.title}
															</button>
														))}
													</nav>
												</ScrollArea>
											</CardContent>
										</Card>
									</div>
								</aside>
							</div>
						</div>
					</Container>
				</main>
				<Chatbot />
			</Layout>
		</AppProvider>
	);
}

export const getStaticPaths: GetStaticPaths = async () => {
	const paths = (caseStudiesData as CaseStudyMeta[])
		.filter((cs) => cs.slug !== 'tendrilo-case-study')
		.map((cs) => ({ params: { slug: cs.slug } }));
	return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const slug = params?.slug as string;
	const meta = (caseStudiesData as CaseStudyMeta[]).find((cs) => cs.slug === slug);
	if (!meta) return { notFound: true };

	// Prefer content/case-studies, fallback to docs
	const primaryPath = path.join(process.cwd(), 'content', 'case-studies', `${slug}.md`);
	const fallbackPath = path.join(process.cwd(), 'docs', `${slug}.md`);

	let content = '';
	if (fs.existsSync(primaryPath)) {
		content = fs.readFileSync(primaryPath, 'utf8');
	} else if (fs.existsSync(fallbackPath)) {
		content = fs.readFileSync(fallbackPath, 'utf8');
	} else {
		return { notFound: true };
	}

	// Minimal publication stub for header (keeps existing layout happy)
	const publication = {
		title: 'Case Studies',
		displayTitle: 'Case Studies',
		logo: null,
		url: siteConfig.url,
		integrations: {},
	};

	return {
		props: {
			caseStudy: { ...meta, content },
			publication,
		},
	};
};
