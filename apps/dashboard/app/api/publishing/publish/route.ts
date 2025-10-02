/**
 * Publishing API Endpoint
 * Handles article publishing to multiple platforms
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { publishingService } from "@/lib/publishing/service";
import { PublishingOptions } from "@/lib/publishing/types";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user has publishing permissions
    const userRole = (session.user as any)?.role;
    if (!userRole || !["ADMIN", "EDITOR", "AUTHOR"].includes(userRole)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { articleId, options, scheduledFor } = body;

    if (!articleId) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    if (!options) {
      return NextResponse.json(
        { error: "Publishing options are required" },
        { status: 400 }
      );
    }

    // Validate publishing options
    const validationResult = await validatePublishingOptions(options);
    if (!validationResult.isValid) {
      return NextResponse.json(
        { error: "Invalid publishing options", details: validationResult.errors },
        { status: 400 }
      );
    }

    let result;

    if (scheduledFor) {
      // Schedule publishing
      result = await publishingService.schedule(articleId, options, scheduledFor);
    } else {
      // Publish immediately
      result = await publishingService.publish(articleId, options);
    }

    return NextResponse.json({
      success: true,
      publishingId: result.id,
      status: result.status,
      message: scheduledFor 
        ? `Article scheduled for publishing at ${scheduledFor}`
        : "Article published successfully"
    });

  } catch (error) {
    console.error("Publishing error:", error);
    return NextResponse.json(
      { error: "Failed to publish article" },
      { status: 500 }
    );
  }
}

async function validatePublishingOptions(options: PublishingOptions): Promise<{ isValid: boolean; errors: string[] }> {
  const errors: string[] = [];

  if (!options.platforms || options.platforms.length === 0) {
    errors.push("At least one platform must be selected");
  }

  if (options.platforms) {
    for (const platform of options.platforms) {
      if (!platform.name) {
        errors.push("Platform name is required");
      }
      
      if (platform.enabled && !platform.settings) {
        errors.push(`Settings required for platform: ${platform.name}`);
      }
    }
  }

  if (options.scheduleFor && new Date(options.scheduleFor) <= new Date()) {
    errors.push("Scheduled time must be in the future");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
