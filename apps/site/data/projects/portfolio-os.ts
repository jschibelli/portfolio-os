import { ProjectMeta } from './types';

export const portfolioOS: ProjectMeta = {
  id: 'portfolio-os',
  title: 'Portfolio OS - Self-Documenting Development Platform',
  slug: 'portfolio-os',
  description: 'A monorepo portfolio that doubles as a development platform, combining enterprise automation with AI-assisted workflows to speed up development and maintain code quality.',
  image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
  tags: ['Next.js', 'TypeScript', 'Turborepo', 'Automation', 'DevOps', 'Multi-Agent', 'Monorepo', 'CI/CD'],
  liveUrl: 'https://johnschibelli.dev',
  caseStudyUrl: '/case-studies/portfolio-os',
  githubUrl: 'https://github.com/jschibelli/portfolio-os',
  documentationUrl: 'https://docs.johnschibelli.dev',
  featured: true,
  published: true,
  status: 'in-progress',
  startDate: '2025-07-01',
  endDate: undefined,
  technologies: [
    'Next.js',
    'TypeScript',
    'Turborepo',
    'Prisma',
    'PostgreSQL',
    'PowerShell',
    'GitHub Actions',
    'Playwright',
    'Jest',
    'OpenAI',
    'Vercel',
    'Tailwind CSS',
    'Framer Motion'
  ],
  category: 'web-app',
  client: 'Personal',
  industry: 'Software Engineering / Portfolio',
  teamSize: '1 developer + AI agents',
  duration: 'Ongoing development',
  overview: 'A monorepo portfolio that doubles as a development platform, combining enterprise automation with AI-assisted workflows to speed up development and maintain code quality.',
  challenge: 'Managing a growing portfolio codebase while maintaining quality became time-consuming. Manual PR reviews, repetitive testing, and documentation drift slowed progress. The goal was to automate the mundane without losing control.',
  solution: 'Built a comprehensive automation layer using PowerShell scripts, GitHub Actions, and AI agents. The system handles routine tasks like PR creation, testing, and documentation, while keeping humans in the decision loop.',
  keyFeatures: [
    '100+ PowerShell scripts for project and PR management',
    'Multi-agent AI workflows with worktree isolation',
    'Automated testing with Playwright and Jest',
    'Self-updating documentation site',
    'Intelligent caching and performance optimization',
    'GitHub integration for automated workflows'
  ],
  impact: 'Development velocity increased significantly. PRs are created and managed automatically, tests catch issues before deployment, and documentation stays in sync with code. The portfolio itself demonstrates the engineering practices clients can expect.'
};

