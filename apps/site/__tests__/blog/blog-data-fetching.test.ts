/**
 * Tests for local markdown blog content loading
 */

import { getLocalBlogPosts, getLocalBlogSlugs } from '../../lib/local-blog-loader';

describe('Local Blog Content', () => {
  it('loads published blog post slugs from content/blog', () => {
    const slugs = getLocalBlogSlugs();
    expect(Array.isArray(slugs)).toBe(true);
    expect(slugs.length).toBeGreaterThan(0);
  });

  it('loads posts with required fields', () => {
    const posts = getLocalBlogPosts(5);
    expect(posts.length).toBeGreaterThan(0);
    for (const post of posts) {
      expect(post.slug).toBeTruthy();
      expect(post.title).toBeTruthy();
      expect(post.publishedAt).toBeTruthy();
    }
  });

  it('returns posts sorted newest-first', () => {
    const posts = getLocalBlogPosts(10);
    for (let i = 1; i < posts.length; i++) {
      const prev = Date.parse(posts[i - 1].publishedAt);
      const curr = Date.parse(posts[i].publishedAt);
      expect(prev).toBeGreaterThanOrEqual(curr);
    }
  });
});
