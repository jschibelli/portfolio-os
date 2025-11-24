import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public API endpoint for publication information
export async function GET(request: NextRequest) {
  try {
    // Get publication stats (Setting model doesn't exist, using defaults)
    const stats = await prisma.article.aggregate({
      where: {
        status: 'PUBLISHED',
        visibility: 'PUBLIC'
      },
      _count: {
        id: true
      }
    });

    // Use environment variables and defaults for publication info
    // Since there's no Setting model, we'll use sensible defaults
    const publication = {
      name: process.env.SITE_NAME || 'Portfolio Blog',
      description: process.env.SITE_DESCRIPTION || 'A modern blog powered by Next.js',
      url: process.env.NEXTAUTH_URL || process.env.SITE_URL || 'http://localhost:3000',
      logo: process.env.SITE_LOGO || null,
      favicon: process.env.SITE_FAVICON || null,
      socialLinks: process.env.SOCIAL_LINKS ? JSON.parse(process.env.SOCIAL_LINKS) : {},
      seoSettings: process.env.SEO_SETTINGS ? JSON.parse(process.env.SEO_SETTINGS) : {},
      stats: {
        totalPosts: stats._count.id,
        lastUpdated: new Date().toISOString()
      }
    };

    return NextResponse.json(publication);
  } catch (error) {
    console.error("Error fetching publication info:", error);
    return NextResponse.json(
      { error: "Failed to fetch publication information" },
      { status: 500 }
    );
  }
}
