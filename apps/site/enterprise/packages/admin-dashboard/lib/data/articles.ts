import { prisma } from "../prisma";

export async function getArticles(opts: { limit?: number; status?: string } = {}) {
  try {
    const where = opts.status ? { status: opts.status } : {};
    
    return await prisma.article.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      take: opts.limit ?? 50,
      select: {
        id: true,
        title: true,
        subtitle: true,
        slug: true,
        status: true,
        visibility: true,
        excerpt: true,
        publishedAt: true,
        scheduledAt: true,
        views: true,
        updatedAt: true,
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    throw error;
  }
}

export async function getArticleById(id: string) {
  try {
    return await prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        series: true,
        cover: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch article:", error);
    throw error;
  }
}

export async function createArticle(data: {
  title: string;
  subtitle?: string;
  slug: string;
  excerpt?: string;
  status: string;
  visibility: string;
  contentJson?: any;
  contentMdx?: string;
  authorId: string;
}) {
  try {
    return await prisma.article.create({
      data: {
        ...data,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      },
    });
  } catch (error) {
    console.error("Failed to create article:", error);
    throw error;
  }
}

export async function updateArticle(id: string, data: {
  title?: string;
  subtitle?: string;
  slug?: string;
  excerpt?: string;
  status?: string;
  visibility?: string;
  contentJson?: any;
  contentMdx?: string;
  publishedAt?: Date;
  scheduledAt?: Date;
}) {
  try {
    return await prisma.article.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Failed to update article:", error);
    throw error;
  }
}

export async function deleteArticle(id: string) {
  try {
    return await prisma.article.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Failed to delete article:", error);
    throw error;
  }
}

export async function getPublishedArticles(opts: { limit?: number; featured?: boolean } = {}) {
  try {
    const where: any = {
      status: "PUBLISHED",
      visibility: "PUBLIC",
    };

    if (opts.featured) {
      where.featured = true;
    }

    return await prisma.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: opts.limit ?? 10,
      select: {
        id: true,
        title: true,
        subtitle: true,
        slug: true,
        excerpt: true,
        publishedAt: true,
        readingMinutes: true,
        views: true,
        author: {
          select: {
            name: true,
          },
        },
        cover: {
          select: {
            url: true,
            alt: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch published articles:", error);
    throw error;
  }
}


