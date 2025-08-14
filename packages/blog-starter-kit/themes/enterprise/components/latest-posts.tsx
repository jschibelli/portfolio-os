import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ArrowRightIcon } from 'lucide-react';
import PostCard from './post-card';
import { recentPosts } from '../data/posts';

export default function LatestPosts() {
  return (
    <section className="py-20 bg-stone-50 dark:bg-stone-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4">
            Latest from the Blog
          </h2>
          <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            Insights, tutorials, and thoughts on modern web development and technology
          </p>
        </motion.div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {recentPosts.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))}
        </div>

        {/* Read the Blog CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            size="lg"
            className="group bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200 font-semibold px-8 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
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
