// MDX Case Study Loader
// Handles loading and parsing MDX case study files with frontmatter

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { withPerformanceTracking } from './case-study-performance';

// Cache for case study metadata to avoid repeated file system reads
const caseStudyCache = new Map<string, { meta: ProjectMeta; content: string; lastModified: number }>();
const caseStudyListCache = new Map<string, { slugs: string[]; lastModified: number }>();

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
 * Get all MDX case study slugs with caching
 */
export function getAllCaseStudySlugs(): string[] {
  try {
    if (!fs.existsSync(contentDirectory)) {
      return [];
    }
    
    // Check cache first
    const cacheKey = contentDirectory;
    const cached = caseStudyListCache.get(cacheKey);
    const dirStats = fs.statSync(contentDirectory);
    
    if (cached && cached.lastModified >= dirStats.mtime.getTime()) {
      return cached.slugs;
    }
    
    // Read from file system
    const files = fs.readdirSync(contentDirectory);
    const slugs = files
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => file.replace(/\.mdx$/, ''));
    
    // Update cache
    caseStudyListCache.set(cacheKey, {
      slugs,
      lastModified: dirStats.mtime.getTime(),
    });
    
    return slugs;
  } catch (error) {
    console.error('Error reading case study directory:', error);
    return [];
  }
}

/**
 * Get a single MDX case study by slug with caching
 */
export const getCaseStudyBySlug = withPerformanceTracking(
  'getCaseStudyBySlug',
  async function getCaseStudyBySlug(slug: string): Promise<MDXCaseStudy | null> {
  try {
    const filePath = path.join(contentDirectory, `${slug}.mdx`);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    // Check cache first
    const cached = caseStudyCache.get(slug);
    const fileStats = fs.statSync(filePath);
    
    if (cached && cached.lastModified >= fileStats.mtime.getTime()) {
      return {
        meta: cached.meta,
        content: cached.content,
      };
    }
    
    // Read from file system
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // Ensure slug matches the filename
    const meta: ProjectMeta = {
      ...data,
      title: data.title || slug, // Ensure title is provided
      slug,
    };
    
    // Validate the case study metadata
    const validation = validateCaseStudyMeta(meta);
    
    // Log warnings in development
    if (process.env.NODE_ENV === 'development' && validation.warnings.length > 0) {
      console.warn(`Case study "${slug}" has warnings:`, validation.warnings);
    }
    
    // Log errors and return null if there are critical errors
    if (validation.errors.length > 0) {
      console.error(`Case study "${slug}" has errors:`, validation.errors);
      return null;
    }
    
    // Update cache
    caseStudyCache.set(slug, {
      meta,
      content,
      lastModified: fileStats.mtime.getTime(),
    });
    
    return {
      meta,
      content,
    };
  } catch (error) {
    console.error(`Error loading case study ${slug}:`, error);
    return null;
  }
  }
);

/**
 * Get all MDX case studies with their metadata
 */
export const getAllCaseStudies = withPerformanceTracking(
  'getAllCaseStudies',
  async function getAllCaseStudies(): Promise<MDXCaseStudy[]> {
  const slugs = getAllCaseStudySlugs();
  const caseStudies: MDXCaseStudy[] = [];
  const validationErrors: string[] = [];
  
  for (const slug of slugs) {
    const caseStudy = await getCaseStudyBySlug(slug);
    if (caseStudy) {
      caseStudies.push(caseStudy);
    } else {
      validationErrors.push(`Failed to load case study: ${slug}`);
    }
  }
  
  // Log validation errors in development
  if (process.env.NODE_ENV === 'development' && validationErrors.length > 0) {
    console.warn('Case studies with validation errors:', validationErrors);
  }
  
  // Sort by publishedAt date (newest first)
  return caseStudies.sort((a, b) => {
    const dateA = new Date(a.meta.publishedAt || 0);
    const dateB = new Date(b.meta.publishedAt || 0);
    return dateB.getTime() - dateA.getTime();
  });
  }
);

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
export function validateCaseStudyMeta(meta: ProjectMeta): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Required fields
  if (!meta.title) {
    errors.push('Title is required');
  } else if (meta.title.length < 10) {
    warnings.push('Title should be at least 10 characters long');
  } else if (meta.title.length > 100) {
    warnings.push('Title should be less than 100 characters');
  }
  
  if (!meta.slug) {
    errors.push('Slug is required');
  } else if (!/^[a-z0-9-]+$/.test(meta.slug)) {
    errors.push('Slug must contain only lowercase letters, numbers, and hyphens');
  } else if (meta.slug.length < 3) {
    warnings.push('Slug should be at least 3 characters long');
  }
  
  // Optional but recommended fields
  if (!meta.excerpt) {
    warnings.push('Excerpt is recommended for better SEO');
  } else if (meta.excerpt.length < 50) {
    warnings.push('Excerpt should be at least 50 characters for better SEO');
  } else if (meta.excerpt.length > 200) {
    warnings.push('Excerpt should be less than 200 characters');
  }
  
  if (!meta.coverImage) {
    warnings.push('Cover image is recommended for better presentation');
  } else if (!isValidUrl(meta.coverImage)) {
    errors.push('Cover image must be a valid URL');
  }
  
  // Date validation
  if (meta.publishedAt) {
    const date = new Date(meta.publishedAt);
    if (isNaN(date.getTime())) {
      errors.push('Invalid publishedAt date format (use YYYY-MM-DD)');
    } else if (date > new Date()) {
      warnings.push('Published date is in the future');
    }
  } else if (meta.status === 'PUBLISHED') {
    warnings.push('Published case studies should have a publishedAt date');
  }
  
  // Status and visibility validation
  if (meta.status && !['DRAFT', 'PUBLISHED', 'SCHEDULED'].includes(meta.status)) {
    errors.push('Status must be one of: DRAFT, PUBLISHED, SCHEDULED');
  }
  
  if (meta.visibility && !['PUBLIC', 'PRIVATE'].includes(meta.visibility)) {
    errors.push('Visibility must be one of: PUBLIC, PRIVATE');
  }
  
  // Project details validation
  if (meta.client && meta.client.length > 100) {
    warnings.push('Client name should be less than 100 characters');
  }
  
  if (meta.industry && meta.industry.length > 50) {
    warnings.push('Industry should be less than 50 characters');
  }
  
  if (meta.duration && !/^\d+\s+(day|week|month|year)s?$/i.test(meta.duration)) {
    warnings.push('Duration should be in format like "6 months" or "2 weeks"');
  }
  
  if (meta.teamSize && !/^\d+\s+(developer|person|member)s?$/i.test(meta.teamSize)) {
    warnings.push('Team size should be in format like "3 developers" or "5 people"');
  }
  
  // Technologies validation
  if (meta.technologies) {
    if (!Array.isArray(meta.technologies)) {
      errors.push('Technologies must be an array');
    } else {
      if (meta.technologies.length === 0) {
        warnings.push('At least one technology is recommended');
      } else if (meta.technologies.length > 20) {
        warnings.push('Too many technologies listed (max 20 recommended)');
      }
      
      meta.technologies.forEach((tech, index) => {
        if (typeof tech !== 'string') {
          errors.push(`Technology at index ${index} must be a string`);
        } else if (tech.length > 50) {
          warnings.push(`Technology "${tech}" is too long (max 50 characters)`);
        }
      });
    }
  }
  
  // Tags validation
  if (meta.tags) {
    if (!Array.isArray(meta.tags)) {
      errors.push('Tags must be an array');
    } else {
      if (meta.tags.length === 0) {
        warnings.push('At least one tag is recommended');
      } else if (meta.tags.length > 10) {
        warnings.push('Too many tags (max 10 recommended)');
      }
      
      meta.tags.forEach((tag, index) => {
        if (typeof tag !== 'string') {
          errors.push(`Tag at index ${index} must be a string`);
        } else if (tag.length > 30) {
          warnings.push(`Tag "${tag}" is too long (max 30 characters)`);
        } else if (!/^[a-zA-Z0-9\s-]+$/.test(tag)) {
          warnings.push(`Tag "${tag}" contains special characters`);
        }
      });
    }
  }
  
  // Metrics validation
  if (meta.metrics && typeof meta.metrics !== 'object') {
    errors.push('Metrics must be an object');
  }
  
  // Author validation
  if (meta.author) {
    if (typeof meta.author !== 'object') {
      errors.push('Author must be an object');
    } else {
      if (meta.author.name && typeof meta.author.name !== 'string') {
        errors.push('Author name must be a string');
      }
      if (meta.author.email && !isValidEmail(meta.author.email)) {
        errors.push('Author email must be a valid email address');
      }
    }
  }
  
  // SEO validation
  if (meta.seoTitle && meta.seoTitle.length > 60) {
    warnings.push('SEO title should be less than 60 characters');
  }
  
  if (meta.seoDescription && meta.seoDescription.length > 160) {
    warnings.push('SEO description should be less than 160 characters');
  }
  
  if (meta.canonicalUrl && !isValidUrl(meta.canonicalUrl)) {
    errors.push('Canonical URL must be a valid URL');
  }
  
  if (meta.ogImage && !isValidUrl(meta.ogImage)) {
    errors.push('OG image must be a valid URL');
  }
  
  return { errors, warnings };
}

/**
 * Helper function to validate URLs
 */
function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Helper function to validate email addresses
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate all case studies and return detailed results
 */
export async function validateAllCaseStudies(): Promise<{
  valid: MDXCaseStudy[];
  invalid: Array<{ slug: string; errors: string[]; warnings: string[] }>;
  summary: { total: number; valid: number; invalid: number; warnings: number };
}> {
  const slugs = getAllCaseStudySlugs();
  const valid: MDXCaseStudy[] = [];
  const invalid: Array<{ slug: string; errors: string[]; warnings: string[] }> = [];
  let totalWarnings = 0;
  
  for (const slug of slugs) {
    try {
      const filePath = path.join(contentDirectory, `${slug}.mdx`);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      
      const meta: ProjectMeta = {
        ...data,
        title: data.title || slug, // Ensure title is provided
        slug,
      };
      
      const validation = validateCaseStudyMeta(meta);
      
      if (validation.errors.length > 0) {
        invalid.push({
          slug,
          errors: validation.errors,
          warnings: validation.warnings,
        });
        totalWarnings += validation.warnings.length;
      } else {
        valid.push({ meta, content });
        totalWarnings += validation.warnings.length;
      }
    } catch (error) {
      invalid.push({
        slug,
        errors: [`Failed to parse file: ${error}`],
        warnings: [],
      });
    }
  }
  
  return {
    valid,
    invalid,
    summary: {
      total: slugs.length,
      valid: valid.length,
      invalid: invalid.length,
      warnings: totalWarnings,
    },
  };
}

/**
 * Clear the case study cache (useful for development or when files change)
 */
export function clearCaseStudyCache(): void {
  caseStudyCache.clear();
  caseStudyListCache.clear();
}

/**
 * Get cache statistics for monitoring
 */
export function getCacheStats(): {
  caseStudyCacheSize: number;
  caseStudyListCacheSize: number;
} {
  return {
    caseStudyCacheSize: caseStudyCache.size,
    caseStudyListCacheSize: caseStudyListCache.size,
  };
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
