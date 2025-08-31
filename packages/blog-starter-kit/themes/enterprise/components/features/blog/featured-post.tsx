import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Badge } from '../../ui/badge';
import { ArrowRightIcon, CalendarIcon, ClockIcon } from 'lucide-react';
import { PostFragment } from '../../../generated/graphql';

interface FeaturedPostProps {
  post: PostFragment;
  coverImage: string;
  readTime: string;
  tags: string[];
}

export default function FeaturedPost({ post, coverImage, readTime, tags }: FeaturedPostProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="group relative overflow-hidden rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="grid lg:grid-cols-2 gap-0">
        {/* Left Section - Image */}
        <div className="relative group">
          <div className="relative overflow-hidden rounded-l-xl">
            <Image
              src={coverImage}
              alt={post.title}
              width={600}
              height={500}
              className="w-full h-[400px] lg:h-[500px] object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <Badge
              variant="secondary"
              className="absolute top-4 left-4 bg-white/90 dark:bg-stone-800/90 text-stone-700 dark:text-stone-300 border-0"
            >
              Featured
            </Badge>
          </div>
        </div>

        {/* Right Section - Content */}
        <div className="p-8 lg:p-10 flex flex-col justify-center">
          <div className="space-y-6">
            {/* Metadata */}
            <div className="flex items-center gap-4 text-sm text-stone-500 dark:text-stone-400">
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                <span>{readTime}</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-3xl lg:text-4xl font-bold text-stone-900 dark:text-stone-100 leading-tight">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">
              {post.brief}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Call to Action */}
            <Link
              href={`/${post.slug}`}
              className="inline-flex items-center gap-2 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 font-semibold text-lg transition-colors group"
            >
              Read full article
              <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
