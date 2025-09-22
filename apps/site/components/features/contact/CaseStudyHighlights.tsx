"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Users, Clock } from 'lucide-react';
import { Badge } from '../../ui/badge';
import { Container } from '../../shared/container';
import Link from 'next/link';

interface CaseStudyHighlight {
  id: string;
  title: string;
  description: string;
  metrics: {
    primary: string;
    secondary: string;
  };
  tags: string[];
  caseStudyUrl: string;
  image: string;
}

const caseStudyHighlights: CaseStudyHighlight[] = [
  {
    id: "tendrilo",
    title: "Tendril Multi-Tenant Chatbot SaaS",
    description: "Strategic analysis and implementation plan for AI-powered customer engagement platform",
    metrics: {
      primary: "150% Revenue Increase",
      secondary: "91% User Retention"
    },
    tags: ["SaaS", "AI", "Multi-tenant"],
    caseStudyUrl: "/case-studies/tendrilo-case-study",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop"
  },
  {
    id: "zeus-ecom",
    title: "Zeus E-Commerce Platform",
    description: "Scalable, mobile-first e-commerce experience with blazing-fast performance",
    metrics: {
      primary: "85% Sales Increase",
      secondary: "32% Less Cart Abandonment"
    },
    tags: ["E-commerce", "Next.js", "Performance"],
    caseStudyUrl: "/case-studies/zeus-ecommerce-platform",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop"
  },
  {
    id: "synaplyai",
    title: "SynaplyAI Collaboration Platform",
    description: "Real-time AI content collaboration with token-level conflict resolution",
    metrics: {
      primary: "200% User Growth",
      secondary: "75% Efficiency Gain"
    },
    tags: ["AI", "Collaboration", "Real-time"],
    caseStudyUrl: "/case-studies/synaplyai",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
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
 * CaseStudyHighlights component displays featured case studies with metrics
 * to demonstrate successful project outcomes and build credibility
 */
export function CaseStudyHighlights() {
  return (
    <section className="bg-white py-16 dark:bg-stone-950" aria-labelledby="case-studies-heading">
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
            <h2 id="case-studies-heading" className="mb-4 text-3xl font-bold text-stone-900 md:text-4xl dark:text-stone-100">
              Recent Success Stories
            </h2>
            <p className="text-lg text-stone-600 dark:text-stone-400">
              See how I've helped clients achieve remarkable results with modern web development
            </p>
          </motion.div>

          {/* Case Studies Grid */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {caseStudyHighlights.map((caseStudy) => (
              <motion.div
                key={caseStudy.id}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-xl border border-stone-200 bg-white transition-all duration-300 hover:border-stone-300 hover:shadow-xl dark:border-stone-700 dark:bg-stone-800 dark:hover:border-stone-600"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={caseStudy.image}
                    alt={`${caseStudy.title} - ${caseStudy.description}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Tags */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {caseStudy.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-semibold text-stone-900 dark:text-stone-100">
                    {caseStudy.title}
                  </h3>
                  <p className="mb-4 text-sm text-stone-600 dark:text-stone-400">
                    {caseStudy.description}
                  </p>

                  {/* Metrics */}
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">
                        {caseStudy.metrics.primary}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        {caseStudy.metrics.secondary}
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    href={caseStudy.caseStudyUrl}
                    className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
                  >
                    Read Case Study
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            variants={itemVariants}
            className="mt-12 text-center"
          >
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-8 dark:border-stone-700 dark:bg-stone-900">
              <h3 className="mb-4 text-2xl font-bold text-stone-900 dark:text-stone-100">
                Ready to Start Your Success Story?
              </h3>
              <p className="mb-6 text-stone-600 dark:text-stone-400">
                Let's discuss how I can help you achieve similar results for your project
              </p>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
                  <Clock className="h-4 w-4" />
                  <span>Free consultation • 30 minutes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
                  <Users className="h-4 w-4" />
                  <span>No commitment required</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
