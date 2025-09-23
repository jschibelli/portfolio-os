// Project data exports
export { synaplyai } from './synaplyai';
export { schibelliSite } from './schibelli-site';
export { ecommerceShopifyChatbot } from './ecommerce-shopify-chatbot';
// export { chatbotDemo } from './chatbot-demo';
export { intraweb } from './intraweb';

// Type exports
export type { ProjectMeta } from './types';

// All projects array for easy iteration
import { synaplyai } from './synaplyai';
import { schibelliSite } from './schibelli-site';
import { ecommerceShopifyChatbot } from './ecommerce-shopify-chatbot';
// import { chatbotDemo } from './chatbot-demo';
import { intraweb } from './intraweb';
import { ProjectMeta } from './types';

export const allProjects: ProjectMeta[] = [
  synaplyai,
  schibelliSite,
  ecommerceShopifyChatbot,
  // chatbotDemo,
  intraweb
];

// Featured projects only
export const featuredProjects: ProjectMeta[] = allProjects.filter(project => project.featured);

// Projects by status
export const completedProjects: ProjectMeta[] = allProjects.filter(project => project.status === 'completed');
export const inProgressProjects: ProjectMeta[] = allProjects.filter(project => project.status === 'in-progress');
export const plannedProjects: ProjectMeta[] = allProjects.filter(project => project.status === 'planned');

// Projects by category
export const webAppProjects: ProjectMeta[] = allProjects.filter(project => project.category === 'web-app');
export const mobileAppProjects: ProjectMeta[] = allProjects.filter(project => project.category === 'mobile-app');
export const apiProjects: ProjectMeta[] = allProjects.filter(project => project.category === 'api');

// Utility functions
export const getProjectById = (id: string): ProjectMeta | undefined => {
  return allProjects.find(project => project.id === id);
};

export const getProjectBySlug = (slug: string): ProjectMeta | undefined => {
  return allProjects.find(project => project.slug === slug);
};

export const getProjectsByTag = (tag: string): ProjectMeta[] => {
  return allProjects.filter(project => project.tags.includes(tag));
};

export const getProjectsByTechnology = (technology: string): ProjectMeta[] => {
  return allProjects.filter(project => project.technologies.includes(technology));
};
