# Hashnode Blog Integration Guide

## Overview

Portfolio OS integrates with Hashnode as the primary content source for blog posts. This guide explains how the integration works, how to configure it, and how to troubleshoot common issues.

## Architecture

### Content Flow

```
Hashnode GraphQL API → Content API Layer → Blog Pages
                ↓
         Dashboard API (Optional)
```

### Key Components

1. **Hashnode API Client** (`apps/site/lib/hashnode-api.ts`)
   - Direct GraphQL queries to Hashnode
   - Handles all blog content fetching
   - Supports posts, publication info, and metadata

2. **Content API Layer** (`apps/site/lib/content-api.ts`)
   - Unified interface for blog content
   - Automatic fallback from Dashboard API to Hashnode
   - Fast fail detection for unavailable services

3. **Blog Pages** (`apps/site/app/blog/`)
   - `/blog` - Main blog listing page
   - `/blog/[slug]` - Individual blog post pages
   - Static generation with ISR (Incremental Static Regeneration)

## Configuration

### Environment Variables

Add these to `apps/site/.env.local`:

```bash
# Hashnode Configuration (Required)
NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST=mindware.hashnode.dev
NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT=https://gql.hashnode.com

# Dashboard API Configuration (Optional - for future dashboard integration)
DASHBOARD_API_URL=http://localhost:3001
DASHBOARD_API_SECRET=your-api-secret-here
```

### Required Variables

- `NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST`: Your Hashnode publication subdomain
  - Example: `mindware.hashnode.dev` or `yourblog.hashnode.dev`
  - Get this from your Hashnode publication settings

### Optional Variables

- `DASHBOARD_API_URL`: URL of your Dashboard API (for dual-source setup)
- `DASHBOARD_API_SECRET`: Authentication token for Dashboard API

## Features

### 1. Static Site Generation (SSG)

Blog posts are pre-rendered at build time for optimal performance:

```typescript
// apps/site/app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}
```

**Benefits:**
- ⚡ Instant page loads
- 🔍 Better SEO
- 💰 Lower serverless costs

### 2. Incremental Static Regeneration (ISR)

Pages automatically revalidate every 60 seconds:

```typescript
export const revalidate = 60;
```

**Benefits:**
- 📰 Fresh content without rebuilding
- 🚀 Fast performance maintained
- ⚙️ Automatic updates

### 3. Dynamic Rendering for New Posts

New posts published after build are automatically rendered:

```typescript
export const dynamicParams = true;
```

**Benefits:**
- ✅ No 404s for new posts
- 🔄 Seamless content updates
- 📱 Works with Hashnode webhooks

### 4. Dual-Source Content Strategy

The integration supports both Hashnode and a Dashboard API:

1. **Primary**: Dashboard API (if available)
   - Custom analytics
   - Draft previews
   - Advanced features

2. **Fallback**: Hashnode API (always available)
   - Published content
   - Production reliability
   - Fast performance

## How It Works

### Blog Post Flow

1. **User visits `/blog/my-post-slug`**

2. **Next.js checks if page is pre-rendered**
   - ✅ Yes → Serve cached HTML instantly
   - ❌ No → Dynamic render (if `dynamicParams = true`)

3. **Content API fetches post**
   ```typescript
   const post = await fetchPostBySlug(slug);
   ```

4. **Fast-fail Dashboard check (2s timeout)**
   - ✅ Dashboard available → Use Dashboard API
   - ❌ Dashboard unavailable → Use Hashnode API

5. **Hashnode GraphQL query**
   ```graphql
   query PostBySlug($host: String!, $slug: String!) {
     publication(host: $host) {
       post(slug: $slug) {
         id
         title
         brief
         slug
         content { html markdown }
         # ... more fields
       }
     }
   }
   ```

6. **Page renders with post data**
   - SEO metadata
   - Open Graph tags
   - Twitter cards
   - Full content

### ISR Revalidation

Every 60 seconds, when a cached page is requested:

1. Serve cached version immediately
2. Background: Re-fetch from Hashnode
3. Update cache if content changed
4. Next request gets fresh content

## Publishing Workflow

### From Hashnode

1. **Write & publish on Hashnode**
   - Use Hashnode's editor
   - Publish when ready

2. **Content appears on your site**
   - Immediately via ISR (within 60s)
   - Or rebuild for instant update

### From Dashboard (Future)

1. **Write in Dashboard editor**
2. **Enable "Publish to Hashnode"**
3. **Dashboard syncs to Hashnode**
4. **Content appears on site**

## Troubleshooting

### 404 Errors on Blog Posts

**Symptoms:**
- Blog listing page works
- Individual posts show 404

**Solutions:**

1. **Verify Hashnode configuration**
   ```bash
   cd apps/site
   npx tsx scripts/test-hashnode-connection.ts
   ```

2. **Check environment variables**
   ```bash
   # In apps/site/.env.local
   NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST=your-blog.hashnode.dev
   ```

3. **Rebuild the site**
   ```bash
   pnpm build
   ```

4. **Check if generateStaticParams is working**
   - Look for build output: "○ /blog/[slug]"
   - Should show list of pre-rendered pages

### Slow Page Loads

**Symptoms:**
- First load is slow
- Subsequent loads are fast

**Solutions:**

1. **Dashboard API timeout**
   - If Dashboard is slow/down, increase timeout
   - Or disable Dashboard API check

2. **Hashnode API issues**
   - Check Hashnode status
   - Verify GraphQL endpoint: https://gql.hashnode.com/

3. **ISR not working**
   - Check `revalidate` setting
   - Verify build output

### Content Not Updating

**Symptoms:**
- Published new post on Hashnode
- Not showing on site

**Solutions:**

1. **Wait for ISR** (60 seconds)
   - Visit the blog listing page
   - Wait 1 minute
   - Refresh

2. **Clear Next.js cache**
   ```bash
   rm -rf apps/site/.next
   pnpm build
   ```

3. **Verify post is published on Hashnode**
   - Check https://mindware.hashnode.dev
   - Ensure post is public

4. **Trigger manual revalidation**
   - Visit: `/api/revalidate?secret=YOUR_SECRET&path=/blog`

## Testing

### Test Hashnode Connection

Run the test script to verify everything works:

```bash
cd apps/site
npx tsx scripts/test-hashnode-connection.ts
```

**Expected Output:**
```
✅ Publication found!
   Title: John Schibelli
   Total Posts: 20

✅ Found 10 posts!
   1. My First Post
      Slug: my-first-post
      URL: https://johnschibelli.dev/blog/my-first-post
```

### Manual Testing

1. **Visit blog listing**
   ```
   http://localhost:3000/blog
   ```

2. **Click on a post**
   - Should load without 404
   - Content should display

3. **Check browser DevTools**
   - Look for Content API logs
   - Verify Hashnode is being used

### Production Testing

1. **Deploy to Vercel**
2. **Check build logs**
   - Look for "Generating static pages"
   - Verify all blog slugs are listed

3. **Test on production URL**
   ```
   https://yoursite.com/blog
   https://yoursite.com/blog/your-post-slug
   ```

## Performance Optimization

### Build Time

- **Fast**: Uses ISR, not full SSG
- **Scalable**: Handles 100+ posts
- **Efficient**: Only fetches slugs at build time

### Runtime

- **< 100ms**: Cached pages (ISR)
- **< 500ms**: Dashboard API
- **< 1s**: Hashnode API
- **2s timeout**: Dashboard failover

### Caching Strategy

```typescript
// Next.js Data Cache
{
  revalidate: 60,  // 60 second cache
  tags: ['blog-posts']  // Cache invalidation
}
```

## API Reference

### Content API Functions

#### `fetchPosts(first?, after?)`
Fetch multiple posts with pagination.

```typescript
const posts = await fetchPosts(10); // Get 10 posts
```

#### `fetchPostBySlug(slug)`
Fetch a single post by slug.

```typescript
const post = await fetchPostBySlug('my-post');
```

#### `fetchPublication()`
Fetch publication metadata.

```typescript
const pub = await fetchPublication();
```

#### `getAllPostSlugs()`
Get all post slugs for static generation.

```typescript
const slugs = await getAllPostSlugs();
// ['post-1', 'post-2', ...]
```

### Hashnode GraphQL Queries

All queries are in `apps/site/lib/hashnode-api.ts`:

- `PostsByPublication` - Fetch posts list
- `PostBySlug` - Fetch single post
- `Publication` - Fetch publication info
- `AllPostSlugs` - Fetch all slugs

## Security Considerations

### Public Environment Variables

- `NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST` is public (in browser)
- This is safe - it's just your publication URL
- No API keys needed for reading public posts

### Private Environment Variables

- `DASHBOARD_API_SECRET` should never be exposed
- Only used server-side
- Rotate if compromised

## Migration Guide

### From Static JSON Files

1. Import posts to Hashnode
2. Update environment variables
3. Remove static JSON files
4. Rebuild site

### From WordPress

1. Use Hashnode's WordPress importer
2. Verify all posts imported
3. Update environment variables
4. Test thoroughly

### From Other CMS

1. Export to Markdown
2. Import to Hashnode via API
3. Update configuration
4. Test and deploy

## Best Practices

### Content Strategy

1. **Draft in Hashnode**
   - Use Hashnode's editor
   - Preview before publishing

2. **SEO Optimization**
   - Write compelling titles
   - Use cover images
   - Add meta descriptions
   - Tag posts appropriately

3. **Publishing Schedule**
   - Publish during peak hours
   - Use Hashnode's scheduling
   - Monitor ISR revalidation

### Development

1. **Local Development**
   - Use real Hashnode data
   - Test with `.env.local`
   - Never commit secrets

2. **Staging**
   - Use separate Hashnode publication
   - Test ISR behavior
   - Verify build performance

3. **Production**
   - Monitor build times
   - Set up error tracking
   - Cache invalidation strategy

## Monitoring

### Key Metrics

- **Build Time**: Should be < 2 minutes
- **Page Load**: Should be < 1 second
- **ISR Updates**: Check 60s revalidation
- **404 Rate**: Should be near 0%

### Logging

Enable detailed logs in development:

```typescript
// Look for these in console:
[Content API] Fetching post by slug: my-post
[Hashnode API] Successfully fetched post: my-post
```

### Error Tracking

Use Sentry or similar:

```typescript
try {
  const post = await fetchPostBySlug(slug);
} catch (error) {
  Sentry.captureException(error);
  throw error;
}
```

## Support

### Getting Help

1. **Check this documentation**
2. **Run test script**
3. **Check Hashnode status**
4. **Review server logs**
5. **Ask in Discord/Slack**

### Common Resources

- [Hashnode GraphQL API Docs](https://api.hashnode.com/)
- [Next.js ISR Documentation](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)
- [Portfolio OS Documentation](../README.md)

## Changelog

### 2025-10-08
- Added `generateStaticParams` for blog posts
- Implemented ISR with 60s revalidation
- Added dynamic params support
- Improved error handling and logging
- Created comprehensive documentation

### Future Enhancements

- [ ] Webhook support for instant updates
- [ ] Full Dashboard API integration
- [ ] Advanced caching strategies
- [ ] Comment system integration
- [ ] Analytics integration











