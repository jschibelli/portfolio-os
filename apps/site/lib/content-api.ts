/**
 * Unified Content API - Dashboard API with Hashnode fallback
 * Provides a consistent interface for fetching content from either Dashboard or Hashnode
 */

import { dashboardAPI, DashboardPost, DashboardPublication } from './dashboard-api';
import { fetchPosts as fetchHashnodePosts, fetchPostBySlug as fetchHashnodePost, fetchPublication as fetchHashnodePublication, HashnodePost, HashnodePublication } from './hashnode-api';

export interface UnifiedPost {
  id: string;
  title: string;
  brief: string;
  slug: string;
  publishedAt: string;
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
 * UnifiedPublication interface that is compatible with PublicationFragment
 * This ensures type safety when passing to components expecting PublicationFragment
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
  // Additional fields for extended functionality
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

/**
 * Transform Dashboard post to unified format
 */
function transformDashboardPost(post: DashboardPost): UnifiedPost {
  return {
    id: post.id,
    title: post.title,
    brief: post.excerpt,
    slug: post.slug,
    publishedAt: post.publishedAt,
    coverImage: post.cover ? { url: post.cover.url } : undefined,
    author: { name: post.author.name },
    tags: post.tags.map(tag => ({ name: tag.name, slug: tag.slug })),
    content: {
      markdown: post.content,
      html: undefined
    },
    readTimeInMinutes: post.readingMinutes,
    views: post.views,
    featured: post.featured
  };
}

/**
 * Transform Dashboard publication to unified format
 */
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
      totalDocuments: pub.stats.totalPosts
    },
    author: {
      name: 'John Schibelli',
      profilePicture: null
    },
    followersCount: 0,
    ogMetaData: {
      image: null
    }
  };
}

const DASHBOARD_HEALTH_CHECK_TIMEOUT_MS = 2000;
const DASHBOARD_HEALTH_CHECK_CACHE_MS = 5 * 60 * 1000;

let dashboardAvailabilityCache: { value: boolean; checkedAt: number } | null = null;
let dashboardAvailabilityCheckPromise: Promise<boolean> | null = null;

/**
 * Check if Dashboard API is available
 * Performs a health check to the Dashboard API
 * Result is cached to avoid repeated network calls during builds
 */
async function isDashboardAvailable(): Promise<boolean> {
  const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_API_URL || process.env.DASHBOARD_API_URL;
  if (!dashboardUrl) {
    return false;
  }

  const now = Date.now();
  if (dashboardAvailabilityCache && now - dashboardAvailabilityCache.checkedAt < DASHBOARD_HEALTH_CHECK_CACHE_MS) {
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

        return response.ok;
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

/**
 * Fetch posts with Dashboard API fallback to Hashnode
 */
export async function fetchPosts(first: number = 10, after?: string): Promise<UnifiedPost[]> {
  try {
    // Try Dashboard API first
    if (await isDashboardAvailable()) {
      const response = await dashboardAPI.getPosts({ limit: first });
      return response.posts.map(transformDashboardPost);
    }
  } catch (error) {
    console.warn('Dashboard API failed, falling back to Hashnode:', error);
  }

  // Fallback to Hashnode
  try {
    const hashnodePosts = await fetchHashnodePosts(first, after);
    return hashnodePosts.map(post => ({
      id: post.id,
      title: post.title,
      brief: post.brief,
      slug: post.slug,
      publishedAt: post.publishedAt,
      coverImage: post.coverImage,
      author: post.author,
      tags: post.tags,
      content: post.content,
      readTimeInMinutes: post.readTimeInMinutes,
      views: 0,
      featured: false
    }));
  } catch (error) {
    console.error('Both Dashboard and Hashnode APIs failed:', error);
    return [];
  }
}

/**
 * Fetch a single post by slug with fallback
 */
export async function fetchPostBySlug(slug: string): Promise<UnifiedPost | null> {
  console.log(`[Content API] Fetching post by slug: ${slug}`);
  
  try {
    // Try Dashboard API first
    if (await isDashboardAvailable()) {
      console.log('[Content API] Using Dashboard API for post');
      const post = await dashboardAPI.getPost(slug);
      return transformDashboardPost(post);
    }
  } catch (error) {
    console.warn(`[Content API] Dashboard API failed for post "${slug}", falling back to Hashnode:`, error);
  }

  // Fallback to Hashnode
  try {
    console.log('[Content API] Using Hashnode API for post');
    const hashnodePost = await fetchHashnodePost(slug);
    
    if (!hashnodePost) {
      console.warn(`[Content API] Post "${slug}" not found in Hashnode`);
      return null;
    }
    
    console.log(`[Content API] Successfully fetched post "${slug}" from Hashnode`);
    
    return {
      id: hashnodePost.id,
      title: hashnodePost.title,
      brief: hashnodePost.brief,
      slug: hashnodePost.slug,
      publishedAt: hashnodePost.publishedAt,
      coverImage: hashnodePost.coverImage,
      author: hashnodePost.author,
      tags: hashnodePost.tags,
      content: hashnodePost.content,
      readTimeInMinutes: hashnodePost.readTimeInMinutes,
      views: 0,
      featured: false
    };
  } catch (error) {
    console.error(`[Content API] Both Dashboard and Hashnode APIs failed for post "${slug}":`, error);
    return null;
  }
}

/**
 * Fetch publication information with fallback
 */
export async function fetchPublication(): Promise<UnifiedPublication | null> {
  try {
    // Try Dashboard API first
    if (await isDashboardAvailable()) {
      const pub = await dashboardAPI.getPublication();
      return transformDashboardPublication(pub);
    }
  } catch (error) {
    console.warn('Dashboard API failed for publication, falling back to Hashnode:', error);
  }

  // Fallback to Hashnode
  try {
    return await fetchHashnodePublication();
  } catch (error) {
    console.error('Both Dashboard and Hashnode APIs failed for publication:', error);
    return null;
  }
}

/**
 * Get all post slugs for static generation
 */
export async function getAllPostSlugs(): Promise<string[]> {
  // Add 15 second hard timeout for build
  let timeoutId: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<string[]>((resolve) => {
    timeoutId = setTimeout(() => {
      console.warn('getAllPostSlugs timed out after 15 seconds, returning empty array');
      resolve([]);
    }, 15000);
  });

  const fetchPromise = (async () => {
    try {
      // Try Dashboard API first
      if (await isDashboardAvailable()) {
        const response = await dashboardAPI.getPosts({ limit: 50 });
        return response.posts.map(post => post.slug);
      }
    } catch (error) {
      console.warn('Dashboard API failed for slugs, falling back to Hashnode:', error);
    }

    // Fallback to Hashnode
    try {
      const hashnodePosts = await fetchHashnodePosts(50);
      return hashnodePosts.map(post => post.slug);
    } catch (error) {
      console.error('Both Dashboard and Hashnode APIs failed for slugs:', error);
      return [];
    }
  })();

  const result = await Promise.race([fetchPromise, timeoutPromise]);
  clearTimeout(timeoutId!);
  return result;
}
