import { NextRequest, NextResponse } from "next/server";

// Temporarily disabled - Comment model not in schema
export async function GET(request: NextRequest) {
  return NextResponse.json({
    comments: [],
    pagination: {
      page: 1,
      limit: 50,
      total: 0,
      pages: 0
    }
  });
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "Comments feature not implemented yet" },
    { status: 501 }
  );
}