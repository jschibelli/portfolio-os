/**
 * Project Types
 * 
 * Shared type system for project pages including case studies, portfolio items,
 * and project showcases. These types provide consistent structure across all
 * project-related components and data.
 */

/**
 * Core project metadata that describes the essential information about a project
 */
export interface ProjectMeta {
	/** Unique identifier for the project */
	id: string;
	
	/** Display title of the project */
	title: string;
	
	/** URL-friendly slug for routing */
	slug: string;
	
	/** Brief description of the project */
	description: string;
	
	/** Main project image URL */
	image: string;
	
	/** Array of technology tags associated with the project */
	tags: string[];
	
	/** Optional live URL where the project can be accessed */
	liveUrl?: string;
	
	/** Optional URL to the case study or detailed project page */
	caseStudyUrl?: string;
	
	/** Optional category classification for the project */
	category?: string;
	
	/** Optional publication date for case studies */
	publishedAt?: string;
	
	/** Optional author name for case studies */
	author?: string;
	
	/** Whether this project should be featured prominently */
	featured?: boolean;
	
	/** Optional metrics object for case studies */
	metrics?: {
		[key: string]: string;
	};
}

/**
 * Individual feature item that can be displayed in project showcases
 */
export interface FeatureItem {
	/** Unique identifier for the feature */
	id: string;
	
	/** Display title of the feature */
	title: string;
	
	/** Detailed description of the feature */
	description: string;
	
	/** Optional icon name or component identifier */
	icon?: string;
	
	/** Optional image URL for the feature */
	image?: string;
	
	/** Whether this feature is a key highlight */
	highlighted?: boolean;
	
	/** Optional category for grouping features */
	category?: string;
}

/**
 * Gallery image item for project showcases and case studies
 */
export interface GalleryImage {
	/** Unique identifier for the image */
	id: string;
	
	/** Image URL */
	src: string;
	
	/** Alt text for accessibility */
	alt: string;
	
	/** Optional caption for the image */
	caption?: string;
	
	/** Optional thumbnail URL for lazy loading */
	thumbnail?: string;
	
	/** Image dimensions for layout optimization */
	width?: number;
	height?: number;
	
	/** Whether this image should be featured prominently */
	featured?: boolean;
}

/**
 * External link associated with a project
 */
export interface ProjectLink {
	/** Unique identifier for the link */
	id: string;
	
	/** Display text for the link */
	label: string;
	
	/** Target URL */
	url: string;
	
	/** Type of link (e.g., 'demo', 'github', 'documentation') */
	type: 'demo' | 'github' | 'documentation' | 'case-study' | 'external' | 'other';
	
	/** Whether the link should open in a new tab */
	external?: boolean;
	
	/** Optional icon identifier for the link */
	icon?: string;
	
	/** Whether this is a primary call-to-action link */
	primary?: boolean;
}

/**
 * Extended project interface that includes all project-related data
 */
export interface Project extends ProjectMeta {
	/** Array of feature items for this project */
	features?: FeatureItem[];
	
	/** Array of gallery images for this project */
	gallery?: GalleryImage[];
	
	/** Array of related links for this project */
	links?: ProjectLink[];
	
	/** Optional detailed content for case studies */
	content?: string;
	
	/** Optional table of contents for case studies */
	tableOfContents?: Array<{
		id: string;
		title: string;
	}>;
	
	/** Optional SEO metadata */
	seo?: {
		title?: string;
		description?: string;
		keywords?: string[];
		ogImage?: string;
	};
}

/**
 * Project filter options for portfolio and case study listings
 */
export interface ProjectFilters {
	/** Filter by category */
	category?: string;
	
	/** Filter by tags */
	tags?: string[];
	
	/** Filter by featured status */
	featured?: boolean;
	
	/** Filter by publication date range */
	dateRange?: {
		start?: string;
		end?: string;
	};
	
	/** Search query for title and description */
	search?: string;
}

/**
 * Project sort options for listings
 */
export type ProjectSortOption = 
	| 'title-asc'
	| 'title-desc'
	| 'date-asc'
	| 'date-desc'
	| 'featured-first'
	| 'category-asc';

/**
 * Project listing configuration
 */
export interface ProjectListingConfig {
	/** Number of projects per page */
	pageSize?: number;
	
	/** Current page number */
	page?: number;
	
	/** Applied filters */
	filters?: ProjectFilters;
	
	/** Sort option */
	sort?: ProjectSortOption;
	
	/** Total count of projects matching filters */
	total?: number;
}

/**
 * Project listing result
 */
export interface ProjectListingResult {
	/** Array of projects matching the criteria */
	projects: Project[];
	
	/** Listing configuration */
	config: ProjectListingConfig;
	
	/** Whether there are more pages available */
	hasMore: boolean;
}
