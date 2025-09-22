import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { PostFullFragment, PublicationFragment } from '../../../generated/graphql';
import { generateStandardizedTOC } from '../../../lib/case-study-template';
import { Container } from '../../shared/container';
import { Footer } from '../../shared/footer';
import CustomScrollArea from '../../shared/scroll-area';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import AboutAuthor from '../blog/about-author';
import { ModernPostHeader } from '../blog/modern-post-header';
import { PostComments } from '../blog/post-comments';
import { Subscribe } from '../newsletter/subscribe';
import { CaseStudyMarkdown } from './case-study-markdown';

interface CaseStudyLayoutProps {
	post: PostFullFragment;
	publication: PublicationFragment;
	children?: React.ReactNode;
}

interface TOCItem {
	id: string;
	title: string;
	level: number;
	slug: string;
}

// Helper function to generate consistent IDs (same as in CaseStudyMarkdown)
const generateHeadingId = (text: string): string => {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.trim();
};

export const CaseStudyLayout: React.FC<CaseStudyLayoutProps> = ({
	post,
	publication,
	children,
}) => {
	const [activeSection, setActiveSection] = useState<string>('');
	const [tocItems, setTocItems] = useState<TOCItem[]>([]);
	const [isTocVisible, setIsTocVisible] = useState(false);

	// Extract TOC items from post content
	useEffect(() => {
		// For case studies, always use the standardized structure
		const standardizedTOC = generateStandardizedTOC();
		const items = standardizedTOC.map((item) => ({
			id: generateHeadingId(item.title),
			title: item.title,
			level: item.level,
			slug: generateHeadingId(item.title),
		}));

		setTocItems(items);
	}, [post]);

	// Handle scroll to update active section
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

		if (tocItems.length > 0) {
			window.addEventListener('scroll', handleScroll);
			return () => window.removeEventListener('scroll', handleScroll);
		}
	}, [tocItems]);

	// Handle mobile TOC toggle
	useEffect(() => {
		const handleResize = () => {
			setIsTocVisible(window.innerWidth >= 1024);
		};

		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const scrollToSection = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	return (
		<div className="bg-background min-h-screen">
			{/* Mobile TOC Toggle */}
			<div className="fixed right-4 top-20 z-50 lg:hidden">
                                <Button
                                        onClick={() => setIsTocVisible(!isTocVisible)}
                                        className="bg-background/80 border-border/50 backdrop-blur-sm"
				>
					<svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
					Table of Contents
				</Button>
			</div>

			{/* Mobile TOC Overlay */}
			<AnimatePresence>
				{isTocVisible && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="bg-background/80 fixed inset-0 z-40 backdrop-blur-sm lg:hidden"
						onClick={() => setIsTocVisible(false)}
					>
						<motion.div
							initial={{ x: '100%' }}
							animate={{ x: 0 }}
							exit={{ x: '100%' }}
							className="bg-background border-border/50 absolute right-0 top-0 h-full w-80 border-l p-6"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="mb-4 flex items-center justify-between">
								<h3 className="text-lg font-semibold">Table of Contents</h3>
                                                                <Button onClick={() => setIsTocVisible(false)}>
									<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</Button>
							</div>
							<CustomScrollArea className="h-[calc(100vh-120px)]">
								<nav className="space-y-2">
									{tocItems.map((item) => (
										<button
											key={item.id}
											onClick={() => {
												scrollToSection(item.id);
												setIsTocVisible(false);
											}}
											className={`w-full rounded-lg px-3 py-2 text-left transition-colors duration-200 ${
												activeSection === item.id
													? 'bg-primary/10 text-primary border-primary/20 border'
													: 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
											} ${item.level === 3 ? 'ml-4 text-sm' : ''}`}
										>
											{item.title}
										</button>
									))}
								</nav>
							</CustomScrollArea>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			<Container className="pt-10">
				<div className="flex gap-8">
					{/* Main Content */}
					<article className="max-w-none flex-1">
						{/* Post Header */}
						<ModernPostHeader
							title={post.title}
							coverImage={post.coverImage?.url}
							date={post.publishedAt}
							author={post.author}
							readTimeInMinutes={post.readTimeInMinutes}
						/>

						{/* Tags */}
						{post.tags && post.tags.length > 0 && (
							<div className="mb-8 flex flex-wrap gap-2">
								{post.tags.map((tag) => (
									<Link
										key={tag.id}
										href={`/tag/${tag.slug}`}
										className="border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors"
									>
										#{tag.slug}
									</Link>
								))}
							</div>
						)}

						{/* Content */}
						<div className="prose prose-lg dark:prose-invert max-w-none">
							{children || <CaseStudyMarkdown contentMarkdown={post.content.markdown} />}
						</div>

						{/* Footer CTA Slot */}
						<div className="mt-12">
							<Card className="from-primary/10 to-primary/5 border-primary/20 bg-gradient-to-br">
								<CardContent className="p-8 text-center">
									<h3 className="text-foreground mb-4 text-2xl font-bold">
										Ready to Build Something Similar?
									</h3>
									<p className="text-muted-foreground mx-auto mb-6 max-w-2xl">
										Let&apos;s discuss how we can bring your vision to life with a custom solution
										tailored to your needs.
									</p>
									<div className="flex flex-col justify-center gap-4 sm:flex-row">
                                                                                <Button asChild>
                                                                                        <Link href="/contact">Start a Project</Link>
                                                                                </Button>
                                                                                <Button asChild>
											<Link href="/case-studies">View More Case Studies</Link>
										</Button>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* About Author */}
						<AboutAuthor />

						{/* Comments */}
						{!post.preferences.disableComments && post.comments.totalDocuments > 0 && (
							<PostComments />
						)}

						{/* Subscribe */}
						<Subscribe />
					</article>

					{/* Desktop TOC Sidebar */}
					{tocItems.length > 0 && (
						<aside className="hidden w-80 flex-shrink-0 lg:block">
							<div className="sticky top-24">
								<Card className="border-border/50">
									<CardContent className="p-6">
										<h3 className="mb-4 text-lg font-semibold">Table of Contents</h3>
										<CustomScrollArea className="h-[calc(100vh-200px)]">
											<nav className="space-y-2">
												{tocItems.map((item) => (
													<button
														key={item.id}
														onClick={() => scrollToSection(item.id)}
														className={`w-full rounded-lg px-3 py-2 text-left transition-colors duration-200 ${
															activeSection === item.id
																? 'bg-primary/10 text-primary border-primary/20 border'
																: 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
														} ${item.level === 3 ? 'ml-4 text-sm' : ''}`}
													>
														{item.title}
													</button>
												))}
											</nav>
										</CustomScrollArea>
									</CardContent>
								</Card>
							</div>
						</aside>
					)}
				</div>
			</Container>

			{/* Footer - Case study pages include footer for consistency with other pages */}
			<Footer publication={publication} />
		</div>
	);
};
