'use client';

import React from 'react';
import { InlineCaseStudy, createInlineCaseStudy, CaseStudySection } from './InlineCaseStudy';
import { Target, Lightbulb, AlertTriangle, TrendingUp, Code, Database, Globe } from 'lucide-react';

// Example case study data
const exampleCaseStudyData = createInlineCaseStudy(
	'Tendril Multi-Tenant Chatbot Platform',
	'A comprehensive SaaS platform for managing multiple chatbot instances with advanced AI capabilities and analytics.',
	[
		{
			id: 'problem',
			title: 'Problem Statement',
			description: 'The challenge that needed to be solved',
			icon: <Target className="h-4 w-4" />,
			content: (
				<div className="space-y-4">
					<p className="text-stone-700 dark:text-stone-300">
						The market lacked a comprehensive multi-tenant chatbot platform that could handle multiple clients 
						with different branding, conversation flows, and analytics requirements. Existing solutions were 
						either too simple for enterprise needs or too complex for small businesses.
					</p>
					<div className="rounded-lg bg-stone-100 p-4 dark:bg-stone-800">
						<h4 className="font-semibold text-stone-900 dark:text-stone-100 mb-2">Key Challenges:</h4>
						<ul className="list-disc list-inside space-y-1 text-sm text-stone-700 dark:text-stone-300">
							<li>Multi-tenant architecture with data isolation</li>
							<li>Custom branding and white-labeling capabilities</li>
							<li>Scalable conversation management</li>
							<li>Advanced analytics and reporting</li>
							<li>Integration with existing business systems</li>
						</ul>
					</div>
				</div>
			),
		},
		{
			id: 'solution',
			title: 'Solution Design',
			description: 'The approach and architecture chosen',
			icon: <Lightbulb className="h-4 w-4" />,
			content: (
				<div className="space-y-4">
					<p className="text-stone-700 dark:text-stone-300">
						Designed a modern, scalable SaaS platform using Next.js, TypeScript, and Prisma with a 
						multi-tenant architecture that supports custom branding and advanced analytics.
					</p>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="rounded-lg border border-stone-200 p-4 dark:border-stone-700">
							<div className="flex items-center gap-2 mb-2">
								<Code className="h-4 w-4 text-blue-600" />
								<h4 className="font-semibold text-stone-900 dark:text-stone-100">Frontend</h4>
							</div>
							<p className="text-sm text-stone-600 dark:text-stone-400">
								Next.js 14, TypeScript, Tailwind CSS, Framer Motion
							</p>
						</div>
						<div className="rounded-lg border border-stone-200 p-4 dark:border-stone-700">
							<div className="flex items-center gap-2 mb-2">
								<Database className="h-4 w-4 text-green-600" />
								<h4 className="font-semibold text-stone-900 dark:text-stone-100">Backend</h4>
							</div>
							<p className="text-sm text-stone-600 dark:text-stone-400">
								Prisma, PostgreSQL, Next.js API Routes
							</p>
						</div>
						<div className="rounded-lg border border-stone-200 p-4 dark:border-stone-700">
							<div className="flex items-center gap-2 mb-2">
								<Globe className="h-4 w-4 text-purple-600" />
								<h4 className="font-semibold text-stone-900 dark:text-stone-100">Deployment</h4>
							</div>
							<p className="text-sm text-stone-600 dark:text-stone-400">
								Vercel, AWS RDS, Cloudflare
							</p>
						</div>
					</div>
				</div>
			),
		},
		{
			id: 'challenges',
			title: 'Challenges & Implementation',
			description: 'Technical implementation and obstacles overcome',
			icon: <AlertTriangle className="h-4 w-4" />,
			content: (
				<div className="space-y-4">
					<p className="text-stone-700 dark:text-stone-300">
						The implementation faced several technical challenges that required innovative solutions and 
						careful architecture decisions.
					</p>
					<div className="space-y-3">
						<div className="rounded-lg border-l-4 border-l-orange-500 bg-orange-50 p-4 dark:bg-orange-950/20">
							<h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
								Multi-Tenant Data Isolation
							</h4>
							<p className="text-sm text-orange-800 dark:text-orange-200">
								Implemented row-level security and tenant-specific database schemas to ensure complete 
								data isolation between different clients.
							</p>
						</div>
						<div className="rounded-lg border-l-4 border-l-blue-500 bg-blue-50 p-4 dark:bg-blue-950/20">
							<h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
								Real-time Conversation Management
							</h4>
							<p className="text-sm text-blue-800 dark:text-blue-200">
								Built a WebSocket-based system for real-time conversation handling with automatic 
								scaling and load balancing.
							</p>
						</div>
						<div className="rounded-lg border-l-4 border-l-green-500 bg-green-50 p-4 dark:bg-green-950/20">
							<h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
								Custom Branding System
							</h4>
							<p className="text-sm text-green-800 dark:text-green-200">
								Developed a dynamic theming system that allows clients to customize colors, logos, 
								and styling without code changes.
							</p>
						</div>
					</div>
				</div>
			),
		},
		{
			id: 'results',
			title: 'Results & Metrics',
			description: 'Outcomes and measurable success',
			icon: <TrendingUp className="h-4 w-4" />,
			content: (
				<div className="space-y-4">
					<p className="text-stone-700 dark:text-stone-300">
						The platform achieved significant improvements in performance, user experience, and business metrics.
					</p>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="rounded-lg bg-green-50 p-4 dark:bg-green-950/20">
							<h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Performance</h4>
							<ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
								<li>• Significant reduction in page load times</li>
								<li>• High uptime achieved</li>
								<li>• Support for high concurrent users</li>
							</ul>
						</div>
						<div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
							<h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Business Impact</h4>
							<ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
								<li>• Significant increase in user engagement</li>
								<li>• Reduction in support tickets</li>
								<li>• Improved conversion rates</li>
							</ul>
						</div>
					</div>
					<div className="rounded-lg border border-stone-200 p-4 dark:border-stone-700">
						<h4 className="font-semibold text-stone-900 dark:text-stone-100 mb-2">Key Achievements</h4>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
							<div>
								<div className="text-2xl font-bold text-stone-900 dark:text-stone-100">15+</div>
								<div className="text-sm text-stone-600 dark:text-stone-400">Enterprise Clients</div>
							</div>
							<div>
								<div className="text-2xl font-bold text-stone-900 dark:text-stone-100">1M+</div>
								<div className="text-sm text-stone-600 dark:text-stone-400">Conversations Processed</div>
							</div>
							<div>
								<div className="text-2xl font-bold text-stone-900 dark:text-stone-100">99.9%</div>
								<div className="text-sm text-stone-600 dark:text-stone-400">Uptime</div>
							</div>
						</div>
					</div>
				</div>
			),
		},
	]
);

// Demo component showing different usage patterns
export const InlineCaseStudyDemo: React.FC = () => {
	return (
		<div className="max-w-4xl mx-auto p-6 space-y-8">
			<div>
				<h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-4">
					InlineCaseStudy Component Demo
				</h1>
				<p className="text-stone-600 dark:text-stone-400 mb-6">
					This demonstrates the InlineCaseStudy accordion component with proper ARIA attributes, 
					keyboard navigation, and accessibility features.
				</p>
			</div>

			{/* Basic Usage */}
			<div>
				<h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
					Basic Usage
				</h2>
				<InlineCaseStudy 
					data={exampleCaseStudyData}
					defaultOpenSection="problem"
				/>
			</div>

			{/* Custom Styling */}
			<div>
				<h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
					Custom Styling
				</h2>
				<InlineCaseStudy 
					data={exampleCaseStudyData}
					className="border-2 border-blue-200 dark:border-blue-800"
				/>
			</div>

			{/* Usage Instructions */}
			<div className="rounded-lg bg-stone-100 p-6 dark:bg-stone-800">
				<h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
					How to Use
				</h3>
				<div className="space-y-3 text-sm text-stone-700 dark:text-stone-300">
					<div>
						<strong>Keyboard Navigation:</strong>
						<ul className="list-disc list-inside ml-4 mt-1 space-y-1">
							<li>Tab to navigate between sections</li>
							<li>Enter or Space to toggle sections</li>
							<li>Arrow keys to navigate between accordion items</li>
							<li>Home/End to jump to first/last section</li>
						</ul>
					</div>
					<div>
						<strong>Accessibility Features:</strong>
						<ul className="list-disc list-inside ml-4 mt-1 space-y-1">
							<li>Proper ARIA attributes for screen readers</li>
							<li>Focus management and visual indicators</li>
							<li>Semantic HTML structure</li>
							<li>High contrast support</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default InlineCaseStudyDemo;
