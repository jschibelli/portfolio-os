export interface PersonStructuredData {
	name: string;
	description: string;
	url: string;
	image?: string;
	sameAs?: string[];
	jobTitle?: string;
	worksFor?: {
		name: string;
		url: string;
	};
}

export interface ArticleStructuredData {
	headline: string;
	description: string;
	author: PersonStructuredData;
	publisher: {
		name: string;
		url: string;
		logo?: string;
	};
	datePublished: string;
	dateModified?: string;
	image?: string;
	url: string;
	mainEntityOfPage?: string;
	articleSection?: string;
	keywords?: string[];
}

export interface ServiceStructuredData {
	name: string;
	description: string;
	provider: PersonStructuredData;
	url: string;
	image?: string;
	areaServed?: string[];
	serviceType?: string;
}

export interface OrganizationStructuredData {
	name: string;
	description: string;
	url: string;
	logo?: string;
	sameAs?: string[];
	contactPoint?: {
		telephone: string;
		contactType: string;
		email?: string;
	};
	address?: {
		streetAddress: string;
		addressLocality: string;
		addressRegion: string;
		postalCode: string;
		addressCountry: string;
	};
}

export function generatePersonStructuredData(data: PersonStructuredData) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: data.name,
		description: data.description,
		url: data.url,
		...(data.image && { image: data.image }),
		...(data.sameAs && { sameAs: data.sameAs }),
		...(data.jobTitle && { jobTitle: data.jobTitle }),
		...(data.worksFor && {
			worksFor: {
				'@type': 'Organization',
				name: data.worksFor.name,
				url: data.worksFor.url,
			},
		}),
	};
}

export function generateArticleStructuredData(data: ArticleStructuredData) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: data.headline,
		description: data.description,
		author: generatePersonStructuredData(data.author),
		publisher: {
			'@type': 'Organization',
			name: data.publisher.name,
			url: data.publisher.url,
			...(data.publisher.logo && { logo: data.publisher.logo }),
		},
		datePublished: data.datePublished,
		...(data.dateModified && { dateModified: data.dateModified }),
		...(data.image && { image: data.image }),
		url: data.url,
		...(data.mainEntityOfPage && { mainEntityOfPage: data.mainEntityOfPage }),
		...(data.articleSection && { articleSection: data.articleSection }),
		...(data.keywords && { keywords: data.keywords.join(', ') }),
	};
}

export function generateServiceStructuredData(data: ServiceStructuredData) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Service',
		name: data.name,
		description: data.description,
		provider: generatePersonStructuredData(data.provider),
		url: data.url,
		...(data.image && { image: data.image }),
		...(data.areaServed && { areaServed: data.areaServed }),
		...(data.serviceType && { serviceType: data.serviceType }),
	};
}

export function generateOrganizationStructuredData(data: OrganizationStructuredData) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: data.name,
		description: data.description,
		url: data.url,
		...(data.logo && { logo: data.logo }),
		...(data.sameAs && { sameAs: data.sameAs }),
		...(data.contactPoint && {
			contactPoint: {
				'@type': 'ContactPoint',
				telephone: data.contactPoint.telephone,
				contactType: data.contactPoint.contactType,
				...(data.contactPoint.email && { email: data.contactPoint.email }),
			},
		}),
		...(data.address && {
			address: {
				'@type': 'PostalAddress',
				streetAddress: data.address.streetAddress,
				addressLocality: data.address.addressLocality,
				addressRegion: data.address.addressRegion,
				postalCode: data.address.postalCode,
				addressCountry: data.address.addressCountry,
			},
		}),
	};
}

export function generateWebSiteStructuredData() {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: 'John Schibelli - Senior Front-End Developer',
		description: 'Senior Front-End Developer with 15+ years of experience building scalable, high-performance web applications.',
		url: 'https://johnschibelli.com',
		author: generatePersonStructuredData({
			name: 'John Schibelli',
			description: 'Senior Front-End Developer with expertise in React, Next.js, TypeScript, and modern web technologies.',
			url: 'https://johnschibelli.com',
			jobTitle: 'Senior Front-End Developer',
			sameAs: [
				'https://linkedin.com/in/johnschibelli',
				'https://github.com/johnschibelli',
				'https://twitter.com/johnschibelli',
			],
		}),
		publisher: generateOrganizationStructuredData({
			name: 'John Schibelli',
			description: 'Professional web development and consulting services',
			url: 'https://johnschibelli.com',
			contactPoint: {
				telephone: '+1-555-0123',
				contactType: 'customer service',
				email: 'john@johnschibelli.com',
			},
		}),
	};
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: item.url,
		})),
	};
}

export interface CreativeWorkStructuredData {
	name: string;
	description: string;
	url: string;
	image?: string;
	author: PersonStructuredData;
	publisher: {
		name: string;
		url: string;
	};
	keywords?: string[];
	dateCreated?: string;
	dateModified?: string;
}

export interface SoftwareApplicationStructuredData {
	name: string;
	description: string;
	url: string;
	image?: string;
	applicationCategory: string;
	operatingSystem: string;
	offers: {
		price: string;
		priceCurrency: string;
	};
	author: PersonStructuredData;
	publisher: {
		name: string;
		url: string;
	};
	keywords?: string[];
	dateCreated?: string;
	dateModified?: string;
}

/**
 * Generates structured data for a CreativeWork entity following schema.org standards
 * @param data - CreativeWork data object containing required and optional fields
 * @returns Structured data object for JSON-LD implementation
 * @throws Error if required fields are missing or invalid
 */
export function generateCreativeWorkStructuredData(data: CreativeWorkStructuredData) {
	// Input validation for required fields
	if (!data || typeof data !== 'object') {
		throw new Error('CreativeWork data is required and must be an object');
	}
	
	if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
		throw new Error('CreativeWork name is required and must be a non-empty string');
	}
	
	if (!data.description || typeof data.description !== 'string' || data.description.trim() === '') {
		throw new Error('CreativeWork description is required and must be a non-empty string');
	}
	
	if (!data.url || typeof data.url !== 'string' || data.url.trim() === '') {
		throw new Error('CreativeWork URL is required and must be a non-empty string');
	}
	
	if (!data.author || typeof data.author !== 'object') {
		throw new Error('CreativeWork author is required and must be an object');
	}
	
	if (!data.publisher || !data.publisher.name || !data.publisher.url) {
		throw new Error('CreativeWork publisher with name and URL is required');
	}

	try {
		return {
			'@context': 'https://schema.org',
			'@type': 'CreativeWork',
			name: data.name.trim(),
			description: data.description.trim(),
			url: data.url.trim(),
			...(data.image && { image: data.image.trim() }),
			author: generatePersonStructuredData(data.author),
			publisher: {
				'@type': 'Organization',
				name: data.publisher.name.trim(),
				url: data.publisher.url.trim(),
			},
			...(data.keywords && Array.isArray(data.keywords) && data.keywords.length > 0 && { 
				keywords: data.keywords.filter(k => typeof k === 'string' && k.trim() !== '').join(', ') 
			}),
			...(data.dateCreated && { dateCreated: data.dateCreated }),
			...(data.dateModified && { dateModified: data.dateModified }),
		};
	} catch (error) {
		console.error('Error generating creative work structured data:', error);
		throw new Error(`Failed to generate creative work structured data: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

/**
 * Generates structured data for a SoftwareApplication entity following schema.org standards
 * @param data - SoftwareApplication data object containing required and optional fields
 * @returns Structured data object for JSON-LD implementation
 * @throws Error if required fields are missing or invalid
 */
export function generateSoftwareApplicationStructuredData(data: SoftwareApplicationStructuredData) {
	// Input validation for required fields
	if (!data || typeof data !== 'object') {
		throw new Error('SoftwareApplication data is required and must be an object');
	}
	
	if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
		throw new Error('SoftwareApplication name is required and must be a non-empty string');
	}
	
	if (!data.description || typeof data.description !== 'string' || data.description.trim() === '') {
		throw new Error('SoftwareApplication description is required and must be a non-empty string');
	}
	
	if (!data.url || typeof data.url !== 'string' || data.url.trim() === '') {
		throw new Error('SoftwareApplication URL is required and must be a non-empty string');
	}
	
	if (!data.applicationCategory || typeof data.applicationCategory !== 'string' || data.applicationCategory.trim() === '') {
		throw new Error('SoftwareApplication applicationCategory is required and must be a non-empty string');
	}
	
	if (!data.operatingSystem || typeof data.operatingSystem !== 'string' || data.operatingSystem.trim() === '') {
		throw new Error('SoftwareApplication operatingSystem is required and must be a non-empty string');
	}
	
	if (!data.offers || !data.offers.price || !data.offers.priceCurrency) {
		throw new Error('SoftwareApplication offers with price and priceCurrency is required');
	}
	
	if (!data.author || typeof data.author !== 'object') {
		throw new Error('SoftwareApplication author is required and must be an object');
	}
	
	if (!data.publisher || !data.publisher.name || !data.publisher.url) {
		throw new Error('SoftwareApplication publisher with name and URL is required');
	}

	try {
		return {
			'@context': 'https://schema.org',
			'@type': 'SoftwareApplication',
			name: data.name.trim(),
			description: data.description.trim(),
			url: data.url.trim(),
			...(data.image && { image: data.image.trim() }),
			applicationCategory: data.applicationCategory.trim(),
			operatingSystem: data.operatingSystem.trim(),
			offers: {
				'@type': 'Offer',
				price: data.offers.price.trim(),
				priceCurrency: data.offers.priceCurrency.trim(),
			},
			author: generatePersonStructuredData(data.author),
			publisher: {
				'@type': 'Organization',
				name: data.publisher.name.trim(),
				url: data.publisher.url.trim(),
			},
			...(data.keywords && Array.isArray(data.keywords) && data.keywords.length > 0 && { 
				keywords: data.keywords.filter(k => typeof k === 'string' && k.trim() !== '').join(', ') 
			}),
			...(data.dateCreated && { dateCreated: data.dateCreated }),
			...(data.dateModified && { dateModified: data.dateModified }),
		};
	} catch (error) {
		console.error('Error generating software application structured data:', error);
		throw new Error(`Failed to generate software application structured data: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}
 
 