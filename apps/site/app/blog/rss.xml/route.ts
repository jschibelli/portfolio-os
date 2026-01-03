import { NextResponse } from 'next/server';
import { fetchPosts } from '../../../lib/content-api';

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://johnschibelli.dev';
    const posts = await fetchPosts(20);

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>John Schibelli Blog</title>
    <description>Technology &amp; Development</description>
    <link>${baseUrl}/blog</link>
    <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${posts
      .map((post) => {
        const title = post.title || 'Untitled';
        const description = post.brief || '';
        const link = `${baseUrl}/blog/${post.slug}`;
        const pubDate = post.publishedAt ? new Date(post.publishedAt).toUTCString() : new Date().toUTCString();
        const author = post.author?.name || 'John Schibelli';

        return `
    <item>
      <title><![CDATA[${title}]]></title>
      <description><![CDATA[${description}]]></description>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <author><![CDATA[${author}]]></author>
    </item>`;
      })
      .join('')}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('Failed to generate RSS feed:', error);
    return new NextResponse('Failed to generate RSS feed', { status: 500 });
  }
}


