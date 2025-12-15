import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Constants for default publication configuration
const DEFAULT_PUBLICATION_NAME = 'Portfolio Blog';
const DEFAULT_PUBLICATION_DESCRIPTION = 'A modern blog powered by Next.js';
const DEFAULT_PUBLICATION_URL = 'http://localhost:3000';
const DEFAULT_SOCIAL_LINKS: Record<string, string> = {};
const DEFAULT_SEO_SETTINGS: Record<string, any> = {};

/**
 * Helper function to safely parse JSON from environment variables
 * Provides type-safe parsing with validation and error handling
 * 
 * @param envVar - The environment variable value (may be undefined)
 * @param defaultValue - Default value to return if parsing fails or env var is missing
 * @param varName - Name of the environment variable for error logging
 * @returns Parsed JSON object or default value (always returns an object, never null/undefined)
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
    // Validate that parsed value is a plain object (not array, null, or primitive)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      console.error(`[Publication API] Invalid JSON structure in ${varName}: expected object, got ${typeof parsed}`);
      return defaultValue;
    }
    return parsed;
  } catch (e) {
    console.error(`[Publication API] Invalid JSON in ${varName} environment variable:`, e);
    return defaultValue;
  }
}

/**
 * Public API endpoint for publication information
 * Returns publication metadata including stats, configuration, and settings
 * 
 * Configuration priority:
 * 1. Environment variables (highest priority)
 * 2. Default constants (fallback)
 * 
 * Note: This endpoint does not require authentication as it serves public metadata
 */
export async function GET(request: NextRequest) {
  try {
    // Get publication stats with error handling
    // If stats retrieval fails, we'll use 0 as a safe default
    let totalPosts = 0;
    try {
      const stats = await prisma.article.aggregate({
        where: {
          status: 'PUBLISHED',
          visibility: 'PUBLIC'
        },
        _count: {
          id: true
        }
      });
      totalPosts = stats._count.id;
      console.log(`[Publication API] Successfully retrieved stats: ${totalPosts} published posts`);
    } catch (statsError) {
      console.error("[Publication API] Failed to retrieve publication stats:", statsError);
      // Continue with default value (0) - stats failure shouldn't break the entire endpoint
      if (statsError instanceof Error) {
        console.error("[Publication API] Stats error details:", {
          message: statsError.message,
          stack: statsError.stack
        });
      }
    }

    // Parse JSON environment variables with error handling and validation
    // Using constants for default values ensures consistency
    const socialLinks = parseJsonEnvVar(
      process.env.SOCIAL_LINKS,
      DEFAULT_SOCIAL_LINKS,
      'SOCIAL_LINKS'
    );
    
    const seoSettings = parseJsonEnvVar(
      process.env.SEO_SETTINGS,
      DEFAULT_SEO_SETTINGS,
      'SEO_SETTINGS'
    );
    
    // Build publication object with environment variables and defaults
    // Using nullish coalescing (??) ensures we only use defaults when env vars are null/undefined
    const publication = {
      name: process.env.SITE_NAME ?? DEFAULT_PUBLICATION_NAME,
      description: process.env.SITE_DESCRIPTION ?? DEFAULT_PUBLICATION_DESCRIPTION,
      url: process.env.NEXTAUTH_URL ?? process.env.SITE_URL ?? DEFAULT_PUBLICATION_URL,
      logo: process.env.SITE_LOGO ?? null,
      favicon: process.env.SITE_FAVICON ?? null,
      socialLinks,
      seoSettings,
      stats: {
        totalPosts,
        lastUpdated: new Date().toISOString()
      }
    };

    console.log(`[Publication API] Success - returning publication info`);
    return NextResponse.json(publication);
  } catch (error) {
    console.error("[Publication API] Error fetching publication info:", error);
    if (error instanceof Error) {
      console.error("[Publication API] Error details:", {
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json(
      { error: "Failed to fetch publication information" },
      { status: 500 }
    );
  }
}
