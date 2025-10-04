"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { Layout } from '../../components/shared/layout';
import { Container } from '../../components/shared/container';
import { Button } from '../../components/ui/button';
import Chatbot from '../../components/features/chatbot/Chatbot';
import { Timeline, TimelineItem } from '../../components/ui/timeline';

import {
  ArrowRight,
  Brackets,
  Briefcase,
  Calendar,
  Clock,
  Code,
  GraduationCap,
  Lightbulb,
  Linkedin,
  MapPin,
  Building,
  Star,
  TrendingUp,
  Users,
  Zap,
  CheckCircle,
  Mail,
} from 'lucide-react';

const stats = [
  { icon: MapPin, label: 'Towaco, NJ' },
  { icon: Briefcase, label: 'Senior Level' },
  { icon: Calendar, label: 'Available' },
];

// Experience entries from enterprise about page (used in Career Journey timeline)
const experience = [
  {
    title: 'Senior Front-End Developer',
    company: 'Freelance & Consulting',
    period: '2020 - Present',
    description: 'Building scalable React and Next.js applications for clients across various industries. Specializing in modern web development practices, AI integration, and performance optimization.',
    achievements: [
      'Developed 15+ production React applications',
      'Implemented AI-powered features in web applications',
      'Achieved high Lighthouse performance scores',
      'Led technical architecture decisions for enterprise clients'
    ],
    technologies: ['React', 'Next.js', 'TypeScript', 'AI Integration', 'Performance Optimization']
  },
  {
    title: 'Frontend Developer',
    company: 'Previous Positions',
    period: '2010 - 2020',
    description: 'Gained extensive experience in front-end development, working with various frameworks and technologies across different industries.',
    achievements: [
      'Built responsive web applications for multiple industries',
      'Collaborated with cross-functional teams',
      'Mentored junior developers',
      'Implemented modern development practices'
    ],
    technologies: ['JavaScript', 'React', 'Vue.js', 'CSS', 'HTML5']
  }
];

const skills = [
  { category: 'Frontend Frameworks', items: ['React', 'Next.js', 'Vue.js', 'TypeScript'] },
  { category: 'Styling & Design', items: ['Tailwind CSS', 'Styled Components', 'CSS Modules', 'Responsive Design'] },
  { category: 'Tools & Technologies', items: ['Git', 'Webpack', 'Vite', 'ESLint', 'Prettier'] },
  { category: 'AI & Automation', items: ['OpenAI Integration', 'Workflow Automation', 'AI-Powered Features'] },
];

const values = [
  {
    icon: Code,
    title: 'Clean Code',
    description: 'Writing maintainable, scalable, and well-documented code that stands the test of time.'
  },
  {
    icon: Zap,
    title: 'Performance',
    description: 'Optimizing for speed, accessibility, and user experience in every project.'
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Staying current with the latest technologies and best practices in web development.'
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'Working closely with clients and teams to deliver solutions that meet business goals.'
  }
];

export function AboutPageClient() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 flex items-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat" />
        </div>

        <Container className="relative z-10 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.0, delay: 0.2, ease: 'easeOut' }}
                className="flex justify-center lg:justify-start mb-8"
              >
                {/* Portrait */}
                <div className="relative group">
                  <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-white/20 via-white/10 to-white/20 backdrop-blur-md opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  <div className="relative h-64 w-64 overflow-hidden rounded-full bg-gradient-to-br from-stone-200/30 to-stone-300/20 backdrop-blur-sm shadow-2xl md:h-80 md:w-80 lg:h-96 lg:w-96">
                    <Image
                      src="/assets/hero/profile.png"
                      alt="John Schibelli - Senior Front-End Developer"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority
                    />
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
                    className="absolute -bottom-3 -right-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 shadow-2xl backdrop-blur-sm border-2 border-white/20 md:h-20 md:w-20"
                  >
                    <Brackets className="h-8 w-8 text-white md:h-10 md:w-10" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Copy */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.0, delay: 0.4, ease: 'easeOut' }}
                className="text-center lg:text-left"
              >
                <div className="mb-6">
                  <p className="text-lg font-medium text-stone-300 md:text-xl lg:text-2xl tracking-wide">
                    Helping Transform Ideas Into Digital Solutions
                  </p>
                </div>
                <h1 className="mb-6 text-4xl font-bold tracking-tight text-white leading-tight md:text-5xl lg:text-6xl">
                  John Schibelli
                </h1>
                <p className="mb-6 text-xl font-semibold text-stone-200 md:text-2xl lg:text-3xl">
                  Senior Front-End Developer
                </p>
                <p className="mb-8 text-base leading-relaxed text-stone-300 md:text-lg lg:text-xl max-w-2xl mx-auto lg:mx-0">
                  Building high-performance web applications that support business growth. I work with React, Next.js, and TypeScript with 15+ years of experience creating scalable digital experiences that help clients achieve their goals.
                </p>

                <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:justify-start">
                  {stats.map(({ icon: Icon, label }) => (
                    <div key={label} className="rounded-xl bg-white/15 p-6 backdrop-blur-md border border-white/25 shadow-xl">
                      <div className="flex items-center justify-center gap-3 text-stone-200 lg:justify-start">
                        <Icon className="h-6 w-6 text-stone-300" />
                        <span className="text-base font-semibold md:text-lg">{label}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-stone-900 hover:bg-stone-100 transition-colors duration-200 font-semibold px-8 py-4"
                  >
                    <Link href="/contact">
                      <Mail className="mr-2 h-5 w-5" />
                      Get In Touch
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10 transition-colors duration-200 font-semibold px-8 py-4"
                  >
                    <Link href="/projects">
                      View My Work
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Right side - Skills & Values */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.0, delay: 0.6, ease: 'easeOut' }}
              className="space-y-8"
            >
              {/* Values */}
              <div className="grid grid-cols-1 gap-6">
                {values.map(({ icon: Icon, title, description }, index) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                    className="rounded-xl bg-white/10 p-6 backdrop-blur-md border border-white/20 shadow-xl hover:bg-white/15 transition-colors duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-white/20">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
                        <p className="text-stone-300 leading-relaxed">{description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Skills Section */}
      <section className="py-20 bg-white dark:bg-stone-950">
        <Container className="px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="mb-6 text-4xl font-bold text-stone-900 dark:text-stone-100 md:text-5xl">
              Technical Expertise
            </h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-stone-600 dark:text-stone-400">
              A comprehensive skill set built over 15+ years of front-end development experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {skills.map(({ category, items }, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-xl bg-stone-50 dark:bg-stone-900 p-8 border border-stone-200 dark:border-stone-800"
              >
                <h3 className="mb-4 text-xl font-semibold text-stone-900 dark:text-stone-100">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-sm font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Career Journey */}
      <section className="py-20 bg-stone-50 dark:bg-stone-900">
        <Container className="px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="mb-6 text-4xl font-bold text-stone-900 dark:text-stone-100 md:text-5xl">
              Career Journey
            </h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-stone-600 dark:text-stone-400">
              A timeline of my professional development and key achievements
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <Timeline>
              {experience.map((item, index) => (
                <TimelineItem key={index}>
                  <div className="rounded-xl bg-white dark:bg-stone-800 p-8 border border-stone-200 dark:border-stone-700 shadow-lg">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                          {item.title}
                        </h3>
                        <p className="text-lg font-medium text-stone-600 dark:text-stone-400">
                          {item.company}
                        </p>
                      </div>
                      <span className="mt-2 md:mt-0 px-3 py-1 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 text-sm font-medium">
                        {item.period}
                      </span>
                    </div>
                    
                    <p className="mb-4 text-stone-600 dark:text-stone-400 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mb-4">
                      <h4 className="mb-2 text-sm font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide">
                        Key Achievements
                      </h4>
                      <ul className="space-y-1">
                        {item.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-stone-600 dark:text-stone-400">
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide">
                        Technologies
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {item.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 rounded bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </TimelineItem>
              ))}
            </Timeline>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-stone-900 to-stone-800">
        <Container className="px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Ready to Work Together?
            </h2>
            <p className="mb-8 mx-auto max-w-2xl text-lg leading-relaxed text-stone-300">
              Let's discuss how I can help bring your next project to life with modern, scalable front-end solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-stone-900 hover:bg-stone-100 transition-colors duration-200 font-semibold px-8 py-4"
              >
                <Link href="/contact">
                  <Mail className="mr-2 h-5 w-5" />
                  Start a Project
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 transition-colors duration-200 font-semibold px-8 py-4"
              >
                <Link href="/projects">
                  View Portfolio
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>

      <Chatbot />
    </Layout>
  );
}
