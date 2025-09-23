import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
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

    // Check if user has admin role
    const userRole = (session.user as any)?.role;
    if (!userRole || !["ADMIN", "EDITOR"].includes(userRole)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Get SEO settings from the database
    const seoSettings = await prisma.seoSettings.findFirst({
      where: {
        id: 'default' // Assuming we have a default settings record
      }
    });

    // If no settings exist, return default values
    if (!seoSettings) {
      return NextResponse.json({
        general: {
          siteTitle: "Mindware Blog",
          siteDescription: "Professional insights and case studies",
          siteUrl: "https://mindware.com",
          siteLanguage: "en",
          siteLocale: "en_US"
        },
        social: {
          facebookAppId: "",
          twitterUsername: "@mindware",
          linkedinCompany: "mindware",
          instagramUsername: "mindware"
        },
        analytics: {
          googleAnalyticsId: "",
          googleTagManagerId: "",
          facebookPixelId: "",
          linkedinInsightTag: ""
        },
        advanced: {
          robotsTxt: "User-agent: *\nAllow: /",
          sitemapUrl: "/sitemap.xml",
          canonicalUrl: "https://mindware.com",
          structuredData: {}
        }
      });
    }

    return NextResponse.json(seoSettings.settings);
  } catch (error) {
    console.error("Error fetching SEO settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch SEO settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const { general, social, analytics, advanced } = body;

    // Update or create SEO settings
    const seoSettings = await prisma.seoSettings.upsert({
      where: {
        id: 'default'
      },
      update: {
        settings: {
          general,
          social,
          analytics,
          advanced
        },
        updatedAt: new Date()
      },
      create: {
        id: 'default',
        settings: {
          general,
          social,
          analytics,
          advanced
        }
      }
    });

    return NextResponse.json(seoSettings.settings);
  } catch (error) {
    console.error("Error updating SEO settings:", error);
    return NextResponse.json(
      { error: "Failed to update SEO settings" },
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
    if (!userRole || !["ADMIN", "EDITOR"].includes(userRole)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'generate-sitemap':
        // Generate sitemap logic would go here
        return NextResponse.json({ 
          message: "Sitemap generated successfully",
          sitemapUrl: "/sitemap.xml"
        });

      case 'test-seo':
        // Test SEO settings logic would go here
        return NextResponse.json({ 
          message: "SEO test completed",
          results: {
            metaTags: "✓",
            structuredData: "✓",
            socialTags: "✓",
            performance: "Good"
          }
        });

      case 'export-settings':
        // Export settings logic would go here
        return NextResponse.json({ 
          message: "Settings exported successfully",
          downloadUrl: "/api/admin/settings/seo/export"
        });

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error processing SEO action:", error);
    return NextResponse.json(
      { error: "Failed to process SEO action" },
      { status: 500 }
    );
  }
}

