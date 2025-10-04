import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Public API endpoint for publication information
export async function GET(request: NextRequest) {
  try {
    // Get publication settings and stats
    const [settings, stats] = await Promise.all([
      prisma.setting.findMany({
        where: {
          key: {
            in: [
              'site_name',
              'site_description',
              'site_url',
              'site_logo',
              'site_favicon',
              'social_links',
              'seo_settings'
            ]
          }
        }
      }),
      prisma.article.aggregate({
        where: {
          status: 'PUBLISHED',
          visibility: 'PUBLIC'
        },
        _count: {
          id: true
        }
      })
    ]);

    // Transform settings into a more usable format
    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, any>);

    const publication = {
      name: settingsMap.site_name || 'Portfolio Blog',
      description: settingsMap.site_description || 'A modern blog powered by Next.js',
      url: settingsMap.site_url || process.env.NEXTAUTH_URL || 'http://localhost:3000',
      logo: settingsMap.site_logo || null,
      favicon: settingsMap.site_favicon || null,
      socialLinks: settingsMap.social_links ? JSON.parse(settingsMap.social_links) : {},
      seoSettings: settingsMap.seo_settings ? JSON.parse(settingsMap.seo_settings) : {},
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
