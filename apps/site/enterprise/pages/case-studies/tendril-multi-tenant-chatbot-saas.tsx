import { motion } from 'framer-motion';
import fs from 'fs';
import type { GetStaticProps } from 'next';
import Head from 'next/head';
import path from 'path';
import React from 'react';
import { AppProvider } from '../../components/contexts/appContext';
import { ComparisonChart } from '../../components/features/case-studies/case-study/ComparisonChart';
import Chatbot from '../../components/features/chatbot/Chatbot';
import ModernHeader from '../../components/features/navigation/modern-header';
import { Container } from '../../components/shared/container';
import { Layout } from '../../components/shared/layout';
import { Badge, Button, Card, CardContent } from '../../components/ui';

// Mock publication data for the case study
const mockPublication = {
	id: 'tendril-case-study',
	title: 'Tendril Multi-Tenant Chatbot SaaS',
	description: 'From Market Research to MVP Strategy',
	domain: 'mindware.hashnode.dev',
	favicon: '/favicon.ico',
	isTeam: false,
	url: 'https://mindware.hashnode.dev',
	ogMetaData: {
		image: '/og-image.jpg',
		title: 'Tendril Multi-Tenant Chatbot SaaS',
		description: 'From Market Research to MVP Strategy',
	},
	preferences: {
		logo: '/logo.png',
		darkMode: {
			logo: '/logo-dark.png',
		},
		navbarItems: [],
	},
	author: {
		id: 'john-schibelli',
		name: 'John Schibelli',
		username: 'jschibelli',
		image: '/profile.jpg',
		bio: 'Full-stack developer and SaaS entrepreneur',
		location: 'United States',
		website: 'https://schibelli.dev',
		twitter: '@jschibelli',
		github: 'jschibelli',
		linkedin: 'jschibelli',
		followersCount: 1250,
	},
};

type CaseStudyProps = {
	title: string;
	sections: Record<string, string>; // HTML strings per section
	metrics: {
		timeToFirstMinutes?: number;
		competitorSetupMinutes?: number;
		retentionPct?: number;
		signupsFirstMonth?: number;
		mrrMonth3?: number;
	};
};

export default function TendrilCaseStudy({ title, sections, metrics }: CaseStudyProps) {
	const toc = [
		{ id: 'problem-statement', title: 'Problem Statement' },
		{ id: 'research-analysis', title: 'Research & Analysis' },
		{ id: 'solution-design', title: 'Solution Design' },
		{ id: 'implementation', title: 'Implementation' },
		{ id: 'results-metrics', title: 'Results & Metrics' },
		{ id: 'lessons-learned', title: 'Lessons Learned' },
		{ id: 'next-steps', title: 'Next Steps' },
	];

	const comparisonData = [
		{
			category: 'Time-to-first-value',
			tendril: metrics.timeToFirstMinutes ?? 18,
			competitor: metrics.competitorSetupMinutes ?? 120,
			unit: 'minutes',
			direction: 'lower' as const,
		},
	];

	const RadialMetric: React.FC<{ value: number; label: string }> = ({ value, label }) => {
		const clamped = Math.max(0, Math.min(100, value));
		const bg = `conic-gradient(rgb(120 113 108) ${clamped * 3.6}deg, rgba(120,113,108,0.15) 0deg)`;
		return (
			<div className="flex flex-col items-center gap-3">
				<div className="relative h-28 w-28">
					<div className="absolute inset-0 rounded-full" style={{ background: bg }} />
					<div className="bg-background absolute inset-2 rounded-full border border-stone-200/40" />
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="text-2xl font-bold text-stone-800 dark:text-stone-100">{clamped}%</div>
					</div>
				</div>
				<div className="text-sm text-stone-600 dark:text-stone-300">{label}</div>
			</div>
		);
	};
	return (
		<AppProvider publication={mockPublication}>
			<Layout>
				<Head>
					<title>
						Tendril Multi-Tenant Chatbot SaaS: From Market Research to MVP Strategy – Case Study
					</title>
					<meta
						name="description"
						content="How we built a multi-tenant chatbot platform that achieved 47 first-month signups and $3.4k MRR by month 3. A complete case study covering market research, solution design, implementation, and results."
					/>
					<meta
						name="keywords"
						content="chatbot, saas, multi-tenant, case study, startup, mvp, market research"
					/>
					<meta
						property="og:title"
						content="Tendril Multi-Tenant Chatbot SaaS: From Market Research to MVP Strategy"
					/>
					<meta
						property="og:description"
						content="How we built a multi-tenant chatbot platform that achieved 47 first-month signups and $3.4k MRR by month 3. A complete case study covering market research, solution design, implementation, and results."
					/>
					<meta
						property="og:type"
						content="article"
					/>
					<meta
						property="og:url"
						content="https://mindware.hashnode.dev/case-studies/tendril-multi-tenant-chatbot-saas"
					/>
				</Head>

				<ModernHeader publication={mockPublication} />

				<main className="bg-background min-h-screen">
					<Container>
						{/* Header Section */}
						<motion.div
							className="mb-8 pt-8 lg:mb-12"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
						>
							<div className="mx-auto max-w-4xl text-center">
								<Badge variant="secondary" className="mb-4">
									Case Study
								</Badge>
								<h1 className="text-foreground mb-6 text-4xl font-bold leading-tight lg:text-6xl">
									{title || 'Tendril Multi-Tenant Chatbot SaaS'}
								</h1>
								<p className="text-muted-foreground mb-8 text-xl leading-relaxed lg:text-2xl">
									From Market Research to MVP Strategy
								</p>
								<div className="text-muted-foreground flex flex-wrap justify-center gap-4 text-sm">
									<span>Published December 15, 2024</span>
									<span>•</span>
									<span>12 min read</span>
									<span>•</span>
									<span>SaaS, Chatbot, Startup</span>
								</div>
								<div className="mt-4 flex flex-wrap justify-center gap-2">
									<Badge variant="outline" className="text-xs">#case-study</Badge>
									<Badge variant="outline" className="text-xs">#saas</Badge>
									<Badge variant="outline" className="text-xs">#chatbot</Badge>
									<Badge variant="outline" className="text-xs">#startup</Badge>
								</div>
							</div>
						</motion.div>

						{/* Compact TOC */}
						<div className="mb-10">
							<Card className="border-stone-200/60 dark:border-stone-800/60">
								<CardContent className="p-4">
									<nav className="flex flex-wrap gap-2">
										{toc.map((item) => (
											<a
												key={item.id}
												href={`#${item.id}`}
												className="rounded-full border border-stone-200/60 px-3 py-1 text-sm text-stone-700 transition-colors hover:bg-stone-100/60 dark:border-stone-700/60 dark:text-stone-200 dark:hover:bg-stone-800/60"
											>
												{item.title}
											</a>
										))}
									</nav>
								</CardContent>
							</Card>
						</div>

						{/* At-a-glance */}
						<motion.div
							className="mb-12"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
						>
							<div className="rounded-xl border border-stone-700/40 bg-stone-900/30 p-8">
								<div className="mb-8 grid gap-8 md:grid-cols-2">
									{/* Left Column - Text Content */}
									<div className="space-y-4">
										<h3 className="text-2xl font-bold text-stone-100">
											A proven solution for good design
										</h3>
										<p className="leading-relaxed text-stone-200/90">
											We started with a simple idea: make enterprise chatbots actually easy to buy,
											set up, and manage across many clients. That meant clear pricing, one-click
											onboarding, and multi-tenant controls that feel obvious.
										</p>
									</div>

									{/* Right Column - Achievement Cards */}
									<div className="grid grid-cols-2 gap-4">
										<div className="rounded-lg border border-stone-700/30 bg-stone-800/40 p-6 text-center shadow-lg">
											<p className="mb-1 text-xs uppercase tracking-wide text-stone-400">
												achieved
											</p>
											<div className="text-5xl font-bold text-stone-100">47</div>
											<p className="mt-2 text-stone-300">First Month Sign-ups</p>
										</div>
										<div className="rounded-lg border border-stone-700/30 bg-stone-800/40 p-6 text-center shadow-lg">
											<p className="mb-1 text-xs uppercase tracking-wide text-stone-400">reached</p>
											<div className="text-5xl font-bold text-stone-100">91%</div>
											<p className="mt-2 text-stone-300">User Retention Rate</p>
										</div>
										<div className="rounded-lg border border-stone-700/30 bg-stone-800/40 p-6 text-center shadow-lg">
											<p className="mb-1 text-xs uppercase tracking-wide text-stone-400">average</p>
											<div className="text-5xl font-bold text-stone-100">18 min</div>
											<p className="mt-2 text-stone-300">Setup Time</p>
										</div>
										<div className="rounded-lg border border-stone-700/30 bg-stone-800/40 p-6 text-center shadow-lg">
											<p className="mb-1 text-xs uppercase tracking-wide text-stone-400">
												generated
											</p>
											<div className="text-5xl font-bold text-stone-100">$3.4k</div>
											<p className="mt-2 text-stone-300">MRR by Month 3</p>
										</div>
									</div>
								</div>
							</div>
						</motion.div>

						{/* 1. Problem Statement */}
						<motion.div
							className="mb-12"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}
						>
							<div
								id="problem-statement"
								className="rounded-xl border border-stone-200/60 bg-stone-50 p-8 dark:border-stone-800/60 dark:bg-stone-900/40"
							>
								<h2 className="mb-6 text-3xl font-bold text-stone-900 dark:text-stone-100">
									Problem Statement
								</h2>
								<div
									className="prose dark:prose-invert max-w-none"
									dangerouslySetInnerHTML={{ __html: sections['problem-statement'] || '' }}
								/>
							</div>
						</motion.div>

						{/* 2. Research & Analysis */}
						<motion.div
							className="mb-12"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.6 }}
						>
							<div
								id="research-analysis"
								className="rounded-xl border border-stone-200/60 bg-stone-50 p-8 dark:border-stone-800/60 dark:bg-stone-900/40"
							>
								<h2 className="mb-6 text-3xl font-bold text-stone-900 dark:text-stone-100">
									Research & Analysis
								</h2>
								<div
									className="prose dark:prose-invert mb-6 max-w-none"
									dangerouslySetInnerHTML={{ __html: sections['research-analysis'] || '' }}
								/>
								
								{/* Comparison Table */}
								<div className="mb-6 overflow-x-auto">
									<table className="w-full border-collapse rounded-lg border border-stone-200 dark:border-stone-700">
										<thead>
											<tr className="bg-stone-100 dark:bg-stone-800">
												<th className="border border-stone-200 px-4 py-3 text-left font-semibold text-stone-900 dark:border-stone-700 dark:text-stone-100">
													Feature
												</th>
												<th className="border border-stone-200 px-4 py-3 text-center font-semibold text-stone-900 dark:border-stone-700 dark:text-stone-100">
													Intercom
												</th>
												<th className="border border-stone-200 px-4 py-3 text-center font-semibold text-stone-900 dark:border-stone-700 dark:text-stone-100">
													Drift
												</th>
												<th className="border border-stone-200 px-4 py-3 text-center font-semibold text-stone-900 dark:border-stone-700 dark:text-stone-100">
													Tendril
												</th>
											</tr>
										</thead>
										<tbody>
											<tr className="bg-white dark:bg-stone-900">
												<td className="border border-stone-200 px-4 py-3 font-medium text-stone-900 dark:border-stone-700 dark:text-stone-100">
													Multi-Tenant Support
												</td>
												<td className="border border-stone-200 px-4 py-3 text-center text-red-500 dark:border-stone-700">✗</td>
												<td className="border border-stone-200 px-4 py-3 text-center text-red-500 dark:border-stone-700">✗</td>
												<td className="border border-stone-200 px-4 py-3 text-center text-green-500 dark:border-stone-700">✓</td>
											</tr>
											<tr className="bg-stone-50 dark:bg-stone-800">
												<td className="border border-stone-200 px-4 py-3 font-medium text-stone-900 dark:border-stone-700 dark:text-stone-100">
													Transparent Pricing
												</td>
												<td className="border border-stone-200 px-4 py-3 text-center text-red-500 dark:border-stone-700">✗</td>
												<td className="border border-stone-200 px-4 py-3 text-center text-red-500 dark:border-stone-700">✗</td>
												<td className="border border-stone-200 px-4 py-3 text-center text-green-500 dark:border-stone-700">✓</td>
											</tr>
											<tr className="bg-white dark:bg-stone-900">
												<td className="border border-stone-200 px-4 py-3 font-medium text-stone-900 dark:border-stone-700 dark:text-stone-100">
													Quick Setup (&lt; 30 min)
												</td>
												<td className="border border-stone-200 px-4 py-3 text-center text-red-500 dark:border-stone-700">✗</td>
												<td className="border border-stone-200 px-4 py-3 text-center text-red-500 dark:border-stone-700">✗</td>
												<td className="border border-stone-200 px-4 py-3 text-center text-green-500 dark:border-stone-700">✓</td>
											</tr>
										</tbody>
									</table>
								</div>

								<ComparisonChart
									title="Where Tendril removes friction"
									data={comparisonData}
									description="Benchmarks compared to median competitor baselines collected during discovery."
								/>
							</div>
						</motion.div>

						{/* 3. Solution Design */}
						<motion.div
							className="mb-12"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.8 }}
						>
							<div
								id="solution-design"
								className="rounded-xl border border-stone-200/60 bg-stone-50 p-8 dark:border-stone-800/60 dark:bg-stone-900/40"
							>
								<h2 className="mb-6 text-3xl font-bold text-stone-900 dark:text-stone-100">
									Solution Design
								</h2>
								<div
									className="prose dark:prose-invert max-w-none"
									dangerouslySetInnerHTML={{ __html: sections['solution-design'] || '' }}
								/>
								<div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
									<div className="rounded-lg border border-stone-200/60 bg-stone-100 p-6 dark:border-stone-700/40 dark:bg-stone-800/40">
										<p className="mb-2 text-xs uppercase tracking-wide text-stone-500">
											Tech Stack
										</p>
										<div className="space-y-2 text-stone-800 dark:text-stone-100">
											<div className="font-semibold">Next.js + TypeScript</div>
											<div className="font-semibold">Prisma + PostgreSQL</div>
											<div className="font-semibold">Background jobs + Webhooks</div>
										</div>
									</div>
									<div className="rounded-lg border border-stone-200/60 bg-stone-100 p-6 dark:border-stone-700/40 dark:bg-stone-800/40">
										<p className="mb-2 text-xs uppercase tracking-wide text-stone-500">
											Architecture
										</p>
										<div className="space-y-2 text-stone-800 dark:text-stone-100">
											<div className="font-semibold">Tenant isolation at DB + app layers</div>
											<div className="font-semibold">Event-driven processing</div>
											<div className="font-semibold">Observability first (tracing + metrics)</div>
										</div>
									</div>
								</div>
							</div>
						</motion.div>

						{/* 4. Implementation */}
						<motion.div
							className="mb-12"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 1.0 }}
						>
							<div
								id="implementation"
								className="rounded-xl border border-stone-200/60 bg-stone-50 p-8 dark:border-stone-800/60 dark:bg-stone-900/40"
							>
								<h2 className="mb-6 text-3xl font-bold text-stone-900 dark:text-stone-100">
									Implementation
								</h2>
								<div
									className="prose dark:prose-invert max-w-none"
									dangerouslySetInnerHTML={{ __html: sections['implementation'] || '' }}
								/>
							</div>
						</motion.div>

						{/* 5. Results & Metrics */}
						<motion.div
							className="mb-12"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 1.2 }}
						>
							<div
								id="results-metrics"
								className="rounded-xl border border-stone-200/60 bg-stone-50 p-8 dark:border-stone-800/60 dark:bg-stone-900/40"
							>
								<h2 className="mb-6 text-3xl font-bold text-stone-900 dark:text-stone-100">
									Results & Metrics
								</h2>
								<div className="grid grid-cols-1 gap-6 md:grid-cols-4">
									<div className="rounded-lg border border-stone-200/60 bg-stone-100 p-6 text-center dark:border-stone-700/40 dark:bg-stone-800/40">
										<div className="text-4xl font-bold text-stone-900 dark:text-stone-100">
											{metrics.signupsFirstMonth ?? 47}
										</div>
										<div className="text-stone-600 dark:text-stone-300">First-month signups</div>
									</div>
									<div className="rounded-lg border border-stone-200/60 bg-stone-100 p-6 text-center dark:border-stone-700/40 dark:bg-stone-800/40">
										<div className="text-4xl font-bold text-stone-900 dark:text-stone-100">23 (49%)</div>
										<div className="text-stone-600 dark:text-stone-300">Paid Conversions</div>
									</div>
									<div className="rounded-lg border border-stone-200/60 bg-stone-100 p-6 text-center dark:border-stone-700/40 dark:bg-stone-800/40">
										<div className="text-4xl font-bold text-stone-900 dark:text-stone-100">91%</div>
										<div className="text-stone-600 dark:text-stone-300">User Retention Rate</div>
									</div>
									<div className="rounded-lg border border-stone-200/60 bg-stone-100 p-6 text-center dark:border-stone-700/40 dark:bg-stone-800/40">
										<div className="text-4xl font-bold text-stone-900 dark:text-stone-100">18 minutes</div>
										<div className="text-stone-600 dark:text-stone-300">Avg Setup Time</div>
									</div>
								</div>
								
								<div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4">
									<div className="rounded-lg border border-stone-200/60 bg-stone-100 p-6 text-center dark:border-stone-700/40 dark:bg-stone-800/40">
										<div className="text-4xl font-bold text-stone-900 dark:text-stone-100">$3,400</div>
										<div className="text-stone-600 dark:text-stone-300">MRR</div>
									</div>
									<div className="rounded-lg border border-stone-200/60 bg-stone-100 p-6 text-center dark:border-stone-700/40 dark:bg-stone-800/40">
										<div className="text-4xl font-bold text-stone-900 dark:text-stone-100">$67</div>
										<div className="text-stone-600 dark:text-stone-300">ARPU</div>
									</div>
									<div className="rounded-lg border border-stone-200/60 bg-stone-100 p-6 text-center dark:border-stone-700/40 dark:bg-stone-800/40">
										<div className="text-4xl font-bold text-stone-900 dark:text-stone-100">$23</div>
										<div className="text-stone-600 dark:text-stone-300">CAC</div>
									</div>
									<div className="rounded-lg border border-stone-200/60 bg-stone-100 p-6 text-center dark:border-stone-700/40 dark:bg-stone-800/40">
										<div className="text-4xl font-bold text-stone-900 dark:text-stone-100">72</div>
										<div className="text-stone-600 dark:text-stone-300">NPS Score</div>
									</div>
								</div>
								<div
									className="prose dark:prose-invert mt-6 max-w-none"
									dangerouslySetInnerHTML={{ __html: sections['results-metrics'] || '' }}
								/>

								{/* Chart Components */}
								<div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
									{/* Pie Chart */}
									<div className="rounded-lg border border-stone-200/60 bg-stone-100 p-6 dark:border-stone-700/40 dark:bg-stone-800/40">
										<h3 className="mb-4 text-lg font-semibold text-stone-900 dark:text-stone-100">
											Market Share by Platform
										</h3>
										<div className="flex h-48 items-center justify-center">
											<svg className="h-32 w-32" viewBox="0 0 100 100">
												<path d="M 50 50 L 50 10 A 40 40 0 1 1 90 50 Z" fill="#3b82f6" />
												<path d="M 50 50 L 90 50 A 40 40 0 0 1 70 90 Z" fill="#10b981" />
												<path d="M 50 50 L 70 90 A 40 40 0 0 1 30 90 Z" fill="#f59e0b" />
												<path d="M 50 50 L 30 90 A 40 40 0 0 1 10 50 Z" fill="#ef4444" />
												<path d="M 50 50 L 10 50 A 40 40 0 0 1 50 10 Z" fill="#8b5cf6" />
											</svg>
										</div>
										<div className="mt-4 space-y-2 text-sm">
											<div className="flex items-center gap-2">
												<div className="h-3 w-3 rounded-full bg-blue-500"></div>
												<span className="text-stone-700 dark:text-stone-300">Intercom: 35</span>
											</div>
											<div className="flex items-center gap-2">
												<div className="h-3 w-3 rounded-full bg-green-500"></div>
												<span className="text-stone-700 dark:text-stone-300">Drift: 25</span>
											</div>
											<div className="flex items-center gap-2">
												<div className="h-3 w-3 rounded-full bg-yellow-500"></div>
												<span className="text-stone-700 dark:text-stone-300">Chatbase: 20</span>
											</div>
											<div className="flex items-center gap-2">
												<div className="h-3 w-3 rounded-full bg-red-500"></div>
												<span className="text-stone-700 dark:text-stone-300">Hidden Costs: 85</span>
											</div>
											<div className="flex items-center gap-2">
												<div className="h-3 w-3 rounded-full bg-purple-500"></div>
												<span className="text-stone-700 dark:text-stone-300">Others: 15</span>
											</div>
										</div>
									</div>

									{/* Bar Chart */}
									<div className="rounded-lg border border-stone-200/60 bg-stone-100 p-6 dark:border-stone-700/40 dark:bg-stone-800/40">
										<h3 className="mb-4 text-lg font-semibold text-stone-900 dark:text-stone-100">
											User Complaints Analysis
										</h3>
										<div className="space-y-3">
											<div className="flex items-center justify-between">
												<span className="text-sm text-stone-700 dark:text-stone-300">Hidden Costs</span>
												<div className="flex items-center gap-2">
													<div className="h-4 w-32 rounded bg-red-200 dark:bg-red-800">
														<div className="h-4 w-24 rounded bg-red-500"></div>
													</div>
													<span className="text-sm font-medium text-stone-700 dark:text-stone-300">85%</span>
												</div>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-sm text-stone-700 dark:text-stone-300">Setup Complexity</span>
												<div className="flex items-center gap-2">
													<div className="h-4 w-32 rounded bg-orange-200 dark:bg-orange-800">
														<div className="h-4 w-20 rounded bg-orange-500"></div>
													</div>
													<span className="text-sm font-medium text-stone-700 dark:text-stone-300">65%</span>
												</div>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-sm text-stone-700 dark:text-stone-300">Poor AI Responses</span>
												<div className="flex items-center gap-2">
													<div className="h-4 w-32 rounded bg-yellow-200 dark:bg-yellow-800">
														<div className="h-4 w-16 rounded bg-yellow-500"></div>
													</div>
													<span className="text-sm font-medium text-stone-700 dark:text-stone-300">50%</span>
												</div>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-sm text-stone-700 dark:text-stone-300">Limited Features</span>
												<div className="flex items-center gap-2">
													<div className="h-4 w-32 rounded bg-blue-200 dark:bg-blue-800">
														<div className="h-4 w-12 rounded bg-blue-500"></div>
													</div>
													<span className="text-sm font-medium text-stone-700 dark:text-stone-300">30%</span>
												</div>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-sm text-stone-700 dark:text-stone-300">Support Issues</span>
												<div className="flex items-center gap-2">
													<div className="h-4 w-32 rounded bg-purple-200 dark:bg-purple-800">
														<div className="h-4 w-8 rounded bg-purple-500"></div>
													</div>
													<span className="text-sm font-medium text-stone-700 dark:text-stone-300">20%</span>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Line Chart */}
								<div className="mt-6 rounded-lg border border-stone-200/60 bg-stone-100 p-6 dark:border-stone-700/40 dark:bg-stone-800/40">
									<h3 className="mb-4 text-lg font-semibold text-stone-900 dark:text-stone-100">
										Feature Completion Over Time
									</h3>
									<div className="h-48 flex items-end justify-between gap-1">
										{[16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60].map((height, index) => (
											<div key={index} className="flex flex-col items-center gap-1">
												<div 
													className="w-3 rounded-t bg-green-500" 
													style={{ height: `${height}px` }}
												></div>
												<span className="text-xs text-stone-600 dark:text-stone-400">W{index + 1}</span>
											</div>
										))}
									</div>
								</div>

								{/* Additional Chart Components */}
								<div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
									{/* User Growth Chart */}
									<div className="rounded-lg border border-stone-200/60 bg-stone-100 p-6 dark:border-stone-700/40 dark:bg-stone-800/40">
										<h3 className="mb-4 text-lg font-semibold text-stone-900 dark:text-stone-100">
											User Growth Over Time
										</h3>
										<div className="h-48 flex items-end justify-between gap-1">
											{[10, 15, 22, 28, 35, 42, 47].map((height, index) => (
												<div key={index} className="flex flex-col items-center gap-1">
													<div 
														className="w-6 rounded-t bg-blue-500" 
														style={{ height: `${height * 2}px` }}
													></div>
													<span className="text-xs text-stone-600 dark:text-stone-400">M{index + 1}</span>
												</div>
											))}
										</div>
									</div>

									{/* Revenue Chart */}
									<div className="rounded-lg border border-stone-200/60 bg-stone-100 p-6 dark:border-stone-700/40 dark:bg-stone-800/40">
										<h3 className="mb-4 text-lg font-semibold text-stone-900 dark:text-stone-100">
											Revenue by Plan Type
										</h3>
										<div className="space-y-3">
											<div className="flex items-center justify-between">
												<span className="text-sm text-stone-700 dark:text-stone-300">Pro Plan ($49)</span>
												<div className="flex items-center gap-2">
													<div className="h-4 w-32 rounded bg-green-200 dark:bg-green-800">
														<div className="h-4 w-20 rounded bg-green-500"></div>
													</div>
													<span className="text-sm font-medium text-stone-700 dark:text-stone-300">Pro Plan ($49): 65</span>
												</div>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-sm text-stone-700 dark:text-stone-300">Basic Plan ($29)</span>
												<div className="flex items-center gap-2">
													<div className="h-4 w-32 rounded bg-blue-200 dark:bg-blue-800">
														<div className="h-4 w-16 rounded bg-blue-500"></div>
													</div>
													<span className="text-sm font-medium text-stone-700 dark:text-stone-300">35%</span>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Satisfaction Scores */}
								<div className="mt-6 rounded-lg border border-stone-200/60 bg-stone-100 p-6 dark:border-stone-700/40 dark:bg-stone-800/40">
									<h3 className="mb-4 text-lg font-semibold text-stone-900 dark:text-stone-100">
										Satisfaction Scores by Category
									</h3>
									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<span className="text-sm text-stone-700 dark:text-stone-300">Ease of Setup</span>
											<div className="flex items-center gap-2">
												<div className="h-4 w-32 rounded bg-green-200 dark:bg-green-800">
													<div className="h-4 w-28 rounded bg-green-500"></div>
												</div>
												<span className="text-sm font-medium text-stone-700 dark:text-stone-300">Ease of Setup: 90</span>
											</div>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm text-stone-700 dark:text-stone-300">AI Response Quality</span>
											<div className="flex items-center gap-2">
												<div className="h-4 w-32 rounded bg-blue-200 dark:bg-blue-800">
													<div className="h-4 w-24 rounded bg-blue-500"></div>
												</div>
												<span className="text-sm font-medium text-stone-700 dark:text-stone-300">80%</span>
											</div>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm text-stone-700 dark:text-stone-300">Customer Support</span>
											<div className="flex items-center gap-2">
												<div className="h-4 w-32 rounded bg-yellow-200 dark:bg-yellow-800">
													<div className="h-4 w-20 rounded bg-yellow-500"></div>
												</div>
												<span className="text-sm font-medium text-stone-700 dark:text-stone-300">70%</span>
											</div>
										</div>
									</div>
								</div>

								{/* Feature Development Timeline */}
								<div className="mt-6 rounded-lg border border-stone-200/60 bg-stone-100 p-6 dark:border-stone-700/40 dark:bg-stone-800/40">
									<h3 className="mb-4 text-lg font-semibold text-stone-900 dark:text-stone-100">
										Feature Development Timeline
									</h3>
									<div className="space-y-4">
										<div className="flex items-center gap-4">
											<div className="w-20 text-sm text-stone-600 dark:text-stone-400">Week 1-2</div>
											<div className="flex-1 h-2 rounded bg-green-500"></div>
											<span className="text-sm text-stone-700 dark:text-stone-300">Core Infrastructure</span>
										</div>
										<div className="flex items-center gap-4">
											<div className="w-20 text-sm text-stone-600 dark:text-stone-400">Week 3-4</div>
											<div className="flex-1 h-2 rounded bg-blue-500"></div>
											<span className="text-sm text-stone-700 dark:text-stone-300">AI Integration</span>
										</div>
										<div className="flex items-center gap-4">
											<div className="w-20 text-sm text-stone-600 dark:text-stone-400">Week 5-6</div>
											<div className="flex-1 h-2 rounded bg-yellow-500"></div>
											<span className="text-sm text-stone-700 dark:text-stone-300">User Interface</span>
										</div>
										<div className="flex items-center gap-4">
											<div className="w-20 text-sm text-stone-600 dark:text-stone-400">Week 7-8</div>
											<div className="flex-1 h-2 rounded bg-purple-500"></div>
											<span className="text-sm text-stone-700 dark:text-stone-300">Testing & Polish</span>
										</div>
									</div>
								</div>
							</div>
						</motion.div>

						{/* 6. Lessons Learned */}
						<motion.div
							className="mb-12"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 1.4 }}
						>
							<div
								id="lessons-learned"
								className="rounded-xl border border-stone-200/60 bg-stone-50 p-8 dark:border-stone-800/60 dark:bg-stone-900/40"
							>
								<h2 className="mb-6 text-3xl font-bold text-stone-900 dark:text-stone-100">
									Lessons Learned
								</h2>
								<div
									className="prose dark:prose-invert max-w-none"
									dangerouslySetInnerHTML={{ __html: sections['lessons-learned'] || '' }}
								/>
							</div>
						</motion.div>

						{/* 7. Next Steps */}
						<motion.div
							className="mb-12"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 1.6 }}
						>
							<div
								id="next-steps"
								className="rounded-xl border border-stone-200/60 bg-stone-50 p-8 dark:border-stone-800/60 dark:bg-stone-900/40"
							>
								<h2 className="mb-6 text-3xl font-bold text-stone-900 dark:text-stone-100">
									Next Steps
								</h2>
								<div
									className="prose dark:prose-invert mb-4 max-w-none"
									dangerouslySetInnerHTML={{ __html: sections['next-steps'] || '' }}
								/>
								<div className="mt-6 text-center">
									<Button className="rounded-lg px-6 py-3 font-semibold transition-colors">
										Start a conversation
									</Button>
								</div>
							</div>
						</motion.div>
					</Container>
				</main>

				<Chatbot />
			</Layout>
		</AppProvider>
	);
}

export const getStaticProps: GetStaticProps<CaseStudyProps> = async () => {
	const mdPath = path.join(process.cwd(), 'docs', 'case-studies', 'tendrilo-case-study.md');
	const raw = fs.readFileSync(mdPath, 'utf8');

	const toHtml = (md: string) => {
		try {
			// eslint-disable-next-line
			const { markdownToHtml } = require('@starter-kit/utils/renderer/markdownToHtml');
			return markdownToHtml(md);
		} catch {
			return md
				.replace(/^###\s(.*)$/gm, '<h3>$1</h3>')
				.replace(/^##\s(.*)$/gm, '<h2>$1</h2>')
				.replace(/^#\s(.*)$/gm, '<h1>$1</h1>')
				.replace(/^\-\s(.*)$/gm, '<li>$1</li>')
				.replace(/\n\n/g, '<br/><br/>');
		}
	};

	const getSection = (title: string) => {
		const pattern = new RegExp(`##\\s+${title}[\r\n]+([\s\S]*?)(?=\n##\\s+|\n?$)`, 'i');
		const match = raw.match(pattern);
		return toHtml((match?.[1] || '').trim());
	};

	const titleMatch = raw.match(/^#\s+(.+)$/m);
	const title = titleMatch ? titleMatch[1].trim() : 'Tendril Multi-Tenant Chatbot SaaS';

	const resultsText = raw.match(/##\s+Results\s*&\s*Metrics[\s\S]*/i)?.[0] || '';
	const signups = /(\d+)\s+sign-?ups|signups/i.exec(resultsText);
	const mrr = /\$([0-9]+(?:,[0-9]{3})*)/i.exec(resultsText);
	const retention = /(\d{2,3})%\s+user retention/i.exec(resultsText);
	const timeToFirst = /([0-9]+)\s+minutes?\b/i.exec(resultsText);

	const metrics = {
		signupsFirstMonth: Number(signups?.[1]) || 47,
		mrrMonth3: mrr ? parseInt(mrr[1].replace(/,/g, ''), 10) : 3400,
		retentionPct: retention ? Number(retention[1]) : 91,
		timeToFirstMinutes: timeToFirst ? Number(timeToFirst[1]) : 18,
		competitorSetupMinutes: 120,
	};

	const sections: Record<string, string> = {
		'problem-statement': getSection('Problem Statement'),
		'research-analysis': getSection('Research & Analysis'),
		'solution-design': getSection('Solution Design'),
		implementation: getSection('Implementation'),
		'results-metrics': getSection('Results & Metrics'),
		'lessons-learned': getSection('Lessons Learned'),
		'next-steps': getSection('Next Steps'),
	};

	return {
		props: {
			title,
			sections,
			metrics,
		},
	};
};
