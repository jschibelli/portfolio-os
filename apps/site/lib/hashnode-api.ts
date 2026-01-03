/**
 * Hashnode API utility functions with improved caching and error handling
 */

export interface HashnodePost {
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
}

export interface HashnodePublication {
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

const GQL_ENDPOINT = 'https://gql.hashnode.com/';
// Reduced cache duration from 60 to 30 seconds for faster updates
// Webhook revalidation will still be faster, but this ensures posts appear within 30 seconds
const CACHE_DURATION = 30; // seconds

/**
 * Get the Hashnode publication host from environment variables
 */
function getHost(): string {
  // Prefer server-only env var, fall back to public env var
  const host =
    process.env.HASHNODE_PUBLICATION_HOST ||
    process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST;

  const normalizedHost = host?.trim();
  if (!normalizedHost) {
    const message =
      '[Hashnode API] Missing publication host. Set HASHNODE_PUBLICATION_HOST (server) or NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST (public).';

    // In production, fail fast so we don't silently fetch from the wrong publication
    if (process.env.NODE_ENV === 'production') {
      console.error(message);
      throw new Error(message);
    }

    // In dev/test, keep a fallback to make local bootstrapping easier
    console.warn(`${message} Falling back to mindware.hashnode.dev for development.`);
    return 'mindware.hashnode.dev';
  }
  
  // Log during build to help diagnose issues
  if (process.env.NODE_ENV !== 'development') {
    console.log(`[Hashnode API] Using publication host: ${normalizedHost}`);
  }
  
  return normalizedHost;
}

/**
 * Make a GraphQL request to Hashnode API with error handling and timeout
 */
async function makeGraphQLRequest(query: string, variables: Record<string, any>): Promise<any> {
  try {
    // Add 10 second timeout to prevent hanging during slower production builds (previously 3 seconds)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(GQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: CACHE_DURATION },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error('GraphQL Errors:', data.errors);
      throw new Error(`GraphQL errors: ${data.errors.map((e: any) => e.message).join(', ')}`);
    }

    return data.data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Hashnode API request timed out after 10 seconds');
      throw new Error('Hashnode API request timed out');
    }
    console.error('Hashnode API request failed:', error);
    throw error;
  }
}

/**
 * Fetch posts from Hashnode publication
 */
export async function fetchPosts(first: number = 10, after?: string): Promise<HashnodePost[]> {
  const host = getHost();
  
  const query = `
    query PostsByPublication($host: String!, $first: Int!, $after: String) {
      publication(host: $host) {
        posts(first: $first, after: $after) {
          edges {
            node {
              id
              title
              brief
              slug
              publishedAt
              coverImage { url }
              author { name }
              tags { name slug }
              readTimeInMinutes
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  `;

  try {
    console.log(`[Hashnode API] Fetching posts from publication: ${host}`);
    const data = await makeGraphQLRequest(query, { host, first, after });
    
    if (!data || !data.publication) {
      console.error(`[Hashnode API] No publication data returned for host: ${host}`);
      return [];
    }
    
    const edges = data.publication.posts?.edges || [];
    const posts = edges.map((e: any) => e.node);
    const pageInfo = data.publication.posts?.pageInfo;
    
    console.log(`[Hashnode API] Successfully fetched ${posts.length} posts from ${host}`);
    if (pageInfo?.hasNextPage) {
      console.log(`[Hashnode API] More posts available (hasNextPage: true, endCursor: ${pageInfo.endCursor})`);
    }
    
    // Log post dates for debugging
    if (posts.length > 0) {
      const dates = posts.map(p => p.publishedAt).filter(Boolean);
      if (dates.length > 0) {
        console.log(`[Hashnode API] Post date range: ${dates[dates.length - 1]} to ${dates[0]}`);
      }
    }
    
    return posts;
  } catch (error) {
    console.error('[Hashnode API] Failed to fetch posts:', error);
    if (error instanceof Error) {
      console.error('[Hashnode API] Error message:', error.message);
      console.error('[Hashnode API] Error stack:', error.stack);
    }
    return [];
  }
}

/**
 * Fetch a single post by slug
 */
export async function fetchPostBySlug(slug: string): Promise<HashnodePost | null> {
  const host = getHost();
  
  console.log(`[Hashnode API] Fetching post: ${slug} from ${host}`);
  
  const query = `
    query PostBySlug($host: String!, $slug: String!) {
      publication(host: $host) {
        post(slug: $slug) {
          id
          title
          brief
          slug
          publishedAt
          coverImage { url }
          author { name }
          tags { name slug }
          content {
            markdown
            html
          }
          readTimeInMinutes
        }
      }
    }
  `;

  try {
    const data = await makeGraphQLRequest(query, { host, slug });
    const post = data?.publication?.post || null;
    
    if (post) {
      console.log(`[Hashnode API] Successfully fetched post: ${slug}`);
    } else {
      console.warn(`[Hashnode API] Post not found: ${slug}`);
    }
    
    return post;
  } catch (error) {
    console.error(`[Hashnode API] Failed to fetch post "${slug}":`, error);
    return null;
  }
}

/**
 * Fetch publication information
 */
export async function fetchPublication(): Promise<HashnodePublication | null> {
  const host = getHost();
  
  const query = `
    query Publication($host: String!) {
      publication(host: $host) {
        id
        title
        displayTitle
        descriptionSEO
        url
        posts(first: 0) {
          totalDocuments
        }
        preferences {
          logo
        }
        author {
          name
          profilePicture
        }
        followersCount
        isTeam
        favicon
        ogMetaData {
          image
        }
      }
    }
  `;

  try {
    const data = await makeGraphQLRequest(query, { host });
    return data?.publication || null;
  } catch (error) {
    console.error('Failed to fetch publication:', error);
    return null;
  }
}

/**
 * Get all post slugs for static generation
 */
export async function getAllPostSlugs(): Promise<string[]> {
  const host = getHost();
  
  const query = `
    query AllPostSlugs($host: String!) {
      publication(host: $host) {
        posts(first: 50) {
          edges {
            node {
              slug
            }
          }
        }
      }
    }
  `;

  try {
    const data = await makeGraphQLRequest(query, { host });
    const edges = data?.publication?.posts?.edges || [];
    return edges.map((e: any) => e.node.slug);
  } catch (error) {
    console.error('Failed to fetch post slugs:', error);
    return [];
  }
}
