import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paths, tags } = body;

    if (paths && Array.isArray(paths)) {
      paths.forEach((path: string) => {
        revalidatePath(path);
      });
    }

    if (tags && Array.isArray(tags)) {
      tags.forEach((tag: string) => {
        revalidateTag(tag);
      });
    }

    return NextResponse.json({
      message: "Revalidation successful",
      revalidated: {
        paths: paths || [],
        tags: tags || [],
      },
    });
  } catch (error) {
    console.error("Failed to revalidate:", error);
    return NextResponse.json(
      { error: "Failed to revalidate" },
      { status: 500 }
    );
  }
}


