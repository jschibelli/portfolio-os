import { NextRequest, NextResponse } from "next/server";

// Temporarily disabled - Role model not in schema
export async function GET(request: NextRequest) {
  return NextResponse.json({
    roles: [
      { id: 'admin', name: 'Admin', description: 'Full access', userCount: 1, permissions: ['all'] },
      { id: 'editor', name: 'Editor', description: 'Content management', userCount: 0, permissions: ['content'] },
      { id: 'author', name: 'Author', description: 'Article writing', userCount: 0, permissions: ['write'] }
    ],
    pagination: {
      page: 1,
      limit: 50,
      total: 3,
      pages: 1
    }
  });
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "Role management feature not implemented yet" },
    { status: 501 }
  );
}