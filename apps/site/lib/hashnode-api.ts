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
  return process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST || 'mindware.hashnode.dev';
}

/**
 * Make a GraphQL request to Hashnode API with error handling
 */
async function makeGraphQLRequest(query: string, variables: Record<string, any>): Promise<any> {
  try {
    const response = await fetch(GQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: CACHE_DURATION },
    });

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
    return data?.publication?.post || null;
  } catch (error) {
    console.error(`Failed to fetch post with slug "${slug}":`, error);
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
        posts(first: 100) {
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
