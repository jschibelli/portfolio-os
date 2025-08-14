export interface Skill {
  name: string;
  icon: string;
  category: string;
}

export const skills: Skill[] = [
  // Languages & Frameworks
  { name: 'JavaScript (ES6+)', icon: '⚡', category: 'Languages' },
  { name: 'TypeScript', icon: '🔷', category: 'Languages' },
  { name: 'React', icon: '⚛️', category: 'Frameworks' },
  { name: 'Next.js', icon: '▲', category: 'Frameworks' },
  { name: 'PHP', icon: '🐘', category: 'Languages' },
  { name: 'SQL', icon: '🗄️', category: 'Languages' },
  
  // Styling & UI
  { name: 'Tailwind CSS', icon: '🎨', category: 'Styling' },
  { name: 'shadcn/ui', icon: '🧩', category: 'UI' },
  { name: 'Framer Motion', icon: '🎬', category: 'Animation' },
  
  // Backend & APIs
  { name: 'Node.js', icon: '🟢', category: 'Backend' },
  { name: 'REST APIs', icon: '🌐', category: 'APIs' },
  { name: 'GraphQL', icon: '🔵', category: 'APIs' },
  { name: 'Prisma', icon: '🔧', category: 'Database' },
  { name: 'Contentful', icon: '📝', category: 'CMS' },
  { name: 'Hashnode', icon: '📰', category: 'CMS' },
  
  // AI & Automation
  { name: 'OpenAI API', icon: '🤖', category: 'AI' },
  { name: 'Claude AI', icon: '🧠', category: 'AI' },
  { name: 'Playwright', icon: '🎭', category: 'Testing' },
  
  // Tools & Platforms
  { name: 'Git', icon: '📚', category: 'Version Control' },
  { name: 'GitHub', icon: '🐙', category: 'Platforms' },
  { name: 'Vercel', icon: '▲', category: 'Platforms' },
  { name: 'Docker', icon: '🐳', category: 'DevOps' },
  { name: 'Monday.com', icon: '📅', category: 'Project Management' },
  
  // Design & Collaboration
  { name: 'Figma', icon: '🎨', category: 'Design' },
  { name: 'Storybook', icon: '📖', category: 'Development' }
];
