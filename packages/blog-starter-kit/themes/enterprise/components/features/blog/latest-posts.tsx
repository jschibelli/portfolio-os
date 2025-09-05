import { motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import { recentPosts } from '../../../data/posts';
import { Button } from '../../ui/button';
import PostCard from './post-card';

export default function LatestPosts() {
	return (
		<section className="bg-stone-50 py-20 dark:bg-stone-900">
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
						<PostCard key={post.id} post={post} index={index} />
					))}
				</div>

				{/* Read the Blog CTA */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
					viewport={{ once: true }}
					className="text-center"
				>
					<Button
						size="lg"
						className="group bg-stone-900 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-stone-800 hover:shadow-xl dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
						asChild
					>
						<Link href="/blog">
							Read the Blog
							<ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
						</Link>
					</Button>
				</motion.div>
			</div>
		</section>
	);
}
