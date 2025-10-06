# Multi-Agent Development Assignments

## 🎯 Overview
This document outlines the assignment of launch issues (247-254) to two development agents for parallel development.

## 👤 Agent 1: Frontend/UI Specialist
**Focus:** User interface, API integration, accessibility, and performance optimization

### Assigned Issues:
- **Issue #247**: Contact route and Resend integration [BLOCKER]
  - **Branch**: `issue-247-contact-resend-integration`
  - **Complexity**: High
  - **Files**: `apps/site/app/api/contact/route.ts`, `apps/site/app/contact/page.tsx`
  - **Priority**: P0, Size: M, Estimate: 3 days

- **Issue #251**: Social: OG/Twitter defaults + images
  - **Branch**: `issue-251-social-og-twitter-images`
  - **Complexity**: Medium
  - **Files**: `apps/site/app/layout.tsx`, `apps/site/app/og/`, `apps/site/public/og/`
  - **Priority**: P1, Size: M, Estimate: 2 days

- **Issue #253**: A11y pass: navigation & focus states
  - **Branch**: `issue-253-a11y-navigation-focus`
  - **Complexity**: Medium
  - **Files**: `apps/site/components/navigation/`, `apps/site/components/theme-toggle.tsx`
  - **Priority**: P1, Size: M, Estimate: 3 days

- **Issue #254**: Performance: images, fonts, headers
  - **Branch**: `issue-254-performance-images-fonts-headers`
  - **Complexity**: High
  - **Files**: `apps/site/next.config.mjs`, `apps/site/app/globals.css`, `apps/site/components/`
  - **Priority**: P1, Size: L, Estimate: 4 days

## 👤 Agent 2: Infrastructure/SEO Specialist
**Focus:** Server-side rendering, SEO optimization, content management, and infrastructure

### Assigned Issues:
- **Issue #248**: Canonical host redirect (www vs apex) [BLOCKER]
  - **Branch**: `issue-248-canonical-host-redirect`
  - **Complexity**: Low
  - **Files**: `apps/site/middleware.ts`
  - **Priority**: P0, Size: S, Estimate: 2 days

- **Issue #249**: Projects page SSR + crawlability [BLOCKER]
  - **Branch**: `issue-249-projects-ssr-crawlability`
  - **Complexity**: Medium
  - **Files**: `apps/site/app/projects/page.tsx`, `apps/site/app/projects/[slug]/page.tsx`
  - **Priority**: P0, Size: M, Estimate: 3 days

- **Issue #250**: SEO: robots.ts + sitemap.ts + per-page metadata
  - **Branch**: `issue-250-seo-robots-sitemap-metadata`
  - **Complexity**: Medium
  - **Files**: `apps/site/app/robots.ts`, `apps/site/app/sitemap.ts`, `apps/site/app/layout.tsx`
  - **Priority**: P1, Size: M, Estimate: 2 days

- **Issue #252**: Content: Remove inflated metrics sitewide
  - **Branch**: `issue-252-remove-inflated-metrics`
  - **Complexity**: Low
  - **Files**: `apps/site/app/about/page.tsx`, `apps/site/app/projects/page.tsx`, `apps/site/components/`
  - **Priority**: P2, Size: S, Estimate: 1 day

## 🔄 Workflow Instructions

### For Each Agent:

1. **Start Development:**
   ```bash
   git checkout release/launch-2025-10-07
   git pull origin release/launch-2025-10-07
   git checkout <assigned-branch>
   ```

2. **Daily Sync:**
   ```bash
   git checkout release/launch-2025-10-07
   git pull origin release/launch-2025-10-07
   git checkout <your-branch>
   git merge release/launch-2025-10-07
   ```

3. **Create Pull Request:**
   ```bash
   git push origin <your-branch>
   # Create PR from your branch to release/launch-2025-10-07
   ```

## ⚠️ Conflict Prevention

### File Overlap Analysis:
- **Minimal overlap** between agents
- **Agent 1** primarily works on: API routes, components, layout
- **Agent 2** primarily works on: middleware, SEO files, content pages
- **Shared files**: `apps/site/app/layout.tsx` (both agents may touch)

### Coordination:
- **Communicate** any changes to shared files
- **Agent 1** should coordinate layout.tsx changes with Agent 2
- **Agent 2** should coordinate layout.tsx changes with Agent 1

## 📋 Success Criteria

### Agent 1 Deliverables:
- [ ] Working contact form with Resend integration
- [ ] Social media OG/Twitter card images
- [ ] Accessible navigation and focus states
- [ ] Performance optimizations (images, fonts, headers)

### Agent 2 Deliverables:
- [ ] Canonical host redirect middleware
- [ ] SSR-enabled projects page
- [ ] SEO metadata (robots.txt, sitemap.xml)
- [ ] Content cleanup (remove inflated metrics)

## 🚀 Getting Started

### **Option 1: Manual Development**
```bash
# Agent 1 Commands:
git checkout issue-247-contact-resend-integration
git checkout issue-251-social-og-twitter-images
git checkout issue-253-a11y-navigation-focus
git checkout issue-254-performance-images-fonts-headers

# Agent 2 Commands:
git checkout issue-248-canonical-host-redirect
git checkout issue-249-projects-ssr-crawlability
git checkout issue-250-seo-robots-sitemap-metadata
git checkout issue-252-remove-inflated-metrics
```

### **Option 2: E2E Automation (Recommended)**
```powershell
# Agent 1: Start continuous processing
.\scripts\continuous-issue-pipeline.ps1 -MaxIssues 4 -Agent "Agent1" -Queue "frontend" -Watch

# Agent 2: Start continuous processing  
.\scripts\continuous-issue-pipeline.ps1 -MaxIssues 4 -Agent "Agent2" -Queue "infra" -Watch

# Or process individually with full automation
.\scripts\issue-config-unified.ps1 -IssueNumber 247 -Preset frontend -AddToProject
.\scripts\create-branch-from-release.ps1 -IssueNumber 247 -BaseBranch "release/launch-2025-10-07"
.\scripts\issue-implementation.ps1 -IssueNumber 247 -Agent "Agent1"
.\scripts\pr-automation-unified.ps1 -IssueNumber 247 -Action create -BaseBranch "release/launch-2025-10-07"
```

**📋 See `prompts/multi-agent-e2e-workflow.md` for complete E2E automation details.**

## 📞 Communication

- **Daily standup**: Share progress and any blockers
- **File conflicts**: Coordinate changes to shared files
- **Integration testing**: Test together before final merge
- **Code review**: Cross-review each other's PRs

---

**Total Issues**: 8 (4 per agent)  
**Estimated Timeline**: 4-5 days  
**Release Target**: October 7, 2025
