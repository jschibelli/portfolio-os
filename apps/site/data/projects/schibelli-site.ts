import { ProjectMeta } from './types';

export const schibelliSite: ProjectMeta = {
  id: 'schibelli-site',
  title: 'Schibelli.dev Portfolio Website',
  slug: 'schibelli-site',
  description: 'A modern, responsive portfolio website built with Next.js, TypeScript, and Tailwind CSS. Features a blog, case studies, and interactive components showcasing development skills and projects with a focus on performance and accessibility.',
  image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
  tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe'],
  liveUrl: 'https://schibelli.dev',
  caseStudyUrl: '/case-studies/schibelli-site',
  githubUrl: 'https://github.com/jschibelli/mindware-blog',
  featured: true,
  status: 'completed',
  startDate: '2024-06-01',
  endDate: '2024-12-31',
  technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'React', 'Prisma', 'PostgreSQL', 'Vercel', 'Framer Motion'],
  category: 'web-app',
  client: 'Personal',
  industry: 'Portfolio/Personal Branding',
  teamSize: '1 developer',
  duration: '7 months',
  metrics: {
    performance: {
      loadTimeImprovement: '28%',
      responseTime: '120ms',
      uptime: '99.8%'
    },
    business: {
      engagementIncrease: '120%',
      bounceRateReduction: '28%'
    }
  },
  caseStudyPreview: {
    problem: 'Outdated portfolio website with poor performance and limited engagement.',
    solution: 'Redesigned with Next.js, performance optimization, and modern UI/UX.',
    results: '120% engagement increase, 28% reduction in bounce rate, and 28% faster load times.'
  }
};
