// Re-export from test-helpers for convenience
export { PERFORMANCE_THRESHOLDS } from '../utils/test-helpers'

// =============================================================================
// PAGE ROUTES & URLs
// =============================================================================

export const CRITICAL_PAGES = [
	{ url: '/', name: 'Homepage' },
	{ url: '/about', name: 'About' },
	{ url: '/blog', name: 'Blog' },
	{ url: '/contact', name: 'Contact' },
	{ url: '/projects', name: 'Projects' },
]

export const PROTECTED_ROUTES = [
	'/dashboard',
	'/admin',
	'/settings',
]

export const PUBLIC_ROUTES = [
	'/',
	'/about',
	'/blog',
	'/contact',
	'/projects',
	'/case-studies',
]

// =============================================================================
// ACCESSIBILITY CONFIG
// =============================================================================

export const ACCESSIBILITY_CONFIG = {
	COLOR_CONTRAST_RULES: ['color-contrast'],
	FORM_RULES: ['label', 'aria-valid-attr', 'aria-valid-attr-value'],
	IMAGE_RULES: ['image-alt'],
	HEADING_RULES: ['heading-order'],
	KEYBOARD_NAV_RULES: ['focus-order-semantics', 'tabindex'],
	ARIA_RULES: ['aria-roles', 'aria-allowed-attr'],
}

// =============================================================================
// USER TEST DATA
// =============================================================================

export const TEST_USERS = {
	authenticated: {
		id: 'test-user-authenticated',
		email: 'authenticated@test.com',
		name: 'Authenticated User',
		role: 'user',
	},
	admin: {
		id: 'test-admin-123',
		email: 'admin@test.com',
		name: 'Admin User',
		role: 'admin',
	},
	guest: {
		id: 'test-guest-456',
		email: 'guest@test.com',
		name: 'Guest User',
		role: 'guest',
	},
}

// =============================================================================
// FORM TEST DATA
// =============================================================================

export const FORM_TEST_DATA = {
	validContact: {
		name: 'John Doe',
		email: 'john.doe@example.com',
		message: 'This is a valid test message with sufficient length.',
		subject: 'Test Subject',
	},
	invalidContact: {
		name: '',
		email: 'invalid-email',
		message: 'Too short',
		subject: '',
	},
	validNewsletter: {
		email: 'subscriber@example.com',
	},
	invalidNewsletter: {
		email: 'not-an-email',
	},
	validBooking: {
		name: 'Jane Smith',
		email: 'jane.smith@example.com',
		date: '2025-10-15',
		time: '10:00',
		duration: '30',
		notes: 'Looking forward to our meeting',
	},
	invalidBooking: {
		name: '',
		email: 'invalid',
		date: 'not-a-date',
		time: '',
		duration: 'invalid',
		notes: '',
	},
}

// =============================================================================
// PROJECT TEST DATA
// =============================================================================

export const MOCK_PROJECTS = [
	{
		id: 'project-1',
		title: 'E-Commerce Platform',
		description: 'A full-stack e-commerce solution built with Next.js and Stripe',
		tags: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL'],
		image: '/images/projects/ecommerce.jpg',
		url: '/projects/ecommerce-platform',
		github: 'https://github.com/test/ecommerce',
		liveUrl: 'https://ecommerce.example.com',
		featured: true,
	},
	{
		id: 'project-2',
		title: 'Task Management App',
		description: 'A collaborative task management application with real-time updates',
		tags: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
		image: '/images/projects/task-app.jpg',
		url: '/projects/task-management',
		github: 'https://github.com/test/task-app',
		liveUrl: 'https://tasks.example.com',
		featured: true,
	},
	{
		id: 'project-3',
		title: 'Analytics Dashboard',
		description: 'Real-time analytics dashboard for monitoring web application metrics',
		tags: ['Vue.js', 'Express', 'InfluxDB', 'Grafana'],
		image: '/images/projects/analytics.jpg',
		url: '/projects/analytics-dashboard',
		github: 'https://github.com/test/analytics',
		liveUrl: 'https://analytics.example.com',
		featured: false,
	},
]

// =============================================================================
// BLOG POST TEST DATA
// =============================================================================

export const MOCK_BLOG_POSTS = [
	{
		id: 'post-1',
		title: 'Getting Started with Next.js 14',
		slug: 'getting-started-nextjs-14',
		excerpt: 'Learn the fundamentals of Next.js 14 and its new features',
		content: 'Full blog post content goes here...',
		author: 'John Schibelli',
		publishedAt: '2025-10-01T00:00:00Z',
		tags: ['Next.js', 'React', 'Web Development'],
		coverImage: '/images/blog/nextjs-14.jpg',
		readTime: 8,
	},
	{
		id: 'post-2',
		title: 'TypeScript Best Practices',
		slug: 'typescript-best-practices',
		excerpt: 'Essential TypeScript patterns for building robust applications',
		content: 'Full blog post content goes here...',
		author: 'John Schibelli',
		publishedAt: '2025-09-28T00:00:00Z',
		tags: ['TypeScript', 'JavaScript', 'Best Practices'],
		coverImage: '/images/blog/typescript.jpg',
		readTime: 12,
	},
	{
		id: 'post-3',
		title: 'Building Accessible Web Applications',
		slug: 'building-accessible-web-apps',
		excerpt: 'A comprehensive guide to web accessibility standards and implementation',
		content: 'Full blog post content goes here...',
		author: 'John Schibelli',
		publishedAt: '2025-09-20T00:00:00Z',
		tags: ['Accessibility', 'WCAG', 'Web Development'],
		coverImage: '/images/blog/accessibility.jpg',
		readTime: 15,
	},
]

// =============================================================================
// CASE STUDY TEST DATA
// =============================================================================

export const MOCK_CASE_STUDIES = [
	{
		id: 'case-study-1',
		title: 'Redesigning the User Experience for FinTech Startup',
		slug: 'fintech-startup-ux-redesign',
		client: 'FinTech Innovations',
		industry: 'Financial Technology',
		overview: 'Complete UX overhaul that increased user engagement by 45%',
		challenge: 'Low user retention and confusing navigation',
		solution: 'User research, wireframing, and iterative design',
		results: [
			'45% increase in user engagement',
			'60% reduction in support tickets',
			'4.8/5 user satisfaction rating',
		],
		technologies: ['Figma', 'React', 'TypeScript', 'Next.js'],
		images: ['/images/case-studies/fintech-1.jpg'],
		testimonial: {
			quote: 'The redesign transformed our platform',
			author: 'CEO, FinTech Innovations',
		},
	},
]

// =============================================================================
// API MOCK RESPONSES
// =============================================================================

export const MOCK_API_RESPONSES = {
	newsletter: {
		success: {
			success: true,
			message: 'Successfully subscribed to newsletter',
		},
		error: {
			success: false,
			error: 'Email already subscribed',
		},
		validationError: {
			success: false,
			error: 'Invalid email address',
		},
	},
	contact: {
		success: {
			success: true,
			message: 'Message sent successfully',
			id: 'msg-123',
		},
		error: {
			success: false,
			error: 'Failed to send message',
		},
		rateLimitError: {
			success: false,
			error: 'Too many requests. Please try again later.',
		},
	},
	booking: {
		availableSlots: {
			slots: [
				'2025-10-15T10:00:00Z',
				'2025-10-15T14:00:00Z',
				'2025-10-16T09:00:00Z',
				'2025-10-16T11:00:00Z',
				'2025-10-17T13:00:00Z',
			],
		},
		createSuccess: {
			success: true,
			bookingId: 'booking-123',
			confirmationEmail: 'sent',
			calendarInvite: 'sent',
		},
		createError: {
			success: false,
			error: 'Slot no longer available',
		},
	},
	auth: {
		loginSuccess: {
			success: true,
			user: TEST_USERS.authenticated,
			token: 'mock-jwt-token',
		},
		loginError: {
			success: false,
			error: 'Invalid credentials',
		},
		sessionValid: {
			valid: true,
			user: TEST_USERS.authenticated,
		},
		sessionInvalid: {
			valid: false,
			error: 'Session expired',
		},
	},
}

// =============================================================================
// ERROR SCENARIOS
// =============================================================================

export const ERROR_SCENARIOS = {
	network: {
		offline: 'Network connection lost',
		timeout: 'Request timed out',
		serverError: 'Internal server error (500)',
	},
	validation: {
		email: 'Please enter a valid email address',
		required: 'This field is required',
		minLength: 'Must be at least {min} characters',
		maxLength: 'Must be no more than {max} characters',
	},
	auth: {
		unauthorized: 'You must be logged in to access this page',
		forbidden: 'You do not have permission to access this resource',
		sessionExpired: 'Your session has expired. Please log in again.',
	},
}

// =============================================================================
// VIEWPORT CONFIGURATIONS
// =============================================================================

export const VIEWPORTS = {
	mobile: { width: 375, height: 667 },      // iPhone SE
	mobileLarge: { width: 414, height: 896 }, // iPhone 11 Pro Max
	tablet: { width: 768, height: 1024 },     // iPad
	tabletLandscape: { width: 1024, height: 768 }, // iPad Landscape
	desktop: { width: 1280, height: 720 },    // Small Desktop
	desktopLarge: { width: 1920, height: 1080 }, // Full HD
	desktopXL: { width: 2560, height: 1440 }, // 2K
}

// =============================================================================
// INTERACTION TIMEOUTS
// =============================================================================

export const TIMEOUTS = {
	animation: 600,
	apiCall: 5000,
	pageLoad: 30000,
	shortDelay: 100,
	mediumDelay: 500,
	longDelay: 1000,
}

// =============================================================================
// SEO TEST DATA
// =============================================================================

export const SEO_TEST_DATA = {
	homepage: {
		title: 'John Schibelli - Full Stack Developer & UX Designer',
		description: 'Portfolio and blog of John Schibelli, showcasing web development projects and technical articles',
		keywords: ['web development', 'full stack', 'next.js', 'react', 'typescript'],
		ogImage: '/images/og/homepage.jpg',
	},
	blog: {
		title: 'Blog - John Schibelli',
		description: 'Technical articles and insights on web development, design, and technology',
		keywords: ['blog', 'web development', 'tutorials', 'programming'],
		ogImage: '/images/og/blog.jpg',
	},
}


