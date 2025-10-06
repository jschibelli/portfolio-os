import { MetadataRoute } from 'next'
import { getAllProjects } from '../lib/project-utils'
import { getAllPostSlugs } from '../lib/hashnode-api'
import { getAllCaseStudies } from '../lib/mdx-case-study-loader'

// Cache for sitemap data to improve performance
let sitemapCache: {
  data: MetadataRoute.Sitemap | null
  timestamp: number
} = {
  data: null,
  timestamp: 0
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes cache

// Helper function for retry logic
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 2,
  delay: number = 1000
): Promise<T | null> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (attempt === maxRetries) {
        console.error(`Failed after ${maxRetries + 1} attempts:`, error)
        return null
      }
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * (attempt + 1)))
    }
  }
  return null
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Check cache first for performance optimization
  const now = Date.now()
  if (sitemapCache.data && (now - sitemapCache.timestamp) < CACHE_DURATION) {
    return sitemapCache.data
  }

  const baseUrl = 'https://johnschibelli.dev'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  // Dynamic project pages
  let projectPages: MetadataRoute.Sitemap = []
  try {
    const projects = await withRetry(() => getAllProjects())
    if (projects && projects.length > 0) {
      projectPages = projects.map((project) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: new Date(project.endDate || project.startDate || Date.now()),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))
    }
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error)
    // Graceful degradation - continue without projects
  }

  // Dynamic case study pages
  let caseStudyPages: MetadataRoute.Sitemap = []
  try {
    const caseStudies = await withRetry(() => getAllCaseStudies())
    if (caseStudies && caseStudies.length > 0) {
      caseStudyPages = caseStudies.map((caseStudy) => ({
        url: `${baseUrl}/case-studies/${caseStudy.slug}`,
        lastModified: new Date(caseStudy.publishedAt || Date.now()),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
    }
  } catch (error) {
    console.error('Error fetching case studies for sitemap:', error)
    // Graceful degradation - continue without case studies
  }

  // Dynamic blog pages
  let blogPages: MetadataRoute.Sitemap = []
  try {
    const postSlugs = await withRetry(() => getAllPostSlugs())
    if (postSlugs && postSlugs.length > 0) {
      blogPages = postSlugs.map((slug) => ({
        url: `${baseUrl}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error)
    // Graceful degradation - continue without blog posts
  }

  const sitemapData = [
    ...staticPages,
    ...projectPages,
    ...caseStudyPages,
    ...blogPages,
  ]

  // Cache the result for performance
  sitemapCache = {
    data: sitemapData,
    timestamp: now
  }

  return sitemapData
}