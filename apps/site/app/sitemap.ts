import { MetadataRoute } from 'next'
import { getAllProjects } from '../lib/project-utils'
import { getAllPostSlugs } from '../lib/hashnode-api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    const projects = await getAllProjects()
    projectPages = projects.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: new Date(project.endDate || project.startDate || Date.now()),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error)
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
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
  } catch (error) {
    console.error('Error fetching case studies for sitemap:', error)
  }

  // Dynamic blog pages
  let blogPages: MetadataRoute.Sitemap = []
  try {
    const postSlugs = await getAllPostSlugs()
    blogPages = postSlugs.map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error)
  }

  return [
    ...staticPages,
    ...projectPages,
    ...caseStudyPages,
    ...blogPages,
  ]
}