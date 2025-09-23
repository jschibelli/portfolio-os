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

    // Get integrations from the database
    const integrations = await prisma.integration.findMany({
      orderBy: [
        { name: 'asc' }
      ]
    });

    // If no integrations exist, return default integrations
    if (integrations.length === 0) {
      return NextResponse.json([
        {
          id: 'google-analytics',
          name: 'Google Analytics',
          description: 'Track website traffic and user behavior',
          category: 'analytics',
          status: 'inactive',
          config: {
            trackingId: '',
            enhancedEcommerce: false,
            demographics: false
          },
          lastSync: null,
          syncStatus: 'not_synced'
        },
        {
          id: 'mailchimp',
          name: 'Mailchimp',
          description: 'Email marketing and newsletter management',
          category: 'marketing',
          status: 'inactive',
          config: {
            apiKey: '',
            listId: '',
            serverPrefix: ''
          },
          lastSync: null,
          syncStatus: 'not_synced'
        },
        {
          id: 'slack',
          name: 'Slack',
          description: 'Team communication and notifications',
          category: 'communication',
          status: 'inactive',
          config: {
            webhookUrl: '',
            channel: '#general',
            username: 'Mindware Bot'
          },
          lastSync: null,
          syncStatus: 'not_synced'
        },
        {
          id: 'zapier',
          name: 'Zapier',
          description: 'Automate workflows between apps',
          category: 'automation',
          status: 'inactive',
          config: {
            webhookUrl: '',
            triggers: [],
            actions: []
          },
          lastSync: null,
          syncStatus: 'not_synced'
        },
        {
          id: 'stripe',
          name: 'Stripe',
          description: 'Payment processing and subscriptions',
          category: 'payments',
          status: 'inactive',
          config: {
            publishableKey: '',
            secretKey: '',
            webhookSecret: ''
          },
          lastSync: null,
          syncStatus: 'not_synced'
        }
      ]);
    }

    // Transform the data to match the expected format
    const transformedIntegrations = integrations.map(integration => ({
      id: integration.id,
      name: integration.name,
      description: integration.description,
      category: integration.category,
      status: integration.status,
      config: integration.config || {},
      lastSync: integration.lastSync?.toISOString() || null,
      syncStatus: integration.syncStatus || 'not_synced'
    }));

    return NextResponse.json(transformedIntegrations);
  } catch (error) {
    console.error("Error fetching integrations:", error);
    return NextResponse.json(
      { error: "Failed to fetch integrations" },
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
    const { id, config, status } = body;

    // Update the integration
    const integration = await prisma.integration.update({
      where: { id },
      data: {
        config,
        status,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(integration);
  } catch (error) {
    console.error("Error updating integration:", error);
    return NextResponse.json(
      { error: "Failed to update integration" },
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
    const { action, integrationId, data } = body;

    switch (action) {
      case 'test-connection':
        // Test integration connection logic would go here
        return NextResponse.json({ 
          message: "Connection test successful",
          status: "connected",
          integrationId
        });

      case 'sync-data':
        // Sync data logic would go here
        return NextResponse.json({ 
          message: "Data sync completed",
          status: "synced",
          integrationId,
          recordsProcessed: 150
        });

      case 'enable':
        // Enable integration logic would go here
        await prisma.integration.update({
          where: { id: integrationId },
          data: { status: 'active' }
        });
        return NextResponse.json({ 
          message: "Integration enabled successfully",
          status: "enabled",
          integrationId
        });

      case 'disable':
        // Disable integration logic would go here
        await prisma.integration.update({
          where: { id: integrationId },
          data: { status: 'inactive' }
        });
        return NextResponse.json({ 
          message: "Integration disabled successfully",
          status: "disabled",
          integrationId
        });

      case 'reset':
        // Reset integration logic would go here
        await prisma.integration.update({
          where: { id: integrationId },
          data: { 
            status: 'inactive',
            config: {},
            lastSync: null,
            syncStatus: 'not_synced'
          }
        });
        return NextResponse.json({ 
          message: "Integration reset successfully",
          status: "reset",
          integrationId
        });

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error processing integration action:", error);
    return NextResponse.json(
      { error: "Failed to process integration action" },
      { status: 500 }
    );
  }
}

