/* eslint-disable react/no-unescaped-entities */
import { motion } from 'framer-motion';
import request from 'graphql-request';
import {
	AlertTriangle,
	ArrowRight,
	BarChart3,
	Calendar,
	CheckCircle,
	ChevronRight,
	Database,
	DollarSign,
	Globe,
	PieChart,
	Shield,
	Target,
	Users,
	Zap,
} from 'lucide-react';
import type { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { AppProvider } from '../../components/contexts/appContext';
import Chatbot from '../../components/features/chatbot/Chatbot';
import ModernHeader from '../../components/features/navigation/modern-header';
import { Container } from '../../components/shared/container';
import { Layout } from '../../components/shared/layout';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '../../components/ui';
import {
	PostsByPublicationDocument,
	PostsByPublicationQuery,
	PostsByPublicationQueryVariables,
	PublicationFragment,
} from '../../generated/graphql';

const GQL_ENDPOINT = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT || 'https://gql.hashnode.com/';

type CaseStudyProps = {
	publication: PublicationFragment;
};

// Research Analysis Component
const ResearchAnalysis: React.FC = () => (
	<div className="mb-16">
		<div id="research-analysis" className="space-y-6">
			<h2 className="relative mb-8 text-3xl font-bold text-stone-900 dark:text-stone-100">
				Research & Analysis
				<span className="absolute -bottom-2 left-0 h-1 w-16 rounded-full bg-primary/60" />
			</h2>

			<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
				Comprehensive market research across user reviews, forums, and competitive analysis revealed
				a landscape ripe for disruption. The research methodology included analysis of G2 and
				Capterra reviews, Reddit discussions in r/SaaS communities, direct competitor pricing
				analysis, and examination of user complaints across multiple platforms.
			</p>

			<div className="space-y-6">
				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Market Sentiment Analysis
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						Reddit discussions titled "Looking for an Intercom Alternative" and widespread
						complaints about billing surprises indicate active user dissatisfaction. Users describe
						feeling "trapped" by auto-renewals and complex cancellation processes, with some dubbing
						Intercom "Interscam" due to pricing opacity.
					</p>
				</div>

				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Competitive Landscape Mapping
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						The market divides into two camps - expensive enterprise-focused solutions (Intercom,
						Drift, Ada) and budget-friendly but limited tools (Tidio, Chatbase). Enterprise
						solutions offer comprehensive features but price out SMBs, while budget options lack the
						sophistication and multi-tenant capabilities needed by growing businesses and agencies.
					</p>
				</div>
			</div>

			{/* Pricing Model Analysis Table */}
			<PricingModelTable />

			{/* Key Market Insights Table */}
			<MarketInsightsTable />

			{/* Competitor Pricing Comparison */}
			<SimpleBarChart
				title="Competitor Pricing Comparison (Monthly Cost)"
				caption="Relative monthly pricing snapshot across competitors; values are approximate."
				data={[
					{ label: 'Intercom', value: 139 },
					{ label: 'Drift', value: 2500 },
					{ label: 'Chatbase', value: 500 },
					{ label: 'Tidio', value: 29 },
					{ label: 'Tendril (Projected)', value: 75 },
				]}
			/>

			{/* Feature Comparison Matrix */}
			<Card className="my-8">
				<CardHeader>
					<CardTitle className="relative flex items-center gap-2">
						<CheckCircle className="h-5 w-5 text-primary" />
						Feature Comparison Matrix
						<span className="absolute -bottom-2 left-0 h-1 w-12 rounded-full bg-primary/60" />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<table className="w-full border-collapse rounded-lg border border-border">
							<thead>
								<tr className="bg-accent">
									<th className="border border-border px-4 py-3 text-center font-semibold text-foreground">
										Feature
									</th>
									<th className="border border-border px-4 py-3 text-center font-semibold text-foreground">
										Intercom
									</th>
									<th className="border border-border px-4 py-3 text-center font-semibold text-foreground">
										Drift
									</th>
									<th className="border border-border px-4 py-3 text-center font-semibold text-foreground">
										Chatbase
									</th>
									<th className="border border-border bg-accent px-4 py-3 text-center font-semibold text-foreground">
										Tendril
									</th>
								</tr>
							</thead>
							<tbody>
								<tr className="bg-card transition-colors hover:bg-muted">
									<td className="border border-border px-4 py-3 font-medium text-foreground">
										Multi-Tenant Support
									</td>
									<td className="border border-border px-4 py-3 text-center">
										<span className="text-red-500">✗</span>
									</td>
									<td className="border border-border px-4 py-3 text-center">
										<span className="text-red-500">✗</span>
									</td>
									<td className="border border-border px-4 py-3 text-center">
										<span className="text-red-500">✗</span>
									</td>
									<td className="border border-border bg-muted px-4 py-3 text-center">
										<span className="font-bold text-green-500">✓</span>
									</td>
								</tr>
								<tr className="bg-muted transition-colors hover:bg-muted/80">
									<td className="border border-border px-4 py-3 font-medium text-foreground">
										Transparent Pricing
									</td>
									<td className="border border-border px-4 py-3 text-center">
										<span className="text-red-500">✗</span>
									</td>
									<td className="border border-border px-4 py-3 text-center">
										<span className="text-red-500">✗</span>
									</td>
									<td className="border border-border px-4 py-3 text-center">
										<span className="text-yellow-500">~</span>
									</td>
									<td className="border border-border bg-muted px-4 py-3 text-center">
										<span className="font-bold text-green-500">✓</span>
									</td>
								</tr>
								<tr className="bg-card transition-colors hover:bg-muted">
									<td className="border border-border px-4 py-3 font-medium text-foreground">
										Quick Setup (&lt; 30 min)
									</td>
									<td className="border border-border px-4 py-3 text-center">
										<span className="text-red-500">✗</span>
									</td>
									<td className="border border-border px-4 py-3 text-center">
										<span className="text-red-500">✗</span>
									</td>
									<td className="border border-border px-4 py-3 text-center">
										<span className="text-yellow-500">~</span>
									</td>
									<td className="border border-border bg-muted px-4 py-3 text-center">
										<span className="font-bold text-green-500">✓</span>
									</td>
								</tr>
								<tr className="bg-muted transition-colors hover:bg-muted/80">
									<td className="border border-border px-4 py-3 font-medium text-foreground">
										AI-Powered Responses
									</td>
									<td className="border border-border px-4 py-3 text-center">
										<span className="text-green-500">✓</span>
									</td>
									<td className="border border-border px-4 py-3 text-center">
										<span className="text-green-500">✓</span>
									</td>
									<td className="border border-border px-4 py-3 text-center">
										<span className="text-green-500">✓</span>
									</td>
									<td className="border border-border bg-muted px-4 py-3 text-center">
										<span className="font-bold text-green-500">✓</span>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>

			<div>
				<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
					Emerging Trends
				</h3>
				<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
					The shift toward AI-native solutions creates opportunities for products built from the
					ground up with modern LLM capabilities, rather than legacy platforms retrofitting AI
					features. Lower API costs and improved AI frameworks make it economically feasible for new
					entrants to compete on both features and price.
				</p>
			</div>
		</div>
	</div>
);

// Pricing Model Analysis Table Component
const PricingModelTable: React.FC = () => (
	<Card className="my-8">
		<CardHeader>
			<CardTitle className="relative flex items-center gap-2">
				<DollarSign className="h-5 w-5 text-primary" />
				Pricing Model Analysis
				<span className="absolute -bottom-2 left-0 h-1 w-16 rounded-full bg-primary/60" />
			</CardTitle>
		</CardHeader>
		<CardContent>
			<div className="overflow-x-auto">
				<table className="w-full border-collapse rounded-lg border border-border">
					<thead>
						<tr className="bg-accent">
							<th className="border border-border px-4 py-3 text-center font-semibold text-foreground">
								Competitor
							</th>
							<th className="border border-border px-4 py-3 text-center font-semibold text-foreground">
								Pricing Structure
							</th>
							<th className="border border-border px-4 py-3 text-center font-semibold text-foreground">
								Key Limitations
							</th>
						</tr>
					</thead>
					<tbody>
						<tr className="bg-card hover:bg-muted">
							<td className="border border-border px-4 py-3 font-medium text-foreground">
								Intercom
							</td>
							<td className="border border-border px-4 py-3 text-muted-foreground">
								$39-$139 per agent plus usage fees
							</td>
							<td className="border border-border px-4 py-3 text-muted-foreground">
								Hidden costs, complex pricing model
							</td>
						</tr>
						<tr className="bg-muted hover:bg-muted/80">
							<td className="border border-border px-4 py-3 font-medium text-foreground">
								Drift
							</td>
							<td className="border border-border px-4 py-3 text-muted-foreground">
								~$2,500/month with annual commitments
							</td>
							<td className="border border-border px-4 py-3 text-muted-foreground">
								Enterprise-focused, expensive for SMBs
							</td>
						</tr>
						<tr className="bg-card hover:bg-muted">
							<td className="border border-border px-4 py-3 font-medium text-foreground">
								Chatbase
							</td>
							<td className="border border-border px-4 py-3 text-muted-foreground">
								$40-$500/month with feature limitations
							</td>
							<td className="border border-border px-4 py-3 text-muted-foreground">
								Limited features, additional charges for basic functionality
							</td>
						</tr>
						<tr className="bg-muted hover:bg-muted/80">
							<td className="border border-border px-4 py-3 font-medium text-foreground">
								Tidio
							</td>
							<td className="border border-border px-4 py-3 text-muted-foreground">
								$29/month
							</td>
							<td className="border border-border px-4 py-3 text-muted-foreground">
								Lacks advanced features and multi-tenant capabilities
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</CardContent>
	</Card>
);

// Key Market Insights Table Component
const MarketInsightsTable: React.FC = () => (
	<Card className="my-8">
		<CardHeader>
			<CardTitle className="relative flex items-center gap-2">
				<Target className="h-5 w-5 text-primary" />
				Key Market Insights
				<span className="absolute -bottom-2 left-0 h-1 w-16 rounded-full bg-primary/60" />
			</CardTitle>
		</CardHeader>
		<CardContent>
			<div className="overflow-x-auto">
				<table className="w-full border-collapse rounded-lg border border-border">
					<thead>
						<tr className="bg-accent">
							<th className="border border-border px-4 py-3 text-center font-semibold text-foreground">
								Insight Category
							</th>
							<th className="border border-border px-4 py-3 text-center font-semibold text-foreground">
								Market Finding
							</th>
							<th className="border border-border px-4 py-3 text-center font-semibold text-foreground">
								Business Impact
							</th>
						</tr>
					</thead>
					<tbody>
						<tr className="bg-card hover:bg-muted">
							<td className="border border-border px-4 py-3 font-medium text-foreground">
								Pricing Complaints
							</td>
							<td className="border border-border px-4 py-3 text-muted-foreground">
								68% of SMB users cite pricing as their primary complaint with current solutions
							</td>
							<td className="border border-border px-4 py-3 text-muted-foreground">
								Clear opportunity for transparent pricing model
							</td>
						</tr>
						<tr className="bg-muted hover:bg-muted/80">
							<td className="border border-border px-4 py-3 font-medium text-foreground">
								Setup Time Gap
							</td>
							<td className="border border-border px-4 py-3 text-muted-foreground">
								Setup time averaging 2-3 weeks versus desired deployment in under 24 hours
							</td>
							<td className="border border-border px-4 py-3 text-muted-foreground">
								Market demand for rapid deployment solutions
							</td>
						</tr>
						<tr className="bg-card hover:bg-muted">
							<td className="border border-border px-4 py-3 font-medium text-foreground">
								Multi-Tenant Gap
							</td>
							<td className="border border-border px-4 py-3 text-muted-foreground">
								Zero major players offering true multi-tenant architecture for agencies
							</td>
							<td className="border border-border px-4 py-3 text-muted-foreground">
								Underserved market segment with high-value potential
							</td>
						</tr>
						<tr className="bg-muted hover:bg-muted/80">
							<td className="border border-border px-4 py-3 font-medium text-foreground">
								Market Demand
							</td>
							<td className="border border-border px-4 py-3 text-muted-foreground">
								Strong demand evidenced by Chatbase's rapid growth to $180K MRR within months of
								launch
							</td>
							<td className="border border-border px-4 py-3 text-muted-foreground">
								Validates market opportunity and growth potential
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</CardContent>
	</Card>
);

// Solution Design Component
const SolutionDesign: React.FC = () => (
	<motion.div
		className="mb-16"
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.6, delay: 0.8 }}
	>
		<div id="solution-design" className="space-y-6">
			<h2 className="relative mb-8 text-3xl font-bold text-stone-900 dark:text-stone-100">
				Solution Design
				<span className="absolute -bottom-2 left-0 h-1 w-16 rounded-full bg-primary/60" />
			</h2>

			<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
				Tendril's architecture addresses identified market gaps through a purpose-built multi-tenant
				SaaS platform designed specifically for SMB needs and agency management. The solution
				centers on four core architectural decisions that directly respond to research findings.
			</p>

			<div className="space-y-6">
				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Multi-Tenant Core Architecture
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						The platform's foundation enables one master account to manage multiple isolated chatbot
						workspaces, each with separate data, branding, and analytics. This addresses the
						critical gap for agencies managing multiple clients without requiring separate
						subscriptions or data contamination risks.
					</p>
				</div>

				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Simplified Deployment Pipeline
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						The technical architecture prioritizes rapid time-to-value through streamlined document
						ingestion and automated training processes. Users can upload PDFs, paste website URLs,
						or provide FAQ documents to generate a functional chatbot within minutes rather than
						weeks.
					</p>
				</div>

				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Transparent Pricing Framework
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						The billing system implements flat-rate, usage-transparent pricing that eliminates
						surprise charges. Instead of per-agent or per-resolution fees, pricing scales based on
						predictable metrics like number of chatbots or monthly conversation volume.
					</p>
				</div>

				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Modern AI Integration
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						Built on current-generation LLM APIs with intelligent cost optimization, the platform
						leverages improved Retrieval-Augmented Generation (RAG) frameworks to deliver more
						accurate responses than legacy rule-based systems or first-generation AI add-ons.
					</p>
				</div>
			</div>

			<div>
				<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
					Technology Stack Decisions
				</h3>
				<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
					Frontend: React-based dashboard optimized for multi-tenant management. Backend: Node.js
					API with tenant isolation at the database level. AI Integration: OpenAI GPT-4 with custom
					RAG implementation. Database: PostgreSQL with row-level security for tenant data
					isolation. Infrastructure: Cloud-native deployment for scalability and cost efficiency.
				</p>
			</div>

			<div>
				<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
					User Experience Design
				</h3>
				<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
					The interface prioritizes simplicity over feature density, with guided onboarding flows
					and templates for common use cases. This directly addresses user complaints about
					overwhelming enterprise interfaces that require training to navigate effectively.
				</p>
			</div>
		</div>
	</motion.div>
);

// Technical Challenges Table Component
const TechnicalChallengesTable: React.FC = () => (
	<Card className="my-8">
		<CardHeader>
			<CardTitle className="relative flex items-center gap-2">
				<AlertTriangle className="h-5 w-5 text-primary" />
				Anticipated Technical Challenges
				<span className="absolute -bottom-2 left-0 h-1 w-16 rounded-full bg-primary/60" />
			</CardTitle>
		</CardHeader>
		<CardContent>
			<div className="overflow-x-auto">
				<table className="w-full border-collapse rounded-lg border border-border">
					<thead>
						<tr className="bg-accent">
							<th className="border border-border px-4 py-3 text-center font-semibold text-foreground">
								Challenge
							</th>
							<th className="border border-border px-4 py-3 text-center font-semibold text-foreground">
								Description
							</th>
						</tr>
					</thead>
					<tbody>
						<tr className="bg-card hover:bg-muted">
							<td className="border border-border px-4 py-3 font-medium text-foreground">
								Multi-Tenant Performance
							</td>
							<td className="border border-border px-4 py-3 text-muted-foreground">
								Database query optimization will be critical to prevent performance degradation as
								tenant count scales
							</td>
						</tr>
						<tr className="bg-muted hover:bg-muted/80">
							<td className="border border-border px-4 py-3 font-medium text-foreground">
								AI Response Consistency
							</td>
							<td className="border border-border px-4 py-3 text-muted-foreground">
								Maintaining quality responses across diverse knowledge bases while minimizing API
								costs
							</td>
						</tr>
						<tr className="bg-card hover:bg-muted">
							<td className="border border-border px-4 py-3 font-medium text-foreground">
								Cross-Domain Security
							</td>
							<td className="border border-border px-4 py-3 text-muted-foreground">
								Implementing secure widget embedding without creating vulnerabilities or CORS issues
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</CardContent>
	</Card>
);

// Implementation Plan Component
const ImplementationPlan: React.FC = () => (
	<motion.div
		className="mb-16"
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.6, delay: 1.0 }}
	>
		<div id="implementation-plan" className="space-y-6">
			<h2 className="relative mb-8 text-3xl font-bold text-stone-900 dark:text-stone-100">
				Implementation Plan
				<span className="absolute -bottom-2 left-0 h-1 w-16 rounded-full bg-primary/60" />
			</h2>

			<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
				The proposed development strategy follows lean startup principles with a focus on rapid
				market validation and iterative improvement based on user feedback. The implementation plan
				is structured in three phases designed to validate core assumptions while building toward a
				market-ready MVP.
			</p>

			<div className="space-y-6">
				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Phase 1: Core Infrastructure Development (Weeks 1-4)
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						The foundation phase focuses on building the multi-tenant database architecture and user
						authentication system. Critical requirements include implementing row-level security
						policies to ensure complete data isolation between tenants, addressing the identified
						need for agency users managing multiple clients. Anticipated challenges include
						optimizing database queries for multi-tenant scenarios and creating efficient tenant
						switching mechanisms in the user interface.
					</p>
				</div>

				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Phase 2: AI Integration and Document Processing (Weeks 5-8)
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						This phase will implement the document ingestion pipeline and AI integration. Based on
						competitor analysis revealing poor AI response quality in existing solutions, the
						development will emphasize robust PDF parsing, reliable website scraping, and fallback
						methods for content upload. OpenAI API integration will require careful prompt
						engineering to ensure consistent, contextually relevant responses across different
						knowledge bases.
					</p>
				</div>

				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Phase 3: User Interface and Billing System (Weeks 9-12)
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						The final MVP phase focuses on dashboard development optimized for users managing
						multiple chatbot instances. Interface design will prioritize simplicity over feature
						density, directly addressing user complaints about overwhelming enterprise interfaces.
						Stripe integration for subscription billing will implement transparent usage tracking
						and seamless plan upgrades based on conversation volume.
					</p>
				</div>
			</div>

			{/* Technical Challenges Table */}
			<TechnicalChallengesTable />

			{/* Development Timeline */}
			<Timeline
				phases={[
					{
						title: 'Phase 1: Core Infrastructure',
						duration: 'Weeks 1-4',
						description:
							'Multi-tenant database architecture and user authentication system with row-level security policies.',
						icon: <Database className="h-5 w-5 text-primary" />,
					},
					{
						title: 'Phase 2: AI Integration',
						duration: 'Weeks 5-8',
						description:
							'Document ingestion pipeline and AI integration with OpenAI GPT-4 and custom RAG implementation.',
						icon: <Zap className="h-5 w-5 text-primary" />,
					},
					{
						title: 'Phase 3: UI & Billing',
						duration: 'Weeks 9-12',
						description:
							'Dashboard development and Stripe integration for transparent subscription billing.',
						icon: <Users className="h-5 w-5 text-primary" />,
					},
				]}
			/>

			{/* System Architecture */}
			<SystemArchitecture />

			<div>
				<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
					Validation Strategy
				</h3>
				<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
					Weekly user interviews with 5-10 potential agency customers throughout development to
					validate assumptions and adjust features. Alpha testing program will provide real-world
					feedback on multi-tenant workflows before public launch.
				</p>
			</div>

			<div>
				<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
					Quality Assurance Plan
				</h3>
				<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
					Comprehensive testing suite covering multi-tenant data isolation, API response validation,
					billing calculation accuracy, and user experience flows across different scenarios and
					edge cases.
				</p>
			</div>
		</div>
	</motion.div>
);

// Projected Results Component
const ProjectedResults: React.FC = () => (
	<motion.div
		className="mb-16"
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.6, delay: 1.2 }}
	>
		<div id="projected-results" className="space-y-6">
			<h2 className="relative mb-8 text-3xl font-bold text-stone-900 dark:text-stone-100">
				Strategic Projections & Success Metrics
				<span className="absolute -bottom-2 left-0 h-1 w-16 rounded-full bg-primary/60" />
			</h2>

			<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
				Based on the comprehensive market research and competitive analysis, Tendril is positioned
				to achieve strong market validation and user adoption. The projected metrics are grounded in
				documented market demand, competitor performance data, and conservative estimates based on
				similar product launches in the space.
			</p>

			<div className="space-y-6">
				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Projected User Acquisition and Retention (First 12 Months)
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						Target: 200+ sign-ups in first quarter following launch. Conservative conversion
						projection: 35-45% from free to paid plans (based on Tidio and Chatbase benchmarks).
						Projected user retention: 85%+ after first month (industry average for well-executed SMB
						SaaS is 80-90%). Target time from sign-up to first deployed chatbot: Under 30 minutes
						(95% improvement vs. competitor average of 2-3 weeks).
					</p>
				</div>

				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Expected Performance Advantages Over Competitors
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						Setup time reduction: 90%+ faster deployment based on streamlined onboarding design.
						Cost savings for agencies: 60-75% reduction compared to managing separate Intercom/Drift
						subscriptions per client. AI response relevance improvement: Target 30%+ better accuracy
						through modern RAG implementation and prompt optimization. Billing predictability: Zero
						surprise charges through transparent, usage-based pricing model.
					</p>
				</div>

				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Business Impact Projections
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						Year 1 MRR target: $15,000-25,000 based on 150-300 paying customers. Target ARPU:
						$50-75/month (positioned between Tidio's $29 entry point and Intercom's $99+ per seat).
						Projected CAC: $15-30 through organic channels and referral program. Expected NPS: 60+
						based on addressing documented user frustrations with existing solutions.
					</p>
				</div>

				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Technical Performance Targets
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						Uptime goal: 99.5% minimum (industry standard for SMB SaaS). AI query response time:
						Under 2 seconds average. Document processing success rate: 90%+ for common file formats
						and website scraping. Support ticket volume: 40% below industry average through
						intuitive design and comprehensive documentation.
					</p>
				</div>

				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Market Validation Indicators
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						Multi-tenant revenue mix: Projected 50%+ of revenue from agency/multi-brand users
						validates core differentiation strategy. Organic growth rate: Target 20%
						month-over-month through user referrals and word-of-mouth. Plan upgrade rate: 50%+ of
						users upgrading within 90 days due to successful deployment and increased usage.
					</p>
				</div>

				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Success Validation Framework
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						These projections will be validated through: Beta user interviews and usage analytics
						during soft launch phase. Conversion funnel analysis comparing actual vs. projected
						metrics. Customer satisfaction surveys measuring pain point resolution. Competitive
						benchmarking against documented user complaints in market research.
					</p>
				</div>

				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Risk-Adjusted Scenarios
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						Conservative case: 50% of projected metrics still represents viable business with clear
						path to profitability. Optimistic case: Strong product-market fit could drive 2x
						projections, particularly in agency segment. Key indicators for pivot: Sub-20%
						conversion rate or high churn would trigger strategy reassessment.
					</p>
				</div>
			</div>

			<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
				The projected results reflect realistic expectations based on documented market demand while
				accounting for execution challenges typical in competitive SaaS markets.
			</p>

			{/* Market Share Distribution */}
			<SimplePieChart
				title="Projected Market Share Distribution"
				caption="Projected mix based on agency-led adoption; values are proportional shares."
				data={[
					{ label: 'Agency/Multi-tenant', value: 50, color: '#3b82f6' },
					{ label: 'SMB Direct', value: 30, color: '#10b981' },
					{ label: 'Enterprise', value: 15, color: '#f59e0b' },
					{ label: 'Other', value: 5, color: '#ef4444' },
				]}
			/>

			{/* Performance Metrics */}
			<SimpleBarChart
				title="Performance Improvement Targets"
				caption="Current vs. Target benchmarks."
				data={[
					{ label: 'Setup Time Reduction', value: 90, target: 95 },
					{ label: 'Cost Savings', value: 75, target: 80 },
					{ label: 'User Retention', value: 85, target: 90 },
					{ label: 'AI Response Accuracy', value: 30, target: 40 },
				]}
			/>
		</div>
	</motion.div>
);

// Lessons Learned Component
const LessonsLearned: React.FC = () => (
	<motion.div
		className="mb-16"
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.6, delay: 1.4 }}
	>
		<div id="lessons-learned" className="space-y-6">
			<h2 className="relative mb-8 text-3xl font-bold text-stone-900 dark:text-stone-100">
				Lessons Learned from Research & Strategic Planning
				<span className="absolute -bottom-2 left-0 h-1 w-16 rounded-full bg-primary/60" />
			</h2>

			<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
				The Tendril research and strategic planning process provided valuable insights that extend
				beyond the specific product to broader principles of market-driven product development and
				competitive positioning in crowded SaaS markets.
			</p>

			<div className="space-y-6">
				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Market Research Depth Drives Product-Market Fit
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						The extensive upfront research into user complaints and competitive gaps revealed
						critical opportunities that surface-level analysis would have missed. Time invested
						analyzing Reddit discussions, G2 reviews, and user forums identified the multi-tenant
						gap that established competitors have overlooked. This research-first approach prevents
						building features users don't want while uncovering genuine market needs.
					</p>
				</div>

				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Pricing Strategy as Primary Differentiator
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						Analysis revealed that transparent, predictable pricing could serve as a more powerful
						competitive advantage than advanced features. User feedback consistently ranked pricing
						clarity above functionality depth, suggesting that solving the "billing anxiety" problem
						may be more valuable than competing on feature breadth.
					</p>
				</div>

				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Underserved Segments Offer Faster Market Entry
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						Identifying the agency use case through competitive analysis created a path to
						higher-value customers with lower acquisition costs. Rather than competing directly in
						the crowded general SMB market, targeting agencies managing multiple clients provides a
						more defensible initial market position.
					</p>
				</div>

				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Technical Simplicity Enables User Success
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						Research into user complaints revealed that deployment speed matters more than feature
						sophistication for initial adoption. Users prefer functional solutions that work
						immediately over powerful platforms requiring extensive configuration. This insight
						drives the architectural decision to prioritize rapid time-to-value over comprehensive
						capabilities.
					</p>
				</div>

				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Research Methodology Insights
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						User review analysis provided more actionable insights than competitor feature
						comparisons. Forum discussions revealed unmet needs not apparent in marketing materials.
						Pricing complaint patterns indicated market opportunities beyond product features.
					</p>
				</div>

				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Strategic Planning Learnings
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						Multi-source validation strengthens confidence in market assumptions. Quantifying pain
						points (e.g., "120% billing increases") creates compelling problem statements.
						Competitive gaps often exist in operational areas (multi-tenancy) rather than just
						features.
					</p>
				</div>

				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Potential Blind Spots Identified
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						Customer support demands may exceed projections based on SMB expectations. AI response
						quality challenges could require more prompt engineering than anticipated. Integration
						complexity might create longer development cycles than planned.
					</p>
				</div>

				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Risk Assessment Insights
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						Market timing appears favorable due to AI adoption trends and competitor pricing issues.
						Execution risk exists primarily in technical implementation rather than market demand.
						Competitive response risk is moderate given incumbents' pricing model constraints.
					</p>
				</div>

				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Application to Future Projects
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						Deep market research should precede technical planning in all competitive markets. User
						pain points often create better differentiation opportunities than feature innovation.
						Identifying underserved segments provides clearer paths to initial traction. Pricing
						strategy deserves equal attention to product development in strategic planning.
					</p>
				</div>
			</div>
		</div>
	</motion.div>
);

// Simple Bar Chart Component
const SimpleBarChart: React.FC<{
	data: Array<{ label: string; value: number; target?: number }>;
	title: string;
	caption?: string;
}> = ({ data, title, caption }) => {
	const maxValue = Math.max(...data.map((d) => Math.max(d.value, d.target || 0)));

	return (
		<Card className="my-8">
			<CardHeader>
				<CardTitle className="relative flex items-center gap-2">
					<BarChart3 className="h-5 w-5 text-primary" />
					{title}
					<span className="absolute -bottom-2 left-0 h-1 w-12 rounded-full bg-primary/60" />
				</CardTitle>
			</CardHeader>
			<CardContent>
				{caption && <p className="mb-4 text-xs text-stone-600 dark:text-stone-400">{caption}</p>}
				<div className="space-y-4">
					{data.map((item, index) => (
						<div key={item.label} className="space-y-2">
							<div className="flex justify-between text-sm">
								<span className="font-medium text-stone-700 dark:text-stone-300">{item.label}</span>
								<span className="text-stone-600 dark:text-stone-400">{item.value}%</span>
							</div>
							<div className="h-3 w-full rounded-full bg-stone-200 dark:bg-stone-700">
								<div
									className="h-3 rounded-full bg-primary transition-all duration-500 ease-out"
									style={{ width: `${(item.value / maxValue) * 100}%` }}
								></div>
							</div>
							{item.target && (
								<div className="flex justify-between text-xs text-stone-500 dark:text-stone-500">
									<span>Current: {item.value}%</span>
									<span>Target: {item.target}%</span>
								</div>
							)}
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};

// Simple Pie Chart Component
const SimplePieChart: React.FC<{
	data: Array<{ label: string; value: number; color: string }>;
	title: string;
	caption?: string;
}> = ({ data, title, caption }) => {
	const total = data.reduce((sum, item) => sum + item.value, 0);

	return (
		<Card className="my-8">
			<CardHeader>
				<CardTitle className="relative flex items-center gap-2">
					<PieChart className="h-5 w-5 text-primary" />
					{title}
					<span className="absolute -bottom-2 left-0 h-1 w-12 rounded-full bg-primary/60" />
				</CardTitle>
			</CardHeader>
			<CardContent>
				{caption && <p className="mb-4 text-xs text-stone-600 dark:text-stone-400">{caption}</p>}
				<div className="flex w-full flex-col items-center justify-center space-y-6">
					<div className="relative flex h-48 w-48 items-center justify-center">
						<svg
							className="h-full w-full -rotate-90 transform"
							viewBox="0 0 100 100"
							style={{ display: 'block', margin: '0 auto' }}
						>
							{data.map((item, index) => {
								const percentage = (item.value / total) * 100;
								const previousValues = data
									.slice(0, index)
									.reduce((sum, d) => sum + (d.value / total) * 100, 0);
								const startAngle = (previousValues / 100) * 360;
								const endAngle = ((previousValues + percentage) / 100) * 360;

								const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
								const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
								const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
								const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

								const largeArcFlag = percentage > 50 ? 1 : 0;

								return (
									<path
										key={item.label}
										d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
										fill={item.color}
										className="transition-all duration-300 hover:opacity-80"
									/>
								);
							})}
						</svg>
					</div>
				</div>
				<div className="flex w-full justify-center">
					<div className="grid max-w-md grid-cols-2 gap-x-6 gap-y-2">
						{data.map((item) => (
							<div key={item.label} className="flex items-center gap-2">
								<div
									className="h-3 w-3 flex-shrink-0 rounded-full"
									style={{ backgroundColor: item.color }}
								></div>
								<span className="text-sm text-stone-700 dark:text-stone-300">
									{item.label}: {((item.value / total) * 100).toFixed(1)}%
								</span>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

// Timeline Component
const Timeline: React.FC<{
	phases: Array<{ title: string; duration: string; description: string; icon: React.ReactNode }>;
}> = ({ phases }) => (
	<Card className="my-8">
		<CardHeader>
			<CardTitle className="relative flex items-center gap-2">
				<Calendar className="h-5 w-5 text-primary" />
				Development Timeline
				<span className="absolute -bottom-2 left-0 h-1 w-16 rounded-full bg-primary/60" />
			</CardTitle>
		</CardHeader>
		<CardContent>
			<div className="relative overflow-hidden rounded-lg">
				{/* Timeline line (avoid overflow inside card) */}
				<div className="absolute bottom-3 left-6 top-3 z-0 w-0.5 bg-primary/30"></div>

				<div className="space-y-8">
					{phases.map((phase, index) => (
						<div key={index} className="group relative flex items-start gap-4">
							{/* Timeline dot */}
							<div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary/70 bg-primary/10 shadow-[0_0_0_4px_rgba(0,0,0,0.15)] transition-transform duration-200 group-hover:scale-110">
								{phase.icon}
							</div>

							{/* Content */}
							<div className="flex-1 pt-1">
								<div className="mb-2 flex items-center gap-3">
									<h4 className="text-lg font-semibold text-stone-900 transition-colors group-hover:text-stone-700 dark:text-stone-100 dark:group-hover:text-stone-300">
										{phase.title}
									</h4>
									<Badge
										variant="secondary"
										className="text-xs"
									>
										{phase.duration}
									</Badge>
								</div>
								<p className="leading-relaxed text-stone-700 dark:text-stone-300">
									{phase.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</CardContent>
	</Card>
);

// System Architecture Diagram
const SystemArchitecture: React.FC = () => (
	<Card className="my-8">
		<CardHeader>
			<CardTitle className="relative flex items-center gap-2">
				<Database className="h-5 w-5 text-primary" />
				System Architecture
				<span className="absolute -bottom-2 left-0 h-1 w-16 rounded-full bg-primary/60" />
			</CardTitle>
		</CardHeader>
		<CardContent>
			<div className="space-y-6">
				{/* Frontend Layer */}
				<div className="text-center">
					<div className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 ring-1 ring-border">
						<Globe className="h-4 w-4 text-primary" />
						<span className="font-medium text-stone-900 dark:text-stone-100">React Dashboard</span>
					</div>
					<div className="mt-2 text-sm text-stone-600 dark:text-stone-400">Multi-tenant UI</div>
				</div>

				{/* Arrow */}
				<div className="flex justify-center">
					<ArrowRight className="h-6 w-6 rotate-90 transform text-stone-400" />
				</div>

				{/* API Layer */}
				<div className="text-center">
					<div className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 ring-1 ring-border">
						<Zap className="h-4 w-4 text-primary" />
						<span className="font-medium text-stone-900 dark:text-stone-100">Node.js API</span>
					</div>
					<div className="mt-2 text-sm text-stone-600 dark:text-stone-400">
						Tenant isolation & authentication
					</div>
				</div>

				{/* Arrow */}
				<div className="flex justify-center">
					<ArrowRight className="h-6 w-6 rotate-90 transform text-stone-400" />
				</div>

				{/* Database Layer */}
				<div className="text-center">
					<div className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 ring-1 ring-border">
						<Database className="h-4 w-4 text-primary" />
						<span className="font-medium text-stone-900 dark:text-stone-100">PostgreSQL</span>
					</div>
					<div className="mt-2 text-sm text-stone-600 dark:text-stone-400">
						Row-level security & multi-tenancy
					</div>
				</div>

				{/* Arrow */}
				<div className="flex justify-center">
					<ArrowRight className="h-6 w-6 rotate-90 transform text-stone-400" />
				</div>

				{/* AI Integration */}
				<div className="text-center">
					<div className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 ring-1 ring-border">
						<Shield className="h-4 w-4 text-primary" />
						<span className="font-medium text-stone-900 dark:text-stone-100">AI Integration</span>
					</div>
					<div className="mt-2 text-sm text-stone-600 dark:text-stone-400">
						OpenAI GPT-4 with custom RAG implementation
					</div>
				</div>
			</div>
		</CardContent>
	</Card>
);

// Interactive Bar Chart Component
const InteractiveBarChart: React.FC<{
	data: Array<{ label: string; value: number; target?: number }>;
	title: string;
	caption?: string;
}> = ({ data, title, caption }) => {
	const maxValue = Math.max(...data.map((d) => Math.max(d.value, d.target || 0)));

	return (
		<Card className="my-8">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<BarChart3 className="h-5 w-5 text-stone-600" />
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent>
				{caption && <p className="mb-4 text-xs text-stone-600 dark:text-stone-400">{caption}</p>}
				<div className="space-y-4">
					{data.map((item, index) => (
						<div key={item.label} className="space-y-2">
							<div className="flex justify-between text-sm">
								<span className="font-medium text-stone-700 dark:text-stone-300">{item.label}</span>
								<span className="text-stone-600 dark:text-stone-400">{item.value}%</span>
							</div>
							<div className="h-3 w-full rounded-full bg-stone-200 dark:bg-stone-700">
								<div
									className="h-3 rounded-full bg-primary transition-all duration-500 ease-out"
									style={{ width: `${(item.value / maxValue) * 100}%` }}
								></div>
							</div>
							{item.target && (
								<div className="flex justify-between text-xs text-stone-500 dark:text-stone-500">
									<span>Current: {item.value}%</span>
									<span>Target: {item.target}%</span>
								</div>
							)}
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};

// Development Roadmap Component
const DevelopmentRoadmap: React.FC = () => (
	<motion.div
		className="mb-16"
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.6, delay: 1.6 }}
	>
		<div id="development-roadmap" className="space-y-6">
			<h2 className="relative mb-8 text-3xl font-bold text-stone-900 dark:text-stone-100">
				Development Roadmap & Strategic Plan
				<span className="absolute -bottom-2 left-0 h-1 w-16 rounded-full bg-primary/60" />
			</h2>

			<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
				The Tendril strategic plan builds upon validated market research to establish a clear path
				from concept to market-ready solution. The roadmap balances technical feasibility with
				business objectives while maintaining focus on the core differentiators identified through
				competitive analysis.
			</p>

			<div className="space-y-6">
				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Immediate Development Phase (Months 1-3)
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						MVP Development: Execute the three-phase implementation plan with core multi-tenant
						architecture, AI integration, and user interface. Beta Testing Program: Recruit 10-15
						potential agency customers for alpha/beta testing to validate assumptions before wider
						launch. Market Positioning: Develop messaging and positioning strategy emphasizing
						transparency, speed, and multi-tenant capabilities.
					</p>
				</div>

				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Market Entry Strategy (Months 4-6)
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						Soft Launch: Limited release to beta users and targeted agency outreach based on
						research-identified pain points. Pricing Validation: Test projected pricing models with
						real users to confirm market acceptance. Initial Feature Expansion: Add most-requested
						features from beta feedback, likely including basic analytics and integration
						capabilities.
					</p>
				</div>

				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Growth and Validation Phase (Months 7-12)
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						Scale User Base: Target 150-300 paying customers based on projected conversion rates.
						Agency Partnership Program: Formalize relationships with early agency adopters who
						validated the multi-tenant value proposition. Feature Development: Implement workflow
						integrations and advanced capabilities identified through user feedback.
					</p>
				</div>

				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Competitive Positioning Strategy
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						Based on market research, position Tendril as "the anti-Intercom" - transparent pricing,
						rapid deployment, and genuine SMB focus. Leverage documented user frustrations with
						incumbent solutions to drive adoption through comparison messaging.
					</p>
				</div>

				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Risk Mitigation Plan
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						Technical Risk: Prototype core AI integration early to validate response quality
						assumptions. Market Risk: Maintain close contact with potential customers throughout
						development to ensure continued demand. Competitive Risk: Monitor incumbent responses
						and maintain agility to adjust positioning if needed.
					</p>
				</div>

				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Success Validation Milestones
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						Month 3: Functional MVP with beta user validation. Month 6: 50+ active users
						demonstrating product-market fit. Month 9: $10K+ MRR indicating sustainable business
						model. Month 12: Clear path to profitability with validated unit economics.
					</p>
				</div>

				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Long-term Strategic Vision
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						Transform from chatbot platform into comprehensive customer communication solution for
						SMBs and agencies. Maintain core advantages of simplicity and transparency while
						expanding capabilities based on user needs and market evolution.
					</p>
				</div>

				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Resource Requirements and Investment
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						Development: 3-6 months full-time development effort. Infrastructure: Cloud hosting and
						AI API costs scaling with usage. Marketing: Content creation and targeted outreach to
						agency segment. Operations: Customer support and user onboarding systems.
					</p>
				</div>
			</div>

			<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
				The strategic plan provides clear milestones while maintaining flexibility to adapt based on
				market feedback and validation of core assumptions identified through the extensive research
				phase.
			</p>

			<div className="mt-8">
				<div className="relative overflow-hidden rounded-xl border border-border bg-accent/50 p-6 sm:p-8">
					<div className="pointer-events-none absolute inset-0" aria-hidden="true"></div>
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div>
							<h4 className="flex items-center gap-2 text-xl font-semibold text-stone-900 dark:text-stone-100">
								<span className="inline-block h-2 w-2 rounded-full bg-primary"></span>
								Ready to validate this plan?
							</h4>
							<p className="mt-1 text-stone-700 dark:text-stone-300">
								Book a quick call to review timelines, scope, and success metrics.
							</p>
						</div>
						<div className="flex flex-wrap items-center gap-3">
							<Link
								href="/contact"
								className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
							>
								Get in touch
							</Link>
							<Link
								href="/services/consulting"
								className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 font-medium transition-colors hover:bg-accent"
							>
								View services
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	</motion.div>
);

// Hero Section Component
const HeroSection: React.FC = () => (
	<motion.div
		className="mb-16"
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.6, delay: 0.2 }}
	>
		<div className="mb-12 text-center">
			<Badge
				variant="secondary"
				className="mb-4"
			>
				Strategic Analysis
			</Badge>
			<h1 className="mb-6 text-4xl font-bold leading-tight text-stone-900 lg:text-6xl dark:text-stone-100">
				Tendril Multi-Tenant Chatbot SaaS
			</h1>
			<p className="mx-auto mb-8 max-w-4xl text-xl leading-relaxed text-stone-600 lg:text-2xl dark:text-stone-400">
				Strategic Analysis and Implementation Plan
			</p>
			<div className="flex flex-wrap justify-center gap-4 text-sm text-stone-500 dark:text-stone-400">
				<span>Strategic Analysis</span>
				<span>•</span>
				<span>Market Research</span>
				<span>•</span>
				<span>Implementation Plan</span>
			</div>
		</div>
	</motion.div>
);

// Problem Statement Component
const ProblemStatement: React.FC = () => (
	<motion.div
		className="mb-16"
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.6, delay: 0.4 }}
	>
		<div id="problem-statement" className="space-y-6">
			<h2 className="relative mb-8 text-3xl font-bold text-stone-900 dark:text-stone-100">
				Problem Statement
				<span className="absolute -bottom-2 left-0 h-1 w-16 rounded-full bg-primary/60" />
			</h2>

			<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
				Small and medium businesses (SMBs) are increasingly frustrated with existing chatbot
				solutions that fail to meet their unique needs. Despite the growing demand for AI-powered
				customer support, current market leaders like Intercom, Drift, and newer entrants like
				Chatbase create significant barriers for SMBs through unpredictable pricing, complex setup
				processes, and inadequate support for multi-client management.
			</p>

			<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
				The core problem identified through extensive market research reveals three critical pain
				points:
			</p>

			<div className="space-y-6">
				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Pricing Transparency Crisis
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						SMBs report bill increases of up to 120% with existing solutions due to hidden usage
						fees and confusing pricing models. Intercom's per-seat pricing with AI add-ons ($0.99
						per resolution) creates unpredictable costs that can devastate small business budgets.
						Drift's value-based pricing requires sales calls without transparent rate cards, while
						Chatbase nickels-and-dimes users with additional charges for basic features like custom
						branding ($39/month extra).
					</p>
				</div>

				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Setup Complexity Barrier
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						Despite claims of being "no-code," existing solutions overwhelm small teams with
						enterprise-grade complexity. Users report spending weeks configuring chatbots that
						should work immediately. Technical limitations plague the space - Chatbase users
						describe AI responses as "vague and unhelpful," often deflecting with generic "contact
						us by email" responses even for information clearly available on websites.
					</p>
				</div>

				<div>
					<h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">
						Multi-Tenant Gap
					</h3>
					<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
						Agencies and developers managing chatbots for multiple clients face a critical
						infrastructure gap. Current solutions force them to maintain separate subscriptions for
						each client or use workarounds that compromise data isolation and branding. This creates
						both cost inefficiencies and operational headaches for the growing segment of service
						providers in the chatbot space.
					</p>
				</div>
			</div>

			<p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
				These problems affect a significant market segment: startups, agencies, solo founders, and
				small businesses that need professional chatbot functionality without enterprise complexity
				or pricing. The stakeholders impacted include business owners seeking cost-effective
				customer support automation, agencies managing multiple client deployments, and end
				customers who receive subpar automated support due to poorly configured or limited chatbot
				implementations.
			</p>
		</div>
	</motion.div>
);

// Table of Contents Component
const TableOfContents: React.FC<{ items: Array<{ id: string; title: string }> }> = ({ items }) => {
	const [activeSection, setActiveSection] = React.useState('');

	React.useEffect(() => {
		const handleScroll = () => {
			const sections = items.map((item) => ({
				id: item.id,
				element: document.getElementById(item.id),
			}));

			const scrollPosition = window.scrollY + 120; // Account for header height

			for (let i = sections.length - 1; i >= 0; i--) {
				const section = sections[i];
				if (section.element) {
					const elementTop = section.element.offsetTop;
					const elementBottom = elementTop + section.element.offsetHeight;

					if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
						setActiveSection(section.id);
						break;
					}
				}
			}
		};

		window.addEventListener('scroll', handleScroll);
		handleScroll(); // Check initial position

		return () => window.removeEventListener('scroll', handleScroll);
	}, [items]);

	return (
		<div className="max-h-[calc(100vh-2rem)] space-y-2 overflow-y-auto pr-1">
			<h3 className="relative mb-4 text-sm font-semibold uppercase tracking-wide text-stone-900 dark:text-stone-100">
				Table of Contents
				<span className="absolute -bottom-1 left-0 h-0.5 w-10 rounded-full bg-primary/60" />
			</h3>
			<nav className="space-y-1">
				{items.map((item) => (
					<a
						key={item.id}
						href={`#${item.id}`}
						className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 pl-2 text-sm transition-colors ${
							activeSection === item.id
								? 'border-l-2 border-primary bg-accent font-medium text-stone-900 ring-1 ring-border dark:text-stone-100'
								: 'border-l-2 border-transparent text-stone-600 hover:bg-stone-50 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-900/50 dark:hover:text-stone-100'
						}`}
						onClick={(e) => {
							e.preventDefault();
							const element = document.getElementById(item.id);
							if (element) {
								const headerHeight = 80; // Account for fixed navigation
								const elementPosition = element.offsetTop - headerHeight;
								window.scrollTo({
									top: elementPosition,
									behavior: 'smooth',
								});
							}
						}}
					>
						<ChevronRight
							className={`h-3 w-3 transition-transform ${
								activeSection === item.id ? 'rotate-90 text-primary' : 'text-stone-400'
							}`}
						/>
						{item.title}
					</a>
				))}
			</nav>
		</div>
	);
};

// Projected Metrics Component
const ProjectedMetrics: React.FC<{
	data: Array<{ metric: string; target: string; benchmark: string; improvement: string }>;
}> = ({ data }) => (
	<Card className="my-8">
		<CardHeader>
			<CardTitle className="flex items-center gap-2">
				<Target className="h-5 w-5 text-stone-600" />
				Strategic Performance Targets
			</CardTitle>
		</CardHeader>
		<CardContent>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
				{data.map((item, index) => (
					<div key={index} className="rounded-lg border border-stone-200 p-4 dark:border-stone-700">
						<div className="mb-2 text-sm font-medium text-stone-600 dark:text-stone-400">
							{item.metric}
						</div>
						<div className="mb-1 text-2xl font-bold text-stone-900 dark:text-stone-100">
							{item.target}
						</div>
						<div className="mb-2 text-xs text-stone-500 dark:text-stone-500">
							vs {item.benchmark}
						</div>
						<Badge
							variant="secondary"
							className="text-xs"
						>
							{item.improvement}
						</Badge>
					</div>
				))}
			</div>
		</CardContent>
	</Card>
);

export default function TendriloCaseStudy({ publication }: CaseStudyProps) {
	const toc = [
		{ id: 'problem-statement', title: 'Problem Statement' },
		{ id: 'research-analysis', title: 'Research & Analysis' },
		{ id: 'solution-design', title: 'Solution Design' },
		{ id: 'implementation-plan', title: 'Implementation Plan' },
		{ id: 'projected-results', title: 'Strategic Projections' },
		{ id: 'lessons-learned', title: 'Lessons Learned' },
		{ id: 'development-roadmap', title: 'Development Roadmap' },
	];

	return (
		<AppProvider publication={publication}>
			<Layout>
				<Head>
					<title>
						Tendril Multi-Tenant Chatbot SaaS – Strategic Analysis and Implementation Plan
					</title>
					<meta
						name="description"
						content="Comprehensive strategic analysis and implementation plan for Tendril Multi-Tenant Chatbot SaaS platform targeting SMB market gaps."
					/>
					<meta
						name="keywords"
						content="chatbot, saas, multi-tenant, strategic analysis, implementation plan, SMB, market research"
					/>
				</Head>

				<ModernHeader publication={publication} />

				<main className="min-h-screen bg-background">
					<Container>
						<div className="grid grid-cols-1 gap-8 py-12 lg:grid-cols-4">
							{/* Main Content */}
							<div className="space-y-12 lg:col-span-3">
								<HeroSection />
								<ProblemStatement />
								<ResearchAnalysis />
								<SolutionDesign />
								<ImplementationPlan />
								<ProjectedResults />
								<LessonsLearned />
								<DevelopmentRoadmap />
							</div>

							{/* Table of Contents - Right Sidebar */}
							<div className="lg:col-span-1">
								<div className="sticky top-20 w-full max-w-[260px]">
									<Card className="border-border shadow-lg">
										<CardContent className="p-6">
											<TableOfContents items={toc} />
										</CardContent>
									</Card>
								</div>
							</div>
						</div>
					</Container>
				</main>

				<Chatbot />
			</Layout>
		</AppProvider>
	);
}

export const getStaticProps: GetStaticProps<CaseStudyProps> = async () => {
	const host = process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST || 'mindware.hashnode.dev';

	try {
		const data = await request<PostsByPublicationQuery, PostsByPublicationQueryVariables>(
			GQL_ENDPOINT,
			PostsByPublicationDocument,
			{
				first: 0,
				host: host,
			},
		);

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
		return {
			notFound: true,
		};
	}
};
