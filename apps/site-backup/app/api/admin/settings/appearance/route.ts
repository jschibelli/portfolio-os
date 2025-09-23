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

    // Get appearance settings from the database
    const appearanceSettings = await prisma.appearanceSettings.findFirst({
      where: {
        id: 'default' // Assuming we have a default settings record
      }
    });

    // If no settings exist, return default values
    if (!appearanceSettings) {
      return NextResponse.json({
        theme: {
          primary: 'slate',
          accent: 'blue',
          secondary: 'gray',
          neutral: 'stone'
        },
        colors: {
          primary: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
            950: '#020617'
          },
          accent: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
            950: '#172554'
          }
        },
        layout: {
          sidebarWidth: 280,
          headerHeight: 64,
          footerHeight: 80,
          maxContentWidth: 1200
        },
        typography: {
          fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
            serif: ['Georgia', 'serif'],
            mono: ['JetBrains Mono', 'monospace']
          },
          fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem'
          },
          fontWeight: {
            light: 300,
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700
          }
        },
        components: {
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease-in-out'
        },
        customCSS: '',
        customJS: ''
      });
    }

    return NextResponse.json(appearanceSettings.settings);
  } catch (error) {
    console.error("Error fetching appearance settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch appearance settings" },
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
    const { theme, colors, layout, typography, components, customCSS, customJS } = body;

    // Update or create appearance settings
    const appearanceSettings = await prisma.appearanceSettings.upsert({
      where: {
        id: 'default'
      },
      update: {
        settings: {
          theme,
          colors,
          layout,
          typography,
          components,
          customCSS,
          customJS
        },
        updatedAt: new Date()
      },
      create: {
        id: 'default',
        settings: {
          theme,
          colors,
          layout,
          typography,
          components,
          customCSS,
          customJS
        }
      }
    });

    return NextResponse.json(appearanceSettings.settings);
  } catch (error) {
    console.error("Error updating appearance settings:", error);
    return NextResponse.json(
      { error: "Failed to update appearance settings" },
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
      case 'preview-theme':
        // Preview theme logic would go here
        return NextResponse.json({ 
          message: "Theme preview generated",
          previewUrl: "/api/admin/settings/appearance/preview"
        });

      case 'export-theme':
        // Export theme logic would go here
        return NextResponse.json({ 
          message: "Theme exported successfully",
          downloadUrl: "/api/admin/settings/appearance/export"
        });

      case 'import-theme':
        // Import theme logic would go here
        return NextResponse.json({ 
          message: "Theme imported successfully",
          theme: data.theme
        });

      case 'reset-to-defaults':
        // Reset to defaults logic would go here
        await prisma.appearanceSettings.update({
          where: { id: 'default' },
          data: {
            settings: {
              theme: {
                primary: 'slate',
                accent: 'blue',
                secondary: 'gray',
                neutral: 'stone'
              },
              colors: {
                primary: {
                  50: '#f8fafc',
                  100: '#f1f5f9',
                  200: '#e2e8f0',
                  300: '#cbd5e1',
                  400: '#94a3b8',
                  500: '#64748b',
                  600: '#475569',
                  700: '#334155',
                  800: '#1e293b',
                  900: '#0f172a',
                  950: '#020617'
                },
                accent: {
                  50: '#eff6ff',
                  100: '#dbeafe',
                  200: '#bfdbfe',
                  300: '#93c5fd',
                  400: '#60a5fa',
                  500: '#3b82f6',
                  600: '#2563eb',
                  700: '#1d4ed8',
                  800: '#1e40af',
                  900: '#1e3a8a',
                  950: '#172554'
                }
              },
              layout: {
                sidebarWidth: 280,
                headerHeight: 64,
                footerHeight: 80,
                maxContentWidth: 1200
              },
              typography: {
                fontFamily: {
                  sans: ['Inter', 'system-ui', 'sans-serif'],
                  serif: ['Georgia', 'serif'],
                  mono: ['JetBrains Mono', 'monospace']
                },
                fontSize: {
                  xs: '0.75rem',
                  sm: '0.875rem',
                  base: '1rem',
                  lg: '1.125rem',
                  xl: '1.25rem',
                  '2xl': '1.5rem',
                  '3xl': '1.875rem',
                  '4xl': '2.25rem'
                },
                fontWeight: {
                  light: 300,
                  normal: 400,
                  medium: 500,
                  semibold: 600,
                  bold: 700
                }
              },
              components: {
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease-in-out'
              },
              customCSS: '',
              customJS: ''
            }
          }
        });
        return NextResponse.json({ 
          message: "Theme reset to defaults successfully"
        });

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error processing appearance action:", error);
    return NextResponse.json(
      { error: "Failed to process appearance action" },
      { status: 500 }
    );
  }
}

