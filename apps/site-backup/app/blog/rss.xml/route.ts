import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        visibility: "PUBLIC",
      },
      orderBy: { publishedAt: "desc" },
      take: 20,
      select: {
        title: true,
        subtitle: true,
        slug: true,
        excerpt: true,
        publishedAt: true,
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Shabelle.dev Blog</title>
    <description>Technology & Development Blog</description>
    <link>https://shabelle.dev/blog</link>
    <atom:link href="https://shabelle.dev/blog/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${articles
      .map(
        (article) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <description><![CDATA[${article.excerpt || article.subtitle || ""}]]></description>
      <link>https://shabelle.dev/blog/${article.slug}</link>
      <guid>https://shabelle.dev/blog/${article.slug}</guid>
      <pubDate>${article.publishedAt?.toUTCString() || new Date().toUTCString()}</pubDate>
      <author>${article.author?.name || article.author?.email || "Shabelle.dev"}</author>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Failed to generate RSS feed:", error);
    return new NextResponse("Failed to generate RSS feed", { status: 500 });
  }
}


