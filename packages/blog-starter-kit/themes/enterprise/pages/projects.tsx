import { motion } from 'framer-motion';
import request from 'graphql-request';
import { ArrowRightIcon, CalendarIcon, CodeIcon, ExternalLinkIcon, UsersIcon, X } from 'lucide-react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { AppProvider } from '../components/contexts/appContext';
import Chatbot from '../components/features/chatbot/Chatbot';
import ModernHeader from '../components/features/navigation/modern-header';
import ProjectCard, { Project } from '../components/features/portfolio/project-card';
import { Container } from '../components/shared/container';

import { Layout } from '../components/shared/layout';
import { Badge, Button } from '../components/ui';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import portfolioData from '../data/portfolio.json';
import { PublicationByHostDocument } from '../generated/graphql';

interface Props {
	publication: any;
}

export default function ProjectsPage({ publication }: Props) {
	const router = useRouter();
	const { tags, search, sort } = router.query;

	// Convert portfolio data to Project interface
	const allProjects: Project[] = portfolioData.map((item: any) => ({
		id: item.id,
		title: item.title,
		description: item.description,
		image: item.image,
		tags: item.tags,
		caseStudyUrl: item.caseStudyUrl,
	}));

	// Extract all unique tags for filtering
	const allTags = Array.from(new Set(allProjects.flatMap(project => project.tags))).sort();

	// Get current filter values from URL
	const currentTags = useMemo(() => {
		const tagParam = Array.isArray(tags) ? tags[0] : tags;
		return tagParam ? tagParam.split(',').filter(Boolean) : [];
	}, [tags]);

	const currentSearch = useMemo(() => {
		return Array.isArray(search) ? search[0] : search || '';
	}, [search]);

	const currentSort = useMemo(() => {
		return Array.isArray(sort) ? sort[0] : sort || 'default';
	}, [sort]);

	// Filter and sort projects based on URL params
	const filteredAndSortedProjects = useMemo(() => {
		let filtered = [...allProjects];

		// Apply search filter
		if (currentSearch) {
			const searchLower = currentSearch.toLowerCase();
			filtered = filtered.filter(project =>
				project.title.toLowerCase().includes(searchLower) ||
				project.description.toLowerCase().includes(searchLower) ||
				project.tags.some(tag => tag.toLowerCase().includes(searchLower))
			);
		}

		// Apply tag filters
		if (currentTags.length > 0) {
			filtered = filtered.filter(project =>
				currentTags.some(tag => project.tags.includes(tag))
			);
		}

		// Apply sorting
		switch (currentSort) {
			case 'title-asc':
				filtered.sort((a, b) => a.title.localeCompare(b.title));
				break;
			case 'title-desc':
				filtered.sort((a, b) => b.title.localeCompare(a.title));
				break;
			case 'tags-asc':
				filtered.sort((a, b) => b.tags.length - a.tags.length);
				break;
			case 'tags-desc':
				filtered.sort((a, b) => a.tags.length - b.tags.length);
				break;
			default:
				// Keep original order
				break;
		}

		return filtered;
	}, [allProjects, currentSearch, currentTags, currentSort]);

	// Update URL with new filters
	const updateFilters = useCallback((updates: Record<string, string | null>) => {
		const query = { ...router.query };
		
		Object.entries(updates).forEach(([key, value]) => {
			if (value === null || value === '') {
				delete query[key];
			} else {
				query[key] = value;
			}
		});

		router.push({ pathname: router.pathname, query }, undefined, { shallow: true });
	}, [router]);

	// Handle tag selection
	const handleTagToggle = useCallback((tag: string) => {
		const newTags = currentTags.includes(tag)
			? currentTags.filter(t => t !== tag)
			: [...currentTags, tag];
		
		updateFilters({ tags: newTags.length > 0 ? newTags.join(',') : null });
	}, [currentTags, updateFilters]);

	// Handle search input
	const handleSearchChange = useCallback((value: string) => {
		updateFilters({ search: value || null });
	}, [updateFilters]);

	// Handle sort change
	const handleSortChange = useCallback((value: string) => {
		updateFilters({ sort: value === 'default' ? null : value });
	}, [updateFilters]);

	// Clear all filters
	const clearAllFilters = useCallback(() => {
		router.push('/projects', undefined, { shallow: true });
	}, [router]);

	const hasActiveFilters = currentTags.length > 0 || currentSearch || currentSort !== 'default';

	return (
		<AppProvider publication={publication}>
			<Layout>
				<Head>
					<title>{publication.displayTitle || publication.title} - Projects & Case Studies</title>
					<meta
						name="description"
						content="Explore our portfolio of case studies and projects showcasing modern web development solutions"
					/>
					<meta
						property="og:title"
						content={`${publication.displayTitle || publication.title} - Projects & Case Studies`}
					/>
					<meta
						property="og:description"
						content="Explore our portfolio of case studies and projects showcasing modern web development solutions"
					/>
					<meta property="og:type" content="website" />
					<meta property="og:url" content={`${publication.url}/projects`} />
					<meta
						name="twitter:title"
						content={`${publication.displayTitle || publication.title} - Projects & Case Studies`}
					/>
					<meta
						name="twitter:description"
						content="Explore our portfolio of case studies and projects showcasing modern web development solutions"
					/>
				</Head>
				<ModernHeader publication={publication} />

				<main className="min-h-screen bg-white dark:bg-stone-950">
					{/* Hero Section */}
					<section
						className="relative min-h-[400px] overflow-hidden bg-stone-50 py-12 md:py-16 dark:bg-stone-900"
						style={{
							backgroundImage: 'url(/assets/hero/hero-bg2.png)',
							backgroundSize: 'cover',
							backgroundPosition: 'center',
							backgroundRepeat: 'no-repeat',
						}}
					>
						{/* Background Overlay */}
						<div className="absolute inset-0 z-0 bg-stone-50/70 dark:bg-stone-900/70"></div>
						{/* Content Overlay */}
						<div className="relative z-10">
							<Container className="px-4">
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.8, ease: 'easeOut' }}
									className="mx-auto max-w-4xl text-center"
								>
								<h1 className="mb-6 text-5xl font-bold text-stone-900 md:text-6xl dark:text-stone-100">
									Projects & Case Studies
								</h1>
								<p className="mb-8 text-xl leading-relaxed text-stone-600 md:text-2xl dark:text-stone-400">
									A collection of projects that showcase modern web development, innovative design
									solutions, and impactful digital experiences.
								</p>
								<div className="flex flex-wrap justify-center gap-4 text-sm text-stone-500 dark:text-stone-400">
									<div className="flex items-center gap-2">
										<CalendarIcon className="h-4 w-4" />
										<span>{allProjects.length} Projects</span>
									</div>
									<div className="flex items-center gap-2">
										<UsersIcon className="h-4 w-4" />
										<span>Client Success Stories</span>
									</div>
									<div className="flex items-center gap-2">
										<CodeIcon className="h-4 w-4" />
										<span>{allTags.length} Technologies</span>
									</div>
								</div>
								</motion.div>
							</Container>
						</div>
					</section>

					{/* Filters Section */}
					<section className="border-b border-stone-200 bg-white py-8 dark:border-stone-800 dark:bg-stone-950">
						<Container className="px-4">
							<div className="space-y-6">
								{/* Search and Sort Row */}
								<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
									<div className="flex flex-1 items-center gap-4">
										<div className="relative flex-1 max-w-md">
											<Label htmlFor="search" className="sr-only">
												Search projects
											</Label>
											<Input
												id="search"
												type="text"
												placeholder="Search projects..."
												value={currentSearch}
												onChange={(e) => handleSearchChange(e.target.value)}
												className="pl-4"
											/>
										</div>
										<div className="flex items-center gap-2">
											<Label htmlFor="sort" className="text-sm font-medium text-stone-700 dark:text-stone-300">
												Sort:
											</Label>
											<Select value={currentSort} onValueChange={handleSortChange}>
												<SelectTrigger id="sort" className="w-40">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="default">Default</SelectItem>
													<SelectItem value="title-asc">Title A-Z</SelectItem>
													<SelectItem value="title-desc">Title Z-A</SelectItem>
													<SelectItem value="tags-asc">Most Tags</SelectItem>
													<SelectItem value="tags-desc">Fewest Tags</SelectItem>
												</SelectContent>
											</Select>
										</div>
									</div>

									{hasActiveFilters && (
										<Button
											variant="outline"
											size="sm"
											onClick={clearAllFilters}
											className="flex items-center gap-2"
										>
											<X className="h-4 w-4" />
											Clear Filters
										</Button>
									)}
								</div>

								{/* Active Filters Display */}
								{hasActiveFilters && (
									<div className="flex flex-wrap items-center gap-2">
										<span className="text-sm font-medium text-stone-700 dark:text-stone-300">
											Active filters:
										</span>
										
										{currentSearch && (
											<Badge variant="secondary" className="flex items-center gap-1">
												Search: &quot;{currentSearch}&quot;
												<button
													onClick={() => handleSearchChange('')}
													className="ml-1 hover:text-red-600"
													aria-label="Remove search filter"
												>
													<X className="h-3 w-3" />
												</button>
											</Badge>
										)}

										{currentSort !== 'default' && (
											<Badge variant="secondary" className="flex items-center gap-1">
												Sort: {currentSort.replace('-', ' ')}
												<button
													onClick={() => handleSortChange('default')}
													className="ml-1 hover:text-red-600"
													aria-label="Remove sort filter"
												>
													<X className="h-3 w-3" />
												</button>
											</Badge>
										)}

										{currentTags.map((tag) => (
											<Badge key={tag} variant="secondary" className="flex items-center gap-1">
												{tag}
												<button
													onClick={() => handleTagToggle(tag)}
													className="ml-1 hover:text-red-600"
													aria-label={`Remove ${tag} filter`}
												>
													<X className="h-3 w-3" />
												</button>
											</Badge>
										))}
									</div>
								)}

								{/* Technology Tags */}
								<div className="space-y-3">
									<Label className="text-sm font-medium text-stone-700 dark:text-stone-300">
										Filter by Technology:
									</Label>
									<div className="flex flex-wrap gap-2">
										{allTags.map((tag) => (
											<button
												key={tag}
												onClick={() => handleTagToggle(tag)}
												className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 ${
													currentTags.includes(tag)
														? 'bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200'
														: 'bg-stone-200 text-stone-700 hover:bg-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700'
												}`}
												aria-pressed={currentTags.includes(tag)}
												aria-label={`Filter by ${tag} technology`}
											>
												{tag}
											</button>
										))}
									</div>
								</div>

								{/* Results Summary */}
								<div className="text-sm text-stone-600 dark:text-stone-400">
									{hasActiveFilters ? (
										<span>
											Showing {filteredAndSortedProjects.length} of {allProjects.length} projects
											{currentTags.length > 0 && ` for ${currentTags.length} technology filter${currentTags.length > 1 ? 's' : ''}`}
											{currentSearch && ` matching &quot;${currentSearch}&quot;`}
										</span>
									) : (
										<span>Showing all {allProjects.length} projects</span>
									)}
								</div>
							</div>
						</Container>
					</section>

					{/* Projects Grid Section */}
					<section className="bg-stone-50 py-20 dark:bg-stone-900">
						<Container className="px-4">
							{filteredAndSortedProjects.length === 0 ? (
								<div className="text-center py-16">
									<div className="mx-auto max-w-md">
										<h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
											No projects found
										</h3>
										<p className="text-stone-600 dark:text-stone-400 mb-6">
											Try adjusting your search criteria or clearing the filters to see all projects.
										</p>
										<div className="space-y-2 text-sm text-stone-500 dark:text-stone-500">
											<p>• Check your search terms for typos</p>
											<p>• Try different technology filters</p>
											<p>• Clear all filters to see everything</p>
										</div>
									</div>
								</div>
							) : (
								<>
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										whileInView={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.8, ease: 'easeOut' }}
										viewport={{ once: true }}
										className="mb-16 text-center"
									>
										<h2 className="mb-4 text-3xl font-bold text-stone-900 md:text-4xl dark:text-stone-100">
											Projects
										</h2>
										<p className="mx-auto max-w-2xl text-xl text-stone-600 dark:text-stone-400">
											{hasActiveFilters 
												? `Showing ${filteredAndSortedProjects.length} of ${allProjects.length} projects`
												: 'Explore our complete portfolio of projects and case studies.'
											}
										</p>
									</motion.div>

									{/* Projects Grid */}
									<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
										{filteredAndSortedProjects.map((project, index) => (
											<ProjectCard
												key={project.id}
												project={project}
												index={index}
											/>
										))}
									</div>

									{/* Results Footer */}
									{filteredAndSortedProjects.length > 0 && (
										<div className="text-center pt-8 border-t border-stone-200 dark:border-stone-800 mt-16">
											<p className="text-sm text-stone-600 dark:text-stone-400">
												Showing {filteredAndSortedProjects.length} project{filteredAndSortedProjects.length !== 1 ? 's' : ''}
												{filteredAndSortedProjects.length < allProjects.length && (
													<span> of {allProjects.length} total</span>
												)}
											</p>
										</div>
									)}
								</>
							)}
						</Container>
					</section>

					{/* Technologies & Skills Section */}
					<section className="bg-white py-20 dark:bg-stone-950">
						<Container className="px-4">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, ease: 'easeOut' }}
								viewport={{ once: true }}
								className="mb-16 text-center"
							>
								<h2 className="mb-4 text-3xl font-bold text-stone-900 md:text-4xl dark:text-stone-100">
									Technologies & Skills
								</h2>
								<p className="mx-auto max-w-2xl text-xl text-stone-600 dark:text-stone-400">
									We work with modern technologies to deliver exceptional digital experiences.
								</p>
							</motion.div>

							{/* Technology Categories */}
							<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
								{[
									{
										category: 'Frontend',
										technologies: [
											'React',
											'Next.js',
											'TypeScript',
											'Tailwind CSS',
											'Framer Motion',
										],
									},
									{
										category: 'Backend',
										technologies: ['Node.js', 'Prisma', 'PostgreSQL', 'GraphQL', 'REST APIs'],
									},
									{
										category: 'Cloud & DevOps',
										technologies: ['AWS', 'Vercel', 'Docker', 'CI/CD', 'Monitoring'],
									},
									{
										category: 'Design & UX',
										technologies: [
											'Figma',
											'Accessibility',
											'Responsive Design',
											'Performance',
											'SEO',
										],
									},
								].map((category, index) => (
									<motion.div
										key={category.category}
										initial={{ opacity: 0, y: 20 }}
										whileInView={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
										viewport={{ once: true }}
										className="rounded-lg bg-stone-50 p-6 dark:bg-stone-900"
									>
										<h3 className="mb-4 text-lg font-semibold text-stone-900 dark:text-stone-100">
											{category.category}
										</h3>
										<div className="space-y-2">
											{category.technologies.map((tech) => (
												<Badge
													key={tech}
													variant="secondary"
													className="border border-stone-200 bg-white text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
												>
													{tech}
												</Badge>
											))}
										</div>
									</motion.div>
								))}
							</div>
						</Container>
					</section>

					{/* CTA Section */}
					<section className="bg-gradient-to-br from-stone-900 to-stone-800 py-20 dark:from-stone-800 dark:to-stone-900">
						<Container className="px-4">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, ease: 'easeOut' }}
								viewport={{ once: true }}
								className="mx-auto max-w-3xl text-center"
							>
								<h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
									Ready to Start Your Project?
								</h2>
								<p className="mb-8 text-xl text-stone-300">
									Let&apos;s discuss how we can help bring your vision to life with cutting-edge
									technology solutions.
								</p>
								<div className="flex flex-col justify-center gap-4 sm:flex-row">
									<Button
										size="lg"
										className="px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
										asChild
									>
										<Link href="/about">
											Get In Touch
											<ArrowRightIcon className="ml-2 h-5 w-5" />
										</Link>
									</Button>
									<Button
										size="lg"
										variant="outline"
										className="px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white hover:text-stone-900"
										asChild
									>
										<Link href="/blog">
											Read Our Blog
											<ExternalLinkIcon className="ml-2 h-5 w-5" />
										</Link>
									</Button>
								</div>
							</motion.div>
						</Container>
					</section>
				</main>

				{/* Chatbot */}
				<Chatbot />
			</Layout>
		</AppProvider>
	);
}

export const getStaticProps: GetStaticProps<Props> = async () => {
	const GQL_ENDPOINT = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT || 'https://gql.hashnode.com/';
	const host = process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST || 'mindware.hashnode.dev';

	try {
		const data = await request(GQL_ENDPOINT, PublicationByHostDocument, {
			host: host,
		});

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
