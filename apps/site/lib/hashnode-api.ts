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
const CACHE_DURATION = 60; // seconds

/**
 * Get the Hashnode publication host from environment variables
 */
function getHost(): string {
  const host = process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST || 'mindware.hashnode.dev';
  
  // Log during build to help diagnose issues
  if (process.env.NODE_ENV !== 'development') {
    console.log(`[Hashnode API] Using publication host: ${host}`);
  }
  
  return host;
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
        }
      }
    }
  `;

  try {
    const data = await makeGraphQLRequest(query, { host, first, after });
    const edges = data?.publication?.posts?.edges || [];
    return edges.map((e: any) => e.node);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
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
