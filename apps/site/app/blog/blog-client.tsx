'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Fuse from 'fuse.js';
import { AppProvider } from '../../components/contexts/appContext';
import Chatbot from '../../components/features/chatbot/Chatbot';
import ModernHero from '../../components/features/homepage/modern-hero';
import ModernHeader from '../../components/features/navigation/modern-header';
import { Footer } from '../../components/shared/footer';
import { Container } from '../../components/shared/container';
import { DEFAULT_COVER } from '../../utils/const';
import { BlueskySVG, FacebookSVG, GithubSVG, LinkedinSVG, RssSVG } from '../../components/icons';
import Link from 'next/link';
import { ArticleSVG } from '../../components/icons';
import FeaturedPost from '../../components/features/blog/featured-post';
import ModernPostCard from '../../components/features/blog/modern-post-card';
import NewsletterCTA from '../../components/features/newsletter/newsletter-cta';
import BlogSearch from '../../components/features/blog/search';
import BlogFilter from '../../components/features/blog/filter';
import BlogPagination from '../../components/features/blog/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { X, SlidersHorizontal } from 'lucide-react';

// Default publication object for fallback
const defaultPublication = {
  id: 'fallback-blog',
  title: 'John Schibelli',
  displayTitle: 'John Schibelli',
  descriptionSEO: 'Senior Front-End Developer with 15+ years of experience building scalable, high-performance web applications. Expert in React, Next.js, TypeScript, and modern development practices. Available for freelance projects and consulting.',
  url: 'https://schibelli.dev',
  posts: {
    totalDocuments: 0,
  },
  preferences: {
    logo: null,
  },
  author: {
    name: 'John Schibelli',
    profilePicture: null,
  },
  followersCount: 0,
  isTeam: false,
  favicon: null,
  ogMetaData: {
    image: null,
  },
};

interface BlogPost {
  id: string;
  title: string;
  brief: string;
  slug: string;
  publishedAt: string;
  coverImage?: { url: string };
  author?: { name: string };
  tags?: Array<{ name: string; slug: string }>;
}

interface BlogPageClientProps {
  initialPosts: BlogPost[];
}

export default function BlogPageClient({ initialPosts }: BlogPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [showFilters, setShowFilters] = useState(false);

  // Get filters from URL
  const currentSearch = useMemo(() => searchParams.get('search') || '', [searchParams]);
  const currentTags = useMemo(() => {
    const tagParam = searchParams.get('tags');
    return tagParam ? tagParam.split(',').filter(Boolean) : [];
  }, [searchParams]);
  const currentSort = useMemo(() => searchParams.get('sort') || 'date-desc', [searchParams]);
  const currentPage = useMemo(() => {
    const page = searchParams.get('page');
    return page ? parseInt(page, 10) : 1;
  }, [searchParams]);

  const POSTS_PER_PAGE = 9;

  // Extract all available tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    initialPosts.forEach((post) => {
      post.tags?.forEach((tag) => tagSet.add(tag.name));
    });
    return Array.from(tagSet).sort();
  }, [initialPosts]);

  // Configure Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(initialPosts, {
      keys: ['title', 'brief', 'tags.name', 'author.name'],
      threshold: 0.3,
      includeScore: true,
    });
  }, [initialPosts]);

  // Filter and search posts
  const filteredPosts = useMemo(() => {
    let posts = initialPosts;

    // Apply search
    if (currentSearch) {
      const results = fuse.search(currentSearch);
      posts = results.map((result) => result.item);
    }

    // Apply tag filter
    if (currentTags.length > 0) {
      posts = posts.filter((post) =>
        currentTags.some((tag) =>
          post.tags?.some((postTag) => postTag.name === tag)
        )
      );
    }

    // Apply sorting
    posts = [...posts].sort((a, b) => {
      switch (currentSort) {
        case 'date-desc':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'date-asc':
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return posts;
  }, [initialPosts, currentSearch, currentTags, currentSort, fuse]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  // Update URL with filters
  const updateFilters = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      // Reset to page 1 when filters change
      if (!updates.page) {
        params.delete('page');
      }
      router.replace(`/blog?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Handler functions
  const handleSearchChange = useCallback(
    (value: string) => {
      updateFilters({ search: value });
      
      // Track search analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'search', {
          search_term: value,
          page_location: '/blog',
        });
      }
    },
    [updateFilters]
  );

  const handleSearchClear = useCallback(() => {
    updateFilters({ search: null });
  }, [updateFilters]);

  const handleTagToggle = useCallback(
    (tag: string) => {
      const newTags = currentTags.includes(tag)
        ? currentTags.filter((t) => t !== tag)
        : [...currentTags, tag];
      updateFilters({ tags: newTags.length ? newTags.join(',') : null });
    },
    [currentTags, updateFilters]
  );

  const handleClearAllFilters = useCallback(() => {
    router.replace('/blog');
  }, [router]);

  const handleSortChange = useCallback(
    (value: string) => {
      updateFilters({ sort: value });
    },
    [updateFilters]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateFilters({ page: page.toString() });
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [updateFilters]
  );

  const hasActiveFilters = currentSearch || currentTags.length > 0 || currentSort !== 'date-desc';

  return (
    <AppProvider publication={defaultPublication as any}>
      {/* Navigation */}
      <ModernHeader publication={defaultPublication} />

      {/* Modern Hero Section */}
      {initialPosts.length > 0 && (
        <div id="hero-section" data-animate-section className="transition-all duration-1000 ease-out">
          <ModernHero
            title="The Developer's Lens"
            subtitle="Technology & Development"
            description="Unfiltered perspectives on code, creativity, and the constant evolution of technology."
            imageUrl="/assets/hero/hero-image.webp"
          />
        </div>
      )}

      {/* Social Media Icons */}
      <div className="bg-white py-8 dark:bg-stone-950">
        <Container className="px-5">
          <div className="flex justify-center">
            <div className="flex items-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Find us on Facebook, external website, opens in new tab"
                className="flex items-center justify-center rounded-full border border-stone-200 p-3 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
              >
                <FacebookSVG className="h-5 w-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Find us on Github, external website, opens in new tab"
                className="flex items-center justify-center rounded-full border border-stone-200 p-3 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
              >
                <GithubSVG className="h-5 w-5 stroke-current" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Find us on Linkedin, external website, opens in new tab"
                className="flex items-center justify-center rounded-full border border-stone-200 p-3 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
              >
                <LinkedinSVG className="h-5 w-5 stroke-current" />
              </a>
              <a
                href="https://bsky.app"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Find us on Bluesky, external website, opens in new tab"
                className="flex items-center justify-center rounded-full border border-stone-200 p-3 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
              >
                <BlueskySVG className="h-5 w-5 stroke-current" />
              </a>
              <Link
                prefetch={false}
                href="/rss.xml"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open blog XML Feed, opens in new tab"
                className="flex items-center justify-center rounded-full border border-stone-200 p-3 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
              >
                <RssSVG className="h-5 w-5 stroke-current" />
              </Link>
            </div>
          </div>
        </Container>
      </div>

      <Container className="flex flex-col items-stretch gap-10 px-5 pb-10">
        {/* Empty State */}
        {initialPosts.length === 0 && (
          <div id="empty-state-section" data-animate-section className="duration-800 grid grid-cols-1 py-20 transition-all ease-out lg:grid-cols-3">
            <div className="col-span-1 flex flex-col items-center gap-5 text-center text-stone-700 lg:col-start-2 dark:text-stone-400">
              <div className="animate-fade-in-up w-20">
                <ArticleSVG className="stroke-current" />
              </div>
              <p className="animate-fade-in-up animation-delay-200 text-xl font-semibold">
                Hang tight! We're drafting the first article.
              </p>
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        {initialPosts.length > 0 && (
          <div className="space-y-6 pt-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1 max-w-2xl">
                <BlogSearch
                  value={currentSearch}
                  onChange={handleSearchChange}
                  onClear={handleSearchClear}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {(currentTags.length > 0 || currentSort !== 'date-desc') && (
                    <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                      {currentTags.length + (currentSort !== 'date-desc' ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
                <Select value={currentSort} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[180px] h-10">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Newest First</SelectItem>
                    <SelectItem value="date-asc">Oldest First</SelectItem>
                    <SelectItem value="title-asc">Title A-Z</SelectItem>
                    <SelectItem value="title-desc">Title Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="animate-fade-in-up rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-700 dark:bg-stone-900">
                <BlogFilter
                  availableTags={allTags}
                  selectedTags={currentTags}
                  onTagToggle={handleTagToggle}
                  onClearAll={() => updateFilters({ tags: null })}
                />
              </div>
            )}

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-stone-600 dark:text-stone-400">
                  Active filters:
                </span>
                {currentSearch && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Search: {currentSearch}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleSearchClear()}
                    />
                  </Badge>
                )}
                {currentTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleTagToggle(tag)}
                    />
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAllFilters}
                  className="h-7 px-2 text-xs"
                >
                  Clear All
                </Button>
              </div>
            )}

            {/* Results Count */}
            <div className="text-sm text-stone-600 dark:text-stone-400">
              Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
              {initialPosts.length !== filteredPosts.length &&
                ` of ${initialPosts.length} total`}
            </div>
          </div>
        )}

        {/* No Results */}
        {initialPosts.length > 0 && filteredPosts.length === 0 && (
          <div className="py-20 text-center">
            <ArticleSVG className="mx-auto mb-4 w-20 stroke-current text-stone-400" />
            <p className="text-xl font-semibold text-stone-700 dark:text-stone-400">
              No posts found matching your filters
            </p>
            <Button
              variant="outline"
              onClick={handleClearAllFilters}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Posts Grid */}
        {paginatedPosts.length > 0 && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedPosts.map((post, index) => (
                <div
                  key={post.id}
                  className={`animate-fade-in-up transition-all duration-300 hover:scale-[1.02] ${
                    index === 0
                      ? 'animation-delay-200'
                      : index === 1
                        ? 'animation-delay-300'
                        : 'animation-delay-400'
                  }`}
                >
                  <ModernPostCard
                    title={post.title}
                    excerpt={post.brief}
                    coverImage={post.coverImage?.url || DEFAULT_COVER}
                    date={post.publishedAt}
                    slug={post.slug}
                    readTime="5 min read"
                    tags={post.tags?.map((t) => t.name) || []}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <BlogPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={POSTS_PER_PAGE}
              totalItems={filteredPosts.length}
            />
          </div>
        )}

        {/* Newsletter CTA Section */}
        {initialPosts.length > 0 && (
          <div id="newsletter-section" data-animate-section className="duration-1100 py-8 transition-all ease-out">
            <NewsletterCTA
              title="Stay updated with our newsletter"
              showNewsletterForm={true}
              className="py-16"
            />
          </div>
        )}
      </Container>
      <Chatbot />
      <Footer publication={defaultPublication} />
    </AppProvider>
  );
}
