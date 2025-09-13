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
	knowsAbout?: string[];
	alumniOf?: {
		name: string;
		url?: string;
	}[];
	hasCredential?: {
		name: string;
		credentialCategory: string;
		recognizedBy?: {
			name: string;
		};
	}[];
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

/**
 * Generates structured data for a Person entity following schema.org standards
 * @param data - Person data object containing required and optional fields
 * @returns Structured data object for JSON-LD implementation
 * @throws Error if required fields are missing or invalid
 */
export function generatePersonStructuredData(data: PersonStructuredData) {
	// Input validation for required fields
	if (!data || typeof data !== 'object') {
		throw new Error('Person data is required and must be an object');
	}
	
	if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
		throw new Error('Person name is required and must be a non-empty string');
	}
	
	if (!data.description || typeof data.description !== 'string' || data.description.trim() === '') {
		throw new Error('Person description is required and must be a non-empty string');
	}
	
	if (!data.url || typeof data.url !== 'string' || data.url.trim() === '') {
		throw new Error('Person URL is required and must be a non-empty string');
	}

	try {
		// Build the structured data object with proper null checks
		const structuredData: Record<string, any> = {
			'@context': 'https://schema.org',
			'@type': 'Person',
			name: data.name.trim(),
			description: data.description.trim(),
			url: data.url.trim(),
		};

		// Add optional fields only if they exist and are valid
		if (data.image && typeof data.image === 'string' && data.image.trim() !== '') {
			structuredData.image = data.image.trim();
		}

		if (data.sameAs && Array.isArray(data.sameAs) && data.sameAs.length > 0) {
			structuredData.sameAs = data.sameAs.filter(url => 
				typeof url === 'string' && url.trim() !== ''
			).map(url => url.trim());
		}

		if (data.jobTitle && typeof data.jobTitle === 'string' && data.jobTitle.trim() !== '') {
			structuredData.jobTitle = data.jobTitle.trim();
		}

		if (data.worksFor && data.worksFor.name && data.worksFor.url) {
			structuredData.worksFor = {
				'@type': 'Organization',
				name: data.worksFor.name.trim(),
				url: data.worksFor.url.trim(),
			};
		}

		if (data.knowsAbout && Array.isArray(data.knowsAbout) && data.knowsAbout.length > 0) {
			structuredData.knowsAbout = data.knowsAbout.filter(skill => 
				typeof skill === 'string' && skill.trim() !== ''
			).map(skill => skill.trim());
		}

		if (data.alumniOf && Array.isArray(data.alumniOf) && data.alumniOf.length > 0) {
			structuredData.alumniOf = data.alumniOf
				.filter(education => education && education.name && typeof education.name === 'string')
				.map(education => {
					const org: Record<string, any> = {
						'@type': 'EducationalOrganization',
						name: education.name.trim(),
					};
					if (education.url && typeof education.url === 'string' && education.url.trim() !== '') {
						org.url = education.url.trim();
					}
					return org;
				});
		}

		if (data.hasCredential && Array.isArray(data.hasCredential) && data.hasCredential.length > 0) {
			structuredData.hasCredential = data.hasCredential
				.filter(credential => 
					credential && 
					credential.name && 
					credential.credentialCategory &&
					typeof credential.name === 'string' &&
					typeof credential.credentialCategory === 'string'
				)
				.map(credential => {
					const cred: Record<string, any> = {
						'@type': 'EducationalOccupationalCredential',
						name: credential.name.trim(),
						credentialCategory: credential.credentialCategory.trim(),
					};
					if (credential.recognizedBy && credential.recognizedBy.name && typeof credential.recognizedBy.name === 'string') {
						cred.recognizedBy = {
							'@type': 'Organization',
							name: credential.recognizedBy.name.trim(),
						};
					}
					return cred;
				});
		}

		return structuredData;
	} catch (error) {
		console.error('Error generating person structured data:', error);
		throw new Error(`Failed to generate person structured data: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

/**
 * Generates structured data for an Article entity following schema.org standards
 * @param data - Article data object containing required and optional fields
 * @returns Structured data object for JSON-LD implementation
 * @throws Error if required fields are missing or invalid
 */
export function generateArticleStructuredData(data: ArticleStructuredData) {
	// Input validation for required fields
	if (!data || typeof data !== 'object') {
		throw new Error('Article data is required and must be an object');
	}
	
	if (!data.headline || typeof data.headline !== 'string' || data.headline.trim() === '') {
		throw new Error('Article headline is required and must be a non-empty string');
	}
	
	if (!data.description || typeof data.description !== 'string' || data.description.trim() === '') {
		throw new Error('Article description is required and must be a non-empty string');
	}
	
	if (!data.author || typeof data.author !== 'object') {
		throw new Error('Article author is required and must be an object');
	}
	
	if (!data.publisher || !data.publisher.name || !data.publisher.url) {
		throw new Error('Article publisher with name and URL is required');
	}
	
	if (!data.datePublished || typeof data.datePublished !== 'string' || data.datePublished.trim() === '') {
		throw new Error('Article datePublished is required and must be a non-empty string');
	}
	
	if (!data.url || typeof data.url !== 'string' || data.url.trim() === '') {
		throw new Error('Article URL is required and must be a non-empty string');
	}

	try {
		// Build the structured data object with proper validation
		const structuredData: Record<string, any> = {
			'@context': 'https://schema.org',
			'@type': 'Article',
			headline: data.headline.trim(),
			description: data.description.trim(),
			author: generatePersonStructuredData(data.author),
			publisher: {
				'@type': 'Organization',
				name: data.publisher.name.trim(),
				url: data.publisher.url.trim(),
			},
			datePublished: data.datePublished.trim(),
			url: data.url.trim(),
		};

		// Add optional fields only if they exist and are valid
		if (data.publisher.logo && typeof data.publisher.logo === 'string' && data.publisher.logo.trim() !== '') {
			structuredData.publisher.logo = data.publisher.logo.trim();
		}

		if (data.dateModified && typeof data.dateModified === 'string' && data.dateModified.trim() !== '') {
			structuredData.dateModified = data.dateModified.trim();
		}

		if (data.image && typeof data.image === 'string' && data.image.trim() !== '') {
			structuredData.image = data.image.trim();
		}

		if (data.mainEntityOfPage && typeof data.mainEntityOfPage === 'string' && data.mainEntityOfPage.trim() !== '') {
			structuredData.mainEntityOfPage = data.mainEntityOfPage.trim();
		}

		if (data.articleSection && typeof data.articleSection === 'string' && data.articleSection.trim() !== '') {
			structuredData.articleSection = data.articleSection.trim();
		}

		if (data.keywords && Array.isArray(data.keywords) && data.keywords.length > 0) {
			const validKeywords = data.keywords
				.filter(keyword => typeof keyword === 'string' && keyword.trim() !== '')
				.map(keyword => keyword.trim());
			if (validKeywords.length > 0) {
				structuredData.keywords = validKeywords.join(', ');
			}
		}

		return structuredData;
	} catch (error) {
		console.error('Error generating article structured data:', error);
		throw new Error(`Failed to generate article structured data: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

/**
 * Generates structured data for a Service entity following schema.org standards
 * @param data - Service data object containing required and optional fields
 * @returns Structured data object for JSON-LD implementation
 * @throws Error if required fields are missing or invalid
 */
export function generateServiceStructuredData(data: ServiceStructuredData) {
	// Input validation for required fields
	if (!data || typeof data !== 'object') {
		throw new Error('Service data is required and must be an object');
	}
	
	if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
		throw new Error('Service name is required and must be a non-empty string');
	}
	
	if (!data.description || typeof data.description !== 'string' || data.description.trim() === '') {
		throw new Error('Service description is required and must be a non-empty string');
	}
	
	if (!data.provider || typeof data.provider !== 'object') {
		throw new Error('Service provider is required and must be an object');
	}
	
	if (!data.url || typeof data.url !== 'string' || data.url.trim() === '') {
		throw new Error('Service URL is required and must be a non-empty string');
	}

	try {
		// Build the structured data object with proper validation
		const structuredData: Record<string, any> = {
			'@context': 'https://schema.org',
			'@type': 'Service',
			name: data.name.trim(),
			description: data.description.trim(),
			provider: generatePersonStructuredData(data.provider),
			url: data.url.trim(),
		};

		// Add optional fields only if they exist and are valid
		if (data.image && typeof data.image === 'string' && data.image.trim() !== '') {
			structuredData.image = data.image.trim();
		}

		if (data.areaServed && Array.isArray(data.areaServed) && data.areaServed.length > 0) {
			structuredData.areaServed = data.areaServed.filter(area => 
				typeof area === 'string' && area.trim() !== ''
			).map(area => area.trim());
		}

		if (data.serviceType && typeof data.serviceType === 'string' && data.serviceType.trim() !== '') {
			structuredData.serviceType = data.serviceType.trim();
		}

		return structuredData;
	} catch (error) {
		console.error('Error generating service structured data:', error);
		throw new Error(`Failed to generate service structured data: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

/**
 * Generates structured data for an Organization entity following schema.org standards
 * @param data - Organization data object containing required and optional fields
 * @returns Structured data object for JSON-LD implementation
 * @throws Error if required fields are missing or invalid
 */
export function generateOrganizationStructuredData(data: OrganizationStructuredData) {
	// Input validation for required fields
	if (!data || typeof data !== 'object') {
		throw new Error('Organization data is required and must be an object');
	}
	
	if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
		throw new Error('Organization name is required and must be a non-empty string');
	}
	
	if (!data.description || typeof data.description !== 'string' || data.description.trim() === '') {
		throw new Error('Organization description is required and must be a non-empty string');
	}
	
	if (!data.url || typeof data.url !== 'string' || data.url.trim() === '') {
		throw new Error('Organization URL is required and must be a non-empty string');
	}

	try {
		// Build the structured data object with proper validation
		const structuredData: Record<string, any> = {
			'@context': 'https://schema.org',
			'@type': 'Organization',
			name: data.name.trim(),
			description: data.description.trim(),
			url: data.url.trim(),
		};

		// Add optional fields only if they exist and are valid
		if (data.logo && typeof data.logo === 'string' && data.logo.trim() !== '') {
			structuredData.logo = data.logo.trim();
		}

		if (data.sameAs && Array.isArray(data.sameAs) && data.sameAs.length > 0) {
			structuredData.sameAs = data.sameAs.filter(url => 
				typeof url === 'string' && url.trim() !== ''
			).map(url => url.trim());
		}

		if (data.contactPoint && data.contactPoint.telephone && data.contactPoint.contactType) {
			const contactPoint: Record<string, any> = {
				'@type': 'ContactPoint',
				telephone: data.contactPoint.telephone.trim(),
				contactType: data.contactPoint.contactType.trim(),
			};
			if (data.contactPoint.email && typeof data.contactPoint.email === 'string' && data.contactPoint.email.trim() !== '') {
				contactPoint.email = data.contactPoint.email.trim();
			}
			structuredData.contactPoint = contactPoint;
		}

		if (data.address && 
			data.address.streetAddress && 
			data.address.addressLocality && 
			data.address.addressRegion && 
			data.address.postalCode && 
			data.address.addressCountry) {
			structuredData.address = {
				'@type': 'PostalAddress',
				streetAddress: data.address.streetAddress.trim(),
				addressLocality: data.address.addressLocality.trim(),
				addressRegion: data.address.addressRegion.trim(),
				postalCode: data.address.postalCode.trim(),
				addressCountry: data.address.addressCountry.trim(),
			};
		}

		return structuredData;
	} catch (error) {
		console.error('Error generating organization structured data:', error);
		throw new Error(`Failed to generate organization structured data: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
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
			knowsAbout: [
				'JavaScript (ES6+)',
				'TypeScript',
				'React',
				'Next.js',
				'Node.js',
				'HTML5',
				'CSS3',
				'Tailwind CSS',
				'GraphQL',
				'REST APIs',
				'Web Accessibility',
				'SEO Optimization',
				'Performance Optimization',
				'UI/UX Design',
				'Testing',
				'DevOps',
				'Cloud Computing',
			],
			alumniOf: [
				{
					name: 'The Chubb Institute',
				},
			],
			hasCredential: [
				{
					name: '15+ Years Experience',
					credentialCategory: 'Work Experience',
					recognizedBy: {
						name: 'Web Development Industry',
					},
				},
			],
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

/**
 * Generates structured data for a BreadcrumbList entity following schema.org standards
 * @param items - Array of breadcrumb items with name and url properties
 * @returns Structured data object for JSON-LD implementation
 * @throws Error if items array is invalid or empty
 */
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
	// Input validation
	if (!Array.isArray(items)) {
		throw new Error('Breadcrumb items must be an array');
	}
	
	if (items.length === 0) {
		throw new Error('Breadcrumb items array cannot be empty');
	}

	try {
		// Validate and filter items
		const validItems = items.filter((item, index) => {
			if (!item || typeof item !== 'object') {
				console.warn(`Breadcrumb item at index ${index} is not a valid object`);
				return false;
			}
			if (!item.name || typeof item.name !== 'string' || item.name.trim() === '') {
				console.warn(`Breadcrumb item at index ${index} has invalid name`);
				return false;
			}
			if (!item.url || typeof item.url !== 'string' || item.url.trim() === '') {
				console.warn(`Breadcrumb item at index ${index} has invalid URL`);
				return false;
			}
			return true;
		});

		if (validItems.length === 0) {
			throw new Error('No valid breadcrumb items found');
		}

		return {
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: validItems.map((item, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				name: item.name.trim(),
				item: item.url.trim(),
			})),
		};
	} catch (error) {
		console.error('Error generating breadcrumb structured data:', error);
		throw new Error(`Failed to generate breadcrumb structured data: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
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
