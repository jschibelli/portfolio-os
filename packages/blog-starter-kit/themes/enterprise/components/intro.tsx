import React from 'react';
import { motion } from 'framer-motion';
import { Separator } from './ui/separator';

export default function Intro() {
  return (
    <section className="py-16 bg-stone-50 dark:bg-stone-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Avatar/Monogram */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-stone-600 to-stone-800 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl md:text-3xl font-bold tracking-wider">
                  JS
                </span>
              </div>
            </div>

            {/* Introduction Text */}
            <div className="flex-1 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-100">
                About Me
              </h2>
              <div className="prose prose-stone dark:prose-invert max-w-none">
                <p className="text-lg text-stone-700 dark:text-stone-300 leading-relaxed">
                  I&apos;m a senior front-end developer with over 8 years of experience building 
                  modern web applications. I specialize in React, Next.js, and TypeScript, 
                  with a passion for creating accessible, performant, and user-centered experiences. 
                  My expertise extends to AI-driven development workflows and helping teams 
                  leverage cutting-edge technologies to deliver exceptional digital products.
                </p>
                <p className="text-lg text-stone-700 dark:text-stone-300 leading-relaxed">
                  When I&apos;m not coding, you&apos;ll find me writing about development best practices, 
                  contributing to open source projects, or exploring the latest in AI and automation tools.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Light Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Separator className="bg-stone-200 dark:bg-stone-800" />
        </motion.div>
      </div>
    </section>
  );
}
