import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
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

    const { id } = await params;

    // Check if media is in use
    const mediaWithUsage = await prisma.imageAsset.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            usedBy: true
          }
        }
      }
    });

    if (!mediaWithUsage) {
      return NextResponse.json(
        { error: "Media not found" },
        { status: 404 }
      );
    }

    if (mediaWithUsage._count.usedBy > 0) {
      return NextResponse.json(
        { 
          error: `Cannot delete media that is in use by ${mediaWithUsage._count.usedBy} article(s)`,
          inUse: true,
          usageCount: mediaWithUsage._count.usedBy
        },
        { status: 400 }
      );
    }

    await prisma.imageAsset.delete({
      where: { id }
    });

    // Note: We don't delete from blob storage here, but you could add that
    // using @vercel/blob's del() function if needed

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting media:", error);
    return NextResponse.json(
      { error: "Failed to delete media" },
      { status: 500 }
    );
  }
}






