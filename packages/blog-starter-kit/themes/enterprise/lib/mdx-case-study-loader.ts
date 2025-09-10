// MDX Case Study Loader
// Handles loading and parsing MDX case study files with frontmatter

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// ProjectMeta interface mapping to CaseStudy model fields
export interface ProjectMeta {
  // Basic info
  title: string;
  slug: string;
  excerpt?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';
  visibility?: 'PUBLIC' | 'PRIVATE';
  publishedAt?: string;
  featured?: boolean;
  
  // Project details
  client?: string;
  industry?: string;
  duration?: string;
  teamSize?: string;
  technologies?: string[];
  challenges?: string;
  solution?: string;
  results?: string;
  metrics?: Record<string, any>;
  lessonsLearned?: string;
  nextSteps?: string;
  
  // Media and SEO
  coverImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  
  // Engagement
  allowComments?: boolean;
  allowReactions?: boolean;
  views?: number;
  
  // Tags and categories
  tags?: string[];
  category?: string;
  
  // Author
  author?: {
    name?: string;
    email?: string;
  };
}

export interface MDXCaseStudy {
  meta: ProjectMeta;
  content: string;
}

const contentDirectory = path.join(process.cwd(), 'content', 'case-studies');

/**
 * Get all MDX case study slugs
 */
export function getAllCaseStudySlugs(): string[] {
  try {
    if (!fs.existsSync(contentDirectory)) {
      return [];
    }
    
    const files = fs.readdirSync(contentDirectory);
    return files
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => file.replace(/\.mdx$/, ''));
  } catch (error) {
    console.error('Error reading case study directory:', error);
    return [];
  }
}

/**
 * Get a single MDX case study by slug
 */
export async function getCaseStudyBySlug(slug: string): Promise<MDXCaseStudy | null> {
  try {
    const filePath = path.join(contentDirectory, `${slug}.mdx`);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // Ensure slug matches the filename
    const meta: ProjectMeta = {
      ...data,
      slug,
    };
    
    return {
      meta,
      content,
    };
  } catch (error) {
    console.error(`Error loading case study ${slug}:`, error);
    return null;
  }
}

/**
 * Get all MDX case studies with their metadata
 */
export async function getAllCaseStudies(): Promise<MDXCaseStudy[]> {
  const slugs = getAllCaseStudySlugs();
  const caseStudies: MDXCaseStudy[] = [];
  
  for (const slug of slugs) {
    const caseStudy = await getCaseStudyBySlug(slug);
    if (caseStudy) {
      caseStudies.push(caseStudy);
    }
  }
  
  // Sort by publishedAt date (newest first)
  return caseStudies.sort((a, b) => {
    const dateA = new Date(a.meta.publishedAt || 0);
    const dateB = new Date(b.meta.publishedAt || 0);
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Get published case studies only
 */
export async function getPublishedCaseStudies(): Promise<MDXCaseStudy[]> {
  const allCaseStudies = await getAllCaseStudies();
  return allCaseStudies.filter(
    (caseStudy) => 
      caseStudy.meta.status === 'PUBLISHED' || 
      (!caseStudy.meta.status && caseStudy.meta.publishedAt) // Default to published if no status
  );
}

/**
 * Validate case study structure
 */
export function validateCaseStudyMeta(meta: ProjectMeta): string[] {
  const errors: string[] = [];
  
  if (!meta.title) {
    errors.push('Title is required');
  }
  
  if (!meta.slug) {
    errors.push('Slug is required');
  }
  
  if (meta.publishedAt) {
    const date = new Date(meta.publishedAt);
    if (isNaN(date.getTime())) {
      errors.push('Invalid publishedAt date format');
    }
  }
  
  return errors;
}

/**
 * Convert ProjectMeta to CaseStudy database format
 */
export function projectMetaToCaseStudy(meta: ProjectMeta, content: string) {
  return {
    title: meta.title,
    slug: meta.slug,
    excerpt: meta.excerpt || '',
    content: content,
    status: meta.status || 'DRAFT',
    visibility: meta.visibility || 'PUBLIC',
    publishedAt: meta.publishedAt ? new Date(meta.publishedAt) : null,
    featured: meta.featured || false,
    client: meta.client,
    industry: meta.industry,
    duration: meta.duration,
    teamSize: meta.teamSize,
    technologies: meta.technologies || [],
    challenges: meta.challenges,
    solution: meta.solution,
    results: meta.results,
    metrics: meta.metrics || null,
    lessonsLearned: meta.lessonsLearned,
    nextSteps: meta.nextSteps,
    coverImage: meta.coverImage,
    seoTitle: meta.seoTitle,
    seoDescription: meta.seoDescription,
    canonicalUrl: meta.canonicalUrl,
    ogImage: meta.ogImage,
    allowComments: meta.allowComments !== false, // Default to true
    allowReactions: meta.allowReactions !== false, // Default to true
    views: meta.views || 0,
    tags: meta.tags || [],
    category: meta.category,
  };
}
