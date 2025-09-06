import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import resumeData from '../../data/resume.json';
import { CHAT_TOOLS, executeTool } from './chat/tools';

// Enhanced fallback articles with better categorization
const fallbackArticles = [
	{
		title: 'Building Scalable React Applications with TypeScript',
		content:
			'Learn how to structure large React applications using TypeScript, proper state management, and performance optimization techniques. This article covers advanced patterns for building maintainable React codebases.',
		category: 'React & TypeScript',
		updated: '2024-01-15',
		url: 'https://example.com/fallback-1',
	},
	{
		title: 'The Future of AI-Driven Development',
		content:
			"Exploring how AI tools are transforming the development workflow and what this means for developers in 2024. We'll look at practical applications and future trends in AI-assisted coding.",
		category: 'AI & Development',
		updated: '2024-01-10',
		url: 'https://example.com/fallback-2',
	},
	{
		title: 'Optimizing Next.js Performance for Production',
		content:
			'Deep dive into Next.js performance optimization strategies, from image optimization to bundle analysis. Learn techniques to make your Next.js applications lightning fast.',
		category: 'Next.js & Performance',
		updated: '2024-01-05',
		url: 'https://example.com/fallback-3',
	},
];

// Response templates for common questions
const responseTemplates = {
	contact: {
		title: 'Contact Information',
		content: "Here's how you can reach John:",
		actions: [
			{ label: 'Email', url: 'mailto:jschibelli@gmail.com', icon: '📧' },
			{ label: 'LinkedIn', url: 'https://linkedin.com/in/johnschibelli', icon: '💼' },
			{ label: 'GitHub', url: 'https://github.com/jschibelli', icon: '🐙' },
			{ label: 'Website', url: 'https://johnschibelli.dev', icon: '🌐' },
		],
	},
	skills: {
		title: 'Technical Skills',
		content: 'John specializes in modern front-end development with expertise in:',
		categories: [
			'Frontend: React, Next.js, TypeScript, Tailwind CSS',
			'Backend: Node.js, WordPress, Shopify',
			'Tools: Git, Playwright, Veeva CRM',
			'AI: OpenAI integrations, AI-driven development',
		],
	},
	experience: {
		title: 'Professional Experience',
		content: 'John has 15+ years of experience in web development:',
		highlights: [
			'Senior Front-End Developer at IntraWeb Technology (2020-Present)',
			'Full-Stack Developer at ColorStreet (2024)',
			'Senior Front-End Developer at Executive Five Star (2016-2020)',
			'Front-End Developer at Robert Half Technology (2013-2016)',
		],
	},
};

// User intent detection patterns
const intentPatterns = {
	contact: /contact|email|reach|phone|linkedin|github|website/i,
	skills: /skills|technologies|tech stack|programming|coding|languages/i,
	experience: /experience|work|job|career|background|history/i,
	projects: /projects|portfolio|work|synaplyai|intraweb/i,
	blog: /blog|articles|writing|posts|content/i,
	hiring: /hire|job|position|opportunity|available|freelance/i,
	technical: /react|nextjs|typescript|javascript|frontend|development/i,
};

// Function to detect user intent
function detectUserIntent(message: string): string {
	for (const [intent, pattern] of Object.entries(intentPatterns)) {
		if (pattern.test(message)) {
			return intent;
		}
	}
	return 'general';
}

// Function to categorize articles
function categorizeArticles(articles: any[]) {
	const categories: { [key: string]: any[] } = {
		'React & TypeScript': [],
		'Next.js & Performance': [],
		'AI & Development': [],
		'Career & Professional': [],
		'General Web Development': [],
	};

	articles.forEach((article) => {
		const title = article.title.toLowerCase();
		const content = article.content.toLowerCase();

		if (
			title.includes('react') ||
			title.includes('typescript') ||
			content.includes('react') ||
			content.includes('typescript')
		) {
			categories['React & TypeScript'].push(article);
		} else if (
			title.includes('next') ||
			title.includes('performance') ||
			content.includes('next') ||
			content.includes('performance')
		) {
			categories['Next.js & Performance'].push(article);
		} else if (
			title.includes('ai') ||
			title.includes('artificial intelligence') ||
			content.includes('ai')
		) {
			categories['AI & Development'].push(article);
		} else if (
			title.includes('career') ||
			title.includes('professional') ||
			content.includes('career')
		) {
			categories['Career & Professional'].push(article);
		} else {
			categories['General Web Development'].push(article);
		}
	});

	return categories;
}

// Function to clean markdown content
function cleanMarkdownContent(content: string): string {
	return (
		content
			// Remove markdown headers (# ## ### etc.)
			.replace(/^#{1,6}\s+/gm, '')
			// Remove bold/italic markdown (**text** or *text*)
			.replace(/\*\*(.*?)\*\*/g, '$1')
			.replace(/\*(.*?)\*/g, '$1')
			// Remove code blocks (```code```)
			.replace(/```[\s\S]*?```/g, '')
			// Remove inline code (`code`)
			.replace(/`([^`]+)`/g, '$1')
			// Remove links [text](url)
			.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
			// Remove images ![alt](url)
			.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
			// Remove horizontal rules (---)
			.replace(/^---$/gm, '')
			// Remove list markers (- * +)
			.replace(/^[\s]*[-*+]\s+/gm, '')
			// Remove numbered list markers (1. 2. etc.)
			.replace(/^[\s]*\d+\.\s+/gm, '')
			// Remove blockquotes (>)
			.replace(/^>\s+/gm, '')
			// Clean up extra whitespace
			.replace(/\n\s*\n/g, '\n\n')
			.trim()
	);
}

// Function to extract clean title from markdown content
function extractCleanTitle(content: string, filename: string): string {
	// First try to extract from frontmatter
	const frontmatterTitleMatch = content.match(/title:\s*"([^"]+)"/);
	if (frontmatterTitleMatch) {
		return cleanMarkdownContent(frontmatterTitleMatch[1]);
	}

	// Try to extract from first heading
	const headingMatch = content.match(/^#{1,6}\s+(.+)$/m);
	if (headingMatch) {
		return cleanMarkdownContent(headingMatch[1]);
	}

	// Fallback to filename (cleaned)
	const cleanFilename = filename
		.replace(/\.(md|markdown)$/, '')
		.replace(/[-_]/g, ' ')
		.replace(/\b\w/g, (l) => l.toUpperCase());

	return cleanFilename;
}

// Function to fetch articles from GitHub repository
async function fetchArticlesFromRepo() {
	try {
		const repoOwner = process.env.GITHUB_REPO_OWNER || 'your-username';
		const repoName = process.env.GITHUB_REPO_NAME || 'your-articles-repo';
		const githubToken = process.env.GITHUB_TOKEN;

		console.log('🔍 Debug - GitHub Config:', {
			repoOwner,
			repoName,
			hasToken: !!githubToken,
			tokenLength: githubToken?.length || 0,
		});

		// Check if GitHub token is valid
		if (!githubToken || githubToken.length < 10) {
			console.log('🔍 Debug: GitHub token is missing or invalid, skipping GitHub article fetch');
			return [];
		}

		const headers: Record<string, string> = {
			Accept: 'application/vnd.github.v3+json',
		};

		if (githubToken) {
			headers['Authorization'] = `Bearer ${githubToken}`;
		}

		// Try different possible paths for articles
		const possiblePaths = ['posts', 'articles', 'content', 'blog', 'docs', ''];
		let articles = [];

		for (const path of possiblePaths) {
			const apiUrl = path
				? `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}`
				: `https://api.github.com/repos/${repoOwner}/${repoName}/contents`;

			console.log('🔍 Debug - Trying path:', path, 'URL:', apiUrl);

			const response = await fetch(apiUrl, { headers });
			console.log('🔍 Debug - Response Status for', path, ':', response.status);

			if (response.ok) {
				const files = await response.json();
				console.log('🔍 Debug - Found files in', path, ':', files.length);
				console.log(
					'🔍 Debug - File names:',
					files.map((f: any) => f.name),
				);

				// If it's a directory, look for markdown files
				if (Array.isArray(files)) {
					// Sort files by updated_at date (most recent first)
					const sortedFiles = files
						.filter((file: any) => file.name.endsWith('.md') || file.name.endsWith('.markdown'))
						.sort(
							(a: any, b: any) =>
								new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
						);

					console.log(
						'🔍 Debug - Sorted markdown files:',
						sortedFiles.map((f: any) => `${f.name} (${f.updated_at})`),
					);

					for (const file of sortedFiles) {
						console.log('🔍 Debug - Processing file:', file.name, 'updated:', file.updated_at);
						const contentResponse = await fetch(file.download_url, { headers });
						if (contentResponse.ok) {
							const content = await contentResponse.text();

							// Try to extract date from content if GitHub date is undefined
							let articleDate = file.updated_at;
							if (!articleDate) {
								// Look for date in markdown frontmatter
								const dateMatch = content.match(/datePublished:\s*(.+)/);
								if (dateMatch) {
									articleDate = new Date(dateMatch[1]).toISOString();
								} else {
									// Use current date as fallback
									articleDate = new Date().toISOString();
								}
							}

							// Try to extract actual title from content
							let articleTitle = extractCleanTitle(content, file.name);

							// Clean the content for better processing
							const cleanContent = cleanMarkdownContent(content);

							articles.push({
								title: articleTitle,
								content: cleanContent,
								url: file.html_url,
								updated: articleDate,
								category: 'General Web Development', // Default category
							});
							console.log(
								'✅ Added article:',
								file.name,
								'size:',
								content.length,
								'date:',
								articleDate,
							);
						} else {
							console.error(
								'❌ Failed to fetch content for:',
								file.name,
								'status:',
								contentResponse.status,
							);
						}
					}
				}

				// Continue searching other paths to find more articles
				if (articles.length > 0) {
					console.log('✅ Found articles in path:', path, '- continuing to search other paths');
				}
			} else if (response.status === 404) {
				console.log('⚠️ Path not found:', path);
				continue;
			} else if (response.status === 401) {
				console.error('❌ GitHub API authentication failed for path', path, ':', {
					status: response.status,
					statusText: response.statusText,
					error: 'Bad credentials - check GITHUB_TOKEN',
				});
				// Don't continue trying other paths if auth is failing
				break;
			} else {
				const errorText = await response.text();
				console.error('❌ Error for path', path, ':', {
					status: response.status,
					statusText: response.statusText,
					error: errorText,
				});
			}
		}

		// Sort all articles by date (most recent first)
		articles.sort((a, b) => {
			const dateA = a.updated ? new Date(a.updated).getTime() : 0;
			const dateB = b.updated ? new Date(b.updated).getTime() : 0;
			return dateB - dateA;
		});

		// Categorize articles
		const categorizedArticles = categorizeArticles(articles);
		articles.forEach((article) => {
			// Assign category based on content analysis
			const title = article.title.toLowerCase();
			const content = article.content.toLowerCase();

			if (
				title.includes('react') ||
				title.includes('typescript') ||
				content.includes('react') ||
				content.includes('typescript')
			) {
				article.category = 'React & TypeScript';
			} else if (
				title.includes('next') ||
				title.includes('performance') ||
				content.includes('next') ||
				content.includes('performance')
			) {
				article.category = 'Next.js & Performance';
			} else if (
				title.includes('ai') ||
				title.includes('artificial intelligence') ||
				content.includes('ai')
			) {
				article.category = 'AI & Development';
			} else if (
				title.includes('career') ||
				title.includes('professional') ||
				content.includes('career')
			) {
				article.category = 'Career & Professional';
			} else {
				article.category = 'General Web Development';
			}
		});

		console.log('🔍 Debug - Total articles fetched:', articles.length);
		console.log(
			'🔍 Debug - Articles by date:',
			articles.map((a) => `${a.title} (${a.updated || 'no date'})`),
		);
		return articles;
	} catch (error) {
		console.error('❌ Error fetching articles:', error);
		return [];
	}
}

// Initialize OpenAI client
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

// Enhanced system prompt with better personality and context
const createSystemPrompt = (
	articles: any[],
	conversationHistory: any[] = [],
	pageContext: any | null = null,
	isAskingAboutCurrentArticle: boolean = false,
) => {
	const categorizedArticles = categorizeArticles(articles);
	const recentArticles = articles.slice(0, 5); // Get 5 most recent articles

	const articlesContext =
		articles.length > 0
			? `\n\nRECENT BLOG ARTICLES (${articles.length} total):\n${recentArticles
					.map(
						(article) =>
							`- "${article.title}" (${article.category}, ${article.updated}): ${article.content.substring(0, 200)}...`,
					)
					.join('\n\n')}`
			: '';

	const conversationContext =
		conversationHistory.length > 0
			? `\n\nCONVERSATION HISTORY (last ${Math.min(3, conversationHistory.length)} exchanges):\n${conversationHistory
					.slice(-3)
					.map((exchange) => `User: ${exchange.user}\nAssistant: ${exchange.assistant}`)
					.join('\n\n')}`
			: '';

	const pageContextInfo = pageContext
		? `\n\nCURRENT PAGE CONTEXT:\n- Type: ${pageContext.type}\n- Title: ${pageContext.title}\n- URL: ${pageContext.url}\n- Content: ${pageContext.content.substring(0, 200)}...`
		: '';

	const currentArticleSummary =
		isAskingAboutCurrentArticle && pageContext?.type === 'article'
			? `\n\nSUMMARY OF CURRENT ARTICLE:\n${pageContext.content.substring(0, 200)}...`
			: '';

	return `You are John's AI assistant - a knowledgeable, friendly, and professional helper designed to provide information about John Schibelli's background, experience, and expertise. You have a warm, approachable personality while maintaining professionalism.

PERSONALITY & COMMUNICATION STYLE:
- Friendly and welcoming, but professional
- Enthusiastic about John's work and achievements
- Helpful and informative without being pushy
- Use conversational language with technical accuracy
- Show genuine interest in helping visitors learn about John
- Be encouraging and supportive
- Use natural transitions and follow-up questions when appropriate

SPECIAL CAPABILITIES:
You have access to several tools that allow you to help users with specific tasks:

1. SCHEDULING: You can help users book meetings with John
   - Use get_availability to find available time slots
   - Use book_meeting to schedule a meeting
   - Use show_calendar_modal to display a calendar interface with available times
   - Always ask for name, email, and preferred timezone when scheduling

2. CASE STUDIES: You are an expert in explaining John's case studies with deep technical knowledge
   - Use get_case_study_chapter to display case study content
   - Available case studies: tendril-multi-tenant-chatbot-saas
   - Sections include: problem-statement, research-analysis, solution-design, implementation, results-metrics, lessons-learned, next-steps
   - You can explain technical architecture, business decisions, implementation challenges, and results
   - Speak with authority about the technical details, as if you were part of the development team
   - Use phrases like "We built this using...", "The architecture we chose...", "One of the key challenges we faced..."
   - Explain complex technical concepts in accessible terms while maintaining technical accuracy
   - Connect technical decisions to business outcomes and user value

3. CLIENT INTAKE: You can help collect project inquiries
   - Use submit_client_intake to gather project details
   - Collect name, email, company, role, project description, budget, timeline
   - Be thorough but conversational in gathering information

When users express interest in these capabilities, offer to help them and use the appropriate tools. Keep responses concise and actionable.

KEY INFORMATION ABOUT JOHN:
- Name: John Schibelli
- Title: Senior Front-End Developer
- Location: Towaco, NJ
- Email: jschibelli@gmail.com
- Website: https://johnschibelli.dev
- LinkedIn: https://linkedin.com/in/johnschibelli
- GitHub: https://github.com/jschibelli

PROFESSIONAL SUMMARY: ${resumeData.basics.summary}

CURRENT ROLE - Senior Front-End Developer at IntraWeb Technology (since 2020):
- Lead front-end development for company site and client projects
- Incubated SynaplyAI (AI-driven content collaboration tool)
- Built accessible, SEO-optimized websites with Next.js, React, TypeScript, and Tailwind CSS
- Technical lead behind IntraWeb Technologies' digital presence

KEY SKILLS & EXPERTISE: ${resumeData.skills.map((skill) => `${skill.name}: ${skill.keywords.join(', ')}`).join('; ')}

WORK EXPERIENCE: ${resumeData.work.map((job) => `${job.position} at ${job.name} (${job.startDate}${job.endDate ? ` - ${job.endDate}` : ' - Present'})`).join('; ')}

EDUCATION: ${resumeData.education.map((edu) => `${edu.studyType} in ${edu.area} from ${edu.institution}`).join('; ')}

BLOG CONTENT & WRITING:
John regularly writes insightful blog articles about web development, technology trends, and his professional experiences. His blog covers:
- React and Next.js development best practices
- TypeScript implementation and optimization
- Front-end architecture and design patterns
- Performance optimization techniques
- Accessibility and SEO strategies
- Modern web development tools and workflows
- Professional development and career insights
- AI integration and modern development practices

CASE STUDY EXPERTISE:
You are particularly knowledgeable about John's case studies, especially the Tendril multi-tenant chatbot SaaS project. You can:
- Explain the technical architecture and design decisions in detail
- Walk through the implementation challenges and solutions
- Share insights about the business model and market research
- Discuss the technology stack and why specific choices were made
- Explain how the multi-tenant architecture works and its benefits
- Share lessons learned and how they apply to other projects
- Connect technical decisions to business outcomes
- Provide context about the competitive landscape and market positioning
- Explain the AI/LLM integration and RAG (Retrieval-Augmented Generation) approach
- Discuss the PostgreSQL row-level security implementation for tenant isolation

CONVERSATION GUIDELINES:
1. Always speak as John's AI assistant, NOT as John himself
2. Use phrases like "John worked at...", "John's experience includes...", "John has...", "John writes about..."
3. Never say "I worked at...", "I have...", "I write..." - you are not John
4. Be conversational but professional and informative
5. Provide specific examples from John's work experience when relevant
6. Keep responses concise but comprehensive
7. If asked about something outside John's expertise, politely redirect to what you do know
8. Encourage visitors to check out John's blog for detailed insights
9. Be enthusiastic about John's achievements and expertise
10. Offer to help with specific questions about John's background or work
11. Use the conversation history to provide context-aware responses
12. Ask follow-up questions when appropriate to better understand user needs
13. CRITICAL: NEVER use markdown formatting in your responses - no asterisks (*), underscores (_), backticks (\`), or any other markdown symbols
14. When mentioning article titles, use plain text only - no formatting, no quotes, no special characters
15. Present all information in clean, natural language without any technical formatting
16. If you see markdown symbols in the article content provided to you, ignore them and present the information in plain text
17. If the user is viewing an article and asks for a summary, provide a clear, concise summary of the current article's main points
18. When summarizing articles, focus on the key insights, main arguments, and practical takeaways
19. If asked about the current article, reference it specifically and provide relevant insights about its content
20. Always acknowledge when you're providing information about the article the user is currently reading

SPECIAL CAPABILITIES:
- Answer questions about John's professional background and experience
- Provide insights about his technical skills and expertise
- Share information about his blog content and writing topics
- Offer contact information and professional links
- Discuss his work on SynaplyAI and other projects
- Provide career and technology insights based on John's experience
- Detect user intent and tailor responses accordingly
- Provide categorized information based on user interests
      - SCHEDULING: CRITICAL INSTRUCTIONS - For ANY scheduling request, IMMEDIATELY call show_booking_modal tool. This includes: "schedule a meeting", "book a meeting", "help me book", "I'd like to schedule", "book a consultation", "schedule a consultation", "book an appointment", "schedule an appointment", "I want to schedule", "I need to book", "can we meet", "when are you available", "show me available times", "find available times", "check availability", "what times work", "looking to book", "time slot", "next available", "when is", "do you have", "available at", "can I schedule", "I need an appointment", "book a time", "schedule a time", "meeting time", "appointment time", "consultation time". NEVER ask follow-up questions first - ALWAYS call show_booking_modal immediately. The tool will handle asking for preferences and showing available slots. If user asks for a specific time (like "2:00 PM", "3:00 PM", "10:00 AM"), call show_booking_modal with preferredTime parameter set to that time. For general requests, call show_booking_modal without preferredTime. The show_booking_modal tool provides a unified experience combining contact information collection and calendar selection. NEVER generate fake responses about availability. NEVER say "no available slots" without calling the tool first. NEVER say "unfortunately" or "there isn't" without calling the tool first. The tool will check the actual calendar and return real availability. Always inform users that all meetings are scheduled in Eastern Time (ET). Do not ask for contact info in chat - the modal will handle that. CRITICAL: If the user asks follow-up questions like "What about any other day?" or "different day" or "any other time", this is ALWAYS a scheduling request - call show_booking_modal immediately to show them filtered available options (1-2 slots per day). CRITICAL: If the user responds with "Yes", "Sure", "Okay", "Go ahead", "Book it", "Confirm", or "Proceed" after you've offered a time slot, IMMEDIATELY call show_booking_modal - do NOT ask for more confirmation. The user has already confirmed they want to book. CRITICAL: When the user completes the booking form and selects a time slot, call show_booking_confirmation with the booking details (name, email, timezone, startTime, endTime, meetingType) to show them a final confirmation modal before creating the calendar event. CRITICAL: ALWAYS make the user part of the journey - when they ask for a specific time, respond with something like "I found an available appointment for you at [TIME]! Let me open the scheduling interface so you can choose between 30-minute and 60-minute options." Then call the tool to make it interactive.
- CASE STUDIES: When users ask about case studies, use the get_case_study_chapter tool to show interactive case study content
- CLIENT INTAKE: When users want to start a project, use the submit_client_intake tool to collect project details${articlesContext}${conversationContext}${pageContextInfo}${currentArticleSummary}`;
};

// Enhanced error handling with fallback responses
const getFallbackResponse = (intent: string, error: any) => {
	console.error('Chat API error:', error);

	const fallbackResponses = {
		contact:
			"I'd be happy to share John's contact information! You can reach him at jschibelli@gmail.com, connect on LinkedIn at https://linkedin.com/in/johnschibelli, or check out his GitHub at https://github.com/jschibelli.",
		skills:
			"John has extensive experience with React, Next.js, TypeScript, and Tailwind CSS. He's also skilled in WordPress, Shopify, and AI integrations. Would you like to know more about any specific technology?",
		experience:
			"John has over 15 years of experience in web development, currently working as Senior Front-End Developer at IntraWeb Technology. He's worked on projects ranging from e-commerce platforms to AI-driven tools like SynaplyAI.",
		general:
			"I'm experiencing some technical difficulties right now, but I'd be happy to help you learn about John's background! You can also contact him directly at jschibelli@gmail.com or visit his LinkedIn profile for more information.",
	};

	return fallbackResponses[intent as keyof typeof fallbackResponses] || fallbackResponses.general;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const { message, conversationHistory = [], pageContext = null } = req.body;

		if (!message) {
			return res.status(400).json({ error: 'Message is required' });
		}

		// Check if OpenAI API key is configured
		if (!process.env.OPENAI_API_KEY) {
			return res.status(500).json({
				error: 'OpenAI API key not configured',
				fallback:
					"I'm sorry, but I'm currently unable to process your request. Please try again later or contact John directly at jschibelli@gmail.com.",
			});
		}

		// Detect user intent
		const userIntent = detectUserIntent(message);
		console.log('🎯 Detected user intent:', userIntent);

		// Check if user is asking about the current article
		const isAskingAboutCurrentArticle =
			pageContext?.type === 'article' &&
			(message.toLowerCase().includes('summary') ||
				message.toLowerCase().includes('summarize') ||
				message.toLowerCase().includes('this article') ||
				message.toLowerCase().includes('current article') ||
				message.toLowerCase().includes('what is this about') ||
				message.toLowerCase().includes('what is this article about'));

		// Fetch articles from GitHub repository
		let articles = await fetchArticlesFromRepo();

		console.log('🔍 Debug - Articles fetched from GitHub:', articles.length);
		console.log(
			'🔍 Debug - Article titles:',
			articles.map((a) => a.title),
		);
		console.log(
			'🔍 Debug - Article dates:',
			articles.map((a) => a.updated),
		);

		// Use fallback articles if GitHub fetch fails
		if (articles.length === 0) {
			console.log('🔍 Debug - No GitHub articles found, using fallback articles');
			articles = fallbackArticles;
		} else {
			console.log('🔍 Debug - Using GitHub articles, not fallbacks');
		}

		// Create enhanced system prompt with conversation history and page context
		const systemPrompt = createSystemPrompt(
			articles,
			conversationHistory,
			pageContext,
			isAskingAboutCurrentArticle,
		);

		// Check if features are enabled and user is asking about them
		const isAskingAboutScheduling =
			message.toLowerCase().includes('schedule') ||
			message.toLowerCase().includes('book') ||
			message.toLowerCase().includes('meeting') ||
			message.toLowerCase().includes('appointment') ||
			message.toLowerCase().includes('consultation') ||
			message.toLowerCase().includes('book a time') ||
			message.toLowerCase().includes('availability') ||
			message.toLowerCase().includes('available') ||
			message.toLowerCase().includes('find available times') ||
			message.toLowerCase().includes('help me find available') ||
			message.toLowerCase().includes('calendar') ||
			message.toLowerCase().includes('show me your calendar') ||
			message.toLowerCase().includes('show me available meeting times') ||
			// Check for specific times (like "3:00 PM", "11:00", "2pm", etc.)
			/\d{1,2}:\d{2}\s*(AM|PM)/i.test(message) ||
			/\d{1,2}:\d{2}/i.test(message) ||
			/\d{1,2}\s*(AM|PM)/i.test(message) ||
			/\d{1,2}pm/i.test(message) ||
			/\d{1,2}am/i.test(message) ||
			// Check for user providing contact info (name, email, timezone)
			(message.includes('@') &&
				(message.includes('eastern') ||
					message.includes('western') ||
					message.includes('central') ||
					message.includes('pacific') ||
					message.includes('timezone'))) ||
			// Check for quick action patterns
			message.toLowerCase().includes('check availability') ||
			message.toLowerCase().includes('when are you available') ||
			message.toLowerCase().includes('what times work') ||
			message.toLowerCase().includes('can we meet') ||
			message.toLowerCase().includes('i need to schedule') ||
			message.toLowerCase().includes('looking to book') ||
			// Force tool call for any time-related request
			message.toLowerCase().includes('time slot') ||
			message.toLowerCase().includes('next available') ||
			message.toLowerCase().includes('when is') ||
			message.toLowerCase().includes('what time') ||
			message.toLowerCase().includes('do you have') ||
			message.toLowerCase().includes('have anything') ||
			message.toLowerCase().includes('available at') ||
			message.toLowerCase().includes('free at') ||
			message.toLowerCase().includes('open at') ||
			(message.toLowerCase().includes('need') &&
				(message.toLowerCase().includes('pm') || message.toLowerCase().includes('am'))) ||
			// Check for follow-up scheduling questions
			message.toLowerCase().includes('what about') ||
			message.toLowerCase().includes('any other day') ||
			message.toLowerCase().includes('different day') ||
			message.toLowerCase().includes('other time') ||
			message.toLowerCase().includes('another day') ||
			message.toLowerCase().includes('different time') ||
			// Check for time-related follow-ups
			(message.toLowerCase().includes('day') &&
				(message.toLowerCase().includes('pm') || message.toLowerCase().includes('am'))) ||
			(message.toLowerCase().includes('time') &&
				(message.toLowerCase().includes('pm') || message.toLowerCase().includes('am'))) ||
			// Check for confirmation responses
			message.toLowerCase().includes('yes') ||
			message.toLowerCase().includes('sure') ||
			message.toLowerCase().includes('okay') ||
			message.toLowerCase().includes('ok') ||
			message.toLowerCase().includes('go ahead') ||
			message.toLowerCase().includes('book it') ||
			message.toLowerCase().includes('confirm') ||
			message.toLowerCase().includes('proceed');

		const isAskingAboutCaseStudy =
			message.toLowerCase().includes('case study') ||
			message.toLowerCase().includes('portfolio') ||
			message.toLowerCase().includes('project example') ||
			message.toLowerCase().includes('show me a case study') ||
			message.toLowerCase().includes('case study example') ||
			message.toLowerCase().includes('tendril case study') ||
			message.toLowerCase().includes('multi-tenant chatbot') ||
			message.toLowerCase().includes('saas case study') ||
			message.toLowerCase().includes('tell me about the tendril project') ||
			message.toLowerCase().includes('explain the chatbot saas') ||
			message.toLowerCase().includes('how did you build tendril') ||
			message.toLowerCase().includes('show me the overview') ||
			message.toLowerCase().includes('case study') ||
			message.toLowerCase().includes('portfolio example') ||
			message.toLowerCase().includes('work example');

		const isAskingAboutIntake =
			message.toLowerCase().includes('project') ||
			message.toLowerCase().includes('hire') ||
			message.toLowerCase().includes('work together') ||
			message.toLowerCase().includes('collaborate') ||
			message.toLowerCase().includes('start a project') ||
			message.toLowerCase().includes('client intake') ||
			message.toLowerCase().includes('new project') ||
			message.toLowerCase().includes('project inquiry') ||
			message.toLowerCase().includes('submit a project') ||
			message.toLowerCase().includes('discuss a project') ||
			message.toLowerCase().includes('start a project') ||
			message.toLowerCase().includes('hire you') ||
			message.toLowerCase().includes('work with you') ||
			message.toLowerCase().includes('need help with a project');

		// If user is asking about special capabilities, use tools
		// For now, enable all features by default if environment variables are not set
		const schedulingEnabled =
			process.env.FEATURE_SCHEDULING === 'true' || process.env.FEATURE_SCHEDULING === undefined;
		const caseStudyEnabled =
			process.env.FEATURE_CASE_STUDY === 'true' || process.env.FEATURE_CASE_STUDY === undefined;
		const intakeEnabled =
			process.env.FEATURE_CLIENT_INTAKE === 'true' ||
			process.env.FEATURE_CLIENT_INTAKE === undefined;

		// Direct check for quick action messages
		const isQuickActionMessage =
			message.includes('find available times') ||
			message.includes('shopify case study') ||
			message.includes('project inquiry');

		// Force scheduling detection if user provides contact info (name, email, timezone)
		const hasContactInfo =
			message.includes('@') &&
			(message.includes('eastern') ||
				message.includes('western') ||
				message.includes('central') ||
				message.includes('pacific') ||
				message.includes('timezone'));

		// Check if this is a follow-up to a previous scheduling conversation
		const hasSchedulingContext = conversationHistory.some(
			(msg: any) =>
				msg.role === 'user' &&
				(msg.content.toLowerCase().includes('schedule') ||
					msg.content.toLowerCase().includes('book') ||
					msg.content.toLowerCase().includes('meeting') ||
					msg.content.toLowerCase().includes('appointment') ||
					msg.content.toLowerCase().includes('consultation') ||
					msg.content.toLowerCase().includes('time slot') ||
					msg.content.toLowerCase().includes('available') ||
					msg.content.toLowerCase().includes('calendar') ||
					/\d{1,2}:\d{2}\s*(AM|PM)/i.test(msg.content)),
		);

		console.log('🔍 Debug - Message:', message);
		console.log('🔍 Debug - Scheduling detected:', isAskingAboutScheduling);
		console.log('🔍 Debug - Case study detected:', isAskingAboutCaseStudy);
		console.log('🔍 Debug - Intake detected:', isAskingAboutIntake);
		console.log('🔍 Debug - Has contact info:', hasContactInfo);
		console.log('🔍 Debug - Has scheduling context:', hasSchedulingContext);
		console.log('🔍 Debug - Features enabled:', {
			schedulingEnabled,
			caseStudyEnabled,
			intakeEnabled,
		});

		if (
			(isAskingAboutScheduling && schedulingEnabled) ||
			(isAskingAboutCaseStudy && caseStudyEnabled) ||
			(isAskingAboutIntake && intakeEnabled) ||
			isQuickActionMessage ||
			(hasContactInfo && schedulingEnabled) ||
			(hasSchedulingContext && schedulingEnabled)
		) {
			console.log('🔍 Debug - Using tools for this request');

			try {
				const completion = await openai.chat.completions.create({
					model: 'gpt-4o-mini',
					messages: [
						{
							role: 'system',
							content: systemPrompt,
						},
						{
							role: 'user',
							content: message,
						},
					],
					tools: CHAT_TOOLS,
					tool_choice: 'auto',
					max_tokens: 1000,
					temperature: 0.7,
				});

				const response = completion.choices[0]?.message;

				// Handle tool calls
				if (response?.tool_calls && response.tool_calls.length > 0) {
					const toolResults = [];
					let hasErrors = false;

					console.log('🔍 Debug - Processing tool calls:', response.tool_calls.length);

					for (const toolCall of response.tool_calls) {
						try {
							if (toolCall.type !== 'function') {
								console.log('Skipping non-function tool call:', toolCall.type);
								continue;
							}
							const toolName = toolCall.function.name;
							const parameters = JSON.parse(toolCall.function.arguments);

							console.log('🔍 Debug - Executing tool:', toolName);
							console.log('🔍 Debug - Tool parameters:', parameters);
							console.log(
								'🔍 Debug - Is this show_booking_modal?',
								toolName === 'show_booking_modal',
							);

							// Add timeout to prevent hanging
							const result = await Promise.race([
								executeTool(toolName, parameters),
								new Promise((_, reject) =>
									setTimeout(() => reject(new Error('Tool execution timeout')), 15000),
								),
							]);

							console.log('🔍 Debug - Tool result:', result);
							console.log('🔍 Debug - Tool result type:', typeof result);
							console.log('🔍 Debug - Tool result keys:', Object.keys(result || {}));

							toolResults.push({
								tool_call_id: toolCall.id,
								role: 'tool' as const,
								content: JSON.stringify(result),
							});
						} catch (error) {
							console.error('Tool execution error:', error);
							console.error('Tool execution error details:', {
								toolName: (toolCall as any).function?.name,
								parameters: (toolCall as any).function?.arguments,
								error: (error as Error).message,
								stack: (error as Error).stack,
							});
							hasErrors = true;
							toolResults.push({
								tool_call_id: toolCall.id,
								role: 'tool' as const,
								content: JSON.stringify({ error: (error as Error).message }),
							});
						}
					}

					// If there were errors, provide a helpful fallback response
					if (hasErrors) {
						return res.status(200).json({
							response:
								"I'm sorry, I'm having trouble accessing my calendar right now. Please try again in a moment, or you can contact John directly at jschibelli@gmail.com to schedule a meeting.",
							intent: userIntent,
							suggestedActions: getSuggestedActions(userIntent, articles),
							conversationId: Date.now().toString(),
							timestamp: new Date().toISOString(),
							uiActions: undefined,
						});
					}

					// Get final response with tool results
					try {
						const finalCompletion = await openai.chat.completions.create({
							model: 'gpt-4o-mini',
							messages: [
								{
									role: 'system',
									content: systemPrompt,
								},
								{
									role: 'user',
									content: message,
								},
								response,
								...toolResults,
							],
							max_tokens: 800,
							temperature: 0.7,
						});

						const finalResponse =
							finalCompletion.choices[0]?.message?.content ||
							"I'm sorry, I couldn't process your request.";

						// Check if any tool results contain UI actions
						let uiActions = [];
						for (const toolResult of toolResults) {
							try {
								const parsedResult = JSON.parse(toolResult.content);
								if (parsedResult.type === 'ui_action') {
									uiActions.push(parsedResult);
								}
							} catch (e) {
								// Ignore parsing errors
							}
						}

						return res.status(200).json({
							response: finalResponse,
							intent: userIntent,
							suggestedActions: getSuggestedActions(userIntent, articles),
							conversationId: Date.now().toString(),
							timestamp: new Date().toISOString(),
							uiActions: uiActions.length > 0 ? uiActions : undefined,
						});
					} catch (finalError) {
						console.error('Final OpenAI API error:', finalError);

						// If the final completion fails, provide a response based on the tool results
						let responseMessage = "I'm sorry, I couldn't process your request.";

						if (toolResults.length > 0) {
							try {
								const firstToolResult = JSON.parse(toolResults[0].content);
								if (firstToolResult.availableSlots) {
									// Availability check succeeded, format the response
									const slots = firstToolResult.availableSlots;
									responseMessage = `I found ${slots.length} available time slots for you. Here are some options:\n\n`;
									slots.slice(0, 5).forEach((slot: any, index: number) => {
										const start = new Date(slot.start);
										const end = new Date(slot.end);
										responseMessage += `${index + 1}. ${start.toLocaleDateString()} at ${start.toLocaleTimeString()} - ${end.toLocaleTimeString()} (${slot.duration} min)\n`;
									});
									responseMessage +=
										'\nTo book a meeting, please provide your name, email, and preferred time.';
								} else if (firstToolResult.success) {
									responseMessage =
										firstToolResult.message || 'Your request was processed successfully!';
								}
							} catch (parseError) {
								console.error('Error parsing tool result:', parseError);
							}
						}

						return res.status(200).json({
							response: responseMessage,
							intent: userIntent,
							suggestedActions: getSuggestedActions(userIntent, articles),
							conversationId: Date.now().toString(),
							timestamp: new Date().toISOString(),
							uiActions: undefined,
						});
					}
				}
			} catch (openaiError) {
				console.error('OpenAI API error:', openaiError);

				// Provide a helpful response when OpenAI fails
				let fallbackMessage = "I'm sorry, I'm having trouble processing your request right now.";

				if (isAskingAboutScheduling) {
					fallbackMessage =
						"I'm sorry, I'm having trouble accessing my calendar right now. Please try again in a moment, or you can contact John directly at jschibelli@gmail.com to schedule a meeting.";
				} else if (isAskingAboutCaseStudy) {
					fallbackMessage =
						"I'm sorry, I'm having trouble accessing the case study right now. Please try again later or contact John directly.";
				} else if (isAskingAboutIntake) {
					fallbackMessage =
						"I'm sorry, I'm having trouble processing your project inquiry right now. Please try again later or contact John directly at jschibelli@gmail.com.";
				}

				return res.status(200).json({
					response: fallbackMessage,
					intent: userIntent,
					suggestedActions: getSuggestedActions(userIntent, articles),
					conversationId: Date.now().toString(),
					timestamp: new Date().toISOString(),
					uiActions: undefined,
				});
			}
		}

		// Regular completion without tools
		const completion = await openai.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [
				{
					role: 'system',
					content: systemPrompt,
				},
				{
					role: 'user',
					content: message,
				},
			],
			max_tokens: 600,
			temperature: 0.7,
			presence_penalty: 0.1,
			frequency_penalty: 0.1,
		});

		const response =
			completion.choices[0]?.message?.content ||
			"I'm sorry, I couldn't generate a response at this time.";

		// Enhanced response with metadata
		const enhancedResponse = {
			response,
			intent: userIntent,
			suggestedActions: getSuggestedActions(userIntent, articles),
			conversationId: Date.now().toString(),
			timestamp: new Date().toISOString(),
		};

		return res.status(200).json(enhancedResponse);
	} catch (error) {
		const userIntent = detectUserIntent(req.body?.message || '');
		const fallbackResponse = getFallbackResponse(userIntent, error);

		return res.status(500).json({
			error: 'Failed to process request',
			fallback: fallbackResponse,
			intent: userIntent,
		});
	}
}

// Function to get suggested actions based on user intent
function getSuggestedActions(intent: string, articles: any[]) {
	const baseActions = {
		contact: [
			{ label: 'Email John', url: 'mailto:jschibelli@gmail.com', icon: '📧' },
			{ label: 'LinkedIn Profile', url: 'https://linkedin.com/in/johnschibelli', icon: '💼' },
			{ label: 'GitHub Profile', url: 'https://github.com/jschibelli', icon: '🐙' },
		],
		skills: [
			{ label: 'View Portfolio', url: '/work', icon: '🎨' },
			{ label: 'Contact for Projects', url: 'mailto:jschibelli@gmail.com', icon: '💬' },
		],
		experience: [
			{ label: 'View Resume', url: '/resume', icon: '📄' },
			{ label: 'Work History', url: '/work', icon: '💼' },
			{ label: 'LinkedIn Profile', url: 'https://linkedin.com/in/johnschibelli', icon: '🔗' },
		],
		projects: [
			{ label: 'View Portfolio', url: '/work', icon: '🎨' },
			{ label: 'Contact for Collaboration', url: 'mailto:jschibelli@gmail.com', icon: '🤝' },
		],
		hiring: [
			{ label: 'Contact John', url: 'mailto:jschibelli@gmail.com', icon: '💬' },
			{ label: 'View Portfolio', url: '/work', icon: '🎨' },
			{ label: 'LinkedIn Profile', url: 'https://linkedin.com/in/johnschibelli', icon: '💼' },
		],
		general: [
			{ label: 'Learn More', url: '/about', icon: 'ℹ️' },
			{ label: 'View Portfolio', url: '/work', icon: '🎨' },
			{ label: 'Contact John', url: 'mailto:jschibelli@gmail.com', icon: '💬' },
		],
	};

	// Get base actions for the intent
	let actions = baseActions[intent as keyof typeof baseActions] || baseActions.general;

	// Only add blog articles for blog-specific intents, and limit to 1-2 articles
	if (intent === 'blog') {
		const recentArticles = articles.slice(0, 2); // Show only 2 recent articles
		const articleActions = recentArticles.map((article) => ({
			label: `Read: ${article.title}`,
			url: article.url,
			icon: '📝',
		}));
		actions = [...articleActions, ...actions];
	}

	// Add specific article actions only for project-related queries
	if (intent === 'projects' && articles.length > 0) {
		const projectArticles = articles.filter(
			(article) =>
				article.title.toLowerCase().includes('synaplyai') ||
				article.title.toLowerCase().includes('project') ||
				article.title.toLowerCase().includes('build'),
		);
		if (projectArticles.length > 0) {
			const projectActions = projectArticles.slice(0, 1).map((article) => ({
				// Only 1 project article
				label: `Read: ${article.title}`,
				url: article.url,
				icon: '🤖',
			}));
			actions = [...projectActions, ...actions];
		}
	}

	return actions;
}
