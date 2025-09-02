import { NextRequest, NextResponse } from "next/server";
import { getArticles, createArticle } from "../../../../lib/data/articles";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = searchParams.get("limit");
    
    const articles = await getArticles({
      status: status || undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
    
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, subtitle, slug, excerpt, status, visibility, contentJson, authorId } = body;
    
    if (!title || !slug || !authorId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    const article = await createArticle({
      title,
      subtitle,
      slug,
      excerpt,
      status: status || "DRAFT",
      visibility: visibility || "PUBLIC",
      contentJson,
      authorId,
    });
    
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Failed to create article:", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}


