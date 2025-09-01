import { motion } from 'framer-motion';
import request from 'graphql-request';
import { ArrowRightIcon, CalendarIcon, CodeIcon, ExternalLinkIcon, UsersIcon } from 'lucide-react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { AppProvider } from '../components/contexts/appContext';
import Chatbot from '../components/features/chatbot/Chatbot';
import ModernHeader from '../components/features/navigation/modern-header';
import ProjectCard, { Project } from '../components/features/portfolio/project-card';
import { Container } from '../components/shared/container';
import { Footer } from '../components/shared/footer';
import { Layout } from '../components/shared/layout';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import portfolioData from '../data/portfolio.json';
import { PublicationByHostDocument } from '../generated/graphql';

interface Props {
	publication: any;
}

export default function WorkPage({ publication }: Props) {
	// Convert portfolio data to Project interface
	const allProjects: Project[] = portfolioData.map((item: any) => ({
		id: item.id,
		title: item.title,
		description: item.description,
		image: item.image,
		tags: item.tags,
		caseStudyUrl: item.caseStudyUrl,
	}));

	// Featured projects (first 3)
	const featuredProjects = allProjects.slice(0, 3);

	// Remaining projects
	const otherProjects = allProjects.slice(3);

	return (
		<AppProvider publication={publication}>
			<Layout>
				<Head>
					<title>{publication.displayTitle || publication.title} - Work & Case Studies</title>
					<meta
						name="description"
						content="Explore our portfolio of case studies and projects showcasing modern web development solutions"
					/>
					<meta
						property="og:title"
						content={`${publication.displayTitle || publication.title} - Work & Case Studies`}
					/>
					<meta
						property="og:description"
						content="Explore our portfolio of case studies and projects showcasing modern web development solutions"
					/>
					<meta property="og:type" content="website" />
					<meta property="og:url" content={`${publication.url}/work`} />
					<meta
						name="twitter:title"
						content={`${publication.displayTitle || publication.title} - Work & Case Studies`}
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
										Work & Case Studies
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
											<span>Modern Tech Stack</span>
										</div>
									</div>
								</motion.div>
							</Container>
						</div>
					</section>

					{/* Featured Projects Section */}
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
									Featured Projects
								</h2>
								<p className="mx-auto max-w-2xl text-xl text-stone-600 dark:text-stone-400">
									Our most recent and impactful projects that demonstrate our expertise in modern
									web development and design.
								</p>
							</motion.div>

							{/* Featured Projects Grid */}
							<div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
								{featuredProjects.map((project, index) => (
									<ProjectCard key={project.id} project={project} index={index} />
								))}
							</div>
						</Container>
					</section>

					{/* All Projects Section */}
					{otherProjects.length > 0 && (
						<section className="bg-stone-50 py-20 dark:bg-stone-900">
							<Container className="px-4">
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.8, ease: 'easeOut' }}
									viewport={{ once: true }}
									className="mb-16 text-center"
								>
									<h2 className="mb-4 text-3xl font-bold text-stone-900 md:text-4xl dark:text-stone-100">
										All Projects
									</h2>
									<p className="mx-auto max-w-2xl text-xl text-stone-600 dark:text-stone-400">
										Explore our complete portfolio of projects and case studies.
									</p>
								</motion.div>

								{/* All Projects Grid */}
								<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
									{otherProjects.map((project, index) => (
										<ProjectCard
											key={project.id}
											project={project}
											index={index + featuredProjects.length}
										/>
									))}
								</div>
							</Container>
						</section>
					)}

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
				<Footer />

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
