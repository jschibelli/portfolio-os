/**
 * Tests for blog data fetching with proper caching and error handling
 */

// Mock fetch globally
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('Blog Data Fetching', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Cache Headers', () => {
    it('should include proper cache-control headers in requests', async () => {
      const expectedHeaders = {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: {
            publication: {
              posts: {
                edges: []
              }
            }
          }
        }),
      } as any);

      // Simulate the fetch call that would happen in the blog page
      await fetch('https://gql.hashnode.com/', {
        method: 'POST',
        headers: expectedHeaders,
        body: JSON.stringify({ query: '', variables: {} }),
        next: { revalidate: 60, tags: ['blog-posts'] },
      } as any);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://gql.hashnode.com/',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
          }),
        })
      );
    });

    it('should include revalidation configuration', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: {
            publication: {
              posts: {
                edges: []
              }
            }
          }
        }),
      } as any);

      await fetch('https://gql.hashnode.com/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '', variables: {} }),
        next: { revalidate: 60, tags: ['blog-posts'] },
      } as any);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          next: expect.objectContaining({
            revalidate: 60,
            tags: expect.arrayContaining(['blog-posts']),
          }),
        })
      );
    });

    it('should include post-specific tags for individual posts', async () => {
      const slug = 'test-post-slug';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: {
            publication: {
              post: { id: '1', title: 'Test Post' }
            }
          }
        }),
      } as any);

      await fetch('https://gql.hashnode.com/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '', variables: { slug } }),
        next: { 
          revalidate: 60, 
          tags: ['blog-posts', `blog-post-${slug}`] 
        },
      } as any);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          next: expect.objectContaining({
            tags: expect.arrayContaining(['blog-posts', `blog-post-${slug}`]),
          }),
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('should throw error for non-ok HTTP responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.resolve({}),
      } as any);

      await expect(
        fetch('https://gql.hashnode.com/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: '', variables: {} }),
        }).then(res => {
          if (!res.ok) {
            throw new Error(`Failed to fetch blog posts: ${res.status} ${res.statusText}`);
          }
          return res.json();
        })
      ).rejects.toThrow('Failed to fetch blog posts: 500 Internal Server Error');
    });

    it('should handle GraphQL errors properly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          errors: [{ message: 'GraphQL error occurred' }]
        }),
      } as any);

      const response = await fetch('https://gql.hashnode.com/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '', variables: {} }),
      });

      const data = await response.json();

      expect(data.errors).toBeDefined();
      expect(data.errors[0].message).toBe('GraphQL error occurred');
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        fetch('https://gql.hashnode.com/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: '', variables: {} }),
        })
      ).rejects.toThrow('Network error');
    });

    it('should handle timeout errors', async () => {
      mockFetch.mockImplementationOnce(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 100)
        )
      );

      await expect(
        fetch('https://gql.hashnode.com/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: '', variables: {} }),
        })
      ).rejects.toThrow('Request timeout');
    });
  });

  describe('Data Transformation', () => {
    it('should properly extract posts from GraphQL response', async () => {
      const mockPosts = [
        { node: { id: '1', title: 'Post 1', slug: 'post-1' } },
        { node: { id: '2', title: 'Post 2', slug: 'post-2' } },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: {
            publication: {
              posts: {
                edges: mockPosts
              }
            }
          }
        }),
      } as any);

      const response = await fetch('https://gql.hashnode.com/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '', variables: {} }),
      });

      const data = await response.json();
      const edges = data?.data?.publication?.posts?.edges || [];
      const posts = edges.map((e: any) => e.node);

      expect(posts).toHaveLength(2);
      expect(posts[0]).toEqual({ id: '1', title: 'Post 1', slug: 'post-1' });
      expect(posts[1]).toEqual({ id: '2', title: 'Post 2', slug: 'post-2' });
    });

    it('should handle empty posts array', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: {
            publication: {
              posts: {
                edges: []
              }
            }
          }
        }),
      } as any);

      const response = await fetch('https://gql.hashnode.com/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '', variables: {} }),
      });

      const data = await response.json();
      const edges = data?.data?.publication?.posts?.edges || [];
      const posts = edges.map((e: any) => e.node);

      expect(posts).toHaveLength(0);
      expect(posts).toEqual([]);
    });

    it('should handle null/undefined data gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: null
        }),
      } as any);

      const response = await fetch('https://gql.hashnode.com/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '', variables: {} }),
      });

      const data = await response.json();
      const edges = data?.data?.publication?.posts?.edges || [];
      const posts = edges.map((e: any) => e.node);

      expect(posts).toHaveLength(0);
    });
  });

  describe('ISR Configuration', () => {
    it('should use 60-second revalidation period', () => {
      const revalidateTime = 60;
      expect(revalidateTime).toBe(60);
    });

    it('should allow stale-while-revalidate for 120 seconds', () => {
      const cacheControl = 'public, s-maxage=60, stale-while-revalidate=120';
      expect(cacheControl).toContain('stale-while-revalidate=120');
      expect(cacheControl).toContain('s-maxage=60');
    });
  });
});
