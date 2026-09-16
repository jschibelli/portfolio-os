import { MetadataRoute } from 'next';
import { SITE_URL } from '../lib/site-url';

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: '*',
				allow: [
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
				],
				disallow: [
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
				],
			},
			{
				userAgent: 'Google-Extended',
				disallow: '/',
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
		sitemap: `${SITE_URL}/sitemap.xml`,
		host: SITE_URL,
	};
}
