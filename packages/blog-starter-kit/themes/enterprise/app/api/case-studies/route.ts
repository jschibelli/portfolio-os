import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const caseStudies = await prisma.caseStudy.findMany({
      where: {
        status: "PUBLISHED",
        visibility: "PUBLIC"
      },
      orderBy: {
        publishedAt: "desc"
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

    return NextResponse.json(caseStudies);
  } catch (error) {
    console.error("Error fetching case studies:", error);
    return NextResponse.json(
      { error: "Failed to fetch case studies" },
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

    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      status,
      visibility,
      client,
      industry,
      duration,
      teamSize,
      technologies,
      challenges,
      solution,
      results,
      metrics,
      lessonsLearned,
      nextSteps,
      coverImage,
      seoTitle,
      seoDescription,
      canonicalUrl,
      ogImage,
      allowComments,
      allowReactions,
      featured,
      tags,
      category
    } = body;

    // Validate required fields
    if (!title || !slug) {
      return NextResponse.json(
        { error: "Title and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingCaseStudy = await prisma.caseStudy.findUnique({
      where: { slug }
    });

    if (existingCaseStudy) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      );
    }

    // Create the case study
    const caseStudy = await prisma.caseStudy.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        status: status || "DRAFT",
        visibility: visibility || "PUBLIC",
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        client,
        industry,
        duration,
        teamSize,
        technologies: technologies || [],
        challenges,
        solution,
        results,
        metrics,
        lessonsLearned,
        nextSteps,
        coverImage,
        seoTitle,
        seoDescription,
        canonicalUrl,
        ogImage,
        allowComments: allowComments ?? true,
        allowReactions: allowReactions ?? true,
        featured: featured ?? false,
        tags: tags || [],
        category,
        authorId: (session.user as any).id
      }
    });

    return NextResponse.json(caseStudy, { status: 201 });
  } catch (error) {
    console.error("Error creating case study:", error);
    return NextResponse.json(
      { error: "Failed to create case study" },
      { status: 500 }
    );
  }
}
