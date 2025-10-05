# PR CR-GPT Comments Agent Prompt

## Overview
This prompt is designed to get AI agents started on addressing CR-GPT review comments on open pull requests to drive them to merge-ready status.

## Agent Assignment Strategy

### 🔴 **Jason (Frontend & Critical Security Specialist)**
**Focus**: Frontend components, UI/UX, user workflows, analytics dashboards, user experience

#### PR #259 - SEO and code quality improvements
- **Status**: CR-GPT comments for About page refactoring
- **Agent**: Jason (Frontend Specialist)
- **Focus**: SEO improvements, metadata, client components
- **Priority**: P1 - Frontend optimization

#### PR #261 - A11y pass: navigation & focus states  
- **Status**: 4 CR-GPT comments, LOW priority (Error, Style)
- **Agent**: Jason (Frontend Specialist)
- **Focus**: Accessibility compliance, error fixes, code style
- **Priority**: P1 - Address after high priority items

#### PR #260 - Social OG/Twitter images
- **Status**: No CR-GPT comments
- **Agent**: Jason (Frontend Specialist)
- **Focus**: Social media integration, frontend assets
- **Priority**: P2 - Ready for final review and merge

#### PR #244 - Dashboard editor implementation
- **Status**: Frontend component improvements
- **Agent**: Jason (Frontend Specialist)
- **Focus**: UI components, user experience
- **Priority**: P1 - Frontend development

#### PR #258 - SSR improvements
- **Status**: Frontend performance optimization
- **Agent**: Jason (Frontend Specialist)
- **Focus**: Server-side rendering, frontend performance
- **Priority**: P1 - Performance optimization

### 🟢 **Chris (Backend & Infrastructure Specialist)**
**Focus**: Backend infrastructure, AI services, queue management, PowerShell integration

#### PR #270 - Complete Backend Infrastructure Implementation
- **Status**: CRITICAL backend infrastructure
- **Agent**: Chris (Backend Specialist)
- **Focus**: GitHub utilities, automation scripts, backend infrastructure
- **Priority**: P0 - CRITICAL - Address immediately

#### PR #262 - Performance: images, fonts, headers
- **Status**: 5 CR-GPT comments, HIGH priority (Error, Performance)
- **Agent**: Chris (Backend Specialist)
- **Focus**: Backend performance optimizations, error handling, security fixes
- **Priority**: P0 - Address immediately

#### PR #256 - Middleware improvements
- **Status**: Backend services optimization
- **Agent**: Chris (Backend Specialist)
- **Focus**: Middleware, backend services, API improvements
- **Priority**: P1 - Backend optimization

#### PR #257 - Metrics and monitoring
- **Status**: Backend analytics and monitoring
- **Agent**: Chris (Backend Specialist)
- **Focus**: Backend monitoring, metrics collection, analytics
- **Priority**: P1 - Backend monitoring

#### PR #243 - Workflow automation
- **Status**: Backend automation scripts
- **Agent**: Chris (Backend Specialist)
- **Focus**: PowerShell scripts, automation, backend workflows
- **Priority**: P1 - Backend automation

## Agent Instructions

### 🔴 **Jason (Frontend Specialist) - PR Assignments:**

#### For PR #259 (SEO and code quality improvements):
```
You are Jason, a Frontend & Critical Security Specialist assigned to PR #259 for SEO and code quality improvements.

**Your Mission**: Address CR-GPT comments focusing on:
1. About page refactoring for Next.js 13+ metadata
2. SEO improvements and metadata optimization
3. Client component separation
4. Code quality enhancements

**Action Plan**:
1. Review all CR-GPT comments on PR #259 and document key issues
2. Implement About page refactoring with proper metadata
3. Create separate client component for interactivity
4. Run quality checks and tests
5. Update project status

**Success Criteria**: SEO improvements implemented, code quality enhanced
```

#### For PR #261 (A11y pass: navigation & focus states):
```
You are Jason, a Frontend & Critical Security Specialist assigned to PR #261 for accessibility improvements.

**Your Mission**: Address 4 CR-GPT comments focusing on:
1. Navigation accessibility
2. Focus state improvements
3. Error fixes and code style
4. Accessibility compliance

**Action Plan**:
1. Review all CR-GPT comments on PR #261 and document key issues
2. Implement accessibility improvements
3. Fix navigation and focus states
4. Run accessibility tests
5. Update project status

**Success Criteria**: All accessibility issues resolved, A11y compliance achieved
```

#### For PR #260 (Social OG/Twitter images):
```
You are Jason, a Frontend & Critical Security Specialist assigned to PR #260 for social media integration.

**Your Mission**: Implement social media Open Graph and Twitter card images.

**Action Plan**:
1. Review PR requirements for social media integration
2. Implement OG image generation
3. Add Twitter card support
4. Test social media previews
5. Update project status

**Success Criteria**: Social media integration complete, OG images working
```

### 🟢 **Chris (Backend Specialist) - PR Assignments:**

#### For PR #270 (Complete Backend Infrastructure Implementation):
```
You are Chris, a Backend & Infrastructure Specialist assigned to PR #270 for CRITICAL backend infrastructure.

**Your Mission**: Implement comprehensive backend infrastructure improvements.

**Action Plan**:
1. Review all CR-GPT comments on PR #270 and document key issues
2. Enhance GitHub utilities with error handling
3. Create agent assignments documentation
4. Improve PR automation scripts
5. Update project status

**Success Criteria**: Backend infrastructure enhanced, automation improved
```

#### For PR #262 (Performance: images, fonts, headers):
```
You are Chris, a Backend & Infrastructure Specialist assigned to PR #262 for backend performance optimization.

**Your Mission**: Address 5 CR-GPT comments focusing on:
1. Backend performance optimizations
2. Error handling improvements
3. Security enhancements
4. Code style improvements

**Action Plan**:
1. Review all CR-GPT comments on PR #262 and document key issues
2. Implement backend performance improvements
3. Enhance error handling and security
4. Run quality checks and tests
5. Update project status

**Success Criteria**: Backend performance optimized, all issues resolved
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

## Success Metrics
- **PR #262**: All HIGH priority CR-GPT comments resolved
- **PR #261**: All LOW priority CR-GPT comments resolved  
- **PR #260**: Quality verified, ready for merge
- All PRs moved to "Ready for Merge" status on project board

## Next Steps
1. Agents should start with their assigned PRs immediately
2. Use the automation scripts for consistent workflow
3. Update project board status as work progresses
4. Report completion and any blockers
5. Move to next available PRs once current assignments are complete
