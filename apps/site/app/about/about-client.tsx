'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { Container } from '../../components/shared/container';
import { Layout } from '../../components/shared/layout';
import { Button } from '../../components/ui/button';
import { Timeline, TimelineItem } from '../../components/ui/timeline';
import { siteConfig } from '../../config/site';

import { ArrowRight, Brackets, Code, GraduationCap } from 'lucide-react';
import { typeRole } from '../../lib/typography';

const experience = [
	{
		title: 'Senior Front-End Engineer',
		company: 'IntraWeb Technology',
		period: 'Nov 2020 - Present',
		location: 'Montville, NJ',
		description:
			'Designed and developed company website and architected AI-powered collaboration platform.',
		achievements: [
			'Designed and developed the IntraWeb Technologies company website using Next.js, React, TypeScript, and Tailwind CSS, delivering a modern, accessible, and SEO-optimized online presence.',
			'Led multiple client projects delivering custom WordPress and Shopify websites emphasizing mobile responsiveness, performance, and SEO.',
			'Architected SynaplyAI, a multi-tenant AI content collaboration platform, implementing automated CI/CD pipelines (GitHub Actions + Vercel), agentic developer workflows with Cursor/Copilot, and real-time collaborative editing backed by AI-driven conflict resolution.',
			'Built tenant-level isolation, role-based access control, and subscription billing (Stripe), while integrating OpenAI APIs for adaptive AI content handling.',
			'Standardized automation pipelines for linting, testing, deployments, and staging environments across monorepos.',
		],
		logo: '/assets/personal-logo.png',
	},
	{
		title: 'Full-Stack Developer',
		company: 'ColorStreet',
		period: 'Apr 2024 - Nov 2024',
		location: 'Totowa, NJ',
		description: 'Built automation pipelines and collaborated on high-traffic e-commerce platform.',
		achievements: [
			"Built and maintained automation pipelines for the company's high-traffic e-commerce platform, integrating Playwright tests with GitHub Actions to enable reliable CI/CD and reduce regression cycle time.",
			'Partnered with backend engineers to integrate and validate Nest.js APIs, ensuring stable data flow and alignment across the stack.',
			'Implemented branch-based workflows and staging environments, supporting parallel feature development and safer releases.',
			'Collaborated with QA, product, and design teams to deliver accessible, high-performance UI features that improved the customer shopping experience.',
		],
		logo: '/assets/personal-logo.png',
	},
	{
		title: 'Senior Front-End Developer',
		company: 'Executive Five Star',
		period: 'Apr 2016 - Oct 2020',
		location: 'Montville, NJ',
		description:
			'Developed WordPress website and integrated booking system for car service business.',
		achievements: [
			"Developed and maintained the company's primary WordPress website for its car service business, improving usability and mobile responsiveness for customers booking transportation.",
			'Integrated the Limo Anywhere API to support real-time online reservations, allowing customers to schedule rides directly through the website with instant back-office synchronization.',
			'Streamlined driver scheduling and dispatch workflows by connecting front-end booking with internal systems, reducing manual data entry and increasing operational efficiency.',
			'Customized booking flows, styling, and plugin logic to align with brand guidelines and business requirements.',
		],
		logo: '/assets/personal-logo.png',
	},
	{
		title: 'Front-End Developer',
		company: 'Robert Half Technology',
		period: 'Mar 2013 - Apr 2016',
		location: 'Parsippany, NJ',
		description:
			'Developed enterprise UIs and led WordPress projects while mentoring junior developers.',
		achievements: [
			'Developed custom user interfaces for internal financial platforms using JavaScript, jQuery, and Bootstrap, contributing to improved user workflows for reporting and data analysis.',
			'Built and maintained interactive presentation tools for pharmaceutical clients using Veeva CRM and HTML5, ensuring compatibility across platforms and devices.',
			'Collaborated with design and QA teams to deliver front-end features aligned with enterprise UX guidelines, working within Agile development cycles.',
			'Led front-end development for multiple internal WordPress projects, including custom theme builds and admin-side UI customization.',
			'Mentored junior developers on front-end best practices, Git workflows, and component-based design approaches.',
		],
		logo: '/assets/personal-logo.png',
	},
	{
		title: 'Web Developer (Contract)',
		company: 'Level-Nine Creative',
		period: 'Jul 2009 - Feb 2013',
		location: 'Merritt Island, FL',
		description: 'Designed and developed custom websites for small businesses and design agencies.',
		achievements: [
			'Designed and developed custom websites for small businesses and design agencies using WordPress, PHP, JavaScript, and CSS.',
			'Built and styled reusable UI components to meet client brand requirements and ensure responsive cross-browser performance.',
		],
		logo: '/assets/personal-logo.png',
	},
	{
		title: 'Web Development Program Director',
		company: 'Anthem Institute',
		period: 'Jan 2005 - Jun 2009',
		location: 'Parsippany, NJ',
		description: 'Taught web development and managed instructors across multiple campuses.',
		achievements: [
			'Taught and developed curriculum in HTML, CSS, JavaScript, PHP, and MySQL, equipping students with industry-ready web development skills.',
			'Managed and mentored a team of 8 instructors across 4 campuses while ensuring curriculum alignment and instructional quality.',
		],
		logo: '/assets/personal-logo.png',
	},
];

export function AboutPageClient() {
	return (
		<Layout>
			<section className="relative overflow-hidden py-12 md:py-16">
				<div className="absolute inset-0 z-0">
					<div
						className="h-full w-full bg-cover bg-center bg-no-repeat"
						style={{ backgroundImage: 'url(/assets/hero/hero-bg.png)' }}
					/>
					<div className="absolute inset-0 bg-gradient-to-br from-stone-900/95 via-stone-900/85 to-stone-800/75" />
					<div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-transparent to-stone-900/50" />
				</div>

				<div className="relative z-10">
					<Container className="px-4">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 1.0, ease: 'easeOut' }}
							className="mx-auto max-w-7xl"
						>
							<div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">
								<motion.div
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ duration: 1.0, delay: 0.2, ease: 'easeOut' }}
									className="flex justify-center lg:justify-start"
								>
									<div className="group relative">
										<div className="absolute -inset-4 rounded-full bg-gradient-to-r from-white/20 via-white/10 to-white/20 opacity-60 backdrop-blur-md transition-opacity duration-500 group-hover:opacity-80" />
										<div className="relative h-64 w-64 overflow-hidden rounded-full bg-gradient-to-br from-stone-200/30 to-stone-300/20 shadow-2xl backdrop-blur-sm md:h-80 md:w-80 lg:h-96 lg:w-96">
											<Image
												src="/assets/hero/profile.png"
												alt="Portrait of John Schibelli"
												fill
												className="object-cover transition-transform duration-700 group-hover:scale-105"
												priority
											/>
										</div>
										<motion.div
											initial={{ opacity: 0, scale: 0, rotate: -180 }}
											animate={{ opacity: 1, scale: 1, rotate: 0 }}
											transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
											className="absolute -bottom-3 -right-3 flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/20 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 shadow-2xl backdrop-blur-sm md:h-20 md:w-20"
										>
											<Brackets className="h-8 w-8 text-white md:h-10 md:w-10" />
										</motion.div>
									</div>
								</motion.div>

								<motion.div
									initial={{ opacity: 0, x: 30 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 1.0, delay: 0.4, ease: 'easeOut' }}
									className="text-center lg:text-left"
								>
									<h1 className={`mb-4 text-white ${typeRole.pageH1}`}>John Schibelli</h1>
									<p className={`mb-6 text-stone-200 ${typeRole.subtitle}`}>
										Senior Software Engineer
									</p>
									<p
										className={`mx-auto mb-8 max-w-2xl text-stone-300 lg:mx-0 ${typeRole.heroSupport}`}
									>
										I build software, improve existing systems, and turn product requirements into
										maintainable production implementations. My experience spans front-end and
										full-stack engineering, APIs and integrations, automation, testing, and
										technical leadership.
									</p>

									<div className="flex flex-col justify-center sm:flex-row lg:justify-start">
										<Button
											size="lg"
											className={`min-w-[200px] justify-center border border-white/40 bg-white/25 py-6 text-white shadow-xl backdrop-blur-md transition-all duration-300 hover:border-white/60 hover:bg-white/35 hover:shadow-2xl ${typeRole.button}`}
											asChild
										>
											<a href={siteConfig.resumeUrl} target="_blank" rel="noopener noreferrer">
												View Résumé <ArrowRight className="ml-2 h-5 w-5" />
											</a>
										</Button>
									</div>
								</motion.div>
							</div>
						</motion.div>
					</Container>
				</div>
			</section>

			<section className="bg-muted py-12 md:py-16">
				<Container className="px-4">
					<div className="mx-auto max-w-6xl">
						<div className="mb-12 text-center">
							<h2 className={`mb-4 text-stone-900 dark:text-stone-100 ${typeRole.sectionH2}`}>
								My Journey
							</h2>
						</div>

						<div className="relative">
							<div className="absolute bottom-0 left-8 top-0 w-0.5 bg-gradient-to-b from-stone-300 via-stone-400 to-stone-300 md:left-1/2 md:-translate-x-px dark:from-stone-600 dark:via-stone-500 dark:to-stone-600"></div>

							<div className="space-y-12">
								<motion.div
									initial={{ opacity: 0, x: -30 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.8, ease: 'easeOut' }}
									viewport={{ once: true }}
									className="relative flex items-start gap-8 md:gap-12"
								>
									<div className="absolute left-6 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-stone-900 shadow-lg md:left-1/2 md:-translate-x-2 dark:bg-stone-100">
										<div className="h-2 w-2 rounded-full bg-white dark:bg-stone-900"></div>
									</div>

									<div className="ml-16 flex-1 md:ml-0 md:w-1/2 md:flex-none md:pr-12">
										<div className="border-border bg-card rounded-lg border p-6 shadow-sm">
											<div className="mb-4 flex items-center gap-3">
												<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-800">
													<GraduationCap className="h-6 w-6 text-stone-600 dark:text-stone-400" />
												</div>
												<div>
													<h3
														className={`text-stone-900 dark:text-stone-100 ${typeRole.cardTitle}`}
													>
														The Teaching Years
													</h3>
													<p className={`text-stone-500 dark:text-stone-400 ${typeRole.metadata}`}>
														2005 - 2009
													</p>
												</div>
											</div>
											<p className={`text-stone-600 dark:text-stone-400 ${typeRole.body}`}>
												As Web Development Program Director at Anthem Institute, I taught HTML, CSS,
												JavaScript, and PHP across multiple campuses. That work shaped a lasting
												belief:{' '}
												<strong className="text-stone-900 dark:text-stone-100">
													code should be teachable and maintainable
												</strong>
												.
											</p>
										</div>
									</div>

									<div className="hidden md:block md:w-1/2"></div>
								</motion.div>

								<motion.div
									initial={{ opacity: 0, x: 30 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.8, ease: 'easeOut' }}
									viewport={{ once: true }}
									className="relative flex items-start gap-8 md:gap-12"
								>
									<div className="absolute left-6 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-stone-900 shadow-lg md:left-1/2 md:-translate-x-2 dark:bg-stone-100">
										<div className="h-2 w-2 rounded-full bg-white dark:bg-stone-900"></div>
									</div>

									<div className="hidden md:block md:w-1/2"></div>

									<div className="ml-16 flex-1 md:ml-0 md:w-1/2 md:flex-none md:pl-12">
										<div className="border-border bg-card rounded-lg border p-6 shadow-sm">
											<div className="mb-4 flex items-center gap-3">
												<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-800">
													<Code className="h-6 w-6 text-stone-600 dark:text-stone-400" />
												</div>
												<div>
													<h3
														className={`text-stone-900 dark:text-stone-100 ${typeRole.cardTitle}`}
													>
														Modern Development
													</h3>
													<p className={`text-stone-500 dark:text-stone-400 ${typeRole.metadata}`}>
														2009 - Present
													</p>
												</div>
											</div>
											<p className={`text-stone-600 dark:text-stone-400 ${typeRole.body}`}>
												After teaching, I moved into engineering roles building product UIs, APIs,
												integrations, and internal tools. The work grew from front-end
												implementation into full-stack systems, automation, testing, and technical
												leadership—still with the same emphasis on making complex work
												understandable to the people who inherit it.
											</p>
										</div>
									</div>
								</motion.div>
							</div>
						</div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
							viewport={{ once: true }}
							className="border-border bg-card mt-12 rounded-lg border p-8 shadow-sm"
						>
							<div className="text-center">
								<h2 className={`mb-4 text-stone-900 dark:text-stone-100 ${typeRole.sectionH2}`}>
									How I Think About Engineering
								</h2>
								<p className={`mx-auto text-stone-600 dark:text-stone-400 ${typeRole.articleBody}`}>
									I favor understandable systems over clever ones, incremental change over
									unnecessary rewrites, and validation over assumption. Good software should be
									maintainable by the people who inherit it—not just the person who wrote it.
								</p>
							</div>
						</motion.div>
					</div>
				</Container>
			</section>

			<section className="bg-muted py-12 md:py-16">
				<Container className="px-4">
					<div className="mx-auto max-w-6xl">
						<div className="mb-12 text-center">
							<h2 className={`mb-4 text-stone-900 dark:text-stone-100 ${typeRole.sectionH2}`}>
								Career Journey
							</h2>
						</div>

						<Timeline>
							{experience.map((job, index) => (
								<TimelineItem
									key={index}
									title={job.title}
									company={job.company}
									period={job.period}
									location={job.location}
									description={job.description}
									achievements={job.achievements}
									index={index}
									isLast={index === experience.length - 1}
								/>
							))}
						</Timeline>
					</div>
				</Container>
			</section>

			<section className="bg-gradient-to-br from-stone-50 via-white to-stone-100 py-12 md:py-16 dark:from-stone-900 dark:via-stone-800 dark:to-stone-900">
				<Container className="px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: 'easeOut' }}
						viewport={{ once: true }}
						className="mx-auto max-w-3xl text-center"
					>
						<h2 className={`mb-6 text-stone-900 dark:text-stone-100 ${typeRole.sectionH2}`}>
							Interested in working together?
						</h2>
						<p
							className={`mx-auto max-w-2xl text-stone-600 dark:text-stone-400 ${typeRole.heroSupport}`}
						>
							I&apos;m open to Senior Software Engineer opportunities and contract engineering work.
						</p>
						<div className="mt-8">
							<Button size="lg" asChild>
								<Link href="/contact">
									Get in Touch <ArrowRight className="ml-2 h-5 w-5" />
								</Link>
							</Button>
						</div>
					</motion.div>
				</Container>
			</section>
		</Layout>
	);
}
