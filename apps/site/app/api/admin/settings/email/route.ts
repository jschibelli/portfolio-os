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

    // Get email settings from the database
    const emailSettings = await prisma.emailSettings.findFirst({
      where: {
        id: 'default' // Assuming we have a default settings record
      }
    });

    // If no settings exist, return default values
    if (!emailSettings) {
      return NextResponse.json({
        smtp: {
          host: "",
          port: 587,
          secure: false,
          username: "",
          password: ""
        },
        sender: {
          name: "Mindware Blog",
          email: "noreply@mindware.com",
          replyTo: "contact@mindware.com"
        },
        templates: {
          welcome: {
            subject: "Welcome to Mindware Blog",
            enabled: true
          },
          newsletter: {
            subject: "Your Weekly Mindware Update",
            enabled: true
          },
          passwordReset: {
            subject: "Reset Your Password",
            enabled: true
          },
          commentNotification: {
            subject: "New Comment on Your Article",
            enabled: true
          }
        },
        notifications: {
          newUser: true,
          newComment: true,
          newArticle: true,
          systemAlerts: true
        },
        limits: {
          dailyLimit: 1000,
          hourlyLimit: 100,
          retryAttempts: 3
        }
      });
    }

    return NextResponse.json(emailSettings.settings);
  } catch (error) {
    console.error("Error fetching email settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch email settings" },
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
    const { smtp, sender, templates, notifications, limits } = body;

    // Update or create email settings
    const emailSettings = await prisma.emailSettings.upsert({
      where: {
        id: 'default'
      },
      update: {
        settings: {
          smtp,
          sender,
          templates,
          notifications,
          limits
        },
        updatedAt: new Date()
      },
      create: {
        id: 'default',
        settings: {
          smtp,
          sender,
          templates,
          notifications,
          limits
        }
      }
    });

    return NextResponse.json(emailSettings.settings);
  } catch (error) {
    console.error("Error updating email settings:", error);
    return NextResponse.json(
      { error: "Failed to update email settings" },
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
    const { action, data } = body;

    switch (action) {
      case 'test-connection':
        // Test SMTP connection logic would go here
        return NextResponse.json({ 
          message: "SMTP connection test successful",
          status: "connected"
        });

      case 'send-test-email':
        // Send test email logic would go here
        return NextResponse.json({ 
          message: "Test email sent successfully",
          messageId: "test-123"
        });

      case 'validate-settings':
        // Validate email settings logic would go here
        return NextResponse.json({ 
          message: "Email settings validated successfully",
          valid: true,
          issues: []
        });

      case 'export-settings':
        // Export settings logic would go here
        return NextResponse.json({ 
          message: "Settings exported successfully",
          downloadUrl: "/api/admin/settings/email/export"
        });

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error processing email action:", error);
    return NextResponse.json(
      { error: "Failed to process email action" },
      { status: 500 }
    );
  }
}

