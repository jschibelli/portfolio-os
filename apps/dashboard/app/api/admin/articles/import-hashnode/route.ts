import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { importHashnodeArticles } from "@/scripts/import-hashnode-articles";

const prisma = new PrismaClient();

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

    // Check if GitHub token is configured
    if (!process.env.GITHUB_TOKEN) {
      return NextResponse.json(
        { error: "GitHub token not configured. Please set GITHUB_TOKEN environment variable." },
        { status: 400 }
      );
    }

    try {
      console.log("Import API: Starting Hashnode import...");
      // Run the import
      await importHashnodeArticles();

      // Get the count of imported articles
      const articleCount = await prisma.article.count();
      console.log(`Import API: Import completed. Total articles in database: ${articleCount}`);

      return NextResponse.json({
        message: "Hashnode articles imported successfully",
        importedCount: articleCount
      });
    } catch (importError) {
      console.error("Import error:", importError);
      return NextResponse.json(
        { error: `Import failed: ${importError instanceof Error ? importError.message : 'Unknown error'}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error importing Hashnode articles:", error);
    return NextResponse.json(
      { error: "Failed to import Hashnode articles" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
