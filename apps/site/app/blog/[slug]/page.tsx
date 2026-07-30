import { AppProvider } from '../../../components/contexts/appContext';
import dynamic from 'next/dynamic';
import ModernHeader from '../../../components/features/navigation/modern-header';
import { Footer } from '../../../components/shared/footer';
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Clock, Eye, Tag } from "lucide-react";
import { fetchPostBySlug, fetchPublication, getAllPostSlugs, UnifiedPublication } from '../../../lib/content-api';
import { markdownToHtml } from '@starter-kit/utils/renderer/markdownToHtml';

// Lazy load chatbot for better performance
const Chatbot = dynamic(() => import('../../../components/features/chatbot/Chatbot'), {
  loading: () => null,
});

// Enable dynamic rendering for new posts not generated at build time
export const dynamicParams = true;

// Revalidate every 60 seconds
export const revalidate = 60;

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate static params for all blog posts at build time
 * This ensures all existing posts have pre-rendered pages
 * Uses timeout-based fetching to prevent build hanging
 */
export async function generateStaticParams() {
  try {
    console.log('[Build] Fetching blog post slugs for static generation');
    const slugs = await getAllPostSlugs();
    
    if (slugs.length === 0) {
      console.warn('[Build] No blog post slugs fetched, static generation will be skipped');
      return [];
    }
    
    console.log(`[Build] Generating static pages for ${slugs.length} blog posts`);
    return slugs.map((slug: string) => ({ slug }));
  } catch (error) {
    console.error('[Build] Error fetching post slugs for static generation:', error);
    return [];
  }
}

// Default publication object for fallback - matches PublicationFragment
const defaultPublication: UnifiedPublication = {
  id: 'fallback-blog-post',
  title: 'John Schibelli',
  description: 'Senior Front-End Engineer | React · Next.js · TypeScript | Automation · AI Workflows · Accessibility',
  url: 'https://johnschibelli.dev',
  favicon: '',
  logo: '',
  isTeam: false,
  preferences: {
    logo: '',
    darkMode: {
      logo: '',
    },
    navbarItems: [],
    layout: {
      navbarStyle: 'default',
      footerStyle: 'default',
      showBranding: true,
    },
    members: [],
  },
  displayTitle: 'John Schibelli',
  descriptionSEO: 'Senior Front-End Engineer | React · Next.js · TypeScript | Automation · AI Workflows · Accessibility',
  posts: {
    totalDocuments: 0,
  },
  author: {
    name: 'John Schibelli',
    profilePicture: null,
  },
  followersCount: 0,
  ogMetaData: {
    image: null,
  },
};

export async function generateMetadata(props: BlogPostPageProps): Promise<Metadata> {
  const params = await props.params;
  
  // Skip API calls during build - metadata will be generated at runtime
  return {
    title: "Blog Post | John Schibelli",
    description: "Read the latest blog post",
  };
}

export default async function BlogPostPage(props: BlogPostPageProps) {
  const params = await props.params;
  
  console.log(`[Blog Post] Fetching post: ${params.slug}`);
  console.log(`[Blog Post] NEXT_PHASE: ${process.env.NEXT_PHASE}`);
  console.log(`[Blog Post] NODE_ENV: ${process.env.NODE_ENV}`);
  
  // Always fetch at runtime (both dev and production)
  // Only skip during build phase to prevent hanging
  let post = null;
  let currentPublication = defaultPublication;
  
  try {
    const [fetchedPost, fetchedPublication] = await Promise.all([
      fetchPostBySlug(params.slug),
      fetchPublication()
    ]);
    post = fetchedPost;
    currentPublication = fetchedPublication || defaultPublication;
    
    console.log(`[Blog Post] Post found: ${post ? 'YES' : 'NO'}`);
    if (post) {
      console.log(`[Blog Post] Post title: ${post.title}`);
    }
  } catch (error) {
    console.error(`[Blog Post] Error fetching post:`, error);
  }

  if (!post) {
    console.log(`[Blog Post] Post not found, returning 404 for slug: ${params.slug}`);
    notFound();
  }

  function stripHtmlTags(input: string) {
    return input.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }

  function deriveSubtitleFromHtml(html: string) {
    // Hashnode often renders article HTML with leading whitespace and/or non-<p> nodes
    // (e.g., figures/embeds). We want the first real paragraph that appears in the content.
    const match = html.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i);
    if (!match) return null;

    const fullParagraphHtml = match[0] ?? '';
    const rawInner = match[1] ?? '';
    if (/<img\b/i.test(rawInner)) return null;

    const text = stripHtmlTags(rawInner);
    if (!text) return null;

    // Heuristic: treat as subtitle if it reads like an excerpt (Hashnode-style)
    if (text.length < 10 || text.length > 320) return null;

    const htmlWithoutFirstParagraph = html.replace(fullParagraphHtml, '').trimStart();
    return { subtitle: text, html: htmlWithoutFirstParagraph };
  }

  function deriveSubtitleFromMarkdown(markdown: string) {
    // Find the first "paragraph-like" block that isn't a heading/list/code fence.
    const trimmed = markdown.trimStart();
    const blocks = trimmed.split(/\r?\n\r?\n/).map((b) => b.trim()).filter(Boolean);
    if (blocks.length < 2) return null;

    const isNotSubtitleBlock = (block: string) =>
      /^#{1,6}\s/.test(block) || // heading
      /^```/.test(block) || // code fence
      /^[-*+]\s/.test(block) || // list
      /^>\s/.test(block); // blockquote

    let subtitleBlockIdx = -1;
    for (let i = 0; i < Math.min(blocks.length, 6); i++) {
      const b = blocks[i];
      if (!b) continue;
      if (isNotSubtitleBlock(b)) continue;
      subtitleBlockIdx = i;
      break;
    }

    if (subtitleBlockIdx === -1) return null;

    const subtitleText = blocks[subtitleBlockIdx].replace(/\s+/g, ' ').trim();
    if (!subtitleText) return null;
    if (subtitleText.length < 10 || subtitleText.length > 320) return null;

    const restBlocks = blocks.filter((_b, idx) => idx !== subtitleBlockIdx);
    const rest = restBlocks.join('\n\n').trimStart();
    return { subtitle: subtitleText, markdown: rest };
  }

  const explicitBrief = (post as any).brief ? String((post as any).brief).trim() : '';
  let subtitle: string | null = explicitBrief || null;

  let contentHtml: string | null = post.content?.html ?? null;
  let contentMarkdown: string | null = post.content?.markdown ?? null;

  // If there's no explicit brief, derive one from the beginning of the article (and remove it from body).
  if (!subtitle) {
    if (contentHtml) {
      const derived = deriveSubtitleFromHtml(contentHtml);
      if (derived) {
        subtitle = derived.subtitle;
        contentHtml = derived.html;
      }
    } else if (contentMarkdown) {
      const derived = deriveSubtitleFromMarkdown(contentMarkdown);
      if (derived) {
        subtitle = derived.subtitle;
        contentMarkdown = derived.markdown;
      }
    }
  }

  const publishedAtMs = post.publishedAt ? Date.parse(post.publishedAt) : 0;
  const updatedAtIso = (post as any).updatedAt ? String((post as any).updatedAt) : '';
  const updatedAtMs = updatedAtIso ? Date.parse(updatedAtIso) : 0;
  const showUpdated = Boolean(updatedAtMs && updatedAtMs > publishedAtMs);
  const displayDateIso = showUpdated ? updatedAtIso : post.publishedAt;
  const displayDateLabel = showUpdated ? 'Updated' : 'Published';

  return (
    <AppProvider publication={currentPublication}>
      {/* Navigation */}
      <ModernHeader publication={currentPublication} />

      <article className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              {post.title}
            </h1>

            {subtitle ? (
              <p className="text-lg md:text-xl text-stone-700 dark:text-stone-300 leading-relaxed mb-6">
                {subtitle}
              </p>
            ) : null}

            <div className="flex flex-wrap items-center gap-6 text-sm text-stone-600 dark:text-stone-400 mb-6">
              {post.author?.name && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>{post.author.name}</span>
                </div>
              )}
              {displayDateIso ? (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="sr-only">{displayDateLabel}:</span>
                  <time dateTime={new Date(displayDateIso).toISOString()}>
                    {displayDateLabel} {format(new Date(displayDateIso), "MMMM d, yyyy")}
                  </time>
                </div>
              ) : null}
              {post.readTimeInMinutes && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{post.readTimeInMinutes} min read</span>
                </div>
              )}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: any) => (
                  <span
                    key={tag.slug}
                    className="inline-flex items-center px-3 py-1 bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-full text-sm"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Match Hashnode: cover image appears after the title/subtitle/meta */}
            {post.coverImage && (
              <div className="mt-8">
                <img
                  src={post.coverImage.url}
                  alt={post.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                  loading="lazy"
                />
              </div>
            )}
          </header>

          {/* Content */}
          <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-8">
            <div className="hashnode-content-style">
              {contentHtml ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: contentHtml,
                  }}
                />
              ) : contentMarkdown ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: markdownToHtml(contentMarkdown),
                  }}
                />
              ) : (
                <p className="text-stone-600 dark:text-stone-400 italic">
                  No content available for this article.
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-stone-200 dark:border-stone-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-stone-600 dark:text-stone-400">
                {post.author?.name && (
                  <p>Written by {post.author.name}</p>
                )}
              </div>

              <div className="text-sm text-stone-600 dark:text-stone-400">
                <p>
                  {displayDateLabel}: {format(new Date(displayDateIso || post.publishedAt), "MMM d, yyyy")}
                </p>
              </div>
            </div>
          </footer>
        </div>
      </article>

      <Chatbot />
      <Footer publication={currentPublication} />
    </AppProvider>
  );
}


