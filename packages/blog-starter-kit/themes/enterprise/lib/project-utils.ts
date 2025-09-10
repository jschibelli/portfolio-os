import { ProjectMeta } from '../data/projects/types';

// Import all project data
import { chatbotDemo } from '../data/projects/chatbot-demo';
import { schibelliSite } from '../data/projects/schibelli-site';
import { synaplyai } from '../data/projects/synaplyai';
import { ecommerceShopifyChatbot } from '../data/projects/ecommerce-shopify-chatbot';
import { intraweb } from '../data/projects/intraweb';

// Add other project imports as they become available
// import { projectName } from '../data/projects/project-name';

// Array of all projects
const allProjects: ProjectMeta[] = [
  chatbotDemo,
  schibelliSite,
  synaplyai,
  ecommerceShopifyChatbot,
  intraweb,
  // Add other projects here
];

/**
 * Get all projects
 */
export async function getAllProjects(): Promise<ProjectMeta[]> {
  return allProjects;
}

/**
 * Get a project by its slug
 */
export async function getProjectBySlug(slug: string): Promise<ProjectMeta | null> {
  return allProjects.find(project => project.slug === slug) || null;
}

/**
 * Get featured projects
 */
export async function getFeaturedProjects(): Promise<ProjectMeta[]> {
  return allProjects.filter(project => project.featured === true);
}

/**
 * Get projects by status
 */
export async function getProjectsByStatus(status: ProjectMeta['status']): Promise<ProjectMeta[]> {
  return allProjects.filter(project => project.status === status);
}

/**
 * Get projects by category
 */
export async function getProjectsByCategory(category: ProjectMeta['category']): Promise<ProjectMeta[]> {
  return allProjects.filter(project => project.category === category);
}

/**
 * Get projects by tag
 */
export async function getProjectsByTag(tag: string): Promise<ProjectMeta[]> {
  return allProjects.filter(project => 
    project.tags.some(projectTag => 
      projectTag.toLowerCase().includes(tag.toLowerCase())
    )
  );
}

/**
 * Get all unique tags from all projects
 */
export async function getAllProjectTags(): Promise<string[]> {
  const allTags = allProjects.flatMap(project => project.tags);
  return Array.from(new Set(allTags)).sort();
}

/**
 * Get all unique categories from all projects
 */
export async function getAllProjectCategories(): Promise<ProjectMeta['category'][]> {
  const allCategories = allProjects.map(project => project.category);
  return Array.from(new Set(allCategories));
}

/**
 * Search projects by title, description, or tags
 */
export async function searchProjects(query: string): Promise<ProjectMeta[]> {
  const lowercaseQuery = query.toLowerCase();
  
  return allProjects.filter(project => 
    project.title.toLowerCase().includes(lowercaseQuery) ||
    project.description.toLowerCase().includes(lowercaseQuery) ||
    project.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    project.technologies.some(tech => tech.toLowerCase().includes(lowercaseQuery))
  );
}
