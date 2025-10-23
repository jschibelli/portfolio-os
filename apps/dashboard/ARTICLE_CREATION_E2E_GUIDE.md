# Article Creation End-to-End Guide

**Date:** October 22, 2025  
**Status:** ✅ Configuration Complete - Ready for Testing

---

## Overview

This guide documents the complete article creation flow from Dashboard to Portfolio site, ensuring 100% Hashnode feature parity.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Dashboard (Port 3003)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Article Creation Flow                      │  │
│  │                                                        │  │
│  │  1. /admin/articles/new                              │  │
│  │     → Block Editor (Default)                          │  │
│  │     → TipTap/Markdown/Dual Mode (Optional)           │  │
│  │                                                        │  │
│  │  2. Save Draft                                        │  │
│  │     → POST /api/articles/save-draft                   │  │
│  │     → Database: status='DRAFT', visibility='PUBLIC'   │  │
│  │                                                        │  │
│  │  3. Publish Article                                   │  │
│  │     → POST /api/articles/publish                      │  │
│  │     → Database: status='PUBLISHED', publishedAt=now() │  │
│  │                                                        │  │
│  │  4. Public API Exposure                               │  │
│  │     → GET /api/public/posts (list all)               │  │
│  │     → GET /api/public/posts/[slug] (single)          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ▼
                    Dashboard API Client
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Portfolio Site (Port 3000)                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Content Display Flow                     │  │
│  │                                                        │  │
│  │  1. /blog (Blog List Page)                           │  │
│  │     → fetchPosts() from content-api.ts                │  │
│  │     → Tries Dashboard API first                       │  │
│  │     → Falls back to Hashnode if unavailable          │  │
│  │     → Displays featured post + grid of articles       │  │
│  │                                                        │  │
│  │  2. /blog/[slug] (Article Detail Page)               │  │
│  │     → fetchPostBySlug() from content-api.ts           │  │
│  │     → Renders full article content                    │  │
│  │     → Increments view count                           │  │
│  │     → Shows author, tags, metadata                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Recent Changes Made

### 1. Portfolio Site - Dashboard API Connection
**File:** `apps/site/lib/content-api.ts`
- ✅ Fixed `isDashboardAvailable()` to perform actual health check
- ✅ Added environment variable support: `NEXT_PUBLIC_DASHBOARD_API_URL`
- ✅ Added 1-second timeout for health check
- ✅ Graceful fallback to Hashnode when Dashboard unavailable

### 2. Dashboard API Client - Port Correction
**File:** `apps/site/lib/dashboard-api.ts`
- ✅ Changed default port from 3001 to 3003
- ✅ Added support for `NEXT_PUBLIC_DASHBOARD_API_URL` env var
- ✅ Maintained backward compatibility

### 3. Dashboard Public API - Data Transformation
**Files:**
- `apps/dashboard/app/api/public/posts/route.ts`
- `apps/dashboard/app/api/public/posts/[slug]/route.ts`

**Changes:**
- ✅ Fixed author field mapping: `author.avatar` → `author.image`
- ✅ Added empty bio field for API compatibility
- ✅ Added default values for excerpt and content
- ✅ Ensured consistent response format with DashboardPost interface

### 4. Environment Configuration
**File:** `apps/site/env.template`
- ✅ Updated Dashboard API URL to port 3003
- ✅ Added `NEXT_PUBLIC_DASHBOARD_API_URL` variable
- ✅ Added documentation about Dashboard integration

---

## Setup Instructions

### Step 1: Configure Environment Variables

Create `apps/site/.env.local` with the following:

```env
# Dashboard Integration (Primary Content Source)
NEXT_PUBLIC_DASHBOARD_API_URL=http://localhost:3003
DASHBOARD_API_URL=http://localhost:3003

# Hashnode Blog Integration (Fallback)
NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST=mindware.hashnode.dev

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Step 2: Start Both Services

**Terminal 1 - Dashboard:**
```bash
cd apps/dashboard
pnpm dev
# Runs on http://localhost:3003
```

**Terminal 2 - Portfolio Site:**
```bash
cd apps/site
pnpm dev
# Runs on http://localhost:3000
```

### Step 3: Verify Health Check

Test Dashboard API is accessible:
```powershell
Invoke-WebRequest -Uri http://localhost:3003/api/health
```

Expected response: `{"status":"ok"}`

---

## Testing Checklist

### Phase 1: Database & API ✅

- [x] Database schema has all Hashnode fields
- [ ] Public API `/api/public/posts` returns correct format
- [ ] Public API `/api/public/posts/[slug]` returns single post
- [ ] API filtering works (search, tag, featured)

### Phase 2: Dashboard Configuration ✅

- [x] `isDashboardAvailable()` performs health check
- [x] Environment variables configured
- [x] Dashboard API client uses port 3003
- [x] Data transformation matches expected format

### Phase 3: Article Editor

- [ ] Navigate to `/admin/articles/new`
- [ ] Verify Block Editor loads as default
- [ ] Test slash command (/) menu
- [ ] Add text, headings, code blocks, callouts
- [ ] Test title → slug auto-generation
- [ ] Add tags
- [ ] Add cover image URL
- [ ] Expand SEO panel, fill fields
- [ ] Expand Publishing panel, toggle features
- [ ] Click "Save Draft" - verify success
- [ ] Check database: status='DRAFT'

### Phase 4: Publish Flow

- [ ] Open saved draft
- [ ] Click "Publish" button
- [ ] Verify API calls (save-draft → publish)
- [ ] Check database: status='PUBLISHED', publishedAt set
- [ ] Verify success message/state

### Phase 5: Portfolio Site Display

- [ ] Navigate to `http://localhost:3000/blog`
- [ ] Check console logs - Dashboard API should be called
- [ ] Verify published article appears in list
- [ ] Featured articles show at top
- [ ] Cover images, titles, excerpts render
- [ ] Click on article
- [ ] Verify article detail page loads
- [ ] Check content renders correctly
- [ ] Verify author, date, tags, reading time display
- [ ] Test view count increments

### Phase 6: End-to-End Integration

**Complete Article Creation:**
1. Dashboard: Create new article "Test E2E Article"
2. Dashboard: Add content with various block types
3. Dashboard: Add tags: "Testing", "Development"
4. Dashboard: Set cover image
5. Dashboard: Enable "Featured" in Publishing panel
6. Dashboard: Save draft
7. Dashboard: Publish article
8. Portfolio: Refresh `/blog` page (wait up to 60s for revalidation)
9. Portfolio: Verify article appears at top (featured)
10. Portfolio: Click article, verify content renders
11. Portfolio: Check browser console - no errors

**Test Edit Flow:**
1. Dashboard: Edit published article
2. Dashboard: Modify title and content
3. Dashboard: Save changes
4. Portfolio: Refresh article page (wait up to 60s)
5. Portfolio: Verify changes appear

### Phase 7: Error Handling

- [ ] Try publishing without title - verify validation error
- [ ] Try invalid slug format - verify error message
- [ ] Access unpublished article on Portfolio - verify 404
- [ ] Stop Dashboard server - verify Hashnode fallback works

---

## Database Schema Reference

### Article Model Fields (Hashnode Parity)

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `contentMdx` | String | ✅ | Markdown/MDX content |
| `excerpt` | String | ❌ | Article summary/preview |
| `readingMinutes` | Int | ❌ | Auto-calculated reading time |
| `views` | Int | ✅ | View count (default: 0) |
| `featured` | Boolean | ✅ | Featured flag (default: false) |
| `visibility` | Enum | ✅ | PUBLIC/UNLISTED/PRIVATE/MEMBERS_ONLY |
| `status` | Enum | ✅ | DRAFT/SCHEDULED/PUBLISHED/ARCHIVED |
| `publishedAt` | DateTime | ❌ | Publication timestamp |
| `scheduledAt` | DateTime | ❌ | Scheduled publication time |
| `allowComments` | Boolean | ✅ | Enable comments (default: true) |
| `allowReactions` | Boolean | ✅ | Enable reactions (default: true) |

### SEO Fields (Comprehensive)

| Field | Max Length | Purpose |
|-------|------------|---------|
| `metaTitle` | 60 chars | Search results title |
| `metaDescription` | 160 chars | Search results description |
| `canonicalUrl` | - | Original source URL |
| `noindex` | Boolean | Prevent search indexing |
| `ogTitle` | 60 chars | Social media title |
| `ogDescription` | 200 chars | Social media description |
| `ogImageUrl` | - | Social media image |
| `twitterCard` | - | Twitter card type |
| `twitterTitle` | 70 chars | Twitter title override |
| `twitterDescription` | 200 chars | Twitter description |
| `focusKeyword` | - | Primary SEO keyword |
| `seoScore` | 0-100 | SEO quality score |

---

## API Response Formats

### GET /api/public/posts

```json
{
  "posts": [
    {
      "id": "cuid",
      "title": "Article Title",
      "slug": "article-slug",
      "excerpt": "Brief summary",
      "content": "Full MDX content",
      "publishedAt": "2025-10-22T12:00:00.000Z",
      "updatedAt": "2025-10-22T12:00:00.000Z",
      "readingMinutes": 5,
      "views": 42,
      "featured": true,
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "bio": "",
        "avatar": "https://..."
      },
      "cover": {
        "url": "https://...",
        "alt": "Cover alt text"
      },
      "tags": [
        {
          "id": "tag-id",
          "name": "JavaScript",
          "slug": "javascript"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### GET /api/public/posts/[slug]

```json
{
  "id": "cuid",
  "title": "Article Title",
  "slug": "article-slug",
  "excerpt": "Brief summary",
  "content": "Full MDX content",
  "publishedAt": "2025-10-22T12:00:00.000Z",
  "updatedAt": "2025-10-22T12:00:00.000Z",
  "readingMinutes": 5,
  "views": 43,
  "featured": true,
  "author": {
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "",
    "avatar": "https://..."
  },
  "cover": {
    "url": "https://...",
    "alt": "Cover alt text"
  },
  "tags": [
    {
      "id": "tag-id",
      "name": "JavaScript",
      "slug": "javascript"
    }
  ]
}
```

---

## Block Editor Reference

### Default Block Types

| Block Type | Slash Command | Purpose |
|------------|---------------|---------|
| Text | `/text` | Plain paragraph text |
| Heading 1 | `/h1` | Main heading |
| Heading 2 | `/h2` | Section heading |
| Heading 3 | `/h3` | Subsection heading |
| Code | `/code` | Code block with syntax highlighting |
| Quote | `/quote` | Blockquote |
| Bullet List | `/ul` | Unordered list |
| Ordered List | `/ol` | Numbered list |
| Callout Info | `/callout-info` | Blue info box |
| Callout Warning | `/callout-warning` | Yellow warning box |
| Callout Success | `/callout-success` | Green success box |
| Callout Error | `/callout-error` | Red error box |
| Image | `/image` | Image with URL |
| Horizontal Rule | `/hr` | Divider line |

---

## Troubleshooting

### Dashboard API Not Connecting

**Symptom:** Portfolio site falls back to Hashnode

**Solutions:**
1. Verify Dashboard is running: `http://localhost:3003`
2. Check health endpoint: `http://localhost:3003/api/health`
3. Verify `.env.local` has `NEXT_PUBLIC_DASHBOARD_API_URL=http://localhost:3003`
4. Check browser console for connection errors
5. Ensure no firewall blocking localhost:3003

### Articles Not Appearing on Portfolio Site

**Symptom:** Published articles don't show on blog page

**Solutions:**
1. Verify article status is `PUBLISHED` in database
2. Verify visibility is `PUBLIC` in database
3. Check publishedAt timestamp is set
4. Wait up to 60 seconds for revalidation
5. Hard refresh browser (Ctrl+Shift+R)
6. Check Dashboard API returns article: `http://localhost:3003/api/public/posts`

### Save Draft Fails

**Symptom:** Error when clicking "Save Draft"

**Solutions:**
1. Check title is not empty
2. Verify slug format (lowercase, hyphens only)
3. Check browser console for specific error
4. Verify database is accessible
5. Check Dashboard logs for error details

### Content Not Rendering

**Symptom:** Article displays but content is blank

**Solutions:**
1. Verify `contentMdx` field is populated in database
2. Check content serialization from blocks
3. Verify MDX/Markdown rendering on Portfolio site
4. Check for JavaScript errors in browser console
5. Test with simple content first

---

## Success Criteria

✅ **Dashboard Article Creation:**
- Block Editor loads as default
- All block types work (text, headings, code, callouts)
- Metadata fields functional (title, slug, tags, cover)
- SEO panel saves correctly
- Publishing panel options work
- Save draft persists to database
- Publish updates status and timestamp

✅ **Database Integration:**
- Articles save with correct schema
- All relations work (author, tags, cover)
- Status and visibility respected
- View count increments

✅ **Portfolio Site Display:**
- Published articles appear on `/blog`
- Individual articles load on `/blog/[slug]`
- All content types render correctly
- Images, tags, metadata display properly
- Revalidation works (60 second cache)

✅ **End-to-End Flow:**
- Article created in Dashboard appears on Portfolio site
- Changes sync within 60 seconds
- Unpublished drafts don't appear publicly
- Dashboard API fallback to Hashnode works

✅ **Hashnode Feature Parity:**
- All content types supported
- SEO fields match capabilities
- Publishing options match features
- API response format compatible

---

## Next Steps

1. **Complete Testing:** Follow testing checklist above
2. **Document Bugs:** Create issues for any problems found
3. **User Documentation:** Update user guides with Dashboard workflow
4. **Migration Strategy:** Plan Hashnode → Dashboard content migration
5. **Cross-Platform Publishing:** Implement Hashnode sync feature

---

## Related Files

**Portfolio Site:**
- `apps/site/lib/content-api.ts` - Unified content API with fallback
- `apps/site/lib/dashboard-api.ts` - Dashboard API client
- `apps/site/app/blog/page.tsx` - Blog list page
- `apps/site/app/blog/[slug]/page.tsx` - Article detail page

**Dashboard:**
- `apps/dashboard/app/admin/articles/new/page.tsx` - New article page
- `apps/dashboard/app/admin/articles/_components/ArticleEditor.tsx` - Main editor
- `apps/dashboard/app/api/articles/save-draft/route.ts` - Save draft API
- `apps/dashboard/app/api/articles/publish/route.ts` - Publish API
- `apps/dashboard/app/api/public/posts/route.ts` - Public posts list API
- `apps/dashboard/app/api/public/posts/[slug]/route.ts` - Public single post API
- `apps/dashboard/prisma/schema.prisma` - Database schema

---

**Last Updated:** October 22, 2025  
**Status:** ✅ Ready for End-to-End Testing


