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
// Reduced cache time from 5 minutes to 30 seconds to fail fast when Dashboard API is unavailable
const DASHBOARD_HEALTH_CHECK_CACHE_MS = 30 * 1000;

let dashboardAvailabilityCache: { value: boolean; checkedAt: number } | null = null;
let dashboardAvailabilityCheckPromise: Promise<boolean> | null = null;

/**
 * Check if Dashboard API is available
 * Performs a health check to the Dashboard API
 * Result is cached for 30 seconds to avoid repeated network calls while still failing fast
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

        // Only consider available if health check returns 200 OK
        const isAvailable = response.ok && response.status === 200;
        
        if (!isAvailable) {
          console.warn(`[Content API] Dashboard API health check failed with status ${response.status}`);
        }
        
        return isAvailable;
      } catch (error) {
        console.warn('[Content API] Dashboard API health check failed:', error instanceof Error ? error.message : 'Unknown error');
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
 * Fetch posts - Uses Hashnode API directly for blog
 * Dashboard API is disabled for blog posts to avoid data inconsistencies
 * 
 * To enable Dashboard API, set USE_DASHBOARD_FOR_BLOG=true in environment variables
 */
export async function fetchPosts(first: number = 10, after?: string): Promise<UnifiedPost[]> {
  // By default, use Hashnode for blog posts (more reliable)
  // Only use Dashboard if explicitly enabled
  const useDashboard = process.env.USE_DASHBOARD_FOR_BLOG === 'true';
  
  if (useDashboard) {
    // Check if Dashboard API is available
    const dashboardAvailable = await isDashboardAvailable();
    
    if (dashboardAvailable) {
      try {
        const response = await dashboardAPI.getPosts({ limit: first });
        // Verify we got valid posts data
        if (response && response.posts && Array.isArray(response.posts) && response.posts.length > 0) {
          console.log(`[Content API] Using Dashboard API for posts (${response.posts.length} posts)`);
          return response.posts.map(transformDashboardPost);
        } else {
          console.warn('[Content API] Dashboard API returned empty or invalid response, falling back to Hashnode');
          // Invalidate cache to force recheck next time
          dashboardAvailabilityCache = { value: false, checkedAt: Date.now() };
        }
      } catch (error) {
        console.warn('[Content API] Dashboard API failed, falling back to Hashnode:', error instanceof Error ? error.message : 'Unknown error');
        // Invalidate cache on error to force recheck next time
        dashboardAvailabilityCache = { value: false, checkedAt: Date.now() };
      }
    }
  }

  // Use Hashnode API (default and fallback)
  try {
    console.log('[Content API] Using Hashnode API for posts');
    const hashnodePosts = await fetchHashnodePosts(first, after);
    console.log(`[Content API] Fetched ${hashnodePosts.length} posts from Hashnode`);
    
    if (hashnodePosts.length === 0) {
      console.warn('[Content API] Hashnode API returned no posts. Check publication host configuration.');
      console.warn(
        '[Content API] Current host:',
        process.env.HASHNODE_PUBLICATION_HOST ||
          process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST ||
          '(not set)'
      );
    }

    // Defensive: ensure newest posts appear first regardless of API ordering
    const sortedPosts = [...hashnodePosts].sort((a, b) => {
      const aTime = a.publishedAt ? Date.parse(a.publishedAt) : 0;
      const bTime = b.publishedAt ? Date.parse(b.publishedAt) : 0;
      return bTime - aTime;
    });

    return sortedPosts.map(post => ({
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
    console.error('[Content API] Hashnode API failed:', error instanceof Error ? error.message : 'Unknown error');
    console.error('[Content API] Error details:', error);
    return [];
  }
}

/**
 * Fetch a single post by slug - Uses Hashnode API directly for blog
 * Dashboard API is disabled for blog posts to avoid data inconsistencies
 */
export async function fetchPostBySlug(slug: string): Promise<UnifiedPost | null> {
  console.log(`[Content API] Fetching post by slug: ${slug}`);
  
  // By default, use Hashnode for blog posts
  const useDashboard = process.env.USE_DASHBOARD_FOR_BLOG === 'true';
  
  if (useDashboard) {
    // Check if Dashboard API is available
    const dashboardAvailable = await isDashboardAvailable();
    
    if (dashboardAvailable) {
      try {
        console.log('[Content API] Using Dashboard API for post');
        const post = await dashboardAPI.getPost(slug);
        // Verify we got valid post data
        if (post && post.slug) {
          return transformDashboardPost(post);
        } else {
          console.warn(`[Content API] Dashboard API returned invalid post data for "${slug}", falling back to Hashnode`);
        }
      } catch (error) {
        console.warn(`[Content API] Dashboard API failed for post "${slug}", falling back to Hashnode:`, error instanceof Error ? error.message : 'Unknown error');
        // Invalidate cache on error to force recheck next time
        dashboardAvailabilityCache = { value: false, checkedAt: Date.now() };
      }
    }
  }

  // Use Hashnode API (default and fallback)
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
    console.error(`[Content API] Hashnode API failed for post "${slug}":`, error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

/**
 * Fetch publication information - Uses Hashnode API directly for blog
 * Dashboard API is disabled for blog to avoid data inconsistencies
 */
export async function fetchPublication(): Promise<UnifiedPublication | null> {
  // By default, use Hashnode for blog
  const useDashboard = process.env.USE_DASHBOARD_FOR_BLOG === 'true';
  
  if (useDashboard) {
    // Check if Dashboard API is available
    const dashboardAvailable = await isDashboardAvailable();
    
    if (dashboardAvailable) {
      try {
        const pub = await dashboardAPI.getPublication();
        // Verify we got valid publication data
        if (pub && pub.name) {
          return transformDashboardPublication(pub);
        } else {
          console.warn('[Content API] Dashboard API returned invalid publication data, falling back to Hashnode');
        }
      } catch (error) {
        console.warn('[Content API] Dashboard API failed for publication, falling back to Hashnode:', error instanceof Error ? error.message : 'Unknown error');
        // Invalidate cache on error to force recheck next time
        dashboardAvailabilityCache = { value: false, checkedAt: Date.now() };
      }
    }
  }

  // Use Hashnode API (default and fallback)
  try {
    const hashnodePub = await fetchHashnodePublication();
    if (!hashnodePub) {
      return null;
    }
    
    // Transform HashnodePublication to UnifiedPublication
    return {
      id: hashnodePub.id,
      title: hashnodePub.title,
      description: hashnodePub.descriptionSEO || '',
      url: hashnodePub.url,
      favicon: hashnodePub.favicon || '',
      logo: hashnodePub.preferences?.logo || '',
      isTeam: hashnodePub.isTeam,
      preferences: {
        logo: hashnodePub.preferences?.logo || '',
        darkMode: {
          logo: hashnodePub.preferences?.logo || '',
        },
        navbarItems: [],
        layout: {
          navbarStyle: 'default',
          footerStyle: 'default',
          showBranding: true,
        },
        members: [],
      },
      displayTitle: hashnodePub.displayTitle,
      descriptionSEO: hashnodePub.descriptionSEO,
      posts: hashnodePub.posts,
      author: hashnodePub.author,
      followersCount: hashnodePub.followersCount,
      ogMetaData: hashnodePub.ogMetaData,
    };
  } catch (error) {
    console.error('[Content API] Hashnode API failed for publication:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

/**
 * Get all post slugs for static generation
 * Improved error handling to ensure Hashnode fallback works when Dashboard API is unavailable
 */
export async function getAllPostSlugs(): Promise<string[]> {
  // Add 15 second hard timeout for build
  let timeoutId: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<string[]>((resolve) => {
    timeoutId = setTimeout(() => {
      console.warn('[Content API] getAllPostSlugs timed out after 15 seconds, returning empty array');
      resolve([]);
    }, 15000);
  });

  const fetchPromise = (async () => {
    // Check if Dashboard API is available first
    const dashboardAvailable = await isDashboardAvailable();
    
    if (dashboardAvailable) {
      try {
        const response = await dashboardAPI.getPosts({ limit: 50 });
        // Verify we got valid posts data
        if (response && response.posts && Array.isArray(response.posts)) {
          return response.posts.map(post => post.slug);
        } else {
          console.warn('[Content API] Dashboard API returned invalid response for slugs, falling back to Hashnode');
        }
      } catch (error) {
        console.warn('[Content API] Dashboard API failed for slugs, falling back to Hashnode:', error instanceof Error ? error.message : 'Unknown error');
        // Invalidate cache on error to force recheck next time
        dashboardAvailabilityCache = { value: false, checkedAt: Date.now() };
      }
    }

    // Fallback to Hashnode (always try if Dashboard is unavailable or failed)
    try {
      const hashnodePosts = await fetchHashnodePosts(50);
      return hashnodePosts.map(post => post.slug);
    } catch (error) {
      console.error('[Content API] Both Dashboard and Hashnode APIs failed for slugs:', error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  })();

  const result = await Promise.race([fetchPromise, timeoutPromise]);
  clearTimeout(timeoutId!);
  return result;
}
