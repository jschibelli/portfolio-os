// Project Loader
// Handles loading project metadata from portfolio.json

import fs from 'fs';
import path from 'path';

// Project interface matching portfolio.json structure
export interface ProjectMeta {
  id: string;
  title: string;
  slug: string;
  description: string;
  image?: string;
  tags: string[];
  liveUrl?: string;
  caseStudyUrl?: string;
}

// Cache for project metadata to avoid repeated file system reads
const projectCache = new Map<string, { project: ProjectMeta; lastModified: number }>();
const projectListCache = new Map<string, { projects: ProjectMeta[]; lastModified: number }>();

/**
 * Load project metadata by slug from portfolio.json
 */
export async function getProjectBySlug(slug: string): Promise<ProjectMeta | null> {
  try {
    const portfolioPath = path.join(process.cwd(), 'data', 'portfolio.json');
    const stats = fs.statSync(portfolioPath);
    const lastModified = stats.mtime.getTime();

    // Check cache first
    const cached = projectCache.get(slug);
    if (cached && cached.lastModified >= lastModified) {
      return cached.project;
    }

    // Load and parse portfolio.json
    const portfolioData = fs.readFileSync(portfolioPath, 'utf8');
    const projects: ProjectMeta[] = JSON.parse(portfolioData);

    // Find project by slug
    const project = projects.find(p => p.slug === slug);
    
    if (project) {
      // Cache the result
      projectCache.set(slug, { project, lastModified });
      return project;
    }

    return null;
  } catch (error) {
    console.error('Error loading project:', error);
    return null;
  }
}

/**
 * Get all projects from portfolio.json
 */
export async function getAllProjects(): Promise<ProjectMeta[]> {
  try {
    const portfolioPath = path.join(process.cwd(), 'data', 'portfolio.json');
    const stats = fs.statSync(portfolioPath);
    const lastModified = stats.mtime.getTime();

    // Check cache first
    const cached = projectListCache.get('all');
    if (cached && cached.lastModified >= lastModified) {
      return cached.projects;
    }

    // Load and parse portfolio.json
    const portfolioData = fs.readFileSync(portfolioPath, 'utf8');
    const projects: ProjectMeta[] = JSON.parse(portfolioData);

    // Cache the result
    projectListCache.set('all', { projects, lastModified });
    
    return projects;
  } catch (error) {
    console.error('Error loading projects:', error);
    return [];
  }
}

/**
 * Get all project slugs for static generation
 */
export async function getAllProjectSlugs(): Promise<string[]> {
  const projects = await getAllProjects();
  return projects.map(project => project.slug);
}

/**
 * Clear project cache (useful for development)
 */
export function clearProjectCache(): void {
  projectCache.clear();
  projectListCache.clear();
}

/**
 * Get cache statistics
 */
export function getProjectCacheStats(): {
  projectCacheSize: number;
  projectListCacheSize: number;
} {
  return {
    projectCacheSize: projectCache.size,
    projectListCacheSize: projectListCache.size,
  };
}
