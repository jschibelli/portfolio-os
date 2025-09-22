import { NextRequest, NextResponse } from "next/server";

// Temporarily disabled - Settings models not in schema
export async function GET(request: NextRequest) {
  return NextResponse.json({
    theme: 'light',
    primaryColor: '#3b82f6',
    logo: '',
    favicon: '',
    customCss: '',
    footer: {
      text: '',
      links: []
    }
  });
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "Appearance settings feature not implemented yet" },
    { status: 501 }
  );
}