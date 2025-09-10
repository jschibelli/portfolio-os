export interface ProjectMeta {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  caseStudyUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  status: 'completed' | 'in-progress' | 'planned' | 'archived';
  startDate?: string;
  endDate?: string;
  technologies: string[];
  category: 'web-app' | 'mobile-app' | 'desktop-app' | 'api' | 'library' | 'other';
  client?: string;
  industry?: string;
  teamSize?: string;
  duration?: string;
}
