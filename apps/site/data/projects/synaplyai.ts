import { ProjectMeta } from './types';

export const synaplyai: ProjectMeta = {
  id: 'synaplyai',
  title: 'SynaplyAI – Real-Time AI Collaboration Platform',
  slug: 'synaplyai',
  description: 'A multi-tenant AI content platform featuring token-level conflict resolution and real-time collaboration. Built with Next.js, Prisma, and Framer Motion for seamless team collaboration on AI-generated content.',
  image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
  tags: ['Next.js', 'TypeScript', 'AI/ML', 'Tailwind CSS'],
  liveUrl: 'https://synaplyai.intrawebtech.com',
  caseStudyUrl: '/case-studies/synaplyai',
  githubUrl: 'https://github.com/jschibelli/synaplyai',
  documentationUrl: 'https://docs.synaply.ai',
  featured: true,
  status: 'completed',
  startDate: '2024-01-15',
  endDate: '2024-08-30',
  technologies: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Framer Motion', 'Tailwind CSS', 'OpenAI API', 'WebSockets'],
  category: 'web-app',
  client: 'SynaplyAI Inc.',
  industry: 'AI/Technology',
  teamSize: '3-5 developers',
  duration: '8 months',
  metrics: {
    performance: {
      loadTimeImprovement: '40%',
      responseTime: '150ms',
      uptime: '99.9%'
    },
    business: {
      revenueIncrease: '150%',
      userRetention: '91%'
    }
  },
  caseStudyPreview: {
    problem: 'SMBs needed affordable chatbots for customer support but existing solutions were expensive and complex.',
    solution: 'Multi-tenant SaaS platform with AI-powered chatbot builder and real-time collaboration features.',
    results: '150% revenue increase, 91% user retention, and 40% faster load times.'
  }
};
