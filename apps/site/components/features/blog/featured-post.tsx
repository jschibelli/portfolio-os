"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Badge } from '../../ui';
import { ArrowRightIcon, CalendarIcon, ClockIcon } from 'lucide-react';
import { PostFragment } from '../../../generated/graphql';
import { useState, useEffect } from 'react';

interface FeaturedPostProps {
  post: PostFragment;
  coverImage: string;
  readTime: string;
  tags: string[];
}

export default function FeaturedPost({ post, coverImage, readTime, tags }: FeaturedPostProps) {
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <section className="bg-stone-50 py-8 dark:bg-stone-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Featured Post</h2>
            <Badge
              variant="secondary"
              className="bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300"
            >
              Featured
            </Badge>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2"
        >
          {/* Left Section - Image */}
          <div className="group relative">
            <div className="relative overflow-hidden rounded-lg">
              {!imageError && coverImage ? (
                <Image
                  src={coverImage}
                  alt={`Featured article cover image: ${post.title}`}
                  width={600}
                  height={500}
                  className="h-[400px] w-full object-cover transition-transform duration-500 group-hover:scale-105 lg:h-[500px]"
                  onError={handleImageError}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                  quality={85}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
              ) : (
                <div className="flex h-[400px] w-full items-center justify-center bg-stone-200 dark:bg-stone-800 lg:h-[500px]">
                  <div className="text-center">
                    <div className="text-sm text-stone-500 dark:text-stone-400 mb-1">
                      {imageError ? 'Image failed to load' : 'No image available'}
                    </div>
                    <div className="text-xs text-stone-400 dark:text-stone-500">
                      {post.title}
                    </div>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <Badge
                variant="secondary"
                className="absolute left-4 top-4 bg-white/90 text-stone-700 dark:bg-stone-800/90 dark:text-stone-300"
              >
                Featured
              </Badge>
            </div>
          </div>

          {/* Right Section - Content */}
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
            <h3 className="text-3xl font-bold leading-tight text-stone-900 lg:text-4xl dark:text-stone-100">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-lg leading-relaxed text-stone-600 dark:text-stone-400">
              {post.brief}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-stone-300 text-stone-700 dark:border-stone-600 dark:text-stone-300"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Call to Action */}
            <Link
              href={`/${post.slug}`}
              className="group inline-flex items-center gap-2 text-lg font-semibold text-stone-700 transition-colors hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-100"
            >
              Read full article
              <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
