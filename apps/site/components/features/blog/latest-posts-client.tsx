"use client";
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../../ui/button';
import PostCard from './post-card';
import { PRIMARY_BUTTON_STYLES, ICON_SPACING } from '../../../lib/button-styles';

interface Post {
	id: string;
	title: string;
	excerpt: string;
	date: string;
	slug: string;
	readTime: string;
	image?: string;
	tags?: string[];
}

interface LatestPostsClientProps {
	posts: Post[];
}

/**
 * Client-side component for rendering latest posts with animations
 */
export default function LatestPostsClient({ posts }: LatestPostsClientProps) {
	return (
		<section 
			className="bg-stone-50 py-20 dark:bg-stone-900"
			aria-label="Latest blog posts section"
			role="region"
		>
			<div className="container mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: 'easeOut' }}
					viewport={{ once: true }}
					className="mb-16 text-center"
				>
					<h2 className="mb-4 text-3xl font-bold text-stone-900 md:text-4xl dark:text-stone-100">
						Latest from the Blog
					</h2>
					<p className="mx-auto max-w-2xl text-xl text-stone-600 dark:text-stone-400">
						Insights, tutorials, and thoughts on modern web development and technology
					</p>
				</motion.div>

				{/* Posts Grid */}
				<div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					{posts.map((post, index) => (
						<PostCard key={post.id} post={post} index={index} />
					))}
				</div>

				{/* Read the Blog CTA with enhanced accessibility */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
					viewport={{ once: true }}
					className="text-center"
				>
					<Button
						size="lg"
						className={PRIMARY_BUTTON_STYLES}
						asChild
						aria-describedby="read-blog-description"
					>
						<Link 
							href="/blog"
							aria-label="Read all blog posts and articles"
						>
							Read the Blog
							<ArrowRight 
								className={`${ICON_SPACING.right} transition-transform group-hover:translate-x-1`}
								aria-hidden="true"
							/>
						</Link>
					</Button>
					<div id="read-blog-description" className="sr-only">
						Navigate to the blog page to read all available articles and posts
					</div>
				</motion.div>
			</div>
		</section>
	);
}
