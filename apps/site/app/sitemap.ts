import { MetadataRoute } from 'next'
import { getAllProjects } from '../lib/project-utils'
<<<<<<< HEAD
import { getAllPostSlugs } from '../lib/hashnode-api'
=======
import { getAllCaseStudies } from '../lib/mdx-case-study-loader'
import { fetchPosts } from '../lib/content-api'
>>>>>>> origin/develop

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://johnschibelli.dev'
  
<<<<<<< HEAD
  // Static pages
  const staticPages = [
=======
  // Performance optimization: Cache static pages
  const staticPages: MetadataRoute.Sitemap = [
>>>>>>> origin/develop
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

<<<<<<< HEAD
  // Dynamic project pages
=======
  // Dynamic project pages with enhanced error handling
>>>>>>> origin/develop
  let projectPages: MetadataRoute.Sitemap = []
  try {
    const projects = await getAllProjects()
    projectPages = projects.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: new Date(project.endDate || project.startDate || Date.now()),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error)
<<<<<<< HEAD
  }

  // Dynamic case study pages
  let caseStudyPages: MetadataRoute.Sitemap = []
  try {
    const caseStudies = await getAllProjects() // Assuming case studies are also in projects
    caseStudyPages = caseStudies
      .filter(project => project.caseStudyUrl)
      .map((project) => ({
        url: `${baseUrl}/case-studies/${project.slug}`,
        lastModified: new Date(project.endDate || project.startDate || Date.now()),
=======
    // Graceful degradation - continue with static pages only
  }

  // Dynamic case study pages - FIXED: Use proper case study function
  let caseStudyPages: MetadataRoute.Sitemap = []
  try {
    const caseStudies = await getAllCaseStudies()
    caseStudyPages = caseStudies
      .filter(caseStudy => caseStudy.meta.status === 'PUBLISHED')
      .map((caseStudy) => ({
        url: `${baseUrl}/case-studies/${caseStudy.meta.slug}`,
        lastModified: new Date(caseStudy.meta.updatedAt || caseStudy.meta.publishedAt || Date.now()),
>>>>>>> origin/develop
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
  } catch (error) {
    console.error('Error fetching case studies for sitemap:', error)
<<<<<<< HEAD
  }

  // Dynamic blog pages
  let blogPages: MetadataRoute.Sitemap = []
  try {
    const postSlugs = await getAllPostSlugs()
    blogPages = postSlugs.map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(),
=======
    // Graceful degradation - continue without case studies
  }

  // Dynamic blog pages - FIXED: Implement proper blog post fetching
  let blogPages: MetadataRoute.Sitemap = []
  try {
    const posts = await fetchPosts(50) // Fetch up to 50 blog posts
    blogPages = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
>>>>>>> origin/develop
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error)
<<<<<<< HEAD
  }

=======
    // Graceful degradation - continue without blog posts
  }

  // Performance optimization: Combine all pages efficiently
>>>>>>> origin/develop
  return [
    ...staticPages,
    ...projectPages,
    ...caseStudyPages,
    ...blogPages,
  ]
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/develop
