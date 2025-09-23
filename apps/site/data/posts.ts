export interface Post {
	id: string;
	title: string;
	excerpt: string;
	date: string;
	slug: string;
	readTime: string;
	image?: string;
	tags?: string[];
}

export const recentPosts: Post[] = [
	{
		id: '1',
		title: 'Building Scalable React Applications with TypeScript',
		excerpt:
			'Learn how to structure large React applications using TypeScript, proper state management, and performance optimization techniques.',
		date: '2024-01-15',
		slug: 'building-scalable-react-applications',
		readTime: '8 min read',
		image: '/images/placeholder-featured.jpg',
		tags: ['React', 'TypeScript', 'Development'],
	},
	{
		id: '2',
		title: 'The Future of AI-Driven Development',
		excerpt:
			'Exploring how AI tools are transforming the development workflow and what this means for developers in 2024.',
		date: '2024-01-10',
		slug: 'future-of-ai-driven-development',
		readTime: '6 min read',
		image: '/images/placeholder-featured.jpg',
		tags: ['AI', 'Development', 'Technology'],
	},
	{
		id: '3',
		title: 'Optimizing Next.js Performance for Production',
		excerpt:
			'Deep dive into Next.js performance optimization strategies, from image optimization to bundle analysis.',
		date: '2024-01-05',
		slug: 'optimizing-nextjs-performance',
		readTime: '10 min read',
		image: '/images/placeholder-featured.jpg',
		tags: ['Next.js', 'Performance', 'Development'],
	},
];

export const featuredPost: Post = {
	id: 'featured-1',
	title: 'How I Use GPT to Scope and Estimate Freelance Projects (Without Burning Hours)',
	excerpt:
		'Scoping freelance work used to be the part I dreaded most. Endless back-and-forth with vague client requests, a half-baked idea of what they wanted, and pressure to give a number — fast. And when I got it wrong? It usually cost me time, energy, and revenue. But then I discovered how to leverage GPT to streamline this process...',
	date: '2025-07-25',
	slug: 'how-i-use-gpt-to-scope-and-estimate-freelance-projects',
	readTime: '5 min read',
	image: '/images/placeholder-featured.jpg',
	tags: ['Technology', 'Insights'],
};
