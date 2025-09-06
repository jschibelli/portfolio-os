/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://johnschibelli.dev',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    '/admin/*',
    '/preview/*',
    '/api/*',
    '/_next/*',
    '/404',
    '/500',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/preview/',
          '/api/',
          '/_next/',
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://johnschibelli.dev'}/sitemap.xml`,
    ],
  },
  transform: async (config, path) => {
    // Custom transform function to add priority and changefreq
    const priority = getPriority(path);
    const changefreq = getChangeFreq(path);
    
    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};

function getPriority(path) {
  // Homepage gets highest priority
  if (path === '/') return 1.0;
  
  // Main pages get high priority
  if (['/about', '/contact', '/services', '/portfolio', '/blog'].includes(path)) {
    return 0.9;
  }
  
  // Service pages get high priority
  if (path.startsWith('/services/')) {
    return 0.8;
  }
  
  // Case studies get high priority
  if (path.startsWith('/case-studies/')) {
    return 0.8;
  }
  
  // Blog posts get medium priority
  if (path.startsWith('/blog/') || path.includes('-')) {
    return 0.7;
  }
  
  // Tag pages get lower priority
  if (path.startsWith('/tag/')) {
    return 0.5;
  }
  
  // Default priority
  return 0.6;
}

function getChangeFreq(path) {
  // Blog posts change frequently
  if (path.startsWith('/blog/') || path.includes('-')) {
    return 'weekly';
  }
  
  // Main pages change occasionally
  if (['/about', '/contact', '/services', '/portfolio'].includes(path)) {
    return 'monthly';
  }
  
  // Homepage and service pages change occasionally
  if (path === '/' || path.startsWith('/services/')) {
    return 'monthly';
  }
  
  // Case studies change occasionally
  if (path.startsWith('/case-studies/')) {
    return 'monthly';
  }
  
  // Tag pages change frequently
  if (path.startsWith('/tag/')) {
    return 'weekly';
  }
  
  // Default change frequency
  return 'monthly';
}
