import { MetadataRoute } from 'next'
import { getSiteUrl } from '../config/site'
import { getAllProjects } from '../lib/project-utils'
import { getAllCaseStudies } from '../lib/mdx-case-study-loader'
import { fetchPosts } from '../lib/content-api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Performance optimization: Cache static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: getSiteUrl('/'),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: getSiteUrl('/about'),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: getSiteUrl('/projects'),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: getSiteUrl('/case-studies'),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: getSiteUrl('/blog'),
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: getSiteUrl('/contact'),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  // Dynamic project pages with enhanced error handling
  let projectPages: MetadataRoute.Sitemap = []
  try {
    const projects = await getAllProjects()
    projectPages = projects.map((project) => ({
      url: getSiteUrl(`/projects/${project.slug}`),
      lastModified: new Date(project.endDate || project.startDate || Date.now()),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error)
    // Graceful degradation - continue with static pages only
  }

  // Dynamic case study pages - FIXED: Use proper case study function
  let caseStudyPages: MetadataRoute.Sitemap = []
  try {
    const caseStudies = await getAllCaseStudies()
    caseStudyPages = caseStudies
      .filter(caseStudy => caseStudy.meta.status === 'PUBLISHED')
      .map((caseStudy) => ({
        url: getSiteUrl(`/case-studies/${caseStudy.meta.slug}`),
        lastModified: new Date(caseStudy.meta.updatedAt || caseStudy.meta.publishedAt || Date.now()),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
  } catch (error) {
    console.error('Error fetching case studies for sitemap:', error)
    // Graceful degradation - continue without case studies
  }

  // Dynamic blog pages - FIXED: Implement proper blog post fetching
  let blogPages: MetadataRoute.Sitemap = []
  try {
    const posts = await fetchPosts(50) // Fetch up to 50 blog posts
    blogPages = posts.map((post) => ({
      url: getSiteUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error)
    // Graceful degradation - continue without blog posts
  }

  // Performance optimization: Combine all pages efficiently
  return [
    ...staticPages,
    ...projectPages,
    ...caseStudyPages,
    ...blogPages,
  ]
}
