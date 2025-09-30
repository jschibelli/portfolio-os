# Issue #3: Fix Blog Page Routing and Navigation

## Priority: High
## Type: Bug
## Status: Ready
## Assignee: jschibelli
## Sprint: Current

## Description
Resolve inconsistencies between different blog page implementations and ensure proper routing.

## Current Issues
- Multiple blog page implementations exist (root vs apps/site)
- Inconsistent routing between blog listing and individual posts
- Missing proper navigation between blog pages
- SEO metadata not properly configured

## Acceptance Criteria
- [ ] Consolidate blog page implementations
- [ ] Ensure consistent routing between `/blog` and `/blog/[slug]`
- [ ] Fix navigation between blog pages
- [ ] Implement proper SEO metadata
- [ ] Add breadcrumb navigation

## Technical Details
- **Files:** `app/blog/page.tsx`, `apps/site/app/blog/page.tsx`
- **Routes:** `/blog`, `/blog/[slug]`

## Implementation Steps
1. Audit existing blog page implementations
2. Consolidate to single implementation
3. Fix routing inconsistencies
4. Implement proper SEO metadata
5. Add navigation components

## Files to Modify
- `app/blog/page.tsx` (consolidate or remove)
- `apps/site/app/blog/page.tsx` (main implementation)
- `apps/site/app/blog/[slug]/page.tsx`
- Navigation components

## SEO Improvements
- Implement proper meta tags
- Add Open Graph metadata
- Ensure proper URL structure
- Add structured data for blog posts

## Testing
- [ ] Test all blog routes
- [ ] Verify navigation works
- [ ] Check SEO metadata
- [ ] Test mobile navigation
