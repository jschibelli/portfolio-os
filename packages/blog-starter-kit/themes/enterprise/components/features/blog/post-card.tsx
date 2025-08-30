import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { CalendarIcon, ClockIcon, ArrowRightIcon } from 'lucide-react';
import { Post } from '../../../data/posts';

interface PostCardProps {
  post: Post;
  index: number;
}

export default function PostCard({ post, index }: PostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className="h-full group hover:shadow-lg transition-all duration-300 border-stone-200 dark:border-stone-800">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4 text-sm text-stone-500 dark:text-stone-400 mb-2">
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              <span>{formatDate(post.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Excerpt */}
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>

          {/* Read More Link */}
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 font-medium transition-colors group/link"
          >
            Read More
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
