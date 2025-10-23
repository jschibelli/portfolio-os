# Article Creation Testing Checklist

**Date:** October 22, 2025  
**Purpose:** Manual testing guide for Dashboard → Portfolio site article flow

---

## Prerequisites ✅

Before starting tests, ensure:

- [x] Dashboard schema validated
- [x] Public API endpoints updated
- [x] Dashboard API connection fixed
- [x] Environment template updated
- [x] All code changes committed
- [x] No linter errors

---

## Setup Required (Manual)

### Step 1: Create Environment File
Create `apps/site/.env.local`:
```env
NEXT_PUBLIC_DASHBOARD_API_URL=http://localhost:3003
DASHBOARD_API_URL=http://localhost:3003
NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST=mindware.hashnode.dev
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Step 2: Start Services
**Terminal 1:**
```bash
cd apps/dashboard
pnpm dev
```
Wait for: `Ready on http://localhost:3003`

**Terminal 2:**
```bash
cd apps/site
pnpm dev
```
Wait for: `Ready on http://localhost:3000`

### Step 3: Verify Health Check
Visit: `http://localhost:3003/api/health`  
Expected: `{"status":"ok"}`

---

## Test 1: Block Editor (Default Mode)

**URL:** `http://localhost:3003/admin/articles/new`

- [ ] Page loads without errors
- [ ] Block Editor is displayed (not TipTap/Markdown/Dual)
- [ ] Can add text block
- [ ] Can add heading (H1, H2, H3)
- [ ] Can add code block
- [ ] Can add callout (info, warning, success, error)
- [ ] Slash command (/) menu works
- [ ] Can delete blocks
- [ ] Can reorder blocks

**Expected:** All block types work smoothly

---

## Test 2: Article Metadata

**URL:** `http://localhost:3003/admin/articles/new`

- [ ] Enter title: "Test Article - E2E Flow"
- [ ] Slug auto-generates: "test-article-e2e-flow"
- [ ] Can manually edit slug
- [ ] Can add tag: "Testing"
- [ ] Can add tag: "Development"
- [ ] Can remove tag
- [ ] Can add cover image URL
- [ ] Subtitle field works (if visible)

**Expected:** All metadata fields functional

---

## Test 3: Save Draft Flow

**URL:** `http://localhost:3003/admin/articles/new`

- [ ] Fill out article (title, content, tags)
- [ ] Click "Save Draft" button
- [ ] "Last saved" timestamp appears
- [ ] Check browser console - no errors
- [ ] Check browser network tab - 200 OK from `/api/articles/save-draft`
- [ ] Verify success message/indicator
- [ ] Wait 5 seconds without editing
- [ ] Auto-save should trigger automatically

**Database Check (Optional):**
- [ ] Article exists with status='DRAFT'
- [ ] Article has visibility='PUBLIC'
- [ ] All fields saved correctly

**Expected:** Draft saves successfully

---

## Test 4: SEO Panel

**URL:** `http://localhost:3003/admin/articles/new` (existing draft or new)

- [ ] Expand "SEO Settings" section
- [ ] Fill Meta Title: "Test SEO Title"
- [ ] Fill Meta Description: "This is a test meta description for SEO"
- [ ] Fill Canonical URL: "https://example.com/original"
- [ ] Fill OG Title: "Test OG Title"
- [ ] Fill OG Description: "Open Graph description"
- [ ] Fill OG Image: "https://example.com/og-image.jpg"
- [ ] Select Twitter Card: "summary_large_image"
- [ ] Fill Twitter Title: "Test Twitter Title"
- [ ] Fill Twitter Description: "Twitter description"
- [ ] Fill Focus Keyword: "testing"
- [ ] Save draft
- [ ] Verify fields persist after refresh

**Expected:** All SEO fields save correctly

---

## Test 5: Publishing Panel

**URL:** `http://localhost:3003/admin/articles/new` (existing draft or new)

- [ ] Expand "Publishing Settings" section
- [ ] Test Status: Select "Draft"
- [ ] Test Status: Select "Published"
- [ ] Test Visibility: Select "Public"
- [ ] Test Visibility: Select "Unlisted"
- [ ] Toggle "Featured Article" ON
- [ ] Toggle "Allow Comments" OFF/ON
- [ ] Toggle "Allow Reactions" OFF/ON
- [ ] Toggle "Paywall Content" ON/OFF
- [ ] Reading time shows auto-calculated value
- [ ] Save settings
- [ ] Verify fields persist after refresh

**Expected:** All publishing options work

---

## Test 6: Publish Flow

**URL:** `http://localhost:3003/admin/articles/new` (existing draft)

- [ ] Open a saved draft article
- [ ] Ensure "Featured" is ON in Publishing panel
- [ ] Click "Publish" button
- [ ] Verify API calls in network tab:
  - POST `/api/articles/save-draft` - 200 OK
  - POST `/api/articles/publish` - 200 OK
- [ ] Verify success message/redirect
- [ ] Check browser console - no errors

**Database Check (Optional):**
- [ ] Article status='PUBLISHED'
- [ ] publishedAt timestamp is set
- [ ] featured=true

**Expected:** Article publishes successfully

---

## Test 7: Portfolio Site - Blog List

**URL:** `http://localhost:3000/blog`

- [ ] Page loads without errors
- [ ] Check browser console - should see Dashboard API calls
- [ ] Published article appears in list
- [ ] Featured article shows at top
- [ ] Article title displays correctly
- [ ] Article excerpt/brief displays
- [ ] Cover image displays (or default placeholder)
- [ ] Tags display correctly
- [ ] "Read more" or similar CTA present

**Console Check:**
- [ ] Should see: `[Content API] Using Dashboard API for posts` (or similar)
- [ ] No errors in console

**Expected:** Article appears on blog list page

---

## Test 8: Portfolio Site - Article Detail

**URL:** `http://localhost:3000/blog/test-article-e2e-flow`

- [ ] Click article from blog list OR navigate directly
- [ ] Article detail page loads
- [ ] Title displays correctly
- [ ] Cover image displays (if set)
- [ ] Author name displays
- [ ] Publish date displays
- [ ] Reading time displays
- [ ] Tags display correctly
- [ ] Article content renders fully
- [ ] Text blocks render
- [ ] Headings render with correct sizes
- [ ] Code blocks render (if used)
- [ ] Callouts render (if used)
- [ ] Images render (if used)
- [ ] No layout issues on mobile (test responsive)

**Expected:** Full article displays correctly

---

## Test 9: View Count

**URL:** `http://localhost:3000/blog/test-article-e2e-flow`

- [ ] Note current view count (if visible)
- [ ] Refresh page
- [ ] View count increments by 1
- [ ] Open in incognito window
- [ ] View count increments again

**Database Check (Optional):**
- [ ] Article.views increases with each page view

**Expected:** View count increments correctly

---

## Test 10: Edit Flow

**Dashboard URL:** `http://localhost:3003/admin/articles`

- [ ] Navigate to articles list
- [ ] Find published article
- [ ] Click "Edit" button
- [ ] Modify title to: "Test Article - E2E Flow (Edited)"
- [ ] Add new content block
- [ ] Save changes
- [ ] Verify "Last saved" updates

**Portfolio URL:** `http://localhost:3000/blog/test-article-e2e-flow`

- [ ] Wait up to 60 seconds
- [ ] Hard refresh page (Ctrl+Shift+R)
- [ ] Verify title shows "(Edited)"
- [ ] Verify new content block appears
- [ ] Check "Last updated" timestamp changed

**Expected:** Edits sync to Portfolio site

---

## Test 11: Error Scenarios

### 11.1 Validation Errors
**Dashboard:** `http://localhost:3003/admin/articles/new`

- [ ] Try to publish without title
- [ ] Should see: "Title is required" error
- [ ] Try to publish with empty content
- [ ] Should see: "Content is required" error (or publish with warning)
- [ ] Try slug with spaces: "test article"
- [ ] Should auto-convert to: "test-article"
- [ ] Try slug with uppercase: "TestArticle"
- [ ] Should auto-convert to: "testarticle"

**Expected:** Proper validation messages

### 11.2 Unpublished Access
**Portfolio:** `http://localhost:3000/blog/draft-article-slug`

- [ ] Try to access a DRAFT article directly
- [ ] Should see: 404 page or "Article not found"
- [ ] Draft should NOT be publicly accessible

**Expected:** Drafts are private

### 11.3 Dashboard API Fallback
**Setup:**
1. Stop Dashboard server (Ctrl+C in Terminal 1)

**Portfolio:** `http://localhost:3000/blog`

- [ ] Refresh blog page
- [ ] Page should still load (via Hashnode fallback)
- [ ] Hashnode articles should display
- [ ] Check console: Should see fallback message
- [ ] No critical errors

**Expected:** Graceful fallback to Hashnode

---

## Test 12: Performance & Edge Cases

### 12.1 No Cover Image
- [ ] Create article without cover image
- [ ] Publish article
- [ ] Check Portfolio site - default placeholder should show

### 12.2 No Tags
- [ ] Create article without tags
- [ ] Publish article
- [ ] Check Portfolio site - no errors, tags section hidden/empty

### 12.3 Long Title
- [ ] Create article with very long title (100+ characters)
- [ ] Check truncation/display on blog list
- [ ] Check full title on detail page

### 12.4 Special Characters in Slug
- [ ] Try title: "Test & Article #1 (2025)"
- [ ] Should auto-generate slug: "test-article-1-2025"
- [ ] Verify article accessible via slug

---

## Success Criteria

After completing all tests, verify:

✅ **Dashboard:**
- [ ] Block Editor works as default
- [ ] Save draft persists correctly
- [ ] Publish updates status
- [ ] SEO fields save properly
- [ ] Publishing options work
- [ ] No console errors

✅ **Portfolio Site:**
- [ ] Published articles appear on /blog
- [ ] Article detail pages load
- [ ] All content types render
- [ ] Images/tags/metadata display
- [ ] View counts increment
- [ ] Revalidation works (60s)

✅ **Integration:**
- [ ] Dashboard → Portfolio sync works
- [ ] Edits appear within 60 seconds
- [ ] Unpublished drafts stay private
- [ ] Dashboard API fallback works
- [ ] No critical errors anywhere

✅ **Hashnode Parity:**
- [ ] All content types supported
- [ ] SEO fields match capabilities
- [ ] Publishing options equivalent
- [ ] API format compatible

---

## Issues Found

Document any issues here:

| Test # | Issue Description | Severity | Status |
|--------|-------------------|----------|--------|
| | | | |

---

## Notes

Add any observations or feedback:

---

**Testing Date:** _________________  
**Tested By:** _________________  
**Overall Status:** ⬜ Pass / ⬜ Fail / ⬜ Partial  
**Hashnode Parity Achieved:** ⬜ Yes / ⬜ No

---

## Next Actions After Testing

If all tests pass:
1. Document any bugs in GitHub issues
2. Update user documentation
3. Plan Hashnode → Dashboard migration
4. Consider cross-platform publishing features

If tests fail:
1. Document failures in "Issues Found" section
2. Create GitHub issues with details
3. Prioritize fixes
4. Retest after fixes


