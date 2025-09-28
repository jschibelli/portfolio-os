"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  CodeIcon, 
  UsersIcon, 
  ClockIcon, 
  GlobeIcon,
  StarIcon,
  AwardIcon
} from 'lucide-react';
import { Container } from '../../shared/container';

interface StatItem {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  description: string;
}

const stats: StatItem[] = [
  {
    icon: CodeIcon,
    value: "Multiple",
    label: "Projects Completed",
    description: "Successfully delivered across various industries"
  },
  {
    icon: UsersIcon,
    value: "Strong",
    label: "Client Relationships",
    description: "From startups to enterprise companies"
  },
  {
    icon: ClockIcon,
    value: "15+",
    label: "Years Experience",
    description: "Senior-level expertise in web development"
  },
  {
    icon: GlobeIcon,
    value: "100%",
    label: "Remote Capable",
    description: "Serving clients worldwide from Northern NJ"
  },
  {
    icon: StarIcon,
    value: "Quality",
    label: "Focused Approach",
    description: "Every project delivered with excellence"
  },
  {
    icon: AwardIcon,
    value: "24h",
    label: "Response Time",
    description: "Quick turnaround on all inquiries"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

/**
 * QuickStats component displays key performance metrics and statistics
 * to showcase experience and success rate
 */
export function QuickStats() {
  return (
    <section className="bg-stone-100 py-16 dark:bg-stone-800" aria-labelledby="quick-stats-heading">
      <Container className="px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="mx-auto max-w-6xl"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="mb-12 text-center">
            <h2 id="quick-stats-heading" className="mb-4 text-3xl font-bold text-stone-900 md:text-4xl dark:text-stone-100">
              By the Numbers
            </h2>
            <p className="text-lg text-stone-600 dark:text-stone-400">
              Proven track record of delivering exceptional results
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-xl border border-stone-200 bg-white p-6 text-center transition-all duration-300 hover:border-stone-300 hover:shadow-lg dark:border-stone-600 dark:bg-stone-700 dark:hover:border-stone-500"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                  <div className="h-full w-full bg-gradient-to-br from-stone-400 to-stone-600" />
                </div>
                
                <div className="relative">
                  {/* Icon */}
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-600">
                    <stat.icon className="h-8 w-8 text-stone-600 dark:text-stone-300" />
                  </div>

                  {/* Value */}
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-stone-900 dark:text-stone-100">
                      {stat.value}
                    </span>
                  </div>

                  {/* Label */}
                  <h3 className="mb-2 text-lg font-semibold text-stone-900 dark:text-stone-100">
                    {stat.label}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-stone-600 dark:text-stone-400">
                    {stat.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div 
            variants={itemVariants}
            className="mt-12 text-center"
          >
            <div className="rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-600 dark:bg-stone-700">
              <p className="text-stone-600 dark:text-stone-400">
                <span className="font-semibold text-stone-900 dark:text-stone-100">
                  Ready to join these success stories?
                </span>
                <br />
                Let's discuss your project and see how I can help you achieve similar results.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
