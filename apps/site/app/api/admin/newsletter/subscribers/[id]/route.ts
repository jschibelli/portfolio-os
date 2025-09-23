import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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

    const { id } = params;

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { id }
    });

    if (!subscriber) {
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: subscriber.id,
      email: subscriber.email,
      name: subscriber.name,
      status: subscriber.status,
      subscribedAt: subscriber.createdAt.toISOString(),
      lastEmailSent: subscriber.lastEmailSent?.toISOString() || null,
      tags: subscriber.tags || [],
      source: subscriber.source,
      engagement: subscriber.engagement
    });
  } catch (error) {
    console.error("Error fetching subscriber:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriber" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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

    const { id } = params;
    const body = await request.json();
    const { name, status, tags, source, engagement } = body;

    const subscriber = await prisma.newsletterSubscriber.update({
      where: { id },
      data: {
        name,
        status,
        tags,
        source,
        engagement,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      id: subscriber.id,
      email: subscriber.email,
      name: subscriber.name,
      status: subscriber.status,
      subscribedAt: subscriber.createdAt.toISOString(),
      lastEmailSent: subscriber.lastEmailSent?.toISOString() || null,
      tags: subscriber.tags || [],
      source: subscriber.source,
      engagement: subscriber.engagement
    });
  } catch (error) {
    console.error("Error updating subscriber:", error);
    return NextResponse.json(
      { error: "Failed to update subscriber" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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

    const { id } = params;

    // Check if subscriber exists
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { id }
    });

    if (!subscriber) {
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 }
      );
    }

    await prisma.newsletterSubscriber.delete({
      where: { id }
    });

    return NextResponse.json({ 
      message: "Subscriber deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    return NextResponse.json(
      { error: "Failed to delete subscriber" },
      { status: 500 }
    );
  }
}

