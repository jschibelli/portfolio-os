import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userRole = (session.user as any)?.role;
    if (!userRole || !['ADMIN', 'EDITOR', 'AUTHOR'].includes(userRole)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      id,
      title,
      subtitle,
      slug,
      tags,
      coverUrl,
      content_json,
      content_mdx,
      excerpt,
      // SEO fields
      metaTitle,
      metaDescription,
      canonicalUrl,
      noindex,
      ogTitle,
      ogDescription,
      ogImage,
      twitterCard,
      twitterTitle,
      twitterDescription,
      twitterImage,
      focusKeyword,
      seoScore,
    } = body;

    // Validate required fields
    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Title and slug are required' },
        { status: 400 }
      );
    }

    // Check if updating existing article or creating new
    if (id) {
      // Update existing article
      const article = await prisma.article.update({
        where: { id },
        data: {
          title,
          subtitle,
          slug,
          contentJson: content_json,
          contentMdx: content_mdx,
          excerpt,
          // SEO fields
          metaTitle,
          metaDescription,
          canonicalUrl,
          noindex: noindex || false,
          ogTitle,
          ogDescription,
          ogImageUrl: ogImage,
          twitterCard: twitterCard || 'summary_large_image',
          twitterTitle,
          twitterDescription,
          twitterImage,
          focusKeyword,
          seoScore,
        },
      });

      return NextResponse.json({
        success: true,
        id: article.id,
        slug: article.slug,
      });
    } else {
      // Check if slug already exists
      const existingArticle = await prisma.article.findUnique({
        where: { slug },
      });

      if (existingArticle) {
        return NextResponse.json(
          { error: 'An article with this slug already exists' },
          { status: 400 }
        );
      }

      // Create new article
      const article = await prisma.article.create({
        data: {
          title,
          subtitle,
          slug,
          contentJson: content_json,
          contentMdx: content_mdx,
          excerpt,
          status: 'DRAFT',
          authorId: (session.user as any)?.id,
          // SEO fields
          metaTitle,
          metaDescription,
          canonicalUrl,
          noindex: noindex || false,
          ogTitle,
          ogDescription,
          ogImageUrl: ogImage,
          twitterCard: twitterCard || 'summary_large_image',
          twitterTitle,
          twitterDescription,
          twitterImage,
          focusKeyword,
          seoScore,
        },
      });

      return NextResponse.json({
        success: true,
        id: article.id,
        slug: article.slug,
      });
    }
  } catch (error) {
    console.error('Error saving draft:', error);
    return NextResponse.json(
      { error: 'Failed to save draft' },
      { status: 500 }
    );
  }
}
