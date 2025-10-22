/**
 * Publishing Status API Endpoint
 * Get publishing status for a specific publishing job
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { publishingService } from "@/lib/publishing/service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Publishing ID is required" },
        { status: 400 }
      );
    }

    const status = await publishingService.getStatus(id);

    return NextResponse.json({
      success: true,
      status
    });

  } catch (error) {
    console.error("Get publishing status error:", error);
    return NextResponse.json(
      { error: "Failed to get publishing status" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Publishing ID is required" },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'cancel':
        await publishingService.cancel(id);
        result = { message: "Publishing cancelled successfully" };
        break;
      
      case 'retry':
        result = await publishingService.retry(id);
        break;
      
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error("Publishing action error:", error);
    return NextResponse.json(
      { error: "Failed to perform publishing action" },
      { status: 500 }
    );
  }
}
