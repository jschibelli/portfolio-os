/**
 * Local Blog Loader
 * Reads markdown posts from apps/site/content/blog for build-time reliability
 * when Hashnode/Dashboard APIs are unavailable.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface LocalBlogPost {
  id: string;
  title: string;
  brief: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  coverImage?: { url: string };
  author?: { name: string };
  tags?: Array<{ name: string; slug: string }>;
  content?: {
    markdown?: string;
    html?: string;
  };
  readTimeInMinutes?: number;
  views?: number;
  featured?: boolean;
}

const contentDirectory = path.join(process.cwd(), 'content', 'blog');

type TagInput =
  | string
  | string[]
  | Array<{ name?: string; slug?: string }>
  | undefined;

function slugifyTag(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeTags(tags: TagInput): Array<{ name: string; slug: string }> {
  if (!tags) return [];

  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .map((name) => ({ name, slug: slugifyTag(name) }));
  }

  if (!Array.isArray(tags)) return [];

  return tags
    .map((tag) => {
      if (typeof tag === 'string') {
        const name = tag.trim();
        return name ? { name, slug: slugifyTag(name) } : null;
      }
      const name = (tag.name || tag.slug || '').trim();
      if (!name) return null;
      return { name, slug: slugifyTag(tag.slug || name) };
    })
    .filter((t): t is { name: string; slug: string } => Boolean(t));
}

function parseDate(value: unknown): string {
  if (!value) return new Date(0).toISOString();
  if (value instanceof Date) return value.toISOString();
  const parsed = new Date(String(value));
  if (Number.isNaN(parsed.getTime())) return new Date(0).toISOString();
  return parsed.toISOString();
}

function estimateReadTime(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function deriveBrief(data: Record<string, unknown>, content: string): string {
  const candidates = [
    data.seoDescription,
    data.subtitle,
    data.brief,
    data.excerpt,
    (data.metaTags as { description?: string } | undefined)?.description,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim();
    }
  }

  const firstParagraph = content
    .trim()
    .split(/\r?\n\r?\n/)
    .map((block) => block.trim())
    .find(
      (block) =>
        block &&
        !block.startsWith('#') &&
        !block.startsWith('```') &&
        !block.startsWith('---') &&
        !/^[-*+]\s/.test(block)
    );

  if (!firstParagraph) return '';
  return firstParagraph.replace(/\s+/g, ' ').trim().slice(0, 280);
}

function getCoverUrl(data: Record<string, unknown>): string | undefined {
  if (typeof data.cover === 'string' && data.cover) return data.cover;
  if (typeof data.coverImage === 'string' && data.coverImage) return data.coverImage;
  if (
    data.coverImage &&
    typeof data.coverImage === 'object' &&
    typeof (data.coverImage as { url?: string }).url === 'string'
  ) {
    return (data.coverImage as { url: string }).url;
  }
  if (typeof data.ogImage === 'string' && data.ogImage) return data.ogImage;
  return undefined;
}

function fileToPost(filePath: string): LocalBlogPost | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(raw);
    const frontmatter = data as Record<string, unknown>;

    const fileBase = path.basename(filePath, path.extname(filePath));
    const slug =
      (typeof frontmatter.slug === 'string' && frontmatter.slug.trim()) ||
      fileBase;

    const title =
      (typeof frontmatter.title === 'string' && frontmatter.title.trim()) ||
      slug;

    // Skip unpublished local drafts when explicitly marked
    if (frontmatter.isPublished === false) {
      return null;
    }

    const markdown = content.trim();
    const coverUrl = getCoverUrl(frontmatter);
    const publishedAt = parseDate(
      frontmatter.datePublished ||
        frontmatter.publishedAt ||
        frontmatter.date
    );

    return {
      id:
        (typeof frontmatter.cuid === 'string' && frontmatter.cuid) ||
        `local-${slug}`,
      title,
      brief: deriveBrief(frontmatter, markdown),
      slug,
      publishedAt,
      coverImage: coverUrl ? { url: coverUrl } : undefined,
      author: { name: 'John Schibelli' },
      tags: normalizeTags(frontmatter.tags as TagInput),
      content: {
        markdown,
        html: undefined,
      },
      readTimeInMinutes: estimateReadTime(markdown),
      views: 0,
      featured: Boolean(frontmatter.featured),
    };
  } catch (error) {
    console.warn(
      `[Local Blog] Failed to parse ${filePath}:`,
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

function listMarkdownFiles(): string[] {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  return fs
    .readdirSync(contentDirectory)
    .filter((name) => name.endsWith('.md') || name.endsWith('.mdx'))
    .map((name) => path.join(contentDirectory, name));
}

/**
 * Load all local blog posts, newest first.
 */
export function getLocalBlogPosts(limit?: number): LocalBlogPost[] {
  const posts = listMarkdownFiles()
    .map(fileToPost)
    .filter((post): post is LocalBlogPost => Boolean(post))
    .sort(
      (a, b) =>
        Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
    );

  if (typeof limit === 'number' && limit > 0) {
    return posts.slice(0, limit);
  }

  return posts;
}

/**
 * Load a single local post by slug.
 */
export function getLocalBlogPostBySlug(slug: string): LocalBlogPost | null {
  const posts = getLocalBlogPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

/**
 * All local post slugs for static generation.
 */
export function getLocalBlogSlugs(): string[] {
  return getLocalBlogPosts().map((post) => post.slug);
}
