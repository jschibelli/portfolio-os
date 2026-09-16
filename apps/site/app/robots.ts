import { MetadataRoute } from 'next'
import { getSiteOrigin } from '../config/site'

const publicAllow = [
  '/',
  '/about',
  '/projects',
  '/projects/*',
  '/blog',
  '/blog/*',
  '/case-studies',
  '/case-studies/*',
  '/contact',
  '/sitemap.xml',
]

const protectedDisallow = [
  '/admin',
  '/admin/*',
  '/api',
  '/api/*',
  '/login',
  '/under-construction',
  '/maintenance',
  '/_next',
  '/_next/*',
  '*.json',
]

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteOrigin()

  return {
    rules: [
      {
        userAgent: '*',
        allow: publicAllow,
        disallow: protectedDisallow,
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'Google-Extended',
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        allow: publicAllow,
        disallow: protectedDisallow,
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: publicAllow,
        disallow: protectedDisallow,
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
      {
        userAgent: 'Claude-Web',
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
