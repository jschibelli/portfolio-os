import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Helper function to safely parse JSON from environment variables
 * @param envVar - The environment variable value
 * @param defaultValue - Default value to return if parsing fails or env var is missing
 * @param varName - Name of the environment variable for error logging
 * @returns Parsed JSON object or default value
 */
function parseJsonEnvVar(
  envVar: string | undefined,
  defaultValue: Record<string, any> = {},
  varName: string
): Record<string, any> {
  if (!envVar) {
    return defaultValue;
  }
  
  try {
    const parsed = JSON.parse(envVar);
    // Validate that parsed value is an object
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      console.error(`Invalid JSON structure in ${varName}: expected object, got ${typeof parsed}`);
      return defaultValue;
    }
    return parsed;
  } catch (e) {
    console.error(`Invalid JSON in ${varName} environment variable:`, e);
    return defaultValue;
  }
}

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
    
    // Parse JSON environment variables with error handling and validation
    const socialLinks = parseJsonEnvVar(
      process.env.SOCIAL_LINKS,
      {},
      'SOCIAL_LINKS'
    );
    
    const seoSettings = parseJsonEnvVar(
      process.env.SEO_SETTINGS,
      {},
      'SEO_SETTINGS'
    );
    
    const publication = {
      name: process.env.SITE_NAME ?? 'Portfolio Blog',
      description: process.env.SITE_DESCRIPTION ?? 'A modern blog powered by Next.js',
      url: process.env.NEXTAUTH_URL ?? process.env.SITE_URL ?? 'http://localhost:3000',
      logo: process.env.SITE_LOGO ?? null,
      favicon: process.env.SITE_FAVICON ?? null,
      socialLinks,
      seoSettings,
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
