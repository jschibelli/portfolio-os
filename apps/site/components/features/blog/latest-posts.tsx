import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { fetchPosts } from '../../../lib/content-api';
import { Button } from '../../ui/button';
import { PRIMARY_BUTTON_STYLES, ICON_SPACING } from '../../../lib/button-styles';
import LatestPostsClient from './latest-posts-client';

/**
 * LatestPosts component displays recent blog posts with proper error handling,
 * accessibility, and consistent button styling
 */
export default async function LatestPosts() {
	// Fetch the latest 3 posts
	let posts: any[] = [];
	
	// Only fetch if NOT in build phase - similar to blog/page.tsx
	// This prevents API timeouts during build while allowing runtime fetching
	if (process.env.NEXT_PHASE !== 'phase-production-build') {
		try {
			const fetchedPosts = await fetchPosts(3);
			posts = fetchedPosts.map((post) => ({
				id: post.id,
				title: post.title,
				excerpt: post.brief || '',
				date: post.publishedAt,
				slug: post.slug,
				readTime: `${post.readTimeInMinutes || 5} min read`,
				image: post.coverImage?.url || '/images/placeholder-featured.jpg',
				tags: post.tags?.map(tag => tag.name) || [],
			}));
		} catch (error) {
			console.error('LatestPosts: Failed to fetch posts', {
				error,
				timestamp: new Date().toISOString()
			});
		}
	}

	// Error handling for missing or invalid posts data
	if (!posts || posts.length === 0) {
		return (
			<section 
				className="bg-stone-50 py-20 dark:bg-stone-900"
				aria-label="Latest blog posts section"
				role="region"
			>
				<div className="container mx-auto px-4 text-center">
					<p className="text-stone-600 dark:text-stone-400" role="alert">
						Unable to load recent posts. Please try again later.
					</p>
				</div>
			</section>
		);
	}

	return <LatestPostsClient posts={posts} />;
}
