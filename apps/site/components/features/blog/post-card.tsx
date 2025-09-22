import { motion } from 'framer-motion';
import { ArrowRightIcon, CalendarIcon, ClockIcon } from 'lucide-react';
import Link from 'next/link';
import { Post } from '../../../data/posts';
import { Card, CardContent, CardHeader } from '../../ui/card';

interface PostCardProps {
	post: Post;
	index: number;
}

export default function PostCard({ post, index }: PostCardProps) {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
			viewport={{ once: true }}
			whileHover={{ y: -4 }}
			className="h-full"
		>
			<Card className="group h-full border-border transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
				<CardHeader className="pb-4">
					<div className="mb-2 flex items-center gap-4 text-sm text-stone-500 dark:text-stone-400">
						<div className="flex items-center gap-1">
							<CalendarIcon className="h-4 w-4" />
							<span>{formatDate(post.date)}</span>
						</div>
						<div className="flex items-center gap-1">
							<ClockIcon className="h-4 w-4" />
							<span>{post.readTime}</span>
						</div>
					</div>
					<h3 className="line-clamp-2 text-xl font-bold text-foreground transition-colors group-hover:text-foreground">
						{post.title}
					</h3>
				</CardHeader>

				<CardContent className="space-y-4">
					{/* Excerpt */}
					<p className="line-clamp-3 leading-relaxed text-muted-foreground">
						{post.excerpt}
					</p>

					{/* Read More Link */}
					<Link
						href={`/blog/${post.slug}`}
						className="group/link inline-flex items-center gap-2 font-medium text-foreground transition-colors hover:text-foreground"
					>
						Read More
						<ArrowRightIcon className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
					</Link>
				</CardContent>
			</Card>
		</motion.div>
	);
}
