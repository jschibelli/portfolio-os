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
    company: 'IntraWeb Technology',
    period: '2020 - Present',
    location: 'Montville, NJ',
    description:
      'Lead front-end for company site and client projects; incubated SynaplyAI.',
    achievements: [
      'Built the IntraWeb Technologies website with Next.js, React, TypeScript, and Tailwind CSS; shipped an accessible, SEO-optimized presence.',
      'Delivered custom WordPress and Shopify builds emphasizing mobile performance and SEO for clients including KAL Design.',
      'Scoped requirements, owned timelines, and served as primary client liaison to ensure quality delivery and satisfaction.',
      'Incubated SynaplyAI (multi-tenant AI content collaboration) with front-end architecture, OpenAI integrations, real-time collab editing, and adaptive AI content generation.',
    ],
    logo: '/assets/personal-logo.png',
  },
  {
    title: 'Full-Stack Developer',
    company: 'ColorStreet',
    period: '2024',
    location: 'Totowa, NJ',
    description: 'Contributed to e-commerce platform quality and integrations.',
    achievements: [
      'Implemented automated UI testing with Playwright, improving reliability across releases.',
      'Integrated and validated Nest.js APIs; ensured stable data flow and interface alignment.',
      'Partnered with QA, design, and product to support sprint delivery and UI improvements.',
    ],
    logo: '/assets/personal-logo.png',
  },
  {
    title: 'Senior Front-End Developer',
    company: 'Executive Five Star',
    period: '2016 - 2020',
    location: 'Montville, NJ',
    description: "Owned front-end for the company's car service site and online booking.",
    achievements: [
      'Developed and maintained the primary WordPress site with improved usability and mobile responsiveness.',
      'Integrated Limo Anywhere API for real-time reservations and back-office sync.',
      'Streamlined dispatch workflows by connecting booking front-end to internal systems.',
    ],
    logo: '/assets/personal-logo.png',
  },
  {
    title: 'Front-End Developer',
    company: 'Robert Half Technology',
    period: '2013 - 2016',
    location: 'Parsippany, NJ',
    description: 'Built enterprise UIs and internal tooling in JavaScript ecosystems.',
    achievements: [
      'Developed UIs for internal financial platforms using JavaScript, jQuery, and Bootstrap to improve reporting workflows.',
      'Built interactive presentation tools for pharmaceutical clients using Veeva CRM and HTML5.',
      'Delivered front-end features aligned with enterprise UX guidelines in Agile cycles.',
      'Led multiple internal WordPress projects and mentored junior developers on front-end best practices.',
    ],
    logo: '/assets/personal-logo.png',
  },
  {
    title: 'Web Developer (Contract)',
    company: 'Level-Nine Creative',
    period: '2009 - 2013',
    location: 'Merritt Island, FL',
    description: 'Delivered custom WordPress sites for small businesses and agencies.',
    achievements: [
      'Designed and developed custom websites using WordPress, PHP, JavaScript, and CSS.',
      'Built reusable UI components for responsive, cross-browser performance.',
      'Customized themes/plugins to support marketing workflows and SEO.',
    ],
    logo: '/assets/personal-logo.png',
  },
  {
    title: 'Web Development Program Director',
    company: 'Anthem Institute',
    period: '2005 - 2009',
    location: 'Parsippany, NJ',
    description: 'Led curriculum and instruction across multiple campuses.',
    achievements: [
      'Taught HTML, CSS, JavaScript, PHP, and MySQL; built industry-ready skills.',
      'Managed a team of 8 instructors across 4 campuses; ensured curriculum alignment.',
      'Oversaw accreditation compliance; partnered with Pearson VUE for certification programs.',
    ],
    logo: '/assets/personal-logo.png',
  },
];

export default function AboutPage() {
  return (
    <Layout>
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative min-h-[500px] overflow-hidden py-16 md:py-24">
          <div className="absolute inset-0 z-0">
            <div className="h-full w-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/assets/hero/hero-bg.png)' }} />
            <div className="absolute inset-0 bg-gradient-to-br from-stone-900/95 via-stone-900/85 to-stone-800/75" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-transparent to-stone-900/50" />
          </div>

          <div className="relative z-10">
            <Container className="px-4">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.0, ease: 'easeOut' }} className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">
                  {/* Portrait */}
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.0, delay: 0.2, ease: 'easeOut' }} className="flex justify-center lg:justify-start">
                    <div className="relative group">
                      <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-white/20 via-white/10 to-white/20 backdrop-blur-md opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                      <div className="relative h-64 w-64 overflow-hidden rounded-full bg-gradient-to-br from-stone-200/30 to-stone-300/20 backdrop-blur-sm shadow-2xl md:h-80 md:w-80 lg:h-96 lg:w-96">
                        <Image src="/assets/hero/profile.png" alt="John Schibelli - Senior Front-End Developer" fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
                      </div>
                      <motion.div initial={{ opacity: 0, scale: 0, rotate: -180 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }} className="absolute -bottom-3 -right-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 shadow-2xl backdrop-blur-sm border-2 border-white/20 md:h-20 md:w-20">
                        <Brackets className="h-8 w-8 text-white md:h-10 md:w-10" />
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Copy */}
                  <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.0, delay: 0.4, ease: 'easeOut' }} className="text-center lg:text-left">
                    <div className="mb-6">
                      <p className="text-lg font-medium text-stone-300 md:text-xl lg:text-2xl tracking-wide">Helping Transform Ideas Into Digital Solutions</p>
                    </div>
                    <h1 className="mb-6 text-4xl font-bold tracking-tight text-white leading-tight md:text-5xl lg:text-6xl">John Schibelli</h1>
                    <p className="mb-6 text-xl font-semibold text-stone-200 md:text-2xl lg:text-3xl">Senior Front-End Developer</p>
                    <p className="mb-8 text-base leading-relaxed text-stone-300 md:text-lg lg:text-xl max-w-2xl mx-auto lg:mx-0">Working to build web applications that support business objectives. I work with React, Next.js, and TypeScript with experience creating scalable digital experiences that help clients achieve their goals.</p>

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

                    <div className="flex flex-col justify-center gap-6 sm:flex-row lg:justify-start">
                      <Button size="lg" className="min-w-[200px] justify-center bg-white/25 backdrop-blur-md border border-white/40 text-white hover:bg-white/35 hover:border-white/60 transition-all duration-300 shadow-xl hover:shadow-2xl text-lg font-semibold py-6" asChild>
                        <Link href="/contact">Get In Touch <ArrowRight className="ml-2 h-5 w-5" /></Link>
                      </Button>
                      <Button size="lg" variant="outline" className="min-w-[180px] justify-center border-white/40 text-white hover:bg-white/15 hover:border-white/60 transition-all duration-300 shadow-xl hover:shadow-2xl text-lg font-semibold py-6 backdrop-blur-sm" asChild>
                        <Link href="/projects">View My Projects</Link>
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </Container>
          </div>
        </section>

        {/* Personal Story Section (from enterprise) */}
        <section className="bg-muted py-20">
          <Container className="px-4">
            <div className="mx-auto max-w-6xl">
              <div className="mb-16 text-center">
                <h2 className="mb-4 text-3xl font-bold text-stone-900 md:text-4xl dark:text-stone-100">My Journey</h2>
                <p className="text-lg text-stone-600 dark:text-stone-400">From teaching to development: A story of resilience, learning, and growth</p>
              </div>

              {/* Timeline Container */}
              <div className="relative">
                {/* Vertical Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-stone-300 via-stone-400 to-stone-300 dark:from-stone-600 dark:via-stone-500 dark:to-stone-600 md:left-1/2 md:-translate-x-px"></div>

                {/* Timeline Items */}
                <div className="space-y-12">
                  {/* Teaching Era */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    viewport={{ once: true }}
                    className="relative flex items-start gap-8 md:gap-12"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-6 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-stone-900 shadow-lg md:left-1/2 md:-translate-x-2 dark:bg-stone-100">
                      <div className="h-2 w-2 rounded-full bg-white dark:bg-stone-900"></div>
                    </div>

                    {/* Content */}
                    <div className="ml-16 flex-1 md:ml-0 md:flex-none md:w-1/2 md:pr-12">
                      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-800">
                            <GraduationCap className="h-6 w-6 text-stone-600 dark:text-stone-400" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100">The Teaching Years</h3>
                            <p className="text-sm text-stone-500 dark:text-stone-400">2005 - 2009</p>
                          </div>
                        </div>
                        <p className="text-stone-600 dark:text-stone-400">
                          As Web Development Program Director at Anthem Institute, I discovered my passion for making complex concepts accessible. Teaching HTML, CSS, JavaScript, and PHP to students across multiple campuses taught me that <strong className="text-stone-900 dark:text-stone-100">code should be teachable and maintainable</strong> – principles that still guide my development approach today.
                        </p>
                      </div>
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="hidden md:block md:w-1/2"></div>
                  </motion.div>

                  {/* Challenge & Recovery */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    viewport={{ once: true }}
                    className="relative flex items-start gap-8 md:gap-12"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-6 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-stone-900 shadow-lg md:left-1/2 md:-translate-x-2 dark:bg-stone-100">
                      <div className="h-2 w-2 rounded-full bg-white dark:bg-stone-900"></div>
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="hidden md:block md:w-1/2"></div>

                    {/* Content */}
                    <div className="ml-16 flex-1 md:ml-0 md:flex-none md:w-1/2 md:pl-12">
                      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-800">
                            <Star className="h-6 w-6 text-stone-600 dark:text-stone-400" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100">Overcoming Challenges</h3>
                            <p className="text-sm text-stone-500 dark:text-stone-400">Personal Growth</p>
                          </div>
                        </div>
                        <p className="text-stone-600 dark:text-stone-400">
                          Life presented unexpected challenges that tested my resilience. Through these experiences, I learned that <strong className="text-stone-900 dark:text-stone-100">perseverance and adaptability are as crucial in life as they are in code</strong>. This deepened my understanding of accessibility and inclusive design – principles I now champion in every project.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Evolution to Modern Development */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    viewport={{ once: true }}
                    className="relative flex items-start gap-8 md:gap-12"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-6 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-stone-900 shadow-lg md:left-1/2 md:-translate-x-2 dark:bg-stone-100">
                      <div className="h-2 w-2 rounded-full bg-white dark:bg-stone-900"></div>
                    </div>

                    {/* Content */}
                    <div className="ml-16 flex-1 md:ml-0 md:flex-none md:w-1/2 md:pr-12">
                      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-800">
                            <Brackets className="h-6 w-6 text-stone-600 dark:text-stone-400" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100">Modern Development</h3>
                            <p className="text-sm text-stone-500 dark:text-stone-400">2009 - Present</p>
                          </div>
                        </div>
                        <p className="text-stone-600 dark:text-stone-400">
                          My journey evolved from WordPress customization to building enterprise-scale applications with React, Next.js, and AI integrations. The educator in me still shines through – I believe in <strong className="text-stone-900 dark:text-stone-100">writing code that tells a story</strong>, documenting thoroughly, and mentoring team members to ensure every project is built for the long term.
                        </p>
                      </div>
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="hidden md:block md:w-1/2"></div>
                  </motion.div>

                  {/* Current Mission */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    viewport={{ once: true }}
                    className="relative flex items-start gap-8 md:gap-12"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-6 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-stone-600 to-stone-800 shadow-lg md:left-1/2 md:-translate-x-2 dark:from-stone-300 dark:to-stone-100">
                      <div className="h-2 w-2 rounded-full bg-white dark:bg-stone-900"></div>
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="hidden md:block md:w-1/2"></div>

                    {/* Content */}
                    <div className="ml-16 flex-1 md:ml-0 md:flex-none md:w-1/2 md:pl-12">
                      <div className="rounded-lg border-2 border-primary/20 bg-gradient-to-br from-card to-accent/10 p-6 shadow-lg">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/20">
                            <Lightbulb className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100">Today's Mission</h3>
                            <p className="text-sm text-stone-500 dark:text-stone-400">Building the Future</p>
                          </div>
                        </div>
                        <p className="text-stone-600 dark:text-stone-400">
                          As Founder and Lead Developer at IntraWeb Technologies, I'm exploring AI-driven solutions like SynaplyAI and their potential in web development. My mission: <strong className="text-stone-900 dark:text-stone-100">contributing to technology that helps people</strong> – whether that's through accessible interfaces, intelligent automation, or mentoring the next generation of developers.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Philosophy Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                viewport={{ once: true }}
                className="mt-16 rounded-lg border border-border bg-card p-8 shadow-sm"
              >
                <div className="text-center">
                  <h3 className="mb-4 text-2xl font-bold text-stone-900 dark:text-stone-100">My Development Philosophy</h3>
                  <p className="text-lg leading-relaxed text-stone-600 dark:text-stone-400">
                    <strong className="text-stone-900 dark:text-stone-100">Code is communication.</strong> Every line should be clear, every function should tell a story, and every system should be built with future developers in mind. This educator mindset drives me to create solutions that are not just functional, but truly maintainable and scalable.
                  </p>
                </div>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* Value Props + CTA */}
        <section className="bg-background py-20">
          <Container className="px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }} viewport={{ once: true }} className="mx-auto max-w-7xl">
              <div className="mb-16 text-center">
                <h2 className="mb-4 text-3xl font-bold text-stone-900 md:text-4xl dark:text-stone-100">Why Choose Me</h2>
                <p className="text-lg text-stone-600 dark:text-stone-400 max-w-3xl mx-auto">Results-focused development that supports business growth through collaborative web development and client partnerships</p>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    icon: CheckCircle,
                    title: 'Project Delivery',
                    metric: 'Multiple Projects',
                    copy:
                      'Delivered web applications and digital solutions across various industries, working with teams to build e-commerce platforms and AI-driven collaboration tools.',
                  },
                  {
                    icon: Users,
                    title: 'Client Success',
                    metric: 'Strong Relationships',
                    copy:
                      'Maintained strong client relationships through reliable service delivery, clear communication, and meeting project goals consistently.',
                  },
                  {
                    icon: Clock,
                    title: 'Response Time',
                    metric: '24h Response',
                    copy:
                      'Focused on clear communication and timely responses. I prioritize your project needs and aim to respond within 24 hours to keep projects moving forward.',
                  },
                  {
                    icon: Zap,
                    title: 'AI-Enhanced Development',
                    metric: 'Future-Ready',
                    copy:
                      'Working with modern AI tools and development practices to build intelligent, scalable solutions that grow with your business needs.',
                  },
                  {
                    icon: TrendingUp,
                    title: 'Accessibility & SEO',
                    metric: 'WCAG Compliant',
                    copy:
                      'Building inclusive, accessible web experiences that reach all users while optimizing for search engines to maximize your digital presence.',
                  },
                  {
                    icon: Star,
                    title: 'Process Excellence',
                    metric: 'Extensive Experience',
                    copy:
                      'Refined development processes through years of experience, ensuring consistent quality, on-time delivery, and seamless project execution.',
                  },
                ].map(({ icon: Icon, title, metric, copy }, i) => (
                  <motion.div key={title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }} viewport={{ once: true }} className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-8 shadow-lg dark:border-stone-700 dark:bg-stone-900">
                    <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-stone-600 shadow-lg dark:bg-stone-500">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-stone-900 dark:text-stone-100">{title}</h3>
                    <div className="mb-4 text-3xl font-bold text-stone-700 dark:text-stone-300">{metric}</div>
                    <p className="text-stone-600 dark:text-stone-400">{copy}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }} viewport={{ once: true }} className="mt-16 text-center">
                <p className="mb-6 text-lg text-stone-600 dark:text-stone-400">Ready to experience these results for your project?</p>
                <Button size="lg" className="bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200" asChild>
                  <Link href="/contact">Start Your Project <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
              </motion.div>
            </motion.div>
          </Container>
        </section>

        {/* Career Journey (from enterprise) */}
        <section className="bg-muted py-20">
          <Container className="px-4">
            <div className="mx-auto max-w-6xl">
              <div className="mb-16 text-center">
                <h2 className="mb-4 text-3xl font-bold text-stone-900 md:text-4xl dark:text-stone-100">Career Journey</h2>
                <p className="mb-8 text-lg text-stone-600 dark:text-stone-400">My professional experience and key achievements in web development</p>
                <div className="mx-auto max-w-4xl rounded-lg border border-stone-200 bg-gradient-to-r from-stone-50 to-stone-100 p-6 dark:border-stone-700 dark:from-stone-800 dark:to-stone-900">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="text-center">
                      <div className="mb-2 text-3xl font-bold text-primary">Senior</div>
                      <div className="text-sm text-stone-600 dark:text-stone-400">Level Expertise</div>
                    </div>
                    <div className="text-center">
                      <div className="mb-2 text-3xl font-bold text-primary">6</div>
                      <div className="text-sm text-stone-600 dark:text-stone-400">Companies</div>
                    </div>
                    <div className="text-center">
                      <div className="mb-2 text-3xl font-bold text-primary">AI</div>
                      <div className="text-sm text-stone-600 dark:text-stone-400">Innovation Focus</div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-stone-600 dark:text-stone-400">From teaching web development to leading AI-driven projects, my journey spans the evolution of modern web technologies.</p>
                  </div>
                </div>
              </div>

              <Timeline>
                {experience.map((job, index) => (
                  <TimelineItem
                    key={index}
                    title={job.title}
                    company={job.company}
                    period={job.period}
                    location={job.location}
                    description={job.description}
                    achievements={job.achievements}
                    index={index}
                    isLast={index === experience.length - 1}
                  />
                ))}
              </Timeline>
            </div>
          </Container>
        </section>

        {/* Who I Work With */}
        <section className="bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 py-20">
          <Container className="px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }} viewport={{ once: true }} className="mx-auto max-w-6xl">
              <div className="mb-8 text-center">
                <h2 className="mb-4 text-3xl font-bold text-stone-900 md:text-4xl dark:text-stone-100">Who I Work With</h2>
                <p className="text-lg text-stone-600 dark:text-stone-400">Tailored solutions for different audiences and project types</p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Recruiters */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }} viewport={{ once: true }} className="group rounded-xl border-2 border-stone-200 bg-gradient-to-br from-stone-50 to-stone-100/50 p-6 text-center transition-all duration-300 hover:border-stone-300 hover:shadow-lg dark:border-stone-700 dark:from-stone-800/30 dark:to-stone-700/20">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-600 shadow-lg group-hover:bg-stone-700 dark:bg-stone-500 dark:group-hover:bg-stone-400">
                      <Users className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <h4 className="mb-3 text-lg font-bold text-stone-900 dark:text-stone-100">Recruiters</h4>
                  <p className="mb-4 text-sm text-stone-700 dark:text-stone-300 leading-relaxed">Open to new opportunities and exciting roles in front-end development and technical leadership</p>
                  <div className="text-xs text-stone-600 dark:text-stone-400 font-medium">Available Now • Remote OK</div>
                </motion.div>

                {/* Startup Founders */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }} viewport={{ once: true }} className="group rounded-xl border-2 border-stone-200 bg-gradient-to-br from-stone-50 to-stone-100/50 p-6 text-center transition-all duration-300 hover:border-stone-300 hover:shadow-lg dark:border-stone-700 dark:from-stone-800/30 dark:to-stone-700/20">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-600 shadow-lg group-hover:bg-stone-700 dark:bg-stone-500 dark:group-hover:bg-stone-400">
                      <Star className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <h4 className="mb-3 text-lg font-bold text-stone-900 dark:text-stone-100">Startup Founders</h4>
                  <p className="mb-4 text-sm text-stone-700 dark:text-stone-300 leading-relaxed">MVP development, technical consulting, and scaling your product from idea to market</p>
                  <div className="text-xs text-stone-600 dark:text-stone-400 font-medium">Fast Turnaround • Proven Results</div>
                </motion.div>

                {/* Enterprise */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }} viewport={{ once: true }} className="group rounded-xl border-2 border-stone-200 bg-gradient-to-br from-stone-50 to-stone-100/50 p-6 text-center transition-all duration-300 hover:border-stone-300 hover:shadow-lg dark:border-stone-700 dark:from-stone-800/30 dark:to-stone-700/20">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-600 shadow-lg group-hover:bg-stone-700 dark:bg-stone-500 dark:group-hover:bg-stone-400">
                      <Building className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <h4 className="mb-3 text-lg font-bold text-stone-900 dark:text-stone-100">Enterprise</h4>
                  <p className="mb-4 text-sm text-stone-700 dark:text-stone-300 leading-relaxed">Technical consulting, architecture design, and enterprise-scale application development</p>
                  <div className="text-xs text-stone-600 dark:text-stone-400 font-medium">Enterprise Ready • Scalable Solutions</div>
                </motion.div>

                {/* Fellow Developers */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }} viewport={{ once: true }} className="group rounded-xl border-2 border-stone-200 bg-gradient-to-br from-stone-50 to-stone-100/50 p-6 text-center transition-all duration-300 hover:border-stone-300 hover:shadow-lg dark:border-stone-700 dark:from-stone-800/30 dark:to-stone-700/20">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-600 shadow-lg group-hover:bg-stone-700 dark:bg-stone-500 dark:group-hover:bg-stone-400">
                      <Code className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <h4 className="mb-3 text-lg font-bold text-stone-900 dark:text-stone-100">Developers</h4>
                  <p className="mb-4 text-sm text-stone-700 dark:text-stone-300 leading-relaxed">Collaboration opportunities, knowledge sharing, and contributing to the developer community</p>
                  <div className="text-xs text-stone-600 dark:text-stone-400 font-medium">Open Source • Mentoring</div>
                </motion.div>
              </div>
            </motion.div>
          </Container>
        </section>

        {/* Let’s Build Something Amazing (enterprise 1:1) */}
        <section className="bg-gradient-to-br from-stone-50 via-white to-stone-100 py-20 dark:from-stone-900 dark:via-stone-800 dark:to-stone-900">
          <Container className="px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              viewport={{ once: true }}
              className="mx-auto max-w-7xl"
            >
              <div className="text-center">
                <h2 className="mb-6 text-4xl font-bold text-stone-900 md:text-5xl dark:text-stone-100">Let&apos;s Build Something Amazing</h2>
                <p className="mx-auto max-w-3xl text-xl text-stone-600 dark:text-stone-400">Ready to transform your ideas into digital success? I&apos;m here to help you achieve your goals with expert development and strategic guidance.</p>
                <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-stone-100 px-6 py-3 dark:bg-stone-800/50">
                  <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-semibold text-stone-800 dark:text-stone-200">Available for New Projects</span>
                </div>
              </div>

              {/* Two-column info panel */}
              <div className="mt-10 rounded-2xl border-2 border-stone-200 bg-gradient-to-br from-white to-stone-50/50 p-6 shadow-xl dark:border-stone-700 dark:from-stone-900 dark:to-stone-800/50">
                <div className="grid gap-8 lg:grid-cols-2">
                  {/* Get In Touch */}
                  <div>
                    <h3 className="mb-6 text-2xl font-bold text-stone-900 dark:text-stone-100">Get In Touch</h3>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                          <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-stone-900 dark:text-stone-100">Email</p>
                          <a href="mailto:john@schibelli.dev" className="text-lg text-primary hover:text-primary/80 transition-colors">john@schibelli.dev</a>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800">
                          <MapPin className="h-6 w-6 text-stone-600 dark:text-stone-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-stone-900 dark:text-stone-100">Location</p>
                          <p className="text-lg text-stone-600 dark:text-stone-400">Northern NJ</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800">
                          <Clock className="h-6 w-6 text-stone-600 dark:text-stone-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-stone-900 dark:text-stone-100">Response Time</p>
                          <p className="text-lg text-stone-600 dark:text-stone-400">Within 24 hours</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Connect & Learn More */}
                  <div>
                    <h3 className="mb-6 text-2xl font-bold text-stone-900 dark:text-stone-100">Connect & Learn More</h3>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800">
                          <Linkedin className="h-6 w-6 text-stone-600 dark:text-stone-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-stone-900 dark:text-stone-100">LinkedIn</p>
                          <a href="https://linkedin.com/in/johnschibelli" target="_blank" rel="noopener noreferrer" className="text-lg text-primary hover:text-primary/80 transition-colors">Connect with me</a>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800">
                          <Calendar className="h-6 w-6 text-stone-600 dark:text-stone-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-stone-900 dark:text-stone-100">Availability</p>
                          <p className="text-lg text-stone-600 dark:text-stone-400">Available for new projects</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800">
                          <Star className="h-6 w-6 text-stone-600 dark:text-stone-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-stone-900 dark:text-stone-100">Core Specialties</p>
                          <p className="text-lg text-stone-600 dark:text-stone-400">React, Next.js, TypeScript, AI Integration</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 text-center">
                <Button size="lg" asChild>
                  <Link href="/contact">Start Your Project <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
              </div>
            </motion.div>
          </Container>
        </section>
      </main>
      <Chatbot />
    </Layout>
  );
} 