// Standardized Case Study Structure
export const CASE_STUDY_SECTIONS = [
	{
		id: 'problem-statement',
		title: 'Problem Statement',
		level: 2,
		description: 'Define the problem or challenge that needed to be solved',
	},
	{
		id: 'research-analysis',
		title: 'Research & Analysis',
		level: 2,
		description: 'Market research, competitive analysis, and data gathering',
	},
	{
		id: 'solution-design',
		title: 'Solution Design',
		level: 2,
		description: 'Architecture, approach, and design decisions',
	},
	{
		id: 'implementation',
		title: 'Implementation',
		level: 2,
		description: 'Technical implementation, development process, and execution',
	},
	{
		id: 'results-metrics',
		title: 'Results & Metrics',
		level: 2,
		description: 'Outcomes, performance metrics, and measurable results',
	},
	{
		id: 'lessons-learned',
		title: 'Lessons Learned',
		level: 2,
		description: 'Key insights, challenges overcome, and takeaways',
	},
	{
		id: 'next-steps',
		title: 'Next Steps',
		level: 2,
		description: 'Future plans, improvements, and ongoing development',
	},
] as const;

// Helper function to generate standardized TOC items
export const generateStandardizedTOC = () => {
	return CASE_STUDY_SECTIONS.map((section) => ({
		id: section.id,
		level: section.level,
		parentId: null,
		slug: section.id,
		title: section.title,
	}));
};

// Helper function to validate case study structure
export const validateCaseStudyStructure = (markdownContent: string): boolean => {
	const content = markdownContent.toLowerCase();

	return CASE_STUDY_SECTIONS.every((section) => {
		const escapedTitle = section.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const headingPattern = new RegExp(
			`^##\\s+${escapedTitle.toLowerCase()}`,
			'm',
		);
		return headingPattern.test(content);
	});
};

// Helper function to get missing sections
export const getMissingSections = (markdownContent: string): string[] => {
	const content = markdownContent.toLowerCase();
	const missing: string[] = [];

	CASE_STUDY_SECTIONS.forEach((section) => {
		const escapedTitle = section.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const headingPattern = new RegExp(
			`^##\\s+${escapedTitle.toLowerCase()}`,
			'm',
		);
		if (!headingPattern.test(content)) {
			missing.push(section.title);
		}
	});

	return missing;
};

// Template for new case studies
export const CASE_STUDY_TEMPLATE = `# [Case Study Title]

## Problem Statement

[Describe the problem or challenge that needed to be solved]

## Research & Analysis

[Include market research, competitive analysis, and data gathering]

## Solution Design

[Detail the architecture, approach, and design decisions]

## Implementation

[Explain the technical implementation, development process, and execution]

## Results & Metrics

[Share outcomes, performance metrics, and measurable results]

## Lessons Learned

[Highlight key insights, challenges overcome, and takeaways]

## Next Steps

[Outline future plans, improvements, and ongoing development]`;

// Helper function to create a new case study with the standard structure
export const createNewCaseStudy = (
	title: string,
	content: Partial<Record<string, string>> = {},
) => {
	let markdown = `# ${title}\n\n`;

	CASE_STUDY_SECTIONS.forEach((section) => {
		markdown += `## ${section.title}\n\n`;
		markdown += content[section.id] || `[${section.description}]\n\n`;
	});

	return markdown;
};
