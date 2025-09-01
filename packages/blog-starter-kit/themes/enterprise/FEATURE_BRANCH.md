# Feature Branch: Article Settings Drawer

**Branch:** `feature/article-settings-drawer`  
**Issue:** [#17 - Add Article Settings Drawer to Admin Dashboard](https://github.com/jschibelli/mindware-blog/issues/17)

## Overview
This branch implements an Article Settings drawer in the admin dashboard with comprehensive article management capabilities.

## Features to Implement
- [ ] Article slug management
- [ ] Tag management
- [ ] Cover image upload/selection
- [ ] Canonical URL setting
- [ ] Visibility controls (public, unlisted, private, members)
- [ ] Scheduled publishing with date/time picker
- [ ] SEO controls (noindex toggle)
- [ ] Featured article flag
- [ ] Paywall toggle
- [ ] Comments toggle

## Acceptance Criteria
- [ ] User can open side drawer from editor page
- [ ] All fields updateable without page navigation
- [ ] Changes persist to Prisma Article model
- [ ] Real-time UI updates
- [ ] Proper validation (unique slug, required fields, valid dates)

## Technical Requirements
- Side drawer component
- Form validation
- Prisma model updates
- Real-time state management
- Responsive design
