# PR CR-GPT Comments Agent Prompt

## Overview
This prompt is designed to get AI agents started on addressing CR-GPT review comments on open pull requests to drive them to merge-ready status.

## Current Status (Updated: October 6, 2025)
**Total Open PRs**: 18 | **Jason's Workload**: 6 PRs | **Chris's Workload**: 5 PRs | **Ready for Merge**: 0 PRs

## Agent Assignment Strategy

### 🔴 **Jason (Frontend & Critical Security Specialist)**
**Focus**: Frontend components, UI/UX, user workflows, analytics dashboards, user experience

#### PR #259 - SEO robots.ts + sitemap.ts + per-page metadata
- **Status**: ⚠️ UNRESOLVED CR-GPT comments in sitemap.ts
- **Agent**: Jason (Frontend Specialist)
- **Focus**: Dynamic sitemap generation, blogPages bug fix, error handling
- **Priority**: P0 - CRITICAL - Address CR-GPT comments immediately
- **Issues**: blogPages not populated, caseStudies incorrectly fetched, performance optimizations needed

#### PR #273 - A11y pass: navigation & focus states (main branch)
- **Status**: Accessibility improvements needed
- **Agent**: Jason (Frontend Specialist)
- **Focus**: Navigation accessibility, focus states, WCAG 2.1 AA compliance
- **Priority**: P1 - Frontend accessibility

#### PR #261 - A11y pass: navigation & focus states (develop branch)
- **Status**: Accessibility improvements needed
- **Agent**: Jason (Frontend Specialist)
- **Focus**: Navigation accessibility, focus states, WCAG 2.1 AA compliance
- **Priority**: P1 - Frontend accessibility

#### PR #260 - Social OG/Twitter images + Remove inflated metrics
- **Status**: ✅ COMPLETED - Dynamic OG images implemented
- **Agent**: Jason (Frontend Specialist)
- **Focus**: Social media integration, frontend assets
- **Priority**: P2 - Ready for final review and merge

#### PR #244 - Enhanced Dashboard Editor (HIGH)
- **Status**: Frontend component improvements needed
- **Agent**: Jason (Frontend Specialist)
- **Focus**: UI components, user experience, dashboard functionality
- **Priority**: P1 - Frontend development

#### PR #258 - Projects page SSR + crawlability
- **Status**: Frontend performance optimization needed
- **Agent**: Jason (Frontend Specialist)
- **Focus**: Server-side rendering, frontend performance, SEO
- **Priority**: P1 - Performance optimization

### 🟢 **Chris (Backend & Infrastructure Specialist)**
**Focus**: Backend infrastructure, AI services, queue management, PowerShell integration

#### PR #270 - Complete Backend Infrastructure Implementation
- **Status**: CRITICAL backend infrastructure
- **Agent**: Chris (Backend Specialist)
- **Focus**: GitHub utilities, automation scripts, backend infrastructure
- **Priority**: P0 - CRITICAL - Address immediately

#### PR #262 - Performance: images, fonts, headers
- **Status**: Backend performance optimizations needed
- **Agent**: Chris (Backend Specialist)
- **Focus**: Backend performance optimizations, error handling, security fixes
- **Priority**: P1 - Backend performance

#### PR #256 - Canonical host redirect middleware
- **Status**: Backend middleware optimization needed
- **Agent**: Chris (Backend Specialist)
- **Focus**: Middleware, backend services, API improvements
- **Priority**: P1 - Backend optimization

#### PR #255 - Contact route and Resend integration
- **Status**: Backend API integration needed
- **Agent**: Chris (Backend Specialist)
- **Focus**: API routes, email integration, backend services
- **Priority**: P1 - Backend API development

#### PR #243 - Unified Publishing Workflow (MEDIUM)
- **Status**: Backend automation scripts needed
- **Agent**: Chris (Backend Specialist)
- **Focus**: PowerShell scripts, automation, backend workflows
- **Priority**: P1 - Backend automation

## Agent Instructions

### 🔴 **Jason (Frontend Specialist) - PR Assignments:**

#### For PR #259 (SEO robots.ts + sitemap.ts + per-page metadata) - CRITICAL:
```
You are Jason, a Frontend & Critical Security Specialist assigned to PR #259 for CRITICAL SEO fixes.

**Your Mission**: Address UNRESOLVED CR-GPT comments in sitemap.ts focusing on:
1. Fix blogPages variable not populated (commented-out code)
2. Fix caseStudies incorrectly fetched from getAllProjects()
3. Implement proper error handling and performance optimizations
4. Add comprehensive documentation and testing

**Action Plan**:
1. Check out PR #259 branch: issue-250-seo-robots-sitemap-metadata
2. Review CR-GPT comments on sitemap.ts file
3. Fix blogPages generation with proper Hashnode API integration
4. Fix caseStudies data source and filtering
5. Add error handling, caching, and performance optimizations
6. Run quality checks and tests
7. Update project status

**Success Criteria**: All CR-GPT comments resolved, dynamic sitemap working correctly
```

#### For PR #273 & #261 (A11y pass: navigation & focus states):
```
You are Jason, a Frontend & Critical Security Specialist assigned to PRs #273 and #261 for accessibility improvements.

**Your Mission**: Implement comprehensive accessibility improvements focusing on:
1. Navigation accessibility and keyboard navigation
2. Focus state improvements and visible focus indicators
3. WCAG 2.1 AA compliance
4. ARIA roles and semantic HTML

**Action Plan**:
1. Check out PR branches: agent-3-automation-fix (PR #273) and issue-253-a11y-navigation-focus (PR #261)
2. Review accessibility requirements and current issues
3. Implement navigation accessibility improvements
4. Fix focus states and keyboard navigation
5. Run accessibility tests (axe-core, Playwright)
6. Update project status

**Success Criteria**: WCAG 2.1 AA compliance achieved, all accessibility issues resolved
```

#### For PR #260 (Social OG/Twitter images) - COMPLETED:
```
You are Jason, a Frontend & Critical Security Specialist. PR #260 is COMPLETED.

**Status**: ✅ COMPLETED - Dynamic OG images implemented for all pages
**Next Action**: Final review and merge when ready
```

#### For PR #244 (Enhanced Dashboard Editor):
```
You are Jason, a Frontend & Critical Security Specialist assigned to PR #244 for dashboard editor improvements.

**Your Mission**: Enhance dashboard editor functionality focusing on:
1. UI component improvements
2. User experience enhancements
3. Dashboard functionality and workflows

**Action Plan**:
1. Check out PR branch: issue-227
2. Review dashboard editor requirements
3. Implement UI component improvements
4. Enhance user experience and workflows
5. Run quality checks and tests
6. Update project status

**Success Criteria**: Dashboard editor enhanced, user experience improved
```

#### For PR #258 (Projects page SSR + crawlability):
```
You are Jason, a Frontend & Critical Security Specialist assigned to PR #258 for SSR improvements.

**Your Mission**: Implement server-side rendering and crawlability improvements focusing on:
1. Server-side rendering optimization
2. Frontend performance improvements
3. SEO and crawlability enhancements

**Action Plan**:
1. Check out PR branch: issue-249-projects-ssr-crawlability
2. Review SSR requirements and current implementation
3. Implement server-side rendering improvements
4. Optimize frontend performance
5. Enhance SEO and crawlability
6. Run performance tests
7. Update project status

**Success Criteria**: SSR optimized, performance improved, SEO enhanced
```

### 🟢 **Chris (Backend Specialist) - PR Assignments:**

#### For PR #270 (Complete Backend Infrastructure Implementation) - CRITICAL:
```
You are Chris, a Backend & Infrastructure Specialist assigned to PR #270 for CRITICAL backend infrastructure.

**Your Mission**: Implement comprehensive backend infrastructure improvements focusing on:
1. GitHub utilities and automation scripts
2. Backend infrastructure enhancements
3. Error handling and security improvements
4. Agent assignments documentation

**Action Plan**:
1. Check out PR branch: agent-1-automation-backend
2. Review backend infrastructure requirements
3. Enhance GitHub utilities with proper error handling
4. Create comprehensive agent assignments documentation
5. Improve PR automation scripts and workflows
6. Run quality checks and tests
7. Update project status

**Success Criteria**: Backend infrastructure enhanced, automation improved, documentation complete
```

#### For PR #262 (Performance: images, fonts, headers):
```
You are Chris, a Backend & Infrastructure Specialist assigned to PR #262 for backend performance optimization.

**Your Mission**: Implement backend performance optimizations focusing on:
1. Backend performance optimizations
2. Error handling improvements
3. Security enhancements
4. Code style and quality improvements

**Action Plan**:
1. Check out PR branch: issue-254-performance-images-fonts-headers
2. Review performance requirements and current implementation
3. Implement backend performance improvements
4. Enhance error handling and security measures
5. Run quality checks and performance tests
6. Update project status

**Success Criteria**: Backend performance optimized, all issues resolved
```

#### For PR #256 (Canonical host redirect middleware):
```
You are Chris, a Backend & Infrastructure Specialist assigned to PR #256 for middleware improvements.

**Your Mission**: Implement middleware improvements focusing on:
1. Canonical host redirect functionality
2. Backend middleware optimization
3. API improvements and security
4. Performance enhancements

**Action Plan**:
1. Check out PR branch: issue-248-canonical-host-redirect
2. Review middleware requirements and current implementation
3. Implement canonical host redirect middleware
4. Optimize backend middleware performance
5. Enhance API security and functionality
6. Run quality checks and tests
7. Update project status

**Success Criteria**: Middleware optimized, canonical redirects working, API improved
```

#### For PR #255 (Contact route and Resend integration):
```
You are Chris, a Backend & Infrastructure Specialist assigned to PR #255 for API integration.

**Your Mission**: Implement contact route and Resend email integration focusing on:
1. API route development
2. Email integration with Resend
3. Backend services optimization
4. Error handling and validation

**Action Plan**:
1. Check out PR branch: issue-247-contact-resend-integration
2. Review contact route and email integration requirements
3. Implement contact API route with proper validation
4. Integrate Resend email service
5. Optimize backend services and error handling
6. Run quality checks and tests
7. Update project status

**Success Criteria**: Contact route implemented, Resend integration working, API optimized
```

#### For PR #243 (Unified Publishing Workflow):
```
You are Chris, a Backend & Infrastructure Specialist assigned to PR #243 for workflow automation.

**Your Mission**: Implement unified publishing workflow focusing on:
1. PowerShell scripts and automation
2. Backend workflow orchestration
3. Publishing pipeline optimization
4. Error handling and monitoring

**Action Plan**:
1. Check out PR branch: issue-228
2. Review publishing workflow requirements
3. Implement PowerShell automation scripts
4. Create unified publishing workflow
5. Optimize backend workflow orchestration
6. Add error handling and monitoring
7. Run quality checks and tests
8. Update project status

**Success Criteria**: Publishing workflow unified, automation scripts working, backend optimized
```

## Automation Commands Reference

### Universal Commands for All Agents:
```powershell
# Monitor PR status
git fetch origin && git checkout develop

# Analyze CR-GPT comments  
# Review GitHub PR comments and document key issues

# Generate automated responses
# Draft responses to each comment with relevant code changes

# Run quality checks
npm run lint && npm run test

# Update documentation
# Update relevant documentation files

# Run all actions (recommended)
# Follow the complete workflow: analyze -> respond -> fix -> quality -> docs
```

### Project Board Integration:
All PRs are already added to Portfolio Site project (#20) with these default fields:
- Status: In progress
- Priority: P1 (adjust based on CR-GPT analysis)
- Size: M
- Estimate: 3
- App: Portfolio Site
- Area: Frontend
- Assignee: jschibelli

### Project Board Status Workflow:
**Issues → PRs → Review → Ready → Merge**

1. **Backlog**: Issues picked up from backlog
2. **In Progress**: When being worked on (agents actively coding)
3. **In Review**: When PR is created and sent for review
4. **Ready**: When PR is complete and ready for merge
5. **Ready for Merge**: Project board updated to "Ready for Merge" status
6. **User Responsibility**: User reviews, decides, and actually merges the PR

**Agent Responsibilities:**
- Start with PR in "Ready" status, move to "In Progress" when beginning work
- Work through the ENTIRE CR review process (address all CR-GPT comments, fix all issues, resolve conflicts)
- Stay in "In Progress" until CR review process is completely done
- Move to "Ready for Merge" ONLY when there are no more CR review comments and automation process is complete
- Report completion - PR is ready for user to merge

**User Responsibilities:**
- Review completed PRs
- Decide when to merge
- Actually merge PRs into develop

## Success Metrics
- **PR #259**: ⚠️ CRITICAL - All CR-GPT comments resolved in sitemap.ts (blogPages, caseStudies, error handling)
- **PR #273 & #261**: WCAG 2.1 AA compliance achieved, all accessibility issues resolved
- **PR #260**: ✅ COMPLETED - Quality verified, ready for merge
- **PR #244**: Dashboard editor enhanced, user experience improved
- **PR #258**: SSR optimized, performance improved, SEO enhanced
- **PR #270**: Backend infrastructure enhanced, automation improved
- **PR #262**: Backend performance optimized, all issues resolved
- **PR #256**: Middleware optimized, canonical redirects working
- **PR #255**: Contact route implemented, Resend integration working
- **PR #243**: Publishing workflow unified, automation scripts working
- All PRs moved to "Ready for Merge" status on project board ONLY after CR review process is complete
- All PRs are merge-ready (no conflicts, all checks pass, no more CR review comments)
- User can review and merge PRs when ready

## Current Priority Order
1. **P0 - CRITICAL**: PR #259 (SEO sitemap.ts CR-GPT comments)
2. **P0 - CRITICAL**: PR #270 (Backend infrastructure)
3. **P1 - HIGH**: PR #273 & #261 (Accessibility improvements)
4. **P1 - HIGH**: PR #244 (Dashboard editor)
5. **P1 - HIGH**: PR #258 (SSR improvements)
6. **P1 - HIGH**: PR #262 (Performance optimization)
7. **P1 - HIGH**: PR #256 (Middleware improvements)
8. **P1 - HIGH**: PR #255 (Contact integration)
9. **P1 - HIGH**: PR #243 (Publishing workflow)
10. **P2 - READY**: PR #260 (Social OG images - completed)

## Next Steps
1. **IMMEDIATE**: Jason should address PR #259 CR-GPT comments (CRITICAL)
2. **IMMEDIATE**: Chris should start PR #270 backend infrastructure (CRITICAL)
3. Use the automation scripts for consistent workflow
4. Update project board status as work progresses
5. Report completion and any blockers
6. Move to next available PRs once current assignments are complete
7. Focus on P0 and P1 priority items first
