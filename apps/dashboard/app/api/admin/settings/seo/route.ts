import { NextRequest, NextResponse } from "next/server";

// Temporarily disabled - SEO settings model not in schema
export async function GET(request: NextRequest) {
  return NextResponse.json({
    meta: {
      title: 'Mindware Blog',
      description: 'A modern blog platform',
      keywords: 'blog, technology, web development',
      author: 'Mindware Team'
    },
    social: {
      twitter: {
        handle: '@mindware',
        card: 'summary_large_image'
      },
      facebook: {
        appId: '',
        pageId: ''
      }
    },
    analytics: {
      googleAnalytics: '',
      googleTagManager: '',
      facebookPixel: ''
    },
    sitemap: {
      enabled: true,
      priority: 0.8,
      changefreq: 'weekly'
    },
    robots: {
      enabled: true,
      allow: ['/'],
      disallow: ['/admin', '/api']
    }
  });
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "SEO settings feature not implemented yet" },
    { status: 501 }
  );
}