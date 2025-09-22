import { NextRequest, NextResponse } from "next/server";

// Temporarily disabled - Comment model not in schema
export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  return NextResponse.json(
    { error: "Comments feature not implemented yet" },
    { status: 501 }
  );
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  return NextResponse.json(
    { error: "Comments feature not implemented yet" },
    { status: 501 }
  );
}