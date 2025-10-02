import BlogPageClient from './blog-client';

export const revalidate = 60;

export default async function BlogPage() {
  const GQL_ENDPOINT = 'https://gql.hashnode.com/';
  const host = process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST || 'mindware.hashnode.dev';

  // Fetch ALL posts from Hashnode (not just first 10) for proper search/filter
  const query = `
    query PostsByPublication($host: String!, $first: Int!) {
      publication(host: $host) {
        posts(first: $first) {
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
            }
          }
        }
      }
    }
  `;

  let posts: any[] = [];
  try {
    const res = await fetch(GQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { host, first: 50 } }),
      next: { revalidate: 60 },
    });
    const data = await res.json();
    const edges = data?.data?.publication?.posts?.edges || [];
    posts = edges.map((e: any) => e.node);
  } catch (error) {
    console.error('Error fetching Hashnode posts:', error);
    posts = [];
  }

  return <BlogPageClient initialPosts={posts} />;
}
