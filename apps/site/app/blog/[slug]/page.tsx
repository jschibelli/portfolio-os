import { markdownToHtml } from '@starter-kit/utils/renderer/markdownToHtml';
import { format } from 'date-fns';
import { Calendar, Clock, Tag, User } from 'lucide-react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AppProvider } from '../../../components/contexts/appContext';
import ModernHeader from '../../../components/features/navigation/modern-header';
import { Footer } from '../../../components/shared/footer';
import {
	UnifiedPublication,
	fetchPostBySlug,
	fetchPublication,
	getAllPostSlugs,
} from '../../../lib/content-api';
import { typeRole } from '../../../lib/typography';
import { getMetadataBase, getSiteUrl } from '../../../config/site';

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
	description: 'Senior Software Engineer',
	url: getSiteUrl('/'),
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
	descriptionSEO: 'Senior Software Engineer',
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
		title: 'Blog Post | John Schibelli',
		description: 'Read the latest blog post',
		metadataBase: getMetadataBase(),
		alternates: {
			canonical: getSiteUrl(`/blog/${params.slug}`),
		},
		openGraph: {
			url: getSiteUrl(`/blog/${params.slug}`),
		},
	};
}

export default async function BlogPostPage(props: BlogPostPageProps) {
	const params = await props.params;

	// Production builds prefer local markdown via content-api (NEXT_PHASE)
	let post = null;
	let currentPublication = defaultPublication;

	try {
		const [fetchedPost, fetchedPublication] = await Promise.all([
			fetchPostBySlug(params.slug),
			fetchPublication(),
		]);
		post = fetchedPost;
		currentPublication = fetchedPublication || defaultPublication;
	} catch (error) {
		console.error(
			`[Blog Post] Error fetching "${params.slug}":`,
			error instanceof Error ? error.message : error,
		);
	}

	if (!post) {
		notFound();
	}

	function stripHtmlTags(input: string) {
		return input
			.replace(/<[^>]*>/g, '')
			.replace(/\s+/g, ' ')
			.trim();
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
		const blocks = trimmed
			.split(/\r?\n\r?\n/)
			.map((b) => b.trim())
			.filter(Boolean);
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
				<div className="mx-auto max-w-4xl">
					{/* Header */}
					<header className="mb-8">
						<h1 className={`mb-4 text-stone-900 dark:text-stone-100 ${typeRole.articleH1}`}>
							{post.title}
						</h1>

						{subtitle ? (
							<p className={`mb-6 text-stone-700 dark:text-stone-300 ${typeRole.heroSupport}`}>
								{subtitle}
							</p>
						) : null}

						<div
							className={`mb-6 flex flex-wrap items-center gap-6 text-stone-600 dark:text-stone-400 ${typeRole.metadata}`}
						>
							{post.author?.name && (
								<div className="flex items-center">
									<User className="mr-2 h-4 w-4" />
									<span>{post.author.name}</span>
								</div>
							)}
							{displayDateIso ? (
								<div className="flex items-center">
									<Calendar className="mr-2 h-4 w-4" />
									<span className="sr-only">{displayDateLabel}:</span>
									<time dateTime={new Date(displayDateIso).toISOString()}>
										{displayDateLabel} {format(new Date(displayDateIso), 'MMMM d, yyyy')}
									</time>
								</div>
							) : null}
							{post.readTimeInMinutes && (
								<div className="flex items-center">
									<Clock className="mr-2 h-4 w-4" />
									<span>{post.readTimeInMinutes} min read</span>
								</div>
							)}
						</div>

						{post.tags && post.tags.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{post.tags.map((tag: any) => (
									<span
										key={tag.slug}
										className={`inline-flex items-center rounded-full bg-stone-100 px-3 py-1 text-stone-700 dark:bg-stone-700 dark:text-stone-300 ${typeRole.small}`}
									>
										<Tag className="mr-1 h-3 w-3" />
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
									className="h-64 w-full rounded-lg object-cover shadow-lg md:h-96"
									loading="lazy"
								/>
							</div>
						)}
					</header>

					{/* Content */}
					<div className="rounded-lg border border-stone-200 bg-white p-8 shadow-sm dark:border-stone-700 dark:bg-stone-800">
						<div className={`hashnode-content-style ${typeRole.articleBody}`}>
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
								<p className="italic text-stone-600 dark:text-stone-400">
									No content available for this article.
								</p>
							)}
						</div>
					</div>

					{/* Footer */}
					<footer className="mt-12 border-t border-stone-200 pt-8 dark:border-stone-700">
						<div className="flex items-center justify-between">
							<div className={`text-stone-600 dark:text-stone-400 ${typeRole.metadata}`}>
								{post.author?.name && <p>Written by {post.author.name}</p>}
							</div>

							<div className={`text-stone-600 dark:text-stone-400 ${typeRole.metadata}`}>
								<p>
									{displayDateLabel}:{' '}
									{format(new Date(displayDateIso || post.publishedAt), 'MMM d, yyyy')}
								</p>
							</div>
						</div>
					</footer>
				</div>
			</article>

			<Footer publication={currentPublication} />
		</AppProvider>
	);
}
