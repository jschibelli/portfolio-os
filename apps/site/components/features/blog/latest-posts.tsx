"use client";
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../../ui/button';

/**
 * LatestPosts component displays recent blog posts with proper error handling,
 * accessibility, and consistent button styling
 */
export default function LatestPosts() {
	// Mock data for now - you can replace with real data
	const recentPosts = [
		{
			id: '1',
			title: 'Building Scalable React Applications with TypeScript',
			excerpt: 'Learn how to structure large React applications for maintainability and performance using TypeScript best practices.',
			date: 'January 14, 2024',
			readTime: '8 min read',
			slug: 'building-scalable-react-applications'
		}
	];

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
					{recentPosts.map((post, index) => (
						<motion.div
							key={post.id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
							viewport={{ once: true }}
							className="bg-stone-700 rounded-lg p-6"
						>
							<div className="flex items-center gap-2 text-stone-400 text-sm mb-3">
								<span>{post.date}</span>
								<span>•</span>
								<span>{post.readTime}</span>
							</div>
							<h3 className="text-xl font-bold text-white mb-3">
								{post.title}
							</h3>
							<p className="text-stone-300 mb-4">
								{post.excerpt}
							</p>
							<Link 
								href={`/blog/${post.slug}`}
								className="text-stone-300 hover:text-white transition-colors"
							>
								Read More →
							</Link>
						</motion.div>
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
						className="bg-blue-600 hover:bg-blue-700 text-white"
						asChild
						aria-describedby="read-blog-description"
					>
						<Link 
							href="/blog"
							aria-label="Read all blog posts and articles"
						>
							Read the Blog
                            <ArrowRight 
								className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
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