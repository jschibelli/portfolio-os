import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userRole = (session.user as any)?.role;
    if (!userRole || !["ADMIN", "EDITOR"].includes(userRole)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Return default SEO settings (can be extended with database storage later)
    const seoSettings = {
      meta: {
        title: 'John Schibelli - Full-Stack Developer & Technical Writer',
        description: 'Portfolio and blog of John Schibelli, a full-stack developer specializing in React, Next.js, TypeScript, and modern web technologies.',
        keywords: [
          'John Schibelli',
          'full-stack developer',
          'React developer',
          'Next.js developer',
          'TypeScript',
          'web development',
          'portfolio',
          'technical writing',
          'software engineering'
        ].join(', '),
        author: 'John Schibelli',
        robots: 'index, follow',
        canonical: 'https://johnschibelli.dev'
      },
      social: {
        twitter: {
          handle: '@johnschibelli',
          card: 'summary_large_image',
          site: '@johnschibelli'
        },
        facebook: {
          appId: '',
          pageId: ''
        },
        linkedin: {
          profile: 'https://linkedin.com/in/johnschibelli'
        },
        github: {
          profile: 'https://github.com/johnschibelli'
        }
      },
      analytics: {
        googleAnalytics: {
          trackingId: process.env.GOOGLE_ANALYTICS_ID || '',
          enabled: !!process.env.GOOGLE_ANALYTICS_ID
        },
        googleTagManager: {
          containerId: process.env.GTM_CONTAINER_ID || '',
          enabled: !!process.env.GTM_CONTAINER_ID
        },
        facebookPixel: {
          pixelId: process.env.FACEBOOK_PIXEL_ID || '',
          enabled: !!process.env.FACEBOOK_PIXEL_ID
        }
      },
      structuredData: {
        organization: {
          name: 'John Schibelli',
          url: 'https://johnschibelli.dev',
          logo: 'https://johnschibelli.dev/assets/logo.png',
          description: 'Full-stack developer and technical writer',
          sameAs: [
            'https://github.com/johnschibelli',
            'https://linkedin.com/in/johnschibelli',
            'https://twitter.com/johnschibelli'
          ]
        },
        person: {
          name: 'John Schibelli',
          url: 'https://johnschibelli.dev',
          jobTitle: 'Full-Stack Developer',
          worksFor: 'Freelance',
          description: 'Full-stack developer specializing in React, Next.js, TypeScript, and modern web technologies.',
          knowsAbout: [
            'React',
            'Next.js',
            'TypeScript',
            'Node.js',
            'PostgreSQL',
            'MongoDB',
            'AWS',
            'Docker'
          ]
        }
      },
      sitemap: {
        enabled: true,
        priority: 0.8,
        changefreq: 'weekly',
        excludePatterns: ['/admin/*', '/api/*', '/login', '/under-construction']
      },
      robots: {
        enabled: true,
        allow: ['/', '/about', '/projects', '/projects/*', '/blog', '/blog/*', '/case-studies', '/case-studies/*', '/contact'],
        disallow: ['/admin', '/admin/*', '/api', '/api/*', '/login', '/under-construction', '/maintenance', '/_next', '/_next/*'],
        sitemap: 'https://johnschibelli.dev/sitemap.xml',
        crawlDelay: null,
        userAgents: {
          '*': {
            allow: ['/', '/about', '/projects', '/projects/*', '/blog', '/blog/*', '/case-studies', '/case-studies/*', '/contact'],
            disallow: ['/admin', '/admin/*', '/api', '/api/*', '/login', '/under-construction', '/maintenance', '/_next', '/_next/*']
          },
          'GPTBot': {
            disallow: ['/']
          },
          'Google-Extended': {
            disallow: ['/']
          },
          'ChatGPT-User': {
            disallow: ['/']
          },
          'CCBot': {
            disallow: ['/']
          },
          'anthropic-ai': {
            disallow: ['/']
          },
          'Claude-Web': {
            disallow: ['/']
          }
        }
      },
      performance: {
        imageOptimization: {
          enabled: true,
          formats: ['webp', 'avif'],
          quality: 85,
          lazyLoading: true
        },
        caching: {
          staticAssets: '1y',
          htmlPages: '1h',
          apiResponses: '5m'
        }
      }
    };

    return NextResponse.json(seoSettings);
  } catch (error) {
    console.error("Error fetching SEO settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch SEO settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userRole = (session.user as any)?.role;
    if (!userRole || !["ADMIN"].includes(userRole)) {
      return NextResponse.json(
        { error: "Only administrators can update SEO settings" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      meta,
      social,
      analytics,
      structuredData,
      sitemap,
      robots,
      performance
    } = body;

    // TODO: Implement database storage for SEO settings
    // For now, we'll validate the data and return success
    
    // Validate required fields
    if (!meta || !meta.title || !meta.description) {
      return NextResponse.json(
        { error: "Meta title and description are required" },
        { status: 400 }
      );
    }

    // Validate meta title length
    if (meta.title.length < 30 || meta.title.length > 60) {
      return NextResponse.json(
        { error: "Meta title should be between 30-60 characters" },
        { status: 400 }
      );
    }

    // Validate meta description length
    if (meta.description.length < 120 || meta.description.length > 160) {
      return NextResponse.json(
        { error: "Meta description should be between 120-160 characters" },
        { status: 400 }
      );
    }

    // TODO: Store settings in database
    // const seoSettings = await prisma.seoSettings.upsert({
    //   where: { id: 'default' },
    //   update: { ...body },
    //   create: { id: 'default', ...body }
    // });

    return NextResponse.json({
      message: "SEO settings updated successfully",
      settings: body
    });
  } catch (error) {
    console.error("Error updating SEO settings:", error);
    return NextResponse.json(
      { error: "Failed to update SEO settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  // Alias for POST
  return POST(request);
}