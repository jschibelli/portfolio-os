/**
 * Centralized configuration constants
 * 
 * This file centralizes all URLs, email addresses, and other configuration
 * values to ensure consistency across the application and make future
 * updates easier to manage.
 */

export const SITE_CONFIG = {
	// Primary site URLs
	DOMAIN: 'johnschibelli.dev',
	BASE_URL: 'https://johnschibelli.dev',
	
	// Email addresses
	EMAIL: {
		PRIMARY: 'john@johnschibelli.dev',
		CONTACT: 'john@johnschibelli.dev',
		BOOKING: 'john@johnschibelli.dev',
	},
	
	// Social media URLs
	SOCIAL: {
		LINKEDIN: 'https://linkedin.com/in/johnschibelli',
		GITHUB: 'https://github.com/jschibelli',
		TWITTER: 'https://twitter.com/johnschibelli',
	},
	
	// Personal information
	PERSONAL: {
		NAME: 'John Schibelli',
		TITLE: 'Senior Front-End Developer',
		LOCATION: 'Towaco, NJ',
		PHONE: '862.207.9004',
	},
	
	// SEO and structured data
	SEO: {
		DESCRIPTION: 'Senior Front-End Developer with 15+ years of experience building scalable, high-performance web applications.',
		KEYWORDS: [
			'John Schibelli',
			'Front-End Developer',
			'React Developer',
			'Next.js Developer',
			'TypeScript Developer',
			'Web Development',
			'UI/UX Design',
			'JavaScript',
			'React',
			'Next.js',
			'TypeScript',
			'Tailwind CSS',
			'Web Accessibility',
			'SEO',
			'Performance',
			'Mobile Development',
			'Cloud Solutions',
			'Consulting',
		],
	},
} as const;

// Domain constants for consistency
export const DOMAIN = SITE_CONFIG.DOMAIN;
export const BASE_URL = SITE_CONFIG.BASE_URL;

// Environment-based configuration
export const getSiteUrl = () => {
	return process.env.NEXT_PUBLIC_SITE_URL || SITE_CONFIG.BASE_URL;
};

export const getEmailAddress = (type: keyof typeof SITE_CONFIG.EMAIL = 'PRIMARY') => {
	return SITE_CONFIG.EMAIL[type];
};

// URL construction utilities
export const getFullUrl = (path: string = '') => {
	const baseUrl = getSiteUrl();
	return path.startsWith('/') ? `${baseUrl}${path}` : `${baseUrl}/${path}`;
};

export const getDomainUrl = (subdomain?: string) => {
	const domain = SITE_CONFIG.DOMAIN;
	return subdomain ? `https://${subdomain}.${domain}` : `https://${domain}`;
};
