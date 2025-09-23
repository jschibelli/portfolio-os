"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon, 
  ClockIcon, 
  StarIcon, 
  UsersIcon, 
  CheckCircleIcon,
  AwardIcon,
  GlobeIcon,
  LockIcon
} from 'lucide-react';
import { Badge } from '../../ui/badge';
import { Container } from '../../shared/container';

interface TrustSignal {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  highlight?: string;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
}

const trustSignals: TrustSignal[] = [
  {
    icon: StarIcon,
    title: "100% Client Satisfaction",
    description: "Every project delivered with excellence",
    highlight: "100%",
    variant: "default"
  },
  {
    icon: AwardIcon,
    title: "15+ Years Experience",
    description: "Senior-level expertise in modern web development",
    highlight: "15+",
    variant: "secondary"
  },
  {
    icon: ClockIcon,
    title: "24h Response Time",
    description: "Quick turnaround on all inquiries",
    highlight: "24h",
    variant: "outline"
  },
  {
    icon: UsersIcon,
    title: "50+ Projects Delivered",
    description: "Successful projects across various industries",
    highlight: "50+",
    variant: "default"
  },
  {
    icon: GlobeIcon,
    title: "Global Reach",
    description: "Northern NJ based, serving clients worldwide",
    highlight: "Global",
    variant: "secondary"
  },
  {
    icon: ShieldCheckIcon,
    title: "Security Assured",
    description: "Your data is protected with enterprise-grade security",
    highlight: "Secure",
    variant: "outline"
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
 * TrustSignals component displays key trust indicators and social proof
 * to build confidence with potential clients
 */
export function TrustSignals() {
  return (
    <section className="bg-stone-50 py-16 dark:bg-stone-900" aria-labelledby="trust-signals-heading">
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
            <h2 id="trust-signals-heading" className="mb-4 text-3xl font-bold text-stone-900 md:text-4xl dark:text-stone-100">
              Why Choose Me?
            </h2>
            <p className="text-lg text-stone-600 dark:text-stone-400">
              Trusted by clients worldwide for exceptional web development services
            </p>
          </motion.div>

          {/* Trust Signals Grid */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {trustSignals.map((signal, index) => (
              <motion.div
                key={signal.title}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-xl border border-stone-200 bg-white p-6 transition-all duration-300 hover:border-stone-300 hover:shadow-lg dark:border-stone-700 dark:bg-stone-800 dark:hover:border-stone-600"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                  <div className="h-full w-full bg-gradient-to-br from-stone-400 to-stone-600" />
                </div>
                
                <div className="relative">
                  {/* Icon */}
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-700">
                    <signal.icon className="h-6 w-6 text-stone-600 dark:text-stone-400" />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                        {signal.title}
                      </h3>
                      {signal.highlight && (
                        <Badge variant={signal.variant} className="text-xs">
                          {signal.highlight}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-stone-600 dark:text-stone-400">
                      {signal.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Security & Privacy Assurance */}
          <motion.div 
            variants={itemVariants}
            className="mt-12 rounded-xl border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-800">
                <LockIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-green-800 dark:text-green-200">
                  Your Privacy & Security Matter
                </h3>
                <p className="text-green-700 dark:text-green-300">
                  All form submissions are encrypted and secure. Your personal information is never shared with third parties. 
                  I follow industry best practices for data protection and privacy compliance.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
