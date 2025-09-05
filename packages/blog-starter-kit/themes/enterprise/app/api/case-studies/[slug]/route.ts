import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const caseStudy = await prisma.caseStudy.findUnique({
      where: { 
        slug,
        status: "PUBLISHED",
        visibility: "PUBLIC"
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!caseStudy) {
      return NextResponse.json(
        { error: "Case study not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(caseStudy);
  } catch (error) {
    console.error("Error fetching case study:", error);
    return NextResponse.json(
      { error: "Failed to fetch case study" },
      { status: 500 }
    );
  }
}
