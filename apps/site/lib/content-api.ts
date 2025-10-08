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

export interface UnifiedPublication {
  id: string;
  title: string;
  displayTitle: string | null;
  descriptionSEO: string;
  url: string;
  posts: {
    totalDocuments: number;
  };
  preferences: {
    logo: string | null;
  };
  author: {
    name: string;
    profilePicture: string | null;
  };
  followersCount: number;
  isTeam: boolean;
  favicon: string | null;
  ogMetaData: {
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
    displayTitle: pub.name,
    descriptionSEO: pub.description,
    url: pub.url,
    posts: {
      totalDocuments: pub.stats.totalPosts
    },
    preferences: {
      logo: pub.logo
    },
    author: {
      name: 'John Schibelli',
      profilePicture: null
    },
    followersCount: 0,
    isTeam: false,
    favicon: pub.favicon,
    ogMetaData: {
      image: null
    }
  };
}

/**
 * Check if Dashboard API is available
 * Always returns false during build to use Hashnode directly
 */
async function isDashboardAvailable(): Promise<boolean> {
  // Skip Dashboard API check during build - use Hashnode directly
  if (!process.env.DASHBOARD_API_URL || process.env.NODE_ENV === 'production') {
    return false;
  }

  // Only check Dashboard API in development
  try {
    // Simple check with no timeout to avoid hanging
    const response = await Promise.race([
      dashboardAPI.getPublication(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Dashboard API timeout')), 1000)
      )
    ]);
    return true;
  } catch (error) {
    // Dashboard API not available, will use Hashnode
    return false;
  }
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
  try {
    // Try Dashboard API first
    if (await isDashboardAvailable()) {
      const response = await dashboardAPI.getPosts({ limit: 100 });
      return response.posts.map(post => post.slug);
    }
  } catch (error) {
    console.warn('Dashboard API failed for slugs, falling back to Hashnode:', error);
  }

  // Fallback to Hashnode
  try {
    const hashnodePosts = await fetchHashnodePosts(100);
    return hashnodePosts.map(post => post.slug);
  } catch (error) {
    console.error('Both Dashboard and Hashnode APIs failed for slugs:', error);
    return [];
  }
}
