'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Target, Lightbulb, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui';
import { cn } from '../../lib/utils';

// Define the case study section structure
export interface CaseStudySection {
	id: string;
	title: string;
	content: React.ReactNode;
	icon?: React.ReactNode;
	description?: string;
}

// Define the main case study data structure
export interface InlineCaseStudyData {
	title: string;
	description?: string;
	sections: CaseStudySection[];
}

// Individual accordion item component with proper ARIA attributes
interface AccordionItemProps {
	section: CaseStudySection;
	isOpen: boolean;
	onToggle: () => void;
	index: number;
	totalSections: number;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
	section,
	isOpen,
	onToggle,
	index,
	totalSections,
}) => {
	const triggerRef = useRef<HTMLButtonElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const [contentHeight, setContentHeight] = useState<number>(0);

	// Calculate content height for smooth animation
	useEffect(() => {
		if (contentRef.current) {
			setContentHeight(contentRef.current.scrollHeight);
		}
	}, [section.content, isOpen]);

	// Handle keyboard navigation
	const handleKeyDown = (event: React.KeyboardEvent) => {
		switch (event.key) {
			case 'Enter':
			case ' ':
				event.preventDefault();
				onToggle();
				break;
			case 'ArrowDown':
				event.preventDefault();
				// Focus next accordion item
				const nextTrigger = triggerRef.current?.parentElement?.nextElementSibling?.querySelector('[role="button"]') as HTMLButtonElement;
				nextTrigger?.focus();
				break;
			case 'ArrowUp':
				event.preventDefault();
				// Focus previous accordion item
				const prevTrigger = triggerRef.current?.parentElement?.previousElementSibling?.querySelector('[role="button"]') as HTMLButtonElement;
				prevTrigger?.focus();
				break;
			case 'Home':
				event.preventDefault();
				// Focus first accordion item
				const firstTrigger = triggerRef.current?.parentElement?.parentElement?.querySelector('[role="button"]') as HTMLButtonElement;
				firstTrigger?.focus();
				break;
			case 'End':
				event.preventDefault();
				// Focus last accordion item
				const triggers = triggerRef.current?.parentElement?.parentElement?.querySelectorAll('[role="button"]') as NodeListOf<HTMLButtonElement>;
				triggers[triggers.length - 1]?.focus();
				break;
		}
	};

	return (
		<div className="border-b border-stone-200 last:border-b-0 dark:border-stone-700">
			{/* Accordion Trigger */}
			<button
				ref={triggerRef}
				onClick={onToggle}
				onKeyDown={handleKeyDown}
				className={cn(
					'group flex w-full items-center justify-between rounded-md px-4 py-4 text-left transition-all duration-300 ease-in-out',
					'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 focus-visible:ring-offset-2',
					'hover:bg-stone-50 dark:hover:bg-stone-800/50',
					'border-l-2 border-transparent hover:border-l-stone-300 dark:hover:border-l-stone-600',
					isOpen && 'border-l-stone-500 bg-stone-50 dark:border-l-stone-400 dark:bg-stone-800/50'
				)}
				aria-expanded={isOpen}
				aria-controls={`case-study-content-${section.id}`}
				aria-describedby={section.description ? `case-study-desc-${section.id}` : undefined}
				role="button"
				tabIndex={0}
			>
				<div className="flex items-center gap-3">
					{section.icon && (
						<div className={cn(
							'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
							isOpen 
								? 'bg-stone-600 text-white dark:bg-stone-400 dark:text-stone-900' 
								: 'bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-400'
						)}>
							{section.icon}
						</div>
					)}
					<div>
						<h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
							{section.title}
						</h3>
						{section.description && (
							<p 
								id={`case-study-desc-${section.id}`}
								className="text-sm text-stone-600 dark:text-stone-400"
							>
								{section.description}
							</p>
						)}
					</div>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-xs text-stone-500 dark:text-stone-400">
						{index + 1} of {totalSections}
					</span>
					{isOpen ? (
						<ChevronUp className="h-5 w-5 text-stone-600 transition-transform duration-300 dark:text-stone-400" />
					) : (
						<ChevronDown className="h-5 w-5 text-stone-600 transition-transform duration-300 dark:text-stone-400" />
					)}
				</div>
			</button>

			{/* Accordion Content */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: contentHeight, opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3, ease: 'easeInOut' }}
						className="overflow-hidden"
					>
						<div
							ref={contentRef}
							id={`case-study-content-${section.id}`}
							className="border-t border-stone-200 bg-stone-50/50 px-4 py-6 dark:border-stone-700 dark:bg-stone-800/30"
							role="region"
							aria-labelledby={`case-study-trigger-${section.id}`}
						>
							<div className="prose prose-stone max-w-none dark:prose-invert">
								{section.content}
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

// Main InlineCaseStudy component
interface InlineCaseStudyProps {
	data: InlineCaseStudyData;
	className?: string;
	defaultOpenSection?: string;
}

export const InlineCaseStudy: React.FC<InlineCaseStudyProps> = ({
	data,
	className,
	defaultOpenSection,
}) => {
	const [openSections, setOpenSections] = useState<Set<string>>(
		new Set(defaultOpenSection ? [defaultOpenSection] : [])
	);

	// Handle section toggle
	const toggleSection = (sectionId: string) => {
		setOpenSections(prev => {
			const newSet = new Set(prev);
			if (newSet.has(sectionId)) {
				newSet.delete(sectionId);
			} else {
				newSet.add(sectionId);
			}
			return newSet;
		});
	};

	// Handle expand/collapse all
	const toggleAllSections = () => {
		if (openSections.size === data.sections.length) {
			setOpenSections(new Set());
		} else {
			setOpenSections(new Set(data.sections.map(section => section.id)));
		}
	};

	const allOpen = openSections.size === data.sections.length;
	const someOpen = openSections.size > 0 && openSections.size < data.sections.length;

	return (
		<Card className={cn('w-full', className)}>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="text-xl font-bold text-stone-900 dark:text-stone-100">
							{data.title}
						</CardTitle>
						{data.description && (
							<p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
								{data.description}
							</p>
						)}
					</div>
					<button
						onClick={toggleAllSections}
						className={cn(
							'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
							'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 focus-visible:ring-offset-2',
							'hover:bg-stone-100 dark:hover:bg-stone-700',
							'text-stone-700 dark:text-stone-300'
						)}
						aria-label={allOpen ? 'Collapse all sections' : 'Expand all sections'}
					>
						{allOpen ? 'Collapse All' : someOpen ? 'Expand All' : 'Expand All'}
					</button>
				</div>
			</CardHeader>
			<CardContent className="p-0">
				<div
					role="region"
					aria-label={`Case study: ${data.title}`}
					aria-describedby={data.description ? 'case-study-description' : undefined}
				>
					{data.description && (
						<div id="case-study-description" className="sr-only">
							{data.description}
						</div>
					)}
					<div className="divide-y divide-stone-200 dark:divide-stone-700">
						{data.sections.map((section, index) => (
							<AccordionItem
								key={section.id}
								section={section}
								isOpen={openSections.has(section.id)}
								onToggle={() => toggleSection(section.id)}
								index={index}
								totalSections={data.sections.length}
							/>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

// Default case study sections with icons
export const createDefaultCaseStudySections = (): CaseStudySection[] => [
	{
		id: 'problem',
		title: 'Problem Statement',
		description: 'The challenge that needed to be solved',
		icon: <Target className="h-4 w-4" />,
		content: (
			<div>
				<p>Define the problem or challenge that needed to be solved. Include context, background, and why this problem matters.</p>
			</div>
		),
	},
	{
		id: 'solution',
		title: 'Solution Design',
		description: 'The approach and architecture chosen',
		icon: <Lightbulb className="h-4 w-4" />,
		content: (
			<div>
				<p>Detail the architecture, approach, and design decisions. Explain the technical and business solution.</p>
			</div>
		),
	},
	{
		id: 'challenges',
		title: 'Challenges & Implementation',
		description: 'Technical implementation and obstacles overcome',
		icon: <AlertTriangle className="h-4 w-4" />,
		content: (
			<div>
				<p>Explain the technical implementation, development process, challenges encountered, and solutions implemented.</p>
			</div>
		),
	},
	{
		id: 'results',
		title: 'Results & Metrics',
		description: 'Outcomes and measurable success',
		icon: <TrendingUp className="h-4 w-4" />,
		content: (
			<div>
				<p>Share outcomes, performance metrics, and measurable results. Include quantitative data and business impact.</p>
			</div>
		),
	},
];

// Helper function to create a case study with default sections
export const createInlineCaseStudy = (
	title: string,
	description?: string,
	sections?: Partial<CaseStudySection>[]
): InlineCaseStudyData => {
	const defaultSections = createDefaultCaseStudySections();
	
	const customSections = sections?.map((section, index) => ({
		...defaultSections[index],
		...section,
	})) || defaultSections;

	return {
		title,
		description,
		sections: customSections,
	};
};

export default InlineCaseStudy;
