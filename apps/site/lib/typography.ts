/**
 * Canonical public typography for Schibelli.com.
 *
 * Visual values live in `styles/index.css` as `.type-*` classes.
 * Consuming components should apply a role class and must not re-specify
 * font-size, font-weight, line-height, or letter-spacing for that text.
 */
export const typeRole = {
	display: 'type-display',
	pageH1: 'type-page-h1',
	caseStudyH1: 'type-case-study-h1',
	articleH1: 'type-case-study-h1',
	sectionH2: 'type-section-h2',
	subsectionH3: 'type-subsection-h3',
	cardTitle: 'type-card-title',
	heroSupport: 'type-hero-support',
	subtitle: 'type-subtitle',
	body: 'type-body',
	articleBody: 'type-article-body',
	small: 'type-small',
	metadata: 'type-metadata',
	eyebrow: 'type-eyebrow',
	button: 'type-button',
	smallControl: 'type-small-control',
	code: 'type-code',
} as const;

export type TypeRole = keyof typeof typeRole;
