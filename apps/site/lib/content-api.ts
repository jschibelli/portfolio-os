/**
 * Unified Content API — local markdown is the sole blog source.
 * Optional Dashboard API when USE_DASHBOARD_FOR_BLOG=true.
 */

import { dashboardAPI, DashboardPost, DashboardPublication } from './dashboard-api';
import {
  getLocalBlogPostBySlug,
  getLocalBlogPosts,
  getLocalBlogSlugs,
} from './local-blog-loader';

export interface UnifiedPost {
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

/**
 * UnifiedPublication interface compatible with PublicationFragment consumers.
 */
export interface UnifiedPublication {
  id: string;
  title: string;
  description: string;
  url: string;
  favicon: string;
  logo: string;
  isTeam: boolean;
  preferences: {
    logo: string;
    darkMode: {
      logo: string;
    };
    navbarItems: any[];
    layout: {
      navbarStyle: string;
      footerStyle: string;
      showBranding: boolean;
    };
    members: any[];
  };
  displayTitle?: string | null;
  descriptionSEO?: string;
  posts?: {
    totalDocuments: number;
  };
  author?: {
    name: string;
    profilePicture: string | null;
  };
  followersCount?: number;
  ogMetaData?: {
    image: string | null;
  };
}

function transformDashboardPost(post: DashboardPost): UnifiedPost {
  return {
    id: post.id,
    title: post.title,
    brief: post.excerpt,
    slug: post.slug,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    coverImage: post.cover ? { url: post.cover.url } : undefined,
    author: { name: post.author.name },
    tags: post.tags.map((tag) => ({ name: tag.name, slug: tag.slug })),
    content: {
      markdown: post.content,
      html: undefined,
    },
    readTimeInMinutes: post.readingMinutes,
    views: post.views,
    featured: post.featured,
  };
}

function transformDashboardPublication(pub: DashboardPublication): UnifiedPublication {
  return {
    id: 'dashboard-publication',
    title: pub.name,
    description: pub.description,
    url: pub.url,
    favicon: pub.favicon || '',
    logo: pub.logo || '',
    isTeam: false,
    preferences: {
      logo: pub.logo || '',
      darkMode: {
        logo: pub.logo || '',
      },
      navbarItems: [],
      layout: {
        navbarStyle: 'default',
        footerStyle: 'default',
        showBranding: true,
      },
      members: [],
    },
    displayTitle: pub.name,
    descriptionSEO: pub.description,
    posts: {
      totalDocuments: pub.stats.totalPosts,
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
}

function localPublication(): UnifiedPublication {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://johnschibelli.dev';
  return {
    id: 'local-publication',
    title: 'John Schibelli',
    description: 'Engineering notes, case studies, and product development.',
    url: siteUrl,
    favicon: '',
    logo: '',
    isTeam: false,
    preferences: {
      logo: '',
      darkMode: { logo: '' },
      navbarItems: [],
      layout: {
        navbarStyle: 'default',
        footerStyle: 'default',
        showBranding: true,
      },
      members: [],
    },
    displayTitle: 'John Schibelli',
    descriptionSEO: 'Engineering notes, case studies, and product development.',
    posts: {
      totalDocuments: getLocalBlogSlugs().length,
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
}

const DASHBOARD_HEALTH_CHECK_TIMEOUT_MS = 2000;
const DASHBOARD_HEALTH_CHECK_CACHE_MS = 30 * 1000;

let dashboardAvailabilityCache: { value: boolean; checkedAt: number } | null = null;
let dashboardAvailabilityCheckPromise: Promise<boolean> | null = null;

async function isDashboardAvailable(): Promise<boolean> {
  const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_API_URL || process.env.DASHBOARD_API_URL;
  if (!dashboardUrl) {
    return false;
  }

  const now = Date.now();
  if (
    dashboardAvailabilityCache &&
    now - dashboardAvailabilityCache.checkedAt < DASHBOARD_HEALTH_CHECK_CACHE_MS
  ) {
    return dashboardAvailabilityCache.value;
  }

  if (!dashboardAvailabilityCheckPromise) {
    dashboardAvailabilityCheckPromise = (async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), DASHBOARD_HEALTH_CHECK_TIMEOUT_MS);

      try {
        const response = await fetch(`${dashboardUrl}/api/health`, {
          signal: controller.signal,
          method: 'GET',
          cache: 'no-store',
        });
        return response.ok && response.status === 200;
      } catch {
        return false;
      } finally {
        clearTimeout(timeoutId);
      }
    })();
  }

  const available = await dashboardAvailabilityCheckPromise;
  dashboardAvailabilityCache = { value: available, checkedAt: Date.now() };
  dashboardAvailabilityCheckPromise = null;
  return available;
}

async function tryDashboardPosts(first: number): Promise<UnifiedPost[] | null> {
  if (process.env.USE_DASHBOARD_FOR_BLOG !== 'true') return null;
  if (!(await isDashboardAvailable())) return null;

  try {
    const response = await dashboardAPI.getPosts({ limit: first });
    if (response?.posts?.length) {
      return response.posts.map(transformDashboardPost);
    }
  } catch (error) {
    console.warn(
      '[Content API] Dashboard posts failed:',
      error instanceof Error ? error.message : 'Unknown error',
    );
    dashboardAvailabilityCache = { value: false, checkedAt: Date.now() };
  }
  return null;
}

/**
 * Fetch posts from local markdown (default) or Dashboard when enabled.
 */
export async function fetchPosts(first: number = 10, _after?: string): Promise<UnifiedPost[]> {
  const fromDashboard = await tryDashboardPosts(first);
  if (fromDashboard) return fromDashboard;
  return getLocalBlogPosts(first);
}

/**
 * Fetch a single post by slug from local markdown (or Dashboard when enabled).
 */
export async function fetchPostBySlug(slug: string): Promise<UnifiedPost | null> {
  if (process.env.USE_DASHBOARD_FOR_BLOG === 'true' && (await isDashboardAvailable())) {
    try {
      const post = await dashboardAPI.getPost(slug);
      if (post?.slug) return transformDashboardPost(post);
    } catch {
      dashboardAvailabilityCache = { value: false, checkedAt: Date.now() };
    }
  }
  return getLocalBlogPostBySlug(slug);
}

/**
 * Publication metadata for layout/RSS consumers.
 */
export async function fetchPublication(): Promise<UnifiedPublication | null> {
  if (process.env.USE_DASHBOARD_FOR_BLOG === 'true' && (await isDashboardAvailable())) {
    try {
      const pub = await dashboardAPI.getPublication();
      if (pub?.name) return transformDashboardPublication(pub);
    } catch {
      dashboardAvailabilityCache = { value: false, checkedAt: Date.now() };
    }
  }
  return localPublication();
}

/**
 * All post slugs for static generation.
 */
export async function getAllPostSlugs(): Promise<string[]> {
  if (process.env.USE_DASHBOARD_FOR_BLOG === 'true' && (await isDashboardAvailable())) {
    try {
      const response = await dashboardAPI.getPosts({ limit: 100 });
      if (response?.posts?.length) {
        return response.posts.map((post) => post.slug);
      }
    } catch {
      dashboardAvailabilityCache = { value: false, checkedAt: Date.now() };
    }
  }
  return getLocalBlogSlugs();
}
