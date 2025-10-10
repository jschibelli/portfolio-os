# Social Media Sharing Configuration Guide

## Overview
This document outlines how social media metadata (Open Graph and Twitter Cards) is configured across the portfolio site for optimal sharing on LinkedIn, Facebook, Twitter, and other platforms.

## Metadata Configuration by Page Type

### 1. Homepage (`apps/site/app/layout.tsx`)
**Status**: ✅ Fully Configured

```typescript
metadata: {
  title: "John Schibelli - Senior Front-End Engineer"
  description: "Senior Front-End Engineer | React · Next.js · TypeScript..."
  openGraph: {
    type: 'website'
    image: '/assets/og.png' (1200x630px)
    url: 'https://johnschibelli.dev'
  }
}
```

### 2. Blog Listing (`apps/site/app/blog/page.tsx`)
**Status**: ✅ Newly Configured

```typescript
metadata: {
  title: 'Blog | John Schibelli'
  description: 'Unfiltered perspectives on code, creativity...'
  openGraph: {
    type: 'website'
    image: '/assets/og.png'
    url: 'https://johnschibelli.dev/blog'
  }
}
```

### 3. Blog Posts (`apps/site/app/blog/[slug]/page.tsx`)
**Status**: ✅ Newly Configured (FIXED)

**Dynamic Metadata:**
- Title: `{post.title} | John Schibelli`
- Description: From post excerpt/brief
- Image: Post cover image or fallback to `/assets/og.png`
- Type: `article` (with published date and author)
- URL: `https://johnschibelli.dev/blog/{slug}`

**Features:**
- ✅ Fetches post data at runtime
- ✅ Uses post cover image if available
- ✅ Falls back to default OG image
- ✅ Includes article metadata (author, tags, publish date)
- ✅ Error handling with fallback metadata

### 4. Project Pages (`apps/site/app/projects/[slug]/page.tsx`)
**Status**: ✅ Already Configured

**Dynamic Metadata:**
- Generates custom OG image per project
- Includes project-specific metadata
- Type: `website`

### 5. Case Studies (`apps/site/app/case-studies/[slug]/page.tsx`)
**Status**: ✅ Already Configured

**Dynamic Metadata:**
- Uses case study cover image
- Includes metrics and tags
- Type: `article`

## Open Graph Image Specifications

### Current Implementation

| Image | Size | Usage | Status |
|-------|------|-------|--------|
| `/assets/og.png` | 1200x630px | Default/Fallback | ✅ Exists |
| Post Cover Images | Variable | Blog posts (if available) | ✅ Dynamic |
| Project OG Images | 1200x630px | Project pages | ✅ Generated |

### LinkedIn Requirements (Met ✅)
- ✅ Minimum: 1200 x 627 pixels
- ✅ Recommended: 1200 x 630 pixels
- ✅ Aspect ratio: 1.91:1
- ✅ Max file size: 5MB
- ✅ Format: JPG, PNG, or GIF

## Robots & Crawler Configuration

### robots.ts (`apps/site/app/robots.ts`)
**Status**: ✅ Properly Configured

```typescript
userAgent: '*'
allow: [
  '/',
  '/blog',
  '/blog/*',
  '/projects',
  '/projects/*',
  '/case-studies',
  '/case-studies/*',
  // ... etc
]
```

**LinkedIn Crawler**: ✅ Allowed  
**Facebook Crawler**: ✅ Allowed  
**Twitter Crawler**: ✅ Allowed

**Blocked Crawlers** (for privacy):
- GPTBot, Google-Extended, ChatGPT-User
- CCBot, anthropic-ai, Claude-Web

## Testing Your Metadata

### LinkedIn Post Inspector
1. Visit: https://www.linkedin.com/post-inspector/
2. Enter URL: `https://johnschibelli.dev/blog/[your-post-slug]`
3. Click "Inspect"
4. Verify preview shows correct title, description, and image

### Facebook Sharing Debugger
1. Visit: https://developers.facebook.com/tools/debug/
2. Enter your URL
3. Click "Debug"
4. Use "Scrape Again" to clear cache if needed

### Twitter Card Validator
1. Visit: https://cards-dev.twitter.com/validator
2. Enter your URL
3. Verify card preview

### Manual Browser Testing
```html
<!-- View page source and look for these tags -->
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
<meta property="og:url" content="...">
<meta property="og:type" content="article|website">
<meta property="og:site_name" content="John Schibelli Portfolio">

<!-- For blog posts, also check -->
<meta property="article:published_time" content="...">
<meta property="article:author" content="...">
<meta property="article:tag" content="...">
```

## Troubleshooting

### Issue: LinkedIn shows old/incorrect preview
**Solutions:**
1. Use LinkedIn Post Inspector to force refresh
2. Add query parameter: `?v=2` to URL when sharing
3. Wait 7 days for cache to expire naturally

### Issue: Image not displaying
**Check:**
1. Image URL is absolute (includes domain)
2. Image is publicly accessible (not behind auth)
3. Image meets size requirements (1200x630px recommended)
4. Image file size under 5MB
5. CORS headers allow social media crawlers

### Issue: Meta tags not in HTML
**Check:**
1. Using server components (not client components with "use client")
2. Metadata export is at top level of page
3. Build was successful
4. Deployed latest changes

## Best Practices

### ✅ DO
- Use 1200x630px images for Open Graph
- Include descriptive titles (50-60 characters ideal)
- Write compelling descriptions (150-160 characters)
- Use absolute URLs for images
- Test on multiple platforms before sharing
- Keep fallback image ready (`/assets/og.png`)

### ❌ DON'T
- Use images smaller than 1200x627px
- Exceed 5MB image file size
- Use relative URLs for images
- Forget to test after deploying
- Skip Open Graph tags on important pages
- Use generic descriptions

## Quick Reference: Required Tags

### Minimum for LinkedIn
```typescript
{
  openGraph: {
    title: string,        // Required
    description: string,  // Required
    image: string,        // Required (1200x630px)
    url: string,          // Required
    type: 'website' | 'article', // Required
    siteName: string,     // Recommended
  }
}
```

### Enhanced for Articles/Blog Posts
```typescript
{
  openGraph: {
    // ... minimum tags above, plus:
    type: 'article',
    publishedTime: string,  // ISO 8601 date
    authors: string[],
    tags: string[],
  }
}
```

## Maintenance Checklist

### When Adding New Pages
- [ ] Add metadata export with Open Graph tags
- [ ] Include proper title and description
- [ ] Specify OG image (use fallback if no custom image)
- [ ] Set correct og:type (website/article)
- [ ] Add to robots.ts allow list if needed
- [ ] Test with LinkedIn Post Inspector

### When Updating Content
- [ ] Verify metadata still accurate
- [ ] Update OG image if visual refresh needed
- [ ] Test sharing preview after deployment
- [ ] Clear social media caches if needed

### Monthly Review
- [ ] Check all OG images still accessible
- [ ] Verify robots.ts configuration
- [ ] Test random sampling of pages
- [ ] Review analytics for social referrals

## Resources

- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Open Graph Protocol](https://ogp.me/)
- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)

---

**Last Updated**: October 10, 2025  
**Maintained By**: Development Team  
**Status**: ✅ All Pages Configured

