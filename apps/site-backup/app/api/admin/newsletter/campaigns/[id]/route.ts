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

    const campaign = await prisma.newsletterCampaign.findUnique({
      where: { id }
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: campaign.id,
      title: campaign.title,
      subject: campaign.subject,
      content: campaign.content,
      status: campaign.status,
      scheduledAt: campaign.scheduledAt?.toISOString() || null,
      sentAt: campaign.sentAt?.toISOString() || null,
      recipientCount: campaign.recipientCount || 0,
      openRate: campaign.openRate || 0,
      clickRate: campaign.clickRate || 0,
      tags: campaign.tags || [],
      createdAt: campaign.createdAt.toISOString(),
      updatedAt: campaign.updatedAt.toISOString()
    });
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaign" },
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
    const { 
      title, 
      subject, 
      content, 
      status, 
      scheduledAt, 
      tags
    } = body;

    // Check if campaign is already sent
    const existingCampaign = await prisma.newsletterCampaign.findUnique({
      where: { id }
    });

    if (existingCampaign?.status === 'SENT') {
      return NextResponse.json(
        { error: "Cannot modify a campaign that has already been sent" },
        { status: 400 }
      );
    }

    const campaign = await prisma.newsletterCampaign.update({
      where: { id },
      data: {
        title,
        subject,
        content,
        status,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        tags,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      id: campaign.id,
      title: campaign.title,
      subject: campaign.subject,
      content: campaign.content,
      status: campaign.status,
      scheduledAt: campaign.scheduledAt?.toISOString() || null,
      sentAt: campaign.sentAt?.toISOString() || null,
      recipientCount: campaign.recipientCount || 0,
      openRate: campaign.openRate || 0,
      clickRate: campaign.clickRate || 0,
      tags: campaign.tags || [],
      createdAt: campaign.createdAt.toISOString(),
      updatedAt: campaign.updatedAt.toISOString()
    });
  } catch (error) {
    console.error("Error updating campaign:", error);
    return NextResponse.json(
      { error: "Failed to update campaign" },
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

    // Check if campaign is already sent
    const campaign = await prisma.newsletterCampaign.findUnique({
      where: { id }
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    if (campaign.status === 'SENT') {
      return NextResponse.json(
        { error: "Cannot delete a campaign that has already been sent" },
        { status: 400 }
      );
    }

    await prisma.newsletterCampaign.delete({
      where: { id }
    });

    return NextResponse.json({ 
      message: "Campaign deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return NextResponse.json(
      { error: "Failed to delete campaign" },
      { status: 500 }
    );
  }
}

